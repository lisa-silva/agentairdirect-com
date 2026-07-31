const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const intel = fs.readFileSync(path.join(root, 'intel.html'), 'utf8');
const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const legacyHub = fs.readFileSync(path.join(root, 'AgentAir_Intelligence_Hub_v4.html'), 'utf8');

test('intelligence page restores the engine-specific content without a redirect', () => {
  assert.doesNotMatch(intel, /http-equiv="refresh"|window\.location\.replace/);
  assert.match(intel, /id="perplexity-protocol"/);
  assert.match(intel, /id="chatgpt-protocol"/);
  assert.match(intel, /id="threeway-compare-tbody"/);
  assert.match(intel, /Google AI Overviews/);
  assert.match(intel, /Perplexity Sonar/);
  assert.match(intel, /ChatGPT Search/);
});

test('homepage and legacy hub route visitors to the restored intelligence page', () => {
  assert.equal((homepage.match(/href="\/intel\.html"/g) || []).length, 3);
  assert.match(legacyHub, /url=\/intel\.html/);
  assert.match(legacyHub, /window\.location\.replace\('\/intel\.html'\)/);
});

test('restored inline scripts remain syntactically valid', () => {
  const inlineScripts = Array.from(
    intel.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi),
    (match) => match[1]
  );

  assert.ok(inlineScripts.length >= 2);
  inlineScripts.forEach((source) => {
    assert.doesNotThrow(() => new vm.Script(source));
  });
});
