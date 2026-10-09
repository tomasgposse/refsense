// refsense probe — paste into any browser automation tool that runs JavaScript on a page
// (or the DevTools console). Returns real numbers about the page's design system.
// It only reads the page; it never changes it.
(() => {
  const els = [...document.querySelectorAll('body *')].filter((el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  });
  const textEls = els.filter((el) =>
    [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1),
  );
  const count = (arr) =>
    Object.entries(arr.reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);

  // Type: families and sizes weighted by how much text uses them.
  const fam = {}, size = {};
  for (const el of textEls) {
    const s = getComputedStyle(el);
    const chars = el.textContent.trim().length;
    const f = s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    fam[f] = (fam[f] || 0) + chars;
    const px = Math.round(parseFloat(s.fontSize));
    size[px] = (size[px] || 0) + chars;
  }
  const sizes = Object.keys(size).map(Number).sort((a, b) => a - b);
  // Body size from real paragraphs: product UI drawn in the DOM would otherwise skew it small.
  const paras = [...document.querySelectorAll('p')].filter((p) => p.textContent.trim().length > 40 && p.getBoundingClientRect().width > 200);
  const pSize = {};
  for (const p of paras) {
    const px = Math.round(parseFloat(getComputedStyle(p).fontSize));
    pSize[px] = (pSize[px] || 0) + p.textContent.trim().length;
  }
  const body = +(Object.entries(pSize).sort((a, b) => b[1] - a[1])[0]?.[0] || Object.entries(size).sort((a, b) => b[1] - a[1])[0]?.[0]);
  const bodyEl = paras.find((p) => Math.round(parseFloat(getComputedStyle(p).fontSize)) === body);
  const measure = bodyEl ? Math.round(bodyEl.getBoundingClientRect().width / (body * 0.5)) : null;
  const onPage = (el) => {
    const r = el.getBoundingClientRect();
    const st = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && r.right > 0 && r.left < innerWidth && st.visibility !== 'hidden' && +st.opacity > 0.05;
  };
  const clean = (t) => t.replace(/\s+/g, ' ').trim();
  const CONSENT = /cookie|consent|accept|reject|preferences|aceptar|rechazar|privacy/i;
  const headings = [...document.querySelectorAll('h1,h2,h3')].filter(onPage).slice(0, 12).map((h) => {
    const s = getComputedStyle(h);
    return {
      tag: h.tagName, text: clean(h.innerText || h.textContent).slice(0, 60), size: s.fontSize, weight: s.fontWeight,
      lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, family: s.fontFamily.split(',')[0],
    };
  });

  // Color: text colors by amount of text, backgrounds by painted area, accent from buttons/links.
  const textColor = {}, bg = {};
  for (const el of textEls) {
    const c = getComputedStyle(el).color;
    textColor[c] = (textColor[c] || 0) + el.textContent.trim().length;
  }
  for (const el of els) {
    const c = getComputedStyle(el).backgroundColor;
    if (c === 'rgba(0, 0, 0, 0)' || c === 'transparent') continue;
    const r = el.getBoundingClientRect();
    bg[c] = (bg[c] || 0) + Math.round((r.width * r.height) / 1000);
  }
  // Actions: things that look like buttons (filled or outlined), not plain text links or consent banners.
  const actions = [...document.querySelectorAll('a,button,[role=button]')].filter((a) => {
    const r = a.getBoundingClientRect();
    const st = getComputedStyle(a);
    const label = clean(a.innerText || '');
    const looksLikeButton = st.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(st.borderTopWidth) > 0;
    return onPage(a) && r.width > 60 && r.height > 28 && r.height < 90 && label.length > 1 && label.length < 40 && looksLikeButton && !CONSENT.test(label);
  });
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k]) => k);

  // Spacing: empty space above each section heading (from the content right before it).
  // Paddings live on different wrappers on every site; the visible gap is what matters.
  const sections = [...document.querySelectorAll('section, main > *')].filter((s) => s.getBoundingClientRect().height > 200);
  const flow = textEls.concat([...document.images]).map((e) => e.getBoundingClientRect())
    .filter((r) => r.height > 0).map((r) => [r.top + scrollY, r.bottom + scrollY]);
  const gaps = [...document.querySelectorAll('h2')].map((h) => {
    const t = h.getBoundingClientRect().top + scrollY;
    const above = flow.filter(([, b]) => b <= t - 1).map(([, b]) => b);
    return above.length ? Math.round(t - Math.max(...above)) : null;
  }).filter((g) => g !== null && g > 0);
  // Layout width: only containers wide enough to hold a page column.
  const widths = els.filter((el) => getComputedStyle(el).maxWidth.endsWith('px'))
    .map((el) => Math.round(parseFloat(getComputedStyle(el).maxWidth))).filter((w) => w >= 600);

  return {
    url: location.href,
    viewport: `${innerWidth}x${innerHeight}`, // 0x0 means the tab is hidden; layout numbers may be off

    pageHeight: document.documentElement.scrollHeight,
    type: {
      families: top(fam, 4),
      bodySize: body,
      sizesUsed: sizes,
      heroToBodyRatio: headings.length ? +(Math.max(...headings.map((h) => parseFloat(h.size))) / body).toFixed(2) : null,
      approxCharsPerLine: measure,
      headings,
      bodyLineHeight: getComputedStyle(bodyEl || document.body).lineHeight,
    },
    color: {
      text: top(textColor, 5),
      backgrounds: top(bg, 6),
      actionBackgrounds: count(actions.map((a) => getComputedStyle(a).backgroundColor)).slice(0, 4),
      isDark: (() => {
        const m = (top(bg, 1)[0] || 'rgb(255,255,255)').match(/\d+/g).map(Number);
        return (m[0] * 299 + m[1] * 587 + m[2] * 114) / 1000 < 128;
      })(),
    },
    spacing: { gapAboveSectionHeadings: gaps, commonMaxWidths: count(widths).slice(0, 4) },
    actions: {
      count: actions.length,
      labels: [...new Set(actions.map((a) => clean(a.innerText)))].slice(0, 12),
      radius: count(actions.map((a) => getComputedStyle(a).borderRadius)).slice(0, 3),
    },
    nav: [...new Set([...document.querySelectorAll('nav a, header a')].map((a) => clean(a.innerText || '')).filter((t) => t && t.length < 30))].slice(0, 12),
    images: document.images.length,
    sectionCount: sections.length,
  };
})();
