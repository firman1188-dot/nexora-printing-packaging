# NEXORA Printing & Packaging — Mobile UI Patch v5.7.1

Status: PATCH SIAP TIMPA  
Basis: v5.7.0 Vercel Integration  
Scope: Homepage mobile dan shared mobile navigation

## Perubahan

- Homepage mobile memakai komposisi vertikal khusus mobile.
- Headline, deskripsi, gambar hero, CTA, dan kategori tidak lagi saling menimpa.
- Ruang kosong antara header dan hero dipadatkan.
- Gambar hero memakai area sendiri dengan `object-fit: contain`.
- Panel kategori tetap 4 + 3, dengan ukuran sentuh dan ikon yang lebih nyaman.
- Menu hamburger menjadi panel putih fullscreen/off-canvas.
- Header tetap terlihat sebagai top bar; hamburger berubah menjadi tombol tutup.
- Body di belakang dikunci ketika menu terbuka.
- Menu aktif ditandai warna oranye.
- Menu otomatis ditutup saat link, tombol konsultasi, tombol Escape, atau breakpoint desktop digunakan.
- Layout desktop tidak diubah oleh patch ini.

## File yang ditimpa

- `package.json`
- `src/assets/css/styles.css`
- `src/assets/js/main.js`
- `src/partials/header.html`
- `src/partials/home-header.html`

## QA

- `npm run build`: PASS
- `npm run verify`: PASS
- `npm run verify:portfolio`: PASS
- `npm run verify:material`: PASS
