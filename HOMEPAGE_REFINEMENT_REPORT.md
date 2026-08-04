# NEXORA Printing & Packaging — Homepage Refinement v5.3

## Scope

Perubahan hanya diterapkan pada homepage. Halaman Produk, Portofolio, Material & Finishing, Kontak, dan header bersama untuk halaman internal tidak diubah.

## Perubahan

1. Hero menggunakan aset baru `hero-c1-products-clean.webp` dengan background putih/abu yang terhubung ke tepi dibuat transparan dan anti-halo agar menyatu dengan halaman.
2. Komposisi desktop diperbesar dan dibuat lebih fluid terhadap viewport hingga layar lebar.
3. Headline, body copy, logo, navigasi, CTA, hero product composition, ikon kategori, dan panel kategori diperbesar secara proporsional.
4. Tombol `Lihat Produk` dihapus dari hero. CTA hero sekarang hanya `Lihat Portofolio`.
5. Homepage memakai header khusus dengan urutan:
   - Beranda
   - Portofolio
   - Material & Finishing
   - Kontak
6. Menu `Produk` dan mega menu tidak tampil pada homepage.
7. Navigasi mobile homepage menggunakan urutan yang sama.
8. Komposisi mobile tetap dua kolom dan satu viewport, dengan hero serta kategori diperbesar secara proporsional.

## File utama yang berubah

- `src/pages/index.html`
- `src/partials/home-header.html`
- `src/assets/css/styles.css`
- `src/assets/images/hero/hero-c1-products-clean.webp`
- `scripts/build.mjs`
- `package.json`

## Validation

- `npm run qa`: PASS
- HTML output: 13 files
- Referenced assets: 42
- Homepage header contains `Produk`: 0 occurrence
- Homepage hero button count: 1
- Non-home source pages: byte-identical to v5.2
- Shared inner-page header: byte-identical to v5.2
