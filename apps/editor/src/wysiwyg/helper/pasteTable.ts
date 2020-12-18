import { findNodes } from '@/utils/dom';

function convertCopiedTableFromMso(html: string) {
  // wrap with <tr> if html contains dangling <td> tags
  // dangling <td> tag is that tag does not have <tr> as parent node
  if (/<\/td>((?!<\/tr>)[\s\S])*$/i.test(html)) {
    html = `<tr>${html}</tr>`;
  }
  // wrap with <table> if html contains dangling <tr> tags
  // dangling <tr> tag is that tag does not have <table> as parent node
  if (/<\/tr>((?!<\/table>)[\s\S])*$/i.test(html)) {
    html = `<table>${html}</table>`;
  }

  return html;
}

function findTableHeadOrBody(node: Element) {
  let foundNode = node.firstElementChild;

  while (foundNode) {
    if (foundNode.nodeName === 'THEAD' || foundNode.nodeName === 'TBODY') {
      return foundNode;
    }

    foundNode = foundNode.nextElementSibling;
  }

  return null;
}

function createTableHead(columnCount: number) {
  let cells = '';

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    cells += '<th></th>';
  }

  return `<thead><tr>${cells}</tr></thead>`;
}

function convertHtmlToElement(html: string) {
  const container = document.createElement('div') as HTMLElement;

  container.innerHTML = convertCopiedTableFromMso(html);

  return container;
}

export function changeCopiedTable(html: string) {
  const container = convertHtmlToElement(html);
  const tables = findNodes(container, 'table');

  tables.forEach(table => {
    const foundTheadOrTbody = findTableHeadOrBody(table);

    if (foundTheadOrTbody && foundTheadOrTbody.nodeName === 'TBODY') {
      const firstRow = foundTheadOrTbody.firstElementChild;
      const tbody = table.innerHTML;

      if (firstRow && firstRow.children) {
        const tbodyCellCount = firstRow.children.length;
        const thead = createTableHead(tbodyCellCount);

        table.innerHTML = thead + tbody;
      }
    }
  });

  return container.innerHTML;
}
