/** NEXORA Public Portfolio Detail API v5.8.3 */
import {
  getPortfolioBySlug,
  getPublicMasters,
  getRouteSlug,
  handlePublicError,
  publicEnvelope,
  requireGet,
  setPublicHeaders
} from '../../_lib/public-api.js';

export default async function handler(req, res) {
  if (!requireGet(req, res)) return;
  try {
    const masters = await getPublicMasters();
    const item = await getPortfolioBySlug(getRouteSlug(req), masters);
    setPublicHeaders(res);
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).json(publicEnvelope(item));
  } catch (error) {
    return handlePublicError(res, error);
  }
}
