import { SourcePos, createNode, text } from '../node';
import NodeWalker from '../nodeWalker';

const DOMAIN = '(?:[w-]+.)*[A-Za-z0-9-]+.[A-Za-z0-9-]+';
const PATH = '[^<\\s]*[^<?!.,:*_?~\\s]';
const EMAIL = '[\\w.+-]+@(?:[\\w-]+\\.)+[\\w-]+';

function trimUnmatchedTrailingParens(source: string) {
  const trailingParen = /\)+$/.exec(source);
  if (trailingParen) {
    let count = 0;
    for (const ch of source) {
      if (ch === '(') {
        if (count < 0) {
          count = 1;
        } else {
          count += 1;
        }
      } else if (ch === ')') {
        count -= 1;
      }
    }

    if (count < 0) {
      const trimCount = Math.min(-count, trailingParen[0].length);
      return source.substring(0, source.length - trimCount);
    }
  }
  return source;
}

function trimTrailingEntity(source: string) {
  return source.replace(/&[A-Za-z0-9]+;$/, '');
}

interface LinkInfo {
  linkText: string;
  destination: string;
  range: [number, number];
}

export function parseEmailLink(source: string) {
  const reEmailLink = new RegExp(EMAIL, 'g');
  const result: LinkInfo[] = [];
  let m;
  while ((m = reEmailLink.exec(source))) {
    const linkText = m[0];
    if (!/[_-]+$/.test(linkText)) {
      result.push({
        linkText,
        range: [m.index, m.index + linkText.length - 1],
        destination: `mailto:${linkText}`
      });
    }
  }

  return result.length ? result : null;
}

export function parseUrlLink(source: string) {
  const reWwwAutolink = new RegExp(`(www|https?://)\.${DOMAIN}${PATH}`, 'g');
  const result: LinkInfo[] = [];
  let m;

  while ((m = reWwwAutolink.exec(source))) {
    const linkText = trimTrailingEntity(trimUnmatchedTrailingParens(m[0]));
    const scheme = m[1] === 'www' ? 'http://' : '';
    result.push({
      linkText,
      range: [m.index, m.index + linkText.length - 1],
      destination: `${scheme}${linkText}`
    });
  }

  return result.length ? result : null;
}

export function convertExtAutoLinks(walker: NodeWalker) {
  let event;
  while ((event = walker.next())) {
    const { entering, node } = event;
    if (entering && node.type === 'text') {
      const literal = node.literal!;
      const linkInfos = [...(parseUrlLink(literal) || []), ...(parseEmailLink(literal) || [])].sort(
        (a, b) => a.range[0] - b.range[0]
      );

      if (!linkInfos.length) {
        continue;
      }

      let lastIdx = 0;
      const [lineNum, chPos] = node.sourcepos![0];
      const sourcepos = (startIdx: number, endIdx: number): SourcePos => [
        [lineNum, chPos + startIdx],
        [lineNum, chPos + endIdx]
      ];
      const newNodes = [];
      for (const { range, destination, linkText } of linkInfos) {
        if (range[0] > lastIdx) {
          newNodes.push(
            text(literal.substring(lastIdx, range[0]), sourcepos(lastIdx, range[0] - 1))
          );
        }
        const linkNode = createNode('link', sourcepos(...range));
        linkNode.appendChild(text(linkText, sourcepos(...range)));
        linkNode.destination = destination;
        newNodes.push(linkNode);
        lastIdx = range[1] + 1;
      }
      if (lastIdx < literal.length) {
        newNodes.push(text(literal.substring(lastIdx), sourcepos(lastIdx, literal.length - 1)));
      }

      for (const newNode of newNodes) {
        node.insertBefore(newNode);
      }
      node.unlink();
    }
  }
}
