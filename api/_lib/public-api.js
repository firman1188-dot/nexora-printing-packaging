/**
 * Project  : NEXORA Printing & Packaging
 * Module   : Public Website Integration
 * File     : api/_lib/public-api.js
 * Version  : 5.8.3
 * Status   : Integration Candidate
 * Purpose  : Read-only server adapter from the public website to the existing
 *            Mobile Control Google Apps Script action API.
 * LOCKED   : Secrets stay server-side. Only allowlisted read actions are called.
 * Updated  : 2026-08-05 15:16 WIB
 */
import { randomUUID } from 'node:crypto';

const DEFAULT_TIMEOUT_MS = 25000;
const MAX_PORTFOLIO_ROWS = 500;
const GAS_PAGE_SIZE = 50;

export class PublicApiError extends Error {
  constructor(code, message, status = 500, details = null) {
    super(message);
    this.name = 'PublicApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const getEnv = (name, fallback = '') => String(process.env[name] || fallback).trim();


const requestUrl = (req) => {
  const host = String(req?.headers?.host || 'localhost');
  const protocol = String(req?.headers?.['x-forwarded-proto'] || 'https').split(',')[0].trim() || 'https';
  return new URL(String(req?.url || '/'), `${protocol}://${host}`);
};

export const getRequestQuery = (req) => {
  const values = {};
  for (const [key, value] of requestUrl(req).searchParams.entries()) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      values[key] = Array.isArray(values[key]) ? [...values[key], value] : [values[key], value];
    } else {
      values[key] = value;
    }
  }
  return values;
};

export const getRouteSlug = (req) => {
  const pathname = requestUrl(req).pathname;
  const segments = pathname.split('/').filter(Boolean);
  const last = segments.at(-1) || '';
  return decodeURIComponent(last);
};

const requireServerConfig = () => {
  const config = {
    gasUrl: getEnv('GAS_WEB_APP_URL'),
    gasSecret: getEnv('GAS_SHARED_SECRET'),
    clientId: getEnv('NEXORA_CLIENT_ID', 'NEXORA-PRINT-001'),
    environment: getEnv('NEXORA_ENVIRONMENT', 'preview'),
    readerRole: getEnv('NEXORA_PUBLIC_READER_ROLE', 'OWNER'),
    readerUserId: getEnv('NEXORA_PUBLIC_READER_USER_ID', 'WEBSITE_PUBLIC')
  };

  if (!config.gasUrl || !config.gasSecret) {
    throw new PublicApiError(
      'PUBLIC_API_NOT_CONFIGURED',
      'Integrasi Mobile Control belum dikonfigurasi pada environment Vercel.',
      503
    );
  }
  return config;
};

const parseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    throw new PublicApiError('BACKEND_INVALID_JSON', 'Backend mengembalikan respons yang tidak valid.', 502);
  }
};

export const callGasReadAction = async (action, payload = {}) => {
  const allowed = new Set(['GET_PORTFOLIO_MASTERS', 'LIST_PORTFOLIOS_PAGE', 'GET_PORTFOLIO']);
  if (!allowed.has(action)) {
    throw new PublicApiError('ACTION_NOT_ALLOWED', 'Action backend tidak diizinkan untuk API publik.', 403);
  }

  const config = requireServerConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(getEnv('GAS_REQUEST_TIMEOUT_MS', DEFAULT_TIMEOUT_MS)));

  try {
    const response = await fetch(config.gasUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action,
        requestId: randomUUID(),
        payload,
        apiSecret: config.gasSecret,
        clientId: config.clientId,
        environment: config.environment,
        userId: config.readerUserId,
        role: config.readerRole
      }),
      signal: controller.signal
    });

    const raw = await response.text();
    const envelope = parseJson(raw);

    if (!response.ok || envelope?.success === false) {
      const backendError = envelope?.error || {};
      throw new PublicApiError(
        String(backendError.code || `BACKEND_HTTP_${response.status}`),
        String(backendError.message || 'Backend Mobile Control gagal memproses permintaan.'),
        response.status >= 400 ? response.status : 502,
        backendError.details || null
      );
    }

    return envelope?.data ?? envelope;
  } catch (error) {
    if (error instanceof PublicApiError) throw error;
    if (error?.name === 'AbortError') {
      throw new PublicApiError('BACKEND_TIMEOUT', 'Backend Mobile Control tidak merespons tepat waktu.', 504);
    }
    throw new PublicApiError('BACKEND_UNREACHABLE', 'Backend Mobile Control tidak dapat dihubungi.', 502);
  } finally {
    clearTimeout(timeout);
  }
};

const asArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === '') return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
};

const num = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const bool = (value) => value === true || String(value).toLowerCase() === 'true' || Number(value) === 1;

const categoryIcon = (value = '') => {
  const key = String(value).toLowerCase();
  if (key.includes('paper-bag')) return 'bag';
  if (key.includes('label') || key.includes('sticker')) return 'label';
  if (key.includes('commercial') || key.includes('printing')) return 'promo';
  if (key.includes('custom')) return 'custom';
  return 'box';
};

