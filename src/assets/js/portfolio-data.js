/**
 * NEXORA Printing & Packaging
 * Portfolio Data Contract v1.0
 *
 * Local demo data follows the same contract expected from the future
 * Mobile Control / Portfolio API. Replace this source by setting
 * window.NEXORA_CONFIG.portfolioApiUrl in site-config.js.
 */
window.NEXORA_PORTFOLIO_DATA = {
  categories: [
    { category_id: 'CAT-PACKAGING', category_name: 'Packaging', category_slug: 'packaging', icon: 'box' },
    { category_id: 'CAT-BOOK-MAGAZINE', category_name: 'Buku & Majalah', category_slug: 'buku-majalah', icon: 'book' },
    { category_id: 'CAT-LABEL-STICKER', category_name: 'Label & Stiker', category_slug: 'label-stiker', icon: 'label' },
    { category_id: 'CAT-CALENDAR-AGENDA', category_name: 'Kalender & Agenda', category_slug: 'kalender-agenda', icon: 'calendar' },
    { category_id: 'CAT-PAPER-BAG', category_name: 'Paper Bag', category_slug: 'paper-bag', icon: 'bag' },
    { category_id: 'CAT-PROMOTIONAL-MEDIA', category_name: 'Media Promosi', category_slug: 'media-promosi', icon: 'promo' },
    { category_id: 'CAT-CUSTOM-PRODUCT', category_name: 'Produk Custom', category_slug: 'produk-custom', icon: 'custom' }
  ],

  materials: [
    { material_id: 'MAT-IVORY-300', material_name: 'Ivory 300 gsm', material_slug: 'ivory-300-gsm' },
    { material_id: 'MAT-GREYBOARD-2MM', material_name: 'Grey Board 2 mm', material_slug: 'grey-board-2-mm' },
    { material_id: 'MAT-ARTPAPER-150', material_name: 'Art Paper 150 gsm', material_slug: 'art-paper-150-gsm' },
    { material_id: 'MAT-ARTCARTON-260', material_name: 'Art Carton 260 gsm', material_slug: 'art-carton-260-gsm' },
    { material_id: 'MAT-KRAFT-200', material_name: 'Kraft 200 gsm', material_slug: 'kraft-200-gsm' },
    { material_id: 'MAT-CHROMO-STICKER', material_name: 'Sticker Chromo', material_slug: 'sticker-chromo' },
    { material_id: 'MAT-VINYL-STICKER', material_name: 'Sticker Vinyl', material_slug: 'sticker-vinyl' },
    { material_id: 'MAT-BOOKPAPER-72', material_name: 'Book Paper 72 gsm', material_slug: 'book-paper-72-gsm' },
    { material_id: 'MAT-HVS-100', material_name: 'HVS 100 gsm', material_slug: 'hvs-100-gsm' },
    { material_id: 'MAT-DUPLEX-350', material_name: 'Duplex 350 gsm', material_slug: 'duplex-350-gsm' },
    { material_id: 'MAT-CORRUGATED-E', material_name: 'Corrugated E Flute', material_slug: 'corrugated-e-flute' },
    { material_id: 'MAT-FANCY-LINEN', material_name: 'Fancy & Linen Paper', material_slug: 'fancy-linen-paper' }
  ],

  finishings: [
    { finishing_id: 'FIN-LAM-DOFF', finishing_name: 'Laminasi Doff', finishing_slug: 'laminasi-doff' },
    { finishing_id: 'FIN-LAM-GLOSSY', finishing_name: 'Laminasi Glossy', finishing_slug: 'laminasi-glossy' },
    { finishing_id: 'FIN-HOT-FOIL-GOLD', finishing_name: 'Hot Foil Emas', finishing_slug: 'hot-foil-emas' },
    { finishing_id: 'FIN-SPOT-UV', finishing_name: 'Spot UV', finishing_slug: 'spot-uv' },
    { finishing_id: 'FIN-EMBOSS', finishing_name: 'Emboss', finishing_slug: 'emboss' },
    { finishing_id: 'FIN-DIE-CUT', finishing_name: 'Die Cut / Pond', finishing_slug: 'die-cut-pond' },
    { finishing_id: 'FIN-PERFECT-BINDING', finishing_name: 'Perfect Binding', finishing_slug: 'perfect-binding' },
    { finishing_id: 'FIN-HARDCOVER-BINDING', finishing_name: 'Hardcover Binding', finishing_slug: 'hardcover-binding' },
    { finishing_id: 'FIN-WIRO', finishing_name: 'Wiro Binding', finishing_slug: 'wiro-binding' },
    { finishing_id: 'FIN-FOLDING', finishing_name: 'Lem & Folding', finishing_slug: 'lem-folding' },
    { finishing_id: 'FIN-HOT-FOIL-SILVER', finishing_name: 'Hot Foil Perak', finishing_slug: 'hot-foil-perak' },
    { finishing_id: 'FIN-DEBOSS', finishing_name: 'Deboss', finishing_slug: 'deboss' },
    { finishing_id: 'FIN-VARNISH', finishing_name: 'Varnish / Coating', finishing_slug: 'varnish' }
  ],

  portfolio_items: [
    {
      portfolio_id: 'PORT-0001',
      title: 'Kemasan Lunch Box Custom',
      slug: 'kemasan-lunch-box-custom',
      category_id: 'CAT-PACKAGING',
      cover_image: '/assets/images/products/food-box.webp',
      gallery_images: ['/assets/images/products/food-box.webp', '/assets/images/products/food-box-detail.webp'],
      image_alt_text: 'Kemasan lunch box custom hasil produksi NEXORA',
      description: 'Kemasan lunch box custom menggunakan material Ivory 300 gsm dengan hasil cetak offset full color. Finishing laminasi doff memberikan tampilan bersih, kuat, dan profesional.',
      material_ids: ['MAT-IVORY-300'],
      size: { length: 18, width: 12, height: 6, unit: 'cm', display: '18 × 12 × 6 cm' },
      printing_method: 'Offset Full Color',
      finishing_ids: ['FIN-LAM-DOFF', 'FIN-DIE-CUT', 'FIN-FOLDING'],
      production_quantity: 10000,
      production_unit: 'pcs',
      additional_specifications: [
        { name: 'Konstruksi', value: 'Auto-lock Bottom', display_order: 1 },
        { name: 'Warna Cetak', value: 'CMYK', display_order: 2 },
        { name: 'Ketebalan', value: '300 gsm', display_order: 3 },
        { name: 'Jenis Lem', value: 'Food Grade Adhesive', display_order: 4 }
      ],
      status: 'ACTIVE', display_order: 1, created_at: '2026-08-01T09:00:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0002', title: 'Rigid Box Premium', slug: 'rigid-box-premium', category_id: 'CAT-PACKAGING',
      cover_image: '/assets/images/products/rigid-box.webp',
      gallery_images: ['/assets/images/products/rigid-box.webp', '/assets/images/products/rigid-box-open.webp', '/assets/images/products/rigid-box-closed.webp'],
      image_alt_text: 'Rigid box premium berwarna navy',
      description: 'Rigid box premium untuk hampers dan produk eksklusif dengan struktur kokoh serta detail hot foil emas.',
      material_ids: ['MAT-GREYBOARD-2MM', 'MAT-ARTPAPER-150'],
      size: { length: 25, width: 20, height: 8, unit: 'cm', display: '25 × 20 × 8 cm' },
      printing_method: 'Offset Full Color', finishing_ids: ['FIN-LAM-DOFF', 'FIN-HOT-FOIL-GOLD', 'FIN-EMBOSS'],
      production_quantity: 500, production_unit: 'pcs',
      additional_specifications: [
        { name: 'Konstruksi', value: 'Lift-off Lid', display_order: 1 },
        { name: 'Insert', value: 'Custom EVA Foam', display_order: 2 }
      ], status: 'ACTIVE', display_order: 2, created_at: '2026-08-01T09:10:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0003', title: 'Stiker Label Produk', slug: 'stiker-label-produk', category_id: 'CAT-LABEL-STICKER',
      cover_image: '/assets/images/products/label-roll.webp',
      gallery_images: ['/assets/images/products/label-roll.webp', '/assets/images/products/label-roll-detail.webp'],
      image_alt_text: 'Stiker label produk dalam bentuk roll',
      description: 'Label roll untuk kebutuhan kemasan produk dengan potongan presisi dan warna yang konsisten.',
      material_ids: ['MAT-CHROMO-STICKER'], size: { display: '5 × 5 cm' }, printing_method: 'Digital Full Color',
      finishing_ids: ['FIN-LAM-GLOSSY', 'FIN-DIE-CUT'], production_quantity: 5000, production_unit: 'pcs',
      additional_specifications: [{ name: 'Bentuk Potong', value: 'Round Die Cut', display_order: 1 }, { name: 'Core Roll', value: '3 inch', display_order: 2 }],
      status: 'ACTIVE', display_order: 3, created_at: '2026-08-01T09:20:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0004', title: 'Kalender Meja Eksklusif', slug: 'kalender-meja-eksklusif', category_id: 'CAT-CALENDAR-AGENDA',
      cover_image: '/assets/images/products/calendar-desk.webp',
      gallery_images: ['/assets/images/products/calendar-desk.webp', '/assets/images/products/calendar-desk-detail.webp'],
      image_alt_text: 'Kalender meja eksklusif dengan wiro',
      description: 'Kalender meja perusahaan dengan cetak tajam, dudukan kokoh, dan wiro yang rapi.',
      material_ids: ['MAT-ARTCARTON-260'], size: { display: '21 × 15 cm' }, printing_method: 'Offset Full Color',
      finishing_ids: ['FIN-LAM-DOFF', 'FIN-WIRO'], production_quantity: 1000, production_unit: 'set',
      additional_specifications: [{ name: 'Jumlah Lembar', value: '13 lembar', display_order: 1 }, { name: 'Dudukan', value: 'Board 2 mm', display_order: 2 }],
      status: 'ACTIVE', display_order: 4, created_at: '2026-08-01T09:30:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0005', title: 'Paper Bag Custom', slug: 'paper-bag-custom', category_id: 'CAT-PAPER-BAG',
      cover_image: '/assets/images/products/paperbag-product.webp',
      gallery_images: ['/assets/images/products/paperbag-product.webp', '/assets/images/products/paperbag-product-detail.webp'],
      image_alt_text: 'Paper bag custom hasil produksi',
      description: 'Paper bag custom untuk kebutuhan retail dan corporate gift dengan handle tali dan konstruksi kuat.',
      material_ids: ['MAT-KRAFT-200'], size: { display: '24 × 10 × 32 cm' }, printing_method: 'Offset 2 Warna',
      finishing_ids: ['FIN-DIE-CUT', 'FIN-FOLDING'], production_quantity: 2000, production_unit: 'pcs',
      additional_specifications: [{ name: 'Handle', value: 'Tali katun', display_order: 1 }, { name: 'Penguat Dasar', value: 'Duplex board', display_order: 2 }],
      status: 'ACTIVE', display_order: 5, created_at: '2026-08-01T09:40:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0006', title: 'Brosur Company Profile', slug: 'brosur-company-profile', category_id: 'CAT-PROMOTIONAL-MEDIA',
      cover_image: '/assets/images/products/brochure.webp',
      gallery_images: ['/assets/images/products/brochure.webp', '/assets/images/products/brochure-detail.webp'],
      image_alt_text: 'Brosur company profile lipat tiga',
      description: 'Brosur company profile dengan layout informatif, warna tajam, dan lipatan presisi.',
      material_ids: ['MAT-ARTPAPER-150'], size: { display: 'A4 terbuka' }, printing_method: 'Offset Full Color Dua Sisi',
      finishing_ids: ['FIN-LAM-DOFF', 'FIN-FOLDING'], production_quantity: 3000, production_unit: 'lembar',
      additional_specifications: [{ name: 'Model Lipatan', value: 'Tri-fold', display_order: 1 }, { name: 'Warna Cetak', value: 'CMYK 2 sisi', display_order: 2 }],
      status: 'ACTIVE', display_order: 6, created_at: '2026-08-01T09:50:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0007', title: 'Hardcover Book', slug: 'hardcover-book', category_id: 'CAT-BOOK-MAGAZINE',
      cover_image: '/assets/images/products/hardcover.webp',
      gallery_images: ['/assets/images/products/hardcover.webp', '/assets/images/products/hardcover-detail.webp', '/assets/images/products/book-open.webp'],
      image_alt_text: 'Buku hardcover premium',
      description: 'Buku hardcover premium dengan cover kokoh, jilid rapi, dan tampilan eksklusif.',
      material_ids: ['MAT-GREYBOARD-2MM', 'MAT-BOOKPAPER-72'], size: { display: 'A5' }, printing_method: 'Offset Full Color',
      finishing_ids: ['FIN-LAM-DOFF', 'FIN-HOT-FOIL-GOLD', 'FIN-HARDCOVER-BINDING'], production_quantity: 750, production_unit: 'buku',
      additional_specifications: [{ name: 'Jumlah Halaman', value: '160 halaman', display_order: 1 }, { name: 'Endpaper', value: 'Fancy Paper', display_order: 2 }],
      status: 'ACTIVE', display_order: 7, created_at: '2026-08-01T10:00:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0008', title: 'Box Parfum Custom', slug: 'box-parfum-custom', category_id: 'CAT-PACKAGING',
      cover_image: '/assets/images/products/folding-carton.webp',
      gallery_images: ['/assets/images/products/folding-carton.webp', '/assets/images/products/folding-carton-detail.webp'],
      image_alt_text: 'Box parfum custom berwarna hitam',
      description: 'Folding carton untuk kemasan parfum dengan visual elegan dan struktur presisi.',
      material_ids: ['MAT-IVORY-300'], size: { display: '7 × 5 × 12 cm' }, printing_method: 'Offset Full Color',
      finishing_ids: ['FIN-LAM-DOFF', 'FIN-HOT-FOIL-GOLD', 'FIN-DIE-CUT', 'FIN-FOLDING'], production_quantity: 5000, production_unit: 'pcs',
      additional_specifications: [{ name: 'Model Tutup', value: 'Reverse Tuck End', display_order: 1 }],
      status: 'ACTIVE', display_order: 8, created_at: '2026-08-01T10:10:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0009', title: 'Hang Tag Premium', slug: 'hang-tag-premium', category_id: 'CAT-LABEL-STICKER',
      cover_image: '/assets/images/portfolio/portfolio-label.webp',
      gallery_images: ['/assets/images/portfolio/portfolio-label.webp', '/assets/images/products/label-roll-detail.webp'],
      image_alt_text: 'Hang tag premium berwarna hitam',
      description: 'Hang tag premium untuk fashion dan retail dengan hot foil emas.',
      material_ids: ['MAT-ARTCARTON-260'], size: { display: '5 × 9 cm' }, printing_method: 'Digital Full Color',
      finishing_ids: ['FIN-LAM-DOFF', 'FIN-HOT-FOIL-GOLD', 'FIN-DIE-CUT'], production_quantity: 2000, production_unit: 'pcs',
      additional_specifications: [{ name: 'Lubang', value: 'Eyelet 4 mm', display_order: 1 }, { name: 'Tali', value: 'Wax cord', display_order: 2 }],
      status: 'ACTIVE', display_order: 9, created_at: '2026-08-01T10:20:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0010', title: 'Kemasan Obat', slug: 'kemasan-obat', category_id: 'CAT-PACKAGING',
      cover_image: '/assets/images/portfolio/portfolio-box-2.webp',
      gallery_images: ['/assets/images/portfolio/portfolio-box-2.webp', '/assets/images/products/folding-carton-detail.webp'],
      image_alt_text: 'Kemasan obat hasil produksi',
      description: 'Kemasan farmasi dengan informasi produk yang jelas dan kualitas cetak konsisten.',
      material_ids: ['MAT-DUPLEX-350'], size: { display: '8 × 4 × 12 cm' }, printing_method: 'Offset Full Color',
      finishing_ids: ['FIN-LAM-GLOSSY', 'FIN-DIE-CUT', 'FIN-FOLDING'], production_quantity: 20000, production_unit: 'pcs',
      additional_specifications: [{ name: 'Konstruksi', value: 'Straight Tuck End', display_order: 1 }, { name: 'Kode Produksi', value: 'Variable Data', display_order: 2 }],
      status: 'ACTIVE', display_order: 10, created_at: '2026-08-01T10:30:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0011', title: 'Agenda Custom', slug: 'agenda-custom', category_id: 'CAT-CALENDAR-AGENDA',
      cover_image: '/assets/images/products/notebook.webp',
      gallery_images: ['/assets/images/products/notebook.webp', '/assets/images/products/notebook-detail.webp', '/assets/images/products/wiro-detail.webp'],
      image_alt_text: 'Agenda custom berwarna navy',
      description: 'Agenda custom perusahaan dengan cover eksklusif dan sistem wiro yang kuat.',
      material_ids: ['MAT-ARTCARTON-260', 'MAT-HVS-100'], size: { display: 'A5' }, printing_method: 'Digital Full Color',
      finishing_ids: ['FIN-LAM-DOFF', 'FIN-SPOT-UV', 'FIN-WIRO'], production_quantity: 1000, production_unit: 'buku',
      additional_specifications: [{ name: 'Jumlah Halaman', value: '120 halaman', display_order: 1 }, { name: 'Wiro', value: 'Double loop', display_order: 2 }],
      status: 'ACTIVE', display_order: 11, created_at: '2026-08-01T10:40:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    },
    {
      portfolio_id: 'PORT-0012', title: 'Packaging Elektronik', slug: 'packaging-elektronik', category_id: 'CAT-CUSTOM-PRODUCT',
      cover_image: '/assets/images/products/custom-product.webp',
      gallery_images: ['/assets/images/products/custom-product.webp', '/assets/images/products/custom-product-detail.webp', '/assets/images/products/corrugated-box-detail.webp'],
      image_alt_text: 'Packaging elektronik custom',
      description: 'Packaging elektronik custom dengan perlindungan internal dan tampilan profesional.',
      material_ids: ['MAT-CORRUGATED-E', 'MAT-ARTPAPER-150'], size: { display: '28 × 22 × 10 cm' }, printing_method: 'Offset Full Color',
      finishing_ids: ['FIN-LAM-DOFF', 'FIN-DIE-CUT', 'FIN-FOLDING'], production_quantity: 1500, production_unit: 'pcs',
      additional_specifications: [{ name: 'Insert', value: 'Corrugated custom', display_order: 1 }, { name: 'Pengunci', value: 'Tuck lock', display_order: 2 }],
      status: 'ACTIVE', display_order: 12, created_at: '2026-08-01T10:50:00+07:00', updated_at: '2026-08-04T21:00:00+07:00'
    }
  ]
};
