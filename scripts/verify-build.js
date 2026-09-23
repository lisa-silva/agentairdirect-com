const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
for (const page of fs.readdirSync(root).filter(name => name.endsWith('.html'))) {
 const html = fs.readFileSync(path.join(root, page), 'utf8');
 for (const pattern of [/free\s+(?:AI\s+Search\s+Visibility\s+|AI\s+Visibility\s+)?audit/i, /localhost:\d+/i, /127\.0\.0\.1:\d+/i, /audit payload/i, /streamlit\.app/i]) {
  if (pattern.test(html)) throw new Error(`Prohibited public copy in ${page}: ${pattern}`);
 }
 for (const match of html.matchAll(/(?:href|src)="([^"?#]+)(?:[?#][^"]*)?"/g)) {
  if (/^(?:https?:|mailto:|tel:|data:)/.test(match[1])) continue;
  const local = path.join(root, match[1] === '/' ? 'index.html' : match[1].replace(/^\//, ''));
  if (!fs.existsSync(local) && !fs.existsSync(local + '.html')) throw new Error(`Missing local target ${match[1]} in ${page}`);
 }
 for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
}
for (const page of ['business-signal-intelligence.html','ai-speed-to-lead.html','contact.html']) {
 if (!fs.existsSync(path.join(root,page))) throw new Error(`Missing service page ${page}`);
}
const home = fs.readFileSync(path.join(root,'index.html'),'utf8');
if ((home.match(/<section\b/g) || []).length !== 8) throw new Error('Homepage must have eight sections.');
console.log('Static production build verification passed.');
