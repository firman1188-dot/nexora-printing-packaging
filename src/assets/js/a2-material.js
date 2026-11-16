/* Material & Finishing: kartu 3D, kelompok dinamis, produk terkait dari portofolio.
   URL: ?type=material|finishing&group=<nama>&id=<slug> */
(() => {
  const root = document.querySelector('[data-mf-app]');
  if (!root) return;
  const $ = (s) => root.querySelector(s) || document.querySelector(s);
  const stage = $('[data-stage]'), chips = $('[data-chips]');
  const el = { no: $('[data-no]'), cn: $('[data-cat]'), tt: $('[data-title]'), sp: $('[data-spec]'), ask: $('[data-ask]'), see: $('[data-see]') };
  const esc = NXStack.esc;
  const tint = { 'Kertas Cetak': '47,123,255', 'Board & Packaging': '53,224,255', 'Sticker & Label': '243,58,136', 'Bahan Lainnya': '255,122,47', 'Laminasi & Coating': '47,123,255', 'Efek & Tekstur': '53,224,255', 'Foil & Kilap': '255,190,60', 'Potong & Bentuk': '243,58,136', Binding: '160,120,255', Lainnya: '147,160,191' };
  const palette = ['47,123,255', '53,224,255', '255,122,47', '243,58,136', '255,190,60'];
  const colorOf = (g) => tint[g] || palette[[...g].reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length];
  const st = { D: null, mode: 'M', grp: 'Semua', list: [], cur: 0, cards: [], shown: '' };
  const all = () => st.D ? (st.mode === 'M' ? st.D.M : st.D.F) : [];

  const syncUrl = () => {
    const u = new URL(location.href), x = st.list[st.cur];
    u.searchParams.set('type', st.mode === 'M' ? 'material' : 'finishing');
    st.grp === 'Semua' ? u.searchParams.delete('group') : u.searchParams.set('group', st.grp);
    x ? u.searchParams.set('id', x.slug) : u.searchParams.delete('id');
    try { history.replaceState({}, '', u.pathname + u.search); } catch { /* abaikan */ }
  };

  const showItem = () => {
    const x = st.list[st.cur];
    let rail = stage.querySelector('.rail');
    if (!rail) { rail = document.createElement('div'); rail.className = 'rail'; stage.appendChild(rail); }
    if (!x) { el.no.innerHTML = '00<small>/ 0</small>'; el.cn.textContent = ''; el.tt.textContent = 'Belum ada data'; el.sp.innerHTML = ''; rail.innerHTML = ''; st.shown = ''; return; }
    const key = `${st.mode}:${x.id}`;
    if (st.shown === key) return;
    st.shown = key;
    el.no.innerHTML = `${String(st.cur + 1).padStart(2, '0')}<small>/ ${st.list.length}</small>`;
    el.cn.textContent = x.g; el.tt.textContent = x.n;
    el.sp.innerHTML = `<div><dt>Kode</dt><dd>${esc(x.code) || '—'}</dd></div><div><dt>Dipakai pada</dt><dd>${x.use.length} produk</dd></div><div class="w full"><dt>Deskripsi</dt><dd class="clamp">${esc(x.d) || '—'}</dd></div>`;
    NXStack.pulse(el.no, el.cn, el.tt, el.sp);
    const kind = st.mode === 'M' ? 'material' : 'finishing';
    el.ask.textContent = st.mode === 'M' ? 'Tanya Bahan Ini' : 'Tanya Finishing Ini';
    el.ask.href = NXWA.link(`Halo NEXORA, saya ingin berkonsultasi mengenai ${kind}: ${x.n}\nReferensi: ${location.href}`);
    el.see.href = `/portofolio.html?${st.mode === 'M' ? 'material' : 'finishing'}=${encodeURIComponent(x.slug)}`;
    const use = x.use.slice(0, 5);
    rail.innerHTML = '<button class="nv" type="button" data-pv aria-label="Sebelumnya">‹</button>' +
      (use.length ? '<span class="lbl">Dipakai pada</span>' + use.map((p) => `<a class="th" href="/portofolio.html?item=${encodeURIComponent(p.slug)}" title="${esc(p.t)}"><img src="${esc(p.imgs[0])}" alt="${esc(p.t)}" decoding="async"></a>`).join('') : '<span class="lbl">Belum dipakai pada produk aktif</span>') +
      '<button class="nv" type="button" data-nx aria-label="Berikutnya">›</button>';
    rail.querySelector('[data-pv]').onclick = () => go(-1);
    rail.querySelector('[data-nx]').onclick = () => go(1);
    document.documentElement.style.setProperty('--glow', colorOf(x.g));
    syncUrl();
  };
  const layout = (frac = 0) => { NXStack.layout(st.cards, st.cur, frac); if (!frac) showItem(); };
  const go = (k) => { if (!st.list.length) return; st.cur = (st.cur + k + st.list.length) % st.list.length; layout(); };

  const build = (startSlug) => {
    stage.querySelectorAll('.card,.state').forEach((c) => c.remove());
    st.shown = '';
    st.list = st.grp === 'Semua' ? all().slice() : all().filter((x) => x.g === st.grp);
    const idx = startSlug ? st.list.findIndex((x) => x.slug === startSlug) : -1;
    st.cur = idx >= 0 ? idx : Math.min(st.cur, Math.max(0, st.list.length - 1));
    st.cards = st.list.map((x, i) => {
      const d = document.createElement('div'); d.className = 'card still'; const c = colorOf(x.g);
      d.innerHTML = (x.img ? `<img src="${esc(x.img)}" alt="${esc(x.n)}" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async" onerror="this.parentNode.classList.add('noimg')">` : '') +
        `<div class="swatch${x.img ? ' alt' : ''}" style="background:radial-gradient(80% 70% at 30% 20%,rgba(${c},.55),rgba(${c},.12) 60%,#0a1226)"><div><b>${esc(x.code || x.n)}</b><span>FOTO BELUM ADA</span></div></div>` +
        `<span class="tag">${x.real ? 'Foto asli' : x.img ? 'Foto contoh' : 'Swatch'}</span>`;
      d.addEventListener('click', () => { if (i !== st.cur) { st.cur = i; layout(); } });
      stage.appendChild(d);
      return d;
    });
    if (!st.list.length) { const s = document.createElement('div'); s.className = 'state'; s.textContent = 'Belum ada data.'; stage.appendChild(s); }
    const groups = [...new Set(all().map((x) => x.g))];
    const n = (g) => g === 'Semua' ? all().length : all().filter((x) => x.g === g).length;
    chips.innerHTML = ['Semua', ...groups].map((g) => `<button type="button" data-g="${esc(g)}" class="${g === st.grp ? 'on' : ''}">${esc(g)}<b>${n(g)}</b></button>`).join('');
    chips.querySelectorAll('button').forEach((b) => b.onclick = () => { if (st.grp === b.dataset.g) return; st.grp = b.dataset.g; st.cur = 0; build(); layout(); });
    layout();
  };

  const setMode = (m, slug) => {
    st.mode = m; st.grp = 'Semua'; st.cur = 0;
    root.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
    build(slug);
  };
  root.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => { if (st.mode !== b.dataset.mode) setMode(b.dataset.mode); }));
  NXStack.bind(stage, go, { cards: () => st.cards, cur: () => st.cur });
  NXLife.on(window, 'resize', () => layout());

  NX.mf().then((D) => {
    st.D = D;
    const q = new URLSearchParams(location.search);
    const mode = q.get('type') === 'finishing' ? 'F' : 'M';
    st.mode = mode;
    root.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === mode));
    const g = q.get('group');
    st.grp = g && all().some((x) => x.g === g) ? g : 'Semua';
    build(q.get('id'));
  }).catch((e) => { console.warn(e); el.tt.textContent = 'Data belum bisa dimuat'; });
})();
