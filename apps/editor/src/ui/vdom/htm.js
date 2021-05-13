import { assign } from '@/utils/common';

// @TODO: change syntax with our convention
/* eslint-disable */
export default function (n) {
  for (
    var l,
      e,
      s = arguments,
      t = 1,
      r = '',
      u = '',
      a = [0],
      c = function (n) {
        t === 1 && (n || (r = r.replace(/^\s*\n\s*|\s*\n\s*$/g, '')))
          ? a.push(n ? s[n] : r)
          : t === 3 && (n || r)
          ? ((a[1] = n ? s[n] : r), (t = 2))
          : t === 2 && r === '...' && n
          ? (a[2] = assign(a[2] || {}, s[n]))
          : t === 2 && r && !n
          ? ((a[2] = a[2] || {})[r] = !0)
          : t >= 5 &&
            (t === 5
              ? (((a[2] = a[2] || {})[e] = n ? (r ? r + s[n] : s[n]) : r), (t = 6))
              : (n || r) && (a[2][e] += n ? r + s[n] : r)),
          (r = '');
      },
      h = 0;
    h < n.length;
    h++
  ) {
    h && (t === 1 && c(), c(h));
    for (let i = 0; i < n[h].length; i++)
      (l = n[h][i]),
        t === 1
          ? l === '<'
            ? (c(), (a = [a, '', null]), (t = 3))
            : (r += l)
          : t === 4
          ? r === '--' && l === '>'
            ? ((t = 1), (r = ''))
            : (r = l + r[0])
          : u
          ? l === u
            ? (u = '')
            : (r += l)
          : l === '"' || l === "'"
          ? (u = l)
          : l === '>'
          ? (c(), (t = 1))
          : t &&
            (l === '='
              ? ((t = 5), (e = r), (r = ''))
              : l === '/' && (t < 5 || n[h][i + 1] === '>')
              ? (c(),
                t === 3 && (a = a[0]),
                (t = a),
                (a = a[0]).push(this.apply(null, t.slice(1))),
                (t = 0))
              : l === ' ' || l === '\t' || l === '\n' || l === '\r'
              ? (c(), (t = 2))
              : (r += l)),
        t === 3 && r === '!--' && ((t = 4), (a = a[0]));
  }
  return c(), a.length > 2 ? a.slice(1) : a[1];
}
