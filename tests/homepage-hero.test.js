const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const theme = fs.readFileSync(path.join(root, 'assets', 'theme.css'), 'utf8');

test('hero and navigation use the approved AI Visibility calls to action', () => {
  assert.match(html, /data-id="52" href="#information-gap"[^>]*>See What AI Understands<\/a>/);
  assert.match(html, /data-id="53" href="#how-it-works"[^>]*>How Agent Air Direct Works<\/a>/);
  assert.match(html, /data-id="13" href="\/#contact"[^>]*>Request an AI Visibility Assessment<\/a>/);
});

test('hero and navigation use explicit high-contrast foreground colors', () => {
  assert.match(theme, /#hero-k1l2 h1[\s\S]*color: #35145f !important/);
  assert.match(theme, /#hero-k1l2 p,[\s\S]*color: #292334 !important/);
  assert.match(theme, /#nav-header-a1b2 \.gradient-text,[\s\S]*color: #35145f !important/);
});

test('homepage uses the approved narrative and removes superseded sections', () => {
  assert.match(html, /Own How AI[\s\S]*Understands Your Business\./);
  assert.match(html, /id="what-you-receive"/);
  assert.match(html, /id="future-readiness"/);
  assert.doesNotMatch(html, /id="who-its-for"|id="credibility-o5p6"|lisa-silva-profile\.png/);
});

test('visible FAQ content matches FAQPage structured data', () => {
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const faqSchema = schemas.find((schema) => schema['@type'] === 'FAQPage');
  const decode = (value) => value.replace(/<[^>]+>/g, '').replace(/&trade;/g, '™').replace(/&amp;/g, '&').trim();
  const visibleFaq = [...html.matchAll(/id="faq-question-(\d+)"[\s\S]*?<span[^>]*>(.*?)<\/span>[\s\S]*?id="faq-answer-\1"[\s\S]*?<p[^>]*>(.*?)<\/p>/g)].map((match) => ({
    question: decode(match[2]),
    answer: decode(match[3])
  }));
  const structuredFaq = faqSchema.mainEntity.map((item) => ({ question: item.name, answer: item.acceptedAnswer.text }));
  assert.deepEqual(visibleFaq, structuredFaq);
});

test('homepage fragment links resolve to unique section IDs', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Missing target for #${match[1]}`);
});

test('homepage publishes both approved phone numbers and removes the incorrect number', () => {
  assert.match(html, /href="tel:\+14084256699"[^>]*>Call Lisa: \(408\) 425-6699<\/a>/);
  assert.match(html, /href="tel:\+16696611140"[^>]*>Call Lisa: \(669\) 661-1140<\/a>/);
  assert.doesNotMatch(html, /\+16696671140|\(669\) 667-1140/);
});
