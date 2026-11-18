import { deepCopy, deepCopyArray, deepMergedCopy, includes, escape } from '@/utils/common';

it('"deepCopy" should copy the object deeply', () => {
  const obj = { foo: 1, bar: { baz: 1 } };

  expect(deepCopy(obj)).toEqual(obj);
});

it('"deepCopyArray" should copy the array deeply', () => {
  const arr = [1, 2, ['a', 'b', ['c']], 3, 4];

  expect(deepCopyArray(arr)).toEqual(arr);
});

it('"deepMergedCopy" should merge the objects and copy them deeply', () => {
  const obj1 = { a: 1, b: { c: 1, d: 'a', e: 'c', f: { g: 'd' } } };
  const obj2 = { a: 1, b: { c: 1, d: 'b', h: 'e' } };

  expect(deepMergedCopy(obj1, obj2)).toEqual({
    a: 1,
    b: { c: 1, d: 'b', e: 'c', f: { g: 'd' }, h: 'e' },
  });
});

it('"includes" should check whether the specific element is inlcuded in array', () => {
  expect(includes([1, 2, 3], 1)).toBe(true);
});

describe('escape', () => {
  // This one has a lot of characters after the '<' symbol to make it timeout the jest test if it regresses
  it('should not break on < chars', () => {
    expect(
      escape(
        'foo <bar. The quick brown fox jumped over the lazy dogs. Lorem ipsum dolor es sit. Lorem impsum dolor es sit. Lorem ipsum dolor es sit. Lorem impsum dolor es sit'
      )
    ).toEqual(
      'foo <bar. The quick brown fox jumped over the lazy dogs. Lorem ipsum dolor es sit. Lorem impsum dolor es sit. Lorem ipsum dolor es sit. Lorem impsum dolor es sit'
    );
  });

  it('should escape HTML', () => {
    expect(escape('Foo <a href="bar">baz</a> quux')).toEqual('Foo \\<a href="bar">baz\\</a> quux');
  });

  it("should escape HTML even if there's a comment", () => {
    expect(escape('Foo <a href="bar">baz</a><!-- this is a comment --> quux')).toEqual(
      'Foo \\<a href="bar">baz\\</a>\\<!-- this is a comment --> quux'
    );
  });
});
