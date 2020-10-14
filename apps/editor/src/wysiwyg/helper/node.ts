export function resolvePosition(docSize: number, from: number, to: number) {
  const resolvedFrom = Math.min(Math.max(from, 0), docSize);
  const resolvedTo = Math.min(Math.max(to, 0), docSize);

  return { from: resolvedFrom, to: resolvedTo };
}
