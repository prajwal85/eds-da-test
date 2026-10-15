import { createOptimizedPicture } from '../../scripts/aem.js';

const OPTION_CLASSES = [];

/**
 * Hero Panel: full-bleed image with an overlapping text panel.
 * Authoring: row 1 = image, row 2 = heading + paragraph.
 * Tolerates image and text in a single row/cell, a missing image, or extra rows.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const media = document.createElement('div');
  media.className = 'hero-panel-media';
  const panel = document.createElement('div');
  panel.className = 'hero-panel-content';

  const firstPicture = block.querySelector('picture');
  if (firstPicture) {
    const img = firstPicture.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt || '', true, [
        { media: '(min-width: 900px)', width: '2000' },
        { width: '900' },
      ]);
      media.append(optimized);
    } else {
      media.append(firstPicture);
    }
    // drop the original picture (and an otherwise-empty wrapping paragraph)
    const parent = firstPicture.parentElement;
    firstPicture.remove();
    if (parent && parent.tagName === 'P' && !parent.textContent.trim() && !parent.children.length) {
      parent.remove();
    }
  }

  // Everything else that carries content becomes the text panel.
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    [...cell.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      panel.append(node);
    });
  });

  block.replaceChildren();
  if (media.children.length) block.append(media);
  else block.classList.add('no-image');
  if (panel.childNodes.length) block.append(panel);
}
