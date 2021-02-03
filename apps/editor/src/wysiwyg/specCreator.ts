import SpecManager from '@/spec/specManager';

import { Doc } from './nodes/doc';
import { Paragraph } from './nodes/paragraph';
import { Text } from './nodes/text';
import { Heading } from './nodes/heading';
import { CodeBlock } from './nodes/codeBlock';
import { BulletList } from './nodes/bulletList';
import { OrderedList } from './nodes/orderedList';
import { ListItem } from './nodes/listItem';
import { BlockQuote } from './nodes/blockQuote';
import { Table } from './nodes/table';
import { TableHead } from './nodes/tableHead';
import { TableBody } from './nodes/tableBody';
import { TableRow } from './nodes/tableRow';
import { TableHeadCell } from './nodes/tableHeadCell';
import { TableBodyCell } from './nodes/tableBodyCell';
import { Image } from './nodes/image';
import { ThematicBreak } from './nodes/thematicBreak';

import { Strong } from './marks/strong';
import { Emph } from './marks/emph';
import { Strike } from './marks/strike';
import { Link } from './marks/link';
import { Code } from './marks/code';
import { CustomBlock } from './nodes/customBlock';
import { FrontMatter } from './nodes/frontMatter';
import { ToDOMAdaptor } from '@t/convertor';
import { LinkAttributes } from '@t/editor';

export function createSpecs(toDOMAdaptor: ToDOMAdaptor, linkAttributes: LinkAttributes) {
  return new SpecManager([
    new Doc(),
    new Paragraph(toDOMAdaptor),
    new Text(),
    new Heading(toDOMAdaptor),
    new CodeBlock(toDOMAdaptor),
    new BulletList(toDOMAdaptor),
    new OrderedList(toDOMAdaptor),
    new ListItem(toDOMAdaptor),
    new BlockQuote(toDOMAdaptor),
    new Table(toDOMAdaptor),
    new TableHead(toDOMAdaptor),
    new TableBody(toDOMAdaptor),
    new TableRow(toDOMAdaptor),
    new TableHeadCell(toDOMAdaptor),
    new TableBodyCell(toDOMAdaptor),
    new Image(toDOMAdaptor),
    new ThematicBreak(),
    new Strong(toDOMAdaptor),
    new Emph(toDOMAdaptor),
    new Strike(toDOMAdaptor),
    new Link(toDOMAdaptor, linkAttributes),
    new Code(toDOMAdaptor),
    new CustomBlock(),
    new FrontMatter(),
  ]);
}
