const icons = {
  box: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 16 24 7l16 9v17l-16 9-16-9Z"/><path d="m8 16 16 9 16-9M24 25v17M16 12l16 9"/></svg>',
  book: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 10h11c4 0 6 2 6 6v25c0-4-3-6-7-6H7Z"/><path d="M41 10H30c-4 0-6 2-6 6v25c0-4 3-6 7-6h10Z"/></svg>',
  label: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 12h22l10 10-20 20L8 30Z"/><circle cx="15" cy="19" r="2.5"/><path d="m25 17 7 7"/></svg>',
  calendar: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="10" width="34" height="31" rx="3"/><path d="M7 19h34M15 6v8M33 6v8M14 26h5M23 26h5M32 26h3M14 33h5M23 33h5M32 33h3"/></svg>',
  bag: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 16h28l3 27H7Z"/><path d="M17 18v-5c0-5 3-8 7-8s7 3 7 8v5"/></svg>',
  promo: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 22h7l22-11v25L15 26H8Z"/><path d="m15 26 4 14h8l-5-12M38 17c4 2 4 11 0 13"/></svg>',
  custom: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 9l30 30M39 9 9 39"/><path d="m12 8 7 7-4 4-7-7ZM29 29l7 7-4 4-7-7ZM36 8l4 4-7 7-4-4ZM19 29l-7 7-4-4 7-7Z"/></svg>',
  material: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m7 18 17-9 17 9-17 9Z"/><path d="m7 25 17 9 17-9M7 32l17 9 17-9"/></svg>',
  grid: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="7" width="13" height="13" rx="2"/><rect x="28" y="7" width="13" height="13" rx="2"/><rect x="7" y="28" width="13" height="13" rx="2"/><rect x="28" y="28" width="13" height="13" rx="2"/></svg>',
  'chevron-left': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
  'chevron-right': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  share: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/></svg>',
  size: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M8 12h8M12 8v8"/></svg>',
  print: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/><circle cx="18" cy="11" r="1"/></svg>',
  finish: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 3 6 6 .9-4.5 4.4 1.1 6.2L12 17.6 6.4 20.5l1.1-6.2L3 9.9 9 9Z"/></svg>',
  quantity: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h2M14 14h2M8 18h2M14 18h2"/></svg>',
  paper: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 6h17l7 7v29H13Z"/><path d="M30 6v8h8M18 22h14M18 28h14M18 34h10"/></svg>',
  board: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m8 15 16-8 16 8-16 8Z"/><path d="m8 23 16 8 16-8M8 31l16 8 16-8"/></svg>',
  'label-stack': '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="10" width="23" height="18" rx="3"/><rect x="14" y="16" width="23" height="18" rx="3"/><rect x="20" y="22" width="20" height="16" rx="3"/></svg>',
  diamond: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m9 16 8-9h14l8 9-15 25Z"/><path d="M9 16h30M17 7l7 34M31 7l-7 34"/></svg>',
  'circle-dot': '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="4"/></svg>',
  layers: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m7 17 17-9 17 9-17 9Z"/><path d="m7 25 17 9 17-9M7 33l17 9 17-9"/></svg>',
  sparkles: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 5 2.8 8.2L35 16l-8.2 2.8L24 27l-2.8-8.2L13 16l8.2-2.8Z"/><path d="m38 26 1.7 4.8L44 32.5l-4.3 1.7L38 39l-1.7-4.8-4.3-1.7 4.3-1.7ZM10 29l1.4 4L15 34.4l-3.6 1.4-1.4 4-1.4-4L5 34.4 8.6 33Z"/></svg>',
  texture: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 12c8-8 24-8 32 0M8 20c8-8 24-8 32 0M8 28c8-8 24-8 32 0M8 36c8-8 24-8 32 0"/></svg>',
  scissors: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="13" cy="35" r="6"/><circle cx="13" cy="13" r="6"/><path d="m18 17 23 20M18 31 41 11"/></svg>',
  binding: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 8h24v32H15Z"/><path d="M9 11h8M9 17h8M9 23h8M9 29h8M9 35h8"/><path d="M22 15h10M22 22h10M22 29h7"/></svg>',
  quality: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 5 5 4 6-1 3 6 5 3-1 6 3 5-4 5v6l-6 2-4 5-6-2-6 2-4-5-6-2v-6l-4-5 3-5-1-6 5-3 3-6 6 1Z"/><path d="m17 25 5 5 10-11"/></svg>',
  target: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="10"/><circle cx="24" cy="24" r="3"/><path d="M35 13 42 6M34 6h8v8"/></svg>',
  solution: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5a13 13 0 0 0-8 23v6h16v-6A13 13 0 0 0 24 5Z"/><path d="M18 39h12M20 44h8M24 12v12M18 18h12"/></svg>',
  people: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="20" cy="16" r="7"/><path d="M7 39c1-9 6-14 13-14s12 5 13 14"/><circle cx="35" cy="18" r="5"/><path d="M34 27c5 1 8 5 8 12"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"/><path d="M8.5 8.5c.7 3.5 2.5 5.3 6 6"/></svg>'
};

document.querySelectorAll('[data-icon]').forEach((node) => {
  const name = node.getAttribute('data-icon');
  if (icons[name]) node.innerHTML = icons[name];
});

window.NEXORA_ICONS = icons;
