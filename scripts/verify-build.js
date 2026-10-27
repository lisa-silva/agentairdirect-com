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
if ((home.match(/<section\b/g) || []).length !== 12) throw new Error('Homepage must have twelve sections.');
if (!/<section id="hero"[\s\S]*?<h1>AI can only choose a business it can <span class="home-accent">read<\/span>\.<\/h1>/.test(home)) throw new Error('Homepage hero copy or ordering changed.');
for (const [section,file] of [['why-now','futuristic_tech_network_visualization.png'],['what-you-get','Media business signal graphic.png'],['sample','bs_diagnostic_overview_graphic.png']]) {
 if (!new RegExp(`<section id="${section}"[\\s\\S]*?<img src="/assets/${file.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}"`).test(home)) throw new Error(`Missing ${file} from ${section}.`);
}
const limitation = /Agent Air Direct provides consulting, implementation, and workflow support[\s\S]*?We do not guarantee search rankings, AI citations, recommendations, leads, revenue, platform placement, or regulatory compliance\./;
for (const page of ['index.html','contact.html','business-signal-intelligence.html','ai-speed-to-lead.html','case-study-md-spangler.html','success-agentairdirect.html']) {
 if (limitation.test(fs.readFileSync(path.join(root,page),'utf8'))) throw new Error(`Service limitations must not appear on public service page ${page}.`);
}
for (const page of ['privacypolicy.html','terms.html','refund.html','disclaimer.html']) {
 if (!limitation.test(fs.readFileSync(path.join(root,page),'utf8'))) throw new Error(`Missing service limitations on policy page ${page}.`);
}
console.log('Static production build verification passed.');
