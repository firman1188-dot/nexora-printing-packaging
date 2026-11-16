/* Portofolio: kartu 3D per produk, beberapa sudut foto, spesifikasi terkunci, label kategori dinamis.
   URL: ?category=<slug>&item=<slug>&material=<slug>&finishing=<slug>
   Ringan: teks & miniatur hanya diganti saat produk berganti; pergantian sudut hanya menyentuh kartu aktif. */
(() => {
  const root = document.querySelector('[data-portfolio-app]');
  if (!root) return;
  const $ = (s) => root.querySelector(s) || document.querySelector(s);
  const stage = $('[data-stage]'), chips = $('[data-chips]'), ctx = $('[data-ctx]');
  const el = { no: $('[data-no]'), cn: $('[data-cat]'), tt: $('[data-title]'), sp: $('[data-spec]'), similar: $('[data-similar]'), detail: $('[data-detail]') };
  const modal = document.querySelector('[data-detail-modal]');
  const esc = NXStack.esc;
  const st = { data: null, cat: 'all', mat: null, fin: null, list: [], cur: 0, ang: [], cards: [], timer: null, shown: -1 };

  const filtered = () => st.data.items.filter((p) => (st.cat === 'all' || p.cid === st.cat) && (!st.mat || p.mids.includes(st.mat)) && (!st.fin || p.fids.includes(st.fin)));

  const syncUrl = () => {
    const u = new URL(location.href);
    const cat = st.cat === 'all' ? null : st.data.categories.find((c) => c.id === st.cat)?.slug;
    const p = st.list[st.cur];
    const mat = st.mat ? st.data.materials.find((m) => m.material_id === st.mat)?.material_slug : null;
    const fin = st.fin ? st.data.finishings.find((m) => m.finishing_id === st.fin)?.finishing_slug : null;
    [['category', cat], ['item', p?.slug], ['material', mat], ['finishing', fin]].forEach(([k, v]) => v ? u.searchParams.set(k, v) : u.searchParams.delete(k));
    try { history.replaceState({}, '', u.pathname + u.search); } catch { /* abaikan */ }
  };

  /* Ganti sudut foto pada kartu aktif saja (tanpa menyentuh teks atau miniatur). */
  const setAngle = (a) => {
    const p = st.list[st.cur], c = st.cards[st.cur];
    if (!p || !c) return;
    const i = st.cur;
    st.ang[i] = (a + p.imgs.length) % p.imgs.length;
    c.querySelectorAll('img').forEach((im, k) => im.classList.toggle('on', k === st.ang[i]));
    c.querySelectorAll('.dots i').forEach((x, k) => x.classList.toggle('d', k <= st.ang[i]));
    const tg = c.querySelector('.tag'); if (tg) tg.textContent = `Sudut ${st.ang[i] + 1} / ${p.imgs.length}`;
    stage.querySelectorAll('.rail .th').forEach((b, k) => b.classList.toggle('on', k === st.ang[i]));
  };

  const buildRail = (p) => {
    let r = stage.querySelector('.rail');
    if (!r) { r = document.createElement('div'); r.className = 'rail'; stage.appendChild(r); }
    r.innerHTML = '<button class="nv" type="button" data-pv aria-label="Produk sebelumnya">‹</button>' +
      p.imgs.map((u, k) => `<button class="th" type="button" data-k="${k}" aria-label="Sudut foto ${k + 1}"><img src="${esc(u)}" alt="" decoding="async" onerror="this.onerror=null;this.src='${NX.fallbackImage}'"></button>`).join('') +
      '<button class="nv" type="button" data-nx aria-label="Produk berikutnya">›</button>';
    r.querySelectorAll('.th').forEach((b) => b.onclick = () => { setAngle(+b.dataset.k); restart(); });
    r.querySelector('[data-pv]').onclick = () => go(-1);
    r.querySelector('[data-nx]').onclick = () => go(1);
  };

  /* Teks, spesifikasi, dan miniatur: hanya diperbarui saat produk berganti. */
  const showProduct = () => {
    const p = st.list[st.cur];
    if (!p) {
      el.no.innerHTML = '00<small>/ 0</small>'; el.cn.textContent = ''; el.tt.textContent = 'Belum ada hasil produksi'; el.sp.innerHTML = '';
      stage.querySelector('.rail')?.remove(); st.shown = -1; return;
    }
    if (st.shown === st.cur) return;
    st.shown = st.cur;
    el.no.innerHTML = `${String(st.cur + 1).padStart(2, '0')}<small>/ ${st.list.length}</small>`;
    el.cn.textContent = p.c; el.tt.textContent = p.t;
    const rows = [['Material', p.m, 1], ['Finishing', p.f, 1], ['Ukuran', p.s], ['Jumlah', p.q], ['Cetak', p.p, 1]];
    el.sp.innerHTML = rows.map(([k, v, w]) => `<div class="${w ? 'w' : ''}"><dt>${k}</dt><dd>${esc(v) || '—'}</dd></div>`).join('');
    NXStack.pulse(el.no, el.cn, el.tt, el.sp);
    buildRail(p);
    setAngle(st.ang[st.cur] || 0);
    syncUrl();
  };

  const layout = (frac = 0) => { NXStack.layout(st.cards, st.cur, frac); if (!frac) showProduct(); };
  const go = (k) => { if (!st.list.length) return; st.cur = (st.cur + k + st.list.length) % st.list.length; layout(); restart(); };
  /* Sudut foto berganti sendiri (pelan) di produk yang sedang dibuka; produk tidak pernah berganti sendiri. */
  const restart = () => {
    clearInterval(st.timer);
    if (!st.list.length) return;
    st.timer = setInterval(() => { if (document.hidden || stage.classList.contains('drag')) return; setAngle(st.ang[st.cur] + 1); }, 3200);
  };

  const buildCards = () => {
    stage.querySelectorAll('.card,.state').forEach((c) => c.remove());
    st.ang = st.list.map(() => 0);
    st.shown = -1;
    st.cards = st.list.map((p, i) => {
      const d = document.createElement('div');
      d.className = 'card';
      d.innerHTML = p.imgs.map((u, k) => `<img src="${esc(u)}" alt="${esc(p.t)}" loading="${k === 0 && i < 6 ? 'eager' : 'lazy'}" decoding="async" class="${k ? '' : 'on'}" onerror="this.onerror=null;this.src='${NX.fallbackImage}'">`).join('') +
        `<div class="dots">${p.imgs.map(() => '<i></i>').join('')}</div><span class="tag"></span>`;
      d.addEventListener('click', () => { if (i !== st.cur) { st.cur = i; layout(); restart(); } });
      stage.appendChild(d);
      return d;
    });
    if (!st.list.length) { const s = document.createElement('div'); s.className = 'state'; s.textContent = 'Belum ada hasil produksi pada filter ini.'; stage.appendChild(s); }
  };

  const renderCtx = () => {
    const out = [];
    if (st.mat) out.push(`<button type="button" data-clear="mat">Material: ${esc(st.data.materials.find((m) => m.material_id === st.mat)?.material_name || '')} ✕</button>`);
    if (st.fin) out.push(`<button type="button" data-clear="fin">Finishing: ${esc(st.data.finishings.find((m) => m.finishing_id === st.fin)?.finishing_name || '')} ✕</button>`);
    ctx.innerHTML = out.join('');
    ctx.querySelectorAll('[data-clear]').forEach((b) => b.onclick = () => { st[b.dataset.clear] = null; refresh(0); });
  };

  const renderChips = () => {
    const base = st.data.items.filter((p) => (!st.mat || p.mids.includes(st.mat)) && (!st.fin || p.fids.includes(st.fin)));
    const n = (id) => id === 'all' ? base.length : base.filter((p) => p.cid === id).length;
    chips.innerHTML = [{ id: 'all', name: 'Semua' }, ...st.data.categories].filter((c) => c.id === 'all' || c.id === st.cat || n(c.id) > 0)
      .map((c) => `<button type="button" data-c="${esc(c.id)}" class="${c.id === st.cat ? 'on' : ''}">${esc(c.name)}<b>${n(c.id)}</b></button>`).join('');
    chips.querySelectorAll('button').forEach((b) => b.onclick = () => { if (st.cat === b.dataset.c) return; st.cat = b.dataset.c; refresh(0); });
  };

  const refresh = (start = 0) => {
    st.list = filtered(); st.cur = Math.min(start, Math.max(0, st.list.length - 1));
    renderCtx(); renderChips(); buildCards(); layout(); restart();
  };

  const specList = (p) => [['Material', p.m], ['Finishing', p.f], ['Ukuran', p.s], ['Jumlah', p.q], ['Cetak', p.p]].filter(([, v]) => v);
  const openDetail = () => {
    const p = st.list[st.cur]; if (!p) return;
    modal.querySelector('[data-detail-title]').textContent = p.t;
    modal.querySelector('[data-detail-body]').innerHTML =
      `<div class="detail-list">${specList(p).concat(p.extra.map((x) => [x.name, x.value])).map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>` +
      (p.desc ? `<p class="lead" style="margin-top:12px">${esc(p.desc)}</p>` : '');
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
  };
  const closeDetail = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
  modal.querySelectorAll('[data-close-detail]').forEach((b) => b.addEventListener('click', closeDetail));
  NXLife.on(document, 'keydown', (e) => { if (e.key === 'Escape') closeDetail(); });
  NXLife.add(() => clearInterval(st.timer));
  el.detail.addEventListener('click', openDetail);
  el.similar.addEventListener('click', () => {
    const p = st.list[st.cur]; if (!p) return;
    window.open(NXWA.link(['Halo NEXORA, saya tertarik membuat produk serupa dengan portofolio berikut:', '', `Produk: ${p.t}`, `Kategori: ${p.c}`, `Referensi: ${location.href}`, '', 'Mohon bantu konsultasi spesifikasi dan penawarannya.'].join('\n')), '_blank', 'noopener');
  });

  NXStack.bind(stage, go, { cards: () => st.cards, cur: () => st.cur });
  NXLife.on(window, 'resize', () => layout());
  NX.catalog().then((data) => {
    st.data = data;
    const q = new URLSearchParams(location.search);
    st.cat = data.categories.find((c) => c.slug === q.get('category'))?.id || 'all';
    st.mat = data.materials.find((m) => m.material_slug === q.get('material'))?.material_id || null;
    st.fin = data.finishings.find((m) => m.finishing_slug === q.get('finishing'))?.finishing_id || null;
    st.list = filtered();
    const idx = st.list.findIndex((p) => p.slug === q.get('item'));
    refresh(idx >= 0 ? idx : 0);
  }).catch((e) => { console.warn(e); el.tt.textContent = 'Data belum bisa dimuat'; });
})();
