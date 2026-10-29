const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const home = read('index.html');
const contact = read('contact.html');
test('homepage has its ordered sections and one main heading', () => {
  assert.deepEqual([...home.matchAll(/<section id="([^"]+)"/g)].map(x=>x[1]), ['hero','why-now','what-you-get','how-it-works','plain-english','pricing-intelligence','pricing','done-for-you','agencies','sample','faq','final-cta']);
  assert.equal((home.match(/<h1>/g)||[]).length,1);
  assert.match(home, /<section id="hero"[\s\S]*?<h1>AI can only choose a business it can <span class="home-accent">read<\/span>\.<\/h1>/);
  assert.doesNotMatch(home, /SoftwareApplication|FAQPage|roi-calculator/);
});
test('homepage states prices, the legibility promise and Pricing Intelligence', () => {
  for (const id of ['diagnostic','foundation','stewardship']) assert.match(home, new RegExp(`<article class="signal-card home-plan[^"]*" id="${id}"`));
  assert.match(home, /\$750 <small>starting<\/small>[\s\S]*\$2,500 <small>starting, one-time<\/small>[\s\S]*\$500 <small>starting, per month<\/small>/);
  assert.match(home, /No one can make AI choose you\. We make sure AI can see you, read you correctly, and has every reason to choose you\./);
  assert.match(home, /<section id="pricing-intelligence"[\s\S]*?Pricing Passport/);
  assert.doesNotMatch(home, /™|invisible|guarantee/i);
});
test('site visuals appear in their matching homepage sections', () => {
  const placements = [
    ['why-now','futuristic_tech_network_visualization.png','Scattered business information'],
    ['what-you-get','Media business signal graphic.png','Seven connected parts of Business Signal Intelligence'],
    ['sample','bs_diagnostic_overview_graphic.png','Business Signal Diagnostic overview'],
  ];
  for (const [section,file,altStart] of placements) {
    assert.match(home,new RegExp(`<section id="${section}"[\\s\\S]*?<img src="/assets/${file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}"[^>]+alt="${altStart}`));
  }
});
test('public pages contain no free audit offer or private application link', () => {
  for (const file of fs.readdirSync(root).filter(x=>x.endsWith('.html'))) assert.doesNotMatch(read(file), /free\s+(?:AI\s+Search\s+Visibility\s+|AI\s+Visibility\s+)?audit|streamlit\.app/i,file);
});
test('inquiry preserves FormSubmit and requires qualification and consent with optional website', () => {
  assert.match(contact,/action="https:\/\/formsubmit\.co\/lisa@agentairdirect\.com" method="POST"/);
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
