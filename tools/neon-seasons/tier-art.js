(function(root,factory){const a=factory();if(typeof module==='object'&&module.exports)module.exports=a;else root.NSTier=a})(typeof window==='undefined'?globalThis:window,()=>{
'use strict';
const place=(shape,x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})">${shape}</g>`;
const low={
 screw:'<path d="M16 12l12-7 7 12-10 9zM28 20l24 27-8 7-25-28z"/><path d="M31 30l8-7m-2 15l8-7m-1 15l8-7" stroke="#d6e7ef"/>',
 driver:'<path d="M17 6l13 11-7 8L9 14zM25 20l27 28-4 5-28-27z"/><path d="M50 49l5 6m-43-43l10 9" fill="none" stroke="#d8e4ed"/>',
 seed:'<ellipse cx="32" cy="36" rx="13" ry="19" transform="rotate(35 32 36)"/><path d="M22 48q6-12 19-22" fill="none" stroke="#eff7ba"/>',
 sprout:'<path d="M31 52V26M31 35q-23 1-21-17 21-1 21 17M32 27Q33 8 53 12q1 18-21 15"/><ellipse cx="31" cy="54" rx="18" ry="4" fill="#37475f"/>',
 chip:'<path d="M20 20l24-8 8 17-14 12-25-5zM11 48l15-8 10 12-17 4z"/><path d="M20 26l22-8m-22 9l16 10" fill="none"/>',
 plank:'<path d="M13 17l29-7 12 31-29 13z"/><path d="M21 18l8 31m3-34l9 27m-13-20q13-7 8 5" fill="none" stroke="#cbbb98"/>',
 board:'<path d="M9 29l33-14 15 12-33 14zM10 39l33-14 14 12-33 14zM12 48l31-13 14 12-31 13z"/><path d="M20 31l25-11m-22 21l24-11m-22 20l23-11" fill="none"/>',
 thread:'<path d="M10 46q24-34 28-23t-20 6q-5-15 17-19 27-5 11 35" fill="none" stroke-width="4"/><path d="M42 50l14-17" stroke="#e8ead6" stroke-width="3"/>',
 yarn:'<circle cx="32" cy="32" r="23"/><path d="M13 24q24-6 37 14M18 15q28 8 32 31M10 35q23-1 33 17M28 9q-15 22-4 43M39 10q-20 18-12 46M32 51q6 7 22 3" fill="none" stroke="#eee8cb"/>',
 roll:'<path d="M14 18h32l9 34H14z"/><ellipse cx="14" cy="35" rx="8" ry="18"/><ellipse cx="14" cy="35" rx="3" ry="8" fill="#172536"/><path d="M24 18l8 34m6-34l8 34" fill="none"/>',
 bean:'<ellipse cx="25" cy="27" rx="12" ry="19" transform="rotate(35 25 27)"/><ellipse cx="42" cy="42" rx="10" ry="15" transform="rotate(-20 42 42)"/><path d="M17 39q13-9 13-25m13 15q-8 13 2 26" fill="none" stroke="#d8dfb7"/>',
 bag:'<path d="M17 9h30l-5 11 11 33q-21 12-43 0l13-33z"/><path d="M22 20h20M19 8h26" stroke="#edf3dc"/><circle cx="32" cy="40" r="10" fill="#fff3"/>',
 dough:'<path d="M11 43C2 23 21 17 25 20c7-11 23-7 27 5 16 27-22 42-41 18z"/><path d="M15 39q16 14 32 0" fill="none" stroke="#f7deb2"/>',
 cookie:'<circle cx="32" cy="32" r="25"/><path d="M17 24l6-4 3 5-6 4zm23-5l5 6-4 4-5-6zm-14 21l7-1 1 6-7 1zm17 0l5 5-3 4-5-5z" fill="#2e253b"/><circle cx="15" cy="40" r="2" fill="#f0c777"/>',
 coil:'<path d="M17 8q25-5 25 5t-25 8 25 8-25 8 25 8-25 8" fill="none" stroke-width="5"/><path d="M18 8l-8 5m32 35l12 8" fill="none"/>',
 solder:'<path d="M11 22h35v24H11z"/><ellipse cx="46" cy="34" rx="8" ry="15"/><ellipse cx="46" cy="34" rx="3" ry="7" fill="#152638"/><path d="M17 26h21m-21 6h21m-21 6h21m-21 6h21M47 48q0 12 12 8" fill="none"/>',
 note:'<path d="M12 8h34l9 11v37H12z"/><path d="M46 8v13h9" fill="#fff4"/><path d="M24 39V23l18-5v19" fill="none" stroke="#172436" stroke-width="3"/><ellipse cx="20" cy="41" rx="6" ry="4" fill="#172436"/><ellipse cx="38" cy="38" rx="6" ry="4" fill="#172436"/>',
 fragment:'<path d="M17 14l21-9 6 19 14 17-23 17-13-13-17-3z"/><path d="M17 14l18 24 9-14M35 38L22 45" fill="none" stroke="#e4eeff"/>',
 stone:'<path d="M12 22q12-18 31-10 23 10 9 30-13 20-32 8-17-9-8-28z"/><path d="M18 25q5-9 16-9" fill="none" stroke="#ffffff99" stroke-width="4"/>',
 pick:'<path d="M10 15q19-19 43 0 5 19-20 43Q8 43 10 15z"/><path d="M20 17q10-7 24 0" fill="none" stroke="#e7e2ff"/>',
 harmonica:'<path d="M8 25l45-9 5 22-45 9z"/><path d="M14 27l3 12m4-14l3 12m4-14l3 12m4-13l3 12m4-14l3 12m4-13l3 12" fill="none" stroke="#192433" stroke-width="4"/>',
 drum:'<path d="M10 22v25q23 19 44 0V22"/><ellipse cx="32" cy="22" rx="22" ry="12" fill="#e5dcc4"/><path d="M15 32l9 17 8-13 10 19 10-18M8 10l45 13m4-15L12 25" fill="none"/>',
 ribbon:'<path d="M6 24l44-7-5 16-39 8zM27 35l25-8 6 13-25 8z"/><path d="M16 30l20-4m1 15l12-4" fill="none" stroke="#fff8"/>',
 filament:'<path d="M14 10v44m36-44v44M16 29l7-7 7 16 7-16 10 9" fill="none" stroke-width="4"/><path d="M10 55h8m28 0h8"/>',
 bulb:'<path d="M23 43C3 29 15 8 31 8s30 23 10 35v13H23z"/><path d="M24 47h15m-15 5h15M25 22l7 18 7-18" fill="none" stroke="#e8f8ce"/>',
 sugar:'<path d="M12 20l18-10 19 11v22L30 54 12 43z"/><path d="M12 20l18 11 19-10M30 31v23" fill="none" stroke="#edf7fb"/>',
 jar:'<path d="M18 15h28v37q-15 9-28 0z"/><path d="M16 9h32v8H16z" fill="#9ba8b4"/><path d="M19 30h26v16H19z" fill="#fff4"/>',
 leaf:'<path d="M32 48C0 37 6 7 37 13q10 27-5 35zM32 48q-4-25 26-35 7 23-26 35z"/><path d="M14 21l19 32 16-30" fill="none" stroke="#effacd"/>',
 tile:'<path d="M12 15h40v38H12z"/><path d="M15 27h34m-34 13h34M24 17v34m14-34v34" fill="none" stroke="#edf7fb"/>',
 blade:'<path d="M31 30C5 40 4 21 21 8q16 8 10 22zM34 31c-7-28 18-31 24-9-7 16-15 15-24 9zM31 36c27 7 18 30-4 22-9-14-7-20 4-22z"/><circle cx="32" cy="32" r="5" fill="#eef7d9"/>',
 page:'<path d="M12 9h27l14 13v33H12z"/><path d="M39 9v15h14M19 30h26m-26 9h26m-26 9h18" fill="none" stroke="#dcefe9"/>',
 pages:'<path d="M17 8h33v41H17zM11 15h33v40H11z"/><path d="M17 28h20m-20 9h20m-20 9h14" fill="none" stroke="#e0eee6"/>',
 drop:'<path d="M32 7C22 25 9 28 11 41c5 25 42 23 44 0C55 28 41 20 32 7z"/><path d="M21 37q-7 13 9 17" fill="none" stroke="#fff9" stroke-width="3"/>',
 bookmark:'<path d="M23 7h23v50L35 46 23 57z"/><path d="M17 12h6M18 51h5M30 16h10m-10 8h10" fill="none"/>',
 spoon:'<ellipse cx="40" cy="16" rx="12" ry="10" transform="rotate(-40 40 16)"/><path d="M32 24L11 50q-3 8 5 7l24-28"/><path d="M39 11l6 3" fill="none" stroke="#e6dfb4"/>',
 veggies:'<path d="M13 32l14-12 12 10-13 14zM36 37l14-10 9 12-13 14zM9 48l10-8 11 10-12 10z"/><path d="M16 16l7-6 8 7-8 6z"/>',
 film:'<path d="M12 9h40v46H12z" fill="#1d2538"/><path d="M19 17h26v12H19zm0 19h26v12H19z"/><path d="M13 13h4m-4 9h4m-4 9h4m-4 9h4m-4 9h4m29-36h4m-4 9h4m-4 9h4m-4 9h4m-4 9h4" stroke="#edf4ff"/>',
 pole:'<path d="M25 6h12v48H25zM16 54h30v6H16z"/><path d="M31 11v38" stroke="#e5eefc"/>',
 pedestal:'<path d="M8 27l24-13 25 13-25 14zM9 28v21l23 13 25-13V28"/><path d="M32 41v21M16 24l16-8 16 8" fill="none"/>',
 dial:'<circle cx="32" cy="32" r="25"/><circle cx="32" cy="32" r="20" fill="#182438"/><path d="M32 13v5m0 28v5m-19-19h5m28 0h5M32 21v12l11 6" fill="none" stroke="#e7f6bc" stroke-width="3"/>',
 match:'<path d="M17 45l23-32 5 4-23 33zM25 56l21-31 6 4-21 31z"/><ellipse cx="43" cy="14" rx="5" ry="7" fill="#f4ae87"/><ellipse cx="49" cy="26" rx="5" ry="7" fill="#f4ae87"/>',
 snowman:'<circle cx="32" cy="42" r="18" fill="#e5f4ff"/><circle cx="32" cy="20" r="12" fill="#e5f4ff"/><path d="M21 10h24v4H21zm5-8h15v9H26" fill="#304c66"/><path d="M34 20l11 3-11 3" fill="#efa987"/><circle cx="28" cy="19" r="2" fill="#1b2837"/><path d="M24 32h18m-33 7l7 4m32-3l10-8" fill="none" stroke="#bd9bff" stroke-width="4"/>',
 lens:'<circle cx="30" cy="28" r="21" fill="#83d9ff44"/><circle cx="30" cy="28" r="17" fill="#1b2d41"/><path d="M22 18q11-6 19 6M45 43l11 13" fill="none" stroke="#dcf7ff" stroke-width="5"/>',
 cell:'<path d="M24 10h16v44H24zM27 5h10v6H27z"/><path d="M26 18h12v10H26z" fill="#e7f9df"/><path d="M29 34h6m-3-3v6" stroke="#f2ffd4"/>',
 reflector:'<path d="M9 20l21-12 25 20-18 27z" fill="#a6daf455"/><path d="M15 23l24 23M22 15l25 23" fill="none" stroke="#e1f7ff"/>'
};
const first={tool:['screw','driver'],wood:['chip','plank','board'],cloth:['thread','yarn','roll'],flower:['seed','sprout'],tea:['seed','leaf','bag'],fruit:['seed','stone'],coffee:['bean','bag'],pastry:['bag','dough','cookie'],circuit:['coil','solder'],vinyl:['note','film'],rope:['coil','coil'],shell:['stone','stone'],glass:['fragment','stone'],music:['pick','harmonica','drum'],banner:['ribbon','ribbon'],lamp:['filament','bulb'],soda:['sugar','jar'],float:['fragment','cell','pedestal'],solar:['tile','tile'],fan:['blade','blade'],paper:['fragment','pages','page'],ink:['bag','drop'],book:['page','bookmark'],pan:['screw','spoon'],soup:['leaf','veggies'],table:['fragment','roll','pages'],photo:['fragment','film'],display:['screw','pole','pedestal'],signal:['tile','reflector'],map:['fragment','note'],gear:['chip','dial'],clock:['filament','dial'],scarf:['thread','yarn'],fire:['stone','match'],ceramic:['stone','dough'],snow:['fragment',null,'snowman'],lens:['fragment','reflector','lens'],star:['note','page'],battery:['tile','cell'],beacon:['reflector','lens'],nightdrink:['leaf','jar'],nightmusic:['note','drum']};
function shape(icon,chain,level,max,base){
 const code=first[chain]?.[level-1];if(code&&low[code])return level===2?place(low[code],4,4,.87)+'<path d="M48 8l3 4 5 1-4 3 1 5-5-3-4 3 1-5-4-3 5-1z" fill="#d7f8e2"/>':low[code];
 if(level<=3){return level===1?place(base,8,8,.74):level===2?place(base,5,5,.83):base}
 const emblem=place(base,17,12,.47),small=place(base,21,18,.33);
 if(max===6){if(level===4)return '<path d="M10 21l22-13 22 13v28L32 60 10 49z"/><path d="M10 21l22 12 22-12M32 33v27" fill="none"/>'+place(base,17,17,.46);if(level===5)return '<path d="M8 49h48v8H8zM18 19h28l6 30H12z" fill="#233449"/><circle cx="32" cy="28" r="22" fill="#ffffff10"/>'+place(base,7,0,.78);return '<path d="M32 2l26 13v32L32 62 6 47V15z" fill="#ffffff15"/><path d="M12 43l20 11 20-11M12 18l20-10 20 10" fill="none" stroke-width="3"/>'+place(base,8,1,.75)}
 if(level===4)return '<path d="M10 41l12-4h23l10 7-7 12H17z" fill="#293c50"/>'+place(base,0,-5,.62)+place(base,28,5,.45);
 if(level===5)return '<path d="M8 26l12-13h24l12 13v29H8z" fill="#2c4059"/><path d="M9 27h46M16 12q16-8 32 0M14 49h36" fill="none"/>'+emblem;
 if(level===6)return '<path d="M9 48h47v8H9zM15 12h34v36H15z" fill="#2b3f54"/><path d="M20 18h24v23H20z" fill="#ffffff18"/>'+place(base,17,9,.47)+'<path d="M17 53h7m16 0h8" stroke="#edfbe6"/>';
 if(level===7)return '<path d="M9 18h42v29H9zM9 18l-4-7H1M11 50h41" fill="#2b3c52"/><circle cx="17" cy="55" r="5" fill="#ccd9e8"/><circle cx="45" cy="55" r="5" fill="#ccd9e8"/>'+place(base,13,11,.44)+'<path d="M38 28h9m-9 9h9" stroke="#ebf8de"/>';
 if(level===8)return '<path d="M7 8h50v49H7z" fill="#24364b"/><path d="M9 27h46M9 43h46M12 57v5m40-5v5" fill="none" stroke-width="3"/>'+place(base,11,3,.35)+place(base,31,24,.35)+'<path d="M39 12h11v9H39zm-25 20h12v8H14z" fill="#d3e8c966"/>';
 if(level===9)return '<path d="M6 41h53v13H6zM10 17h23v24H10zM39 12h15v29H39z" fill="#293c53"/><path d="M12 54v8m42-8v8M42 20h9m-9 7h9" fill="none"/>'+place(base,13,18,.31)+'<circle cx="45" cy="46" r="4" fill="#e8f6c8"/>';
 if(level===10)return '<path d="M5 28l26-17 28 17v30H5z" fill="#243850"/><path d="M3 27l28-19 30 19M10 35h45M9 57h47" fill="none" stroke-width="3"/><path d="M10 29h45v10H10z"/><path d="M11 42h12v10H11zm30 0h12v10H41z" fill="#f2edbd"/>'+place(base,22,2,.28)+'<path d="M28 43h9v16h-9z" fill="#121e2c"/>';
 if(level===11)return '<path d="M3 48l28-17 30 17-29 16z" fill="#213a50"/><path d="M6 20l13-7 13 7v29l-13 8-13-8zM35 25l12-8 13 8v25l-13 8-12-8z" fill="#344b64"/><path d="M12 25h12v9H12zm29 5h12v9H41z" fill="#edebc1"/><path d="M26 33l9-5 9 5v23l-9 6-9-6z"/>'+place(base,5,10,.38)+'<path d="M4 14l16-8 16 8m-4 10l15-9 16 9" fill="none"/>';
 return '<path d="M2 48l30-17 30 17-30 16z" fill="#1c3448"/><path d="M14 23l18-12 19 12v30L32 63 14 53z" fill="#324a64"/><path d="M9 22l23-19 24 19-24 14z"/><path d="M32 35v25M20 39v8m22-9v8" stroke="#eafaaf" stroke-width="3"/>'+place(base,18,2,.43)+'<path d="M4 36v15m-3-11l7-4m46 1v14m-4-9l9-4" fill="none" stroke-width="3"/><circle cx="4" cy="32" r="6"/><circle cx="58" cy="33" r="5"/>';
}
return{shape};
});
