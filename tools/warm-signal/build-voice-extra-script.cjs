// Inventory fixed dialogue outside the main story using the same runtime line resolvers.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const D=require('./content.js'),casting=require('./voice-casting.json'),aliases=new Map(casting.characters.flatMap(c=>c.aliases.map(a=>[a,c.id]))),lines=[],missing=new Set();
function add(scope,key,speaker,text){if(typeof speaker==='number')speaker=D.characters[speaker].name;const role=aliases.get(speaker);if(!role){missing.add(speaker);return;}if(typeof text==='string'&&text.trim())lines.push({key:scope+'-'+key,speaker:role,label:speaker,text,scene:scope});}
for(const scene of require('./main-story-content.js').build(D,1).filter(s=>s.chapter>0))for(const[i,b]of scene.beats.entries())for(const[v,text]of (b.text?[b.text]:b.texts||[]).entries())add('legacy-main',`${scene.id}-${i}-${v}`,b.speaker,text);
const dating=require('./dating.js');
for(const s of dating.stories)for(const[ch,c]of s.chapters.entries())for(let line=0;line<c.lines.length;line++)for(const choice of [0,1]){const l=dating.line({key:dating.key(s.p,s.n),chapter:ch,line,choice});add('date',`${s.id}-${ch}-${line}-${choice}`,l.speaker,l.text);}
const sp=require('./sp.js');for(const s of require('./sp-content.js').stories)for(const kind of ['main','clue','bonus'])for(let i=0;i<(kind==='main'?s.chapters:kind==='clue'?s.clues:s.bonus).length;i++){const e=sp.episode(s.id,kind,i);for(let line=0;line<e.lines.length;line++)for(const choice of [0,1]){const l=sp.line({card:s.id,kind,index:i,line,choice});add('sp',`${s.id}-${kind}-${i}-${line}-${choice}`,l.speaker,l.text);}}
const ur=require('./ur.js');for(const [p,s]of require('./ur-content.js').stories.entries()){const card=D.cards.find(c=>c.p===p&&c.rarity==='UR').id;for(const kind of ['main','special','ambient'])for(const[i,e]of s[kind].entries())for(let line=0;line<e.lines.length;line++)for(const choice of [0,1]){const l=ur.line({card,kind,index:i,line,choice});add('ur',`${card}-${kind}-${i}-${line}-${choice}`,l.speaker,l.text);}}
const rv=require('./rendezvous.js');for(const key of rv.keys)for(const kind of ['main','memory','secret'])for(let a=0;a<2;a++)for(let b=0;b<2;b++){const q={key,kind,step:0,choices:[a,b],ending:a*2+b};for(let step=0;step<rv.length(q);step++){const l=rv.line(q,step);if(l)add('rv',`${key}-${kind}-${a}-${b}-${step}`,l.speaker,l.text);}}
const secret=require('./secrets.js');for(const s of secret.stories)for(const[ch,c]of s.chapters.entries()){for(const[i,text]of (c.text||[]).entries())add('secret',`${s.id}-${ch}-${i}`,'旁白',text);for(const[point,p]of (c.points||[]).entries())for(const[i,text]of (p.text||[]).entries())add('secret',`${s.id}-${ch}-${point}-${i}`,'旁白',text);}
const film=require('./footage.js');for(const stages of film.stages)for(const s of stages.filter(s=>s.type==='story'))for(let line=0;line<6;line++)for(const choice of [null,0,1]){const routes=Array.from({length:6},()=>({stories:{}}));routes[s.p].stories[s.id]={line,choice};const l=film.line({s:{footage:{session:{p:s.p,stage:s.id,type:'story'},routes}}});if(l.text)add('film',`${s.p}-${s.id}-${line}-${choice}`,l.speaker,l.text);}
const phone=require('./phone.js');for(const e of phone.entries.filter(e=>Array.isArray(e.lines)))for(let cursor=0;cursor<e.lines.length;cursor++)for(const choice of [0,1]){const l=phone.line(e,{cursor,choice}),speaker=l.speaker==='me'?'我':e.p<0?'旁白':D.characters[e.p].name;add('phone',`${e.id}-${cursor}-${choice}`,speaker,l.text);if(l.options)for(const[i,t]of l.options.entries())add('phone',`${e.id}-${cursor}-option-${i}`,'我',t);}
const sleep=require('./sleep-content.js');for(const s of sleep.stories)for(const[i,text]of s.lines.entries())add('sleep',`${s.key}-${i}`,s.p,text);
for(const[p,s]of sleep.people.entries()){for(const[key,value]of Object.entries(s)){if(key==='stories')continue;if(typeof value==='string')add('sleep',`${p}-${key}`,p,value);else for(const[i,text]of Object.values(value).entries())add('sleep',`${p}-${key}-${i}`,p,text);}}
// The authored companion constant is data; evaluate only that declaration, never its UI.
const companion=fs.readFileSync(path.join(__dirname,'companion-ui.js'),'utf8'),start=companion.indexOf('const lines=['),end=companion.indexOf('function create(',start);const people=vm.runInNewContext(companion.slice(start,end)+'\nlines;');
for(const[p,s]of people.entries())for(const[key,value]of Object.entries(s)){if(key==='voice')continue;if(typeof value==='string')add('companion',`${p}-${key}`,p,value);else for(const[i,text]of value.entries())add('companion',`${p}-${key}-${i}`,p,text);}
for(const[i,m]of [...companion.matchAll(/say\('([^']+)'\)/g)].entries())for(let p=0;p<6;p++)add('companion-extra',`${p}-${i}`,p,m[1]);
const V=require('./voice-dialogue.js');
const addLines=(scope,key,rows)=>rows.forEach((l,i)=>add(scope,key+'-'+i,l.speaker,l.text));
const birthday=require('./birthday-content.js');
for(let p=0;p<6;p++){
 const stories=[...birthday.beats[p].map((_,n)=>birthday.story(p,n)),birthday.birthdayDate(p),V.celebration(D.characters[p].name)];
 for(const[n,s]of stories.entries())for(const[i,l]of s.lines.entries()){add('birthday',`${p}-${n}-${i}`,l[0]==='选择'?'旁白':l[0],l[1]);if(l[0]==='选择')for(const[c,t]of l.slice(2).entries())add('birthday',`${p}-${n}-${i}-choice-${c}`,'我',t);}
 for(const[k,t]of Object.entries(birthday.outfitLines[p]))add('birthday-outfit',`${p}-${k}`,p,t);
 add('character-quote',p,p,D.characters[p].quote);
}
const cottage=require('./cottage-content.js'),moments=require('./cottage-moments.js');
for(const s of cottage.stories)for(const[i,text]of s.lines.entries())addLines('cottage',`${s.key}-${i}`,V.prose(text,D.characters[s.p].name));
for(let p=0;p<6;p++){
 add('cottage-greeting',p,p,cottage.greetings[p]);add('cottage-call',p,p,V.cottageCalls[p]);
 V.cottageReplies.forEach((t,i)=>add('cottage-response',`${p}-${i}`,p,t));
 for(const[k,kind]of moments.kinds.entries()){kind.lines.slice(0,3).forEach((t,i)=>add('cottage-moment',`${p}-${k}-${i}`,'旁白',t));add('cottage-moment',`${p}-${k}-end`,'旁白',moments.endings[p][k]);}
 V.sleepReplies.forEach((t,i)=>add('sleep-response',`${p}-${i}`,p,t));
}
for(const s of sleep.stories)for(const[i,t]of s.reactions.entries())add('sleep-touch',`${s.key}-${i}`,s.p,t);
add('sleep-quiet',0,'旁白','她把呼吸放得很轻，让你也能安心休息。');
const city=require('./city-content.js');
for(let p=0;p<6;p++)for(let map=0;map<3;map++)for(let beat=0;beat<5;beat++)for(const[i,l]of city.story(p,map,beat).lines.entries())add('city',`${p}-${map}-${beat}-${i}`,l.who,l.text);
add('city-npc','camera','旁白',V.cityCamera);add('city-npc','bike','旁白',V.cityBike);
for(const[v,c]of require('./labyrinth-content.js').volumes.entries())for(const s of c.stories)for(const[i,l]of s.lines.entries())add('labyrinth',`${v}-${s.id}-${i}`,l[0],l[1]);
const company=require('./company.js'),companySource=fs.readFileSync(path.join(__dirname,'company-ui.js'),'utf8');
const companyData=vm.runInNewContext(companySource.slice(companySource.indexOf('const datePlaces='),companySource.indexOf('function showDate()'))+'\n({dateLines,dateChoices});');
for(let p=0;p<6;p++){
 for(let step=0;step<4;step++)addLines('company-feedback',`${p}-${step}`,company.events(p,step,D.characters[p].name).map(l=>({speaker:l.who,text:l.text})));
 companyData.dateLines[p].forEach((t,i)=>addLines('company-date',`${p}-${i}`,V.prose(t,D.characters[p].name,i>0&&i<4)));
 companyData.dateChoices[p].forEach((t,i)=>add('company-choice',`${p}-${i}`,'我',t));
 for(const[action,texts]of Object.entries(require('./ur-content.js').stories[p].responses))texts.forEach((t,i)=>add('ur-response',`${p}-${action}-${i}`,p,t));
}
for(const[i,e]of require('./engine.js').liveEvents.entries())add('live',i,'唐梨',e.response);
add('live','end','唐梨',V.liveEnd);add('live','fallback','旁白',V.liveFallback);
for(const[p,r]of require('./walk-content.js').routes.entries())for(const[i,e]of r.events.entries()){add('walk',`${p}-${i}-scene`,'旁白',e[1]);for(let c=0;c<2;c++){add('walk',`${p}-${i}-choice-${c}`,'我',e[c+2]);add('walk',`${p}-${i}-reply-${c}`,p,e[c+4]);}}
V.walkEndings.forEach((t,i)=>add('walk','ending-'+i,'旁白',t));
for(let p=0;p<6;p++){add('pet',`${p}-greeting`,p,V.petGreetings[p]);add('pet',`${p}-invite`,p,V.petInvites[p]);add('pet',`${p}-together`,p,V.petTogether);}
if(missing.size)throw Error('Uncast fixed-dialogue speakers: '+[...missing].join(','));
const unique=[...new Map(lines.map(l=>[l.speaker+'\n'+l.text,l])).values()],counts={};for(const l of unique)counts[l.scene]=(counts[l.scene]||0)+1;
fs.writeFileSync(path.join(__dirname,'voice-extra-script.json'),JSON.stringify({version:1,lines:unique,counts},null,2)+'\n');console.log(JSON.stringify({unique:unique.length,counts,missing:[...missing]},null,2));
