import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';

const OPTION_CLASSES = [];

let instanceCount = 0;

/**
 * Turns one list item (linked image, linked title, description) into a card.
 * Tolerates unlinked images, missing titles/descriptions and <p>-wrapped content.
 * @param {Element} li
 */
function decorateCard(li) {
  const media = document.createElement('div');
  media.className = 'tabs-adventures-card-image';
  const body = document.createElement('div');
  body.className = 'tabs-adventures-card-body';
  let title = null;
  const description = [];

  // Unwrap paragraphs so all fields are direct children of the item.
  li.querySelectorAll(':scope > p').forEach((p) => p.replaceWith(...p.childNodes));

  [...li.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) description.push(document.createTextNode(text));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.querySelector('picture, img') || node.matches('picture, img')) {
      if (!media.children.length) media.append(node);
      return;
    }
    if (!title && (node.matches('a, strong, b, h2, h3, h4, h5, h6') || node.querySelector('a'))) {
      title = node;
      return;
    }
    // keep inline markup (em, strong, links) in the description
    if (node.textContent.trim()) description.push(node);
  });

  media.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]));
  });

  // decorateButtons sets title="" on image-only links; drop the empty attribute.
  media.querySelectorAll('a[title=""]').forEach((a) => a.removeAttribute('title'));

  if (title) {
    const heading = document.createElement('p');
    heading.className = 'tabs-adventures-card-title';
    heading.append(title);
    body.append(heading);

    // Image link and title link usually share a URL: keep a single tab stop / announcement.
    const titleLink = title.matches('a') ? title : title.querySelector('a');
    const imageLink = media.querySelector('a');
    if (titleLink && imageLink && imageLink.href === titleLink.href) {
      imageLink.tabIndex = -1;
      imageLink.setAttribute('aria-hidden', 'true');
    }
  }
  if (description.length) {
    const desc = document.createElement('p');
    desc.className = 'tabs-adventures-card-description';
    description.forEach((node, i) => {
      if (i) desc.append(' ');
      desc.append(node);
    });
    // single-line truncated in CSS; expose the full text on hover
    desc.title = desc.textContent.trim();
    body.append(desc);
  }

  li.className = 'tabs-adventures-card';
  li.replaceChildren();
  if (media.children.length) li.append(media);
  if (body.children.length) li.append(body);
}

/**
 * Tabs Adventures: one row per tab, cell 1 = label, cell 2 = list of cards.
 * Renders a tab button list and a card-grid panel per tab.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));
  instanceCount += 1;
  const prefix = `tabs-adventures-${instanceCount}`;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-adventures-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children].filter((row) => row.children.length);
  const panels = [];
  const buttons = [];

  rows.forEach((row, i) => {
    const [labelCell, ...contentCells] = [...row.children];
    const label = labelCell.textContent.trim() || `Tab ${i + 1}`;
    const id = `${prefix}-${toClassName(label) || i}-${i}`;

    const panel = document.createElement('div');
    panel.className = 'tabs-adventures-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('aria-hidden', i !== 0);

    contentCells.forEach((cell) => panel.append(...cell.childNodes));
    panel.querySelectorAll('ul, ol').forEach((list) => {
      if (list.parentElement.closest('li')) return; // ignore nested lists
      list.classList.add('tabs-adventures-cards');
      [...list.children].forEach((li) => decorateCard(li));
    });

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-adventures-tab';
    button.id = `tab-${id}`;
    button.textContent = label;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    button.setAttribute('aria-selected', i === 0);
    button.tabIndex = i === 0 ? 0 : -1;

    panels.push(panel);
    buttons.push(button);
    tablist.append(button);
  });

  const select = (index) => {
    buttons.forEach((btn, j) => {
      btn.setAttribute('aria-selected', j === index);
      btn.tabIndex = j === index ? 0 : -1;
    });
    panels.forEach((panel, j) => panel.setAttribute('aria-hidden', j !== index));
  };

  buttons.forEach((button, i) => {
    button.addEventListener('click', () => select(i));
    button.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % buttons.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + buttons.length) % buttons.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = buttons.length - 1;
      if (next !== null) {
        e.preventDefault();
        select(next);
        buttons[next].focus();
      }
    });
  });

  block.replaceChildren(tablist, ...panels);
}
