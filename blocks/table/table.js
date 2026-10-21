/*
 * Adapted from Adobe AEM Block Collection's Table block.
 * https://github.com/adobe/aem-block-collection/tree/main/blocks/table
 * Apache License 2.0.
 */

export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const hasHeader = !block.classList.contains('no-header');
  const labels = hasHeader
    ? [...(block.firstElementChild?.children || [])].map((cell) => cell.textContent.trim())
    : [];

  if (hasHeader) table.append(thead);
  table.append(tbody);

  [...block.children].forEach((sourceRow, rowIndex) => {
    const row = document.createElement('tr');
    const isHeader = hasHeader && rowIndex === 0;
    [...sourceRow.children].forEach((sourceCell, columnIndex) => {
      const cell = document.createElement(isHeader ? 'th' : 'td');
      if (isHeader) cell.scope = 'col';
      else if (labels[columnIndex]) cell.dataset.label = labels[columnIndex];
      cell.append(...sourceCell.childNodes);
      row.append(cell);
    });
    (isHeader ? thead : tbody).append(row);
  });

  block.replaceChildren(table);
}
