/**
 * trim whitespace and newlines at head/tail
 * it should not trim \t in tsv
 * @param {string} code - code to trim
 * @returns {string} - trimmed code
 * @ignore
 */
export function trimKeepingTabs(code) {
  return code.replace(/(^(\s*[\n\r])+)|([\n\r]+\s*$)/g, '');
}

/**
 * test given string is numeric
 * @param {string} str - string to be tested
 * @returns {boolean} - true for numeric string
 * @ignore
 */
export function isNumeric(str) {
  return !isNaN(str) && isFinite(str);
}
