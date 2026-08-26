const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const auditDestination='#contact';
for(const marker of ['id="free-audit"','id="contact"','id="roi-calculator"','assets/roi-calculator.css','assets/roi-calculator.js','assets/roi-calculator-ui.js','assets/dollar-cursor-trail.css','assets/dollar-cursor-trail.js',`href="${auditDestination}"`,`action="https://formsubmit.co/hello@agentair.io"`,`value="New Free AI Visibility Audit Request"`,`href="/case-study-md-spangler.html"`])if(!html.includes(marker))throw new Error(`Production page is missing ${marker}`);
if(!fs.existsSync(path.join(root,'case-study-md-spangler.html')))throw new Error('Missing public case-study page.');
if(/streamlit\.app/i.test(html))throw new Error('Production page must not link to the private Streamlit application.');
for(const relative of ['assets/roi-calculator.css','assets/roi-calculator.js','assets/roi-calculator-ui.js','assets/dollar-cursor-trail.css','assets/dollar-cursor-trail.js'])if(!fs.existsSync(path.join(root,relative)))throw new Error(`Missing production asset: ${relative}`);
const publicFiles=fs.readdirSync(root).filter(name=>name.endsWith('.html')).map(name=>path.join(root,name)).concat(fs.readdirSync(path.join(root,'assets')).filter(name=>/\.(css|js)$/.test(name)).map(name=>path.join(root,'assets',name)));
for(const file of publicFiles){const contents=fs.readFileSync(file,'utf8');for(const pattern of [/localhost:\d+/i,/127\.0\.0\.1:\d+/i,/audit payload/i])if(pattern.test(contents))throw new Error(`Prohibited private reference found in ${path.relative(root,file)}: ${pattern}`);}
console.log('Static production build verification passed.');
