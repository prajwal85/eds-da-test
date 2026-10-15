/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-adventures. Base: tabs.
 * Source: https://wknd.site/us/en/adventures.html
 * Selector: .tabs.panelcontainer
 * Output: one row per tab. Cell 1 = tab label, cell 2 = <ul> where each <li>
 * holds a linked image, a linked title and the description text.
 * Generated: 2026-10-15
 */
export default function parse(element, { document }) {
  const tabsRoot = element.querySelector('.cmp-tabs') || element;

  // Only this tabs component's own tabs/panels (guard against nested tabs).
  const ownerOf = (el) => el.closest('.cmp-tabs');
  const tabs = [...tabsRoot.querySelectorAll('.cmp-tabs__tab')]
    .filter((t) => ownerOf(t) === tabsRoot || tabsRoot === element);
  const panels = [...tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')]
    .filter((p) => ownerOf(p) === tabsRoot || tabsRoot === element);

  const fixImg = (img) => {
    const lazy = img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
    const src = img.getAttribute('src') || '';
    if (lazy && (!src || src.startsWith('data:'))) img.setAttribute('src', lazy);
    return img;
  };

  // Iterate the inner <article> wrappers (not the anchors) to avoid inline-merge collapse.
  const buildList = (panel) => {
    const ul = document.createElement('ul');
    let items = [...panel.querySelectorAll('.cmp-image-list__item-content')];
    if (!items.length) items = [...panel.querySelectorAll('.cmp-image-list__item')];
    items.forEach((item) => {
      const li = document.createElement('li');
      const imgLinkSrc = item.querySelector('.cmp-image-list__item-image-link');
      const titleLinkSrc = item.querySelector('.cmp-image-list__item-title-link');
      const href = (titleLinkSrc && titleLinkSrc.getAttribute('href'))
        || (imgLinkSrc && imgLinkSrc.getAttribute('href')) || '';
      const img = item.querySelector('img');
      const titleText = (item.querySelector('.cmp-image-list__item-title') || titleLinkSrc || {}).textContent;
      const descEl = item.querySelector('.cmp-image-list__item-description');

      if (img) {
        fixImg(img);
        if (href) {
          const a = document.createElement('a');
          a.setAttribute('href', href);
          a.append(img);
          const p = document.createElement('p');
          p.append(a);
          li.append(p);
        } else {
          const p = document.createElement('p');
          p.append(img);
          li.append(p);
        }
      }
      if (titleText && titleText.trim()) {
        const p = document.createElement('p');
        if (href) {
          const a = document.createElement('a');
          a.setAttribute('href', href);
          a.textContent = titleText.trim();
          p.append(a);
        } else {
          p.textContent = titleText.trim();
        }
        li.append(p);
      }
      if (descEl && descEl.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = descEl.textContent.trim();
        li.append(p);
      }
      if (li.childNodes.length) ul.append(li);
    });
    return ul;
  };

  const cells = [];
  tabs.forEach((tab, i) => {
    // Label text, stripping any trailing count like "Climbing (4)"
    const label = tab.textContent.replace(/\s+/g, ' ').replace(/\s*\(\d+\)\s*$/, '').trim();
    // Pair by id convention ("...-tab" -> "...-tabpanel"), aria-controls, then index.
    let panel = null;
    const controls = tab.getAttribute('aria-controls');
    if (controls) panel = panels.find((p) => p.id === controls) || null;
    if (!panel && tab.id && tab.id.endsWith('-tab')) {
      const pid = `${tab.id}panel`;
      panel = panels.find((p) => p.id === pid) || null;
    }
    if (!panel) panel = panels[i] || null;
    const content = panel ? buildList(panel) : '';
    cells.push([label, content && content.children.length ? content : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-adventures', cells });
  element.replaceWith(block);
}
