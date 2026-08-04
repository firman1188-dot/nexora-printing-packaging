(() => {
  const config = window.NEXORA_CONFIG || {};
  const body = document.body;

  // Header states
  const header = document.querySelector('[data-site-header]');
  const megaWrap = document.querySelector('[data-mega-wrap]');
  const megaTrigger = document.querySelector('[data-mega-trigger]');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  const closeMega = () => {
    megaWrap?.classList.remove('open');
    megaTrigger?.setAttribute('aria-expanded', 'false');
  };

  megaTrigger?.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = megaWrap.classList.toggle('open');
    megaTrigger.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (megaWrap && !megaWrap.contains(event.target)) closeMega();
  });

  const setMobileMenu = (isOpen) => {
    if (!mobileMenu || !mobileToggle) return;
    mobileMenu.classList.toggle('open', isOpen);
    mobileToggle.classList.toggle('open', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    mobileToggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    body.classList.toggle('menu-open', isOpen);
  };

  mobileToggle?.addEventListener('click', () => {
    setMobileMenu(!mobileMenu?.classList.contains('open'));
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMobileMenu(false));
  });

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 16);
  }, { passive: true });


  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) setMobileMenu(false);
  }, { passive: true });

  // Active navigation
  const path = window.location.pathname;
  if (path === '/' || path.endsWith('/index.html')) document.querySelector('[data-nav="home"]')?.classList.add('active');
  if (path.includes('portofolio')) document.querySelector('[data-nav="portfolio"]')?.classList.add('active');
  if (path.includes('kontak')) document.querySelector('[data-nav="contact"]')?.classList.add('active');
  if (path.includes('material-finishing')) document.querySelector('[data-nav="material"]')?.classList.add('active');

  const mobileNavKey = path === '/' || path.endsWith('/index.html')
    ? 'home'
    : path.includes('portofolio')
      ? 'portfolio'
      : path.includes('material-finishing')
        ? 'material'
        : path.includes('kontak')
          ? 'contact'
          : '';
  if (mobileNavKey) {
    const activeMobileLink = document.querySelector(`[data-mobile-nav="${mobileNavKey}"]`);
    activeMobileLink?.classList.add('active');
    activeMobileLink?.setAttribute('aria-current', 'page');
  }

  // Business data
  document.querySelectorAll('[data-current-year]').forEach((node) => node.textContent = new Date().getFullYear());
  document.querySelectorAll('[data-business-whatsapp]').forEach((node) => {
    node.href = `https://wa.me/${config.whatsapp || ''}`;
  });
  document.querySelectorAll('[data-business-email]').forEach((node) => {
    node.textContent = config.email || 'info@nexora.id';
    node.href = `mailto:${config.email || 'info@nexora.id'}`;
  });
  document.querySelectorAll('[data-business-address]').forEach((node) => node.textContent = config.address || 'Bandung, Jawa Barat');
  document.querySelectorAll('[data-map-link]').forEach((node) => node.href = config.mapUrl || '#');

  // Consultation wizard
  const modal = document.querySelector('[data-consultation-modal]');
  const form = document.querySelector('[data-consultation-form]');
  const steps = [...document.querySelectorAll('[data-step]')];
  const progress = [...document.querySelectorAll('.consult-progress span')];
  const nextButton = document.querySelector('[data-consult-next]');
  const backButton = document.querySelector('[data-consult-back]');
  const submitButton = document.querySelector('[data-consult-submit]');
  let activeStep = 1;

  const updateWizard = () => {
    steps.forEach((step) => step.classList.toggle('active', Number(step.dataset.step) === activeStep));
    progress.forEach((bar, index) => bar.classList.toggle('active', index < activeStep));
    if (backButton) backButton.disabled = activeStep === 1;
    if (nextButton) nextButton.hidden = activeStep === steps.length;
    if (submitButton) submitButton.hidden = activeStep !== steps.length;
  };

  const openModal = () => {
    modal?.classList.add('open');
    modal?.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    setTimeout(() => modal?.querySelector('input,button')?.focus(), 60);
  };

  const closeModal = () => {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
  };

  document.querySelectorAll('[data-open-consultation]').forEach((button) => button.addEventListener('click', () => {
    setMobileMenu(false);
    openModal();
  }));
  document.querySelectorAll('[data-close-consultation]').forEach((button) => button.addEventListener('click', closeModal));

  nextButton?.addEventListener('click', () => {
    const current = steps.find((step) => Number(step.dataset.step) === activeStep);
    const required = [...current.querySelectorAll('[required]')];
    const valid = required.every((input) => input.type === 'radio'
      ? current.querySelector(`input[name="${input.name}"]:checked`)
      : input.checkValidity());
    if (!valid) {
      current.querySelector('[required]')?.reportValidity();
      return;
    }
    activeStep = Math.min(steps.length, activeStep + 1);
    updateWizard();
  });

  backButton?.addEventListener('click', () => {
    activeStep = Math.max(1, activeStep - 1);
    updateWizard();
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      'Halo NEXORA, saya ingin berkonsultasi mengenai produk cetak.',
      '',
      `Nama: ${data.get('name')}`,
      `Kategori: ${data.get('category')}`,
      `Kesiapan desain: ${data.get('design')}`,
      `Perkiraan jumlah: ${data.get('quantity')}`,
      `Catatan: ${data.get('notes') || '-'}`
    ].join('\n');
    window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  updateWizard();

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
      closeMega();
      setMobileMenu(false);
    }
  });

  // Horizontal rails
  document.querySelectorAll('[data-rail]').forEach((rail) => {
    const viewport = rail.querySelector('[data-rail-viewport]');
    rail.querySelector('[data-rail-prev]')?.addEventListener('click', () => viewport.scrollBy({ left: -viewport.clientWidth * .72, behavior: 'smooth' }));
    rail.querySelector('[data-rail-next]')?.addEventListener('click', () => viewport.scrollBy({ left: viewport.clientWidth * .72, behavior: 'smooth' }));
  });



  // Category product explorer: switch product and its image states without 3D.
  document.querySelectorAll('[data-product-explorer]').forEach((explorer) => {
    const title = explorer.querySelector('[data-explorer-title]');
    const description = explorer.querySelector('[data-explorer-description]');
    const mainImage = explorer.querySelector('[data-explorer-main]');
    const stateButtons = explorer.querySelector('[data-explorer-states]');
    const specTarget = explorer.querySelector('[data-explorer-specs]');

    const activateProduct = (button) => {
      explorer.querySelectorAll('[data-explorer-product]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const images = (button.dataset.images || '').split('|').filter(Boolean);
      const labels = (button.dataset.labels || '').split('|').filter(Boolean);
      const specs = JSON.parse(button.dataset.specs || '{}');
      title.textContent = button.dataset.title || button.textContent.trim();
      description.textContent = button.dataset.description || '';
      if (images[0]) {
        mainImage.src = images[0];
        mainImage.alt = `${button.dataset.title || ''} - ${labels[0] || 'Tampilan'}`;
      }
      stateButtons.innerHTML = '';
      images.forEach((src, index) => {
        const state = document.createElement('button');
        state.type = 'button';
        state.className = `media-thumb${index === 0 ? ' active' : ''}`;
        state.innerHTML = `<img src="${src}" alt=""><span>${labels[index] || `Tampilan ${index + 1}`}</span>`;
        state.addEventListener('click', () => {
          stateButtons.querySelectorAll('button').forEach((item) => item.classList.remove('active'));
          state.classList.add('active');
          mainImage.classList.add('switching');
          setTimeout(() => {
            mainImage.src = src;
            mainImage.alt = `${button.dataset.title || ''} - ${labels[index] || ''}`;
            mainImage.onload = () => mainImage.classList.remove('switching');
          }, 120);
        });
        stateButtons.appendChild(state);
      });
      specTarget.innerHTML = Object.entries(specs).map(([key,value]) => `<div class="spec-row"><span>${key}</span><b>${value}</b></div>`).join('');
    };

    explorer.querySelectorAll('[data-explorer-product]').forEach((button) => button.addEventListener('click', () => activateProduct(button)));
    const initial = explorer.querySelector('[data-explorer-product].active') || explorer.querySelector('[data-explorer-product]');
    if (initial) activateProduct(initial);
  });

  // Media gallery / product states
  document.querySelectorAll('[data-media-gallery]').forEach((gallery) => {
    const main = gallery.querySelector('[data-gallery-main]');
    const label = gallery.querySelector('[data-gallery-label]');
    gallery.querySelectorAll('[data-gallery-src]').forEach((button) => {
      button.addEventListener('click', () => {
        gallery.querySelectorAll('[data-gallery-src]').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        main.classList.add('switching');
        setTimeout(() => {
          main.src = button.dataset.gallerySrc;
          main.alt = button.dataset.galleryAlt || button.textContent.trim();
          if (label) label.textContent = button.dataset.galleryName || button.textContent.trim();
          main.onload = () => main.classList.remove('switching');
        }, 120);
      });
    });
  });

  // Product filters
  document.querySelectorAll('[data-filter-group]').forEach((group) => {
    const targetSelector = group.dataset.filterGroup;
    const targets = [...document.querySelectorAll(targetSelector)];
    group.querySelectorAll('[data-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        group.querySelectorAll('[data-filter]').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        const filter = button.dataset.filter;
        targets.forEach((target) => {
          const match = filter === 'all' || target.dataset.category?.split(' ').includes(filter);
          target.hidden = !match;
        });
      });
    });
  });

  // Material & finishing interactive demo
  document.querySelectorAll('[data-sample-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest('[data-sample-group]');
      group.querySelectorAll('[data-sample-option]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      const preview = group.querySelector('[data-sample-preview]');
      if (!preview) return;
      preview.dataset.sample = button.dataset.sampleOption;
      group.querySelector('[data-sample-title]').textContent = button.dataset.title || button.textContent.trim();
      group.querySelector('[data-sample-description]').textContent = button.dataset.description || '';
    });
  });

  // Portfolio lightbox
  const lightbox = document.querySelector('[data-lightbox]');
  document.querySelectorAll('[data-lightbox-src]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!lightbox) return;
      const image = lightbox.querySelector('img');
      image.src = button.dataset.lightboxSrc;
      image.alt = button.dataset.lightboxAlt || '';
      lightbox.querySelector('[data-lightbox-title]').textContent = button.dataset.lightboxTitle || '';
      lightbox.classList.add('open');
      body.classList.add('modal-open');
    });
  });
  lightbox?.querySelectorAll('[data-lightbox-close]').forEach((button) => button.addEventListener('click', () => {
    lightbox.classList.remove('open');
    body.classList.remove('modal-open');
  }));
})();
