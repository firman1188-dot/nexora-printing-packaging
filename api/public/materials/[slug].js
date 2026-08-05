/** NEXORA Public Material Detail API v5.8.0 */
import {
  getAllActivePortfolios,
  getPublicMasters,
  handlePublicError,
  PublicApiError,
  publicEnvelope,
  requireGet,
  setPublicHeaders
} from '../../_lib/public-api.js';

export default async function handler(req, res) {
  if (!requireGet(req, res)) return;
  try {
    const masters = await getPublicMasters();
    const item = masters.materials.find((entry) => entry.material_slug === String(req.query?.slug || ''));
    if (!item) throw new PublicApiError('MATERIAL_NOT_FOUND', 'Material tidak ditemukan.', 404);
    const portfolios = (await getAllActivePortfolios(masters)).filter((portfolio) => portfolio.material_ids.includes(item.material_id));
    setPublicHeaders(res);
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).json(publicEnvelope({ ...item, related_portfolios: portfolios }));
  } catch (error) {
    return handlePublicError(res, error);
  }
}
