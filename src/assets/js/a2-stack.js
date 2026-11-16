/* NEXORA Print v6 — mesin kartu 3D bersama (tata letak, geser, roda mouse, keyboard). */
(() => {
  const isMobile = () => window.innerWidth < 860;

  /** Atur transform tiap kartu relatif terhadap kartu aktif. */
  const layout = (cards, cur) => {
    const m = isMobile(), n = cards.length;
    cards.forEach((el, i) => {
      let d = i - cur;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      const a = Math.abs(d);
      el.classList.toggle('cur', !d);
      el.style.zIndex = 30 - a;
      el.style.opacity = a > 3 ? 0 : 1 - a * .22;
      el.style.pointerEvents = a > 3 ? 'none' : '';
      el.style.filter = a ? `brightness(${1 - a * .16}) saturate(.85)` : 'none';
      el.style.transform = `translate(-50%,-50%) translateX(${d * (m ? 46 : 118) * (d > 0 ? 1.12 : 1)}px) translateZ(${-a * 110}px) rotateY(${-d * (m ? 14 : 17)}deg) scale(${1 - a * .05})`;
    });
  };

  /** Pasang geser/roda/keyboard. go(+1|-1) dipanggil oleh halaman. */
  const bind = (stage, go) => {
    let sx = null, sy = null;
    stage.style.touchAction = 'pan-y';
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
    stage.addEventListener('pointerup', (e) => {
      if (sx !== null && Math.abs(e.clientX - sx) > 50 && Math.abs(e.clientX - sx) > Math.abs(e.clientY - sy)) go(e.clientX < sx ? 1 : -1);
      sx = null;
    });
    let wl = 0;
    stage.addEventListener('wheel', (e) => {
      if (isMobile()) return;
      e.preventDefault();
      if (Date.now() - wl < 520) return;
      wl = Date.now();
      go((e.deltaY || e.deltaX) > 0 ? 1 : -1);
    }, { passive: false });
    NXLife.on(document, 'keydown', (e) => {
      if (e.target.closest && e.target.closest('input,textarea,select,.modal.open')) return;
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    });
  };

  /** Ambil warna dominan gambar untuk cahaya kartu (aman bila CORS menolak). */
  const glow = (url) => {
    try {
      const im = new Image();
      im.crossOrigin = 'anonymous';
      im.onload = () => {
        try {
          const c = document.createElement('canvas'); c.width = c.height = 8;
          const x = c.getContext('2d'); x.drawImage(im, 0, 0, 8, 8);
          const d = x.getImageData(0, 0, 8, 8).data; let r = 0, g = 0, b = 0;
          for (let k = 0; k < d.length; k += 4) { r += d[k]; g += d[k + 1]; b += d[k + 2]; }
          const n = d.length / 4, s = 200 / (Math.max(r, g, b) / n || 1);
          document.documentElement.style.setProperty('--glow', [r / n * s, g / n * s, b / n * s].map((v) => Math.min(255, Math.round(v))).join(','));
        } catch { /* biarkan warna bawaan */ }
      };
      im.src = url;
    } catch { /* abaikan */ }
  };

  const esc = (v = '') => String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.NXStack = { layout, bind, glow, esc, isMobile };
})();
