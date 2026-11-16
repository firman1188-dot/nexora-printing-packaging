/* NEXORA Print v6 — inti situs: navigasi tanpa muat ulang (latar samudra tetap hidup), data bisnis, wizard Konsultasi. */
(() => {
  const cfg = window.NEXORA_CONFIG || {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const digits = String(cfg.whatsapp || '').replace(/\D/g, '');
  const waLink = (text) => `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  window.NXWA = { link: waLink, digits };

  const fmtWa = (d) => {
    if (!d) return '-';
    const local = d.startsWith('62') ? d.slice(2) : d.replace(/^0/, '');
    const parts = local.length > 10 ? [3, 4, 4] : [3, 4, 3];
    let i = 0; const out = [];
    parts.forEach((n) => { if (i < local.length) out.push(local.slice(i, i + n)); i += n; });
    if (i < local.length) out.push(local.slice(i));
    return `+62 ${out.join('-')}`;
  };

  /** Dipanggil saat halaman pertama dimuat dan setiap kali isi halaman diganti. */
  const refresh = () => {
    const page = document.body.dataset.page || '';
    document.querySelectorAll('[data-nav]').forEach((a) => {
      const on = a.dataset.nav === page;
      a.classList.toggle('active', on);
      on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-business-whatsapp]').forEach((n) => {
      n.href = `https://wa.me/${digits}`;
      if (n.hasAttribute('data-business-whatsapp-label')) n.textContent = `WhatsApp: ${fmtWa(digits)}`;
    });
    document.querySelectorAll('[data-business-email]').forEach((n) => { n.textContent = cfg.email || ''; n.href = `mailto:${cfg.email || ''}`; });
    document.querySelectorAll('[data-business-address]').forEach((n) => { n.textContent = cfg.address || ''; });
    document.querySelectorAll('[data-map-link]').forEach((n) => { n.href = cfg.mapUrl || '#'; });
  };
  refresh();

  /* ---------- Navigasi tanpa muat ulang ---------- */
  const PAGE_SCRIPT = /\/a2-(home|portfolio|material|contact)\.js$/;
  const pathOf = (src) => new URL(src, location.href).pathname;
  const scriptText = new Map();
  let busy = false;

  const loadScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.async = false;
    s.onload = resolve; s.onerror = reject;
    document.body.appendChild(s);
  });
  const runPageScript = async (src) => {
    if (!scriptText.has(src)) scriptText.set(src, await (await fetch(src)).text());
    const s = document.createElement('script');
    s.textContent = scriptText.get(src);
    document.body.appendChild(s);
    s.remove();
  };
  const setMeta = (sel, attr, value) => { const el = document.querySelector(sel); if (el && value != null) el.setAttribute(attr, value); };

  const navigate = async (url, push = true) => {
    if (busy) return;
    busy = true;
    document.body.classList.add('is-leaving');
    try {
      const [res] = await Promise.all([fetch(url, { headers: { Accept: 'text/html' } }), new Promise((r) => setTimeout(r, reduced ? 0 : 540))]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const next = doc.getElementById('app'), app = document.getElementById('app');
      if (!next || !app) throw new Error('struktur halaman tidak dikenali');

      const wanted = [...doc.querySelectorAll('script[src]')].map((s) => s.getAttribute('src'));
      const have = new Set([...document.scripts].filter((s) => s.src).map((s) => pathOf(s.src)));
      for (const src of wanted) { if (!PAGE_SCRIPT.test(pathOf(src)) && !have.has(pathOf(src))) await loadScript(src); }

      NXLife.run(); // hentikan timer & pendengar milik halaman lama
      app.innerHTML = next.innerHTML;
      document.title = doc.title;
      setMeta('meta[name="description"]', 'content', doc.querySelector('meta[name="description"]')?.content);
      setMeta('link[rel="canonical"]', 'href', doc.querySelector('link[rel="canonical"]')?.href);
      document.body.dataset.page = doc.body.dataset.page || '';
      document.body.classList.toggle('is-scroll', doc.body.classList.contains('is-scroll'));
      if (push) history.pushState({}, '', url);
      window.scrollTo(0, 0);
      document.body.classList.remove('is-leaving'); // elemen baru langsung memulai animasi masuk
      refresh();
      for (const src of wanted) { if (PAGE_SCRIPT.test(pathOf(src))) await runPageScript(src); }
    } catch (e) {
      console.warn('Navigasi halus gagal, memuat biasa.', e);
      location.href = url;
      return;
    }
    busy = false;
  };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const raw = a.getAttribute('href') || '';
    if (raw.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(raw)) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || /\.(?:pdf|zip|xml|txt|webmanifest)$/i.test(u.pathname)) return;
    e.preventDefault();
    if (u.pathname === location.pathname && u.search === location.search) return; // sudah di halaman ini
    navigate(u.pathname + u.search + u.hash);
  });
  addEventListener('popstate', () => navigate(location.pathname + location.search, false));
  addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('is-leaving'); });
  window.NXCore = { refresh, navigate };

  /* ---------- Wizard Konsultasi ---------- */
  const modal = document.querySelector('[data-consultation-modal]');
  if (!modal) return;
  const form = modal.querySelector('form');
  const steps = [...modal.querySelectorAll('[data-step]')];
  const bars = [...modal.querySelectorAll('.progress span')];
  const next = modal.querySelector('[data-consult-next]');
  const back = modal.querySelector('[data-consult-back]');
  const send = modal.querySelector('[data-consult-submit]');
  const catBox = modal.querySelector('[data-consult-categories]');
  let step = 1, filled = false;

  const paint = () => {
    steps.forEach((s) => s.classList.toggle('active', Number(s.dataset.step) === step));
    bars.forEach((b, i) => b.classList.toggle('active', i < step));
    back.disabled = step === 1;
    next.hidden = step === steps.length;
    send.hidden = step !== steps.length;
  };
  const fillCategories = async () => {
    if (filled || !catBox) return;
    filled = true;
    let names = [];
    try { names = (await window.NX.catalog()).categories.map((c) => c.name); } catch { /* pakai bawaan */ }
    if (!names.length) names = ['Packaging', 'Label & Sticker', 'Paper Bag', 'Commercial Printing', 'Custom Project'];
    names = [...names, 'Lainnya'];
    catBox.innerHTML = names.map((n, i) => `<label><input type="radio" name="category" value="${window.NXStack.esc(n)}" ${i === 0 ? 'required' : ''}><span>${window.NXStack.esc(n)}</span></label>`).join('');
  };
  const open = (prefill) => {
    fillCategories();
    if (prefill?.notes) form.elements.notes.value = prefill.notes;
    modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => modal.querySelector('input,button')?.focus(), 60);
  };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); };
  window.NXConsult = { open, close };

  // Delegasi klik: tombol "Konsultasi" di konten yang diganti-ganti tetap berfungsi.
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-consultation]')) open();
    if (e.target.closest('[data-close-consultation]')) close();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  next.addEventListener('click', () => {
    const cur = steps.find((s) => Number(s.dataset.step) === step);
    const ok = [...cur.querySelectorAll('[required]')].every((i) => i.type === 'radio' ? cur.querySelector(`input[name="${i.name}"]:checked`) : i.checkValidity());
    if (!ok) { (cur.querySelector('[required]:not(:checked)') || cur.querySelector('[required]'))?.reportValidity?.(); return; }
    step = Math.min(steps.length, step + 1); paint();
  });
  back.addEventListener('click', () => { step = Math.max(1, step - 1); paint(); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const msg = ['Halo NEXORA, saya ingin berkonsultasi mengenai produk cetak.', '', `Nama: ${d.get('name')}`, `Kategori: ${d.get('category')}`, `Kesiapan desain: ${d.get('design')}`, `Perkiraan jumlah: ${d.get('quantity')}`, `Catatan: ${d.get('notes') || '-'}`].join('\n');
    window.open(waLink(msg), '_blank', 'noopener');
  });
  paint();
})();
