/* Halaman Kontak: satu layar. Di ponsel dua panel (Hubungi / Kirim Pesan) digilir lewat tab.
   Kategori mengikuti data sistem; form dikirim lewat WhatsApp. */
(() => {
  const page = document.querySelector('[data-contact]');
  if (!page) return;
  const form = page.querySelector('[data-contact-form]');
  const sel = page.querySelector('[data-contact-categories]');

  page.querySelectorAll('[data-ctab]').forEach((b) => b.addEventListener('click', () => {
    page.dataset.tab = b.dataset.ctab;
    page.querySelectorAll('[data-ctab]').forEach((x) => x.classList.toggle('on', x === b));
    NXStack.pulse(page.querySelector(`[data-pane="${b.dataset.ctab}"]`));
  }));

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
