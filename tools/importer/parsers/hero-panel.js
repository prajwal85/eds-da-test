/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-panel. Base: hero.
 * Source: https://wknd.site/us/en/adventures.html
 * Selector: .teaser.cmp-teaser--hero
 * Output: row 1 = image, row 2 = heading + description paragraph(s).
 * Generated: 2026-10-15
 */
export default function parse(element, { document }) {
  // Image: .cmp-teaser__image img (fallback: any img in the teaser)
  const img = element.querySelector('.cmp-teaser__image img') || element.querySelector('img');
  if (img) {
    // Handle lazy-loaded images: promote data-src if src is missing/placeholder
    const lazy = img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
    const src = img.getAttribute('src') || '';
    if (lazy && (!src || src.startsWith('data:'))) img.setAttribute('src', lazy);
  }

  // Heading: .cmp-teaser__title (normalise to h2)
  const titleEl = element.querySelector('.cmp-teaser__title') || element.querySelector('h1, h2, h3');
  let heading = null;
  if (titleEl && titleEl.textContent.trim()) {
    if (titleEl.tagName === 'H2') {
      heading = titleEl;
      heading.textContent = titleEl.textContent.trim();
    } else {
      heading = document.createElement('h2');
      heading.textContent = titleEl.textContent.trim();
    }
  }

  // Description: paragraphs inside .cmp-teaser__description (fallback: wrap text in <p>)
  const descWrap = element.querySelector('.cmp-teaser__description');
  const paragraphs = [];
  if (descWrap) {
    const ps = [...descWrap.querySelectorAll('p')].filter((p) => p.textContent.trim());
    if (ps.length) {
      paragraphs.push(...ps);
    } else if (descWrap.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = descWrap.textContent.trim();
      paragraphs.push(p);
    }
  }

  // CTA links in the teaser (optional)
  const ctas = [...element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a')];

  if (!img && !heading && !paragraphs.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (img) cells.push([img]);
  const contentCell = [];
  if (heading) contentCell.push(heading);
  contentCell.push(...paragraphs);
  ctas.forEach((a) => {
    const p = document.createElement('p');
    p.append(a);
    contentCell.push(p);
  });
  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-panel', cells });
  element.replaceWith(block);
}
