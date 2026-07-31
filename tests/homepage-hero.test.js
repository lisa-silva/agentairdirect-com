const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const theme = fs.readFileSync(path.join(root, 'assets', 'theme.css'), 'utf8');

test('hero call-to-action buttons are removed while the header inquiry button remains', () => {
  assert.doesNotMatch(html, /data-id="52"[^>]*>Request Information<\/a>/);
  assert.doesNotMatch(html, /data-id="53"[^>]*>See How It Works<\/a>/);
  assert.match(html, /data-id="13" href="\/#contact"[^>]*>Request Information<\/a>/);
});

test('hero and navigation use explicit high-contrast foreground colors', () => {
  assert.match(theme, /#hero-k1l2 h1[\s\S]*color: #35145f !important/);
  assert.match(theme, /#hero-k1l2 p,[\s\S]*color: #292334 !important/);
  assert.match(theme, /#nav-header-a1b2 \.gradient-text,[\s\S]*color: #35145f !important/);
});
