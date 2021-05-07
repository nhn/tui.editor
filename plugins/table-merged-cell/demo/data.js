// merge cell example1
const content1 = [
  '| @cols=2:mergedHead1 | @cols=3:mergedHead2 |',
  '| --- | --- | --- | --- | --- |',
  '| @cols=2:mergedCell1-1 | cell1-2 | @cols=2:@rows=5:mergedCell1-3 |',
  '| @rows=2:mergedCell2-1 | @rows=2:mergedCell2-2 | cell2-3 | cell2-4 | cell2-5 | cell2-6 |',
  '| cell3-1 |',
  '| cell4-1 | cell4 | cell4-3 |',
  '| cell5-1 | cell5-2 | cell5-3 | cell5-4 |',
  '',
].join('\n');

// merge cell example2
const content2 = [
  '| @cols=2:merged | @cols=5:merged |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  '| @cols=2:merged | table |  |  |  | table2 |',
  '| @rows=2:merged | @rows=2:table | table2 |  |  |  | asdf |',
  '| table |  |  |  | table2 |',
  '| @cols=3:@rows=2:merged |  |  |  | table2 |',
  '|  |  |  | table |',
].join('\n');

// normal cell example
const content3 = [
  '| a | b| c | d |',
  '| --- | --- | --- | --- |',
  '| table | table2 | table3 | table4 |',
  '| table5 | table6 | table7 | table8 |',
  '| table9 | table10 | table11 | table22 |',
].join('\n');
