const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const D=require('./content.js'),cast=require('./voice-casting.json'),scenes=require('./main-story-content.js').build(D,2);
const alias=new Map(cast.characters.flatMap(c=>c.aliases.map(n=>[n,c.id]))),lines=[],missing=new Set(),counts={};
for(const scene of scenes)for(let i=0;i<scene.beats.length;i++){
 const beat=scene.beats[i],speaker=alias.get(beat.speaker);if(!speaker){missing.add(beat.speaker);continue;}
 for(const [variant,text]of (beat.text?[beat.text]:beat.texts||[]).entries()){
  const hash=crypto.createHash('sha256').update(speaker+'\n'+text).digest('hex').slice(0,20);
  lines.push({key:`main-${scene.id}-${i}-${variant}`,speaker,label:beat.speaker,text,hash,scene:scene.id,line:i,variant});counts[speaker]=(counts[speaker]||0)+1;
 }
}
if(missing.size)throw Error('Uncast speakers: '+[...missing].join(','));
const characters=cast.characters.map(c=>{const own=lines.filter(l=>l.speaker===c.id),chosen=own.find(l=>l.text.length>=25&&l.text.length<=65)||own[0];return{...c,referenceText:chosen.text,sampleCue:chosen.key,lineCount:own.length};});
const output={version:1,model:cast.designModel,license:cast.license,characters,main:lines,counts};
fs.writeFileSync(path.join(__dirname,'voice-script.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({characters:characters.length,mainCues:lines.length,counts,missing:[...missing]},null,2));
