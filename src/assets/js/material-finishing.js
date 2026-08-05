(() => {
  const root = document.querySelector('[data-mf-app]');
  if (!root) return;

  const config = window.NEXORA_CONFIG || {};
  const state = {
    data: null,
    portfolios: [],
    mode: 'material',
    group: 'all',
    page: 1,
    pageSize: 12,
    selectedId: null
  };

  const elements = {
    modeButtons: [...root.querySelectorAll('[data-mf-mode]')],
    filters: root.querySelector('[data-mf-filters]'),
    grid: root.querySelector('[data-mf-grid]'),
    detail: root.querySelector('[data-mf-detail]'),
    resultText: root.querySelector('[data-mf-result-text]'),
    pagination: root.querySelector('[data-mf-pagination]'),
    status: root.querySelector('[data-mf-status]')
  };

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const icon = (name) => window.NEXORA_ICONS?.[name] || '';
  const resolvePageSize = () => window.matchMedia('(max-width: 899px)').matches ? 4 : 12;
  const itemsForMode = () => state.mode === 'material' ? state.data.materials : state.data.finishings;
  const groupsForMode = () => state.mode === 'material' ? state.data.material_groups : state.data.finishing_groups;
  const idKey = () => state.mode === 'material' ? 'material_id' : 'finishing_id';
  const nameKey = () => state.mode === 'material' ? 'material_name' : 'finishing_name';
  const slugKey = () => state.mode === 'material' ? 'material_slug' : 'finishing_slug';
  const groupKey = () => state.mode === 'material' ? 'material_group' : 'finishing_group';

  const normalizePortfolio = (payload) => {
    const source = payload?.data || payload || {};
    return (source.portfolio_items || source.items || source.portfolios || [])
      .filter((item) => String(item.status || 'ACTIVE').toUpperCase() === 'ACTIVE')
      .sort((a, b) => Number(a.display_order || 9999) - Number(b.display_order || 9999));
  };

  const loadPortfolio = async () => {
    if (config.portfolioApiUrl) {
      try {
        const response = await fetch(config.portfolioApiUrl, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return normalizePortfolio(await response.json());
      } catch (error) {
        console.warn('Portfolio API gagal pada Material & Finishing, menggunakan data lokal.', error);
      }
    }
    return normalizePortfolio(window.NEXORA_PORTFOLIO_DATA || {});
  };

  const fallbackImage = '/assets/images/material-finishing/sample-fallback.svg';
  const minimumLoaderDuration = 420;
  const loaderMarkup = (label) => `
    <span class="nexora-data-loader" aria-hidden="true">
      <i></i><i></i><i></i><i></i>
    </span>
    <span class="nexora-data-loader-label">${escapeHtml(label)}</span>`;

  const setLoadingState = (loading, label = '') => {
    root.classList.toggle('is-data-loading', loading);
    root.setAttribute('aria-busy', String(loading));
    elements.status.classList.toggle('is-loading', loading);
    elements.status.classList.remove('is-error');
    elements.status.innerHTML = loading ? loaderMarkup(label) : '';
  };

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const localMasterData = () => window.NEXORA_MATERIAL_FINISHING_DATA || { materials: [], finishings: [], material_groups: [], finishing_groups: [] };

  const hasItems = (value) => Array.isArray(value) && value.length > 0;
  const findLocal = (items, idKeyName, slugKeyName, apiItem) => items.find((item) =>
    (apiItem[idKeyName] && item[idKeyName] === apiItem[idKeyName]) ||
    (apiItem[slugKeyName] && item[slugKeyName] === apiItem[slugKeyName]));

  const mergeMaterial = (apiItem, local) => ({
    ...(local || {}),
    ...apiItem,
    material_id: apiItem.material_id || local?.material_id || '',
    material_name: apiItem.material_name || local?.material_name || 'Material',
    material_slug: apiItem.material_slug || local?.material_slug || '',
    material_group: apiItem.material_group || local?.material_group || 'other',
    preview_image: apiItem.preview_image || apiItem.image_url || apiItem.thumbnail_url || local?.preview_image || fallbackImage,
    short_description: apiItem.short_description || apiItem.description || local?.short_description || 'Informasi material tersedia melalui Mobile Control.',
    notes: apiItem.notes || local?.notes || apiItem.description || 'Detail tambahan material belum tersedia.',
    characteristics: hasItems(apiItem.characteristics) ? apiItem.characteristics : (local?.characteristics || []),
    recommended_uses: hasItems(apiItem.recommended_uses) ? apiItem.recommended_uses : (local?.recommended_uses || []),
    status: String(apiItem.status || (apiItem.active === false ? 'INACTIVE' : 'ACTIVE')).toUpperCase(),
    display_order: Number(apiItem.display_order ?? apiItem.sort_order ?? local?.display_order ?? 9999)
  });

  const mergeFinishing = (apiItem, local) => ({
    ...(local || {}),
    ...apiItem,
    finishing_id: apiItem.finishing_id || local?.finishing_id || '',
    finishing_name: apiItem.finishing_name || local?.finishing_name || 'Finishing',
    finishing_slug: apiItem.finishing_slug || local?.finishing_slug || '',
    finishing_group: apiItem.finishing_group || local?.finishing_group || 'other',
    preview_image: apiItem.preview_image || apiItem.image_url || apiItem.thumbnail_url || local?.preview_image || fallbackImage,
    short_description: apiItem.short_description || apiItem.description || local?.short_description || 'Informasi finishing tersedia melalui Mobile Control.',
    effect: apiItem.effect || apiItem.description || local?.effect || 'Efek finishing sesuai spesifikasi produksi.',
    notes: apiItem.notes || local?.notes || apiItem.description || 'Detail tambahan finishing belum tersedia.',
    characteristics: hasItems(apiItem.characteristics) ? apiItem.characteristics : (local?.characteristics || []),
    recommended_uses: hasItems(apiItem.recommended_uses) ? apiItem.recommended_uses : (local?.recommended_uses || []),
    recommended_combinations: hasItems(apiItem.recommended_combinations) ? apiItem.recommended_combinations : (local?.recommended_combinations || []),
    status: String(apiItem.status || (apiItem.active === false ? 'INACTIVE' : 'ACTIVE')).toUpperCase(),
    display_order: Number(apiItem.display_order ?? apiItem.sort_order ?? local?.display_order ?? 9999)
  });

  const mergeApiData = (payload) => {
    const api = payload?.data || payload || {};
    const local = localMasterData();
    const apiMaterials = Array.isArray(api.materials) ? api.materials : [];
    const apiFinishings = Array.isArray(api.finishings) ? api.finishings : [];
    return {
      material_groups: hasItems(api.material_groups) ? api.material_groups : local.material_groups,
      finishing_groups: hasItems(api.finishing_groups) ? api.finishing_groups : local.finishing_groups,
      materials: apiMaterials.map((item) => mergeMaterial(item, findLocal(local.materials, 'material_id', 'material_slug', item))),
      finishings: apiFinishings.map((item) => mergeFinishing(item, findLocal(local.finishings, 'finishing_id', 'finishing_slug', item)))
    };
  };

  const loadData = async () => {
    if (config.materialFinishingApiUrl) {
      try {
        const response = await fetch(config.materialFinishingApiUrl, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return mergeApiData(await response.json());
      } catch (error) {
        console.warn('Master Material & Finishing API gagal, menggunakan data lokal.', error);
      }
    }
    return localMasterData();
  };

  const activeItems = () => itemsForMode()
    .filter((item) => String(item.status || 'ACTIVE').toUpperCase() === 'ACTIVE')
    .filter((item) => state.group === 'all' || item[groupKey()] === state.group)
    .sort((a, b) => Number(a.display_order || 9999) - Number(b.display_order || 9999));

  const currentItem = () => itemsForMode().find((item) => item[idKey()] === state.selectedId);

  const groupName = (groupId) => groupsForMode().find((group) => group.group_id === groupId)?.group_name || '';

  const updateUrl = () => {
    const item = currentItem();
    const url = new URL(window.location.href);
    url.searchParams.set('type', state.mode);
    if (state.group !== 'all') url.searchParams.set('group', state.group); else url.searchParams.delete('group');
    if (item) url.searchParams.set('id', item[slugKey()]); else url.searchParams.delete('id');
    try { history.replaceState({}, '', `${url.pathname}${url.search}`); } catch (error) { if (error?.name !== 'SecurityError') console.warn(error); }
  };

  const renderModes = () => {
    elements.modeButtons.forEach((button) => {
      const active = button.dataset.mfMode === state.mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
  };

  const renderFilters = () => {
    const groups = groupsForMode();
    elements.filters.dataset.mfMode = state.mode;
    elements.filters.style.setProperty('--mf-filter-count', String(Math.max(groups.length, 1)));
    elements.filters.innerHTML = groups.map((group) => `
      <button type="button" class="mf-filter${group.group_id === state.group ? ' active' : ''}" data-mf-group="${escapeHtml(group.group_id)}">
        <span class="mf-filter-icon">${icon(group.icon)}</span>
        <span>${escapeHtml(group.group_name)}</span>
      </button>`).join('');

    elements.filters.querySelectorAll('[data-mf-group]').forEach((button) => {
      button.addEventListener('click', () => {
        state.group = button.dataset.mfGroup;
        state.page = 1;
        state.selectedId = null;
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
      elements.grid.innerHTML = `<div class="mf-empty"><span>${icon('grid')}</span><h2>Belum ada sampel</h2><p>Belum ada data pada kelompok yang dipilih.</p></div>`;
      elements.resultText.textContent = '0 sampel';
      return;
    }

    elements.grid.innerHTML = pageItems.map((item) => {
      const id = item[idKey()];
      const active = id === state.selectedId;
      return `
        <article class="mf-card${active ? ' active' : ''}" data-mf-id="${escapeHtml(id)}">
          <button type="button" aria-label="Lihat detail ${escapeHtml(item[nameKey()])}">
            <span class="mf-card-image"><img src="${escapeHtml(item.preview_image || fallbackImage)}" alt="${escapeHtml(item[nameKey()])}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}'"></span>
            <span class="mf-card-copy"><b>${escapeHtml(item[nameKey()])}</b><small>${escapeHtml(groupName(item[groupKey()]))}</small></span>
            <span class="mf-card-check">${icon('check')}</span>
          </button>
        </article>`;
    }).join('');

    elements.grid.querySelectorAll('[data-mf-id] button').forEach((button) => {
      button.addEventListener('click', () => selectItem(button.closest('[data-mf-id]').dataset.mfId, true));
    });

    elements.resultText.textContent = `Menampilkan ${start + 1}–${Math.min(start + pageItems.length, items.length)} dari ${items.length} ${state.mode === 'material' ? 'material' : 'finishing'}`;
  };

  const renderPagination = (items) => {
    const totalPages = Math.max(1, Math.ceil(items.length / state.pageSize));
    if (totalPages <= 1) {
      elements.pagination.innerHTML = '';
      return;
    }
    elements.pagination.innerHTML = `
      <button type="button" class="page-arrow" data-page="${Math.max(1, state.page - 1)}" ${state.page === 1 ? 'disabled' : ''}>${icon('chevron-left')}</button>
      ${Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => `<button type="button" class="page-number${page === state.page ? ' active' : ''}" data-page="${page}">${page}</button>`).join('')}
      <button type="button" class="page-arrow" data-page="${Math.min(totalPages, state.page + 1)}" ${state.page === totalPages ? 'disabled' : ''}>${icon('chevron-right')}</button>`;
    elements.pagination.querySelectorAll('[data-page]').forEach((button) => button.addEventListener('click', () => {
      state.page = Number(button.dataset.page);
      state.selectedId = null;
      render();
    }));
  };

  const relatedPortfolios = (item) => state.portfolios.filter((portfolio) => state.mode === 'material'
    ? (portfolio.material_ids || []).includes(item.material_id)
    : (portfolio.finishing_ids || []).includes(item.finishing_id));

  const portfolioUrl = (item, portfolio) => {
    const filter = state.mode === 'material' ? `material=${encodeURIComponent(item.material_slug)}` : `finishing=${encodeURIComponent(item.finishing_slug)}`;
    const selected = portfolio ? `&item=${encodeURIComponent(portfolio.slug)}` : '';
    return `/portofolio.html?${filter}${selected}`;
  };

  const materialSpecs = (item) => [
    ['Jenis', item.type || '-'], ['Gramatur', item.grammage || '-'], ['Permukaan', item.surface || '-'], ['Warna', item.color || '-'], ['Ketebalan', item.thickness || '-']
  ];

  const renderDetail = () => {
    const item = currentItem();
    if (!item) {
      elements.detail.innerHTML = `<div class="mf-detail-placeholder"><span>${icon('material')}</span><h2>Pilih sampel</h2><p>Klik salah satu card untuk melihat preview dan informasi lengkap.</p></div>`;
      elements.detail.classList.remove('open');
      return;
    }

    const related = relatedPortfolios(item);
    const isMaterial = state.mode === 'material';
    const specs = isMaterial ? materialSpecs(item) : [['Efek Utama', item.effect || '-'], ['Kelompok', groupName(item.finishing_group)]];
    const characteristics = item.characteristics || [];
    const uses = item.recommended_uses || [];
    const combinations = item.recommended_combinations || [];
    const actionTitle = isMaterial ? 'Butuh Bahan Ini?' : 'Butuh Finishing Ini?';

    elements.detail.innerHTML = `
      <button type="button" class="mf-detail-close" data-mf-detail-close aria-label="Tutup detail">${icon('close')}</button>
      <div class="mf-detail-preview"><img src="${escapeHtml(item.preview_image || fallbackImage)}" alt="${escapeHtml(item[nameKey()])}" onerror="this.onerror=null;this.src='${fallbackImage}'"></div>
      <div class="mf-detail-heading">
        <div><h2>${escapeHtml(item[nameKey()])}</h2><p>${escapeHtml(groupName(item[groupKey()]))}</p></div>
        <button type="button" class="mf-share" data-mf-share>${icon('share')}<span>Bagikan</span></button>
      </div>

      <div class="mf-detail-scroll">
        <div class="mf-info-columns">
          <section>
            <h3>${isMaterial ? 'Spesifikasi' : 'Informasi Finishing'}</h3>
            <dl>${specs.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}</dl>
          </section>
          <section>
            <h3>Karakteristik</h3>
            <ul class="mf-check-list">${characteristics.length ? characteristics.map((value) => `<li>${icon('check')}<span>${escapeHtml(value)}</span></li>`).join('') : '<li class="mf-data-pending"><span>Informasi karakteristik belum tersedia.</span></li>'}</ul>
          </section>
        </div>

        <section class="mf-uses">
          <h3>Cocok Untuk</h3>
          <div>${uses.length ? uses.map((value, index) => `<span>${icon(['box','book','label','calendar','bag','promo'][index % 6])}<b>${escapeHtml(value)}</b></span>`).join('') : '<p class="mf-related-empty">Rekomendasi penggunaan belum tersedia.</p>'}</div>
        </section>

        ${!isMaterial && combinations.length ? `<section class="mf-combinations"><h3>Kombinasi yang Disarankan</h3><div>${combinations.map((value) => `<span>${escapeHtml(value)}</span>`).join('')}</div></section>` : ''}

        <section class="mf-notes"><h3>Catatan</h3><p>${escapeHtml(item.notes || item.short_description || '-')}</p></section>

        <section class="mf-related">
          <div class="mf-related-heading"><h3>Hasil Produksi Terkait</h3><a href="${portfolioUrl(item)}">Lihat Semua ${icon('arrow')}</a></div>
          ${related.length ? `<div class="mf-related-grid">${related.slice(0, 4).map((portfolio) => `<a href="${portfolioUrl(item, portfolio)}" title="${escapeHtml(portfolio.title)}"><img src="${escapeHtml(portfolio.cover_image || fallbackImage)}" alt="${escapeHtml(portfolio.title)}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}'"><span>${escapeHtml(portfolio.title)}</span></a>`).join('')}</div>` : '<p class="mf-related-empty">Belum ada portofolio aktif yang menggunakan pilihan ini.</p>'}
        </section>
      </div>

      <div class="mf-detail-actions">
        <button type="button" class="btn btn-orange" data-mf-consult>${icon('whatsapp')}<span><b>${actionTitle}</b><small>Konsultasi via WhatsApp</small></span></button>
        <a class="btn btn-outline" href="${portfolioUrl(item)}"><span><b>Lihat Portofolio</b><small>Produk menggunakan pilihan ini</small></span>${icon('arrow')}</a>
      </div>`;

    elements.detail.classList.add('open');
    elements.detail.querySelector('[data-mf-detail-close]')?.addEventListener('click', closeDetail);
    elements.detail.querySelector('[data-mf-share]')?.addEventListener('click', shareItem);
    elements.detail.querySelector('[data-mf-consult]')?.addEventListener('click', () => openConsultation(item));
  };

  const selectItem = (id, openMobile = false) => {
    state.selectedId = id;
    renderGrid(activeItems());
    renderDetail();
    updateUrl();
    if (openMobile && window.matchMedia('(max-width: 899px)').matches) {
      document.body.classList.add('mf-detail-open');
      setTimeout(() => elements.detail.querySelector('[data-mf-detail-close]')?.focus(), 40);
    }
  };

  const closeDetail = () => {
    document.body.classList.remove('mf-detail-open');
    if (window.matchMedia('(max-width: 899px)').matches) return;
    state.selectedId = null;
    renderGrid(activeItems());
    renderDetail();
    updateUrl();
  };

  const shareItem = async () => {
    const item = currentItem();
    if (!item) return;
    updateUrl();
    const data = { title: `${item[nameKey()]} — NEXORA`, text: item.short_description || item.effect || '', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(window.location.href);
    } catch (error) { if (error?.name !== 'AbortError') console.warn(error); }
  };

  const openConsultation = (item) => {
    const kind = state.mode === 'material' ? 'material' : 'finishing';
    const message = [
      `Halo NEXORA, saya ingin berkonsultasi mengenai ${kind}:`, '',
      `${state.mode === 'material' ? 'Material' : 'Finishing'}: ${item[nameKey()]}`,
      `Referensi: ${window.location.href}`, '',
      'Mohon bantu rekomendasi spesifikasi dan penerapannya.'
    ].join('\n');
    window.open(`https://wa.me/${config.whatsapp || ''}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  };

  const render = () => {
    renderModes();
    renderFilters();
    const items = activeItems();
    if (!state.selectedId || !items.some((item) => item[idKey()] === state.selectedId)) state.selectedId = items[0]?.[idKey()] || null;
    renderGrid(items);
    renderPagination(items);
    renderDetail();
    updateUrl();
  };

  const applyUrl = () => {
    const params = new URLSearchParams(window.location.search);
    state.mode = params.get('type') === 'finishing' ? 'finishing' : 'material';
    const groups = groupsForMode();
    const requestedGroup = params.get('group');
    state.group = groups.some((group) => group.group_id === requestedGroup) ? requestedGroup : 'all';
    const requestedSlug = params.get('id');
    const selected = itemsForMode().find((item) => item[slugKey()] === requestedSlug);
    state.selectedId = selected?.[idKey()] || null;
  };

  const init = async () => {
    state.pageSize = resolvePageSize();

    // Restore the approved Material & Finishing layout immediately on both
    // desktop and mobile. Local enrichment is rendered first while the public
    // database refresh continues in the background.
    state.data = localMasterData();
    state.portfolios = normalizePortfolio(window.NEXORA_PORTFOLIO_DATA || {});
    applyUrl();

    elements.modeButtons.forEach((button) => button.addEventListener('click', () => {
      state.mode = button.dataset.mfMode;
      state.group = 'all';
      state.page = 1;
      state.selectedId = null;
      document.body.classList.remove('mf-detail-open');
      render();
    }));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && document.body.classList.contains('mf-detail-open')) closeDetail();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const next = resolvePageSize();
        if (next === state.pageSize) return;
        state.pageSize = next;
        state.page = 1;
        render();
      }, 120);
    });

    render();
    setLoadingState(true, 'Menyinkronkan material dan finishing');

    const [[data, portfolios]] = await Promise.all([
      Promise.all([loadData(), loadPortfolio()]),
      wait(minimumLoaderDuration)
    ]);

    state.data = data;
    state.portfolios = portfolios;
    applyUrl();
    setLoadingState(false);
    render();
  };

  init().catch((error) => {
    console.error(error);
    root.classList.remove('is-data-loading');
    root.setAttribute('aria-busy', 'false');
    elements.status.classList.remove('is-loading');
    elements.status.classList.add('is-error');
    elements.status.innerHTML = '<strong>Material & Finishing gagal dimuat.</strong>';
  });
})();
