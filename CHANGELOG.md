# NEXORA Printing & Packaging — Changelog

## v5.8.7 — Material & Finishing Render Restoration

- Memaksa asset browser memakai versi baru `5.8.7` agar JavaScript lama tidak tersimpan dari Preview sebelumnya.
- Menambahkan hard data guard: bila respons API tidak memiliki item aktif, katalog lokal resmi tetap dipakai.
- Menormalkan status `ACTIVE`, `TRUE`, boolean, dan nilai aktif lainnya.
- Menjaga card library dan panel detail selalu visible selama sinkronisasi.
- Mempertahankan tab aktif Material/Finishing berwarna oranye.

# v5.8.5 — Restore Material & Finishing View + Orange Active Tab

- Mengembalikan komposisi Material & Finishing yang telah disetujui pada desktop dan mobile.
- Data enrichment lokal dirender segera sehingga card, detail panel, dan trust strip tidak menghilang saat sinkronisasi database.
- Loader empat kotak tetap berjalan sebagai indikator sinkronisasi kecil dan tidak lagi menutup tampilan penuh.
- Tab aktif `Material` atau `Finishing` menggunakan warna oranye NEXORA.
- Cache key asset dinaikkan ke v5.8.5.
- QA build, integrasi publik, production readiness, v5.8.4, dan v5.8.5 PASS.

# v5.8.4 — Database Loader & Single-Viewport Mobile Homepage

- Menambahkan indikator loading empat kotak yang membesar dan mengecil berurutan searah jarum jam.
- Menerapkan loader pada pengambilan data Portofolio serta Material & Finishing.
- Menambahkan durasi minimum 420 ms agar indikator tidak berkedip terlalu cepat.
- Menghapus teks `CREATIVE PRINT LAB` dari Homepage desktop dan mobile.
- Mengunci Homepage mobile pada satu dynamic viewport tanpa document scroll.
- Memadatkan komposisi judul, deskripsi, visual, tombol, dan kategori agar seluruhnya tetap terlihat.
- Mempertahankan API Mobile Control, desain desktop, header bersama, dan kontrak Production v5.8.3.
- Menaikkan cache key asset dan envelope API ke v5.8.4.

# v5.8.3 — Contact Proportion & Dynamic Finishing Filter Fit

- Added missing `contact-page` body class.
- Balanced Contact hero within shared 1480 px axis.
- Made Material/Finishing filter columns dynamic by group count.
- Kept all seven Finishing groups in one desktop row.
- Reduced Finishing filter icons responsively.
- Bumped public asset cache key and API envelope to v5.8.3.

# Changelog

## v5.8.2 — Header Alignment, Cache Safety & Responsive Filter Icons

- Menyamakan sumbu header desktop seluruh halaman ke container 1480 px.
- Menyamakan posisi logo, navigasi, dan tombol Konsultasi dengan konten halaman.
- Menambahkan version query `?v=5.8.2` pada CSS dan JavaScript untuk mencegah tampilan lama akibat cache immutable.
- Mengubah cache CSS/JS menjadi `must-revalidate`; image/brand/icon tetap immutable.
- Memperkecil ikon filter Portofolio serta Material & Finishing dengan ukuran responsif berbasis `clamp()`.
- Menaikkan envelope API ke v5.8.2 tanpa mengubah kontrak data.

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

## v5.8.6 — Material & Finishing Data Fallback

- Mempertahankan card dan panel detail Material/Finishing ketika endpoint Preview berhasil tetapi mengembalikan array kosong.
- Data API tetap menjadi sumber utama ketika item tersedia.
- Fallback lokal hanya digunakan per mode yang kosong dan tidak mengubah data API yang valid.
- Tab aktif Material/Finishing tetap menggunakan warna oranye NEXORA.
- Asset cache key diperbarui ke `v=5.8.6`.

## v5.8.8 — Production Material/Finishing Restoration
- Restored `material-finishing.js` directly from the approved Production v5.8.3 baseline.
- Restored the approved Material & Finishing local catalogue from Production.
- Removed experimental render-first/loading modifications from the Material & Finishing page.
- Preserved the database loader for Portfolio and the single-viewport mobile Homepage.
- Changed only the active Material/Finishing mode color from navy to NEXORA orange.
- Bumped all public asset references to v5.8.8 to eliminate stale browser cache.
