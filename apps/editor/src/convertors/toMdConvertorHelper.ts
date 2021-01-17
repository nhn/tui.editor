export function repeat(text: string, count: number) {
  let result = '';

  for (let i = 0; i < count; i += 1) {
    result += text;
  }

  return result;
}

export function escape(text: string, startOfLine?: boolean) {
  const result = text.replace(/[`*\\~[\]]/g, '\\$&');

  if (startOfLine) {
    return result.replace(/^[:#\-*+]/, '\\$&').replace(/^(\d+)\./, '$1\\.');
  }

  return result;
}

export function quote(text: string) {
  let wrap;

  if (text.indexOf('"') === -1) {
    wrap = '""';
  } else {
    wrap = text.indexOf("'") === -1 ? "''" : '()';
  }

  return wrap[0] + text + wrap[1];
}
