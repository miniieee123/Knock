(function(){
var ICON={
borrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
hand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V5a1.5 1.5 0 013 0v6M11 10V3.5a1.5 1.5 0 013 0V11M14 6a1.5 1.5 0 013 0v6M17 9a1.5 1.5 0 013 0v5a7 7 0 01-7 7h-1a6 6 0 01-5-3l-3-5a1.5 1.5 0 012.4-1.7L8 14"/></svg>',
skill:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/></svg>',
ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'};
var COL={borrow:'#FF4F12',hand:'#141414',skill:'#12A36B'};
var HOUSE=['#FFFFFF','#D9D9D4','#FF4F12','#B9B9B3','#EDEDE9','#8E8E88','#FFFFFF','#D9D9D4','#EDEDE9'];
var items=[
{t:'Ladder for 1 hour',cat:'borrow',who:'Meera',d:120},
{t:'Help carrying a sofa upstairs',cat:'hand',who:'Arjun',d:240},
{t:'Water my plants this weekend',cat:'hand',who:'Sana',d:90},
{t:'Borrow a drill for a shelf',cat:'borrow',who:'Ravi',d:180},
{t:'Quick help with a Python assignment',cat:'skill',who:'Nisha',d:150},
{t:'Cycle pump, just for today',cat:'borrow',who:'Dev',d:300}];
var SLOTS=[[0,0,90,'h',70],[1,0,80,'h',120],[2,0,90,'h',55],[0,1,80,'h',100],[1,1,0,'',0],[2,1,90,'h',85],[0,2,80,'h',60],[1,2,90,'h',110],[2,2,80,'h',75]];
var free=[0,1,2,3,5,6,7,8],sel=null,filter='all';
var $=function(s,r){return(r||document).querySelector(s)};
var spin=$('#spin'),world=$('#world'),stage=$('#stage'),grid=$('#grid'),cap=$('#caption'),toastEl=$('#toast'),tt;
function toast(m){toastEl.textContent=m;toastEl.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove('show')},2600)}
function face(cls,w,h,css){var f=document.createElement('div');f.className='f '+cls;f.style.cssText='width:'+w+'px;height:'+h+'px;'+css;return f}
function build(it,k){
  var s=SLOTS[it.slot],w=70,d=70,h=s[4]||60,x=s[0]*165-240+45,y=s[1]*165-240+45;
  var b=document.createElement('div');b.className='box';b.style.cssText='left:'+x+'px;top:'+y+'px;--c:'+HOUSE[it.slot%HOUSE.length];
  b.appendChild(face('t',w,d,'transform:translateZ('+h+'px)'));
  b.appendChild(face('fr',w,h,'top:'+d+'px;transform-origin:0 0;transform:rotateX(90deg)'));
  b.appendChild(face('bk',w,h,'top:0;transform-origin:0 0;transform:rotateX(90deg)'));
  b.appendChild(face('lf',d,h,'left:0;top:0;transform-origin:0 0;transform:rotateZ(90deg) rotateX(90deg)'));
  b.appendChild(face('rt',d,h,'left:'+w+'px;top:0;transform-origin:0 0;transform:rotateZ(90deg) rotateX(90deg)'));
  var p=document.createElement('button');p.className='pin';p.style.cssText='left:'+w/2+'px;top:'+d/2+'px;--z:'+(h+34)+'px';
  p.setAttribute('aria-label',it.t+', '+it.who);p.innerHTML=ICON[it.done?'ok':it.cat];
  if(it.done)p.classList.add('done');if(it.id===sel)p.classList.add('on'),b.classList.add('sel');
  p.onclick=function(e){e.stopPropagation();pick(it.id)};
  b.appendChild(p);return b;
}
function render(){
  spin.querySelectorAll('.box').forEach(function(n){n.remove()});
  items.forEach(function(it,k){spin.appendChild(build(it,k))});
  grid.innerHTML='';
  items.forEach(function(it){
    if(filter!=='all'&&it.cat!==filter)return;
    var c=document.createElement('article');c.className='card'+(it.id===sel?' on':'');
    c.innerHTML='<div class="ic" style="--bgc:'+COL[it.cat]+'">'+ICON[it.cat]+'</div><div><h3></h3><small>'+it.who+', '+it.d+' m away</small></div><div class="foot"><span></span><button class="help"></button></div>';
    $('h3',c).textContent=it.t;
    var b=$('.help',c);b.textContent=it.done?'On my way':'I can help';b.disabled=!!it.done;
    b.onclick=function(e){e.stopPropagation();help(it.id)};
    c.onclick=function(){pick(it.id);stage.scrollIntoView({behavior:'smooth',block:'center'})};
    grid.appendChild(c);
  });
  var s=items.filter(function(i){return i.id===sel})[0];
  if(s){cap.innerHTML='<div><span></span><button class="help"></button></div>';
    $('span',cap).textContent=s.who+': '+s.t;
    var b=$('button',cap);b.textContent=s.done?'On my way':'I can help';b.disabled=!!s.done;b.onclick=function(){help(s.id)};
    cap.firstChild.firstChild.style.cssText='box-shadow:none;padding:0;background:none';
  }else cap.innerHTML='<span>Drag to spin the street</span>';
  var tr=$('#track');if(!tr.dataset.n||tr.dataset.n!=items.length){
    var h=items.map(function(i){return'<span>'+i.t.replace(/</g,'&lt;')+'</span>'}).join('');tr.innerHTML=h+h;tr.dataset.n=items.length}
}
function pick(id){sel=sel===id?null:id;render()}
function help(id){var it=items.filter(function(i){return i.id===id})[0];it.done=true;toast(it.who+' has been told you are on your way.');render()}
items.forEach(function(it,i){it.id=i+1;it.slot=free[i]});
free=[4];
var nid=items.length+1;
document.querySelectorAll('.chip').forEach(function(c){c.onclick=function(){filter=c.dataset.f;document.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed',x===c)});render()}});
var dlg=$('#dlg');
document.querySelectorAll('[data-open]').forEach(function(b){b.onclick=function(){dlg.showModal();$('#t').focus()}});
$('[data-close]').onclick=function(){dlg.close()};
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
$('#form').onsubmit=function(e){
  e.preventDefault();
  var slot=free.length?free.shift():Math.floor(Math.random()*9);if(slot===4)slot=free.length?free.shift():0;
  var it={id:nid++,t:$('#t').value.trim(),cat:$('#c').value,who:$('#n').value.trim(),d:60+Math.round(Math.random()*20)*10,slot:slot};
  items.unshift(it);sel=it.id;filter='all';
  document.querySelectorAll('.chip').forEach(function(c){c.setAttribute('aria-pressed',c.dataset.f==='all')});
  e.target.reset();dlg.close();render();toast('Posted. Neighbours nearby can see it now.');
  stage.scrollIntoView({behavior:'smooth',block:'center'});
};
/* rotation */
var a=30,vel=.12,drag=false,lx=0,hover=false,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function size(){world.style.setProperty('--s',Math.min(stage.clientWidth/640,stage.clientHeight/520).toFixed(3))}
size();addEventListener('resize',size);
stage.addEventListener('pointerdown',function(e){drag=true;lx=e.clientX});
addEventListener('pointerup',function(){drag=false});
addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-lx;lx=e.clientX;a+=dx*.45;vel=dx*.06});
stage.addEventListener('mouseenter',function(){hover=true});stage.addEventListener('mouseleave',function(){hover=false;stage.querySelectorAll('.blob').forEach(function(b){b.style.transform=''})});
stage.addEventListener('mousemove',function(e){var r=stage.getBoundingClientRect(),mx=(e.clientX-r.left)/r.width-.5,my=(e.clientY-r.top)/r.height-.5;
  stage.querySelectorAll('.blob').forEach(function(b){var d=+b.dataset.depth;b.style.transform='translate('+mx*d+'px,'+my*d+'px)'})});
(function loop(){
  if(!reduce){if(!drag){vel+=((hover||sel?0:.12)-vel)*.04;a+=vel}}
  world.style.setProperty('--a',a.toFixed(2));spin.style.setProperty('--a',a.toFixed(2));
  requestAnimationFrame(loop)})();
render();
})();
