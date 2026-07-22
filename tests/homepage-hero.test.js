const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const theme = fs.readFileSync(path.join(root, 'assets', 'theme.css'), 'utf8');

test('hero pricing button uses the same pricing destination as Get Started', () => {
  assert.match(html, /data-id="52" href="\/#pricing"[^>]*>View Pricing<\/a>/);
  assert.match(html, /data-id="13" href="\/#pricing"[^>]*>Get Started<\/a>/);
});

test('hero and navigation use explicit high-contrast foreground colors', () => {
  assert.match(theme, /#hero-k1l2 h1[\s\S]*color: #35145f !important/);
  assert.match(theme, /#hero-k1l2 p,[\s\S]*color: #292334 !important/);
  assert.match(theme, /#nav-header-a1b2 \.gradient-text,[\s\S]*color: #35145f !important/);
});
