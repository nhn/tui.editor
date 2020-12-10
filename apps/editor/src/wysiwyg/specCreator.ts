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
import { HardBreak } from './nodes/hardBreak';

import { Strong } from './marks/strong';
import { Emph } from './marks/emph';
import { Strike } from './marks/strike';
import { Link } from './marks/link';
import { Code } from './marks/code';
import { CustomBlock } from './nodes/customBlock';

export function createSpecs() {
  return new SpecManager([
    new Doc(),
    new Paragraph(),
    new Text(),
    new Heading(),
    new CodeBlock(),
    new BulletList(),
    new OrderedList(),
    new ListItem(),
    new BlockQuote(),
    new Table(),
    new TableHead(),
    new TableBody(),
    new TableRow(),
    new TableHeadCell(),
    new TableBodyCell(),
    new Image(),
    new ThematicBreak(),
    new HardBreak(),
    new Strong(),
    new Emph(),
    new Strike(),
    new Link(),
    new Code(),
    new CustomBlock()
  ]);
}
