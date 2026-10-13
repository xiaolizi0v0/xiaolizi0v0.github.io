(()=>{'use strict';const $=id=>document.getElementById(id);let data,position=0;const store={getItem(){return null;},setItem(){}};
const voice=WarmVoice.create({storage:store,modal(title,body){$('modal-title').textContent=title;$('modal-body').innerHTML=body;$('modal').hidden=false;},onState:s=>{$('voice-evidence').textContent=JSON.stringify(s,null,2);}});
const loaded=fetch('warm-signal/voice-script.json').then(r=>r.json()).then(x=>data=x);
async function line(){await loaded;const cue=data.main.filter(c=>c.scene===0)[position];if(!cue){position=0;return line();}$('review-speaker').textContent=cue.label;$('review-text').textContent=cue.text;$('review-position').textContent='序章 / '+(position+1)+' / '+data.main.filter(c=>c.scene===0).length;voice.speak(cue.speaker,cue.text,{force:true});}
$('review-main').onclick=()=>{position=0;line();};$('review-next').onclick=()=>{position++;line();};$('close-modal').onclick=()=>{voice.stop();$('modal').hidden=true;};
})();
