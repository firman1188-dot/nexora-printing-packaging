/* NEXORA Print v6.1 — mesin kartu 3D bersama: tata letak berkelanjutan (pecahan), geser mengikuti jari, roda mouse, keyboard.
   Dibuat ringan: tanpa filter CSS, kartu jauh disembunyikan, tidak ada kerja berulang saat geser. */
(() => {
  const isMobile = () => window.innerWidth < 860;

  /** Atur posisi tiap kartu. frac = pergeseran pecahan saat diseret (negatif = ke kiri). */
  const layout = (cards, cur, frac = 0) => {
    const m = isMobile(), n = cards.length;
    const spread = m ? 44 : 118, rot = m ? 14 : 17;
    for (let i = 0; i < n; i += 1) {
      const el = cards[i];
      let d = i - cur;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      d += frac;
      const a = Math.abs(d);
      const hidden = a > 2.6;
      el.classList.toggle('cur', a < 0.5);
      el.style.visibility = hidden ? 'hidden' : 'visible';
      el.style.zIndex = String(30 - Math.round(a * 4));
      el.style.opacity = hidden ? '0' : String(Math.max(0, 1 - a * 0.24).toFixed(3));
      el.style.setProperty('--dim', Math.min(0.55, a * 0.17).toFixed(3));
      el.style.pointerEvents = a > 2.6 ? 'none' : '';
      el.style.transform = `translate3d(-50%,-50%,0) translate3d(${(d * spread * (d > 0 ? 1.12 : 1)).toFixed(1)}px,0,${(-a * 110).toFixed(1)}px) rotateY(${(-d * rot).toFixed(2)}deg) scale(${(1 - a * 0.05).toFixed(3)})`;
    }
  };

  /** Pasang geser (mengikuti jari), roda mouse, dan keyboard.
   *  drag = { cards: () => elemen[], cur: () => indeks } mengaktifkan geser langsung; tanpa drag = geser berambang batas. */
  const bind = (stage, go, drag) => {
    let sx = null, sy = null, moved = false, locked = null, raf = 0, lastDx = 0;
    const step = () => (isMobile() ? 130 : 240);

    stage.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      sx = e.clientX; sy = e.clientY; moved = false; locked = null; lastDx = 0;
    });
    stage.addEventListener('pointermove', (e) => {
      if (sx === null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (locked === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (locked !== 'x') return;
      moved = true; lastDx = dx;
      if (!drag) return;
      if (!stage.classList.contains('drag')) { try { stage.setPointerCapture(e.pointerId); } catch { /* abaikan */ } stage.classList.add('drag'); }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => layout(drag.cards(), drag.cur(), Math.max(-1, Math.min(1, dx / step()))));
    });
    const end = (e) => {
      if (sx === null) return;
      const dx = lastDx;
      sx = null;
      cancelAnimationFrame(raf);
      stage.classList.remove('drag');
      if (locked === 'x' && Math.abs(dx) > 42) go(dx < 0 ? 1 : -1);
      else if (drag) layout(drag.cards(), drag.cur(), 0); // kembali ke posisi semula dengan halus
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    // Setelah menggeser, jangan anggap itu klik pada kartu.
    stage.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);

    let wl = 0;
    stage.addEventListener('wheel', (e) => {
      if (isMobile()) return;
      e.preventDefault();
      if (Date.now() - wl < 420) return;
      wl = Date.now();
      go((e.deltaY || e.deltaX) > 0 ? 1 : -1);
    }, { passive: false });

    NXLife.on(document, 'keydown', (e) => {
      if (e.target.closest && e.target.closest('input,textarea,select,.modal.open')) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    });
  };

  /** Animasi masuk halus untuk teks yang baru diganti. */
  const pulse = (...els) => {
    els.forEach((el) => {
      if (!el) return;
      el.classList.remove('sw');
      void el.offsetWidth; // mulai ulang animasi
      el.classList.add('sw');
    });
  };

  const esc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.NXStack = { layout, bind, pulse, esc, isMobile };
})();
