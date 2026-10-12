(function(root){
  'use strict';
  const characters={
    me:{name:'姜予晴',age:25,role:'纪录片摄影师',color:'#e3b89b',bio:'在别人的剪辑里弄丢过自己的声音。现在想重新决定，相机应该朝向哪里。'},
    duan:{name:'段言',age:28,role:'现场音乐人',color:'#e5b66d',bio:'总先问别人需不需要帮忙，自己的巡演计划却迟迟没有说出口。'},
    su:{name:'苏时安',age:27,role:'品牌制作人',color:'#a8cfbf',bio:'会把复杂的事谈得很漂亮，也在学习不把每一次靠近都当作合作。'},
    gu:{name:'顾砚',age:30,role:'急诊医生',color:'#a5cce9',bio:'他的时间总是不完整。比起许诺，更习惯把眼前的一件小事做好。'},
    zhou:{name:'周嘉禾',age:25,role:'独立游戏开发者',color:'#dfab8f',bio:'把不敢讲的心事藏进未发布的版本，喜欢的人和喜欢的作品都不能替他作决定。'},
    xi:{name:'仲溪',age:29,role:'纪录片制片',color:'#cfb0df',bio:'予晴的前搭档。旧项目留下的裂痕没有消失，但她仍把这一次的相机交给了予晴。'},
    qiao:{name:'沈乔',age:25,role:'记者 · 你的好友',color:'#e7c5a5',bio:'会带你吃宵夜，也会认真问你，给朋友的素材能不能被公开使用。'},
    lin:{name:'林老师',age:66,role:'海声影院放映员',color:'#c5c6a3',bio:'予晴的外婆。放了四十年电影，最不喜欢别人替她配上悲伤的音乐。'},
    n:{name:'',role:'旁白',color:'#dce5e6'}
  };
  const chapters=[
    ['1','雨停之前','返城、试片与一份三十天的委托'],['2','一起把灯打开','一次小型展映，让各自的计划交汇'],
    ['3','镜头以外的人','那些未经允许，不能写进电影的生活'],['4','没有拍下来的那一晚','停电之后，选择先照顾什么'],
    ['5','体面和真心','粗剪、旧事，以及迟到的解释'],['6','留一张空椅子','试映之后，决定怎样靠近'],
    ['7','各自的远方','四条关系路线与独立事业线'],['8','彼此的日常','把喜欢放进真实的时间表'],
    ['9','我想要的生活','一个不能由别人替你做的决定'],['10','雨停之后','首映、告别与新的开始']
  ].map(([id,title,subtitle])=>({id,title,subtitle}));
  const scenes={};
  function scene(id,title,place,background,actors,script,options={}){
    const beats=script.trim().split('\n').filter(x=>x.trim()).map((row,i)=>{const split=row.indexOf('|');return{speaker:row.slice(0,split).trim(),text:row.slice(split+1).trim(),id:id+'-'+i};});
    scenes[id]={id,title,chapter:id.match(/^c(\d+)/)[1],place,background,actors,beats,...options};
  }
  root.AfterRainStory={characters,chapters,scenes,scene,first:'c1-arrival',title:'心动在雨停之后',version:1};
  if(typeof module!=='undefined')module.exports=root.AfterRainStory;
})(typeof window==='undefined'?globalThis:window);
