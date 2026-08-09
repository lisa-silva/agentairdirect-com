const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const auditUrl = 'https://agentair-suite-dcrsxgdbuubhvvdrwndupw.streamlit.app/audit';

test('free audit section names every prospect-safe PDF output', () => {
  for (const item of [
    'Current AI visibility score',
    'Modeled post-optimization score',
    'Number of optimization opportunities',
    'Verified strengths',
    'Optional revenue-opportunity estimate'
  ]) assert.match(html, new RegExp(item, 'i'));
});

test('free audit scope separates opportunity assessment from paid implementation', () => {
  assert.match(html, /High-level assessment only\./);
  assert.match(html, /does not include detailed findings, supporting evidence, technical fixes, or remediation instructions/i);
  assert.match(html, /provided as part of paid implementation/i);
});

test('all prominent free-audit CTAs use the verified deployed route', () => {
  const ctas = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>\s*Run Your Free(?: AI Visibility)? Audit\s*<\/a>/g)];
  assert.ok(ctas.length >= 5);
  for (const cta of ctas) assert.equal(cta[1], auditUrl);
});

test('revenue modeling discloses the exact formula and status of assumptions', () => {
  assert.match(html, /monthly customers × average customer value × 20% modeled AI-referred customer uplift × 12% modeled conversion uplift/i);
  assert.match(html, /illustrative modeling assumptions only/i);
  assert.match(html, /not guarantees, predictions, or industry averages/i);
});
