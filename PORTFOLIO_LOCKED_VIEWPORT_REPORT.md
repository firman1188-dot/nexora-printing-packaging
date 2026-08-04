# NEXORA Printing & Packaging
## Portfolio Locked Viewport Report v5.5

**Status:** PASS  
**Tanggal:** 4 Agustus 2026  
**Scope:** Halaman Portofolio saja

## Perubahan

1. Halaman Portofolio dikunci pada satu viewport (`100dvh`).
2. Body halaman Portofolio tidak memiliki scroll vertikal.
3. Footer disembunyikan khusus pada halaman Portofolio agar tidak menambah tinggi halaman.
4. Filter kategori diperbesar mengikuti komposisi ikon kategori pada homepage C1.
5. Jumlah card per halaman disesuaikan otomatis:
   - Desktop lebar: 8 card (4 × 2)
   - Laptop/tablet landscape: 6 card (3 × 2)
   - Mobile: 4 card (2 × 2)
6. Grid, preview, spesifikasi, deskripsi, CTA, dan pagination dipadatkan secara proporsional agar seluruhnya muat dalam satu layar.
7. Panel detail desktop tidak memiliki scroll internal dan seluruh informasi utama tetap terlihat.
8. Mobile tetap terkunci satu viewport pada halaman galeri. Detail produk dibuka fullscreen dengan scroll internal bila diperlukan.

## Validasi viewport

### Desktop 1600 × 900
- `document.scrollHeight`: 900
- `body.scrollHeight`: 900
- `body overflow`: hidden
- Card tampil: 8
- Panel detail dan CTA terlihat penuh

### Mobile 390 × 844
- `document.scrollHeight`: 844
- `body.scrollHeight`: 844
- `body overflow`: hidden
- Card tampil: 4
- Filter kategori dapat digeser horizontal
- Detail dibuka fullscreen

## File yang berubah

- `src/assets/css/styles.css`
- `src/assets/js/portfolio.js`
- `package.json`
- `CHANGELOG.md`
- `QA_STATUS.md`
