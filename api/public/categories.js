/** NEXORA Public Categories API v5.8.0 */
import { getPublicMasters, handlePublicError, publicEnvelope, requireGet, setPublicHeaders } from '../_lib/public-api.js';

export default async function handler(req, res) {
  if (!requireGet(req, res)) return;
  try {
    const masters = await getPublicMasters();
    setPublicHeaders(res);
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).json(publicEnvelope({ items: masters.categories }));
  } catch (error) {
    return handlePublicError(res, error);
  }
}
