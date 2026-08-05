window.NEXORA_CONFIG = {
  siteUrl: 'https://print.nexorabisnis.site',
  whatsapp: '6289531036871',
  email: 'nexora.dg88@gmail.com',
  address: 'Bandung, Jawa Barat',
  mapUrl: 'https://maps.google.com/?q=Bandung%2C%20Jawa%20Barat',

  // Same-origin Vercel Function. Jika server belum dikonfigurasi atau API gagal,
  // frontend menggunakan data lokal hanya sebagai fallback teknis.
  portfolioApiUrl: '/api/public/portfolio',

  // Same-origin Vercel Function untuk Master Material & Finishing aktif.
  // Kontrak: { material_groups, finishing_groups, materials, finishings }
  materialFinishingApiUrl: '/api/public/material-finishing'
};
