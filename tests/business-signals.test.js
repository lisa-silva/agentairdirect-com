const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const home = read('index.html');
const contact = read('contact.html');
test('homepage has eight ordered sections and one main heading', () => {
  assert.deepEqual([...home.matchAll(/<section id="([^"]+)"/g)].map(x=>x[1]), ['hero-k1l2','customer-pain','business-signal-intelligence','diagnostic','foundation','speed-to-lead','stewardship','final-cta']);
  assert.equal((home.match(/<h1>/g)||[]).length,1);
  assert.doesNotMatch(home, /SoftwareApplication|FAQPage|roi-calculator/);
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
test('pages keep unique IDs, working fragments, brand identity and disclaimers', () => {
  for (const file of ['index.html','contact.html','business-signal-intelligence.html','ai-speed-to-lead.html','case-study-md-spangler.html']) {
    const html=read(file), ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
    assert.equal(new Set(ids).size,ids.length,file);
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]),file);
    assert.match(html,/Agent Air Direct provides consulting, implementation, and workflow support/);
    assert.match(html,/aria-label="Agent Air Direct home"/);
  }
});
