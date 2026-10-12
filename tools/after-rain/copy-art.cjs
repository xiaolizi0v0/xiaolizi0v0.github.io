const fs=require('fs'),path=require('path');
for(const a of JSON.parse(fs.readFileSync(path.join(__dirname,'asset-manifest.json'),'utf8'))){const dest=path.join(__dirname,a.file);fs.mkdirSync(path.dirname(dest),{recursive:true});if(!fs.existsSync(dest))fs.copyFileSync(a.source,dest);console.log(a.key);}
