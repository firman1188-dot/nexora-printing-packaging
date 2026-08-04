# Dokumentasi Struktur Data Portofolio

**Project:** NEXORA Printing & Packaging  
**Status:** Baseline pengembangan website dan Mobile Control

## Field utama

```text
portfolio_id
title
slug
category_id
cover_image
gallery_images
description
material_ids
size
printing_method
finishing_ids
production_quantity
production_unit
additional_specifications
status
display_order
created_at
updated_at
```

## Relasi filter

- satu portofolio memiliki satu `category_id`;
- satu portofolio dapat memiliki banyak `material_ids`;
- satu portofolio dapat memiliki banyak `finishing_ids`;
- filter gabungan memakai logika AND;
- nama tampilan dibaca dari master kategori, material, dan finishing.

## Struktur payload publik

```json
{
  "categories": [],
  "materials": [],
  "finishings": [],
  "portfolio_items": []
}
```

API juga boleh membungkus payload tersebut dalam properti `data`.

## Status publik

Website hanya menampilkan item dengan:

```text
status = ACTIVE
```

## Media

- `cover_image`: foto kartu dan preview awal;
- `gallery_images`: foto tambahan hasil produksi;
- tidak ada label tetap Depan/Samping/Terbuka/Detail;
- urutan array menentukan urutan galeri.
