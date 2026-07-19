const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const marker of ['id="roi-calculator"','assets/roi-calculator.css','assets/roi-calculator.js','assets/roi-calculator-ui.js'])if(!html.includes(marker))throw new Error(`Production page is missing ${marker}`);
for(const relative of ['assets/roi-calculator.css','assets/roi-calculator.js','assets/roi-calculator-ui.js'])if(!fs.existsSync(path.join(root,relative)))throw new Error(`Missing production asset: ${relative}`);
const publicFiles=fs.readdirSync(root).filter(name=>name.endsWith('.html')).map(name=>path.join(root,name)).concat(fs.readdirSync(path.join(root,'assets')).filter(name=>/\.(css|js)$/.test(name)).map(name=>path.join(root,'assets',name)));
for(const file of publicFiles){const contents=fs.readFileSync(file,'utf8');for(const pattern of [/agentair-suite/i,/localhost:\d+/i,/127\.0\.0\.1:\d+/i,/audit payload/i])if(pattern.test(contents))throw new Error(`Prohibited private reference found in ${path.relative(root,file)}: ${pattern}`);}
console.log('Static production build verification passed.');
