const reURL = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/([^\s]*))?$/g;
const encodingRegExps = [/\(/g, /\)/g, /\[/g, /\]/g, /</g, />/g];
const encodedList = ['%28', '%29', '%5B', '%5D', '%3C', '%3E'];
const escapedList = ['\\(', '\\)', '\\[', '\\]', '\\<', '\\>'];

export function decodeURIGraceful(uri: string) {
  const uriList = uri.split(' ');

  return uriList
    .reduce<string[]>((decodedURIList, targetUri) => {
      let decodedURI = '';

      try {
        decodedURI = decodeURIComponent(targetUri);
      } catch (e) {
        decodedURI = targetUri;
      }

      return decodedURIList.concat(decodedURI);
    }, [])
    .join('%20');
}

export function encodeMarkdownText(text: string, encode: boolean) {
  const expectedValues = encode ? encodedList : escapedList;

  return encodingRegExps.reduce(
    (result, regExp, index) => result.replace(regExp, expectedValues[index]),
    text
  );
}

export function decodeURL(text: string) {
  return text.replace(reURL, (matched) => encodeMarkdownText(decodeURIGraceful(matched), true));
}