export const mapCategory = (row = {}) => ({
  category_id: String(row.category_id || row.id || ''),
  category_code: String(row.category_code || row.code || ''),
  category_name: String(row.category_name || row.name || ''),
  category_slug: String(row.category_slug || row.slug || ''),
  description: String(row.description || ''),
  icon: categoryIcon(row.category_slug || row.slug || row.category_code || row.code || row.name),
  status: bool(row.active ?? true) ? 'ACTIVE' : 'INACTIVE',
  display_order: num(row.display_order ?? row.sort_order, 9999)
});

export const mapMaterial = (row = {}) => ({
  material_id: String(row.material_id || row.id || ''),
  material_code: String(row.material_code || row.code || ''),
  material_name: String(row.material_name || row.name || ''),
  material_slug: String(row.material_slug || row.slug || ''),
  description: String(row.description || ''),
  short_description: String(row.short_description || row.description || ''),
  image_url: String(row.image_url || ''),
  thumbnail_url: String(row.thumbnail_url || row.image_url || ''),
  preview_image: String(row.image_url || row.thumbnail_url || ''),
  image_alt_text: String(row.image_alt_text || row.name || ''),
  active: bool(row.active ?? true),
  status: bool(row.active ?? true) ? 'ACTIVE' : 'INACTIVE',
  display_order: num(row.display_order ?? row.sort_order, 9999)
});

export const mapFinishing = (row = {}) => ({
  finishing_id: String(row.finishing_id || row.id || ''),
  finishing_code: String(row.finishing_code || row.code || ''),
  finishing_name: String(row.finishing_name || row.name || ''),
  finishing_slug: String(row.finishing_slug || row.slug || ''),
  description: String(row.description || ''),
  short_description: String(row.short_description || row.description || ''),
  effect: String(row.effect || row.description || ''),
  image_url: String(row.image_url || ''),
  thumbnail_url: String(row.thumbnail_url || row.image_url || ''),
  preview_image: String(row.image_url || row.thumbnail_url || ''),
  image_alt_text: String(row.image_alt_text || row.name || ''),
  active: bool(row.active ?? true),
  status: bool(row.active ?? true) ? 'ACTIVE' : 'INACTIVE',
  display_order: num(row.display_order ?? row.sort_order, 9999)
});

const masterIndex = (items) => Object.fromEntries(items.map((item) => [String(item.id || item.material_id || item.finishing_id || item.category_id), item]));

export const mapPortfolio = (row = {}, masters = {}) => {
  const categories = masterIndex(masters.categories || []);
  const materials = masterIndex(masters.materials || []);
  const finishings = masterIndex(masters.finishings || []);
  const materialIds = asArray(row.material_ids).map(String);
  const finishingIds = asArray(row.finishing_ids).map(String);
  const category = categories[String(row.category_id)] || {};
  const media = asArray(row.media).map((item) => ({
    media_id: String(item.media_id || ''),
    media_role: String(item.media_role || 'GALLERY'),
    display_url: String(item.display_url || item.public_url || ''),
    thumbnail_url: String(item.thumbnail_url || item.display_url || item.public_url || ''),
    alt_text: String(item.alt_text || row.title || ''),
    sort_order: num(item.sort_order)
  }));
  const coverMedia = media.find((item) => item.media_role === 'COVER');
  const galleryMedia = media.filter((item) => item.media_role === 'GALLERY').sort((a, b) => a.sort_order - b.sort_order);
  const coverImage = String(coverMedia?.display_url || row.cover_image || '');
  const galleryImages = galleryMedia.length
    ? galleryMedia.map((item) => item.display_url).filter(Boolean)
    : asArray(row.gallery_images).map(String).filter(Boolean);

  return {
    portfolio_id: String(row.portfolio_id || ''),
    title: String(row.title || ''),
    slug: String(row.slug || ''),
    category_id: String(row.category_id || ''),
    category_name: String(row.category_name || category.name || category.category_name || ''),
    cover_image: coverImage,
    gallery_images: galleryImages,
    image_alt_text: String(coverMedia?.alt_text || row.image_alt_text || row.title || ''),
    description: String(row.description || ''),
    material_ids: materialIds,
    materials: materialIds.map((id) => materials[id]).filter(Boolean),
    size: typeof row.size === 'object' && row.size ? row.size : String(row.size || ''),
    printing_method: String(row.printing_method || ''),
    finishing_ids: finishingIds,
    finishings: finishingIds.map((id) => finishings[id]).filter(Boolean),
    production_quantity: num(row.production_quantity),
    production_unit: String(row.production_unit || ''),
    additional_specifications: asArray(row.additional_specifications).map((item, index) => ({
      name: String(item?.name || ''),
      value: String(item?.value || ''),
      display_order: num(item?.display_order, index + 1)
    })).filter((item) => item.name || item.value),
    status: String(row.status || 'DRAFT').toUpperCase(),
    display_order: num(row.display_order, 9999),
    created_at: String(row.created_at || ''),
    updated_at: String(row.updated_at || ''),
    media
  };
};

