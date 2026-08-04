(() => {
  const root = document.querySelector('[data-portfolio-app]');
  if (!root) return;

  const config = window.NEXORA_CONFIG || {};
  const state = {
    data: null,
    category: 'all',
    material: null,
    finishing: null,
    page: 1,
    pageSize: 12,
    selectedId: null,
    selectedImageIndex: 0,
    detailOpen: false
  };


  const resolvePageSize = () => {
    if (window.matchMedia('(max-width: 899px)').matches) return 4;
    if (window.matchMedia('(max-width: 1280px)').matches) return 6;
    return 12;
  };

  const elements = {
    filters: root.querySelector('[data-portfolio-filters]'),
    context: root.querySelector('[data-portfolio-filter-context]'),
    grid: root.querySelector('[data-portfolio-grid]'),
    resultText: root.querySelector('[data-portfolio-result-text]'),
    pagination: root.querySelector('[data-portfolio-pagination]'),
    detail: root.querySelector('[data-portfolio-detail]'),
    status: root.querySelector('[data-portfolio-status]')
  };

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const formatQuantity = (value, unit) => {
    if (value === null || value === undefined || value === '') return '-';
    return `${new Intl.NumberFormat('id-ID').format(Number(value))} ${unit || ''}`.trim();
  };

  const icon = (name) => window.NEXORA_ICONS?.[name] || '';

  const normalizeData = (payload) => {
    const source = payload?.data || payload || {};
    const categories = source.categories || source.portfolio_categories || [];
    const materials = source.materials || source.master_materials || [];
    const finishings = source.finishings || source.master_finishings || [];
    const items = source.portfolio_items || source.items || source.portfolios || [];

    return {
      categories,
      materials,
      finishings,
      portfolio_items: items
        .filter((item) => String(item.status || 'ACTIVE').toUpperCase() === 'ACTIVE')
        .sort((a, b) => Number(a.display_order || 9999) - Number(b.display_order || 9999))
    };
  };

  const loadData = async () => {
    if (config.portfolioApiUrl) {
      try {
        const response = await fetch(config.portfolioApiUrl, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return normalizeData(await response.json());
      } catch (error) {
        console.warn('Portfolio API gagal, menggunakan data lokal.', error);
      }
    }
    return normalizeData(window.NEXORA_PORTFOLIO_DATA || {});
  };

  const categoryById = (id) => state.data.categories.find((item) => item.category_id === id);
  const categoryBySlug = (slug) => state.data.categories.find((item) => item.category_slug === slug);
  const materialById = (id) => state.data.materials.find((item) => item.material_id === id);
  const materialBySlug = (slug) => state.data.materials.find((item) => item.material_slug === slug);
  const finishingById = (id) => state.data.finishings.find((item) => item.finishing_id === id);
  const finishingBySlug = (slug) => state.data.finishings.find((item) => item.finishing_slug === slug);

  const getFilteredItems = () => state.data.portfolio_items.filter((item) => {
    const categoryMatch = state.category === 'all' || item.category_id === state.category;
    const materialMatch = !state.material || (item.material_ids || []).includes(state.material);
    const finishingMatch = !state.finishing || (item.finishing_ids || []).includes(state.finishing);
    return categoryMatch && materialMatch && finishingMatch;
  });

  const updateUrl = () => {
    const url = new URL(window.location.href);
    const category = state.category === 'all' ? null : categoryById(state.category)?.category_slug;
    const material = state.material ? materialById(state.material)?.material_slug : null;
    const finishing = state.finishing ? finishingById(state.finishing)?.finishing_slug : null;
    const item = state.selectedId ? state.data.portfolio_items.find((entry) => entry.portfolio_id === state.selectedId)?.slug : null;

    [['category', category], ['material', material], ['finishing', finishing], ['item', item]].forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    });
    try {
      history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    } catch (error) {
      // Opaque/file preview origins may block history mutation; UI remains functional.
      if (error?.name !== 'SecurityError') console.warn('Gagal memperbarui URL portofolio.', error);
    }
  };

  const renderFilters = () => {
    const filters = [
      { category_id: 'all', category_name: 'Semua', icon: 'grid' },
      ...state.data.categories
    ];

    elements.filters.innerHTML = filters.map((category) => `
      <button type="button" class="portfolio-filter${state.category === category.category_id ? ' active' : ''}" data-category-id="${escapeHtml(category.category_id)}">
        <span class="portfolio-filter-icon">${icon(category.icon)}</span>
        <span>${escapeHtml(category.category_name)}</span>
      </button>
    `).join('');

    elements.filters.querySelectorAll('[data-category-id]').forEach((button) => {
      button.addEventListener('click', () => {
        state.category = button.dataset.categoryId;
        state.page = 1;
        state.selectedId = null;
        state.selectedImageIndex = 0;
        render();
      });
    });
  };

  const renderFilterContext = () => {
    const chips = [];
    if (state.material) {
      const item = materialById(state.material);
      chips.push(`<button type="button" data-clear-filter="material">Material: <b>${escapeHtml(item?.material_name || state.material)}</b> ×</button>`);
    }
    if (state.finishing) {
      const item = finishingById(state.finishing);
      chips.push(`<button type="button" data-clear-filter="finishing">Finishing: <b>${escapeHtml(item?.finishing_name || state.finishing)}</b> ×</button>`);
    }
    elements.context.innerHTML = chips.length ? `<span>Filter aktif:</span>${chips.join('')}` : '';
    elements.context.hidden = chips.length === 0;
    elements.context.querySelectorAll('[data-clear-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        state[button.dataset.clearFilter] = null;
        state.page = 1;
        render();
      });
    });
  };

  const renderGrid = (items) => {
    const totalPages = Math.max(1, Math.ceil(items.length / state.pageSize));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.pageSize;
    const pageItems = items.slice(start, start + state.pageSize);

    if (!pageItems.length) {
      elements.grid.innerHTML = `
        <div class="portfolio-empty">
          <span class="portfolio-empty-icon">${icon('grid')}</span>
          <h2>Belum ada hasil produksi</h2>
          <p>Belum ada portofolio yang memenuhi seluruh filter yang dipilih.</p>
          <button type="button" class="btn btn-orange" data-open-consultation>Konsultasi Sekarang</button>
        </div>`;
      elements.resultText.textContent = '0 portofolio';
      elements.grid.querySelector('[data-open-consultation]')?.addEventListener('click', () => document.querySelector('.header-actions [data-open-consultation]')?.click());
      return;
    }

    elements.grid.innerHTML = pageItems.map((item) => {
      const category = categoryById(item.category_id);
      const active = item.portfolio_id === state.selectedId;
      return `
        <article class="portfolio-result-card${active ? ' active' : ''}" data-portfolio-id="${escapeHtml(item.portfolio_id)}">
          <button type="button" aria-label="Lihat detail ${escapeHtml(item.title)}">
            <span class="portfolio-card-image"><img src="${escapeHtml(item.cover_image)}" alt="${escapeHtml(item.image_alt_text || item.title)}" loading="lazy"></span>
            <span class="portfolio-card-copy">
              <b>${escapeHtml(item.title)}</b>
              <small>${escapeHtml(category?.category_name || '')}</small>
            </span>
            <span class="portfolio-card-check" aria-hidden="true">${icon('check')}</span>
          </button>
        </article>`;
    }).join('');

    elements.grid.querySelectorAll('[data-portfolio-id] button').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('[data-portfolio-id]');
        selectItem(card.dataset.portfolioId, true);
      });
    });

    const first = start + 1;
    const last = Math.min(start + pageItems.length, items.length);
    elements.resultText.textContent = `Menampilkan ${first}–${last} dari ${items.length} portofolio`;
  };

  const renderPagination = (items) => {
    const totalPages = Math.max(1, Math.ceil(items.length / state.pageSize));
    if (totalPages <= 1) {
      elements.pagination.innerHTML = '';
      return;
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    elements.pagination.innerHTML = `
      <button type="button" class="page-arrow" data-page="${Math.max(1, state.page - 1)}" ${state.page === 1 ? 'disabled' : ''} aria-label="Halaman sebelumnya">${icon('chevron-left')}</button>
      ${pages.map((page) => `<button type="button" class="page-number${page === state.page ? ' active' : ''}" data-page="${page}">${page}</button>`).join('')}
      <button type="button" class="page-arrow" data-page="${Math.min(totalPages, state.page + 1)}" ${state.page === totalPages ? 'disabled' : ''} aria-label="Halaman berikutnya">${icon('chevron-right')}</button>`;

    elements.pagination.querySelectorAll('[data-page]').forEach((button) => {
      button.addEventListener('click', () => {
        state.page = Number(button.dataset.page);
        state.selectedId = null;
        render();
      });
    });
  };

  const detailImage = (item) => (item.gallery_images?.length ? item.gallery_images : [item.cover_image]);

  const renderDetail = () => {
    const item = state.data.portfolio_items.find((entry) => entry.portfolio_id === state.selectedId);
    if (!item) {
      elements.detail.innerHTML = `
        <div class="portfolio-detail-placeholder">
          <span>${icon('grid')}</span>
          <h2>Pilih hasil produksi</h2>
          <p>Klik salah satu foto untuk melihat preview besar dan informasi teknisnya.</p>
        </div>`;
      elements.detail.classList.remove('open');
      return;
    }

    const category = categoryById(item.category_id);
    const materials = (item.material_ids || []).map((id) => materialById(id)?.material_name).filter(Boolean);
    const finishings = (item.finishing_ids || []).map((id) => finishingById(id)?.finishing_name).filter(Boolean);
    const images = detailImage(item);
    state.selectedImageIndex = Math.min(state.selectedImageIndex, images.length - 1);
    const currentImage = images[state.selectedImageIndex] || item.cover_image;
    const additional = [...(item.additional_specifications || [])].sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));

    elements.detail.innerHTML = `
      <button type="button" class="portfolio-detail-close" data-detail-close aria-label="Tutup detail">${icon('close')}</button>
      <div class="portfolio-preview">
        <img src="${escapeHtml(currentImage)}" alt="${escapeHtml(item.image_alt_text || item.title)}">
        ${images.length > 1 ? `
          <button type="button" class="preview-arrow prev" data-image-step="-1" aria-label="Foto sebelumnya">${icon('chevron-left')}</button>
          <button type="button" class="preview-arrow next" data-image-step="1" aria-label="Foto berikutnya">${icon('chevron-right')}</button>
          <div class="preview-dots">${images.map((_, index) => `<button type="button" class="${index === state.selectedImageIndex ? 'active' : ''}" data-image-index="${index}" aria-label="Foto ${index + 1}"></button>`).join('')}</div>` : ''}
      </div>

      <div class="portfolio-detail-heading">
        <div>
          <h2>${escapeHtml(item.title)}</h2>
          <p>${escapeHtml(category?.category_name || '')}</p>
        </div>
        <button type="button" class="portfolio-share" data-share-portfolio>${icon('share')}<span>Bagikan</span></button>
      </div>

      <section class="portfolio-spec-card" aria-labelledby="portfolio-spec-title">
        <h3 id="portfolio-spec-title">Spesifikasi Teknis</h3>
        <div class="portfolio-spec-columns">
          <dl class="portfolio-main-specs">
            <div><dt>${icon('material')}<span>Material</span></dt><dd>${escapeHtml(materials.join(', ') || '-')}</dd></div>
            <div><dt>${icon('size')}<span>Ukuran</span></dt><dd>${escapeHtml(item.size?.display || item.size || '-')}</dd></div>
            <div><dt>${icon('print')}<span>Cetak</span></dt><dd>${escapeHtml(item.printing_method || '-')}</dd></div>
            <div><dt>${icon('finish')}<span>Finishing</span></dt><dd>${escapeHtml(finishings.join(', ') || '-')}</dd></div>
            <div><dt>${icon('quantity')}<span>Jumlah</span></dt><dd>${escapeHtml(formatQuantity(item.production_quantity, item.production_unit))}</dd></div>
          </dl>
          <div class="portfolio-extra-specs">
            <h4>Spesifikasi Tambahan</h4>
            ${additional.length ? `<ul>${additional.map((spec) => `<li><span>${escapeHtml(spec.name)}</span><b>${escapeHtml(spec.value)}</b></li>`).join('')}</ul>` : '<p>Tidak ada spesifikasi tambahan.</p>'}
          </div>
        </div>
      </section>

      <section class="portfolio-description">
        <h3>Deskripsi Produk</h3>
        <p>${escapeHtml(item.description || '-')}</p>
      </section>

      <div class="portfolio-detail-actions">
        <button type="button" class="btn btn-orange" data-similar-product>${icon('whatsapp')}Buat Produk Serupa</button>
        <button type="button" class="btn btn-outline" data-open-consultation>Konsultasi Sekarang ${icon('arrow')}</button>
      </div>`;

    elements.detail.classList.add('open');

    elements.detail.querySelector('[data-detail-close]')?.addEventListener('click', closeDetail);
    elements.detail.querySelectorAll('[data-image-step]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedImageIndex = (state.selectedImageIndex + Number(button.dataset.imageStep) + images.length) % images.length;
        renderDetail();
      });
    });
    elements.detail.querySelectorAll('[data-image-index]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedImageIndex = Number(button.dataset.imageIndex);
        renderDetail();
      });
    });
    elements.detail.querySelector('[data-share-portfolio]')?.addEventListener('click', shareSelected);
    elements.detail.querySelector('[data-similar-product]')?.addEventListener('click', () => openSimilarProduct(item));
    elements.detail.querySelector('[data-open-consultation]')?.addEventListener('click', () => {
      document.querySelector('.header-actions [data-open-consultation]')?.click();
    });
  };

  const selectItem = (id, openMobile = false) => {
    state.selectedId = id;
    state.selectedImageIndex = 0;
    state.detailOpen = true;
    renderGrid(getFilteredItems());
    renderDetail();
    updateUrl();
    if (openMobile && matchMedia('(max-width: 899px)').matches) {
      document.body.classList.add('portfolio-detail-open');
      setTimeout(() => elements.detail.querySelector('[data-detail-close]')?.focus(), 40);
    }
  };

  const closeDetail = () => {
    document.body.classList.remove('portfolio-detail-open');
    state.detailOpen = false;
    if (matchMedia('(max-width: 899px)').matches) {
      elements.detail.classList.remove('open');
      return;
    }
    state.selectedId = null;
    state.selectedImageIndex = 0;
    renderGrid(getFilteredItems());
    renderDetail();
    updateUrl();
  };

  const shareSelected = async () => {
    const item = state.data.portfolio_items.find((entry) => entry.portfolio_id === state.selectedId);
    if (!item) return;
    updateUrl();
    const shareData = { title: `${item.title} — NEXORA`, text: item.description, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        const button = elements.detail.querySelector('[data-share-portfolio] span');
        if (button) {
          const original = button.textContent;
          button.textContent = 'Tautan disalin';
          setTimeout(() => button.textContent = original, 1600);
        }
      }
    } catch (error) {
      if (error?.name !== 'AbortError') console.warn('Gagal membagikan portofolio.', error);
    }
  };

  const openSimilarProduct = (item) => {
    const category = categoryById(item.category_id)?.category_name || '-';
    const message = [
      'Halo NEXORA, saya tertarik membuat produk serupa dengan portofolio berikut:',
      '',
      `Produk: ${item.title}`,
      `Kategori: ${category}`,
      `Referensi: ${window.location.href}`,
      '',
      'Mohon bantu konsultasi spesifikasi dan penawarannya.'
    ].join('\n');
    window.open(`https://wa.me/${config.whatsapp || ''}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  };

  const render = () => {
    renderFilters();
    renderFilterContext();
    const filtered = getFilteredItems();

    if (!state.selectedId || !filtered.some((item) => item.portfolio_id === state.selectedId)) {
      state.selectedId = filtered[0]?.portfolio_id || null;
      state.selectedImageIndex = 0;
    }

    renderGrid(filtered);
    renderPagination(filtered);
    renderDetail();
    updateUrl();
  };

  const applyUrlFilters = () => {
    const params = new URLSearchParams(window.location.search);
    const category = categoryBySlug(params.get('category'));
    const material = materialBySlug(params.get('material'));
    const finishing = finishingBySlug(params.get('finishing'));
    const selected = state.data.portfolio_items.find((item) => item.slug === params.get('item'));

    state.category = category?.category_id || 'all';
    state.material = material?.material_id || null;
    state.finishing = finishing?.finishing_id || null;
    state.selectedId = selected?.portfolio_id || null;
  };

  const init = async () => {
    elements.status.textContent = 'Memuat portofolio…';
    state.pageSize = resolvePageSize();
    state.data = await loadData();
    applyUrlFilters();
    elements.status.textContent = '';
    render();

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && document.body.classList.contains('portfolio-detail-open')) closeDetail();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const nextPageSize = resolvePageSize();
        if (nextPageSize === state.pageSize) return;
        state.pageSize = nextPageSize;
        state.page = 1;
        render();
      }, 120);
    });
  };

  init().catch((error) => {
    console.error(error);
    elements.status.innerHTML = '<strong>Portofolio gagal dimuat.</strong><br>Periksa sumber data atau koneksi API.';
  });
})();
