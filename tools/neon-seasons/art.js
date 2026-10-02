(()=>{'use strict';
const shapes={
 tool:'<path d="M42 10a12 12 0 0 0-15 15L10 42a7 7 0 0 0 10 10l17-17a12 12 0 0 0 15-15l-9 7-7-7z"/><circle cx="16" cy="47" r="2" fill="#182130"/>',
 wood:'<path d="M11 14l35-4 9 39-35 5z"/><path d="M24 17l8 30M36 17l7 27M15 26l34-4" fill="none"/>',
 cloth:'<path d="M12 15q8-8 18-3l21 6-6 35q-12-6-30 0l4-31z"/><path d="M24 16l-2 29M36 20l-4 26M15 39l30 3" fill="none" stroke-dasharray="3 3"/>',
 flower:'<path d="M32 54V31m0 15q-18-4-16-13 14 0 16 13m0-3q16-8 17-15-13 2-17 15" fill="none"/><path d="M32 31c-20 0-18-13-8-13-6-15 10-19 12-8 13-8 20 7 10 13 10 10-4 17-14 8z"/><circle cx="33" cy="23" r="6" fill="#fff0b0"/>',
 leaf:'<path d="M11 42Q10 10 53 10q0 43-29 42z"/><path d="M18 47l27-28m-17 6l4 8 10 3" fill="none"/>',
 fruit:'<path d="M31 20C9 7 6 29 20 49q12 15 25-3C64 24 45 9 31 20z"/><path d="M32 19q0-13 12-11l-9 13" fill="none"/><path d="M21 27q-9 11 1 17" fill="none" stroke="#fff9"/>',
 cup:'<path d="M11 25h34l-4 23q-13 10-26-1z"/><path d="M44 28q21-3 9 16h-11M16 56h29M21 9l-3 10m15-10l-3 10" fill="none"/>',
 cake:'<path d="M9 30h45v20H9zM14 20h36v11H14z"/><path d="M11 36q8 10 15 0 8 10 15 0 8 10 13 0" fill="none"/><path d="M32 20V9"/><circle cx="32" cy="8" r="3" fill="#ffe0a7"/>',
 circuit:'<rect x="11" y="11" width="42" height="42" rx="7"/><rect x="25" y="23" width="15" height="18" rx="2" fill="#182130"/><path d="M17 20h9m14 9h8M19 46V34h6M36 13v9M31 41v9" fill="none"/>',
 disc:'<circle cx="32" cy="32" r="23" fill="#1d2535"/><circle cx="32" cy="32" r="12"/><circle cx="32" cy="32" r="3" fill="#fff"/><path d="M18 17l-5 9m33 12l-5 9" fill="none" stroke="#fff7"/>',
 anchor:'<path d="M32 12v39M11 35q3 18 21 18t21-18M23 25h18M11 35l-5 8m47-8l5 8" fill="none" stroke-width="5"/><circle cx="32" cy="11" r="6" fill="none"/>',
 shell:'<path d="M11 39C-1 12 26 5 32 18 40 1 67 21 53 41L40 54H25z"/><path d="M13 21l17 27m1-29l3 29m15-28L38 48" fill="none"/>',
 gem:'<path d="M17 10h30l12 17-27 30L5 27z"/><path d="M5 27h54M17 10l15 47 15-47M17 10l15 17L47 10" fill="none"/>',
 music:'<path d="M25 14l26-7v34q-3 13-13 9t5-15V18l-18 5v25q-3 12-14 7t6-16V17z"/>',
 flag:'<path d="M15 56V8m0 2q10-8 23 0t15 1v25q-14 8-23 1t-15-1"/><path d="M24 16l4 8-5 5m15-9l7 5" fill="none"/>',
 lamp:'<path d="M23 41C6 26 18 7 32 7s26 19 9 34z"/><path d="M23 42h18v10H23zM28 57h8M29 40l-4-15h14l-4 15" fill="none"/><path d="M5 14l5 4m45-4l-5 4" stroke="#fff"/>',
 bottle:'<path d="M24 9h16v15l10 10v19q-16 8-32 0V34l6-10z"/><path d="M22 35h24v12H22z" fill="#1a2938"/><circle cx="33" cy="41" r="4" fill="#fff9"/>',
 ring:'<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="12" fill="#182130"/><path d="M8 32h12m24 0h12M32 8v12m0 24v12" fill="none" stroke="#fff9" stroke-width="6"/>',
 solar:'<path d="M12 11h41l-5 33H7z"/><path d="M13 21h37M10 32h40M23 11l-4 33m17-33l-4 33M25 44v10m-9 0h28" fill="none"/>',
 fan:'<circle cx="32" cy="27" r="22" fill="none"/><path d="M32 27Q8 20 22 11q18-5 10 16Q53 9 53 27 50 43 32 27q1 27-15 17-12-13 15-17z"/><circle cx="32" cy="27" r="4" fill="#182130"/><path d="M32 49v9m-12 0h24" fill="none"/>',
 paper:'<path d="M16 8h25l12 13v34H16z"/><path d="M41 8v15h12M23 30h22m-22 9h22m-22 9h15" fill="none"/>',
 ink:'<path d="M18 24h29l7 27q-21 9-43 0zM21 15h23v9H21z"/><path d="M31 41q-8-10 1-15 9 8-1 15z" fill="#1a2433"/><path d="M46 28l10-17" fill="none"/>',
 book:'<path d="M7 13q15-6 25 2 13-8 25-2v39q-16-6-25 2-13-8-25-2z"/><path d="M32 15v39M14 24l12 2m12 0l12-2M14 35l12 2m12 0l12-2" fill="none"/>',
 pan:'<path d="M11 30h37l-4 19q-15 11-30 0z"/><path d="M11 31H5m43 0h12M15 24h27M23 18l-2-8m14 8l-2-8" fill="none"/>',
 bowl:'<path d="M7 31h50Q52 55 32 55T7 31z"/><ellipse cx="32" cy="30" rx="25" ry="7"/><path d="M21 10l-3 11m17-11l-3 11m15-8l-3 9" fill="none"/>',
 table:'<path d="M8 22h48v12H8zM13 34v22m38-22v22M26 15h13v7H26z"/><path d="M33 14V5" fill="none"/><circle cx="33" cy="6" r="3" fill="#fff0ad"/>',
 camera:'<rect x="7" y="21" width="50" height="33" rx="7"/><path d="M18 21l3-10h22l5 10z"/><circle cx="33" cy="37" r="12" fill="#182130"/><circle cx="33" cy="37" r="6" fill="#fff6"/>',
 shelf:'<path d="M10 10h44v45H10z"/><path d="M10 25h44M10 41h44M17 15v10m9-10v10m10-10v10M22 33l9 0v8M17 55v6m30-6v6" fill="none"/>',
 signal:'<path d="M25 9h18v39H25zM34 48v11M23 59h22"/><circle cx="34" cy="18" r="4" fill="#fff2ba"/><circle cx="34" cy="29" r="4" fill="#1d2d3f"/><circle cx="34" cy="40" r="4" fill="#9dffa0"/>',
 map:'<path d="M7 16l16-8 18 8 16-8v40l-16 8-18-8-16 8z"/><path d="M23 8v40m18-32v40M13 33l11-8 11 13 12-7" fill="none" stroke-dasharray="3 3"/>',
 gear:'<path d="M27 6h10l3 9 10-1 5 9-7 8 7 8-5 9-10-1-3 9H27l-3-9-10 1-5-9 7-8-7-8 5-9 10 1z"/><circle cx="32" cy="31" r="10" fill="#182130"/>',
 clock:'<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="18" fill="#182130"/><path d="M32 18v16l10 6M32 10v3m0 38v3M10 32h3m38 0h3" fill="none" stroke="#fff"/>',
 scarf:'<path d="M12 13h41v16H34v25H17V29h-5z"/><path d="M17 48h17m-17 6v5m6-5v5m6-5v5M13 20h40" fill="none" stroke="#fff9"/>',
 fire:'<path d="M34 7c2 17 13 13 8 27 9-7 12-7 15 4 4 27-48 30-48 3 0-10 10-11 13-25 7 5 5 9 7 14 6-4 5-17 5-23z"/><path d="M32 32q-15 20 0 22t0-22z" fill="#fff6b7"/>',
 pot:'<path d="M22 10h20v10q16 8 13 24-5 21-23 15T9 44q-3-16 13-24z"/><path d="M14 36q18 10 37 0M18 48l26 1" fill="none"/>',
 snow:'<path d="M32 7v50M10 19l44 26M10 45l44-26M25 11l7 7 7-7m-14 42l7-7 7 7M10 27l11-1-2-11m34 23l-11 1 2 11M10 37l11 1-2 11m34-22l-11-1 2-11" fill="none" stroke-width="4"/>',
 lens:'<path d="M12 34l29-22 12 15-30 24z"/><path d="M13 34l11 17M27 45l5 12 5-12M17 57h31" fill="none"/><ellipse cx="46" cy="19" rx="5" ry="9" transform="rotate(-38 46 19)" fill="#182130"/>',
 star:'<path d="M32 6l8 16 18 3-13 13 3 19-16-9-17 9 4-19L5 25l19-3z"/><path d="M32 17l4 11 12 2-10 8 2 13-8-8-9 8 3-13-10-8 12-2z" fill="#fff5"/>',
 battery:'<path d="M23 6h18v7H23zM16 13h32v44H16z"/><path d="M35 20L23 37h11l-5 14 13-19H31z" fill="#182130"/>',
 beacon:'<path d="M25 19h15l5 38H20zM21 19V9h23v10M20 8l12-6 14 6M15 58h35"/><path d="M30 24h8v7h-8zM26 39h15M3 13h12m35 0h11" fill="none"/>'
};
function icon(item){const d=NSContent.items[item.chain+':'+item.level]||NSContent.byChain[item.chain],level=item.level||1,color=d.color||'#47dff1',base=shapes[d.icon]||shapes.gem,fallback=NSTier.shape(d.icon,item.chain,level,d.max||12,base),shape=(typeof NSProducerArt!=='undefined'&&NSProducerArt.shape(item))||(typeof NSOrdinaryArt!=='undefined'&&NSOrdinaryArt.shape(item,fallback))||fallback;return `<svg viewBox="0 0 64 64" class="item-art" aria-hidden="true"><defs><linearGradient id="${d.icon}-${color.slice(1)}"><stop stop-color="${color}"/><stop offset="1" stop-color="#394e64"/></linearGradient></defs>${level>=7?'<path d="M4 14l28-11 28 11v38l-28 10L4 52z" fill="#ffffff0c" stroke="'+color+'66"/>':''}<g fill="url(#${d.icon}-${color.slice(1)})" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" transform="translate(${level>=7?7:0} ${level>=7?7:0}) scale(${level>=7?.78:1})">${shape}</g>${level>=4?`<path d="M49 3l3 5 6 1-4 4 1 6-6-3-5 3 1-6-4-4 6-1z" fill="${color}"/>`:''}</svg>`}
function avatar(index,large=false){if(typeof index==='string')index=NSContent.characters.findIndex(c=>c.id===index);if(!Number.isInteger(index)||index<0||index>=NSContent.characters.length)index=0;const c=NSContent.characters[index]||NSContent.characters[0];return `<span class="avatar ${large?'large':''}" style="--avatar-x:${(index%3)*50}%;--avatar-y:${index<3?0:100}%;--accent:${c.color}" aria-label="${c.name}"></span>`}
function building(area,stage,style=0){
 const a=NSContent.areas[area],color=style===1?NSContent.characters[a.npc].color:style===2?'#ff7ac7':NSContent.seasons[a.season].color,lit=stage>=3?'#fff0b6':'#516077',roof=stage>=2?color:'#495061';
 const props=[
  '<path d="M10 51h30v14H10z" fill="#5f819e"/><path d="M5 48l14-10 23 13" fill="'+roof+'"/><circle cx="52" cy="32" r="8" fill="'+lit+'"/><path d="M52 27v6l4 2M10 70h31" stroke="#26354d" stroke-width="2"/>',
  '<path d="M12 58l26-39 41 20-25 37z" fill="#9bdcc54a" stroke="'+color+'"/><path d="M24 54l29 13m-19-25l29 13M38 19l16 57" stroke="'+color+'"/><path d="M27 56l5-11 5 15m15 1l5-15 5 20" stroke="#b7e487" stroke-width="3"/>',
  '<path d="M15 47l24-9 12 7-24 12z" fill="'+color+'"/><path d="M19 44l13 9m-5-12l13 9m-5-12l13 9" stroke="#f1e4cf" stroke-width="4"/><ellipse cx="71" cy="71" rx="10" ry="5" fill="#bba17a"/><path d="M71 71v12m-12-9v7m24-11v8" stroke="#bba17a" stroke-width="2"/>',
  '<path d="M51 5v28m-6-11l6-6 6 6m-11-11l5-6 6 6" stroke="'+color+'" stroke-width="2"/><circle cx="49" cy="37" r="11" fill="#192d43"/><circle cx="49" cy="37" r="4" fill="'+color+'"/><path d="M45 37h8" stroke="'+lit+'"/>',
  '<path d="M2 67l31-13 32 18-31 16z" fill="#47dff130"/><path d="M8 69l26 14m-16-19l25 14m-15-19l23 13" stroke="#77cfed"/><path d="M8 55l15 5 14-6-5 15-12 4z" fill="'+roof+'"/><path d="M22 43v17l15-7z" fill="#e8e0b9"/>',
  '<path d="M8 41l40-22 41 23v11L48 76 8 53z" fill="#172437"/><path d="M8 41l40-22 41 23m-69 10l29-18 28 16" fill="none" stroke="'+color+'" stroke-width="3"/><path d="M17 46v14m61-13v14" stroke="'+lit+'" stroke-width="5"/><path d="M17 43l16 10m43-9L59 54" stroke="'+color+'88" stroke-width="8"/>',
  '<path d="M2 61l40-21 43 22-42 25z" fill="#47dff15c" stroke="#92eaff"/><path d="M13 63l31-15 28 16-30 17z" fill="#42bbde"/><ellipse cx="49" cy="61" rx="9" ry="5" fill="#ffe9a3"/><ellipse cx="49" cy="61" rx="4" ry="2" fill="#42bbde"/><path d="M83 34v29" stroke="#e6e5d2"/><path d="M68 36q14-17 29-2z" fill="'+roof+'"/>',
  '<path d="M18 30l23-14 18 10-22 14zM43 42l20-13 19 10-21 13z" fill="#326590" stroke="'+color+'"/><path d="M26 24l19 11m-12-15l19 11m1 4l19 9m-11-14l12 16" stroke="#acdfff" stroke-width="1"/><circle cx="43" cy="60" r="10" fill="#192639"/><path d="M43 50v20m-10-10h20" stroke="'+lit+'" stroke-width="3"/>',
  '<path d="M18 24h12v20H18z" fill="#3d5368"/><path d="M32 57l21-12 18 10-21 12z" fill="#26394e"/><path d="M43 44l18-7 6 6-18 9zM52 49l16-7 5 6-17 8z" fill="#ebd4b0"/><path d="M10 67l25-14 11 7-26 15z" fill="#ebd4b0"/><path d="M20 66l15-8" stroke="#7d707a"/>',
  '<path d="M54 21h13v21H54z" fill="#50495c"/><path d="M60 16q-5-7 0-11m7 13q7-7 3-12" fill="none" stroke="#aabbce"/><ellipse cx="33" cy="65" rx="13" ry="5" fill="#f0b182"/><path d="M21 64v7q12 8 24 0v-7" fill="#795753"/><path d="M26 61q-6-8 0-12m10 13q6-8 0-12" fill="none" stroke="#ece2cd"/>',
  '<path d="M24 48l19 11v15L24 63z" fill="#e5d9bf"/><path d="M27 51l13 8v10l-13-8z" fill="#986a8f"/><path d="M61 49l17-9v15l-17 9z" fill="#cfe4e5"/><path d="M64 51l11-6v8l-11 6z" fill="#587fb8"/><path d="M8 65l12 6v10l-12-6z" fill="'+color+'"/>',
  '<path d="M2 65l40 23m-28-30l41 23" stroke="#bcc7d1" stroke-width="3"/><path d="M8 61l1 12m14-5l1 12m12-5l1 11" stroke="#61788f" stroke-width="3"/><path d="M77 25v43" stroke="#909faf" stroke-width="3"/><path d="M72 24h11v23H72z" fill="#172336"/><circle cx="78" cy="30" r="3" fill="'+(stage>=3?'#c1ff35':'#67798d')+'"/><circle cx="78" cy="41" r="3" fill="#ffad79"/>',
  '<path d="M41 17l15-9 14 10v43L56 74 41 63z" fill="'+roof+'"/><path d="M37 18L55 1l18 17-17 10z" fill="'+color+'"/><circle cx="57" cy="36" r="9" fill="#e0eacb"/><path d="M57 30v7l5 2" stroke="#263649" stroke-width="2"/><path d="M47 59h17" stroke="'+lit+'" stroke-width="4"/>',
  '<path d="M54 14h13v22H54z" fill="#836568"/><path d="M57 12q-8-6-1-11m9 12q7-8 2-12" fill="none" stroke="#bdc9e3"/><path d="M14 39l35-24 38 22-36 22z" fill="#d4deeb66"/><path d="M21 57l12 7v12l-12-7z" fill="#eda978"/><path d="M22 66l6-7 3 11" fill="#ffdb92"/>',
  '<path d="M48 27l20-13 10 10-21 14z" fill="'+color+'"/><path d="M54 36l6 20 8-19m-17 19h25" stroke="#b9cbe0" stroke-width="3"/><path d="M10 15q17-15 35-4t43-8" stroke="#68e5cb66" fill="none" stroke-width="5"/><path d="M12 22l2-5 2 5m64-9l2-5 2 5" fill="#e2eefa"/>',
  '<path d="M41 23l18 8-7 43-18-8z" fill="#d2dce6"/><path d="M37 25V13l18-6 16 10v13L55 37z" fill="'+color+'"/><path d="M43 17l10 5v8l-10-5zM58 24l9-4v8l-9 4z" fill="'+lit+'"/><path d="M19 8l15 11m39 0l21-6M40 49l12 5m-14 7l12 5" stroke="'+color+'88" stroke-width="4"/>'
 ];
 const detail=stage>=2?props[area]:stage===1?'<path d="M8 68l29-19 30 20" stroke="#b8b29a" stroke-width="3" fill="none"/><path d="M16 58l17-5 12 8-17 5z" fill="'+color+'55"/>':'';
 return `<svg viewBox="0 0 100 90" class="building" aria-hidden="true"><ellipse cx="51" cy="76" rx="42" ry="9" fill="#0003"/><path d="M8 48l42-25 42 25-42 27z" fill="#353c52"/><path d="M20 41l31-18 31 18v25L51 83 20 65z" fill="${stage?'#384459':'#202532'}"/><path d="M51 49l31-18v35L51 83z" fill="#202c43"/><path d="M15 39l35-24 38 22-36 22z" fill="${roof}"/><path d="M27 50l14 8v12l-14-8zM60 52l13-7v13l-13 7z" fill="${lit}"/>${detail}${stage<2?'<path d="M12 71l14-19m40 25l13-20M26 68l31-36" stroke="#71798b" stroke-width="4"/>':''}${stage===4?'<path d="M8 62l-2-14m0 9l-4-4m84 18l4-18m-1 9l6-3" stroke="'+color+'" stroke-width="3"/><circle cx="6" cy="45" r="6" fill="'+color+'"/><circle cx="93" cy="50" r="7" fill="'+color+'"/>':''}</svg>`;
}
window.NSArt={icon,avatar,building};
})();
