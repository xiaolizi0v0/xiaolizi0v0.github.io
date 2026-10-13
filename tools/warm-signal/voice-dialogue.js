(function(root){'use strict';
// Shared by the inventory builder and UI: preserve narration and assign spoken quotes.
function prose(text,speaker,splitQuotes=false){
 const clean=String(text).trim();
 if(/^“[^”]+”[。！？]?$/.test(clean))return [{speaker,text:clean.replace(/^“|”[。！？]?$/g,'')}];
 if(!splitQuotes)return [{speaker:'旁白',text:clean}];
 const out=[];let end=0;
 for(const m of clean.matchAll(/“([^”]+)”/g)){if(m.index>end)out.push({speaker:'旁白',text:clean.slice(end,m.index)});out.push({speaker,text:m[1]});end=m.index+m[0].length;}
 if(end<clean.length)out.push({speaker:'旁白',text:clean.slice(end)});
 return out.filter(l=>/[\p{L}\p{N}]/u.test(l.text));
}
function celebration(name){return{title:'一起庆生',lines:[['旁白','你关上最后一串灯的开关，'+name+'推门走进亲手布置的房间。'],[name,'原来你说的那个小小计划，是为我准备了这么多。谢谢你，让我期待今天。'],['选择','把礼盒递给她时，你想说……','生日快乐。愿你一直做喜欢的自己。','生日快乐。愿以后的日子都有我们。'],['旁白','她打开礼盒，仔细读完你的祝福，又把盒盖轻轻合上。灯光落在两人的手上，这一页生日回忆，终于有了完整的落款。']]};}
const cottageCalls=['今天的风都像是在替我高兴，因为你回来了。','最想留在图纸上的，就是我们现在的样子。','你回来的这一拍，比我练过的都好听。','今天的好消息，是又可以和你一起吃饭。','今天想多做一份你喜欢的小点心。','不用拍下来，我也知道自己现在笑得很开心。'];
const cottageReplies=['这件家具，刚刚多了一段属于我们的回忆。','一起发现的小东西，也让今天变得不一样。','这个正好是我一直想留在家里的，谢谢你记得。','谢谢你想着我。只是这一份，我可能还不太习惯。','你挑的心意我收到了。一起放到家里吧。'];
const sleepReplies=['这一篇听完了。故事已经珍藏在夜话里，接下来就安心休息吧。','书签留在这里。困了就睡，下次我们继续。','计时开始了。你可以慢慢睡，到了时间再来珍藏这段陪伴。','时间已经记下来了。今晚不用为了完成目标而勉强自己。'];
const cityCamera='向导递来一台奶油色相机。有些瞬间不用摆姿势，也值得留下。';
const cityBike='租赁点的阿姨递来车钥匙。不赶时间的话，就沿着有花的路走吧。';
const liveEnd='谢谢你陪我到最后，下播后也想和你聊聊。',liveFallback='她努力接住了话题。下次，可以先听听她的想法。';
const petGreetings=['窗边新长出的叶子，好像也在和它打招呼。','这里多了一个小伙伴，图纸也变得有温度了。','它的小呼噜声，刚好可以当今天的伴奏。','这段日常，我想只写给我们。','小点心准备好了，晚饭也等你一起。','今天想拍一点，我们三个的生活。'];
const petInvites=['我带了新的猫草。今晚，一起看看它喜欢什么吧。','我想把这里的每一处，都变成舒服的样子。','刚刚在路上，忽然想到了我们三个的小调。','今天的新闻已经交稿了。现在的时间，留给你们。','给它准备了小点心，给你留了晚饭。','直播结束啦。今天的镜头，就留在我们家。'];
const petTogether='今天有你和它在，回家就变成了最期待的事。';
const walkEndings=['她回过头，说明天见面也不一定要找理由。','下一段街角，还有想和你一起看的风景。'];
const api={prose,celebration,cottageCalls,cottageReplies,sleepReplies,cityCamera,cityBike,liveEnd,liveFallback,petGreetings,petInvites,petTogether,walkEndings};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WarmVoiceDialogue=api;
})(typeof window==='undefined'?globalThis:window);
