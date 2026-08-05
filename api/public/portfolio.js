/** NEXORA Public Portfolio API v5.8.1 */
import {
  filterPortfolios,
  getAllActivePortfolios,
  getPublicMasters,
  getRequestQuery,
  handlePublicError,
  paginate,
  publicEnvelope,
  requireGet,
  setPublicHeaders
} from '../_lib/public-api.js';

export default async function handler(req, res) {
  if (!requireGet(req, res)) return;
  try {
    const query = getRequestQuery(req);
    const masters = await getPublicMasters();
    const allItems = await getAllActivePortfolios(masters);
    const filtered = filterPortfolios(allItems, query);
    const page = paginate(filtered, query, 500);
    setPublicHeaders(res);
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).json(publicEnvelope({
      categories: masters.categories,
      materials: masters.materials,
      finishings: masters.finishings,
      portfolio_items: page.items,
      items: page.items,
      pagination: page.pagination
    }));
  } catch (error) {
    return handlePublicError(res, error);
  }
}
