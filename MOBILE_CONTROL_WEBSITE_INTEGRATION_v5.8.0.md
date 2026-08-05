# NEXORA Printing & Packaging — Mobile Control Website Integration v5.8.0

## Status

INTEGRATION CANDIDATE — branch `development` / Vercel Preview only.

## Arsitektur

Browser website memanggil endpoint same-origin `/api/public/*`. Vercel Function kemudian memanggil Google Apps Script menggunakan secret server-side. Browser tidak pernah menerima `GAS_SHARED_SECRET`.

Implementasi v5.8.0 menggunakan read action Mobile Control yang sudah tersedia:

- `GET_PORTFOLIO_MASTERS`
- `LIST_PORTFOLIOS_PAGE`
- `GET_PORTFOLIO`

Vercel adapter hanya mengizinkan tiga action tersebut dan tidak menyediakan action tulis. Role internal default tetap `OWNER` untuk kompatibilitas Mobile Control v1.6.3, tetapi browser hanya mendapat API GET yang telah disanitasi.

## Endpoint publik

- `GET /api/public/portfolio`
- `GET /api/public/portfolio/:slug`
- `GET /api/public/categories`
- `GET /api/public/materials`
- `GET /api/public/materials/:slug`
- `GET /api/public/finishings`
- `GET /api/public/finishings/:slug`
- `GET /api/public/material-finishing`

Filter daftar portofolio:

- `category_id`
- `material_id`
- `finishing_id`
- `q`
- `offset`
- `limit`

Filter gabungan memakai logika AND.

## Environment Vercel Preview

Tambahkan melalui Project Settings → Environment Variables:

```text
GAS_WEB_APP_URL=<deployment Apps Script Preview>
GAS_SHARED_SECRET=<secret Preview>
NEXORA_CLIENT_ID=NEXORA-PRINT-001
NEXORA_ENVIRONMENT=preview
NEXORA_PUBLIC_READER_ROLE=OWNER
NEXORA_PUBLIC_READER_USER_ID=WEBSITE_PUBLIC
PUBLIC_API_S_MAXAGE=60
PUBLIC_API_STALE_WHILE_REVALIDATE=300
GAS_REQUEST_TIMEOUT_MS=15000
```

Semua variabel server-only. Jangan ditulis pada `site-config.js`.

## Material dan Finishing

Mobile Control v1.6.3 baru menyediakan nama, deskripsi, foto, urutan, dan status. Website menggabungkan data aktual tersebut dengan enrichment lokal berdasarkan ID/slug agar layout detail lama tetap dapat digunakan. Aturannya:

1. Daftar item mengikuti API Mobile Control, bukan daftar demo lokal.
2. Nama, deskripsi, foto, status, dan urutan dari API menjadi prioritas.
3. Karakteristik dan rekomendasi lokal hanya dipakai untuk ID/slug yang sudah dikenal.
4. Master baru tanpa enrichment tetap tampil dengan deskripsi API dan placeholder yang aman.
5. Master yang dihapus/nonaktif tidak tampil karena tidak dikembalikan API.

## Fallback

- API berhasil tetapi data kosong: website menampilkan empty state; data demo tidak dimunculkan.
- API gagal/konfigurasi belum tersedia: website memakai data lokal untuk mencegah halaman rusak selama development.
- Production sebaiknya mengaktifkan monitoring agar kegagalan API diketahui.

## Catatan data Preview

Record portofolio pada screenshot berstatus `ARCHIVED`, sehingga tidak akan muncul melalui API publik. Buat atau ubah minimal satu record menjadi `ACTIVE` untuk QA integrasi.
