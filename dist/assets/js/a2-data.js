/* NEXORA Print v6 — pemuat data.
   Semua kategori, produk, material, dan finishing dibaca dari API publik (bersumber dari Agent Project Finance).
   Jika API gagal, data lokal (portfolio-data.js / material-finishing-data.js) dipakai sebagai cadangan teknis. */
/* Siklus hidup halaman: timer & pendengar milik satu halaman dilepas saat isi halaman diganti. */
window.NXLife = window.NXLife || {
  fns: [],
  add(fn) { this.fns.push(fn); },
  on(target, type, fn, opts) { target.addEventListener(type, fn, opts); this.fns.push(() => target.removeEventListener(type, fn, opts)); },
  run() { this.fns.splice(0).forEach((f) => { try { f(); } catch { /* abaikan */ } }); }
};

(() => {
  const cfg = window.NEXORA_CONFIG || {};
  const fallbackImage = '/assets/images/material-finishing/sample-fallback.svg';
  const fmt = (n) => new Intl.NumberFormat('id-ID').format(Number(n));

  const getJson = async (url) => {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json?.data || json;
  };

  /* ---------- Portofolio ---------- */
  let catalogPromise;
  const normalizeCatalog = (src) => {
    const categories = (src.categories || src.portfolio_categories || []).map((c) => ({ id: c.category_id, name: c.category_name, slug: c.category_slug || c.category_id }));
    const mats = src.materials || [], fins = src.finishings || [];
    const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
    const matName = Object.fromEntries(mats.map((m) => [m.material_id, m.material_name]));
    const finName = Object.fromEntries(fins.map((m) => [m.finishing_id, m.finishing_name]));
    const items = (src.portfolio_items || src.items || src.portfolios || [])
      .filter((i) => String(i.status || 'ACTIVE').toUpperCase() === 'ACTIVE')
      .sort((a, b) => Number(a.display_order || 9999) - Number(b.display_order || 9999))
      .map((i) => {
        const cat = catById[i.category_id] || { name: i.category_name || 'Lainnya', slug: '' };
        const size = i.size && typeof i.size === 'object' ? (i.size.display || '') : String(i.size || '');
        const imgs = [...new Set([i.cover_image, ...(i.gallery_images || [])].filter(Boolean))];
        return {
          id: i.portfolio_id, slug: i.slug || i.portfolio_id, t: i.title || '-', cid: i.category_id, c: cat.name, cslug: cat.slug,
          mids: i.material_ids || [], fids: i.finishing_ids || [],
          m: (i.material_ids || []).map((id) => matName[id]).filter(Boolean).join(', '),
          f: (i.finishing_ids || []).map((id) => finName[id]).filter(Boolean).join(', '),
          s: size, p: i.printing_method || '',
          q: i.production_quantity ? `${fmt(i.production_quantity)} ${i.production_unit || ''}`.trim() : '',
          desc: i.description || '', extra: (i.additional_specifications || []).slice().sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0)),
          imgs: imgs.length ? imgs : [fallbackImage]
        };
      });
    return { categories, items, materials: mats, finishings: fins };
  };
  const catalog = () => {
    if (!catalogPromise) {
      catalogPromise = (async () => {
        if (cfg.portfolioApiUrl) {
          try { return normalizeCatalog(await getJson(cfg.portfolioApiUrl)); }
          catch (e) { console.warn('Portfolio API gagal, memakai data lokal.', e); }
        }
        return normalizeCatalog(window.NEXORA_PORTFOLIO_DATA || {});
      })();
    }
    return catalogPromise;
  };

  /* ---------- Material & Finishing ---------- */
  const heurMat = (n) => /art paper|hvs|book paper|fancy|linen/i.test(n) ? 'Kertas Cetak' : /vinyl|sticker|chromo/i.test(n) ? 'Sticker & Label' : /pouch|poach|pet\/|plastik|film/i.test(n) ? 'Bahan Lainnya' : 'Board & Packaging';
  const heurFin = (n) => /laminasi|varnish|coating/i.test(n) ? 'Laminasi & Coating' : /uv|emboss|deboss/i.test(n) ? 'Efek & Tekstur' : /foil|hot/i.test(n) ? 'Foil & Kilap' : /cut|potong|die/i.test(n) ? 'Potong & Bentuk' : /bind|jilid|wiro/i.test(n) ? 'Binding' : 'Lainnya';
  const key = (s) => String(s || '').trim().toLowerCase();
  let mfPromise;
  const mf = () => {
    if (!mfPromise) {
      mfPromise = (async () => {
        const [cat, local] = [await catalog(), window.NEXORA_MATERIAL_FINISHING_DATA || { materials: [], finishings: [], material_groups: [], finishing_groups: [] }];
        let api = null;
        if (cfg.materialFinishingApiUrl) {
          try { api = await getJson(cfg.materialFinishingApiUrl); } catch (e) { console.warn('Master Material & Finishing API gagal, memakai data lokal.', e); }
        }
        const src = api && ((api.materials || []).length || (api.finishings || []).length) ? api : local;
        const groupName = (list, id) => (list || []).find((g) => g.group_id === id)?.group_name || '';
        const findLocal = (items, idK, slugK, nameK, x) => items.find((l) => (x[idK] && l[idK] === x[idK]) || (x[slugK] && l[slugK] === x[slugK]) || key(l[nameK]) === key(x[nameK]));
        const usedBy = (field, id) => cat.items.filter((p) => p[field].includes(id));
        const M = (src.materials || []).filter((x) => String(x.status || 'ACTIVE').toUpperCase() === 'ACTIVE').map((x) => {
          const l = findLocal(local.materials || [], 'material_id', 'material_slug', 'material_name', x) || {};
          const own = x.image_url || x.preview_image || '';
          const gid = x.material_group || l.material_group;
          return { id: x.material_id, slug: x.material_slug || x.material_id, n: x.material_name, code: x.material_code || '', d: x.description || x.short_description || l.short_description || '',
            g: groupName(src.material_groups, gid) || groupName(local.material_groups, gid) || heurMat(x.material_name),
            img: own || l.preview_image || '', real: !!own && own !== l.preview_image, use: usedBy('mids', x.material_id), order: Number(x.display_order ?? 9999) };
        }).sort((a, b) => a.order - b.order);
        const F = (src.finishings || []).filter((x) => String(x.status || 'ACTIVE').toUpperCase() === 'ACTIVE').map((x) => {
          const l = findLocal(local.finishings || [], 'finishing_id', 'finishing_slug', 'finishing_name', x) || {};
          const own = x.image_url || x.preview_image || '';
          const gid = x.finishing_group || l.finishing_group;
          return { id: x.finishing_id, slug: x.finishing_slug || x.finishing_id, n: x.finishing_name, code: x.finishing_code || '', d: x.description || x.effect || l.short_description || '',
            g: groupName(src.finishing_groups, gid) || groupName(local.finishing_groups, gid) || heurFin(x.finishing_name),
            img: own || l.preview_image || '', real: !!own && own !== l.preview_image, use: usedBy('fids', x.finishing_id), order: Number(x.display_order ?? 9999) };
        }).sort((a, b) => a.order - b.order);
        return { M, F };
      })();
    }
    return mfPromise;
  };

  window.NX = { cfg, catalog, mf, fmt, fallbackImage };
})();
