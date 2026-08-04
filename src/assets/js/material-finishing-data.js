/**
 * NEXORA Printing & Packaging
 * Master Material & Finishing v1.0
 *
 * IDs in this file are the same keys used by portfolio_items.material_ids
 * and portfolio_items.finishing_ids. This contract can later be supplied by
 * an API without changing the Material & Finishing page UI.
 */
window.NEXORA_MATERIAL_FINISHING_DATA = {
  material_groups: [
    { group_id: 'all', group_name: 'Semua', icon: 'grid' },
    { group_id: 'paper', group_name: 'Kertas Cetak', icon: 'paper' },
    { group_id: 'board', group_name: 'Board & Packaging', icon: 'board' },
    { group_id: 'sticker', group_name: 'Sticker & Label', icon: 'label-stack' },
    { group_id: 'special', group_name: 'Kertas Khusus', icon: 'diamond' },
    { group_id: 'other', group_name: 'Bahan Lainnya', icon: 'circle-dot' }
  ],
  finishing_groups: [
    { group_id: 'all', group_name: 'Semua', icon: 'grid' },
    { group_id: 'lamination', group_name: 'Laminasi & Coating', icon: 'layers' },
    { group_id: 'foil', group_name: 'Foil & Kilap', icon: 'sparkles' },
    { group_id: 'texture', group_name: 'Tekstur & Relief', icon: 'texture' },
    { group_id: 'cut', group_name: 'Potong & Bentuk', icon: 'scissors' },
    { group_id: 'binding', group_name: 'Binding', icon: 'binding' }
  ],
  materials: [
    {
      material_id: 'MAT-IVORY-300', material_name: 'Ivory 300 gsm', material_slug: 'ivory-300-gsm', material_group: 'board',
      preview_image: '/assets/images/material-finishing/material-ivory-300-gsm.webp', type: 'Paperboard', grammage: '300 gsm', surface: 'Halus', color: 'Putih natural', thickness: '± 0,38 mm',
      characteristics: ['Permukaan halus dan rata', 'Warna putih natural', 'Kaku dan kokoh', 'Hasil cetak tajam dan solid'],
      recommended_uses: ['Packaging', 'Folding Box', 'Hang Tag', 'Cover', 'Undangan'],
      short_description: 'Paperboard putih dengan permukaan halus dan struktur cukup kokoh.',
      notes: 'Sangat cocok untuk kemasan premium, box makanan, produk kosmetik, gift box, dan kebutuhan cetak lain yang membutuhkan kesan elegan dan profesional.',
      status: 'ACTIVE', display_order: 1
    },
    {
      material_id: 'MAT-ARTCARTON-260', material_name: 'Art Carton 260 gsm', material_slug: 'art-carton-260-gsm', material_group: 'board',
      preview_image: '/assets/images/material-finishing/material-art-carton-260-gsm.webp', type: 'Coated Paperboard', grammage: '260 gsm', surface: 'Coated halus', color: 'Putih', thickness: '± 0,30 mm',
      characteristics: ['Warna cetak cerah', 'Permukaan licin', 'Cukup kaku', 'Mudah diberi laminasi'],
      recommended_uses: ['Cover', 'Hang Tag', 'Folder', 'Packaging Ringan', 'Kartu'],
      short_description: 'Kertas coated tebal untuk cover dan materi cetak premium.',
      notes: 'Direkomendasikan untuk produk yang membutuhkan reproduksi warna tajam dan permukaan halus.',
      status: 'ACTIVE', display_order: 2
    },
    {
      material_id: 'MAT-DUPLEX-350', material_name: 'Duplex 350 gsm', material_slug: 'duplex-350-gsm', material_group: 'board',
      preview_image: '/assets/images/material-finishing/material-duplex-350-gsm.webp', type: 'Duplex Board', grammage: '350 gsm', surface: 'Coated satu sisi', color: 'Putih / abu-abu', thickness: '± 0,45 mm',
      characteristics: ['Ekonomis', 'Bagian depan putih', 'Belakang abu-abu', 'Struktur cukup kuat'],
      recommended_uses: ['Box Retail', 'Kemasan Obat', 'Kemasan Elektronik', 'Sleeve', 'Display'],
      short_description: 'Board ekonomis untuk berbagai kemasan retail dan produk massal.',
      notes: 'Sisi cetak berada pada permukaan putih. Cocok untuk produksi volume besar dengan kebutuhan biaya efisien.',
      status: 'ACTIVE', display_order: 3
    },
    {
      material_id: 'MAT-KRAFT-200', material_name: 'Kraft 200 gsm', material_slug: 'kraft-200-gsm', material_group: 'special',
      preview_image: '/assets/images/material-finishing/material-kraft-200-gsm.webp', type: 'Natural Paper', grammage: '200 gsm', surface: 'Berserat natural', color: 'Cokelat kraft', thickness: '± 0,28 mm',
      characteristics: ['Tampilan natural', 'Karakter serat terlihat', 'Kesan ramah lingkungan', 'Cocok untuk warna sederhana'],
      recommended_uses: ['Paper Bag', 'Sleeve', 'Food Packaging', 'Label', 'Hang Tag'],
      short_description: 'Kertas natural dengan karakter hangat dan tampilan ramah lingkungan.',
      notes: 'Warna dasar kraft memengaruhi hasil warna cetak. Cocok untuk desain minimalis dan identitas brand natural.',
      status: 'ACTIVE', display_order: 4
    },
    {
      material_id: 'MAT-GREYBOARD-2MM', material_name: 'Grey Board 2 mm', material_slug: 'grey-board-2-mm', material_group: 'board',
      preview_image: '/assets/images/material-finishing/material-grey-board-2-mm.webp', type: 'Rigid Board', grammage: '-', surface: 'Padat', color: 'Abu-abu', thickness: '2 mm',
      characteristics: ['Sangat kokoh', 'Tidak dicetak langsung', 'Memerlukan wrapping', 'Stabil untuk struktur premium'],
      recommended_uses: ['Rigid Box', 'Hardcover', 'Binder', 'Presentation Kit', 'Box Premium'],
      short_description: 'Papan padat untuk struktur produk premium yang membutuhkan kekakuan tinggi.',
      notes: 'Grey board biasanya dilapis art paper, fancy paper, linen, atau bahan wrapping lain.',
      status: 'ACTIVE', display_order: 5
    },
    {
      material_id: 'MAT-CORRUGATED-E', material_name: 'Corrugated E Flute', material_slug: 'corrugated-e-flute', material_group: 'board',
      preview_image: '/assets/images/material-finishing/material-corrugated-e-flute.webp', type: 'Corrugated Board', grammage: '-', surface: 'Bergelombang', color: 'Kraft / putih', thickness: '± 1,5 mm',
      characteristics: ['Ringan tetapi kuat', 'Melindungi produk', 'Mudah dibentuk', 'Cocok untuk pengiriman'],
      recommended_uses: ['Mailer Box', 'Shipping Box', 'Display', 'Packaging Elektronik', 'Insert'],
      short_description: 'Karton bergelombang tipis untuk kemasan pengiriman dan perlindungan produk.',
      notes: 'Jenis flute dan kombinasi liner disesuaikan berat, dimensi, serta kebutuhan perlindungan produk.',
      status: 'ACTIVE', display_order: 6
    },
    {
      material_id: 'MAT-HVS-100', material_name: 'HVS 100 gsm', material_slug: 'hvs-100-gsm', material_group: 'paper',
      preview_image: '/assets/images/material-finishing/material-hvs-100-gsm.webp', type: 'Uncoated Paper', grammage: '100 gsm', surface: 'Matte / mudah ditulis', color: 'Putih', thickness: '± 0,12 mm',
      characteristics: ['Mudah ditulis', 'Tidak mengilap', 'Serbaguna', 'Nyaman untuk dokumen'],
      recommended_uses: ['Isi Agenda', 'Formulir', 'Modul', 'Surat', 'Notebook'],
      short_description: 'Kertas uncoated serbaguna untuk kebutuhan tulis dan dokumen.',
      notes: 'Cocok untuk produk yang perlu ditulis menggunakan pulpen atau pensil.',
      status: 'ACTIVE', display_order: 7
    },
    {
      material_id: 'MAT-ARTPAPER-150', material_name: 'Art Paper 150 gsm', material_slug: 'art-paper-150-gsm', material_group: 'paper',
      preview_image: '/assets/images/material-finishing/material-art-paper-150-gsm.webp', type: 'Coated Paper', grammage: '150 gsm', surface: 'Halus dan licin', color: 'Putih', thickness: '± 0,14 mm',
      characteristics: ['Warna cetak tajam', 'Permukaan halus', 'Cocok dua sisi', 'Mudah dilaminasi'],
      recommended_uses: ['Brosur', 'Katalog', 'Majalah', 'Company Profile', 'Leaflet'],
      short_description: 'Kertas coated untuk materi promosi dan publikasi dengan warna tajam.',
      notes: 'Pilihan umum untuk brosur, katalog, majalah, dan media komunikasi visual.',
      status: 'ACTIVE', display_order: 8
    },
    {
      material_id: 'MAT-CHROMO-STICKER', material_name: 'Sticker Chromo', material_slug: 'sticker-chromo', material_group: 'sticker',
      preview_image: '/assets/images/material-finishing/material-sticker-chromo.webp', type: 'Paper Sticker', grammage: '-', surface: 'Glossy', color: 'Putih', thickness: 'Standar label',
      characteristics: ['Ekonomis', 'Warna cerah', 'Perekat kuat', 'Cocok penggunaan indoor'],
      recommended_uses: ['Label Produk', 'Seal', 'Stiker Promosi', 'Kemasan Kering', 'Barcode'],
      short_description: 'Stiker kertas coated untuk label indoor dan kebutuhan promosi.',
      notes: 'Tidak direkomendasikan untuk area yang sering terkena air atau kelembapan tinggi.',
      status: 'ACTIVE', display_order: 9
    },
    {
      material_id: 'MAT-VINYL-STICKER', material_name: 'Sticker Vinyl', material_slug: 'sticker-vinyl', material_group: 'sticker',
      preview_image: '/assets/images/material-finishing/material-sticker-vinyl.webp', type: 'Synthetic Sticker', grammage: '-', surface: 'Halus', color: 'Putih', thickness: 'Standar vinyl',
      characteristics: ['Tahan air', 'Fleksibel', 'Tidak mudah sobek', 'Cocok indoor dan outdoor terbatas'],
      recommended_uses: ['Label Botol', 'Kemasan Dingin', 'Stiker Kaca', 'Branding Produk', 'Dekorasi'],
      short_description: 'Stiker sintetis yang lebih tahan terhadap air dan kelembapan.',
      notes: 'Jenis adhesive dan laminasi disesuaikan permukaan tempel serta kondisi penggunaan.',
      status: 'ACTIVE', display_order: 10
    },
    {
      material_id: 'MAT-BOOKPAPER-72', material_name: 'Book Paper 72 gsm', material_slug: 'book-paper-72-gsm', material_group: 'paper',
      preview_image: '/assets/images/material-finishing/material-book-paper-72-gsm.webp', type: 'Uncoated Book Paper', grammage: '72 gsm', surface: 'Lembut', color: 'Krem', thickness: 'Ringan',
      characteristics: ['Nyaman dibaca', 'Ringan', 'Tidak menyilaukan', 'Cocok halaman banyak'],
      recommended_uses: ['Novel', 'Buku Bacaan', 'Buku Teks', 'Jurnal', 'Publikasi'],
      short_description: 'Kertas krem ringan yang nyaman untuk bacaan panjang.',
      notes: 'Warna krem mengurangi pantulan cahaya dan memberikan pengalaman membaca lebih nyaman.',
      status: 'ACTIVE', display_order: 11
    },
    {
      material_id: 'MAT-FANCY-LINEN', material_name: 'Fancy & Linen Paper', material_slug: 'fancy-linen-paper', material_group: 'special',
      preview_image: '/assets/images/material-finishing/material-fancy-linen-paper.webp', type: 'Specialty Paper', grammage: 'Beragam', surface: 'Bertekstur', color: 'Beragam', thickness: 'Beragam',
      characteristics: ['Tekstur khas', 'Tampilan premium', 'Pilihan warna beragam', 'Cocok untuk aksen'],
      recommended_uses: ['Undangan', 'Cover', 'Wrapping Rigid Box', 'Kartu', 'Hang Tag'],
      short_description: 'Kertas khusus bertekstur untuk produk premium dan identitas visual yang unik.',
      notes: 'Tekstur dan warna dipilih berdasarkan konsep desain serta metode cetak yang digunakan.',
      status: 'ACTIVE', display_order: 12
    }
  ],
  finishings: [
    {
      finishing_id: 'FIN-LAM-DOFF', finishing_name: 'Laminasi Doff', finishing_slug: 'laminasi-doff', finishing_group: 'lamination', preview_image: '/assets/images/material-finishing/finishing-laminasi-doff.webp',
      effect: 'Permukaan lembut dengan pantulan rendah.', characteristics: ['Kesan premium', 'Pantulan rendah', 'Melindungi permukaan', 'Nyaman disentuh'],
      recommended_uses: ['Packaging', 'Cover Buku', 'Paper Bag', 'Kartu', 'Brosur Premium'], recommended_combinations: ['Hot Foil Emas', 'Spot UV', 'Emboss'],
      notes: 'Cocok untuk desain elegan dan dapat dikombinasikan dengan finishing selektif.', status: 'ACTIVE', display_order: 1
    },
    {
      finishing_id: 'FIN-LAM-GLOSSY', finishing_name: 'Laminasi Glossy', finishing_slug: 'laminasi-glossy', finishing_group: 'lamination', preview_image: '/assets/images/material-finishing/finishing-laminasi-glossy.webp',
      effect: 'Permukaan mengilap dengan warna tampak lebih hidup.', characteristics: ['Pantulan tinggi', 'Warna lebih cerah', 'Mudah dibersihkan', 'Melindungi cetakan'],
      recommended_uses: ['Label', 'Kemasan Retail', 'Menu', 'Cover', 'Materi Promosi'], recommended_combinations: ['Die Cut', 'Varnish'],
      notes: 'Cocok untuk produk yang membutuhkan tampilan cerah dan permukaan mudah dibersihkan.', status: 'ACTIVE', display_order: 2
    },
    {
      finishing_id: 'FIN-HOT-FOIL-GOLD', finishing_name: 'Hot Foil Emas', finishing_slug: 'hot-foil-emas', finishing_group: 'foil', preview_image: '/assets/images/material-finishing/finishing-hot-foil-emas.webp',
      effect: 'Aksen metalik emas pada area desain tertentu.', characteristics: ['Mewah', 'Reflektif', 'Menonjolkan logo', 'Memerlukan dies'],
      recommended_uses: ['Rigid Box', 'Undangan', 'Cover Buku', 'Hang Tag', 'Paper Bag'], recommended_combinations: ['Laminasi Doff', 'Emboss', 'Kertas Gelap'],
      notes: 'Area foil perlu disiapkan khusus dan tidak disarankan terlalu tipis atau terlalu rapat.', status: 'ACTIVE', display_order: 3
    },
    {
      finishing_id: 'FIN-HOT-FOIL-SILVER', finishing_name: 'Hot Foil Perak', finishing_slug: 'hot-foil-perak', finishing_group: 'foil', preview_image: '/assets/images/material-finishing/finishing-hot-foil-perak.webp',
      effect: 'Aksen metalik perak untuk tampilan modern.', characteristics: ['Modern', 'Reflektif', 'Kontras tinggi', 'Memerlukan dies'],
      recommended_uses: ['Packaging Teknologi', 'Kartu', 'Cover', 'Label Premium', 'Undangan'], recommended_combinations: ['Laminasi Doff', 'Emboss', 'Warna Navy'],
      notes: 'Memberikan kesan bersih dan modern, terutama pada desain gelap atau minimalis.', status: 'ACTIVE', display_order: 4
    },
    {
      finishing_id: 'FIN-SPOT-UV', finishing_name: 'Spot UV', finishing_slug: 'spot-uv', finishing_group: 'foil', preview_image: '/assets/images/material-finishing/finishing-spot-uv.webp',
      effect: 'Kilap selektif hanya pada bagian tertentu.', characteristics: ['Kontras matte-gloss', 'Menonjolkan elemen', 'Efek premium', 'Selektif'],
      recommended_uses: ['Cover', 'Packaging', 'Kartu Nama', 'Company Profile', 'Agenda'], recommended_combinations: ['Laminasi Doff', 'Emboss'],
      notes: 'Paling efektif di atas laminasi doff untuk menciptakan kontras permukaan.', status: 'ACTIVE', display_order: 5
    },
    {
      finishing_id: 'FIN-EMBOSS', finishing_name: 'Emboss', finishing_slug: 'emboss', finishing_group: 'texture', preview_image: '/assets/images/material-finishing/finishing-emboss.webp',
      effect: 'Elemen desain dibuat timbul dari permukaan.', characteristics: ['Efek sentuh', 'Tampilan eksklusif', 'Menambah dimensi', 'Memerlukan dies'],
      recommended_uses: ['Logo', 'Cover', 'Rigid Box', 'Hang Tag', 'Undangan'], recommended_combinations: ['Hot Foil', 'Laminasi Doff'],
      notes: 'Ketebalan material dan ukuran area emboss memengaruhi ketajaman hasil.', status: 'ACTIVE', display_order: 6
    },
    {
      finishing_id: 'FIN-DEBOSS', finishing_name: 'Deboss', finishing_slug: 'deboss', finishing_group: 'texture', preview_image: '/assets/images/material-finishing/finishing-deboss.webp',
      effect: 'Elemen desain ditekan masuk ke permukaan.', characteristics: ['Elegan', 'Subtil', 'Efek sentuh', 'Cocok desain minimal'],
      recommended_uses: ['Cover', 'Kartu', 'Packaging Premium', 'Notebook', 'Leatherette'], recommended_combinations: ['Hot Foil', 'Kertas Tekstur'],
      notes: 'Memberikan detail yang lebih tenang dibanding emboss dan cocok untuk gaya minimalis.', status: 'ACTIVE', display_order: 7
    },
    {
      finishing_id: 'FIN-DIE-CUT', finishing_name: 'Die Cut / Pond', finishing_slug: 'die-cut-pond', finishing_group: 'cut', preview_image: '/assets/images/material-finishing/finishing-die-cut-pond.webp',
      effect: 'Memotong material mengikuti bentuk khusus.', characteristics: ['Bentuk presisi', 'Fleksibel', 'Mendukung jendela', 'Memerlukan pisau pond'],
      recommended_uses: ['Packaging', 'Hang Tag', 'Folder', 'Label', 'Display'], recommended_combinations: ['Creasing', 'Window', 'Folding'],
      notes: 'Dieline wajib disiapkan dengan benar agar potongan dan lipatan sesuai konstruksi.', status: 'ACTIVE', display_order: 8
    },
    {
      finishing_id: 'FIN-VARNISH', finishing_name: 'Varnish / Coating', finishing_slug: 'varnish', finishing_group: 'lamination', preview_image: '/assets/images/material-finishing/finishing-varnish.webp',
      effect: 'Lapisan pelindung tipis pada permukaan cetak.', characteristics: ['Melindungi tinta', 'Efisien', 'Tersedia matte atau glossy', 'Cocok produksi massal'],
      recommended_uses: ['Kemasan', 'Brosur', 'Label', 'Katalog', 'Lembar Cetak'], recommended_combinations: ['Die Cut', 'Folding'],
      notes: 'Pilihan ekonomis untuk menambah proteksi dan karakter permukaan tanpa film laminasi.', status: 'ACTIVE', display_order: 9
    },
    {
      finishing_id: 'FIN-PERFECT-BINDING', finishing_name: 'Perfect Binding', finishing_slug: 'perfect-binding', finishing_group: 'binding', preview_image: '/assets/images/material-finishing/finishing-perfect-binding.webp',
      effect: 'Jilid lem pada punggung buku dengan hasil rapi.', characteristics: ['Punggung rata', 'Cocok halaman banyak', 'Tampilan profesional', 'Efisien'],
      recommended_uses: ['Buku', 'Katalog', 'Company Profile', 'Majalah Tebal', 'Manual'], recommended_combinations: ['Laminasi Cover', 'Spot UV'],
      notes: 'Ketebalan punggung ditentukan jumlah halaman dan jenis kertas isi.', status: 'ACTIVE', display_order: 10
    },
    {
      finishing_id: 'FIN-HARDCOVER-BINDING', finishing_name: 'Hardcover Binding', finishing_slug: 'hardcover-binding', finishing_group: 'binding', preview_image: '/assets/images/material-finishing/finishing-hardcover-binding.webp',
      effect: 'Jilid cover keras untuk tampilan eksklusif dan tahan lama.', characteristics: ['Sangat kokoh', 'Premium', 'Tahan lama', 'Banyak opsi wrapping'],
      recommended_uses: ['Buku Premium', 'Album', 'Annual Report', 'Agenda', 'Company Profile'], recommended_combinations: ['Hot Foil', 'Emboss', 'Linen'],
      notes: 'Struktur cover, endpaper, dan metode binding disesuaikan jumlah halaman serta fungsi buku.', status: 'ACTIVE', display_order: 11
    },
    {
      finishing_id: 'FIN-WIRO', finishing_name: 'Wiro Binding', finishing_slug: 'wiro-binding', finishing_group: 'binding', preview_image: '/assets/images/material-finishing/finishing-wiro-binding.webp',
      effect: 'Jilid kawat double-loop yang dapat dibuka rata.', characteristics: ['Mudah dibuka', 'Fungsional', 'Pilihan warna wiro', 'Cocok halaman interaktif'],
      recommended_uses: ['Kalender', 'Agenda', 'Notebook', 'Katalog Sample', 'Manual'], recommended_combinations: ['Cover Laminasi', 'Divider'],
      notes: 'Diameter wiro disesuaikan ketebalan isi dan kebutuhan buka-tutup produk.', status: 'ACTIVE', display_order: 12
    }
  ]
};
