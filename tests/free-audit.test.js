const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const privateAuditUrl = 'https://agentair-suite-dcrsxgdbuubhvvdrwndupw.streamlit.app/audit';

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

test('all prominent free-audit CTAs lead to the contact form', () => {
  const ctas = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>\s*Get Your Free(?: AI Visibility)? Audit\s*<\/a>/g)];
  assert.ok(ctas.length >= 5);
  for (const cta of ctas) assert.equal(cta[1], '#contact');
  assert.doesNotMatch(html, new RegExp(privateAuditUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('free-audit form keeps required fields, optional goals, and FormSubmit metadata', () => {
  assert.match(html, /<form action="https:\/\/formsubmit\.co\/hello@agentairdirect\.com"[\s\S]*?aria-label="Request a free AI visibility audit">/);
  for (const name of ['name', 'email', 'business', 'website']) {
    assert.match(html, new RegExp(`<input[^>]*name="${name}"[^>]*required`));
  }
  assert.match(html, /<textarea[^>]*name="goals"(?![^>]*required)[^>]*>/);
  assert.match(html, /name="_subject" value="New Free AI Visibility Audit Request"/);
  assert.match(html, /<button type="submit"[^>]*>Get My Free AI Visibility Audit<\/button>/);
  assert.match(html, /Your free AI visibility audit request was received\./);
});

test('revenue modeling discloses the exact formula and status of assumptions', () => {
  assert.match(html, /monthly customers × average customer value × 20% modeled AI-referred customer uplift × 12% modeled conversion uplift/i);
  assert.match(html, /illustrative modeling assumptions only/i);
  assert.match(html, /not guarantees, predictions, or industry averages/i);
});
