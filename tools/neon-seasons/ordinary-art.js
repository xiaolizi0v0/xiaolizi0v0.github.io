(function(root,factory){const art=factory();if(typeof module==='object'&&module.exports)module.exports=art;else root.NSOrdinaryArt=art})(typeof window==='undefined'?globalThis:window,()=>{
'use strict';
const p=(d,fill='none',stroke='#5c7180',w=1.8)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`,r=(x,y,w,h,fill,rx=3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="#596d7a" stroke-width="1.5"/>`,c=(x,y,rad,fill)=>`<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" stroke="#596d7a" stroke-width="1.4"/>`,e=(x,y,rx,ry,fill)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="#657a80" stroke-width="1.4"/>`,at=(s,x,y,z=1)=>`<g transform="translate(${x} ${y}) scale(${z})">${s}</g>`,repeat=(n,fn)=>Array.from({length:n},(_,j)=>fn(j)).join('');
const palette={tool:'#b9ccd0',wood:'#c49d79',cloth:'#d6b8ce',flower:'#b2d18c',tea:'#a0bd8d',fruit:'#e7a08c',coffee:'#bb987f',pastry:'#efc6b4',circuit:'#8abdad',vinyl:'#8699bd',rope:'#d3b38b',shell:'#ebcbbf',glass:'#a8d8d1',music:'#d6b38c',banner:'#d7b2ce',lamp:'#e9d7a4',soda:'#a4d6ce',float:'#bcbce0',solar:'#8aadc5',fan:'#9aceca',paper:'#e6d4b1',ink:'#aeafd1',book:'#accdc0',pan:'#b0c2c8',soup:'#e5bc93',table:'#e0c0a3',photo:'#d4b698',display:'#b3cccb',signal:'#dbcda4',map:'#d9cbaa',gear:'#c8b398',clock:'#c3a385',scarf:'#d1b3c7',fire:'#d2a28b',ceramic:'#b3d3c7',snow:'#d5e5ed',lens:'#9dc9d3',star:'#aab5d2',battery:'#a1c8aa',beacon:'#e4d4a3'};
const flower=(x,y,size=1,color='#eab6c7')=>at(repeat(5,j=>`<ellipse cx="0" cy="-6" rx="4" ry="7" fill="${color}" stroke="#927986" stroke-width="1" transform="rotate(${j*72})"/>`)+c(0,0,3,'#f6deb1'),x,y,size);
const leaves=p('M31 49V24M31 38Q12 35 15 22q14-1 16 16m0-5q18-5 18-17-15 2-18 17','none','#91b785',2.8);
const bloom=(n,color='#eab6c7')=>leaves+repeat(n,j=>flower(17+j%3*15,20+Math.floor(j/3)*12,.63,color));
const basket=(n,color='#eab6c7')=>p('M8 36h48l-7 22H15z','#cbb294')+p('M14 35q18-35 36 0','none','#e2c9a0',3)+p('M14 45h36m-30-7l3 18m9-18v18m10-18l-3 18','none','#ad927d',1.2)+at(bloom(n,color),0,1,.94);
const cup=(fill='#e4c8b2',latte=false)=>p('M15 23h28l-3 24q-10 12-21 0z',fill)+p('M43 27q16-1 11 12l-13 3','none','#c1d0c1',3)+e(29,23,14,4,'#765652')+e(29,54,23,4,'#d9d0b8')+(latte?p('M22 23q7-7 14 0q-7 6-14 0m7-3v6','none','#f2e3c7',1.3):'');
const fruit=(x,y,color='#e5a092',z=1)=>at(c(0,0,7,color)+p('M0-6l3-6 5 3','none','#86a978',2),x,y,z);
const fruitPile=(n,scale=1)=>repeat(n,j=>fruit(15+j%4*11,27+Math.floor(j/4)*10,['#e8a498','#c5d294','#ebc195','#c0a5ca'][j%4],scale));
const plate=()=>e(32,47,27,7,'#e2d8c0');
const cake=(x,y,w,h,fill='#e7b7bb')=>r(x,y,w,h,fill,4)+e(x+w/2,y,w/2,4,'#f4dfc3')+p(`M${x+2} ${y+5}q5 7 10 0t10 0t10 0`,'none','#f5e4cc',2);
const candle=(x,y)=>p(`M${x} ${y}v-8`,'none','#a7cabc',2)+p(`M${x} ${y-9}q-5-6 0-9q5 6 0 9`,'#efc57d','#d4aa76',1);
const box=(fill='#b4c8b6')=>r(7,19,50,37,fill)+p('M8 32h48M23 19v-8h18v8','none','#dfd1b4',3);
const tools=(n)=>repeat(n,j=>p(`M${13+j*9} 33v16m-2-17h4m-5 4h6`,'none',j%2?'#d9b69b':'#c9ddd2',2));
const woodgrain=p('M16 21q10-6 25-2M17 46q12-4 29-1','none','#8f726b',1.3);
const teaBag=(fill='#a3bb8e')=>p('M15 12h32l-5 10 12 32q-23 12-43 0l11-32z',fill)+p('M22 22h20','none','#e6dbb9',3)+r(20,32,24,17,'#eee1bf')+p('M28 46q-8-10 9-10-1 10-9 10','none','#91ab7c',2);
const strawberry=(x,y,z=1)=>at(p('M-12-5q12-12 24 0 3 12-12 24-15-12-12-24z','#db8d98')+p('M-10-8l6-4 4 3 4-3 6 4-10 4z','#a3c28f')+repeat(5,j=>p(`M${-6+j%3*6} ${j<3?1:8}v1.4`,'none','#f4d6b7',1.6)),x,y,z);
const bean=(x,y,z=1,roasted=false)=>at(e(0,0,9,13,roasted?'#957567':'#c0a287')+p('M1-10q-9 7 0 11t-1 9','none',roasted?'#dcc2a0':'#f0d7ad',2),x,y,z);
const disc=(x,y,rad=19,color='#596373')=>c(x,y,rad,color)+c(x,y,rad*.78,'none')+c(x,y,rad*.48,'none')+c(x,y,rad*.24,'#dbbd9c')+c(x,y,1.4,'#344d64');
const note=(x,y,z=1)=>at(p('M0 0v-17l13-4v17M0-17l13-4','none','#e0c9aa',2.6)+e(-3,1,5,3,'#e0c9aa')+e(10,-3,5,3,'#e0c9aa'),x,y,z);
const fanShell=(x,y,z=1,color='#edcfb7')=>at(p('M0 19q-25-10-22-29-1-11 11-12 7-10 14 0 13-4 16 9 4 20-19 32z',color)+p('M0 17l-16-27m16 27l-8-33m8 33V-19m0 36l8-32m-8 32l17-25','none','#c3a18e',1.4),x,y,z);
const conch=(x,y,z=1)=>at(p('M-25 13l9-19q11-19 25-10 23 12 7 32-12 11-26-2l-15 10z','#e7c4ad')+p('M-17 5q11-24 26-12 12 11-3 20-15 6-17-6-1-9 10-10 11 3 4 9','none','#b79583',2)+p('M-26 12l-5 8 13-7-2-8z','#f0dbbd')+p('M-12-6l-5-3m1 16l-5 3','none','#d0aa91',1.5),x,y,z);
const glassBottle=(x,y,z=1,color='#a8d9d0',wide=false)=>at(p(wide?'M-6-24h12v11q18 5 15 34-21 12-42 0-3-29 15-34z':'M-5-24h10v12l8 9v27h-26V-3l8-9z',color+'a0')+e(0,-24,wide?6:5,2,'#e6d9bf')+p('M-7 3v15','none','#e6efdb',2.2),x,y,z);
const guitar=(x,y,z=1,color='#c3a487',electric=false)=>at(p(electric?'M-8-4l-9 9 7 5-6 13q15 15 30 0l-7-13 7-5-9-9-4 7z':'M-5-8q-13-5-16 7-2 7 5 12-13 19 9 25 25 2 20-18-2-5-7-7 8-18-6-20z',color)+r(-3,-32,6,33,'#ddc29b',1)+r(-5,-39,10,9,'#ab8b79',1)+c(0,9,5,'#687677')+p('M-1-31v56m-7 0H8','none','#f0dcc0',1.3),x,y,z);
const flag=(x,y,z=1,color='#d2b0c6')=>at(p('M-17-23v51','none','#e0c7a4',2.8)+p('M-15-23q15 7 30 0v27q-15 7-30 0z',color)+p('M-11-16q12 5 21 0','none','#eddbc4',1.5),x,y,z);
const lantern=(x,y,z=1,color='#e6c4aa',paper=false)=>at(p(paper?'M-15-18l15-7 15 7v35L0 25l-15-8z':'M-14-19q14-11 28 0 10 20 0 38-14 9-28 0-10-18 0-38z',color)+p('M-10-18h20m-20 37h20M0-24v-8m0 57v8','none','#d9b58b',2.2)+p(paper?'M0-24v48m-15-42l15 8 15-8M-15 17l15-7 15 7':'M-7-17q-8 17 0 34m14-34q8 17 0 34','none','#efddbc',1.4),x,y,z);
const oar=(x,y,z=1)=>at(p('M-2-27h4V8l7 8-2 14H-7l-2-14 7-8z','#ccb08a')+p('M0 12v14','none','#f0d6a8',2),x,y,z);
const hull=(color='#baa081')=>p('M5 44h54l-12 14H17z',color)+p('M10 46h44','none','#e7caa2',2)+p('M6 60q6-5 12 0t12 0t12 0t12 0','none','#9fc7c6',1.8);
const sail=(x,y,z=1,color='#e2ceb3')=>at(p('M0-30v33','none','#d1b294',2.6)+p('M3-28l20 26H3z',color)+p('M-3-24l-18 22h18z','#b6c9be'),x,y,z);
const starLight=(x,y,z=1)=>at(p('M0-8l2.7 5.4 6 .9-4.4 4.3 1 6L0 5.8l-5.3 2.8 1-6-4.4-4.3 6-.9z','#e9d39c','#bca47d',1),x,y,z);
const drinkBottle=(x,y,z=1,color='#a5d2bd')=>at(p('M-5-25h10v10l9 9v29h-28V-6l9-9z',color)+r(-6,-28,12,4,'#e1c7a3',1)+r(-11,2,22,12,'#eddfbf',1)+p('M-9-6v5','none','#d9ead1',2),x,y,z);
const swimRing=(x,y,z=1,color='#c0b3d1')=>at(c(0,0,24,color)+c(0,0,13,'#30485d')+p('M-18-17l9 8m18-8l-9 8m-18 18l9-9m18 9l-9-9','none','#e4d2ba',5)+c(0,0,13,'#30485d'),x,y,z);
const whale=(x,y,z=1,color='#b0c4d1',night=false)=>at(p('M-25 8q-3-23 26-22 14 0 19 14l10-12 3 11-8 12-10 7q-35 10-40-10z',color)+p('M-6 11l7 13 13-15','#d8c8de')+e(1,-3,12,5,'#e0daca')+c(-15,1,2,'#536d7a')+(night?starLight(-3,-5,.65)+p('M-12-10q6-12 10-5','none','#ead8a9',2):''),x,y,z);
const solarPanel=(x,y,w=42,h=28)=>r(x,y,w,h,'#6d92aa',1)+repeat(3,j=>p(`M${x+(j+1)*w/4} ${y+2}v${h-4}`,'none','#b7d2cf',1.2))+p(`M${x+2} ${y+h/2}h${w-4}`,'none','#b7d2cf',1.2);
const fanRotor=(x,y,z=1)=>at(repeat(3,j=>`<g transform="rotate(${j*120})">${p('M0-2q-14-16-1-23 18-7 15 8L5 3z','#a8cfc1')}</g>`)+c(0,0,5,'#e1c6a3'),x,y,z);
const fanHead=(x,y,z=1)=>at(c(0,0,25,'#bbd1c0')+c(0,0,21,'#405f73')+fanRotor(0,0,.75)+p('M-22 0h44M0-22v44','none','#d7ddc3',1.2),x,y,z);
const sheet=(x,y,z=1,color='#e9d7b6')=>at(p('M-18-25h29l8 9v42h-37z',color)+p('M11-25v10h8M-11-9h22m-22 8h22m-22 8h18m-18 8h21','none','#a8afa5',1.3),x,y,z);
const inkBottle=(x,y,z=1,color='#a5a5c4')=>at(r(-13,-10,26,30,color,3)+r(-8,-18,16,9,'#b9c6bd',1)+r(-9,-23,18,6,'#d6c49f',1)+r(-9,-2,18,13,'#e5d6b5',1)+p('M-7 3h14','none','#8c94a5',1.8),x,y,z);
const closedBook=(x,y,z=1,color='#adc3b3')=>at(p('M-19-24h34l5 6v43h-38z',color)+p('M-19-24v46m6-40h21m-21 36h29','none','#e3d0ad',2)+p('M15-20v40h-29','none','#f0dfc1',2.4),x,y,z);
const pot=(x,y,z=1,color='#bdcac4',lid=false)=>at(p('M-21-4h42v25q-21 12-42 0z',color)+e(0,-4,21,6,'#e3d2b4')+p('M-21 2h-8v10h8m42-10h8v10h-8','none','#c0b498',3)+(lid?e(0,-7,23,7,'#b4c2b4')+r(-5,-14,10,5,'#d6bb92',2):e(0,-4,17,3,'#6e898a')),x,y,z);
const drinkCup=(x,y,z=1,color='#b6d5bc')=>at(p('M-11-15h22L7 20H-7z',color)+e(0,-15,11,3,'#e3debf')+p('M3 1l4-28 8-4','none','#dcb8c5',2.5)+c(-2,-5,4,'#eee0ac'),x,y,z);
const ice=(x,y,z=1)=>at(p('M-5-5h10v10H-5z','#d1e5debb')+p('M-2-3l5 6','none','#f0ebd4',1),x,y,z);
const iceBucket=()=>p('M9 27h46l-7 31H16z','#a7c5bb')+e(32,27,23,6,'#d5d5bc')+p('M13 27q19-22 38 0','none','#dcc39d',2.5);
const soupBowl=(x,y,z=1,liquid='#d8b58e',color='#b9cbbb')=>at(p('M-23-4h46q-2 26-23 27Q-21 20-23-4z',color)+e(0,-4,23,7,liquid)+p('M-12-15q-5-8 0-15M1-15q-5-8 0-15m13 15q-5-8 0-15','none','#d8e2c8',1.5),x,y,z);
const maple=(x,y,z=1,color='#d5b299')=>at(p('M0-18l5 11 9-6-1 11 10 2-10 7 2 8-13-5-2 12-2-12-13 5 2-8-10-7 10-2-1-11 9 6z',color)+p('M0-10v27m0-20l-9 5m9-1l10 4','none','#ebd0ad',1.1),x,y,z);
const photoCard=(x,y,z=1,color='#b5c8c0',people=1)=>at(r(-18,-24,36,48,'#eee1c5',1)+r(-14,-20,28,32,color,1)+repeat(people,j=>{const xx=people===1?0:-10+j*20/(people-1);return c(xx,-9,people>3?2.3:4,'#d8bda6')+p(`M${xx-3} 7v-6q3-5 6 0v6z`,j%2?'#ab9db8':'#8fa9a0')})+p('M-10 18h20','none','#c5b89f',1.6),x,y,z);
const mapPaper=(x,y,z=1,color='#ded1ae')=>at(p('M-26-21l17-5 17 6 18-5v45l-18 5-17-6-17 5z',color)+p('M-9-25v45m17-39v45','none','#c0bd9f',1.2)+p('M-20 10l10-14 13 9 10-17 9 11','none','#91b5a1',2)+c(-20,10,2,'#d29fac')+c(22,-1,2,'#b1aacd'),x,y,z);
const gearWheel=(x,y,rad=17,color='#cbb593')=>at(p(Array.from({length:32},(_,j)=>{const rr=j%4<2?rad:rad*.8,a=j*Math.PI/16;return(j?'L':'M')+(Math.cos(a)*rr).toFixed(2)+' '+(Math.sin(a)*rr).toFixed(2)}).join('')+'z',color)+c(0,0,rad*.6,'none')+c(0,0,rad*.24,'#49697b'),x,y);
const clockFace=(x,y,rad=19,hour=3,minute=10)=>c(x,y,rad,'#e9d7b4')+repeat(12,j=>{const a=j*Math.PI/6,xx=x+Math.sin(a)*rad*.81,yy=y-Math.cos(a)*rad*.81;return p(`M${xx} ${yy}l${-Math.sin(a)*2} ${Math.cos(a)*2}`,'none','#9c9f91',1)})+p(`M${x} ${y}l${Math.sin((hour*30+minute*.5)*Math.PI/180)*rad*.5} ${-Math.cos((hour*30+minute*.5)*Math.PI/180)*rad*.5}M${x} ${y}l${Math.sin(minute*6*Math.PI/180)*rad*.75} ${-Math.cos(minute*6*Math.PI/180)*rad*.75}`,'none','#668488',1.9)+c(x,y,1.8,'#c1a987');
const signalHead=(x,y,z=1,colors=['#d1aaa7','#dbc898','#afc8a5'])=>at(r(-9,-23,18,46,'#597688',4)+repeat(colors.length,j=>c(0,-15+j*15,5,colors[j]))+p('M0 23v12','none','#c5ccbb',2.8),x,y,z);
const scarf=(x,y,z=1,color='#cab1c5')=>at(p('M-17-24h34v12H1v38h-13v-38h-5z',color)+p('M-12-18h20m-15 8h8m-8 9h8m-8 9h8m-8 9h8m-8 9v6m4-6v6m4-6v6','none','#e8d5ce',1.5),x,y,z);
const flame=(x,y,z=1)=>at(p('M0-23q2 14 9 15-1-7 6-11 0 16 7 23-1 19-21 19Q-23 22-22 6q3-10 10-16-1 11 8 14-3-14 4-27z','#d9ac89')+p('M1-6q-12 9-8 17 9 11 16 0-1-7-8-17z','#efd69e'),x,y,z);
const flake=(x,y,z=1)=>at(repeat(6,j=>`<g transform="rotate(${j*60})">${p('M0 0v-22m0 8l-6-6m6 6l6-6m-6 15l-5-5m5 5l5-5','none','#d4e4e4',2)}</g>`),x,y,z);
const snowman=(x,y,z=1)=>at(c(0,11,15,'#dce8e3')+c(0,-11,10,'#e6ebdd')+r(-11,-17,22,4,'#b2b3c8',1)+r(-7,-25,14,8,'#adbdc3',1)+c(-3,-11,1.1,'#6a8191')+c(3,-11,1.1,'#6a8191')+p('M0-7l6 2-6 2z','#d1ad87')+p('M-7 0h14m-2 0v13','none','#c9afc7',3)+p('M-13 9l-11-8m37 8l11-8','none','#bcac94',2)+c(0,12,1.6,'#7d939b')+c(0,20,1.6,'#7d939b'),x,y,z);
const lensDisk=(x,y,z=1,color='#a4ced4')=>at(c(0,0,23,color+'90')+c(0,0,19,'none')+p('M-12-10q5-7 13-7','none','#e3ead6',2.4)+p('M10 13l5-7','none','#d6e7db',1.7),x,y,z);
const telescope=(x,y,z=1,color='#a9c9cb')=>at(p('M-24-8L10-21 23-2-11 10z',color)+e(16,-11,9,12,'#698b9f')+e(16,-11,5,8,'#badbd5')+p('M-21-6l-8 3 4 10 8-3','none','#dfc6a0',3)+p('M-2 5v13m0 0l-18 19m18-19l19 19m-19-19v20','none','#c8c7ab',2.8),x,y,z);
const skyDisc=(x,y,rad=23)=>c(x,y,rad,'#667f9d')+c(x,y,rad*.78,'none')+p(`M${x-rad*.6} ${y+rad*.2}l${rad*.45} ${-rad*.6} ${rad*.45} ${rad*.35} ${rad*.25} ${-rad*.4}`,'none','#c9d2cc',1.4)+repeat(5,j=>c(x+Math.cos(j*1.1)*rad*.65,y+Math.sin(j*1.1)*rad*.65,1.7,'#ead9b4'));
const batteryCell=(x,y,z=1,color='#a7c6af')=>at(r(-10,-22,20,44,color,3)+e(0,-22,10,3,'#d9d5b8')+r(-4,-28,8,6,'#b5c8bd',1)+p('M-5-8h10m-5-5v10M-5 12h10','none','#e9d8b4',2),x,y,z);
const beaconLens=(x,y,z=1)=>at(e(0,0,21,25,'#accfd1a0')+repeat(4,j=>e(0,0,18-j*4,22-j*5,'none'))+p('M-16-10l7-6','none','#e7edd7',2.2),x,y,z);
const fir=(x,y,z=1,color='#afc8ba')=>at(p('M0-22l-12 17h5l-12 15h10l-14 14h46L9 10h10L7-5h5z',color)+p('M0 23v8','none','#c8b293',3)+p('M-7-5H7m-18 15h22m-17 8h12','none','#e1e9d8',2),x,y,z);
const stove=(x,y,z=1,color='#acbbb1')=>at(r(-21,-24,42,46,color,4)+r(-15,-17,30,29,'#44657a',3)+flame(0,0,.42)+p('M-11-24v-10H9m-26 56v7m34-7v7','none','#c9b79b',3)+p('M-14 17h28','none','#d9c7a6',2),x,y,z);
const teaPot=(x,y,z=1,color='#b5cfbf')=>at(p('M-17-9q-20 3-7 29 23 18 46-2 10-24-13-28z',color)+p('M-19 0l-12-9 3 23 8 1','none','#cdb896',3)+p('M23-1q21-4 14 15l-12 5','none','#b7c7b8',3)+e(0,-10,16,4,'#d8d4b6')+r(-5,-18,10,6,'#c5b392',2),x,y,z);
function lowBody(chain,level){const n=level-1;if(n<0||n>2)return null;switch(chain){
case 'tool':return [
 ()=>p('M18 14l30 31-5 5-30-31z','#b7c9cb')+p('M13 13l5-5 9 9-8 8z','#d8d9c6')+p('M18 15l5 5m5 8l-5 6m12 1l-5 6m12 1l-5 6','none','#eef0d9',2),
 ()=>p('M31 8h4v30h-4z','#d6ddd2')+p('M29 9h8V5h-8z','#bdcdd0')+p('M26 37h14l-2 21H28z','#bfa58d')+p('M32 40v14','none','#eed5ae',2),
 ()=>p('M19 8l-5 11 11 10 15 22 9-7-18-21 1-14-8-4 1 12-7 2z','#b9cdd0')+c(42,45,3,'#6e8793')
][n]();
case 'wood':return [
 ()=>p('M10 27l27-11 7 8-24 9zM21 41l27-10 6 8-27 10zM8 45l8-7 5 6-8 9z','#d0af87')+p('M17 28l19-8m-7 22l17-7','none','#f2d6ad',1.7),
 ()=>p('M7 24l42-10 9 8-42 10zM16 32l42-10v12L16 45zM7 24v12l9 9V32z','#c6a17d')+p('M22 35l29-8m-26 14l21-6','none','#ead1a3',1.8),
 ()=>p('M8 15l45-7 4 42-45 7z','#caab87')+p('M17 17q16-7 29-4M17 30q17-8 31-4M18 45q13-9 32-5','none','#f0d4a4',2)+e(33,30,6,3,'#ac866d')
][n]();
case 'cloth':return [
 ()=>p('M12 15q12-9 23 1T47 35q-15 13-27 5T9 54M36 19q-18-9-23 5 1 10 18 7','none','#e1c9db',3),
 ()=>c(30,29,19,'#d7bed0')+p('M19 14q24 8 23 24M12 22q24-5 33 14M12 32q14-11 35-1M18 44q3-26 20-28M28 47q-3-25 9-33M46 38q11 3 8 18','none','#f2d9da',1.8),
 ()=>p('M8 15l45-5 4 40-44 6z','#d6bacb')+p('M13 20l35-4 3 29-33 4z','none','#f1d8cf',1.8)+p('M13 54l8-10 30 3','none','#b99bb9',2)+p('M8 18l-3 5m48-10l7 2m-46 40l-2 5','none','#e4c9d3',1.5)
][n]();
case 'flower':return [
 ()=>p('M20 16q26 2 14 31-25-2-14-31z','#b8b389')+p('M27 22q-8 13 1 19','none','#e2d4a2',2),
 ()=>p('M31 55V25M31 34q-22 0-19-21 20 1 19 21m0-8q1-20 20-20 1 21-20 20','none','#adc99a',2.2)+p('M12 13q18 0 19 21-18-1-19-21M51 6q-1 19-20 20 1-17 20-20','#b6d59a')+p('M17 56h29','none','#ccb38c',3),
 ()=>p('M31 57V24m0 22q-17-2-18-14 13-1 18 14','none','#a9c88f',2.5)+at(repeat(8,j=>`<ellipse cx="0" cy="-9" rx="4" ry="10" fill="#f3ead0" stroke="#b8b6a0" stroke-width="1" transform="rotate(${j*45})"/>`)+c(0,0,5,'#eed59b'),32,22)
][n]();
case 'tea':return [
 ()=>e(26,30,10,13,'#a69c79')+e(41,39,8,11,'#b4ad87')+p('M25 20v18m16-10v19','none','#dfd3a1',2),
 ()=>p('M13 47q-9-28 29-37 15 31-29 37z','#a9c38e')+p('M13 48l29-38m-24 32l-2-11m9 5l14-4m-10-1l-2-12','none','#e1dfb5',1.6),
 ()=>e(32,45,28,8,'#d4bc99')+repeat(7,j=>p(`M${11+j%4*12} ${31+Math.floor(j/4)*9}q-5-16 8-19 8 14-8 19z`,j%2?'#9da77a':'#bdc28e'))
][n]();
case 'fruit':return [
 ()=>p('M23 14q27 10 14 36-27-6-14-36z','#b5947b')+p('M28 20q-9 15 4 23','none','#e4c7a0',2),
 ()=>c(31,34,18,'#bad18d')+p('M31 18v-8m1 7q6-14 17-8-3 10-17 8','none','#9dbe88',2.4)+p('M22 25q-5 6-4 11','none','#e3edba',2.6),
 ()=>strawberry(32,29,1.6)
][n]();
case 'coffee':return [
 ()=>bean(32,31,1.7),
 ()=>bean(21,24,1.05,true)+bean(43,31,1.05,true)+bean(24,47,.8,true),
 ()=>p('M17 18h32l-5 38H23z','#e0c6ab')+r(18,32,30,13,'#b6c2a5',1)+e(33,18,16,4,'#eee0c4')+p('M23 8q-4-5 0-7m12 7q-4-5 0-7','none','#c7d5bf',2)+e(33,18,8,1.8,'#8c695d')
][n]();
case 'pastry':return [
 ()=>p('M17 11h32l-6 12 11 32q-23 12-43 0l11-32z','#e4ceb0')+p('M21 23h23','none','#bcac93',2)+r(21,33,24,17,'#f0e4cd')+p('M32 47V35m0 7l-6-4m6 8l6-4','none','#c2b180',2),
 ()=>p('M10 42q-2-25 25-25 24 3 21 25-20 22-46 0z','#f1d6b3')+p('M20 27q13-8 23 0M17 34q15-10 30-1','none','#d7b58e',2)+e(32,48,21,5,'#d6bc98'),
 ()=>c(32,32,24,'#e4c499')+c(32,32,19,'#f0d9ad')+repeat(7,j=>c(18+j%3*13,21+Math.floor(j/3)*12,1.9,'#b39d7d'))+p('M20 51h25','none','#c0a682',1.8)
][n]();
case 'circuit':return [
 ()=>p('M10 49h38q15-1 4-10L17 22q-10-10 8-10h20q13 1 4 8','none','#d3b294',4)+p('M10 49H4m43-35h9','none','#e9d9be',3),
 ()=>p('M32 10q-4 13-17 28-11 22 17 22 27-1 16-23-12-15-16-27z','#cad9d4')+p('M25 32q-9 8-5 15','none','#f0e5cb',2.5),
 ()=>r(9,10,46,45,'#9cc6b0')+r(22,24,20,18,'#526c78',1)+p('M10 20h12v7m22-9h9m-9 11h9M16 41h6m-9 11h21v-8m10-1v10','none','#e4d3a5',2)+repeat(4,j=>c(13+(j%2)*38,14+Math.floor(j/2)*37,2,'#d9bea0'))
][n]();
case 'vinyl':return [
 ()=>p('M14 8h33l5 47H12z','#e3d4b7')+p('M19 19h23m-22 6h23m-23 6h23','none','#a9b1b7',1.3)+note(30,43,.65),
 ()=>r(7,16,50,34,'#b4c0bd')+c(21,29,8,'#697b86')+c(43,29,8,'#697b86')+p('M17 45h30l-4-9H21z','#e1c8a6')+p('M25 29h14','none','#decba8',1.8),
 ()=>disc(32,32,22,'#a3adc0')
][n]();
case 'rope':return [
 ()=>p('M9 51q42 9 44-15-7-20-31-15-22 5-12 16 9 9 31 0 21-9 8-23-11-12-32-2','none','#d6b893',4)+p('M9 51L4 57m13-45l-6-6','none','#efd9b5',3),
 ()=>p('M5 12l48 40M8 54l48-45M16 26q14-19 27-1 14 24-14 24-22-2-13-23z','none','#d7bb98',5)+p('M19 26q17-9 20 10','none','#f0d8b5',1.8),
 ()=>e(32,39,25,15,'#b5987c')+e(32,35,25,12,'none')+e(32,30,24,11,'none')+e(32,25,23,10,'#d9bd98')+e(32,25,13,5,'#647584')+p('M52 39l6 16-9-1','none','#e9ceac',3)
][n]();
case 'shell':return [
 ()=>at(conch(32,32,.75)+p('M18 37l-6 8','none','#f0d7bd',2),0,0),
 ()=>p('M10 19q22-12 44 0l-5 31q-17 13-34 0z','#f0e2cb')+p('M16 23l5 22m9-25v28m9-28l-4 25m11-23l-5 22','none','#cdbbac',1.8),
 ()=>fanShell(32,31,1,'#e7c8b8')
][n]();
case 'glass':return [
 ()=>p('M10 17l33-10 13 24-39 23z','#aadad1a0')+p('M17 54l8-27 18-20','none','#e2ebd6',2),
 ()=>p('M12 23q11-18 31-12 20 6 9 31-8 21-33 9-14-8-7-28z','#b8d7cebb')+p('M18 22q10-9 21-6','none','#e9ecdb',3),
 ()=>p('M13 15l31-5 12 29-21 17-24-17z','#98cfc7bb')+p('M15 17l16 20 13-24m-13 24l4 19','none','#dfeddb',2)
][n]();
case 'music':return [
 ()=>p('M15 12q17-9 34 0 13 9-17 42Q3 21 15 12z','#d5b69a')+p('M20 20q12-7 22 0','none','#eddbbd',2),
 ()=>p('M7 20l44-7 6 26-44 8z','#b7ccca')+p('M12 25l40-6m-37 22l39-6','none','#e2d5b4',2)+repeat(7,j=>r(14+j*5,27-j*.8,3,9,'#5d7380',.5)),
 ()=>e(32,21,23,9,'#ecddc3')+p('M9 22l4 30q19 11 38 0l4-30z','#c6a486')+e(32,21,23,9,'#ecddc3')+p('M13 31l7 21 8-23 8 25 9-25 6 19','none','#eed6ad',2)
][n]();
case 'banner':return [
 ()=>p('M8 13q23-7 45 0l-6 12q-21-7-41 0z','#d6b2c8')+p('M13 30q22 4 42-3l2 11q-26 7-43 1z','#b3d0bd')+p('M8 49q18-8 42-3l4 9q-25-2-42 4z','#e4ca9f'),
 ()=>p('M12 10h41L16 55z','#cbb1c7')+p('M16 15h27L19 44z','none','#edd5bf',1.8)+p('M12 10v45','none','#a5baba',2),
 ()=>p('M16 6v53','none','#dec9a8',3)+p('M18 11l36 18-36 15z','#dcb8c9')+p('M23 20l18 9-18 9','none','#efddbb',1.5)
][n]();
case 'lamp':return [
 ()=>p('M25 55q-7-20 5-31 10-8 9-20','none','#dbcda4',3.5)+p('M20 58h16','none','#b8c6bd',4)+p('M34 15q-6-6 0-12 5 5 0 12','#e9c684','#c1ae87',1.4),
 ()=>p('M22 44q-14-10-9-24 10-21 31-9 18 14-3 33v10H22z','#e9dbada0')+p('M26 43l-7-20 13 8 13-8-8 20','none','#e4cd98',1.8)+p('M22 47h20m-20 6h20m-17 5h14','none','#b9c4bb',3),
 ()=>p('M20 8h25l9 24H10z','#e4d1aa')+p('M32 32v23m-14 3h29','none','#b4c8bd',4)+e(32,32,22,4,'#eadab6')+p('M24 12h17','none','#f1e7ca',1.8)
][n]();
case 'soda':return [
 ()=>p('M20 17h24v27H20z','#e7d1a7')+p('M20 20l-14-5 3 16-3 13 14-3m24-21l14-5-3 16 3 13-14-3z','#b9d4c3')+p('M26 24v13m8-13v13','none','#f1e5c5',2),
 ()=>p('M22 11h20v13l8 9v22H14V33l8-9z','#d3b18d')+r(20,8,24,6,'#dccaa7',2)+r(20,36,24,11,'#ecdabb',1)+p('M24 19h16','none','#f1dcb3',2),
 ()=>drinkBottle(32,34,1,'#a5d5c2')
][n]();
case 'float':return [
 ()=>p('M7 19l46-8 4 30-45 15z','#bbb6d3')+p('M12 23l34-6 3 20-33 10','none','#ddd5e5',2)+p('M12 56l3-9 35-10','none','#94a8bd',2),
 ()=>p('M22 22h20v30H22z','#bbcbd1')+e(32,22,10,5,'#e3d2b4')+r(28,6,8,16,'#a1b7b9',1)+p('M22 30h20m-20 7h20m-20 7h20m-15 13h10','none','#e5d8bf',1.7),
 ()=>p('M14 23q3-20 18-20t18 20v29q-18 12-36 0z','#b9bbd8')+p('M21 26q11-5 22 0v19H21z','none','#e4d8df',2.2)
][n]();
case 'solar':return [
 ()=>p('M20 9h24l11 11v24L44 55H20L9 44V20z','#89abc1')+p('M15 23h34m-34 10h34m-30-17v33m11-33v33m11-30v28','none','#c7dcd6',1.3),
 ()=>r(16,14,32,34,'#7295ad',1)+p('M23 19v25m9-25v25m9-25v25M17 31h30m-23-17V7m15 7V7m-15 41v9m15-9v9','none','#c6dbd1',1.5),
 ()=>solarPanel(10,15,44,30)+p('M20 15V8h9m16 37v11H35','none','#dfc9a5',2.5)+c(29,8,2,'#ebd6b0')+c(35,56,2,'#ebd6b0')
][n]();
case 'fan':return [
 ()=>p('M29 38q-21-11-14-24 12-18 26-7 13 13-6 31l-3 11z','#add0c4')+p('M21 17q7-6 13-5','none','#e1e6cb',2.5)+c(31,42,5,'#dec79f'),
 ()=>fanRotor(32,33,1),
 ()=>fanHead(32,23,.7)+r(27,39,10,20,'#b9d1c4',3)+c(32,48,2,'#e2c8a3')
][n]();
case 'paper':return [
 ()=>p('M9 15l19-7 4 14-20 7zM36 18l19 8-10 16-19-9zM15 40l20-2 7 15-25 5z','#e4d0ac')+p('M13 18l11-4m-4 33l13-2','none','#f2e1c3',1.8),
 ()=>sheet(32,31,.85,'#f0e1c5'),
 ()=>p('M8 15l43-8 7 39-44 12z','#cba77d')+p('M14 23l30-6m-28 16l24-5m-22 16l30-6','none','#ead0a4',1.6)+p('M51 7l-6 11 13 28','none','#b09075',1.5)
][n]();
case 'ink':return [
 ()=>p('M10 43l8-13 8 4 6-16 13 11 10 15z','#a4a2b6')+repeat(6,j=>c(8+j*9,52-(j%2)*3,2.2,'#c0b4cc'))+p('M22 35l8 7 10-8','none','#d2cad9',1.8),
 ()=>p('M32 5q-7 15-19 29-13 25 18 27 33-2 20-27Q37 18 32 5z','#9c9ebc')+p('M23 32q-9 11-5 16','none','#d2cbd9',2.5),
 ()=>inkBottle(32,35,1)
][n]();
case 'book':return [
 ()=>sheet(32,32,1,'#e9d9b8'),
 ()=>sheet(32,32,.95,'#e9dbc0')+p('M37 7h8v32l-4-5-4 5z','#cbb0c2'),
 ()=>closedBook(32,31,.82,'#b7cfbe')+p('M20 22h14m-14 6h18','none','#8eaaa0',1.5)+p('M20 14v3m0 24v3','none','#d9bd94',2)
][n]();
case 'pan':return [
 ()=>p('M25 27l22 22-6 6-22-22z','#b4c7c9')+e(23,23,16,10,'#aabcc3')+e(23,20,16,9,'#dedfcd')+p('M16 20h14','none','#8fa4ad',2.4)+p('M32 37l5-5m0 10l5-5','none','#dbe1cd',1.5),
 ()=>p('M29 27h6v32h-6z','#cab08e')+e(32,18,11,15,'#dec4a2')+e(32,18,6,10,'#b2997f')+p('M30 31v21','none','#edd7b2',1.7),
 ()=>e(27,38,20,15,'#bccbd0')+e(27,36,16,10,'#536d80')+p('M43 28l12-16','none','#d3b392',6)+p('M51 15l5-7','none','#9bb4bc',3)
][n]();
case 'soup':return [
 ()=>p('M11 18h40l-5 37H17z','#d3b68e')+p('M16 19l7-8h18l6 8','none','#e9d3ad',2)+maple(32,35,.55,'#b8c7a5'),
 ()=>repeat(6,j=>r(11+j%3*16,16+Math.floor(j/3)*23,12,12,['#dab694','#afc5a3','#e3c793'][j%3],2)+p(`M${13+j%3*16} ${18+Math.floor(j/3)*23}l5 5`,'none','#eee0bc',1.4)),
 ()=>soupBowl(32,35,.98)+repeat(3,j=>c(23+j*9,31,2.4,'#b8ca9e'))
][n]();
case 'table':return [
 ()=>p('M10 10h44L12 55z','#d4bea0')+p('M15 15h28L17 43z','none','#ecdabb',1.8),
 ()=>p('M9 16l44-5 4 38-44 6z','#c8b8cd')+p('M15 22l32-4 3 24-32 5z','none','#e5d0bd',1.8)+p('M12 53l5 5m6-6l5 5m6-6l5 5m6-6l5 5','none','#d9c3d1',1.1),
 ()=>p('M8 49l24-41 24 41z','#e8d8bf')+p('M32 8v42M8 49l24-15 24 15','none','#c2bea8',1.7)+r(20,37,24,8,'#b5c7b9',1)
][n]();
case 'photo':return [
 ()=>p('M13 9h39L15 55z','#e6d9be')+p('M18 14h23L19 43z','#a9bdc3')+p('M20 33l9-13 7 6','none','#ddc8a7',2),
 ()=>r(8,7,48,50,'#8b9aab',1)+repeat(3,j=>r(18,11+j*15,28,11,'#b7aebc',1))+repeat(12,j=>r(j%2?50:11,10+Math.floor(j/2)*8,3,4,'#ebd7b7',.5)),
 ()=>photoCard(32,32,1)
][n]();
case 'display':return [
 ()=>p('M17 11h30l14 21-14 21H17L3 32z','#b8cbc6')+c(32,32,13,'#657f8c')+c(32,32,8,'#273f57')+p('M16 16l9-3','none','#e3dfc4',2),
 ()=>p('M25 7h12v45H25z','#afc8c4')+p('M25 14h12m-12 32h12m-13 9h14','none','#e3d2b0',2.4)+e(31,7,6,2,'#e0d6bc'),
 ()=>p('M6 16h52v10H6z','#d2bc97')+p('M13 26h38v31H13z','#abc8bd')+p('M11 16l7-8h33l7 8M16 29h32','none','#e3cda8',1.8)
][n]();
case 'signal':return [
 ()=>r(15,17,34,30,'#9fb6b8',2)+p('M20 21h24M22 48v9m20-9v9','none','#ded0aa',2.4)+c(32,31,8,'#c4cca3'),
 ()=>p('M14 10h36l5 40H9z','#decea1a0')+p('M20 17h23v25H17z','none','#eae1c4',1.8)+p('M13 54h40','none','#adbfad',3),
 ()=>r(15,11,34,36,'#94b5b8',5)+c(32,29,12,'#b8cc99')+p('M32 47v11m-14 3h28','none','#d5c5a1',3)
][n]();
case 'map':return [
 ()=>p('M10 9h43L12 56z','#e2d1ae')+p('M17 36l7-18 17 1','none','#94b7a0',2)+c(24,18,3,'#caacbf'),
 ()=>sheet(32,32,.95,'#dfd3b3')+p('M20 44l9-19 16 12m-6-17l6 17-11 7','none','#99b4a1',2)+c(20,44,2.5,'#c6a9bf'),
 ()=>mapPaper(32,30,.9)
][n]();
case 'gear':return [
 ()=>p('M7 22l25-13 7 10-24 13zM30 36l19-9 8 13-23 9zM10 47l10-6 8 8-10 8z','#b7b5a6')+p('M14 23l13-6m11 24l11-5','none','#e0d1b3',2),
 ()=>gearWheel(32,32,21,'#b6c6c7'),
 ()=>gearWheel(32,32,25,'#c9aa86')+repeat(4,j=>c(32+Math.cos(j*Math.PI/2)*13,32+Math.sin(j*Math.PI/2)*13,3,'#dccaac'))
][n]();
case 'clock':return [
 ()=>p('M31 53V8l-6 12h12l-6-12M31 38l19-11-4 11-9-5','none','#ddc39d',3.4)+c(31,38,4,'#adbbc0'),
 ()=>clockFace(32,32,25),
 ()=>c(32,34,24,'#c6a17e')+clockFace(32,34,19)+r(27,5,10,6,'#d9c39e',2)+p('M23 5q9-9 18 0','none','#e3d5b5',2)
][n]();
case 'scarf':return [
 ()=>p('M13 49q30-23 28-34-6-16-21-3-14 15 6 21 18 3 25-10','none','#dac0d2',3)+p('M13 49L7 56m44-33l6-6','none','#eee0d2',1.7),
 ()=>c(31,31,22,'#ceb3c8')+p('M14 18q26 0 34 24M10 29q28-9 41 4M16 46q2-24 23-35m-7 41q-7-29 9-39M51 37q10 7 6 19','none','#ead7d8',2.1),
 ()=>p('M12 18h40v32q-20 15-40 0z','#cbb3c9')+e(32,18,20,7,'#e4d1d9')+e(32,18,12,4,'#9e94b1')+p('M19 26v20m9-20v24m9-24v24m9-24v20','none','#e6d0d5',1.5)
][n]();
case 'fire':return [
 ()=>p('M7 38l12-18 17-7 20 22-9 21-32-2z','#79848b','#b6b39f',2)+p('M19 20l5 24 23 12M24 44l19-18','none','#ced1bc',2),
 ()=>p('M12 12l7-5 33 43-7 6zM10 45l38-36 6 7-38 37z','#c5a383')+p('M18 15l28 35m-31-2l33-30','none','#e8c99e',2),
 ()=>p('M6 36h52l-7 19H13z','#baaa91')+e(32,36,26,6,'#6c7c7e')+flame(32,26,.62)+p('M16 56v5m32-5v5','none','#ddc8a3',2.5)
][n]();
case 'ceramic':return [
 ()=>p('M7 37q2-14 17-13 4-18 17-15 21 8 13 28 8 17-22 19Q1 55 7 37z','#cbb096')+p('M15 36q10-5 18 4m-7-21q12-4 17 7','none','#e3c5a6',2),
 ()=>c(32,32,25,'#cbb499')+p('M16 21q6-10 20-8','none','#ead2b2',3)+e(33,47,13,4,'#ae9f90'),
 ()=>at(cup('#b9d3c5'),1,-4,.98)
][n]();
case 'snow':return [
 ()=>p('M32 5l22 22-8 24-27 6L7 29z','#bddcdda0')+p('M32 5v28l14 18M7 29l25 4 22-6M19 57l13-24','none','#e6eee1',1.8),
 ()=>flake(32,32,1.18),
 ()=>snowman(32,31,.97)
][n]();
case 'lens':return [
 ()=>p('M9 16l29-9 19 19-26 31L7 36z','#add6d590')+p('M9 16l22 21 7-30m-7 30v20','none','#e4ead5',1.8),
 ()=>e(32,32,25,20,'#9ec9d190')+e(32,32,21,16,'none')+p('M16 24q8-8 20-7','none','#e7ebd6',2.5),
 ()=>lensDisk(32,32,1.12)
][n]();
case 'star':return [
 ()=>sheet(32,32,1,'#e1d1b2')+repeat(4,j=>starLight(21+j%2*19,19+Math.floor(j/2)*19,.4)),
 ()=>p('M10 7h43v51H10z','#b5bdd0')+p('M17 41l9-23 12 17 8-14','none','#e0dcca',1.6)+repeat(4,j=>c([17,26,38,46][j],[41,18,35,21][j],2.2,'#f0deb8')),
 ()=>skyDisc(32,32,25)
][n]();
case 'battery':return [
 ()=>p('M20 9h25v44H20z','#bdcec0')+r(27,3,11,6,'#d6c5a3',1)+p('M24 19h16m-16 10h16m-16 10h16','none','#e3ddbe',1.5)+c(33,48,2.5,'#819c9c'),
 ()=>batteryCell(32,33,1.05),
 ()=>r(8,19,48,38,'#adc5b1')+r(12,10,12,9,'#dcc39f',1)+r(42,10,10,9,'#d9c6ab',1)+p('M15 32h12m-6-6v12M38 32h12M13 51h38','none','#e6d6b4',2)
][n]();
case 'beacon':return [
 ()=>p('M12 9l37 6 7 31-34 10L7 31z','#bad7d3a0')+p('M16 18l22 4m-21 3l29 5m-23 9l22 5','none','#e9ead6',2),
 ()=>beaconLens(32,32,1.02),
 ()=>r(17,18,30,29,'#b6c8b6',3)+c(32,31,11,'#e1d5a8')+p('M22 18v-8h20v8m-14 31v9m8-9v9m-18 3h28','none','#d4bea0',2.5)
][n]();
default:return null;
}}
function body(chain,level){if(level<=3)return lowBody(chain,level);const n=level-4;if(n<0||n>8)return null;switch(chain){
case 'tool':return [
 ()=>p('M16 8l15 21m14-21L30 29l-18 25m18-25l18 25','none','#b7cfd0',5)+p('M13 5l10 3-6 13M47 5l-10 3 6 13','none','#d7ae8e',5),
 ()=>p('M6 24h52v31H6z','#ad987f')+p('M6 25q26 14 52 0','none','#e0c4a2',3)+r(11,30,12,22,'#bdac91')+r(28,32,13,20,'#bdac91')+p('M17 11v22m17-15v19m16-22v30','none','#d3dbd0',3)+c(47,43,4,'#dac4a0'),
 ()=>p('M7 27h50v30H7z','#99beb9')+r(12,15,40,12,'#d6d3b6')+tools(4)+c(47,44,5,'#d1ddd0')+p('M15 19h24','none','#81969a',2),
 ()=>box('#9cbcb8')+r(12,25,40,21,'#4c6575')+repeat(5,j=>c(17+j*7,35,3.2,'#d1d7c8'))+p('M15 51h35','none','#e3cba8',3),
 ()=>p('M5 13h54v43H5z','#8faab0')+r(10,19,44,32,'#4c6374')+p('M14 28h20l6 6-8 8h-6v-9H14z','#d2dacf')+c(38,33,5,'#dbc8a8')+repeat(3,j=>c(16+j*9,46,3.3,'#c0d2cb'))+p('M49 25v19','none','#d6b899',3),
 ()=>p('M9 19h36l8 7-13 15-14-4-2 20H12l4-25H9z','#96b9b7')+r(18,22,20,9,'#d7c3a0')+p('M42 25h18','none','#cbd8d2',4)+p('M12 55h14','none','#d9ae90',5)+r(45,44,14,11,'#cfbda2'),
 ()=>box('#c6b59d')+p('M12 28h38M14 32v18m6-18v5m6-5v8m6-8v5m6-5v8m6-8v5','none','#ecddbd',1.8)+p('M15 44l9-8h12l6 13H15z','none','#819d9c',2)+c(47,43,6,'#b1d0c2'),
 ()=>p('M3 25h58v32H3z','#8dafaa')+r(7,7,50,18,'#4c6674')+tools(5)+p('M11 17h12m7 0h20','none','#d9c6a2',3)+repeat(3,j=>c(18+j*14,49,4,'#c8d7bd')),
 ()=>p('M6 22l8-11h36l8 11v33H6z','#b69578')+p('M7 27h49m-38-15v43m29-43v43','none','#e0c5a0',3)+r(26,26,12,17,'#d0cc9f')+p('M29 30h6m-6 5h6','none','#8a8f76',2)+p('M14 45h8m20 0h8','none','#ead7b9',2)
][n]();
case 'wood':return [
 ()=>p('M8 16l44-7 5 40-44 8z','#c7a584')+p('M19 15l5 39m10-41l4 39m11-41l5 37','none','#e7c9a4',2)+woodgrain,
 ()=>p('M8 17h48v28H8M8 29h48M11 45v15m42-15v15','none','#c4a181',5)+p('M12 20v10m20-10v10m20-10v10','none','#e7c6a4',2),
 ()=>r(9,18,46,36,'#ba987e')+p('M9 22l7-10h34l5 10M13 28h38','none','#e4c7a1',2)+repeat(3,j=>p(`M${17+j*14} 34q7-10 7 1t-7 10`,'none','#dcc19c',1.7))+c(32,29,3,'#dace9f'),
 ()=>r(16,3,33,57,'#b7967d')+r(21,9,23,19,'#7f7276')+r(21,36,23,19,'#9e817a')+c(41,32,2,'#e6d5a1')+p('M19 5h27','none','#dac09d',2),
 ()=>r(7,16,50,40,'#b6957b')+p('M8 24h48m-44-4v31m40-31v31m-37-1h36','none','#d6bd98',3)+c(32,35,5,'#9ebba9')+p('M25 9h14v7','none','#d8c4a3',2),
 ()=>p('M11 25q21-29 42 0v29H11z','#876c60')+p('M12 25h40m-35-4q15-16 30 0m-23 7v23m16-23v23','none','#d3b384',2.5)+r(28,27,8,15,'#dbc99e')+woodgrain,
 ()=>repeat(3,j=>p(`M${3+j*20} 13l9-5 9 5v43H${3+j*20}z`,j%2?'#a08470':'#b69b7d')+p(`M${7+j*20} 23q5-7 10 0t-10 12q5-5 10 0`,'none','#e0c4a2',1.7)),
 ()=>p('M5 25l39-10 15 12-40 11z','#ba9678')+p('M7 27v9l13 8 39-12v-5M14 35v25m36-29v22','none','#d4b492',4)+p('M14 24l32-7m-25 8l27-6','none','#907767',1.5),
 ()=>repeat(4,j=>r(2+j*15,6+(j%2)*4,14,50,'#ac9075',2)+at(bloom(j%3+1,['#d1a78e','#bdcc9d','#d7b4bd','#a8c3cb'][j]),3+j*15,16,.28))+p('M3 59h58','none','#dec49e',2.5)
][n]();
case 'cloth':return [
 ()=>p('M9 21l37-12 10 8-37 13zM9 27l10 9 37-12v23l-37 13L9 48z','#d5bfcc')+p('M19 31v24m-7-16l7 5 31-10','none','#ecd9c4',2),
 ()=>p('M12 10l41 7-7 42-41-8z','#e0ced2')+p('M13 16l31 5-4 29-27-4z','none','#b293bd',1.8)+flower(32,31,.9,'#d5a7bd'),
 ()=>p('M8 10h47v42H8z','#d4b69c')+p('M8 23h47m-47 15h47m-33-28v42m17-42v42','none','#98b9b2',5)+p('M8 53v7m12-7v7m12-7v7m12-7v7m11-7v7','none','#ead4b2',1.5),
 ()=>p('M6 14l41-8 10 12-9 38-41-7z','#9eb9bd')+p('M14 18l28-5 6 9-6 25-29-5z','none','#d4e0ce',2)+p('M16 37q5 6 11 0t17-2','none','#7b999d',2),
 ()=>r(10,18,40,38,'#ccadbc')+e(30,18,20,8,'#e5d4c2')+e(30,18,10,4,'#ad94a4')+p('M15 30l15 8 15-8M15 39l15 8 15-8','none','#e8cfb2',2)+p('M50 25l10 7-10 8z','#a4c3b5'),
 ()=>p('M9 6h46v45H9z','#bda7bf')+p('M7 6h50','none','#d9c2a0',4)+repeat(4,j=>at(bloom(1,['#e3b4a5','#b1caa1','#d5b0c9','#c3d9d7'][j]),8+j%2*23,15+Math.floor(j/2)*21,.43))+p('M12 51v9m10-9v9m10-9v9m10-9v9m10-9v9','none','#e3d4b8',1.8),
 ()=>p('M8 8h48M13 8v48M51 8v48','none','#dec3a4',3)+p('M9 11h18l-5 28-10 17H8zM55 11H37l5 28 10 17h4z','#c6b0c7')+p('M13 14l7 29m31-29l-7 29','none','#e8d5bf',2)+p('M21 39h7m9 0h7','none','#a4c4b8',3),
 ()=>p('M7 10h26v46H7z','#c5afc3')+p('M33 10h24v46H33z','#9bbebb')+p('M5 7h54','none','#d8c2a2',4)+flower(20,29,.7,'#e0c2b2')+flower(45,36,.7,'#ead5a7')+p('M9 56v6m9-6v6m9-6v6m10-6v6m9-6v6m9-6v6','none','#e5d1b2',1.5),
 ()=>p('M5 7l51 2 3 43-50 7z','#9e9cb6')+p('M12 15l36 1 2 29-35 4z','none','#e4c8ab',2)+p('M16 38l9-15 10 10 11-13','none','#c6d8c0',2.5)+flower(32,37,.53,'#e1b1c0')+p('M14 57v6m8-7v7m8-8v8m8-8v8m8-9v9','none','#e6d0a8',1.5)
][n]();
case 'flower':return [
 ()=>p('M17 34l28-3-8 28-9 1z','#e3ccae')+bloom(3,'#eddfc5')+p('M20 42l23-5','none','#c3a0b4',4),
 ()=>p('M15 34h35l-5 23H20z','#cdb099')+e(32,34,18,4,'#a79382')+bloom(4,'#e6b2bd'),
 ()=>p('M14 6q18-10 36 0M14 6l5 30m31-30l-6 30','none','#b1c1a2',2)+at(basket(4,'#d2b1da'),4,10,.88),
 ()=>p('M14 35l32-6-8 31-12-2z','#d4b1b7')+bloom(5,'#d89cad')+p('M18 43l26-5','none','#c5d4b2',4),
 ()=>basket(3,'#eee3c8')+p('M19 15l-4-9m33 10l5-8','none','#b4c29b',2),
 ()=>p('M12 31l42-5-12 34-18-4z','#dccfc1')+leaves+repeat(16,j=>c(13+j%5*9,14+Math.floor(j/5)*7,2.2,'#eee8d1'))+p('M22 41l23-3','none','#b2c9c0',4),
 ()=>p('M5 34h54l-7 25H12z','#bda58d')+repeat(4,j=>at(bloom(2,['#e8cfa8','#bdb4d6','#deb0ba','#d5dfba'][j]),3+j*13,12,.42))+p('M11 47h42','none','#e5c8a4',2),
 ()=>p('M13 42h38l-7 16H20z','#a3bfc2')+p('M31 44V10M31 28l-17-15m17 21l19-15','none','#9abc95',2.5)+flower(31,9,.75,'#d9c4e5')+flower(14,14,.68,'#e4baa9')+flower(49,18,.82,'#d0dfc4')+flower(32,31,.65,'#f0dfb8'),
 ()=>p('M16 38h32l-5 22H21z','#d7b69c')+at(bloom(6,'#d8c4e0'),0,-4,1)+p('M5 29q3-6 6 0m42-2q3-6 6 0M6 46q3-6 6 0m39-1q3-6 6 0','none','#c2d5c1',1.7)+p('M23 48l9 5 9-5','none','#ead6b2',2)
][n]();
case 'tea':return [
 ()=>teaBag(),
 ()=>r(15,16,34,40,'#aac59f')+e(32,16,17,6,'#dbcfac')+p('M19 39h26','none','#e6ddbd',2)+flower(32,32,.7,'#f1e8d2'),
 ()=>p('M8 21h48l-5 32H14z','#cbb393')+e(32,21,24,9,'#b2c39a')+repeat(6,j=>p(`M${15+j*6} 17q-6 15 8 14`,'none','#7c9f7c',2)),
 ()=>r(7,18,50,37,'#b6c6a4')+p('M8 27h48m-25-9v37','none','#e9d5ad',3)+at(teaBag(),5,22,.4)+r(38,32,11,17,'#e4dbc1')+flower(45,38,.3,'#ead5a7'),
 ()=>r(5,12,54,44,'#b59d82')+r(10,18,44,31,'#7b8d73')+repeat(4,j=>at(teaBag(),7+j*13,24,.22))+p('M12 53h40','none','#e6cfac',3),
 ()=>c(32,31,24,'#9ba981')+c(32,31,19,'#6c8870')+repeat(5,j=>p(`M${18+j*6} 16q-8 15 6 28`,'none','#bacb9e',1.5))+r(22,27,21,9,'#d6cba3'),
 ()=>r(5,20,54,37,'#aabd9e')+r(10,5,44,19,'#d3c1a0')+p('M6 35h52m-25-30v52','none','#e8ddbe',2.5)+repeat(3,j=>c(18+j*14,44,5,'#8fa57e')),
 ()=>p('M12 12h40l-4 17 8 28H8l8-28z','#c4cbb0')+p('M17 18h30','none','#e9dbb9',3)+e(31,42,18,10,'#e0d7bb')+p('M21 44q13-17 21-7m-13 8l-1-15','none','#8da27a',2),
 ()=>p('M8 22q24-25 48 0v34H8z','#a3ac8f')+p('M9 24h46m-17-15v45','none','#d4bd97',3)+at(teaBag(),8,22,.48)+r(39,30,10,21,'#cfc39e')+p('M42 35h4m-4 5h4m-4 5h4','none','#8d9d7c',1.5)
][n]();
case 'fruit':return [
 ()=>p('M8 28q24 9 48 0l-6 22q-18 15-36 0z','#d8c0af')+repeat(4,j=>strawberry(17+j*10,25+(j%2)*4,.58)),
 ()=>p('M9 31h46l-8 25H17z','#c8ad8f')+p('M14 28q18-27 36 0','none','#dbc7a4',3)+fruitPile(5),
 ()=>plate()+fruitPile(7,.9)+p('M6 48h52','none','#c5bea7',2),
 ()=>r(5,21,54,36,'#b9c4a5')+repeat(3,j=>r(10+j*16,25,12,27,['#d99fa1','#cebd8f','#ada0c1'][j])+r(9+j*16,23,14,5,'#e6cfaa',1)+r(12+j*16,35,8,8,'#efdfc2',1)),
 ()=>p('M7 31h50l-7 26H15z','#c8af95')+p('M11 31q21-30 42 0','none','#e3c8aa',3)+repeat(5,j=>fruit(15+j%3*16,27+Math.floor(j/3)*13,'#e8b3a1',1.06)),
 ()=>p('M31 18v38m-20 2h42','none','#c6bca6',3)+e(32,22,21,5,'#e2d4b9')+e(32,43,28,7,'#e8d8be')+repeat(7,j=>fruit(15+j%4*11,j<3?17:38,['#cfb695','#e4b2a1','#b9ca93'][j%3],.7)),
 ()=>p('M5 33h54l-7 25H12z','#b9a589')+p('M11 29q21-33 42 0','none','#e4cda7',4)+fruitPile(9,.95)+p('M9 43h46','none','#d7bb98',2),
 ()=>r(5,17,54,41,'#a8bca6')+p('M6 28h52m-24-10v39','none','#e4cda5',3)+repeat(3,j=>at(fruitPile(2),j*17+1,16,.42))+p('M15 21q17-15 33 0','none','#dac29c',2),
 ()=>p('M3 32h58l-8 28H11z','#cfb79b')+p('M8 30q10-25 24-15 14-10 24 15','none','#e7cfaa',3)+fruitPile(10,1)+p('M10 49h44','none','#a5ba98',3)+flower(31,45,.6,'#ebc8b5')
][n]();
case 'coffee':return [
 ()=>cup('#dfc5b1'),
 ()=>cup('#b5d0be',true)+p('M16 55h27','none','#e8d7b5',2),
 ()=>p('M18 26h26l7 25q-19 13-37 0z','#a6cbc7')+e(31,26,13,4,'#eadbc2')+p('M21 26l4-17h14l4 17z','#dfc9a8')+p('M42 34q17-4 11 15l-4 3','none','#cddcc4',3)+e(31,47,16,4,'#745952'),
 ()=>c(32,17,13,'#c6d9d14d')+p('M25 30h14v4q17 13 8 24H17q-9-11 8-24z','#b7d5d04d')+e(32,51,14,6,'#796056')+p('M32 28v12M13 13v45h38','none','#d1bc99',3)+p('M9 13h5m32 18h8v11h-7','none','#b0c9bc',2)+c(32,59,3,'#e6cba0'),
 ()=>p('M22 7h20l6 21-7 27H22l-9-27z','#b7c6c1')+p('M14 28h33m-24-20l-2 20 5 25m10-44l4 18-3 26','none','#e0d8be',2)+p('M45 17q19-2 13 18l-12 7','none','#bcac96',3)+r(23,4,19,5,'#dac6a3',1),
 ()=>r(6,10,52,44,'#acc4b6')+r(12,16,34,12,'#405e71')+c(51,22,4,'#d8b99b')+p('M16 33v10m20-10v10M7 54h50','none','#dfcfac',3)+at(cup(),3,33,.34)+at(cup(),24,33,.34),
 ()=>p('M13 9h26v18H13z','#c9a581')+p('M14 27h24l4 18q-11 13-27 0z','#b4ccbd')+p('M26 26v12m17-24h10v28H43','none','#e3c79b',3)+c(49,25,5,'#b9997c')+p('M8 54h49','none','#d6b98d',4)+at(cup(),13,31,.48),
 ()=>e(32,52,29,7,'#c9bba2')+repeat(6,j=>at(cup(['#abc8bc','#ddc4b2','#c4b5d1'][j%3]),5+j%3*18,3+Math.floor(j/3)*27,.35)),
 ()=>p('M15 19h35l-4 31q-14 13-27 0z','#cadac5')+p('M49 23q16-3 10 14l-10 3','none','#d8c3a1',3)+e(32,19,17,5,'#816056')+p('M24 17q8-9 16 0q-8 5-16 0','none','#f0e4c8',1.7)+p('M24 9q-4-5 0-9m10 9q-4-5 0-9','none','#b8d6c3',1.7)+e(32,56,28,4,'#e3d7bb')+flower(8,45,.45,'#dfbdcb')
][n]();
case 'pastry':return [
 ()=>plate()+p('M11 28h42l-5 21H16z','#d8b18c')+e(32,28,21,6,'#efdbc0')+repeat(4,j=>fruit(17+j*10,26,'#e0a0a7',.55)),
 ()=>plate()+cake(17,26,30,24)+repeat(3,j=>fruit(23+j*9,23,'#e1a0a8',.55))+flower(32,20,.43,'#edcfb3'),
 ()=>plate()+repeat(3,j=>at(cake(8,25,17,20,['#c5cbab','#e4b9c4','#d6bd97'][j])+flower(17,23,.48,['#e5c7af','#efd4b6','#e6b7ca'][j]),j*19-5,j%2?7:0,.85)),
 ()=>e(32,53,29,7,'#b6c9bb')+at(cup(),-4,-2,.55)+at(cake(8,25,26,20),26,2,.78)+r(6,38,20,11,'#e1c59f',4)+repeat(3,j=>c(10+j*7,41,2,'#936c60')),
 ()=>p('M32 9v47m-20 3h41','none','#c6b296',2.8)+e(32,17,17,4,'#e5d2b5')+e(32,34,23,5,'#dbc7ac')+e(32,51,29,6,'#ecddc1')+repeat(6,j=>at(cake(0,0,14,10,['#e4b4bb','#c6cdb0'][j%2]),12+j%3*15,9+Math.floor(j/3)*27,.7)),
 ()=>plate()+cake(8,28,48,24,'#dfc3ad')+repeat(6,j=>fruit(13+j*8,25,['#e4a2ac','#c0cc93','#d9b895'][j%3],.48))+candle(32,20),
 ()=>plate()+cake(8,39,48,15,'#e7c2bf')+cake(16,23,32,16,'#f0d3bc')+repeat(3,j=>flower(23+j*9,20,.35,'#dcb3c2'))+candle(32,13),
 ()=>plate()+cake(6,31,52,23,'#d8b5c2')+repeat(6,j=>candle(12+j*8,25))+p('M13 44h38','none','#efe0c7',2),
 ()=>e(32,55,29,5,'#c8d0b9')+cake(5,35,54,19,'#e1b4bb')+cake(14,18,36,17,'#d8c8aa')+repeat(4,j=>flower(14+j*12,33,.35,['#e8cba4','#b8cfb0','#d0b6d5','#abc9c5'][j]))+p('M25 6v9m14-9v9','none','#d7b982',2)+repeat(2,j=>c(25+j*14,4,2.3,'#ebd19b'))
][n]();
case 'circuit':return [
 ()=>r(14,17,36,33,'#adcbb8')+r(20,25,18,15,'#526c79',1)+c(43,31,3,'#ecd59e')+p('M21 13v4m8-4v4m8-4v4m-16 33v5m8-5v5m8-5v5','none','#e2c9a8',2.5),
 ()=>r(7,21,50,30,'#b3c4b4')+r(12,27,40,11,'#556e7b',1)+repeat(6,j=>c(16+j*6,32,2,'#dcc39f'))+p('M16 21v-9m11 9V7m11 14V11m11 10V6M17 51v8m16-8v8m15-8v8','none','#d0b18e',2.3),
 ()=>r(5,10,54,45,'#8fbbae')+r(24,24,20,17,'#476878',1)+repeat(4,j=>r(10+j*12,15,7,4,'#e0c59c',1))+repeat(3,j=>r(11,27+j*8,7,4,'#abcac4',1))+p('M46 18h8v24h-8m-3 5h11M24 45v8m6-8v8m6-8v8','none','#e5d4aa',1.8),
 ()=>p('M13 5h38v51H13z','#91b9aa')+r(19,12,26,12,'#63788a',1)+r(22,32,20,16,'#a5d0c3',1)+c(20,28,3,'#d4b894')+p('M42 10V2m4 12L56 5M14 57h41','none','#e5cba4',2.6)+repeat(4,j=>p(`M${23+j*6} 35v9`,'none','#4c6b7c',1.4)),
 ()=>r(5,22,54,33,'#acbbb4')+p('M12 27h31m-31 6h31m-31 6h31m-31 6h31','none','#e0d1b0',2)+c(50,32,4,'#6d9191')+c(50,45,3,'#dabc91')+p('M12 21V10m41 11V5M9 58h7m34 0h7','none','#bccbbd',2.6),
 ()=>r(3,13,26,40,'#9abda6')+r(35,13,26,40,'#a8c7bd')+r(9,23,14,17,'#526f7b',1)+r(41,23,14,17,'#5c6d85',1)+p('M29 23h6m-6 8h6m-6 8h6M10 18h12m20 0h12M10 46h12m20 0h12','none','#e0cda6',2.2),
 ()=>r(6,10,52,47,'#9bb2af',7)+r(12,17,40,32,'#506f7c',5)+r(20,24,24,14,'#b2d2c1',2)+p('M20 43h24','none','#e4d5ae',2.5)+repeat(4,j=>c(10+j%2*44,15+Math.floor(j/2)*37,2,'#d6bc95'))+p('M27 8h10m-10 51h10','none','#c9d4c4',3),
 ()=>r(6,7,52,51,'#88b1a8')+repeat(4,j=>r(12+j%2*23,14+Math.floor(j/2)*21,17,15,['#a8c9ae','#d7bd96','#c0b1cf','#a8cad2'][j],2)+r(17+j%2*23,18+Math.floor(j/2)*21,7,7,'#546d7d',1))+p('M29 21h6m-6 20h6M21 29v6m22-6v6','none','#e9d7af',2),
 ()=>p('M17 9h30l13 22-13 23H17L4 31z','#9dc4bca0')+c(32,31,19,'#507480')+c(32,31,12,'#b1d9ca')+p('M27 23h10v16H27z','#d6d8b2')+p('M32 3v6m0 45v7M1 31h7m48 0h7M10 13l7 7m30 22l7 7M10 49l7-7m30-22l7-7','none','#e3cd9d',2)
][n]();
case 'vinyl':return [
 ()=>disc(32,32,25,'#465264')+p('M16 20q3-5 7-6','none','#abb8b9',2),
 ()=>p('M10 9l39-4 6 50-41 4z','#e8d6b7')+p('M18 17q7-5 10 1t17-2M18 28q11-7 10 1t16-2M19 39q10-6 17 1m-16 9h20','none','#8d939c',1.6)+note(43,45,.5),
 ()=>r(5,30,54,26,'#baa48b')+e(27,34,19,7,'#465769')+e(27,34,5,2,'#e4c299')+p('M49 20v18l-12 8','none','#c5d8cc',3)+c(51,49,3,'#ead0a6')+p('M12 51h25','none','#796f70',1.6),
 ()=>p('M8 29V8h48v21z','#8eaeb0')+r(12,12,40,12,'#d2c8b0')+p('M5 31h54v25H5z','#9ebdb3')+e(26,36,16,5,'#546576')+c(26,36,3,'#dfc29b')+p('M47 27v14l-11 5M24 58h16','none','#e8cfaa',2.8)+r(48,47,6,4,'#607f88',1),
 ()=>at(disc(24,32,21),-2,0)+disc(42,33,20,'#62707f')+p('M5 57h54','none','#dec3a4',3),
 ()=>r(5,18,54,39,'#b8a086')+p('M5 22l8-11h38l8 11','none','#e4cba6',2.5)+repeat(4,j=>p(`M${13+j*10} 26l6-5v29h-6z`,['#a7c5ba','#d2b2c5','#d0c39d','#aebed1'][j]))+p('M9 53h46','none','#ebd5b3',2),
 ()=>r(6,40,47,17,'#b79878')+e(26,43,16,5,'#526478')+p('M46 41l3-12','none','#dcb487',3)+p('M49 30q-29-6-35-26 19 7 45 9z','#cda885')+e(36,9,22,7,'#e3c39d')+p('M25 55h10','none','#ebd5b0',2),
 ()=>repeat(4,j=>r(3+j*13,13+(j%2)*5,18,40,['#adc8bd','#ddbdc7','#c5c0dc','#d6c6a1'][j],2)+at(disc(0,0,9),12+j*13,34+(j%2)*5))+p('M6 58h52','none','#dbc8a6',3),
 ()=>p('M5 26l9-17h42v17z','#b1d3c080')+r(6,29,52,28,'#af947d')+e(27,34,19,6,'#455f6c')+c(27,34,4,'#d3bc94')+p('M48 18v19l-12 8','none','#e5d4b0',2.8)+r(12,48,22,5,'#7e9c9d',1)+c(49,49,4,'#dcc6a2')+p('M17 13h30','none','#d4e6c9',1.5)
][n]();
case 'rope':return [
 ()=>`<g transform="rotate(-34 32 32)">${oar(32,31,.9)}</g>`,
 ()=>c(32,32,24,'#eacdb5')+c(32,32,12,'#30485c')+p('M12 16l9 7m22-7l-9 7M13 49l8-8m22 8l-8-8','none','#cf9ea1',8)+c(32,32,12,'#30485c'),
 ()=>p('M8 14l49 5-33 35z','#dcd0b3')+p('M8 14L3 7m54 12l5-7M24 54l-2 8M18 19l28 4','none','#a6bcb1',2),
 ()=>`<g transform="rotate(-37 32 32)">${oar(27,32,.91)}</g><g transform="rotate(37 32 32)">${oar(37,32,.91)}</g>`,
 ()=>p('M7 33q24-31 50 0l-10 24H17z','#b99779')+e(32,29,24,9,'#e2c59c')+p('M16 31h31m-29 8h24','none','#8f7f6e',4)+p('M12 21l41 26','none','#dec8a4',2.4)+p('M8 60q6-5 12 0t12 0t12 0','none','#a6ccca',2),
 ()=>hull()+sail(33,41,1.1)+p('M17 40h9m13 0h9','none','#ad8d75',4)+p('M35 8l11 5-11 5z','#d6b5c6'),
 ()=>hull('#a7b6a3')+sail(32,42,.86,'#d9c8b0')+p('M13 44V21m39 23V21M12 20q20-12 41 0','none','#d4b994',2)+lantern(14,29,.25,'#e4c398')+lantern(51,29,.25,'#d2bcda'),
 ()=>hull('#bfab8a')+p('M17 44V6m30 38V7','none','#decba7',2)+p('M20 9h13l-4 14H20z','#bcd3ac')+p('M20 25h15l-6 15H20z','#d9b4c5')+p('M43 10H32l5 13h6z','#dacc9d')+p('M43 26H32l5 14h6z','#adcad0'),
 ()=>p('M3 43h57L47 59H18z','#9faeaa')+r(11,31,20,12,'#cbb798',2)+p('M22 31V5m22 38V12','none','#e0c7a2',2.6)+p('M25 7l14 20H25z','#c1d6c2')+p('M47 14l14 24H47z','#d2c2db')+p('M19 7L7 28h12z','#e5cfaf')+p('M8 48h43m-31-2v5m11-5v5m11-5v5','none','#dac6a1',1.8)+p('M7 62q6-5 12 0t12 0t12 0t12 0','none','#a6d0ca',1.8)
][n]();
case 'shell':return [
 ()=>conch(34,33,1.08)+p('M12 45l-7 10 13-2','none','#e9d3b7',3),
 ()=>at(fanShell(32,26,.95,'#e2c8bb'),0,-4)+p('M9 37q23-11 46 0-5 21-23 22Q15 56 9 37z','#edd6bf')+c(32,39,10,'#f4e8d3')+p('M26 33q6-5 11 0','none','#fff2db',2),
 ()=>fanShell(32,25,.9)+p('M32 43v12m-15 3h30','none','#cbb59a',4)+e(32,57,20,4,'#bdc8b9'),
 ()=>r(6,25,52,32,'#b9c5b0')+at(fanShell(32,25,.8,'#e3c8b6'),0,-6)+p('M7 36h50','none','#e6d0ae',2)+repeat(6,j=>c(12+j*8,48,2.4,'#f1e0c9')),
 ()=>p('M8 57h49M31 53V20m0 21L13 25m18 8l19-14','none','#ccab91',3)+fanShell(15,25,.5,'#d5b9c4')+conch(45,20,.5)+repeat(4,j=>c(22+j*6,47,2.6,'#efe2c9')),
 ()=>p('M10 12q-11 38 22 46 31-8 23-46','none','#cbb7a0',2)+repeat(11,j=>c(11+42*j/10,20+26*Math.sin(Math.PI*j/10),3.7,'#f0e2cf'))+fanShell(32,47,.45,'#d7b6c4'),
 ()=>e(32,57,28,5,'#afc4b9')+fanShell(32,43,.9,'#d6b8c4')+fanShell(32,20,.7,'#ead3b9')+p('M32 37v9','none','#dec7a4',3),
 ()=>p('M6 39q26 12 52 0v14q-26 12-52 0z','#d3ba9c')+repeat(5,j=>fanShell(10+j*11,29-(j%2)*5,.36,['#d2b6c6','#e8d5b6'][j%2]))+repeat(6,j=>c(9+j*9,47,2.2,'#f0e4ce')),
 ()=>e(32,58,23,4,'#b4cbb9')+p('M25 55q-22-14-8-33 12-15 31-7 14 9 3 19-9 5-14-3','none','#dfc3ac',5)+fanShell(32,35,.48,'#d2bdd4')+p('M9 16q13-9 26-2M8 43q12 8 23 4','none','#9dbeba',2)
][n]();
case 'glass':return [
 ()=>repeat(4,j=>at(p('M-9-7l10-5 10 7-4 12-15 4z',['#b4d6c2','#d6b3c9','#b9c4da','#e1cfad'][j]+'bb'),20+j%2*24,19+Math.floor(j/2)*25)),
 ()=>glassBottle(32,33,1,'#a5d7c8'),
 ()=>e(32,55,27,5,'#d9d6b9')+p('M8 46q7-35 20-26 8 8 18-11 17 33 10 37z','#9ed6cd90')+p('M10 44q17-24 43-11','none','#e1ead4',2.8)+p('M19 46q10-15 29-21','none','#b6b8d8',2.4),
 ()=>p('M32 4v11m-21 8q21-16 42 0M11 23v11m21-19v17m21-9v11','none','#c5bd9e',2)+repeat(3,j=>at(p('M-7 0h14l5 20q-12 10-24 0z',['#a2d4cc','#ceb9d5','#b9ccac'][j]+'b0'),11+j*21,32)),
 ()=>glassBottle(32,32,1.05,'#b6c2db',true)+p('M19 29q14-9 27 4m-29 8q13-8 29 4','none','#abdacb',2)+e(32,7,6,2,'#e4e4cf'),
 ()=>p('M18 20h28l10 32H8z','#b7d4d3a0')+p('M18 20l14 19 14-19M8 52l24-13 24 13m-24-13v13','none','#d6bc95',2)+p('M32 20V10m-7 46h14','none','#dccaa0',3)+c(32,39,6,'#efd8a6'),
 ()=>p('M5 48h54v11H5z','#b5bca8')+repeat(6,j=>glassBottle(13+j%3*19,20+Math.floor(j/3)*24,.4,['#a9d4c3','#d3b1c6','#bbc2db','#dfcc9f','#a3c9d5','#bacd9c'][j]))+p('M5 28h54','none','#dcccae',2),
 ()=>e(32,56,28,5,'#bdc7b6')+repeat(4,j=>p(`M${6+j*13} ${17+(j%2)*7}l11-8v39H${6+j*13}z`,['#aed2ba','#dfbea7','#bfbbda','#a8d0d2'][j]+'b0')+p(`M${9+j*13} ${22+(j%2)*5}v19`,'none','#e7ecd3',1.5)),
 ()=>p('M9 54V27q23-39 46 0v27z','#a9d5d0a0')+p('M14 51V29q18-29 36 0v22z','none','#dedfc3',2.2)+c(32,30,12,'#e7d6aab0')+p('M23 34l8-13 10 13m-29 12q17-8 40 0','none','#b3c9ac',1.7)+e(32,57,28,4,'#c6baa0')
][n]();
case 'music':return [
 ()=>p('M21 29q-8 0-11 9-5 20 18 20 21-4 16-23-3-8-11-7z','#d2b392')+r(24,9,7,27,'#ddc5a3',1)+r(22,4,11,9,'#b3a188',1)+c(27,39,5,'#677c82')+p('M27 10v39m-7 0h15','none','#f2dec0',1.6),
 ()=>guitar(32,34,.73,'#c6a183')+p('M13 51l10-5','none','#e8c9a4',2),
 ()=>r(4,20,56,27,'#acc5bd')+r(8,25,48,17,'#ede0c4',1)+repeat(9,j=>p(`M${13+j*5} 26v16`,'none','#9ba9a6',1))+repeat(5,j=>r(15+j*8,25,3,10,'#4d6878',.5))+p('M12 47l-6 12m46-12l6 12','none','#d9c19e',3)+c(52,17,3,'#e3c899'),
 ()=>c(31,43,15,'#c5a58f')+c(31,43,11,'#e2d3b9')+r(8,30,13,14,'#b7cad0',2)+r(42,30,14,15,'#c9b2cb',2)+r(19,14,12,15,'#c6d0b1',2)+r(35,14,12,15,'#d7bd9e',2)+p('M7 14v43m51-39v40M27 56l-6 5m16-5l6 5','none','#bccac2',2)+e(9,14,8,3,'#e5c99f')+e(56,18,7,3,'#e5c99f'),
 ()=>guitar(19,33,.63,'#d0b391')+at(p('M-4-12q-10-3-9 6l5 6q-11 17 5 20 18-2 9-18l4-8q-2-9-10-6z','#b8a4c5')+r(-2,-28,4,20,'#ddc5a2',1)+p('M-1-21v29M-17-23l27 39','none','#ead5b8',1.8),45,32,.85),
 ()=>p('M9 29h32l14-10v24L41 32H9z','#d7ba91')+p('M21 28v-9h8v11m5 0v-11h8v14','none','#ead8b2',2.2)+p('M16 34v8h19v-7','none','#b3bfad',2.5)+p('M44 8q-15 7-10 19l14 22q14 9 14-8-1-10-12-11','none','#c9aa89',4)+p('M42 14l8-4','none','#e8d1a8',2),
 ()=>r(4,20,56,37,'#aaad99')+p('M5 26h54m-36-7V9h18v10','none','#e6cba5',3)+at(guitar(0,0,.4),17,37)+at(note(0,0,.8),37,43)+r(43,29,11,20,'#d8c8a7',1)+p('M46 32v14m4-14v14','none','#677f86',1.3),
 ()=>guitar(11,28,.39)+at(p('M-3-12q-10 0-7 8l3 5q-11 13 3 18 16-1 7-15l4-8q-4-10-10-8z','#c7acc1')+p('M0-25v31','none','#ebd7b6',2),27,25,.67)+r(35,8,25,15,'#a8c8bf',2)+repeat(6,j=>p(`M${38+j*3} 12v8`,'none','#e8d7b9',1.2))+c(35,45,10,'#d5bb98')+e(53,34,9,3,'#dec292')+p('M53 34v23M44 55h15','none','#bbcabd',2)+r(4,45,17,8,'#bbc9d1',1)+repeat(4,j=>p(`M${7+j*4} 47v4`,'none','#536f7f',1)),
 ()=>r(4,26,56,32,'#b7bea5')+p('M5 30l8-14h40l7 14m-33-14V7h11v9','none','#e2c7a1',2.8)+at(guitar(0,0,.4),17,35)+r(34,20,20,30,'#e8d6b4',1)+note(45,36,.55)+p('M39 43h9M12 54h39','none','#879c94',1.5)+p('M8 14l6-8m42 9l-6-9','none','#c5d4bb',2)
][n]();
case 'banner':return [
 ()=>flag(32,31,1,'#c4afce')+note(33,23,.58),
 ()=>p('M3 13q28 21 58 0','none','#d8c39d',2.1)+repeat(5,j=>at(p('M-5 0h10L0 16z',['#cfaec5','#accab5','#e0caa3'][j%3]),10+j*11,16+7*Math.sin(j*Math.PI/4)))+p('M3 13v31m58-31v31','none','#b4c3b4',2),
 ()=>p('M6 8h52M10 8v51m44-51v51','none','#dcc49f',3)+p('M12 11h17v39l-9 8-8-8z','#b7a6c5')+p('M35 11h17v39l-9 8-8-8z','#a8c9bd')+p('M18 19l5 6m18-6l5 6','none','#e8d4af',2)+p('M29 12q3 8 6 0','none','#d5b2c3',3),
 ()=>p('M6 15h52m-52 0v41m52-41v41','none','#d8bf9a',2.8)+p('M9 18q23 7 46 0v22q-23 8-46 0z','#c9b5cc')+p('M9 40l-5 10 13-7m38-3l5 10-13-7','none','#b2c8be',2)+p('M18 28h27','none','#ead4b2',2.4),
 ()=>p('M5 24l27-15 27 15M10 24v31m44-31v31','none','#cdb897',2.8)+p('M13 25h39v26H13z','#a9c2ba')+p('M7 21q25 19 50 0','none','#e1c59d',1.6)+repeat(5,j=>c(12+j*10,26+4*Math.sin(j*Math.PI/4),2.5,['#e7d1a2','#d4b5cd'][j%2]))+p('M20 36l10 8 15-8','none','#eddbc4',2),
 ()=>p('M3 8q29 21 58 0M3 35q29 21 58 0','none','#d7c19c',2)+repeat(8,j=>at(p('M-5 0h10L0 14z',['#b5cca9','#ddbdc9','#c3bdd7','#e1cc9f'][j%4]),10+j%4*15,13+Math.floor(j/4)*27+5*Math.sin(j%4*Math.PI/3))),
 ()=>p('M8 7h48m-41 0v53m35-53v53','none','#d8c19f',2.8)+p('M17 11h30v20H17z','#cdb4c9')+p('M17 35h30v19l-15 6-15-6z','#abc8bc')+flower(32,21,.6,'#e5c7ae')+flower(32,45,.55,'#e8d1a3')+p('M17 31h30','none','#efddbe',1.8),
 ()=>repeat(4,j=>at(flag(0,0,.44,['#bbcea6','#dcb6c7','#cebd96','#abc6d1'][j]),12+j*12,26+(j%2)*10))+p('M7 55h50M5 7q26 17 54 0','none','#e4c99e',2.1)+repeat(5,j=>c(10+j*11,13,2,'#eddab6')),
 ()=>p('M6 58V19q26-23 52 0v39','none','#d1bb99',3.2)+p('M10 18q22-18 44 0v17q-22-9-44 0z','#c4d0bb')+p('M17 44l15-11 15 11v14H17z','#ccb3cc')+p('M28 58V46h8v12','none','#e6d3ad',2)+repeat(4,j=>at(p('M-4 0h8L0 10z',['#dfc89d','#d4adbe'][j%2]),13+j*13,34+2*(j%2)))
][n]();
case 'lamp':return [
 ()=>p('M27 39v18m-13 3h28','none','#c2d0bd',3)+p('M23 18l22-11 13 23-23 11z','#b9c6bf')+e(48,20,8,12,'#e9d7a7')+p('M18 25l-8-3m8 13l-9 3','none','#d0c2a1',2.2),
 ()=>p('M4 11q29 32 56 0','none','#c8b797',2)+repeat(5,j=>at(p('M-3 0h6v4q9 9 0 14-9 5-12-2-3-7 6-12z','#e8d8aaa0')+r(-3,0,6,4,'#aec5b5',1),10+j*11,16+9*Math.sin(j*Math.PI/4))),
 ()=>r(6,39,52,18,'#96b3b2')+repeat(4,j=>r(12+j*11,17-(j%2)*8,7,25+(j%2)*8,['#c3aed1','#e8d1a0','#a8d0c3','#d6b4c0'][j],2))+p('M12 48h39','none','#ded3b1',1.8)+note(29,31,.5),
 ()=>p('M32 31v26m-15 3h30','none','#c3c9b5',3.5)+p('M38 5q-25-6-27 13-1 18 25 17-16-9-12-19 4-10 14-11z','#e9d9ad')+p('M19 37h26','none','#a9c8bc',2.5)+c(47,18,3,'#decca2'),
 ()=>p('M32 3v17m-22 6q22-15 44 0M10 26v6m22-12v12m22-6v6','none','#c7ba9a',2.2)+repeat(3,j=>at(p('M-6 0h12l7 19H-13z',['#c6b4d6','#abd0be','#dfbdad'][j]) +e(0,19,13,3,'#ecdbb5'),10+j*22,32)),
 ()=>p('M3 12q28 30 58 0','none','#cebda0',2)+repeat(5,j=>p(`M${10+j*11} ${19+7*Math.sin(j*Math.PI/4)}v8`,'none','#d9c8a5',1.6)+starLight(10+j*11,36+7*Math.sin(j*Math.PI/4),.85)),
 ()=>lantern(32,32,.83,'#e7d2b0',true)+p('M28 59v3m8-3v3','none','#c3ab8b',1.5),
 ()=>lantern(32,32,.86,'#b5c9b8')+repeat(4,j=>flower(21+j%2*21,21+Math.floor(j/2)*17,.37,['#e3b9ae','#d4bddb','#e1d29e','#bfd8d1'][j]))+p('M29 56v6m6-6v6','none','#dcc3a0',1.5),
 ()=>p('M14 52V24q18-32 36 0v28z','#aac8c0a0')+p('M17 52V25q15-24 30 0v27','none','#e3c9a4',2)+p('M25 41q-9-9 6-24 0 10 7 14 8 12-6 15z','#e9d3a1')+r(10,53,44,7,'#b8b99e',2)+p('M8 32l-5-2m58 0l-5 2M10 13l-4-5m52 5l4-5','none','#d8c9a9',2)
][n]();
case 'soda':return [
 ()=>drinkBottle(32,32,.9,'#b4d4c8')+ice(14,48,1.2)+ice(47,51,1)+p('M11 21l-5-4m44 0l6-3','none','#dde7d4',1.8),
 ()=>p('M15 16h34l-7 42H23z','#a5d5c6')+p('M18 31h29v12H20z','#d7b2cf')+p('M20 44h24l-2 14H23z','#e9cd9b')+e(32,16,17,4,'#ede4c8')+p('M37 28l4-24 13-2','none','#d4c3df',2.5),
 ()=>e(32,56,28,5,'#c6ccb7')+drinkBottle(15,34,.57,'#b8d6af')+drinkBottle(32,30,.7,'#d5b7cf')+drinkCup(49,37,.8,'#dfc59c'),
 ()=>iceBucket()+drinkBottle(23,26,.7)+drinkBottle(42,30,.58,'#d5b4c8')+ice(15,30,1)+ice(36,34,1)+p('M17 48h30','none','#e3d5b0',2),
 ()=>r(5,19,54,39,'#cab48c')+repeat(3,j=>drinkBottle(15+j*17,34,.49,['#b3d2b5','#d1b4d0','#dfc7a0'][j]))+p('M7 47h50m-40-29v39m30-39v39','none','#ead7b6',2.5)+p('M23 17q9-12 17 0','none','#d9b6c4',2.2),
 ()=>p('M16 19h30v34q-15 12-30 0z','#b5d8c5a0')+e(31,19,15,4,'#ebe2c5')+p('M47 25q16-4 12 15l-12 4','none','#d3c6a5',3)+p('M18 20l-8-8 8 1','none','#c5d8c4',2)+c(30,37,7,'#e4c598')+fruit(24,46,'#dca6b4',.55)+p('M34 11q-4-10 6-9','none','#a7c5ad',2),
 ()=>p('M32 17v39m-20 4h40','none','#d1b894',2.5)+at(iceBucket()+drinkBottle(23,24,.65)+ice(42,29),10,-2,.7)+at(iceBucket()+drinkBottle(18,26,.6,'#d2b9cf')+drinkBottle(43,26,.6,'#dbcb99')+ice(31,29),0,18,1),
 ()=>e(32,53,29,7,'#c3cbb7')+repeat(6,j=>drinkCup(13+j%3*19,26+Math.floor(j/3)*20,.46,['#b5d3b6','#d0b5cc','#dfc598'][j%3])),
 ()=>p('M16 18h30v34q-15 9-30 0z','#a6cfc0a0')+e(31,18,15,4,'#eedcb5')+p('M46 25q16-3 13 13l-12 7','none','#c5bfa0',3)+fruit(30,36,'#ddacbb',.6)+drinkCup(8,45,.48,'#d8bfd3')+drinkCup(55,45,.48,'#e4c998')+p('M23 7l-3-5m15 5l4-6','none','#ded1a3',1.8)+e(32,58,29,4,'#b7c4ae')
][n]();
case 'float':return [
 ()=>swimRing(32,32,1,'#b9b9d7'),
 ()=>p('M7 43q-3-12 9-18-4-15 10-15 10 0 11 13 18-2 20 13-9 24-35 18-50 7z','#e6d0a3')+c(28,19,2,'#6d7b7e')+p('M36 20l10 5-11 2z','#d7af91')+p('M18 36q8-6 14 4','none','#efdfb9',2)+c(47,48,11,'#b5c9d4')+p('M47 37v22m-10-10h20','none','#d2b9cf',2),
 ()=>p('M6 19q26-16 52 0v36q-26 11-52 0z','#b4b9d7')+e(20,24,8,5,'#e5d5ce')+e(44,24,8,5,'#e5d5ce')+p('M10 40h44m-44 8h44M32 30v22','none','#ddd3df',2.1),
 ()=>p('M6 42h52v14q-26 8-52 0z','#b9bcd7')+p('M10 44V17m44 27V17','none','#d6c6a8',2.2)+p('M6 18q26-25 52 0l-5 7H11z','#aacec0')+p('M15 45h34m-34 7h34','none','#e9d9d2',2),
 ()=>p('M5 31h54l-6 28H11z','#c6b595')+p('M9 30q23-28 46 0','none','#e2c8a3',3)+at(swimRing(0,0,.34),22,29)+p('M37 16v24m7-24v24','none','#b1c5ca',3)+r(38,11,10,7,'#d6c3df',2)+p('M10 43h45','none','#eedbb8',2),
 ()=>whale(30,32,.88),
 ()=>swimRing(30,25,.88,'#cbb7cf')+swimRing(34,42,.78,'#abcbd1')+p('M12 22q-7 23 5 32m32-35q9 19-2 33','none','#e2cba7',1.8),
 ()=>p('M8 33l7-14h20l7 14v24H8z','#b9cbb2')+p('M25 19v38m-15-18h29m-29 9h29','none','#e2d7b6',2)+r(9,7,30,11,'#bbc5d5',3)+p('M24 9v7','none','#e6d8bc',2)+p('M46 30l10-3 6 28H43z','#ccb5d0')+p('M48 30v19m6-20v19','none','#e0d2df',1.4)+p('M14 29h4m12 0h4','none','#d1b493',2),
 ()=>whale(28,35,.9,'#a8b9d1',true)+p('M13 11q6-10 17-5-10 3-8 11','none','#e4d4aa',2)+repeat(3,j=>c(44+j*6,10+(j%2)*5,1.4,'#e8ddbf'))+p('M6 60q7-5 14 0t14 0t14 0','none','#add6d0',1.8)
][n]();
case 'solar':return [
 ()=>solarPanel(6,8,52,39)+p('M13 47v12m38-12v12M10 60h7m30 0h8','none','#cbd4bf',3),
 ()=>solarPanel(6,17,25,33)+solarPanel(33,17,25,33)+p('M24 17V8h16v9M31 24h2m-2 12h2m-2 11h2','none','#dfcba8',2.5),
 ()=>p('M3 43l29-24 29 24M10 41v18m44-18v18','none','#c0b294',3)+p('M8 37l22-20 26 13-20 22z','#7397ab')+p('M14 32l26 12m-19-19l26 13m-22-18l-14 24m28-17l-14 24','none','#bdd9d1',1.4),
 ()=>p('M3 14l18-5v40L3 55z','#80a5b8')+solarPanel(22,9,20,40)+p('M43 9l18 7v40l-18-7z','#9fbabf')+p('M8 20l9-2m-9 11l9-2m-9 11l9-2m30-17l9 3m-9 8l9 3m-9 8l9 3','none','#d0dfd1',1.6),
 ()=>solarPanel(6,10,37,35)+at(solarPanel(0,0,29,35),29,18,.95)+p('M14 46l-5 14m38-7l8 7m-30-6v6','none','#d2c6a6',3),
 ()=>r(9,27,46,31,'#b0c5b9')+r(14,34,25,16,'#6e93a6',2)+c(46,40,4,'#ddcba2')+solarPanel(15,6,34,22)+p('M20 54h17','none','#e3d4af',2),
 ()=>solarPanel(3,12,29,25)+r(38,8,23,25,'#b3c8b9',2)+r(8,42,23,16,'#c9b6ce',2)+r(38,40,23,18,'#adbeca',2)+p('M32 25h6m-18 13v4m23-9v7m-11 11h6','none','#e3cca6',2.5)+c(49,17,4,'#ded29f'),
 ()=>repeat(6,j=>solarPanel(5+j%3*18,10+Math.floor(j/3)*20,16,18))+p('M5 50h52m-42 0v11m30-11v11','none','#c7c9af',2.6),
 ()=>p('M18 8h28l14 23-14 24H18L4 31z','#91b7c5')+p('M24 17h16l8 14-8 15H24l-8-15z','#bed7c0')+p('M29 19l-6 16h8l-2 9 13-19h-9l3-6z','#e6d8a7')+p('M11 31h5m32 0h6M32 8v9m0 29v9','none','#decca5',2)
][n]();
case 'fan':return [
 ()=>fanHead(32,24,.82)+p('M32 45v11m-17 3h34','none','#b7cdbb',4),
 ()=>fanHead(32,21,.74)+p('M32 40v20M15 61h34','none','#c2d3bc',3.5)+c(32,49,3,'#dbc39e'),
 ()=>r(5,7,54,46,'#a8c3bb',8)+fanHead(32,29,.75)+p('M12 55l-4 7m44-7l4 7','none','#d5c6a5',3)+r(22,4,20,5,'#d7c7a6',2),
 ()=>fanHead(17,28,.56)+fanHead(47,28,.56)+p('M17 42h30M32 42v15m-18 3h36','none','#bfd1bd',3),
 ()=>e(32,52,26,7,'#b1cbbe')+p('M40 49l-13-13m0 0l-14 15','none','#d6c8a8',4)+at(fanHead(0,0,.64),30,24)+p('M10 55h43','none','#e9ddbb',1.8),
 ()=>r(17,19,30,36,'#afc5bf',5)+fanHead(19,18,.52)+fanHead(45,38,.52)+p('M22 57h23','none','#d7c6a5',3)+p('M12 13l-8-3m50 28l7 3','none','#d4dec5',1.8),
 ()=>p('M23 7q9-5 18 0l2 49H21z','#a9c8c0')+p('M27 13v32m7-32v32m-10-21h16','none','#d6e3ca',1.5)+c(32,50,3,'#ddcba6')+e(32,59,20,4,'#b4c3ae'),
 ()=>fanHead(17,26,.52)+p('M17 41v15m-11 3h22','none','#cccfb2',3)+p('M40 10h14l3 44H37z','#a6c8bd')+p('M44 16v29m6-29v29','none','#e0dfbf',1.5)+e(47,58,13,3,'#c8c5a6')+at(fanRotor(0,0,.35),32,45),
 ()=>p('M12 55V30Q8 3 32 4t20 26v25z','#b6d0c2')+p('M23 47V30q-5-15 9-15t9 15v17z','#4c7080')+p('M27 42V29q-1-8 6-8t5 8v13','none','#c2ded0',2.8)+e(32,58,24,4,'#c4c7ab')+p('M54 19q8 5 3 12M9 19q-8 5-3 12','none','#dce5c9',1.8)
][n]();
case 'paper':return [
 ()=>p('M8 16h42l7 7v32H15l-7-7z','#ddcbb0')+p('M9 16l7 7h41M16 23v32','none','#f3e2c4',2)+p('M20 31h26m-26 7h30m-30 7h25','none','#adb5a8',1.6),
 ()=>repeat(3,j=>p(`M${5+j*18} ${15+j%2*5}h14v38h-14z`,['#b7cbb8','#d1b5c7','#decda6'][j])+e(12+j*18,15+j%2*5,7,4,'#eddfc5')+e(12+j*18,15+j%2*5,3,2,'#9b9291')),
 ()=>at(sheet(0,0,.83,'#f0dfbf'),25,30)+p('M23 17h35v39H23z','#b6cbb7')+p('M25 20l15 13 15-13m-30 32l10-12m20 12l-10-12','none','#e7d7b5',1.6)+flower(43,42,.48,'#dab6c7'),
 ()=>r(5,22,54,36,'#c5aa86')+repeat(3,j=>at(sheet(0,0,.45,['#c5cbd9','#dec5ad','#b5cdb6'][j]),16+j*16,30+(j%2)*3))+p('M7 40h50m-39 0v17m28-17v17','none','#e4cba6',2.2),
 ()=>r(6,9,52,47,'#c8b089',1)+r(10,13,44,38,'#ded1ad',1)+repeat(10,j=>p(`M${13+j*4} 14v35`,'none','#a9b39a',1.1))+p('M8 4v5m48-5v5m-48 49v4m48-4v4','none','#d9c39c',3),
 ()=>p('M8 7h42l7 9v41H8z','#e5d4b2')+p('M50 7v10h7M15 14h21m-21 5h16m-16 32h25','none','#adad99',1.3)+flower(29,33,.95,'#ceadbd')+p('M29 46V32m0 8l-9-5m9 2l11-5','none','#9eba98',2),
 ()=>repeat(3,j=>p(`M${3+j*20} ${9+(j%2)*5}l19-5v46l-19 7z`,['#e4d0b1','#c2cfb5','#d6b8c9'][j])+p(`M${8+j*20} ${20+(j%2)*3}v22`,'none','#f0dec3',1.4))+p('M5 59h54','none','#cdb390',2),
 ()=>r(5,34,54,24,'#c4b08e')+repeat(4,j=>p(`M${8+j*13} ${12+(j%2)*5}h10v35h-10z`,['#b4c6d2','#d2b2c9','#d4c799','#b5cbb5'][j])+e(13+j*13,12+(j%2)*5,5,3,'#eee0be'))+p('M6 48h52','none','#e1cca4',2),
 ()=>at(sheet(0,0,.83,'#efddbd'),29,30)+p('M7 47l15-9 20 5-15 12z','#b4c8b6')+p('M42 53l13-38 4 1-12 39z','#b59bb5')+p('M43 55l4-1-5 6z','#dfc8a0')+p('M18 56h26','none','#d8c19b',1.7)
][n]();
case 'ink':return [
 ()=>p('M11 15h42v36q-21 13-42 0z','#aeaec5')+e(32,15,21,7,'#d1c1d7')+e(32,15,15,4,'#767e99')+r(18,28,28,17,'#e3d2b1',2)+p('M24 35h16m-13 5h10','none','#9b93ab',1.6),
 ()=>repeat(3,j=>inkBottle(13+j*19,34,.67,['#a6c6b7','#c1a8c9','#d2b890'][j]))+e(32,57,28,3,'#c4c4ac'),
 ()=>inkBottle(32,35,1.06,'#aaa6c0')+p('M22 14l4-6h12l4 6','none','#dbc6a2',2.5)+p('M25 30v13m0-6h13','none','#aeccbe',2.5)+p('M50 20q9 10 1 19','none','#d4dbc5',1.7),
 ()=>r(5,25,54,31,'#b7a184')+inkBottle(20,34,.6,'#9cabb8')+p('M40 41l7-32h5l-8 34z','#cfb68f')+p('M42 44l-5 9h7l3-10z','#a9bdb8')+p('M8 49h48','none','#e2caa4',2),
 ()=>r(4,19,56,38,'#bba484')+p('M4 21l7-12h42l7 12m-42-7v42m28-42v42','none','#e5caa3',2.6)+repeat(3,j=>inkBottle(15+j*17,36,.5,['#adc2b3','#b7a3c8','#c6bc8e'][j]))+p('M7 51h50','none','#e2cfaa',1.8),
 ()=>p('M3 43h58v15H3z','#b4b7a4')+repeat(6,j=>inkBottle(13+j%3*19,25+Math.floor(j/3)*23,.4,['#acb0d3','#caabc0','#dbc38e','#9dc5b6','#a3c5cf','#b7c59c'][j]))+p('M3 29h58','none','#decaab',2),
 ()=>r(5,28,54,31,'#b9bfae')+r(10,5,44,25,'#cbbca1')+repeat(3,j=>c(19+j*13,18,5,['#b8a7ca','#a5c9b5','#dbc391'][j]))+repeat(4,j=>c(13+j*13,43,5,['#adbad1','#d1aabd','#a8c9bc','#d7c39a'][j]))+p('M9 55h46','none','#e2d6b5',2),
 ()=>r(4,12,56,44,'#b0b8a1')+repeat(4,j=>r(9+j%2*27,17+Math.floor(j/2)*18,20,14,['#c7acc4','#9fc2b0','#b4c3d0','#d5bc96'][j],1))+p('M25 10V3h14v7M32 4v11','none','#d8bd93',3)+r(25,10,14,8,'#baa68b',1),
 ()=>inkBottle(24,36,.88,'#a5b7bf')+p('M41 50l10-35 6 2-12 34z','#c0a68e')+p('M40 51l5 1-6 8z','#e2d1b1')+p('M5 59h52','none','#d4c19e',2.5)+at(sheet(0,0,.4,'#ebdbbe'),46,27)+p('M17 9q7-9 14 0','none','#b7cdbd',1.8)
][n]();
case 'book':return [
 ()=>closedBook(32,31,1,'#a4c2af')+p('M15 13h7m-7 15h7m-7 16h7M27 18h16m-16 6h12','none','#dbc39c',2),
 ()=>p('M15 7h38v51H15z','#c8b99b')+repeat(6,j=>e(15,12+j*8,4,2.4,'#b7c5bc'))+p('M24 16h19m-19 8h19m-19 8h15m-15 8h18','none','#879b96',1.5)+p('M46 12v46','none','#e8d1aa',2),
 ()=>closedBook(28,31,.96,'#a9c5b4')+repeat(4,j=>r(44,12+j*10,11,8,['#b8cfa4','#d1b4c6','#dcc79b','#b1c8d3'][j],1))+flower(30,29,.65,'#d9c7ab'),
 ()=>closedBook(28,32,1.02,'#af9b80')+r(22,15,21,13,'#ddcaa3',1)+p('M27 19h12m-12 5h8','none','#8b9c8b',1.4)+p('M50 5v46','none','#d9bea0',4)+p('M48 51l2 7 2-7z','#6b8387'),
 ()=>r(5,23,54,34,'#bab091')+repeat(3,j=>at(closedBook(0,0,.59,['#adc6b2','#b8acc9','#ccbd96'][j]),16+j*17,31+(j%2)*3))+p('M7 52h50','none','#e8d0ad',2),
 ()=>closedBook(32,31,1,'#968e8c')+r(21,13,23,31,'none',1)+p('M24 17h17m-17 23h17','none','#e3c89a',1.7)+flower(32,28,.58,'#dcc49a')+p('M14 56h34','none','#e9d6b4',2),
 ()=>repeat(4,j=>p(`M${3+j*15} ${10+j%2*4}h14v41H${3+j*15}z`,['#b3c9b8','#cab7ce','#d2bca0','#b2c7d1'][j])+r(6+j*15,17+j%2*4,8,13,'#e3d7b9',1)+p(`M${7+j*15} ${38+j%2*4}h6`,'none','#e7d7b5',1.7))+p('M4 55h56','none','#ceb899',2),
 ()=>p('M5 14h54v42H5z','#b8bda8')+repeat(3,j=>p(`M${10+j*16} ${19+(j%2)*4}h13v33H${10+j*16}z`,['#a6bdaf','#c0b1c7','#d2c09e'][j])+r(12+j*16,23+(j%2)*4,9,9,'#e2d5b9',1))+p('M7 54h50m-32-40V7h14v7','none','#e1caa6',2.6),
 ()=>p('M5 11q14-6 27 1 13-7 27-1v44q-15-5-27 1-15-6-27-1z','#e7d5b4')+p('M32 13v43m-22-35h16m-16 7h14m12-14h15m-15 7h15m-15 7h13','none','#97aaa0',1.5)+c(18,42,8,'#b2c9b7')+p('M18 36v6l5 3','none','#e7d6b4',1.8)+p('M35 42h15m-15 7h11','none','#aa9cb2',1.4)
][n]();
case 'pan':return [
 ()=>pot(32,31,.9,'#bccad0')+p('M24 13q-4-7 0-10m13 10q-4-7 0-10','none','#d5dfca',1.8),
 ()=>p('M13 21h38l4 23q-23 17-46 0z','#c6a98d')+e(32,21,21,6,'#d5bda0')+r(26,12,12,7,'#a1b9af',3)+p('M13 30H5v10h6m40-10h8v10h-6','none','#e0c8a4',3),
 ()=>pot(23,35,.65)+e(48,43,12,9,'#abbfca')+p('M54 35l5-14','none','#d5b997',4)+p('M9 12v28m6-26v26','none','#cfb694',3)+e(9,10,4,6,'#ddc7a4')+r(12,6,8,8,'#b4cbc4',1),
 ()=>p('M5 11h54m-48 0v47m42-47v47M8 58h48','none','#d3bd9d',3)+p('M15 12v24m12-24v25m14-25v19m12-19v17','none','#b4c7bc',2.6)+e(15,41,5,8,'#d4b99a')+e(27,41,6,8,'#e1c9a4')+e(42,40,9,9,'#aabec9')+p('M23 36l4 12 4-12','none','#d9c6a3',1.7),
 ()=>p('M10 29q22-7 44 0l-4 21q-18 13-36 0z','#adc4c0')+e(32,28,23,7,'#bfd2c7')+r(26,17,12,7,'#d6bd97',2)+p('M11 33H3v9h9m41-9h8v9h-9','none','#dbc7a5',3)+p('M17 45q15 6 30 0','none','#e4dbc0',1.8),
 ()=>p('M7 29q26 9 45-1-4 27-22 29Q12 56 7 29z','#c7aa87')+e(30,29,23,8,'#67818a')+p('M50 26l10-15','none','#cbb795',5)+p('M8 34H2v11h10','none','#e1c6a2',2.5)+p('M20 52q10 6 20 0','none','#e7c597',3),
 ()=>repeat(6,j=>pot(12+j%3*20,22+Math.floor(j/3)*25,.3,['#b2c9c0','#c9b295','#bcb4cc'][j%3],j%2===0))+p('M5 58h54','none','#d9c4a2',2),
 ()=>r(4,27,56,31,'#b8af95')+r(6,6,52,21,'#b9c6b5')+pot(19,40,.5,'#bcc7c5',true)+e(44,43,11,8,'#647f88')+p('M48 35l8-14','none','#d8c29d',3)+p('M14 10v14m11-14v14m12-14v14m12-14v14','none','#e3caa5',2)+p('M8 54h48','none','#e9d7b7',1.8),
 ()=>pot(32,33,.96,'#bdbaa0',true)+at(pot(0,0,.23,'#d2bdce'),9,52)+at(pot(0,0,.23,'#bfd1c3'),55,52)+p('M21 14q-5-7 0-12m11 10q-5-7 0-12m11 14q-5-7 0-12','none','#d6e1c5',1.8)+e(32,59,26,3,'#d0b697')
][n]();
case 'soup':return [
 ()=>p('M9 30q0-21 23-21t23 21q1 27-23 28Q8 56 9 30z','#d0ae83')+e(32,24,21,7,'#e6c393')+p('M19 32q-4 18 7 23m19-23q4 18-7 23','none','#e5c69b',1.8)+p('M30 10l3-7 7 2','none','#aac59f',3),
 ()=>soupBowl(32,35,.95,'#e9d4ae','#c3c7bb')+p('M20 31q10-10 21-2-10 8-18 2 6-4 13-1','none','#f5e6cc',2.5)+p('M10 36H3v10h9m42-10h7v10h-9','none','#d7c8ac',2),
 ()=>pot(32,32,.93,'#c8ad8f',true)+p('M22 13q-5-7 0-11m19 11q-5-7 0-11','none','#dde4ce',1.8),
 ()=>p('M17 29h30v22q-15 12-30 0z','#b7cabb')+e(32,29,15,5,'#dbc397')+p('M9 55h46','none','#d9c2a0',3)+at(lantern(0,0,.26,'#e5cf9e'),8,25)+p('M8 15V6h44v13','none','#aebcac',1.8),
 ()=>e(32,54,29,6,'#bdc8b2')+soupBowl(15,40,.4,'#d6b48d')+soupBowl(45,40,.4,'#e8d5af')+soupBowl(31,25,.52,'#b9c79b')+maple(51,50,.28)+r(5,47,12,6,'#dfc19a',2),
 ()=>pot(32,29,.94,'#b1c6bd')+e(32,24,16,4,'#d5b08b')+repeat(3,j=>c(23+j*9,24,2,'#b7c699'))+p('M21 13q-5-7 0-11m18 11q-5-7 0-11M47 20l9-15','none','#dbdec4',2),
 ()=>e(32,56,29,4,'#c9c4ac')+repeat(6,j=>at(pot(0,0,.26,['#aec7b9','#c8b6cd','#d8bb98'][j%3],true),12+j%3*20,24+Math.floor(j/3)*23)),
 ()=>r(4,23,56,35,'#b5baa1')+repeat(4,j=>soupBowl(16+j%2*29,31+Math.floor(j/2)*18,.34,['#ddbe99','#b6c79e','#e7d3b0','#cca6b6'][j]))+p('M5 49h54m-27-26v35','none','#e0c9a3',2)+p('M24 21q8-12 16 0','none','#d0b1c4',2),
 ()=>soupBowl(32,33,.93,'#e5c7a1','#c0d0bb')+p('M10 55l-4-16m-1-7q8-6 9 3-5 7-9-3','none','#d9c6a2',2.5)+p('M15 57h35','none','#c6b3c6',3)+c(25,29,2,'#a6bf9c')+c(37,28,2,'#d7acb5')
][n]();
case 'table':return [
 ()=>p('M32 25v30m-16 3h32m-16-20l-15-9m15 9l15-9','none','#c1b194',3.5)+r(14,17,6,14,'#e1d4b5',1)+r(29,8,6,17,'#e1d4b5',1)+r(44,17,6,14,'#e1d4b5',1)+candle(17,17)+candle(32,8)+candle(47,17),
 ()=>e(32,55,28,5,'#d0c1a4')+maple(29,31,1.1)+maple(48,40,.45,'#b3c4a2')+r(12,39,10,14,'#b7c9b7',2)+candle(17,37),
 ()=>e(32,48,28,10,'#d0c6ae')+c(27,38,17,'#e9ddc2')+c(27,38,11,'#bdd0b8')+at(cup(),32,4,.45)+p('M5 20v32m-2-32v10h4V20m45 26V20h5v31','none','#b8c5bc',2.2),
 ()=>e(32,54,29,5,'#c6bd9e')+at(lantern(0,0,.64,'#ded0a3'),32,26)+p('M18 52l8-7 11 4-8 8z','#c7b3cb')+maple(48,45,.35,'#b5c69e')+p('M9 43v11','none','#e3caa5',2.5),
 ()=>p('M8 54l13-37h26l10 37z','#b3c6b7')+p('M21 17l-4 37m30-37l4 37','none','#ead6b4',2.2)+c(33,29,5,'#dbbfab')+p('M24 46v-6q9-10 18 0v6z','#a6a7c1')+p('M27 12h12','none','#cfb494',2.5),
 ()=>e(32,52,29,7,'#c6c0a4')+repeat(4,j=>flower(10+j*14,22+(j%2)*11,.6,['#bdd0a7','#e3b9bd','#d9c299','#b9c9db'][j]))+p('M10 34v12m14-1v4m14-15v12m14-1v4','none','#afc19d',2)+candle(31,41),
 ()=>e(32,55,29,5,'#c4b8a0')+repeat(6,j=>at(cup(['#b4ccba','#c7b2cc','#ddc4a0'][j%3]),3+j%3*19,Math.floor(j/3)*26,.34)),
 ()=>r(5,24,54,33,'#bea68a')+c(23,40,13,'#e5d4b6')+c(23,40,8,'#b9cbb8')+p('M45 12v34m-3-34v10h6V12M52 31V12h5v32','none','#e1caa7',2)+at(cup(),32,22,.4)+p('M8 54h48','none','#d6bd96',1.8),
 ()=>p('M35 7h23v30H35m0-17h23m-21 16v23m19-23v23','none','#c7ae8d',3)+p('M3 30h31v9H3m4 0v20m23-20v20','none','#d8bf9d',3)+e(17,30,10,3,'#e6d8be')+candle(17,23)+p('M7 45h16','none','#b8c8b6',2)
][n]();
case 'photo':return [
 ()=>photoCard(32,32,1,'#b0c6bd',6),
 ()=>r(8,5,48,54,'#bda586',2)+photoCard(32,32,.83,'#acc2c6',2)+p('M10 9h43','none','#ebd3ad',2),
 ()=>photoCard(20,30,.76,'#b6c9b5',2)+photoCard(39,34,.76,'#c5b4c9',3)+p('M7 58h50','none','#d8c09c',2),
 ()=>closedBook(30,32,1.1,'#b6b7ca')+at(photoCard(0,0,.43,'#b9c8b2',2),31,31)+p('M52 16v37','none','#e3ccab',2),
 ()=>r(3,6,58,51,'#b9af96',2)+repeat(4,j=>photoCard(17+j%2*29,20+Math.floor(j/2)*25,.44,['#acbdb5','#c2adc4','#d3ba9b','#b0c2d0'][j],2)),
 ()=>p('M3 10h27v45H3z','#c4ad8f')+p('M30 10l31 7v45l-31-7z','#adbcb0')+photoCard(16,32,.62,'#c4b9d1',2)+photoCard(46,36,.62,'#b0c6b6',3)+p('M30 11v44','none','#e7d1ad',2),
 ()=>p('M7 25h50v32H7z','#b5a3bb')+p('M11 6h42v20H11z','#b7c8b6')+repeat(3,j=>photoCard(18+j*14,16,.3,'#c6bdd1',1))+repeat(3,j=>photoCard(18+j*14,40,.35,'#b4c8c1',2))+p('M8 54h48','none','#e3ccad',2),
 ()=>closedBook(28,31,1.05,'#b9a5bb')+repeat(6,j=>at(c(0,0,3,'#dfc4ac')+p('M-4 10V7q4-7 8 0v3z',['#a8c6b2','#b4bfd0','#d0b298'][j%3]),23+j%3*8,23+Math.floor(j/3)*15))+p('M17 10h25','none','#e2c6a1',2),
 ()=>p('M3 12q15-8 29 0 15-8 29 0v43q-14-7-29 0-15-7-29 0z','#e9d8b7')+photoCard(18,32,.58,'#b3c9c0',3)+photoCard(47,32,.58,'#b9b3cc',3)+p('M32 12v43M8 59h48','none','#c5ad8d',2)
][n]();
case 'display':return [
 ()=>p('M9 5h46v54H9m0-34h46m-46 21h46','none','#c2a98b',4)+p('M15 11v8m9-8v8m9-8v8m9-8v8','none','#e7cfaa',2)+r(18,33,28,8,'#b7c7b6',2),
 ()=>r(8,5,48,52,'#a4cec59a',1)+p('M9 23h46m-46 20h46M16 9v44','none','#d5d8bb',2)+glassBottle(32,36,.53,'#b6b9d7',true)+p('M10 59h44','none','#d1bb9a',3),
 ()=>r(6,7,52,46,'#a7c3b89a',3)+p('M8 29h48','none','#d6c6a6',2)+photoCard(22,20,.39)+glassBottle(43,37,.46)+c(14,58,4,'#bdd0bf')+c(50,58,4,'#bdd0bf'),
 ()=>p('M11 7h42v31H11z','#a7ccc799')+p('M8 39h48v9H8m7 9h34','none','#d7c39e',4)+at(gearWheel(0,0,13),32,25)+p('M18 48v9m28-9v9','none','#b5c6b6',2.5),
 ()=>p('M7 6h50v51H7m0-20h50m-50 20h50','none','#b5c7b7',3)+repeat(3,j=>photoCard(16+j*16,21,.35,['#b4c6b4','#c4b2ca','#cbbb9f'][j],1))+r(14,43,12,10,'#d0bd9b',1)+r(33,43,15,10,'#b9b8d0',1),
 ()=>r(7,4,50,55,'#b5cfc299',2)+p('M8 31h48m-24-25v52','none','#d3c3a4',2.3)+glassBottle(20,20,.39)+photoCard(45,20,.43,'#b6b4cd')+at(conch(0,0,.32),20,45)+c(45,45,8,'#d8c6a5'),
 ()=>p('M5 5h54v53H5m0-29h54','none','#c1b393',3)+repeat(4,j=>at(closedBook(0,0,.34,['#a9c7b1','#c1afc9','#d3c19b','#b2c5d0'][j]),14+j*12,16))+repeat(4,j=>r(10+j*12,34,10,18,['#dac49c','#b3c7b6','#ccb0c2','#b8c6d0'][j],1))+p('M16 62v-4m32 4v-4','none','#c0cbbb',2),
 ()=>r(5,5,54,54,'#b5bba5',3)+repeat(6,j=>r(9+j%3*17,10+Math.floor(j/3)*24,13,20,['#adbdc5','#c1b0c8','#d0bda0'][j%3],1)+p(`M${12+j%3*17} ${16+Math.floor(j/3)*24}h7`,'none','#ecdabb',1.6)),
 ()=>p('M4 11h17v45H4m19-51h18v51H23m20-38h17v38H43','none','#bec6b3',3)+photoCard(12,27,.3,'#b8c6d0')+glassBottle(32,21,.31,'#c5b2ca')+at(fanShell(0,0,.27),32,43)+at(closedBook(0,0,.3),52,36)+p('M3 59h58','none','#dac19c',2.5)
][n]();
case 'signal':return [
 ()=>signalHead(32,25,.95)+p('M16 60h32','none','#c8c2a2',3),
 ()=>p('M10 19h44m-42-4l37 31m-37 0l37-31','none','#e0c4a1',5)+c(32,31,6,'#d1a4aa')+p('M32 38v20M17 60h30','none','#b8c6b4',3)+p('M10 49h44','none','#d6c7a6',2),
 ()=>r(7,10,50,29,'#adbbb0',3)+p('M14 20h17l-6-5m6 5l-6 5M49 29H32l6-5m-6 5l6 5','none','#e6d4a7',3)+p('M32 40v18m-13 3h26','none','#c6d0b7',3)+c(48,18,3,'#bad096'),
 ()=>p('M32 8v50m-15 3h30','none','#b4c4b3',3.3)+p('M6 15h41l11 11-11 11H6z','#afc5b8')+p('M58 38H17L6 48l11 10h41z','#bdb1cb')+p('M18 25h25m-25 23h25','none','#e5d4af',2),
 ()=>signalHead(45,25,.95)+p('M5 25h21l9 8-9 8H5z','#bec5a6')+p('M10 33h12m-2-4l4 4-4 4','none','#e6d5af',2.2)+p('M14 42v16m-8 3h18','none','#b4c6b3',2.5),
 ()=>p('M5 59V14h54v45m-53-38h52','none','#c5bfa2',4)+signalHead(19,35,.5)+signalHead(45,35,.5)+p('M10 8h45','none','#e3cda8',2)+p('M13 59h7m24 0h7','none','#d6d3b4',2),
 ()=>r(4,35,56,23,'#b6b79f',2)+repeat(4,j=>signalHead(11+j*14,22,.35,[['#d3a6af','#d9c697','#b0c6a1'][j%3]]))+p('M7 51h50','none','#e4cfaa',2),
 ()=>p('M32 5v55','none','#c5b396',3.5)+p('M5 12h43l11 11-11 10H5z','#b3c6b4')+p('M58 36H17L6 45l11 10h41z','#d3baa3')+p('M16 27V17l6-5 6 5v10M20 23v4m11 18h17','none','#e6d7b3',1.8)+p('M20 61h24','none','#b4c5b1',3),
 ()=>p('M32 22v36m-15 3h30','none','#b1c4b4',3.2)+r(17,6,30,28,'#a8c1b5',4)+p('M23 22l9-10 9 10m-16-2v10h14V20','none','#e7d4a9',2)+p('M12 14l-7-3m47 3l7-3M13 32l-7 3m46-3l7 3','none','#c5d9bd',1.8)
][n]();
case 'map':return [
 ()=>r(4,8,56,48,'#dfcfad',1)+repeat(3,j=>p(`M9 ${20+j*10}h45`,'none','#8ca9a1',2))+r(16,13,12,7,'#b5c5af',1)+r(37,40,16,8,'#c9b0c4',1)+p('M21 20v20m23-20v20','none','#bfac8e',1.6),
 ()=>p('M10 6l22 5 22-5v49l-22 5-22-5z','#e0d2b1')+p('M19 17v20l26 8M19 17l20 7v16m-24 8l18-18 16-7','none','#98b8a3',2.2)+repeat(5,j=>c(18+j*7,19+j%3*12,2,'#d5b8c2'))+p('M32 11v45','none','#c6bfa4',1.2),
 ()=>sheet(32,32,.95,'#e2d0ae')+p('M18 37h14V20m0 0l-6 7m6-7l6 7M32 37h16l-5-5m5 5l-5 5','none','#c5969f',2.4)+p('M16 15h10v10H16','none','#9cbda3',1.8)+p('M42 51l8-7','none','#aab9cd',2),
 ()=>mapPaper(32,30,1,'#d8d0b0')+repeat(4,j=>r(11+j%2*28,17+Math.floor(j/2)*21,11,9,['#b6c8ad','#c6acc2','#d1b991','#adc1cf'][j],1))+p('M12 54h39','none','#b6b49b',1.6),
 ()=>mapPaper(28,30,.87)+p('M38 40h23v14H38z','#b1c5b9')+p('M41 47h14l-5-4m5 4l-5 4','none','#e6d5b0',2)+p('M9 8h17','none','#c8b19a',3)+c(46,25,5,'#c8b0c5'),
 ()=>closedBook(23,31,.85,'#b2c6b6')+closedBook(42,35,.8,'#d1bba0')+p('M16 22h15m-15 6h11m6 7h14m-14 6h10','none','#e1d0af',1.6),
 ()=>p('M6 12q13-5 26 1 13-6 26-1v42q-13-6-26 1-13-7-26-1z','#dccdaa')+c(18,29,9,'#b5c8b7')+p('M18 21v16m-8-8h16m-8-6l3 8-7-1z','none','#e7d7b5',1.6)+p('M37 20q7 8 14 0m-14 10q7 8 14 0m-14 10q7 8 14 0','none','#98b9b6',1.8)+p('M32 13v42','none','#bdad90',1.3),
 ()=>repeat(4,j=>p(`M${3+j*15} ${12+(j%2)*5}l14-5v39l-14 5z`,['#dacba8','#bfcdb4','#d2b5c9','#c0c9d4'][j])+p(`M${6+j*15} ${26+(j%2)*3}l4 9 5-16`,'none','#8fa99d',1.5)),
 ()=>p('M4 12q14-7 28 0 14-7 28 0v43q-14-7-28 0-14-7-28 0z','#e4d4b2')+p('M32 12v43M9 39l8-20 9 13m12 11l10-18 8 6','none','#95b8a2',1.9)+repeat(4,j=>c(11+j*14,26+(j%2)*17,2.5,['#c9adc4','#b3c79f'][j%2]))+c(48,18,6,'#d2c2a0')+p('M48 13v10m-5-5h10','none','#ebddb9',1.3)
][n]();
case 'gear':return [
 ()=>gearWheel(22,23,17,'#bcc9c9')+gearWheel(43,43,17,'#a5bbbf'),
 ()=>gearWheel(32,32,26,'#d2bb97')+repeat(6,j=>{const a=j*Math.PI/3;return p(`M${32+Math.cos(a)*8} ${32+Math.sin(a)*8}l${Math.cos(a)*11} ${Math.sin(a)*11}`,'none','#f0dbb6',1.8)})+c(32,32,7,'#afc5b6'),
 ()=>r(5,8,54,49,'#a9b7ad',3)+gearWheel(19,25,13)+gearWheel(43,23,11,'#b7c8ba')+gearWheel(35,44,12,'#bca4bb')+p('M19 12l24 1m-24 25l16 18m18-25l-5 22','none','#e5cfa7',1.8),
 ()=>p('M13 8q19-13 38 0v48H13z','#b9a287')+gearWheel(25,21,11,'#d6bd95')+gearWheel(41,31,10,'#b5c6b6')+p('M30 31v19','none','#e6cea6',2.5)+c(30,51,6,'#c3b0c4')+p('M9 58h46','none','#decaab',2.5),
 ()=>r(5,7,54,51,'#9fb5a9',2)+repeat(4,j=>gearWheel(19+j%2*26,20+Math.floor(j/2)*24,12,['#d9bd97','#b1c4b3','#c4adc8','#b1c2d0'][j]))+p('M29 20h6m-6 24h6M19 32h26','none','#e2cda8',2),
 ()=>p('M7 17l36-12 14 12v35L21 60 7 46z','#9eb4b0')+gearWheel(33,24,19,'#bbc5b7')+gearWheel(27,39,20,'#ceb18c')+p('M10 47l12 11m23-7l11-3','none','#e7cea8',2),
 ()=>p('M6 20q26-33 52 0v37H6z','#c5a67f')+gearWheel(20,31,13,'#dbc19a')+gearWheel(45,26,11,'#b4c7b6')+gearWheel(41,45,10,'#b6c4ce')+p('M10 52h45M20 21l25-5','none','#edd4ac',2),
 ()=>r(3,9,58,48,'#a7b5a9',3)+repeat(6,j=>gearWheel(13+j%3*19,21+Math.floor(j/3)*22,9,['#d0b390','#b2c5b6','#bca7c4'][j%3]))+p('M4 58h56','none','#ddc59e',2.5),
 ()=>p('M5 25q1-22 26-9 24-14 28 8-1 14-27 34Q7 43 5 25z','#b6c6b2')+gearWheel(23,30,12,'#d6b88e')+gearWheel(42,34,11,'#a8c1c7')+c(32,47,5,'#d0b0c7')+p('M9 17l7-7m33 6l6-7','none','#e6cfaa',2)
][n]();
case 'clock':return [
 ()=>p('M14 5h36v52H14z','#b8a084')+clockFace(32,24,14)+p('M32 38v13','none','#e0c6a0',2.3)+c(32,51,5,'#d2c0a0'),
 ()=>p('M10 24q22-37 44 0v31H10z','#ba9e80')+clockFace(32,28,19)+p('M6 57h52m-43 3h6m22 0h6','none','#dfcaa6',3),
 ()=>p('M13 20l19-18 19 18z','#b49baa')+p('M17 20h30v38H17z','#b5c4b2')+clockFace(32,32,12)+p('M24 50h16m-27 9h38','none','#dec69f',2)+p('M32 6v6','none','#ead8b5',1.7),
 ()=>p('M14 7h36v43H14z','#aebcad')+clockFace(32,26,16)+p('M10 51h44m-33 0v9m22-9v9M19 60h26','none','#d3bb97',3)+c(32,47,2,'#e9d3ad'),
 ()=>c(32,30,26,'#b2c3b1')+clockFace(32,30,18)+repeat(4,j=>flower(32+Math.cos(j*Math.PI/2)*22,30+Math.sin(j*Math.PI/2)*22,.25,['#c2cea4','#dcb6c5','#d2bc96','#b4c7d2'][j]))+p('M17 59h30','none','#d0b797',3),
 ()=>p('M10 12q22-21 44 0v44H10z','#ad99b3')+clockFace(32,28,19,0,4)+p('M19 53h26m-23-9v5m20-5v5','none','#e2cfaa',2.2)+p('M7 58h50','none','#bdc9b7',3),
 ()=>c(32,34,23,'#b8c8bc')+clockFace(32,34,18)+e(16,10,10,6,'#d7b89b')+e(48,10,10,6,'#d7b89b')+p('M16 7l9 8m23-8l-9 8M18 54l-6 7m34-7l6 7M32 4v7','none','#e4cda6',2.5),
 ()=>p('M16 10l16-7 17 7v40l-17 8-16-8z','#b4bda6')+clockFace(32,29,14)+p('M5 16l11-6v40L5 44zM49 10l10 6v28l-10 6z','#c9b5a0')+at(clockFace(0,0,8),10,29)+at(clockFace(0,0,8),54,29)+p('M19 59h26','none','#ddc9a4',3),
 ()=>p('M10 15q22-26 44 0v39H10z','#bad0b9')+clockFace(32,30,20,0,5)+p('M7 58h50','none','#d0b798',3)+flower(11,50,.4,'#dcbac5')+p('M56 17l5-4M4 18l-3-4','none','#dfe2bf',1.7)
][n]();
case 'scarf':return [
 ()=>scarf(32,31,1)+p('M21 30l4 3 4-3m-8 11l4 3 4-3','none','#b196b5',1.3),
 ()=>p('M9 12l17-5 11 15-9 37H12l9-33-12-8zM26 7l17 4 10 42-14 6-5-34z','#c6acc3')+p('M14 56v6m6-6v6m6-6v6m15-6v6m6-9v6M39 20l9-2m-7 12l9-2m-7 12l9-2','none','#e9d4d2',1.6),
 ()=>p('M32 8L5 48q27 17 54 0z','#b6a9c5')+p('M32 16L14 44q18 10 36 0z','none','#e4cdbb',2)+p('M8 50v9m8-5v8m8-6v7m8-6v7m8-7v7m8-8v7m8-10v8','none','#d5bed0',1.5),
 ()=>r(4,35,56,23,'#b8b69d')+repeat(3,j=>at(scarf(0,0,.5,['#b4c8bb','#c7afc6','#d1bfa0'][j]),14+j*18,27))+p('M6 53h52','none','#e3cda8',2),
 ()=>r(5,24,54,34,'#bfa585')+p('M6 24l7-13h38l7 13','none','#ddc39d',2.5)+scarf(21,29,.59)+r(34,28,17,18,'#b5c7b9',2)+e(41,22,10,6,'#d6c1cf')+p('M10 51h44','none','#e7d1ad',2),
 ()=>p('M29 7L3 48l34 9L60 17z','#c7b0c6')+p('M29 7l6 29 25-19-23 40z','#a9c5b8')+flower(23,33,.68,'#e5c5af')+maple(44,34,.39,'#ddc89d')+p('M5 48l32 9','none','#ebd8bf',3),
 ()=>p('M30 8L6 48q26 10 52 0z','#c4afc7')+repeat(9,j=>e(8+j*6,49+4*Math.sin(j*Math.PI/8),4,5,'#e9d9cf'))+p('M31 19l-11 19m11-19l11 19','none','#ddd0c2',1.8),
 ()=>r(3,28,58,31,'#b6b59d')+repeat(6,j=>r(8+j%3*18,15+Math.floor(j/3)*20,13,17,['#b9cbb8','#c6b0c9','#d8c09f'][j%3],2)+e(14+j%3*18,15+Math.floor(j/3)*20,6.5,3,'#e7d6c4'))+p('M5 50h54m-27-22v31','none','#e4cfa9',2),
 ()=>scarf(21,30,.84,'#c1a9c6')+scarf(43,33,.84,'#aec8bd')+p('M25 12q7-12 14 0','none','#e5cda5',2.4)+p('M5 57h54','none','#c1b493',3)+c(32,38,4,'#e9d4b0')
][n]();
case 'fire':return [
 ()=>stove(32,30,.9,'#b3bba9'),
 ()=>p('M6 57V20q26-27 52 0v37z','#c5b191')+p('M17 53V25q15-17 30 0v28z','#4f6b7b')+flame(32,39,.49)+p('M4 18h56m-48-1v-7h40v7M5 59h54','none','#e3cda8',3),
 ()=>stove(23,32,.64)+p('M48 8v36m0-36h6m-8 36l-4 13m6-13l6 13','none','#cfc3a5',2.5)+r(44,48,15,10,'#c2a887',1)+p('M40 23V8h-5','none','#c2d0ba',2),
 ()=>p('M4 24h56v34H4z','#bda78c')+p('M3 21h58M12 58V33q20-16 40 0v25z','#b0bdac')+p('M18 55V35q14-10 28 0v20z','#466779')+flame(32,41,.54)+p('M9 12h45','none','#dbc7a8',4)+p('M10 6v9m43-9v9','none','#bfcbb8',2),
 ()=>r(4,18,56,38,'#a4b4ad',4)+r(9,24,22,26,'#435f73',2)+r(33,24,22,26,'#435f73',2)+flame(19,37,.31)+flame(44,37,.31)+p('M29 28v10m6-10v10M13 18V6h25M12 56v6m39-6v6','none','#d2c2a3',2.5),
 ()=>p('M11 31h42l-6 23H17z','#c2a887')+e(32,31,21,6,'#657c81')+flame(32,27,.56)+lantern(8,21,.28,'#ead2a2')+p('M8 11V4h41v12m-32 41h30','none','#cbbf9f',2),
 ()=>e(32,32,27,13,'#c4aa8d')+p('M6 32l5 23h42l5-23','none','#d4c19f',2.5)+flame(32,37,.42)+p('M6 56h52','none','#c2b594',3)+teaPot(32,20,.57,'#adc6b8')+at(cup(),-3,26,.34)+at(cup(),42,26,.34),
 ()=>p('M15 7h34l9 16v33H6V23z','#aabbb0')+r(14,23,36,29,'#4b6778',3)+flame(32,37,.52)+repeat(4,j=>c(18+j*9,15,3,['#b7cda7','#d8b1c5','#e0c698','#b4ccd6'][j]))+p('M9 59h46','none','#d4bd9a',3),
 ()=>p('M10 54V26q22-31 44 0v28z','#b7d0c29a')+flame(32,34,.7)+p('M13 51h39m-20-39v-7','none','#e4cba3',2.4)+e(32,57,28,5,'#b7bc9f')+p('M8 41l-4 4m52-4l4 4','none','#dbe2c6',1.7)
][n]();
case 'ceramic':return [
 ()=>teaPot(30,32,.88,'#b5d1c0'),
 ()=>p('M20 9h24v12q22 6 11 30-23 15-46 0-11-24 11-30z','#b6c9ba')+e(32,9,12,4,'#ddcfaf')+maple(32,35,.64,'#d6b29e')+p('M16 47q17 5 32 0','none','#e3d1ae',1.6),
 ()=>e(32,55,28,5,'#c8bda0')+c(18,39,14,'#dfd5b8')+c(18,39,10,'#bad0be')+at(cup('#b4cbd1'),32,7,.5)+teaPot(31,20,.48,'#ccbbcd'),
 ()=>p('M24 5h16v20q20 5 13 28-21 12-42 0-7-23 13-28z','#b8c5cd')+e(32,5,8,3,'#e3d5b8')+at(photoCard(0,0,.32,'#bbcdb8',2),32,38)+p('M20 51h24','none','#e0c5a3',2),
 ()=>r(4,27,56,31,'#bba787')+teaPot(18,34,.42,'#bad0be')+glassBottle(45,25,.4,'#c8b8d1',true)+at(cup(),20,34,.35)+p('M7 50h50m-25-23v31','none','#e0c8a2',2),
 ()=>p('M13 27h38l4 23q-23 14-46 0z','#b0cabd')+e(32,27,20,7,'#e3d5b4')+e(32,27,15,4,'#8da9a0')+p('M11 31H3v12h9m41-12h8v12h-9','none','#d1bea0',3)+flower(32,42,.5,'#d8b6c4'),
 ()=>e(32,54,29,7,'#bfc5ae')+repeat(6,j=>at(cup(['#adc9b7','#cab7d0','#dbc09c'][j%3]),4+j%3*19,2+Math.floor(j/3)*25,.34)),
 ()=>e(32,55,29,5,'#c3bba0')+repeat(4,j=>at(p('M-12-3h24q-2 16-12 17Q-10 13-12-3z',['#b6cdbb','#c7b5d2','#dfc7a1','#a8c9d1'][j])+e(0,-3,12,4,'#e6d9bb')+flower(0,4,.3,'#d1a9be'),17+j%2*30,23+Math.floor(j/2)*24)),
 ()=>p('M6 26h52q-2 29-26 31Q8 53 6 26z','#b6cdbc')+e(32,26,26,7,'#e5d6b6')+e(32,26,19,4,'#cdb5cb')+repeat(3,j=>c(23+j*9,25,3,'#efdfbe'))+flower(32,42,.6,'#d7b3c4')+p('M14 53h36','none','#c0b294',2)
][n]();
case 'snow':return [
 ()=>p('M32 6v13','none','#d2c6a7',2)+c(32,7,4,'none')+flake(32,38,.89)+p('M21 59h22','none','#bed6d0',1.8),
 ()=>e(32,57,29,4,'#b9c6b3')+fir(45,30,.9)+snowman(21,36,.62)+p('M7 53q18-7 46 0','none','#ecedd8',2.8),
 ()=>p('M12 19h40v32H12z','#b7d4d39a')+p('M8 19l24-14 24 14z','#b7bfd0')+p('M9 53h46m-31 0v7m15-7v7','none','#d8c4a1',3)+flake(32,34,.56)+c(32,34,3,'#e8d9a6'),
 ()=>r(4,18,56,39,'#b5c2b899',3)+repeat(4,j=>at(fir(0,0,.29,['#adcab6','#c5b9d0','#d4c3a0','#aacad0'][j]),12+j*13,37))+p('M5 50h54M9 15h46','none','#e3d6b8',2.5),
 ()=>c(32,34,23,'#a9cdd1')+c(32,34,15,'#30495e')+repeat(6,j=>flake(32+Math.cos(j*Math.PI/3)*21,34+Math.sin(j*Math.PI/3)*21,.19))+p('M25 10l7 9 7-9','none','#d2b4cb',4),
 ()=>c(32,29,23,'#b4d6d49a')+snowman(32,31,.61)+p('M14 50h36l5 9H9z','#c5b194')+p('M17 17q4-5 10-6','none','#e8eedc',1.8)+repeat(4,j=>c(18+j*9,24+(j%2)*12,1.2,'#e8eddd')),
 ()=>r(6,30,52,28,'#bad0c299',2)+r(12,5,40,25,'#c6c6d799',2)+snowman(32,20,.32)+fir(20,41,.43)+fir(45,41,.43)+p('M7 53h50m-43-25h36','none','#e5d8b8',2),
 ()=>p('M18 10h28l12 22-12 23H18L6 32z','#bddadea0')+flake(32,32,.72)+p('M15 58h34M32 6V1','none','#dbc5a2',3)+c(32,32,4,'#e8d5a4'),
 ()=>e(32,54,27,7,'#abcfd0a0')+c(23,39,10,'#dae7dc')+c(22,26,7,'#e9ecdb')+p('M20 26l5 2-5 2z','#d2b28b')+p('M40 51V31q-10-6-9-12 13 0 9 12m0 4q11-11 17-6-4 10-17 6','none','#b0cba1',2.5)+p('M13 53h20','none','#dce8d5',2)
][n]();
case 'lens':return [
 ()=>lensDisk(32,28,1.03,'#a9c6d2')+p('M32 52v7m-15 2h30','none','#c5c8ad',3)+p('M11 27h3m36 0h3','none','#e4cfa8',2.5),
 ()=>at(lensDisk(0,0,.75),19,32)+at(lensDisk(0,0,.75,'#aabbd5'),45,32)+p('M30 18h5m-5 28h5','none','#dfcba7',2.4),
 ()=>p('M13 16h35l8 11v18H13z','#a6bec8')+e(48,32,9,16,'#5e8398')+e(48,32,5,10,'#b9d8d1')+r(7,20,10,24,'#c5c9b1',1)+p('M18 22h17m-17 8h17m-17 8h17','none','#d8e5d2',1.6),
 ()=>telescope(32,24,.92),
 ()=>telescope(22,22,.68)+at(skyDisc(0,0,11),48,17)+r(33,39,26,18,'#b6b9cc',2)+p('M39 43h12m-12 5h8','none','#e1d1ae',1.5)+p('M7 57h21','none','#c9be9f',2),
 ()=>p('M8 9h18l4 43H4zM38 9h18l4 43H34z','#9cb8c8')+e(17,49,14,10,'#597f94')+e(47,49,14,10,'#597f94')+e(17,49,9,6,'#bedad2')+e(47,49,9,6,'#bedad2')+p('M26 23h12m-12 14h12','none','#d4c7a4',4)+c(32,30,4,'#b7cbb9'),
 ()=>telescope(30,23,1,'#b7b8d0')+p('M6 13q10-12 23-8m-18 13q13-10 20-7m9-6q11-8 20 1','none','#b5d6c5',2.2)+p('M10 58h42','none','#c6b596',3),
 ()=>p('M32 24v31m-18 6h36','none','#c5c7ab',3)+repeat(4,j=>at(lensDisk(0,0,.47,['#b2cfb7','#ccb7d3','#d6c9a4','#a6cdd1'][j]),19+j%2*26,16+Math.floor(j/2)*24))+p('M28 16h8m-8 24h8m-17-11h26','none','#dfc7a5',2),
 ()=>p('M6 52h52m-44 0v9m36-9v9','none','#cdbd9f',3)+telescope(24,23,.56,'#a9cbbf')+`<g transform="translate(64 0) scale(-1 1)">${telescope(24,23,.56,'#bebad3')}</g>`+p('M8 38h9v10H8m39-10h9v10h-9','none','#d8c6a4',2.2)+p('M31 8v9','none','#e3d6b5',1.6)
][n]();
case 'star':return [
 ()=>r(7,7,50,49,'#8799b4',1)+at(skyDisc(0,0,17),32,31)+flake(14,48,.2)+p('M14 12h27','none','#e4d4b5',1.6),
 ()=>r(5,7,54,50,'#bac2ce',1)+repeat(4,j=>`<g transform="translate(${18+j%2*28} ${20+Math.floor(j/2)*25}) rotate(${j*40})">${skyDisc(0,0,10)}</g>`),
 ()=>p('M7 10h50v45H7z','#8499b1')+p('M9 24q8-19 18-7 9 11 20-9m-37 29q11-18 25-8 10 5 19-7','none','#b4d5c6',3)+repeat(5,j=>c(15+j*8,42-(j%2)*7,1.7,'#e7d6b0'))+p('M13 50h38','none','#c6c7b7',1.2),
 ()=>closedBook(30,31,1.04,'#a2b2cb')+at(skyDisc(0,0,13),31,29)+p('M48 6v43','none','#e0c9a5',3)+p('M46 49l2 8 2-8z','#5c7d8d'),
 ()=>repeat(3,j=>p(`M${3+j*20} ${12+(j%2)*5}h18v40H${3+j*20}z`,['#94a9c4','#b7b3cd','#9ebebc'][j])+p(`M${7+j*20} ${32+(j%2)*3}l5-9 5 14`,'none','#dfd8bd',1.4)+c(12+j*20,21+(j%2)*5,2,'#edd8b1')),
 ()=>p('M5 11q14-7 27 0 14-7 27 0v43q-13-6-27 0-14-6-27 0z','#dcd1b5')+at(skyDisc(0,0,11),18,29)+p('M38 20q8-7 15 0m-15 9h14m-14 8h11','none','#8da9b0',1.6)+starLight(45,45,.52)+p('M32 12v42','none','#b9b89f',1.4),
 ()=>p('M6 8h52v47H6z','#9bacc4')+repeat(4,j=>at(skyDisc(0,0,9),19+j%2*26,20+Math.floor(j/2)*22))+p('M3 6h58m-58 51h58M32 57v5','none','#d9c29e',2.5),
 ()=>r(4,21,56,37,'#b5b29b')+repeat(6,j=>at(closedBook(0,0,.29,['#aec5b9','#c0b0cf','#cbbe9f'][j%3]),13+j%3*19,23+Math.floor(j/3)*22)+starLight(13+j%3*19,23+Math.floor(j/3)*22,.35))+p('M5 54h54','none','#e4caa6',1.8),
 ()=>p('M4 10q14-6 28 1 14-7 28-1v45q-14-6-28 1-14-7-28-1z','#b8c3d0')+at(skyDisc(0,0,12),18,30)+p('M38 44l5-18 12 8m-17 10l15 3','none','#e1d8b7',1.8)+repeat(3,j=>starLight(40+j*7,17+j%2*10,.32))+p('M32 12v44','none','#e3d0ad',1.5)
][n]();
case 'battery':return [
 ()=>batteryCell(32,30,.97)+r(14,49,36,11,'#a9b8ad',2)+p('M20 53h8m14 0h3','none','#e3d2af',2),
 ()=>r(4,41,56,17,'#bdbea4',2)+repeat(3,j=>batteryCell(14+j*18,26,.62,['#acc8b0','#b7bad0','#b4c9c1'][j]))+p('M10 53h44','none','#ded0ab',1.6),
 ()=>r(5,25,35,33,'#acbdaf',3)+r(11,33,23,13,'#628592',1)+batteryCell(50,32,.54,'#bdadca')+p('M38 20h12v8M22 13V5h20v9','none','#dcc8a7',2.3)+c(22,17,4,'#e2d4a1'),
 ()=>r(13,4,38,55,'#a4bbad',3)+repeat(3,j=>r(18,10+j*14,28,11,'#7394a1',1)+p(`M22 ${15+j*14}h13`,'none','#d9cfb0',1.5))+p('M17 57h30','none','#d8be99',2),
 ()=>r(5,24,54,33,'#9fb9af',4)+r(12,31,29,16,'#bdd1bd',2)+p('M17 39h8m-4-4v8M7 19h22l8-10h17v12','none','#ddc9a4',2.3)+c(52,31,5,'#e5d8a8')+p('M12 52h39','none','#c6c0a3',1.5),
 ()=>r(5,13,54,44,'#adc0b0',3)+batteryCell(21,35,.6,'#b9cdb7')+batteryCell(44,35,.6,'#afc2cd')+p('M24 13V5h16v8m-8 1v40','none','#dfc8a2',2.5),
 ()=>r(3,18,58,40,'#a9b8a8',2)+repeat(6,j=>batteryCell(13+j%3*19,24+Math.floor(j/3)*22,.34,['#adccb2','#bcb5d0','#b7cbd1'][j%3]))+p('M5 52h54','none','#e3cda6',1.8),
 ()=>r(5,10,54,47,'#a6bcb0',5)+r(11,17,30,14,'#648b9b',2)+p('M15 26l5-5 6 6 7-5','none','#c6ddc5',1.6)+c(49,24,5,'#d9c398')+repeat(3,j=>r(12+j*15,37,11,13,'#c4cfb7',1))+p('M8 54h48','none','#e2c9a4',2),
 ()=>p('M19 7h26l15 23-15 25H19L4 30z','#a8c7b5')+repeat(3,j=>e(32,22+j*10,15,5,['#d3d0ab','#b1d0bd','#c2b4cf'][j]))+p('M32 12v39M6 30h9m34 0h9m-39 26h26','none','#e3cda5',2)+p('M28 23l-4 10h8l-1 9 9-13h-8l3-6z','#e9d8b0')
][n]();
case 'beacon':return [
 ()=>p('M18 56l4-32h20l4 32z','#b5c6b7')+r(19,11,26,17,'#d7d3b1',1)+p('M16 10l16-8 16 8z','#bba5b8')+p('M13 58h38m-25-40v9m12-9v9','none','#dfcbaa',2)+c(32,21,5,'#ebdbaa'),
 ()=>p('M7 11h50m-25 0v47m-16 3h32','none','#c9c3a5',3)+repeat(3,j=>c(12+j*20,26,10,['#dcd0a5','#b6cdd0','#c9b6d3'][j])+c(12+j*20,26,6,'#e6e3c6')),
 ()=>beaconLens(32,29,.98)+p('M11 28H5v28h54V28h-6m-21 22v7','none','#cec4a3',3)+p('M15 9l-5-5m39 5l5-5','none','#deceae',1.7),
 ()=>p('M45 59V10H16v8m29 23h12m-12 9h12','none','#a8c1b6',3.2)+p('M8 18h18l-3 19H11z','#d6d2aa')+c(17,26,5,'#eadfb3')+p('M7 47h25l8 6-8 6H7z','#b1c3b5')+p('M13 53h14','none','#e4d5b2',2),
 ()=>p('M15 11h34l8 20-8 22H15L7 31z','#bad6c99a')+e(32,31,16,20,'#b6c2d090')+beaconLens(32,31,.54)+p('M11 31h7m28 0h7m-27-19v-8h12v8','none','#dac59f',2.6)+p('M16 57h32','none','#bcc7b1',3),
 ()=>p('M12 18l20-11 20 11v30l-20 11-20-11z','#bfd3bf90')+p('M12 18l20 10 20-10m-20 10v31m-10-37v30m20-30v30','none','#dbc49f',1.5)+p('M7 17l25-14 25 14z','#b3afc7')+c(32,35,7,'#eadbb0')+p('M11 60h42','none','#cbc7a7',3),
 ()=>p('M19 22h26v31H19z','#b4cdc09a')+e(32,22,13,5,'#d4c5a7')+e(32,53,13,5,'#c5bf9c')+p('M32 27v21','none','#e7d8b1',3)+p('M11 17q21-21 42 0m-2-8l2 8-8-1','none','#b9c1d0',2)+p('M17 59h30','none','#cbbc9b',3),
 ()=>p('M17 55l5-33h20l5 33z','#b8c9bc')+r(17,13,30,16,'#d5d2ae',1)+p('M14 12l18-10 18 10z','#afaac2')+c(32,21,6,'#eaddb2')+p('M4 19h9m38 0h9M5 33l9-5m36 0l9 5M8 59h48','none','#d7c7a2',2.2)+p('M23 45l9-8 9 8','none','#e5dbc0',2),
 ()=>p('M17 56l7-31h16l7 31z','#bcd2c0')+p('M21 38h22m-24 11h26','none','#adacc7',5)+r(21,14,22,15,'#e3d8ae',1)+p('M17 14l15-9 15 9z','#b2b6ce')+c(32,22,4,'#f2e4b8')+p('M7 22l11-3m28 0l11 3M2 59q7-6 14 0t14 0t14 0t14 0','none','#a9cecb',2)+p('M22 58h21','none','#e0caa6',2)
][n]();
default:return null;
}}
function shape(item,fallback){if(!palette[item.chain])return null;const s=body(item.chain,item.level)||fallback;if(!s)return null;return `<g data-ordinary-family="${item.chain}" fill="${palette[item.chain]}" stroke="${item.level<=3?palette[item.chain]:'#5d7380'}" stroke-width="1.8">${s}</g>`}
return{shape,body,lowBody,palette,revisedChains:Object.keys(palette)};
});
