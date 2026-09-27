const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const home = read('index.html');
const contact = read('contact.html');
test('homepage has nine ordered sections and one main heading', () => {
  assert.deepEqual([...home.matchAll(/<section id="([^"]+)"/g)].map(x=>x[1]), ['hero-k1l2','two-audiences','customer-pain','business-signal-intelligence','diagnostic','foundation','speed-to-lead','stewardship','final-cta']);
  assert.equal((home.match(/<h1>/g)||[]).length,1);
  assert.match(home, /<section id="hero-k1l2"[\s\S]*?<div class="signal-wrap">\s*<h1>Your website was built for one audience\.<br>Now it has two\.<\/h1>\s*<p class="signal-lede">People who read it and machines that interpret it\.<\/p>/);
  assert.doesNotMatch(home, /SoftwareApplication|FAQPage|roi-calculator/);
});
test('fragmented information visual appears in the customer problem section', () => {
  assert.match(home, /<section id="customer-pain"[\s\S]*?<figure class="signal-fragmented-visual"><img src="\/assets\/futuristic_tech_network_visualization\.png"[^>]+alt="Scattered business information becoming a connected foundation for search and AI systems\."[^>]*><\/figure>[\s\S]*?<h3>Important facts are scattered<\/h3>/);
});
test('service overview visuals appear in their matching homepage sections', () => {
  const placements = [
    ['business-signal-intelligence','Media business signal graphic.png','Seven connected parts of Business Signal Intelligence'],
    ['diagnostic','bs_diagnostic_overview_graphic.png','Business Signal Diagnostic overview'],
    ['speed-to-lead','ava_overview_graphic.png','AVA workflow'],
  ];
  for (const [section,file,altStart] of placements) {
    assert.match(home,new RegExp(`<section id="${section}"[\\s\\S]*?<figure class="signal-section-visual"><img src="/assets/${file.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}"[^>]+alt="${altStart}`));
  }
});
test('public pages contain no free audit offer or private application link', () => {
  for (const file of fs.readdirSync(root).filter(x=>x.endsWith('.html'))) assert.doesNotMatch(read(file), /free\s+(?:AI\s+Search\s+Visibility\s+|AI\s+Visibility\s+)?audit|streamlit\.app/i,file);
});
test('inquiry preserves FormSubmit and requires qualification and consent with optional website', () => {
  assert.match(contact,/action="https:\/\/formsubmit\.co\/hello@agentair\.io" method="POST"/);
  for (const name of ['name','business','email','phone','city_state','industry','locations','goals','service','investment','message','paid_confirmation']) assert.match(contact,new RegExp(`<(?:input|textarea|select)[^>]*name="${name}"[^>]*required`));
  assert.doesNotMatch(contact,/<input[^>]*name="website"[^>]*required/);
  assert.match(contact,/name="_honey" hidden/);
  assert.match(contact,/contact\.html\?submitted=true#inquiry/);
  assert.match(contact,/does not create a service relationship or guarantee acceptance/);
});
test('service inquiry links preselect a real form option', () => {
  const options = [...contact.matchAll(/<option>(.*?)<\/option>/g)].map(x=>x[1]);
  for (const file of ['index.html','business-signal-intelligence.html','ai-speed-to-lead.html']) {
    for (const match of read(file).matchAll(/href="\/contact\.html\?service=([^"#]+)#inquiry"/g)) assert.ok(options.includes(decodeURIComponent(match[1])));
  }
});
test('pages keep unique IDs, working fragments and brand identity', () => {
  for (const file of ['index.html','contact.html','business-signal-intelligence.html','ai-speed-to-lead.html','case-study-md-spangler.html']) {
    const html=read(file), ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
    assert.equal(new Set(ids).size,ids.length,file);
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]),file);
    assert.doesNotMatch(html,/Agent Air Direct provides consulting, implementation, and workflow support/,file);
    assert.match(html,/aria-label="Agent Air Direct home"/);
  }
});
test('service limitations appear only on the linked policy pages', () => {
  const limitation = /Agent Air Direct provides consulting, implementation, and workflow support[\s\S]*?We do not guarantee search rankings, AI citations, recommendations, leads, revenue, platform placement, or regulatory compliance\./;
  for (const file of ['privacypolicy.html','terms.html','refund.html','disclaimer.html']) assert.match(read(file),limitation,file);
  assert.doesNotMatch(read('success-agentairdirect.html'),limitation);
});
