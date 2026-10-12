const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const base=__dirname,root=path.resolve(base,'../..'),errors=[],scripts=fs.readdirSync(base).filter(f=>f.endsWith('.js'));
for(const f of scripts){const r=cp.spawnSync(process.execPath,['--check',path.join(base,f)],{encoding:'utf8'});if(r.status!==0)errors.push({file:f,error:r.stderr});}
const pages={};
for(const page of ['WarmSignal.html','WarmSignalLabyrinthReview.html','WarmSignalSunJournalReview.html']){const file=path.resolve(base,'..',page),source=fs.readFileSync(file,'utf8'),refs=[...source.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(m=>m[1]).filter(s=>!/^https?:|^data:|^#/.test(s)),missing=refs.filter(s=>!fs.existsSync(path.resolve(path.dirname(file),s.split('?')[0]))),js=refs.filter(s=>s.split('?')[0].endsWith('.js')),duplicates=js.filter((s,i)=>js.indexOf(s)!==i);pages[page]={localReferences:refs.length,missing,duplicateScripts:duplicates};if(missing.length||duplicates.length)errors.push({page,missing,duplicates});}
const C=require('./sun-journal-content.js'),D=require('./content.js'),P=require('./phone.js'),A=require('./card-art.js');
const art=D.cards.filter(c=>c.source==='sun-journal').map(c=>{const a=A.descriptor(c),png=fs.readFileSync(path.join(base,'assets',a.file.replace('.webp','.png')));if(!fs.existsSync(path.join(base,'assets',a.file))||png.readUInt32BE(16)!==a.atlasWidth||png.readUInt32BE(20)!==a.atlasHeight)errors.push({asset:a.file});return{file:a.file,width:a.width,height:a.height};});
const atlas=fs.readFileSync(path.join(base,'assets','sun-journal-scenes-v1.png')),scenes={width:atlas.readUInt32BE(16),height:atlas.readUInt32BE(20)};
if(!fs.existsSync(path.join(base,'assets','sun-journal-scenes-v1.webp'))||scenes.width!==1254||scenes.height!==1254)errors.push({scenes});
for(let p=0;p<6;p++){const a=C.background(p);if(a.x+a.width>=scenes.width||a.y+a.height>=scenes.height)errors.push({crop:p});}
const report={date:'2026-10-12',version:'20261012-sun-journal-1',scripts: scripts.length,pages,cards:D.cards.length,phoneEntries:P.entries.length,art,scenes,errors};
fs.writeFileSync(path.join(root,'docs/warm-signal-screenshots/sun-journal-static-check.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));process.exitCode=errors.length?1:0;
