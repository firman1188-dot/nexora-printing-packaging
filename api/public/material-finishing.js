/** NEXORA Public Material & Finishing API v5.8.2 */
import { getPublicMasters, handlePublicError, publicEnvelope, requireGet, setPublicHeaders } from '../_lib/public-api.js';

const materialGroups = [
  { group_id: 'all', group_name: 'Semua', icon: 'grid' },
  { group_id: 'paper', group_name: 'Kertas Cetak', icon: 'paper' },
  { group_id: 'board', group_name: 'Board & Packaging', icon: 'board' },
  { group_id: 'sticker', group_name: 'Sticker & Label', icon: 'label-stack' },
  { group_id: 'special', group_name: 'Kertas Khusus', icon: 'diamond' },
  { group_id: 'other', group_name: 'Bahan Lainnya', icon: 'circle-dot' }
];

const finishingGroups = [
  { group_id: 'all', group_name: 'Semua', icon: 'grid' },
  { group_id: 'lamination', group_name: 'Laminasi & Coating', icon: 'layers' },
  { group_id: 'foil', group_name: 'Foil & Kilap', icon: 'sparkles' },
  { group_id: 'texture', group_name: 'Tekstur & Relief', icon: 'texture' },
  { group_id: 'cut', group_name: 'Potong & Bentuk', icon: 'scissors' },
  { group_id: 'binding', group_name: 'Binding', icon: 'binding' },
  { group_id: 'other', group_name: 'Lainnya', icon: 'circle-dot' }
];

export default async function handler(req, res) {
  if (!requireGet(req, res)) return;
  try {
    const masters = await getPublicMasters();
    setPublicHeaders(res);
    if (req.method === 'HEAD') return res.status(200).end();
    return res.status(200).json(publicEnvelope({
      material_groups: materialGroups,
      finishing_groups: finishingGroups,
      materials: masters.materials,
      finishings: masters.finishings
    }));
  } catch (error) {
    return handlePublicError(res, error);
  }
}
