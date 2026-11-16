# NEXORA Printing & Packaging v5.8.9

> Data portofolio, material, dan finishing berasal dari **Agent Project Finance (Mobile Control)** lewat `/api/public/*`.
> Slug kategori pada tautan beranda/footer HARUS sama dengan `category_slug` di Mobile Control
> (saat ini: food-packaging, product-packaging, paper-bag, label-sticker, commercial-printing, custom-project).
> Bila kategori di Mobile Control berubah, perbarui `src/pages/index.html` dan `src/partials/footer.html`.
> Nomor WhatsApp & email: `src/assets/js/site-config.js`.

Website publik NEXORA dengan konsep **Creative Print Lab — Color Splash**.

## Halaman final

```text
/
/portofolio.html
/material-finishing.html
/kontak.html
```

Menu dan seluruh route **Produk** sudah dihapus permanen. Website hanya menampilkan hasil produksi nyata melalui Portofolio.

## Fitur utama

- Homepage C1 satu viewport tanpa scroll vertikal.
- Portofolio hasil produksi nyata dengan filter ikon, grid 4 × 3, preview besar, spesifikasi teknis, dan mobile detail fullscreen.
- Digital Sample Library Material & Finishing dengan tab Material/Finishing, filter kelompok, master data terstruktur, portofolio terkait, dan mobile detail fullscreen.
- Kontrak data siap menerima Mobile Control/API.
- Header: Beranda — Portofolio — Material & Finishing — Kontak — Konsultasi.
- Tidak menggunakan Three.js, WebGL, GLB, atau dependency eksternal.

## Menjalankan

```bash
npm run qa
npm run dev
```

Buka:

```text
http://localhost:3000
```

Jangan hentikan terminal server selama website sedang dibuka.

## Konfigurasi bisnis dan API

Edit:

```text
src/assets/js/site-config.js
```

Field utama:

```js
whatsapp: '6281234567890'
portfolioApiUrl: ''
materialFinishingApiUrl: ''
```

Jika endpoint kosong atau gagal, website menggunakan data lokal.

## Data lokal

```text
src/assets/js/portfolio-data.js
src/assets/js/material-finishing-data.js
```

Dokumentasi kontrak data:

```text
PORTFOLIO_DATA_CONTRACT.md
MATERIAL_FINISHING_DATA_CONTRACT.md
```
