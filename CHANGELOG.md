# Changelog

## v5.8.1 — Production Readiness & Shared Header
- Menyamakan markup, tinggi, posisi logo, lebar container, navigasi, tombol, sticky behavior, dan hamburger header pada seluruh halaman.
- Menghapus geometri header khusus Homepage yang menyebabkan posisi berbeda dari Portofolio dan Material & Finishing.
- Mengganti akses `req.query` pada API publik dengan parser WHATWG `URL` untuk menghindari legacy `url.parse()` deprecation warning.
- Menaikkan default timeout Google Apps Script dari 15 detik menjadi 25 detik untuk mengurangi cold-start timeout.
- Menambahkan verifikasi production readiness pada rangkaian QA.
- Mempertahankan seluruh integrasi Mobile Control v1.6.3, filter data aktif, dan keamanan secret server-side.

## v5.7.2 — Responsive Refinement
- Nomor WhatsApp di halaman Kontak kini mengikuti `site-config.js`, termasuk teks yang tampil.
- Menu mobile diubah dari fullscreen menjadi dropdown card compact.
- Homepage mobile disusun vertikal agar teks dan gambar tidak bertabrakan.
- Tombol aksi detail Material & Finishing dikunci di bawah; area informasi scroll internal.
- Skala desktop homepage, Portofolio, dan Material & Finishing dibuat lebih proporsional.

## v5.6.0 — Final Full Source

- mempertahankan homepage C1 yang sudah disetujui;
- menghapus menu dan route Produk secara permanen;
- memperbarui Portofolio menjadi 12 card desktop (4 × 3);
- mengunci tinggi panel detail Portofolio dan posisi dua CTA di bawah;
- membuat label filter Portofolio regular agar ikon menjadi fokus utama;
- membangun Digital Sample Library Material & Finishing sesuai visual final;
- menambahkan 12 master material dan 12 master finishing lengkap;
- menghubungkan Material/Finishing ke Portofolio melalui ID master;
- menambahkan mode Material/Finishing tanpa reload halaman;
- menambahkan filter kelompok, pagination, preview, spesifikasi, karakteristik, rekomendasi penggunaan, catatan, dan hasil produksi terkait;
- menambahkan layout mobile khusus dengan grid 2 × 2 dan detail fullscreen;
- menambahkan endpoint opsional `materialFinishingApiUrl`;
- menambahkan verifikasi kontrak Material & Finishing;
- menghapus file patch lama dari paket full source.

## 5.8.0 — Mobile Control Public Read Integration

- Added same-origin Vercel Functions for public Portfolio, Category, Material, and Finishing reads.
- Added a strict read-action allowlist for existing Mobile Control v1.6.3 GAS actions.
- Kept GAS URL and shared secret server-side through Vercel Environment Variables.
- Connected website configuration to `/api/public/portfolio` and `/api/public/material-finishing`.
- Added Mobile Control master data merging with safe local enrichment.
- Added image fallback for master data without reference images.
- Added integration QA verification and deployment documentation.
