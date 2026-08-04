# Content Guide — NEXORA v5.6

## Portofolio

Edit data lokal di:

```text
src/assets/js/portfolio-data.js
```

Setiap item wajib menggunakan:

- satu `category_id`;
- satu atau beberapa `material_ids`;
- satu atau beberapa `finishing_ids`;
- satu `cover_image`;
- `gallery_images` sebagai foto tambahan hasil produksi nyata.

## Material & Finishing

Edit master detail di:

```text
src/assets/js/material-finishing-data.js
```

ID harus sama dengan master pada `portfolio-data.js` agar portofolio terkait dapat ditemukan.

## Foto

- Portofolio: gunakan foto produksi asli.
- Material: gunakan foto tekstur close-up.
- Finishing: gunakan foto efek finishing close-up.
- Rekomendasi minimum: 1200 × 800 px.
- Gunakan WebP untuk aset website.

## Endpoint API

Edit:

```text
src/assets/js/site-config.js
```

Setelah Mobile Control/backend tersedia, isi `portfolioApiUrl`. Master material/finishing dapat memakai `materialFinishingApiUrl` jika dikelola dari backend.
