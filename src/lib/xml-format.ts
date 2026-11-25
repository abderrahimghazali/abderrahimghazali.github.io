/** Indents the single-line XML produced by buildUbl. Elements that hold only text stay on one line. */
export function prettyXml(xml: string): string {
  const tokens = xml.match(/<[^>]+>|[^<]+/g) ?? [];
  const out: string[] = [];
  let depth = 0;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (!t.startsWith('<') && t.trim() === '') continue;
    const pad = '  '.repeat(depth);
    if (t.startsWith('<?')) out.push(t);
    else if (t.startsWith('</')) {
      depth = Math.max(0, depth - 1);
      out.push('  '.repeat(depth) + t);
    } else if (t.startsWith('<') && !t.endsWith('/>')) {
      const next = tokens[i + 1];
      const after = tokens[i + 2];
      if (next !== undefined && !next.startsWith('<') && after?.startsWith('</')) {
        out.push(pad + t + next + after);
        i += 2;
      } else {
        out.push(pad + t);
        depth++;
      }
    } else out.push(pad + t);
  }
  return out.join('\n') + '\n';
}
