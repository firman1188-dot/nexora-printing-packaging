# Architecture — NEXORA v5.6

## Arsitektur publik

```text
Beranda
├── Portofolio
├── Material & Finishing
└── Kontak
```

Route dan menu Produk tidak digunakan.

## Integrasi Mobile Control

```text
Mobile Control
      ↓
Portfolio API + Media Storage
      ↓
portfolioApiUrl
      ↓
portfolio.js
      ↓
Filter kategori / material / finishing
      ↓
Grid, preview, spesifikasi, deskripsi
```

## Master Material & Finishing

```text
Master API (opsional)
      ↓
materialFinishingApiUrl
      ↓
material-finishing.js
      ↓
Sample Library + detail + portofolio terkait
```

Fallback lokal:

```text
portfolio-data.js
material-finishing-data.js
```

Kategori, material, dan finishing memakai ID/slug tetap, bukan teks bebas.
