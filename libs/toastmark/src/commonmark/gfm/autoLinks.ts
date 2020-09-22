import { SourcePos, createNode, text } from '../node';
import NodeWalker from '../nodeWalker';

const DOMAIN = '(?:[w-]+.)*[A-Za-z0-9-]+.[A-Za-z0-9-]+';
const PATH = '[^<\\s]*[^<?!.,:*_?~\\s]';
const EMAIL = '[\\w.+-]+@(?:[\\w-]+\\.)+[\\w-]+';

export type AutolinkParser = (
  content: string
) => {
  url: string;
  text: string;
  range: [number, number];
}[];

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
  text: string;
  url: string;
  range: [number, number];
}

export function parseEmailLink(source: string) {
  const reEmailLink = new RegExp(EMAIL, 'g');
  const result: LinkInfo[] = [];
  let m;
  while ((m = reEmailLink.exec(source))) {
    const text = m[0];
    if (!/[_-]+$/.test(text)) {
      result.push({
        text,
        range: [m.index, m.index + text.length - 1],
        url: `mailto:${text}`
      });
    }
  }

  return result;
}

export function parseUrlLink(source: string) {
  const reWwwAutolink = new RegExp(`(www|https?://)\.${DOMAIN}${PATH}`, 'g');
  const result: LinkInfo[] = [];
  let m;

  while ((m = reWwwAutolink.exec(source))) {
    const text = trimTrailingEntity(trimUnmatchedTrailingParens(m[0]));
    const scheme = m[1] === 'www' ? 'http://' : '';
    result.push({
      text,
      range: [m.index, m.index + text.length - 1],
      url: `${scheme}${text}`
    });
  }

  return result;
}

function baseAutolinkParser(source: string) {
  return [...parseUrlLink(source), ...parseEmailLink(source)].sort(
    (a, b) => a.range[0] - b.range[0]
  );
}

export function convertExtAutoLinks(walker: NodeWalker, autolinkParser: boolean | AutolinkParser) {
  if (typeof autolinkParser === 'boolean') {
    autolinkParser = baseAutolinkParser;
  }

  let event;
  while ((event = walker.next())) {
    const { entering, node } = event;
    if (entering && node.type === 'text' && node.parent!.type !== 'link') {
      const literal = node.literal!;
      const linkInfos = autolinkParser(literal);

      if (!linkInfos || !linkInfos.length) {
        continue;
      }

      let lastIdx = 0;
      const [lineNum, chPos] = node.sourcepos![0];
      const sourcepos = (startIdx: number, endIdx: number): SourcePos => [
        [lineNum, chPos + startIdx],
        [lineNum, chPos + endIdx]
      ];
      const newNodes = [];
      for (const { range, url, text: linkText } of linkInfos) {
        if (range[0] > lastIdx) {
          newNodes.push(
            text(literal.substring(lastIdx, range[0]), sourcepos(lastIdx, range[0] - 1))
          );
        }
        const linkNode = createNode('link', sourcepos(...range));
        linkNode.appendChild(text(linkText, sourcepos(...range)));
        linkNode.destination = url;
        linkNode.extendedAutolink = true;
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
