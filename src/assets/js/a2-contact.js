/* Halaman Kontak: kategori mengikuti data sistem; form dikirim lewat WhatsApp. */
(() => {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const sel = form.querySelector('[data-contact-categories]');
  NX.catalog().then((d) => {
    const names = [...d.categories.map((c) => c.name), 'Lainnya'];
    sel.innerHTML = names.map((n) => `<option>${NXStack.esc(n)}</option>`).join('');
  }).catch(() => { sel.innerHTML = '<option>Lainnya</option>'; });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const msg = ['Halo NEXORA, saya ingin berkonsultasi.', '', `Nama: ${d.get('name')}`, `WhatsApp: ${d.get('phone')}`, `Kategori: ${d.get('category')}`, `Jumlah: ${d.get('quantity') || '-'}`, `Pesan: ${d.get('message')}`].join('\n');
    window.open(NXWA.link(msg), '_blank', 'noopener');
  });
})();
