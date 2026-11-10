// Copy comes from page metadata, so keep each entry on one line and stop
// brackets in a title from closing the link text early.
function oneLine(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function link(title: string, url: string, note?: string | null): string {
  const text = oneLine(title).replace(/[\\[\]]/g, (ch) => `\\${ch}`);
  return note ? `- [${text}](${url}): ${oneLine(note)}` : `- [${text}](${url})`;
}
