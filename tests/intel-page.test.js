const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const legacyHub = fs.readFileSync(path.join(root, 'AgentAir_Intelligence_Hub_v4.html'), 'utf8');
const intelPath = path.join(root, 'intel.html');
const intelRoute = '/intel' + '.html';

test('intelligence page has been removed', () => {
  assert.equal(fs.existsSync(intelPath), false);
});

test('homepage and legacy hub no longer route visitors to the removed intelligence page', () => {
  assert.equal(homepage.includes(intelRoute), false);
  assert.equal(legacyHub.includes(intelRoute), false);
});
