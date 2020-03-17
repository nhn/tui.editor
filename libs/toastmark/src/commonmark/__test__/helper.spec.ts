import { Node, BlockNode, createNode } from '../node';

export function pos(line1: number, col1: number, line2: number, col2: number) {
  return [
    [line1, col1],
    [line2, col2]
  ];
}

export function convertToArrayTree(root: BlockNode, attrs: (keyof BlockNode)[]) {
  function recur(node: Node) {
    const newNode: any = {};
    attrs.forEach(attr => {
      const attrVal = node[attr as keyof Node];
      if (attrVal !== undefined && attrVal !== null) {
        newNode[attr] = attrVal;
      }
    });

    let child = node.firstChild;
    if (child) {
      newNode.children = [];
    }
    while (child) {
      newNode.children.push(recur(child));
      child = child.next;
    }
    return newNode;
  }

  return recur(root);
}

it('convert', () => {
  const list = createNode('list', [
    [1, 1],
    [2, 10]
  ]);
  const listItem1 = createNode('item', [
    [1, 1],
    [1, 10]
  ]);
  const listItem2 = createNode('item', [
    [2, 1],
    [2, 10]
  ]);
  const para = createNode('paragraph', [
    [2, 1],
    [2, 10]
  ]);
  const emph = createNode('emph', [
    [2, 1],
    [2, 5]
  ]);
  const text = createNode('text', [
    [2, 6],
    [2, 10]
  ]);

  list.appendChild(listItem1);
  list.appendChild(listItem2);
  listItem2.appendChild(para);
  para.appendChild(emph);
  para.appendChild(text);

  const attrs: (keyof Node)[] = ['type', 'sourcepos'];
  expect(convertToArrayTree(list, attrs)).toEqual({
    type: 'list',
    sourcepos: [
      [1, 1],
      [2, 10]
    ],
    children: [
      {
        type: 'item',
        sourcepos: [
          [1, 1],
          [1, 10]
        ]
      },
      {
        type: 'item',
        sourcepos: [
          [2, 1],
          [2, 10]
        ],
        children: [
          {
            type: 'paragraph',
            sourcepos: [
              [2, 1],
              [2, 10]
            ],
            children: [
              {
                type: 'emph',
                sourcepos: [
                  [2, 1],
                  [2, 5]
                ]
              },
              {
                type: 'text',
                sourcepos: [
                  [2, 6],
                  [2, 10]
                ]
              }
            ]
          }
        ]
      }
    ]
  });
});
