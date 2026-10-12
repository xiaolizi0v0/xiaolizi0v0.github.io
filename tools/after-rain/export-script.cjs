const fs=require('fs'),path=require('path'),crypto=require('crypto');
const story=require('./story.js');
for(const file of fs.readdirSync(__dirname).filter(x=>/^chapter-\d+\.js$/.test(x)).sort())require('./'+file);
const hash=t=>crypto.createHash('sha256').update(t).digest('hex').slice(0,12);
const beats=Object.values(story.scenes).flatMap(s=>s.beats.map((b,i)=>({...b,scene:s.id,index:i,hash:hash(b.speaker+'|'+b.text),file:b.id+'-'+hash(b.speaker+'|'+b.text)+'.mp3'})));
fs.writeFileSync(path.join(__dirname,'script-manifest.json'),JSON.stringify({title:story.title,version:story.version,beats},null,2));
console.log(JSON.stringify({scenes:Object.keys(story.scenes).length,lines:beats.length,characters:beats.reduce((n,b)=>n+(b.text.match(/[\u3400-\u9fff]/g)||[]).length,0)}));