export const getPublicMasters = async () => {
  const raw = await callGasReadAction('GET_PORTFOLIO_MASTERS', {});
  const categories = asArray(raw?.categories).map(mapCategory).filter((item) => item.status === 'ACTIVE' && item.category_id);
  const materials = asArray(raw?.materials).map(mapMaterial).filter((item) => item.status === 'ACTIVE' && item.material_id);
  const finishings = asArray(raw?.finishings).map(mapFinishing).filter((item) => item.status === 'ACTIVE' && item.finishing_id);
  return { categories, materials, finishings };
};

export const getAllActivePortfolios = async (masters) => {
  const rows = [];
  let offset = 0;
  let pageCount = 0;

  while (rows.length < MAX_PORTFOLIO_ROWS && pageCount < 20) {
    const page = await callGasReadAction('LIST_PORTFOLIOS_PAGE', {
      status: 'ACTIVE',
      offset,
      limit: GAS_PAGE_SIZE
    });
    const items = asArray(page?.items);
    rows.push(...items);
    pageCount += 1;

    if (!page?.hasMore || items.length === 0) break;
    const nextOffset = num(page?.nextOffset, offset + items.length);
    if (nextOffset <= offset) break;
    offset = nextOffset;
  }

  return rows
    .map((row) => mapPortfolio(row, masters))
    .filter((item) => item.status === 'ACTIVE')
    .sort((a, b) => a.display_order - b.display_order || String(b.updated_at).localeCompare(String(a.updated_at)));
};

const queryValues = (value) => {
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((item) => String(item || '').split(',')).map((item) => item.trim()).filter(Boolean);
};

export const filterPortfolios = (items, query = {}) => {
  const categories = queryValues(query.category_id);
  const materials = queryValues(query.material_id);
  const finishings = queryValues(query.finishing_id);
  const term = String(query.q || query.query || '').trim().toLowerCase();

  return items.filter((item) => {
    if (categories.length && !categories.includes(item.category_id)) return false;
    if (materials.length && !materials.every((id) => item.material_ids.includes(id))) return false;
    if (finishings.length && !finishings.every((id) => item.finishing_ids.includes(id))) return false;
    if (term && !`${item.title} ${item.slug} ${item.description}`.toLowerCase().includes(term)) return false;
    return true;
  });
};

export const paginate = (items, query = {}, defaultLimit = 500) => {
  const offset = Math.max(0, num(query.offset, 0));
  const requestedLimit = num(query.limit, defaultLimit);
  const limit = Math.max(1, Math.min(500, requestedLimit));
  const pageItems = items.slice(offset, offset + limit);
  const nextOffset = offset + pageItems.length;
  return {
    items: pageItems,
    pagination: {
      offset,
      limit,
      total: items.length,
      has_more: nextOffset < items.length,
      next_offset: nextOffset < items.length ? nextOffset : null
    }
  };
};

export const getPortfolioBySlug = async (slug, masters) => {
  const items = await getAllActivePortfolios(masters);
  const summary = items.find((item) => item.slug === String(slug || ''));
  if (!summary) throw new PublicApiError('PORTFOLIO_NOT_FOUND', 'Portofolio tidak ditemukan.', 404);

  const detailRaw = await callGasReadAction('GET_PORTFOLIO', { portfolio_id: summary.portfolio_id });
  const detail = mapPortfolio(detailRaw, masters);
  if (detail.status !== 'ACTIVE') throw new PublicApiError('PORTFOLIO_NOT_FOUND', 'Portofolio tidak ditemukan.', 404);
  return detail;
};

export const publicEnvelope = (data) => ({
  success: true,
  data,
  error: null,
  timestamp: new Date().toISOString(),
  version: '5.8.3'
});

export const errorEnvelope = (error) => ({
  success: false,
  data: null,
  error: {
    code: String(error?.code || 'PUBLIC_API_ERROR'),
    message: String(error?.message || 'Terjadi kesalahan pada API publik.'),
    ...(error?.details ? { details: error.details } : {})
  },
  timestamp: new Date().toISOString(),
  version: '5.8.3'
});

export const setPublicHeaders = (res, options = {}) => {
  const maxAge = Number(options.maxAge ?? getEnv('PUBLIC_API_S_MAXAGE', '60'));
  const stale = Number(options.stale ?? getEnv('PUBLIC_API_STALE_WHILE_REVALIDATE', '300'));
  res.setHeader('Cache-Control', `public, s-maxage=${Math.max(0, maxAge)}, stale-while-revalidate=${Math.max(0, stale)}`);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-NEXORA-Data-Source', 'mobile-control-v1.6.3');
};

export const handlePublicError = (res, error) => {
  const status = Number(error?.status || 500);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(status).json(errorEnvelope(error));
};

export const requireGet = (req, res) => {
  if (req.method === 'GET' || req.method === 'HEAD') return true;
  res.setHeader('Allow', 'GET, HEAD');
  res.status(405).json(errorEnvelope(new PublicApiError('METHOD_NOT_ALLOWED', 'Method tidak diizinkan.', 405)));
  return false;
};
