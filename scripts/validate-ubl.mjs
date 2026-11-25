// Validates the generator's output against the official OASIS UBL 2.1 XSD with xmllint.
// Usage: UBL_XSD=/path/to/UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd npx vite-node scripts/validate-ubl.mjs [file.xml ...]
// With file arguments it validates those files (e.g. a downloaded invoice); without, the built-in samples.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from '../src/lib/invoice-form';
import { samples } from '../src/lib/invoice-samples';

const xsd = process.env.UBL_XSD;
if (!xsd) {
  console.error('Set UBL_XSD to .../UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd (https://docs.oasis-open.org/ubl/os-UBL-2.1/UBL-2.1.zip).');
  process.exit(2);
}
const files = process.argv.slice(2);
const targets = [];
if (files.length) for (const f of files) targets.push([f, f]);
else {
  const dir = mkdtempSync(join(tmpdir(), 'ubl-'));
  for (const [name, form] of Object.entries(samples)) {
    const path = join(dir, `${name}.xml`);
    writeFileSync(path, build(form).xml);
    targets.push([name, path]);
  }
}
let failed = 0;
for (const [name, path] of targets) {
  try {
    execFileSync('xmllint', ['--noout', '--schema', xsd, path], { stdio: 'pipe' });
    console.log(`ok    ${name}`);
  } catch (e) {
    failed++;
    console.log(`FAIL  ${name}\n${String(e.stderr).trim()}`);
  }
}
process.exit(failed ? 1 : 0);
