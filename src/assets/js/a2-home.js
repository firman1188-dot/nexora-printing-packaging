/* Beranda: tanpa daftar produk (produk ada di Portofolio). Hanya angka ringkas dan label kategori
   yang dibaca dari data sistem (Agent Project Finance), sehingga otomatis ikut bertambah. */
(() => {
  const stats = document.querySelector('[data-stats]');
  const chips = document.querySelector('[data-chips]');
  if (!stats || !chips) return;
  const esc = NXStack.esc;

  NX.catalog().then(async (data) => {
    const count = (id) => data.items.filter((x) => x.cid === id).length;
    const active = data.categories.filter((c) => count(c.id) > 0);
    chips.innerHTML = active.map((c) => `<a href="/portofolio.html?category=${encodeURIComponent(c.slug)}">${esc(c.name)}<b>${count(c.id)}</b></a>`).join('');
    const parts = [[data.items.length, 'hasil produksi'], [active.length, 'kategori']];
    try { const mf = await NX.mf(); parts.push([mf.M.length, 'material'], [mf.F.length, 'finishing']); } catch { /* angka material opsional */ }
    stats.innerHTML = parts.filter(([n]) => n > 0).map(([n, l]) => `<span><b>${n}</b> ${l}</span>`).join('');
  }).catch((e) => { console.warn(e); stats.textContent = ''; });
})();
