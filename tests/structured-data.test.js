const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = 'https://agentairdirect.com/';
const pages = ['index.html', 'business-signal-intelligence.html', 'ai-speed-to-lead.html', 'contact.html'];
const entities = file => [...fs.readFileSync(path.join(root, file), 'utf8').matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));

test('primary entities are readable without graph traversal and resolve their local relationships', () => {
  for (const file of pages) {
    const nodes = entities(file);
    const ids = nodes.map(node => node['@id']).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length, file);
    assert.ok(nodes.some(node => node['@type'] === 'Organization'));
    assert.ok(nodes.some(node => node['@type'] === 'WebSite'));
    for (const node of nodes) {
      assert.equal(node['@context'], 'https://schema.org');
      assert.ok(node['@type']);
      for (const relation of ['publisher', 'provider', 'founder', 'about', 'isPartOf', 'mainEntityOfPage']) {
        if (node[relation]?.['@id']) assert.ok(ids.includes(node[relation]['@id']), `${file}: unresolved ${relation}`);
      }
    }
  }
});

test('homepage describes all four published services with the business as provider', () => {
  const services = entities('index.html').filter(node => node['@type'] === 'Service');
  assert.equal(services.length, 4);
  for (const service of services) {
    assert.equal(service.provider['@id'], base + '#organization');
    assert.match(service.offers.url, /^https:\/\/agentairdirect\.com\/contact\.html\?service=/);
  }
  for (const [id, minimum] of [['diagnostic', 750], ['foundation', 2500], ['stewardship', 500]]) {
    const offer = services.find(node => node['@id'] === base + '#service-' + id).offers;
    assert.equal(offer.priceSpecification.minPrice, minimum);
    assert.equal(offer.priceSpecification.priceCurrency, 'USD');
    assert.equal(offer.price, undefined, 'Starting prices must not become fixed quotes');
  }
  const ava = services.find(node => node['@id'].endsWith('speed-to-lead'));
  assert.match(ava.offers.description, /\$2,000 setup plus \$697 per month, plus applicable usage/);
  assert.equal(ava.offers.price, undefined);
});

test('contact page identifies the inquiry destination without inventing business details', () => {
  const nodes = entities('contact.html');
  assert.ok(nodes.some(node => node['@type'] === 'ContactPage'));
  const organization = nodes.find(node => node['@type'] === 'Organization');
  assert.equal(organization.contactPoint.email, 'hello@agentair.io');
  for (const property of ['address', 'telephone', 'aggregateRating', 'review']) assert.equal(organization[property], undefined);
});
