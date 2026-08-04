# Material & Finishing Data Contract v1.0

**Project:** NEXORA Printing & Packaging  
**Status:** Baseline website dan integrasi backend

## Payload

```json
{
  "material_groups": [],
  "finishing_groups": [],
  "materials": [],
  "finishings": []
}
```

API boleh membungkus payload dalam properti `data`.

## Material

Field utama:

```text
material_id
material_name
material_slug
material_group
preview_image
type
grammage
surface
color
thickness
characteristics[]
recommended_uses[]
short_description
notes
status
display_order
```

`material_id` harus sama dengan nilai pada `portfolio_items.material_ids`.

## Finishing

Field utama:

```text
finishing_id
finishing_name
finishing_slug
finishing_group
preview_image
effect
characteristics[]
recommended_uses[]
recommended_combinations[]
notes
status
display_order
```

`finishing_id` harus sama dengan nilai pada `portfolio_items.finishing_ids`.

## Status publik

Website hanya menampilkan data dengan:

```text
status = ACTIVE
```

## Deep link

```text
/material-finishing.html?type=material&id=ivory-300-gsm
/material-finishing.html?type=finishing&id=hot-foil-emas
```

Portofolio terkait dibaca melalui relasi ID, bukan pencarian teks.
