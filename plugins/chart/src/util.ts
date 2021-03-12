export function trimKeepingTabs(text: string) {
  return text.replace(/(^(\s*[\n\r])+)|([\n\r]+\s*$)/g, '');
}

export function isNumeric(text: string) {
  const mayBeNum = Number(text);

  return !isNaN(mayBeNum) && isFinite(mayBeNum);
}

export function clamp(value: number, min: number, max: number) {
  if (min > max) {
    [max, min] = [min, max];
  }

  return Math.max(min, Math.min(value, max));
}
