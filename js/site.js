const ITEMS=[
  {id:'tee',name:'Sample tee',src:'assets/img/mock/tee.svg',dark:'assets/img/mock/tee-dark.svg',w:0.22,ar:1.0250,mock:1},
  {id:'hoodie',name:'Sample hoodie',src:'assets/img/mock/hoodie.svg',dark:'assets/img/mock/hoodie-dark.svg',w:0.22,ar:1.0610,mock:1},
  {id:'cap',name:'Sample cap',src:'assets/img/mock/cap.svg',dark:'assets/img/mock/cap-dark.svg',w:0.2,ar:0.6265,mock:1},
  {id:'shorts',name:'Sample shorts',src:'assets/img/mock/shorts.svg',dark:'assets/img/mock/shorts-dark.svg',w:0.22,ar:1.0075,mock:1},
  {id:'tote',name:'Sample tote',src:'assets/img/mock/tote.svg',dark:'assets/img/mock/tote-dark.svg',w:0.22,ar:1.2000,mock:1},
  {id:'bear',name:'Teddy bear',src:'assets/img/pile/bear.webp',dark:'assets/img/pile/bear-dark.webp',w:.24,ar:700/637},
  {id:'star',name:'Star',src:'assets/img/pile/star.webp',w:.22,ar:700/688},
  {id:'cs',name:'CS block',src:'assets/img/pile/cs.webp',w:.24,ar:451/700},
  {id:'official',name:'Official logo',src:'assets/img/pile/official.webp',w:.27,ar:382/700},
  {id:'graffiti',name:'Graffiti wordmark',src:'assets/img/pile/graffiti.webp',w:.42,ar:195/1000},
  {id:'csh003',name:'CSH003 fur hood hoodie',src:'assets/img/pile/csh003.webp',w:0.34,ar:1.1799,note:'Hoodie design. On the real site, this opens its product page.'},
  {id:'bagside',name:'Soleil backpack, side',src:'assets/img/pile/bagside.webp',w:.24,ar:1.6432,note:'Backpack design. On the real site, this opens its product page.'},
  {id:'bagfront',name:'Soleil backpack, front',src:'assets/img/pile/bagfront.webp',w:.26,ar:1.4523,note:'Backpack design. On the real site, this opens its product page.'},
  {id:'rabbit',name:'Rabbit sticker',src:'assets/img/pile/rabbit.webp',w:0.22,ar:1.0724},
  {id:'club',name:'Soleil Club sticker',src:'assets/img/pile/club.webp',w:0.3,ar:0.6154},
  {id:'runner',name:'Runner sticker',src:'assets/img/pile/runner.webp',w:0.3,ar:0.3782},
  {id:'eyeball',name:'Eyeball sticker',src:'assets/img/pile/eyeball.webp',w:0.22,ar:1.3261},
  {id:'skull',name:'Skull sticker',src:'assets/img/pile/skull.webp',w:0.21,ar:0.9468},
  {id:'ghost',name:'Ghost sticker',src:'assets/img/pile/ghost.webp',w:0.27,ar:0.4932},
  {id:'tag',name:'Graffiti tag sticker',src:'assets/img/pile/tag.webp',w:0.38,ar:0.2800},
  {id:'hoodiepink',name:'Pink hoodie, back',src:'assets/img/pile/hoodiepink.webp',w:.30,ar:0.9938,note:'Hoodie design. Not a final product photo.'},
  {id:'ilovecs',name:'I love CS sticker',src:'assets/img/pile/ilovecs.webp',dark:'assets/img/pile/ilovecs-dark.webp',w:.18,ar:1.2853},
  {id:'rhinestone',name:'Rhinestone SOLEIL',src:'assets/img/pile/rhinestone.webp',w:.40,ar:0.4244}
];
try{(window.MY_ITEMS||[]).forEach(x=>{if(x&&x.id&&x.src)ITEMS.push(Object.assign({w:.25,ar:1,name:x.id},x))})}catch(_){}
const NOTE='Stand-in for a product. On the real site, this opens the product page.';
const MOCKNOTE='Mock shape only. Your real product photo goes here.';
const stage=document.getElementById('stage');
const signup=document.getElementById('signup');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let z=10, els=[];
/* Pile piece size: desktop (wider than 900px) and phone/tablet. 1 = original phone size. */
const PILE_DESK=.38,PILE_PHONE=.75;
function unit(){const W=stage.clientWidth;return Math.min(W,760)*(W>900?PILE_DESK:PILE_PHONE)}
ITEMS.forEach(it=>{
  const b=document.createElement('button');
  b.type='button';b.className='item'+(it.dark?' has-dark':'');
  b.setAttribute('aria-label','Open '+it.name);
  b.innerHTML='<img class="light-src" src="'+it.src+'" alt="" draggable="false">'+(it.dark?'<img class="dark-src" src="'+it.dark+'" alt="" draggable="false">':'');
  b._it=it;b._x=0;b._y=0;b._r=0;b._vx=0;b._vy=0;
  stage.appendChild(b);els.push(b);bind(b);
});
function size(b){const w=Math.round(unit()*b._it.w);b.style.width=w+'px';b._w=w;b._h=w*b._it.ar}
function apply(b){b.style.transform='translate3d('+b._x+'px,'+b._y+'px,0) rotate('+b._r+'deg) scale('+(b._s||1)+')'}
function clamp(b){
  const W=stage.clientWidth,H=stage.clientHeight,ox=b._w*.3,oy=b._h*.15;
  b._x=Math.min(Math.max(b._x,-ox),W-b._w+ox);
  b._y=Math.min(Math.max(b._y,-oy),H-b._h+oy);
}
function scatter(){
  const W=stage.clientWidth,H=stage.clientHeight;
  const cw=Math.min(W*.96,1150),ch=Math.min(H*.94,cw*1.5,760);
  const x0=(W-cw)/2,y0=(H-ch)/2;
  const sb=signup.getBoundingClientRect(),st=stage.getBoundingClientRect();
  /* keep pieces off the sign-up box so the consent text stays readable; extra room covers the random tilt */
  const box={l:sb.left-st.left-18,t:sb.top-st.top-18,r:sb.right-st.left+18,b:sb.bottom-st.top+18};
  const placed=[];
  els.slice().sort(()=>Math.random()-.5).forEach(b=>{
    b._s=1;size(b);let best=null,bestScore=1e9;
    for(let k=0;k<60;k++){
      const x=x0+Math.random()*(cw-b._w),y=y0+Math.random()*(ch-b._h);
      const r={l:x,t:y,r:x+b._w,b:y+b._h};
      const ov=(p,q)=>Math.max(0,Math.min(p.r,q.r)-Math.max(p.l,q.l))*Math.max(0,Math.min(p.b,q.b)-Math.max(p.t,q.t));
      let s=ov(r,box)*60;placed.forEach(p=>s+=ov(r,p));
      if(s<bestScore){bestScore=s;best=r}
      if(s===0)break;
    }
    placed.push(best);b._x=best.l;b._y=best.t;b._r=(Math.random()-.5)*20;
    clamp(b);b.style.zIndex=++z;apply(b);
  });
}
/* Gestures: one finger drags, a second finger (anywhere on screen) rotates, resizes and moves */
const G={b:null,pts:new Map(),moved:false,two:false,sx:0,sy:0,bx:0,by:0,a0:0,r0:0,mx:0,my:0,lt:0,lx:0,ly:0,d0:1,s0:1};
const ang=(p,q)=>Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI;
function baseOne(){const p=[...G.pts.values()][0];G.sx=G.lx=p.x;G.sy=G.ly=p.y;G.bx=G.b._x;G.by=G.b._y;G.lt=performance.now();G.two=false}
function baseTwo(){const [p,q]=[...G.pts.values()];G.a0=ang(p,q);G.r0=G.b._r;G.d0=Math.hypot(q.x-p.x,q.y-p.y)||1;G.s0=G.b._s||1;G.mx=(p.x+q.x)/2;G.my=(p.y+q.y)/2;G.bx=G.b._x;G.by=G.b._y;G.two=true;G.moved=true}
function bind(b){
  b.addEventListener('pointerdown',e=>{
    if(G.b||(e.pointerType==='mouse'&&e.button!==0))return;
    G.b=b;G.pts.clear();G.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});G.moved=false;
    try{b.setPointerCapture(e.pointerId)}catch(_){}
    b._vx=b._vy=0;cancelAnimationFrame(b._raf);
    b.style.zIndex=++z;b.classList.add('held');baseOne();
  });
  b.addEventListener('click',e=>{if(e.detail===0)openSheet(b._it,b)});
  b.addEventListener('wheel',e=>{e.preventDefault();b._s=Math.min(3,Math.max(.4,(b._s||1)*Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015))));b.style.zIndex=++z;apply(b)},{passive:false});
}
document.addEventListener('pointerdown',e=>{
  if(!G.b||G.pts.has(e.pointerId)||G.pts.size>=2)return;
  e.stopPropagation();e.preventDefault();
  G.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});baseTwo();
},true);
document.addEventListener('pointermove',e=>{
  const b=G.b;if(!b||!G.pts.has(e.pointerId))return;
  G.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(G.two&&G.pts.size===2){
    const [p,q]=[...G.pts.values()];
    let d=ang(p,q)-G.a0;if(d>180)d-=360;if(d<-180)d+=360;
    b._r=G.r0+d;b._s=Math.min(3,Math.max(.4,G.s0*Math.hypot(q.x-p.x,q.y-p.y)/G.d0));b._x=G.bx+(p.x+q.x)/2-G.mx;b._y=G.by+(p.y+q.y)/2-G.my;
    clamp(b);apply(b);return;
  }
  const dx=e.clientX-G.sx,dy=e.clientY-G.sy;
  if(!G.moved&&Math.hypot(dx,dy)>6)G.moved=true;
  if(!G.moved)return;
  const now=performance.now(),dt=Math.max(now-G.lt,1);
  b._vx=(e.clientX-G.lx)/dt*16;b._vy=(e.clientY-G.ly)/dt*16;G.lt=now;G.lx=e.clientX;G.ly=e.clientY;
  b._x=G.bx+dx;b._y=G.by+dy;clamp(b);apply(b);
});
function gEnd(e){
  const b=G.b;if(!b||!G.pts.has(e.pointerId))return;
  G.pts.delete(e.pointerId);
  if(G.pts.size===1){b._vx=b._vy=0;baseOne();G.moved=true;return}
  G.b=null;b.classList.remove('held');
  if(!G.moved){if(e.type==='pointerup')openSheet(b._it,b);return}
  if(!reduce&&!G.two)glide(b);
  G.two=false;
}
document.addEventListener('pointerup',gEnd);document.addEventListener('pointercancel',gEnd);
['gesturestart','gesturechange'].forEach(t=>document.addEventListener(t,e=>e.preventDefault()));
function glide(b){
  const step=()=>{
    b._vx*=.92;b._vy*=.92;
    if(Math.abs(b._vx)<.2&&Math.abs(b._vy)<.2)return;
    b._x+=b._vx;b._y+=b._vy;
    const px=b._x,py=b._y;clamp(b);
    if(b._x!==px)b._vx*=-.4;if(b._y!==py)b._vy*=-.4;
    apply(b);b._raf=requestAnimationFrame(step);
  };
  b._raf=requestAnimationFrame(step);
}
const app=document.getElementById('app'),sheet=document.getElementById('sheet');
let opener=null;
function openSheet(it,from){
  if(MOCKCAT[it.id]&&(it.mock||REAL[it.id])){pendingShape=it.id;location.hash=MOCKCAT[it.id];return}
  opener=from;
  const dark=it.dark&&getComputedStyle(document.documentElement).colorScheme==='dark';
  document.getElementById('sheetImg').src=dark?it.dark:it.src;
  document.getElementById('sheetTitle').textContent=it.name;
  document.getElementById('sheetNote').textContent=it.note||(it.mock?MOCKNOTE:NOTE);
  app.classList.add('open');sheet.setAttribute('aria-hidden','false');
  setTimeout(()=>document.getElementById('close').focus({preventScroll:true}),50);
}
function closeSheet(){app.classList.remove('open');sheet.setAttribute('aria-hidden','true');if(opener)opener.focus({preventScroll:true})}
document.getElementById('close').onclick=closeSheet;
document.getElementById('scrim').onclick=closeSheet;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&app.classList.contains('open'))closeSheet()});
/* Remove: every piece breaks apart in pixel squares (same effect as the consent text). Shuffle brings them all back. */
let pileRemoved=false;
document.getElementById('removeAll').onclick=()=>{if(pileRemoved)return;pileRemoved=true;
  els.forEach(b=>{b.style.pointerEvents='none';disintegrate(b,()=>{b.style.display='none'})})};
document.getElementById('shuffle').onclick=()=>{
  if(pileRemoved){pileRemoved=false;els.forEach(b=>{b.style.display=b.style.pointerEvents='';b.style.webkitMaskImage=b.style.maskImage=b.style.webkitMaskSize=b.style.maskSize=''})}
  scatter()};
let rw=0;addEventListener('resize',()=>{clearTimeout(rw);rw=setTimeout(()=>{els.forEach(b=>{size(b);clamp(b);apply(b)})},120)});
/* Banners: hold to stop, drag to scrub, let go to resume */
document.querySelectorAll('.marquee').forEach((m,i)=>{
  const tr=m.querySelector('.track');
  const dir=m.classList.contains('rev')?1:-1, secs=m.classList.contains('rev')?60:28;
  let x=0,v=0,held=false,id=null,lx=0,lt=0,flick=0,last=performance.now();
  const half=()=>tr.scrollWidth/2;
  const base=()=>reduce?0:dir*half()/secs;
  let sx=0,dragged=false;
  m.addEventListener('pointerdown',e=>{held=true;id=e.pointerId;sx=lx=e.clientX;lt=performance.now();flick=0;dragged=false});
  m.addEventListener('pointermove',e=>{if(!held||e.pointerId!==id)return;const now=performance.now(),dx=e.clientX-lx;
    if(!dragged&&Math.abs(e.clientX-sx)>6){dragged=true;m.classList.add('held');try{m.setPointerCapture(id)}catch(_){}}
    x+=dx;flick=dx/Math.max(now-lt,1)*1000;lx=e.clientX;lt=now});
  m.addEventListener('click',e=>{if(dragged){e.preventDefault();e.stopPropagation();dragged=false}},true);
  const up=e=>{if(e.pointerId!==id)return;held=false;id=null;m.classList.remove('held');v=reduce?0:flick};
  m.addEventListener('pointerup',up);m.addEventListener('pointercancel',up);
  v=base();
  (function tick(now){
    const dt=Math.min((now-last)/1000,.05);last=now;
    if(!held){v+=(base()-v)*Math.min(1,dt*2.5);x+=v*dt}
    const h=half();if(h>0){x%=h;if(x>0)x-=h}
    tr.style.transform='translate3d('+x+'px,0,0)';
    requestAnimationFrame(tick);
  })(last);
});

/* ---------- Pages and navigation ---------- */
const RED='#E1251B';
const SHAPES={
 tee:'<path d="M62 32 L86 22 Q100 36 114 22 L138 32 L176 62 L156 88 L140 78 L140 178 L60 178 L60 78 L44 88 L24 62 Z"/>',
 hoodie:'<path d="M72 44 Q100 6 128 44 L150 50 L178 154 L158 160 L140 98 L140 180 L60 180 L60 98 L42 160 L22 154 L50 50 Z"/><path d="M78 140 L122 140 L128 168 L72 168 Z" fill="HOLE"/>',
 cap:'<path d="M38 124 Q36 54 104 50 Q162 50 166 116 L192 126 Q194 140 162 138 L38 134 Z"/><circle cx="104" cy="50" r="6" fill="HOLE"/>',
 shorts:'<path d="M50 40 L150 40 L163 162 L113 167 L100 88 L87 167 L37 162 Z"/><rect x="50" y="40" width="100" height="12" fill="HOLE"/>',
 tote:'<path d="M76 74 Q76 26 100 26 Q124 26 124 74" fill="none" stroke="INK" stroke-width="9"/><path d="M44 72 L156 72 L166 184 L34 184 Z"/>'
};
const APP=['XS','S','M','L','XL'];
const SHOP={
 mens:{title:'Mens',items:[{shape:'csh003',name:'CSH003 fur hood hoodie'},{shape:'tee',name:'Mens sample tee'},{shape:'hoodie',name:'Mens sample hoodie'},{shape:'shorts',name:'Mens sample shorts'}]},
 womens:{title:'Womens',items:[{shape:'csh003',name:'CSH003 fur hood hoodie'},{shape:'tee',name:'Womens sample tee'},{shape:'hoodie',name:'Womens sample hoodie'},{shape:'shorts',name:'Womens sample shorts'}]},
 accessories:{title:'Accessories',items:[{shape:'bagside',name:'Soleil backpack, side'},{shape:'bagfront',name:'Soleil backpack, front'},{shape:'cap',name:'Sample cap'},{shape:'tote',name:'Sample tote'}]}
};
const MOCKCAT={tee:'mens',hoodie:'mens',shorts:'mens',cap:'accessories',tote:'accessories',csh003:'mens',bagside:'accessories',bagfront:'accessories'};
const REAL={};ITEMS.forEach(x=>{if(x.id==='csh003'||x.id==='bagside'||x.id==='bagfront')REAL[x.id]=x.src});
function art(shape){return REAL[shape]?'<img src="'+REAL[shape]+'" alt="" draggable="false">':'<svg viewBox="0 0 200 200" fill="'+RED+'" aria-hidden="true">'+SHAPES[shape].replace(/HOLE/g,'var(--bg)').replace(/INK/g,RED)+'</svg>'}
const F=s=>'<span class="fill">['+s+']</span>';
const TEXT={
 about:'<header class="ptitle rule"><h1>About</h1><p>Cite Soleil</p></header><section class="psec rule"><div><p>Soleil is a creative world where fashion, music, skate culture, art, and nightlife meet.</p><p>'+F('MORE ABOUT SOLEIL')+'</p></div></section>',
 faq:'<header class="ptitle rule"><h1>FAQ</h1><p>Answers coming before launch</p></header>'+
   [['When is the drop?','DROP DATE'],['How do pre-orders work?','PRE-ORDER POLICY'],['Do you ship internationally?','SHIPPING INFO'],['How do sizes run?','SIZE GUIDE'],['What is your return policy?','RETURN POLICY']]
   .map(q=>'<section class="psec rule"><div><h2>'+q[0]+'</h2><p>'+F(q[1])+'</p></div></section>').join('')+
   '<section class="psec rule"><div><h2>How do I get early access?</h2><p>Join SMS on the <a href="#home" style="color:inherit">homepage</a>.</p></div></section>',
 campaigns:'<header class="ptitle rule"><h1>Campaigns</h1><p>Lookbooks and launches</p></header><div class="cards">'+['01','02','03','04'].map(n=>'<div class="card"><span>Campaign '+n+'</span><span>Coming soon</span></div>').join('')+'</div>',
 media:'<header class="ptitle rule"><h1>Media</h1><p>Video, photo and press</p></header><div class="cards">'+['Video','Photo','Press','Event recap'].map(n=>'<div class="card"><span>'+n+'</span><span>Coming soon</span></div>').join('')+'</div>',
 more:'<header class="ptitle rule"><h1>More</h1><p>Every page in one place</p></header><nav class="links" aria-label="All pages">'+
   [['home','Home'],['mens','Mens'],['womens','Womens'],['accessories','Accessories'],['campaigns','Campaigns'],['media','Media'],['archive','Archive'],['random','Random'],['about','About'],['faq','FAQ'],['cart','Cart']].map(l=>'<a href="#'+l[0]+'">'+l[1]+'</a>').join('')+
   '<a href="shipping/">Shipping</a><a href="refunds/">Refunds</a><a href="terms/">Terms</a><a href="privacy/">Privacy</a><a href="https://instagram.com/soleilsportswear" target="_blank" rel="noopener">Instagram</a></nav>'
};

/* Privacy, Terms, Refunds and Shipping are standalone pages in their own folders (privacy/, terms/, refunds/, shipping/). */
const ROUTES=['home','mens','womens','accessories','campaigns','media','about','faq','more','cart','booth','video','archive'];
const pgShop=document.getElementById('pg-shop'),pgText=document.getElementById('pg-text'),foot=document.querySelector('footer');
let scattered=false,pendingShape=null,lastRoute=null;

/* sounds */
let actx=null,soundOn=true;
function tone(f,start,dur,type,vol){
  if(!soundOn)return;
  try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume();
  const o=actx.createOscillator(),g=actx.createGain(),t0=actx.currentTime+start;
  o.type=type||'square';o.frequency.value=f;g.gain.setValueAtTime(vol||.05,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  o.connect(g).connect(actx.destination);o.start(t0);o.stop(t0+dur+.02);}catch(_){}
}
const SFX={
  nav:()=>{tone(880,0,.05);tone(1320,.05,.06)},
  select:()=>{tone(660,0,.06);tone(990,.06,.08)},
  deny:()=>{tone(140,0,.18,'sawtooth',.06)},
  add:()=>{[523,659,784,1047].forEach((f,i)=>tone(f,i*.07,.09))}
};

/* shop */
const rail=document.getElementById('rail'),canvas=document.getElementById('screen'),g2=canvas.getContext('2d');
const nameEl=document.getElementById('name'),priceEl=document.getElementById('price'),descEl=document.getElementById('desc'),
      sizesEl=document.getElementById('sizes'),slotEl=document.getElementById('slot'),addBtn=document.getElementById('add'),
      cartEl=document.getElementById('cart'),soundBtn=document.getElementById('sound');
let cat=null,current=-1,chosen=null,anim=null;
let CART=[];try{CART=JSON.parse(localStorage.getItem('ssw-cart')||'[]')||[]}catch(_){CART=[]}
function cartQty(){return CART.reduce((n,x)=>n+x.qty,0)}
function saveCart(){try{localStorage.setItem('ssw-cart',JSON.stringify(CART))}catch(_){}cartEl.textContent='Cart ('+cartQty()+')'}
function bg(){return getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()}
function svgFor(shape,ink,hole){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="'+ink+'">'+SHAPES[shape].replace(/HOLE/g,hole).replace(/INK/g,ink)+'</svg>'}
function buildShop(c){
  cat=c;current=-1;rail.innerHTML='';
  document.getElementById('shopTitle').textContent='Shop / '+SHOP[c].title;
  SHOP[c].items.forEach((it,i)=>{
    const b=document.createElement('button');b.type='button';b.className='tile';
    b.setAttribute('role','option');b.setAttribute('aria-selected','false');b.setAttribute('aria-label',it.name);
    b.innerHTML='<span class="num">0'+(i+1)+'</span>'+art(it.shape)+'<span class="frame"><i></i><i></i><i></i><i></i></span>';
    b.addEventListener('click',()=>select(i,true));rail.appendChild(b);
  });
}
function render(i){
  const img=new Image(),c=bg();
  img.onload=()=>{
    let steps=reduce?[480]:[6,12,24,48,480],k=0;const S=canvas.width,off=document.createElement('canvas');
    clearInterval(anim);
    const frame=()=>{const n=steps[k];off.width=n;off.height=n;const o=off.getContext('2d');
      o.fillStyle=c;o.fillRect(0,0,n,n);{const r=img.width/img.height||1,m=n*.76,w=r>=1?m:m*r,h=r>=1?m/r:m;o.drawImage(img,(n-w)/2,(n-h)/2,w,h)}
      g2.imageSmoothingEnabled=false;g2.fillStyle=c;g2.fillRect(0,0,S,S);g2.drawImage(off,0,0,n,n,0,0,S,S);
      k++;if(k>=steps.length)clearInterval(anim)};
    frame();anim=setInterval(frame,55);
  };
  {const sh=SHOP[cat].items[i].shape;img.src=REAL[sh]||'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svgFor(sh,RED,c))}
}
function select(i,snd){
  if(i===current)return;current=i;chosen=null;
  [...rail.children].forEach((t,j)=>t.setAttribute('aria-selected',j===i?'true':'false'));
  const it=SHOP[cat].items[i],acc=cat==='accessories';
  nameEl.textContent=it.name;priceEl.textContent='$00.00';descEl.textContent='Placeholder description.';
  slotEl.textContent='0'+(i+1)+'/0'+SHOP[cat].items.length;
  sizesEl.innerHTML='';
  (acc?['OS']:APP).forEach((s,k)=>{
    const b=document.createElement('button');b.type='button';b.className='size'+(!acc&&k===0?' out':'');b.textContent=s;
    b.setAttribute('aria-pressed','false');if(!acc&&k===0)b.setAttribute('aria-label',s+', sold out');
    b.addEventListener('click',()=>{
      if(b.classList.contains('out')){SFX.deny();b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');return}
      [...sizesEl.children].forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');chosen=s;SFX.select();
    });
    sizesEl.appendChild(b);
  });
  render(i);if(snd)SFX.select();
}
addBtn.addEventListener('click',()=>{
  if(!chosen){SFX.deny();sizesEl.classList.remove('shake');void sizesEl.offsetWidth;sizesEl.classList.add('shake');return}
  const it=SHOP[cat].items[current],key=cat+'|'+it.shape+'|'+chosen,ex=CART.find(x=>x.key===key);
  if(ex)ex.qty++;else CART.push({key,name:it.name,shape:it.shape,size:chosen,qty:1});
  saveCart();SFX.add();
  [addBtn,cartEl].forEach(el=>{el.classList.remove(el===addBtn?'flash':'bump');void el.offsetWidth;el.classList.add(el===addBtn?'flash':'bump')});
});
soundBtn.addEventListener('click',()=>{soundOn=!soundOn;soundBtn.textContent='Sound: '+(soundOn?'On':'Off');soundBtn.setAttribute('aria-pressed',soundOn)});
document.addEventListener('keydown',e=>{
  if(pgShop.hidden||!cat)return;
  const n=SHOP[cat].items.length;
  if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();select((current+1)%n,true);rail.children[current].focus()}
  if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();select((current-1+n)%n,true);rail.children[current].focus()}
});

/* cart page */
function cartHTML(){
  const n=cartQty();
  let h='<header class="ptitle rule"><h1>Cart</h1><p>'+n+' item'+(n===1?'':'s')+'</p></header>';
  if(!CART.length)return h+'<div class="cempty"><p style="text-transform:none;margin:0">Your cart is empty.</p><a href="#mens">Shop Mens</a></div>';
  CART.forEach((x,i)=>{
    h+='<div class="crow"><div class="thumb">'+art(x.shape)+'</div>'+
       '<div><h2>'+x.name+'</h2><div class="meta">Size '+x.size+' / $00.00</div><button type="button" class="rm" data-rm="'+i+'">Remove</button></div>'+
       '<div class="qty"><button type="button" data-dec="'+i+'" aria-label="Fewer">-</button><span aria-live="polite">'+x.qty+'</span><button type="button" data-inc="'+i+'" aria-label="More">+</button></div></div>';
  });
  return h+'<div class="ctotal"><span>Subtotal</span><span>$00.00</span></div><p class="cnote">Prices are placeholders. Shipping and taxes are worked out at checkout.</p>'+
    '<button type="button" class="checkout" id="checkout">Checkout</button><p class="cnote" id="coMsg" style="padding-bottom:28px"></p>';
}
function drawCart(){pgText.innerHTML=cartHTML()}
pgText.addEventListener('click',e=>{
  if(lastRoute!=='cart')return;
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='checkout'){SFX.add();document.getElementById('coMsg').textContent='Demo only. On the real site this hands off to Shopify checkout.';return}
  const i=+(b.dataset.inc??b.dataset.dec??b.dataset.rm);if(isNaN(i)||!CART[i])return;
  if(b.dataset.inc!==undefined){CART[i].qty++;SFX.select()}
  else if(b.dataset.dec!==undefined){if(CART[i].qty>1){CART[i].qty--;SFX.select()}else{CART.splice(i,1);SFX.deny()}}
  else{CART.splice(i,1);SFX.deny()}
  saveCart();drawCart();
});

/* ---------- 3D booth (secret page) ---------- */
const BIMG={"official": "assets/img/booth/official.webp", "bear": "assets/img/booth/bear.webp", "girl": "assets/img/booth/girl.webp", "star": "assets/img/booth/star.webp", "leopard": "assets/img/booth/leopard.webp"};
const pgBooth=document.getElementById('pg-booth');
let booth=null,boothLoading=false;
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
async function initBooth(){
  if(booth){booth.resize();return}
  if(boothLoading)return;boothLoading=true;
  try{
    if(!window.THREE)await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
    if(!THREE.OrbitControls)await loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js');
  }catch(e){document.getElementById('bLoad').textContent='Couldn\u2019t load the 3D booth. Check your connection.';boothLoading=false;return}
  document.getElementById('bLoad').remove();
  booth=buildBooth();
}
function buildBooth(){
  const stage=document.getElementById('boothStage');
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;
  stage.insertBefore(renderer.domElement,stage.firstChild);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(40,1,0.1,200);camera.position.set(13,7.5,14);
  const controls=new THREE.OrbitControls(camera,renderer.domElement);
  controls.target.set(0,2.0,0);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*0.49;controls.minDistance=3;controls.maxDistance=30;
  controls.autoRotate=!reduce;controls.autoRotateSpeed=0.8;
  controls.addEventListener('start',()=>{controls.autoRotate=false});
  scene.add(new THREE.HemisphereLight(0xffffff,0x8a8f96,0.75));
  const sun=new THREE.DirectionalLight(0xffffff,0.85);sun.position.set(8,14,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
  const sc=sun.shadow.camera;sc.left=-10;sc.right=10;sc.top=10;sc.bottom=-10;sun.shadow.bias=-0.0005;scene.add(sun);
  const inner=new THREE.PointLight(0xffffff,0.55,9);inner.position.set(0,1.9,0.5);scene.add(inner);
  const loader=new THREE.TextureLoader();const maxAniso=renderer.capabilities.getMaxAnisotropy();
  function tex(src){const t=loader.load(src);t.encoding=THREE.sRGBEncoding;t.anisotropy=maxAniso;return t}
  function makeQuilt(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,128,128);
    const grad=g.createRadialGradient(64,64,6,64,64,72);grad.addColorStop(0,'#fff');grad.addColorStop(0.75,'#999');grad.addColorStop(1,'#000');g.fillStyle=grad;g.fillRect(2,2,124,124);
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
  const quilt=makeQuilt();
  const bodyMats=[],towerMats=[],topMats=[];
  let bodyColor='#f998b7',towerColor='#111111',topColor='#f1f1f1';
  function quiltMat(rx,ry,list,color){const t=quilt.clone();t.needsUpdate=true;t.repeat.set(rx,ry);const m=new THREE.MeshStandardMaterial({color,roughness:0.55,metalness:0,bumpMap:t,bumpScale:0.06});list.push(m);return m}
  function smoothMat(list,color){const m=new THREE.MeshStandardMaterial({color,roughness:0.45,metalness:0});list.push(m);return m}
  function add(mesh,parent){mesh.castShadow=true;mesh.receiveShadow=true;(parent||scene).add(mesh);return mesh}
  const CELL=0.68;
  function logoMat(src,w,h){const b=quilt.clone();b.needsUpdate=true;b.repeat.set(w/CELL,h/CELL);
    return new THREE.MeshStandardMaterial({map:tex(src),transparent:true,alphaTest:0.08,roughness:0.55,metalness:0,bumpMap:b,bumpScale:0.06,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}
  function decal(src,w,h,x,y,z,rotY,parent){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),logoMat(src,w,h));m.position.set(x,y,z);m.rotation.y=rotY;m.receiveShadow=true;(parent||scene).add(m);return m}
  const ground=new THREE.Mesh(new THREE.CircleGeometry(30,64),new THREE.MeshStandardMaterial({color:0xc9ced4,roughness:1}));
  ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  const W=6.1,D=6.1,H=2.6,T=0.5,OPEN=2.1,HEADER_TOP=3.2,FD=D+1.2;
  const floorLeopard=tex(BIMG.leopard);floorLeopard.wrapS=floorLeopard.wrapT=THREE.RepeatWrapping;floorLeopard.repeat.set(W/0.9,FD/1.8);
  const floorFabric=new THREE.MeshStandardMaterial({color:0x111111,roughness:0.92});
  const floor=new THREE.Mesh(new THREE.BoxGeometry(W,0.05,FD),floorFabric);floor.position.set(0,0.025,0.6);floor.receiveShadow=true;scene.add(floor);
  function setFloor(v){if(v==='leopard'){floorFabric.map=floorLeopard;floorFabric.color.set(0xffffff)}else{floorFabric.map=null;floorFabric.color.set(v==='grey'?0x8d9198:0x111111)}floorFabric.needsUpdate=true}
  add(new THREE.Mesh(new THREE.BoxGeometry(W,H,T),quiltMat(9,4,bodyMats,bodyColor))).position.set(0,H/2,-D/2+T/2);
  add(new THREE.Mesh(new THREE.BoxGeometry(T,H,D),quiltMat(9,4,bodyMats,bodyColor))).position.set(-W/2+T/2,H/2,0);
  add(new THREE.Mesh(new THREE.BoxGeometry(T,H,D),quiltMat(9,4,bodyMats,bodyColor))).position.set(W/2-T/2,H/2,0);
  add(new THREE.Mesh(new THREE.BoxGeometry(W,T,D),quiltMat(9,9,bodyMats,bodyColor))).position.set(0,H-T/2,0);
  const headerH=HEADER_TOP-OPEN,headerD=0.8,headerZ=D/2-0.3;
  add(new THREE.Mesh(new THREE.BoxGeometry(W,headerH,headerD),quiltMat(9,2,bodyMats,bodyColor))).position.set(0,OPEN+headerH/2,headerZ);
  function leopardMat(w,h){const t=tex(BIMG.leopard);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(w/0.9,h/1.8);return new THREE.MeshStandardMaterial({map:t,roughness:0.8})}
  function lining(w,h,x,y,z,rx,ry){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),leopardMat(w,h));m.position.set(x,y,z);m.rotation.set(rx,ry,0);m.receiveShadow=true;scene.add(m)}
  const iw=W-2*T,ih=H-T;
  lining(iw,ih,0,ih/2,-D/2+T+0.01,0,0);
  lining(D-T,ih,-W/2+T+0.01,ih/2,T/2,0,Math.PI/2);
  lining(D-T,ih,W/2-T-0.01,ih/2,T/2,0,-Math.PI/2);
  lining(iw,D-T,0,H-T-0.01,T/2,Math.PI/2,0);
  lining(iw,OPEN>H-T?0.01:(H-T)-OPEN,0,OPEN+((H-T)-OPEN)/2,headerZ-headerD/2-0.01,0,Math.PI);
  const offH=headerH*0.86,offW=offH*(1512/812);
  decal(BIMG.official,offW,offH,0,OPEN+headerH/2,headerZ+headerD/2+0.01,0);
  const bearH=H*0.82,bearW=bearH*(980/1092);
  decal(BIMG.bear,bearW,bearH,-W/2-0.01,H*0.5,0,-Math.PI/2);
  decal(BIMG.bear,bearW,bearH,W/2+0.01,H*0.5,0,Math.PI/2);
  const girlH=(H-T)*0.72,girlW=girlH*(1372/896);
  decal(BIMG.girl,girlW,girlH,0,(H-T)*0.52,-D/2+T+0.02,0);
  const towers=new THREE.Group();scene.add(towers);
  let topStyle='sun',heightMode='equal';const RR=0.65;
  const corners=[[-W/2,D/2],[W/2,D/2],[-W/2,-D/2],[W/2,-D/2]];
  const starMat=logoMat(BIMG.star,0.78,0.78);starMat.side=THREE.FrontSide;
  function clearGroup(g){while(g.children.length){const o=g.children.pop();o.traverse(n=>{if(n.geometry)n.geometry.dispose()})}towerMats.length=0;topMats.length=0}
  function ray(parent,dir,cy,h,r,mat){const geo=new THREE.ConeGeometry(r,h,20);geo.translate(0,h/2,0);geo.rotateX(Math.PI/2);const m=add(new THREE.Mesh(geo,mat),parent);m.position.set(dir.x*0.48,cy+dir.y*0.48,dir.z*0.48);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),dir)}
  function sunTop(parent,y){const tm=smoothMat(topMats,topColor);
    const collar=add(new THREE.Mesh(new THREE.CylinderGeometry(RR+0.08,RR,0.25,40),quiltMat(10,1,towerMats,towerColor)),parent);collar.position.y=y+0.125;
    const cy=y+0.25+0.55;add(new THREE.Mesh(new THREE.SphereGeometry(0.55,40,28),tm),parent).position.y=cy;
    for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2;ray(parent,new THREE.Vector3(Math.cos(a),0.15,Math.sin(a)).normalize(),cy,i%2===0?0.6:0.4,0.14,tm)}
    for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2+Math.PI/6;ray(parent,new THREE.Vector3(Math.cos(a)*0.6,0.8,Math.sin(a)*0.6).normalize(),cy,0.38,0.12,tm)}}
  function castleTop(parent,y){const cap=add(new THREE.Mesh(new THREE.CylinderGeometry(RR+0.2,RR,0.5,40),quiltMat(10,1,towerMats,towerColor)),parent);cap.position.y=y+0.25;
    for(let i=0;i<7;i++){const a=(i/7)*Math.PI*2;const m=add(new THREE.Mesh(new THREE.BoxGeometry(0.3,0.32,0.3),quiltMat(1,1,towerMats,towerColor)),parent);m.position.set(Math.cos(a)*(RR+0.05),y+0.66,Math.sin(a)*(RR+0.05));m.rotation.y=-a}}
  function towerStar(parent,cx,cz,y){const size=0.78,rr=RR+0.012,len=size/rr,ang=Math.atan2(cx,cz);
    const m=new THREE.Mesh(new THREE.CylinderGeometry(rr,rr,size,32,1,true,ang-len/2,len),starMat);m.position.y=y;parent.add(m)}
  function buildTowers(){clearGroup(towers);const heights=heightMode==='equal'?[3.08,3.08,3.08,3.08]:[3.08,2.75,2.45,2.45];
    corners.forEach((c,i)=>{const g=new THREE.Group();g.position.set(c[0],0,c[1]);towers.add(g);const h=heights[i];
      add(new THREE.Mesh(new THREE.CylinderGeometry(RR,RR,h,40),quiltMat(10,8,towerMats,towerColor)),g).position.y=h/2;
      towerStar(g,c[0],c[1],h*0.6);if(topStyle==='sun')sunTop(g,h);else castleTop(g,h)})}
  buildTowers();
  function seg(id,onPick){const el=document.getElementById(id);el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    el.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));onPick(b.dataset.v);SFX.select()})}
  seg('bTop',v=>{topStyle=v;buildTowers();document.getElementById('bTopGrp').style.opacity=v==='sun'?1:0.4});
  seg('bHeight',v=>{heightMode=v;buildTowers()});
  seg('bFloor',setFloor);
  const VIEWS={hero:[[13,7.5,14],[0,2.0,0]],front:[[0,2.6,15],[0,2.0,0]],left:[[-15,2.6,0.01],[0,2.0,0]],right:[[15,2.6,0.01],[0,2.0,0]],back:[[0,2.6,-15],[0,2.0,0]],top:[[0.01,20,0.6],[0,0,0]],inside:[[0,1.7,5.2],[0,1.4,-2.5]]};
  seg('bViews',v=>{const [p,tg]=VIEWS[v];controls.autoRotate=false;camera.position.set(p[0],p[1],p[2]);controls.target.set(tg[0],tg[1],tg[2]);controls.update()});
  function swatches(id,colors,current,onPick){const el=document.getElementById(id);colors.forEach(([hex,name])=>{const b=document.createElement('button');b.type='button';
    b.style.background=hex;b.title=name;b.setAttribute('aria-label',name);b.setAttribute('aria-pressed',hex===current);
    b.addEventListener('click',()=>{el.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));onPick(hex);SFX.select()});el.appendChild(b)})}
  const palette=[['#f998b7','Brand pink'],['#ffbadc','Light pink'],['#111111','Black'],['#3b3e44','Charcoal'],['#b7b7b7','Leopard grey'],['#f1f1f1','Light grey']];
  swatches('bBodySw',palette,bodyColor,hex=>{bodyColor=hex;bodyMats.forEach(m=>m.color.set(hex))});
  swatches('bTowerSw',palette,towerColor,hex=>{towerColor=hex;towerMats.forEach(m=>m.color.set(hex))});
  swatches('bTopSw',palette,topColor,hex=>{topColor=hex;topMats.forEach(m=>m.color.set(hex))});
  const mq=matchMedia('(prefers-color-scheme: dark)');
  function themeGround(){ground.material.color.set(mq.matches?0x3a3f47:0xc9ced4)}
  themeGround();if(mq.addEventListener)mq.addEventListener('change',themeGround);
  function resize(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
  addEventListener('resize',resize);resize();
  (function loop(){if(!pgBooth.hidden){controls.update();renderer.render(scene,camera)}requestAnimationFrame(loop)})();
  return {resize};
}
let randomHits=0,randomTarget=1+Math.floor(Math.random()*2),lastSpecial=null;
function boothToast(){const el=document.getElementById('bToast');el.textContent='You found the booth';el.classList.add('on');setTimeout(()=>el.classList.remove('on'),2200)}

/* ---------- Early access lock ---------- */
const CODE_HASH='c598a6e2835e5ce64f29fd9395b3848cb70b707790b482bdb2ea5a41bfca8892';
/* Archive has its own code; the main code does not open it */
const ARCHIVE_HASH='b22a9799327ae5c2ede95de1e1943426c145a79ec6f6735b3465b5e0127715cc';
const SITE_SET=window.SOLEIL_SETTINGS||{};
const OPEN_ROUTES=[].concat(SITE_SET.lockHome?[]:['home']).concat(Array.isArray(SITE_SET.openPages)?SITE_SET.openPages.map(s=>String(s).toLowerCase()):[]);
const pgLock=document.getElementById('pg-lock');
let unlocked=false;try{unlocked=localStorage.getItem('ssw-access')==='1'}catch(_){}
let archiveUnlocked=false;try{archiveUnlocked=localStorage.getItem('ssw-archive')==='1'}catch(_){}
let curRoute='home';
function isLocked(r){return !OPEN_ROUTES.includes(r)&&!(r==='archive'?archiveUnlocked:unlocked)}
async function sha(s){
  if(window.crypto&&crypto.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  return s==='SOLEIL'?CODE_HASH:s==='ARCHIVE'?ARCHIVE_HASH:'';
}
const appEl=document.getElementById('app'),popEl=document.getElementById('pop');
let popOpener=null;
function openPop(){popOpener=document.activeElement;appEl.classList.add('pop-on');popEl.setAttribute('aria-hidden','false');setTimeout(()=>document.getElementById('popPhone').focus({preventScroll:true}),60)}
function closePop(){if(!appEl.classList.contains('pop-on'))return;appEl.classList.remove('pop-on');resetPop();popEl.setAttribute('aria-hidden','true');
  const c=document.getElementById('code');if(!pgLock.hidden&&c)c.focus({preventScroll:true});else if(popOpener&&popOpener.focus)popOpener.focus({preventScroll:true})}
document.getElementById('popClose').onclick=closePop;
document.getElementById('popScrim').onclick=closePop;
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePop()});
popEl.addEventListener('click',e=>{if(e.target.closest('a'))closePop()});
document.getElementById('lockSms').onclick=openPop;
document.getElementById('lockForm').addEventListener('submit',async e=>{
  e.preventDefault();const f=e.currentTarget,inp=document.getElementById('code'),err=document.getElementById('lockErr');
  const h=await sha(inp.value.trim().toUpperCase());
  const forArchive=curRoute==='archive';
  if(h===(forArchive?ARCHIVE_HASH:CODE_HASH)){
    if(forArchive){archiveUnlocked=true;try{localStorage.setItem('ssw-archive','1')}catch(_){}}
    else{unlocked=true;try{localStorage.setItem('ssw-access','1')}catch(_){}}
    inp.value='';err.textContent='';SFX.add();lastRoute=null;route();
    const el=document.getElementById('bToast');el.textContent='Unlocked';el.classList.add('on');setTimeout(()=>el.classList.remove('on'),1800);
  }else{err.textContent='That code didn\u2019t work.';SFX.deny();f.classList.remove('shake');void f.offsetWidth;f.classList.add('shake');inp.select()}
});

/* ---------- Background music ---------- */
const bgm=document.getElementById('bgm'),musicBtn=document.getElementById('musicBtn');
let musicOn=true;try{musicOn=localStorage.getItem('ssw-music')!=='off'}catch(_){}
let musicReady=false,musicStarted=false;
const mbar=document.getElementById('mbar'),mbPlay=document.getElementById('mbPlay'),mbWave=document.getElementById('mbWave');
mbWave.textContent=mbWave.textContent.repeat(60);
function syncMusicBtn(){musicBtn.setAttribute('aria-pressed',musicOn);musicBtn.setAttribute('aria-label',musicOn?'Music on. Tap to mute':'Music off. Tap to play');musicBtn.classList.toggle('playing',musicOn&&!bgm.paused);
  const on=!bgm.paused;const st=on?'pause':'play';
  if(mbPlay.dataset.s!==st){mbPlay.dataset.s=st;mbPlay.innerHTML=on?'<svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="4" y="3" width="4" height="14"/><rect x="12" y="3" width="4" height="14"/></svg>':'<svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M5 3l12 7-12 7z"/></svg>';mbPlay.classList.remove('mb-bump');void mbPlay.offsetWidth;mbPlay.classList.add('mb-bump')}
  mbPlay.setAttribute('aria-label',on?'Pause music':'Play music');mbar.classList.toggle('playing',on)}
mbPlay.addEventListener('click',e=>{e.stopPropagation();
  if(bgm.paused){musicOn=true;try{localStorage.setItem('ssw-music','on')}catch(_){}playMusic()}
  else{musicOn=false;try{localStorage.setItem('ssw-music','off')}catch(_){}bgm.pause()}
  syncMusicBtn()});
function playMusic(){if(!musicOn)return;bgm.volume=.6;const p=bgm.play();if(p&&p.then)p.then(()=>{musicStarted=true;musicReady=true;syncMusicBtn()}).catch(()=>{})}
/* playlist: plays in order, then starts over. Add files here to add tracks. */
const TRACKS=['music.mp3','music2.mp3','music3.m4a'];
let trackIdx=0,trackFails=0;
const mbSkip=document.getElementById('mbSkip');
function goTrack(i){trackIdx=(i+TRACKS.length)%TRACKS.length;bgm.src=TRACKS[trackIdx];bgm.load();if(musicStarted||!bgm.paused)playMusic()}
bgm.addEventListener('ended',()=>goTrack(trackIdx+1));
mbSkip.addEventListener('click',e=>{e.stopPropagation();mbSkip.classList.remove('mb-bump');void mbSkip.offsetWidth;mbSkip.classList.add('mb-bump');
  musicOn=true;try{localStorage.setItem('ssw-music','on')}catch(_){}musicStarted=true;goTrack(trackIdx+1)});
bgm.addEventListener('canplay',()=>{trackFails=0;musicReady=true;mbar.hidden=false;syncMusicBtn()});
/* a missing or broken file is skipped; the bar hides only if none of the tracks load */
bgm.addEventListener('error',()=>{trackFails++;if(trackFails>=TRACKS.length){musicBtn.hidden=true;mbar.hidden=true;return}goTrack(trackIdx+1)});
bgm.addEventListener('play',syncMusicBtn);bgm.addEventListener('pause',syncMusicBtn);
/* phones only allow sound from the end of a tap (touchend, pointerup, click), not the start */
['pointerdown','keydown','touchstart','pointerup','touchend','click'].forEach(ev=>document.addEventListener(ev,function first(e){if(e.target&&e.target.closest&&e.target.closest('#mbPlay,#mbSkip,#musicBtn'))return;if(!musicStarted)playMusic()},{capture:true,passive:true}));
musicBtn.addEventListener('click',e=>{e.stopPropagation();musicOn=!musicOn;try{localStorage.setItem('ssw-music',musicOn?'on':'off')}catch(_){}
  if(musicOn)playMusic();else bgm.pause();syncMusicBtn()});
bgm.load();

/* ---------- Video page ---------- */
/* ---------- SMS sign-up: Klaviyo ---------- */
/* Fill in both values from Klaviyo to turn the sign-up forms on:
   KLAVIYO_PUBLIC_KEY: Settings > Account > API keys > Public API key (6 characters, safe to publish)
   KLAVIYO_SMS_LIST: the ID of the SMS list (open the list in Lists & segments; the ID is in the page address) */
const KLAVIYO_PUBLIC_KEY='Ymzppw',KLAVIYO_SMS_LIST='X6BhSq';
/* Klaviyo onsite tracking (described on the Privacy page) */
if(KLAVIYO_PUBLIC_KEY){const ks=document.createElement('script');ks.async=true;ks.src='https://static.klaviyo.com/onsite/js/klaviyo.js?company_id='+encodeURIComponent(KLAVIYO_PUBLIC_KEY);document.head.appendChild(ks)}
function smsSubscribe(digits,source){
  if(!KLAVIYO_PUBLIC_KEY||!KLAVIYO_SMS_LIST)return Promise.reject(new Error('not set'));
  return fetch('https://a.klaviyo.com/client/subscriptions/?company_id='+encodeURIComponent(KLAVIYO_PUBLIC_KEY),{method:'POST',
    headers:{'Content-Type':'application/json',revision:'2025-10-15'},
    body:JSON.stringify({data:{type:'subscription',attributes:{custom_source:source,
      profile:{data:{type:'profile',attributes:{phone_number:'+1'+digits,subscriptions:{sms:{marketing:{consent:'SUBSCRIBED'},transactional:{consent:'SUBSCRIBED'}}}}}}},
      relationships:{list:{data:{type:'list',id:KLAVIYO_SMS_LIST}}}}})})
  .then(r=>{if(!r.ok)throw new Error('status '+r.status)})}
/* the consent text and its unchecked checkbox stay in place; messages go in the line below them */
/* after a sign-up, the checkbox and consent text break apart in 4px squares, then the space closes */
function disintegrate(el,done){
  if(reduce){done();return}
  const r=el.getBoundingClientRect(),W=Math.max(1,Math.ceil(r.width)),H=Math.max(1,Math.ceil(r.height)),cell=4;
  const cols=Math.ceil(W/cell),rows=Math.ceil(H/cell),n=cols*rows,order=[];
  for(let i=0;i<n;i++)order.push([i,(i%cols)/cols*.6+Math.random()*.7]);
  order.sort((p,q)=>p[1]-q[1]);
  const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.fillStyle='#000';g.fillRect(0,0,W,H);
  const STEPS=10;let k=0,done0=0;
  const tick=()=>{k++;const upto=Math.round(n*k/STEPS);
    for(;done0<upto;done0++){const i=order[done0][0];g.clearRect((i%cols)*cell,Math.floor(i/cols)*cell,cell,cell)}
    const u='url('+c.toDataURL()+')';el.style.webkitMaskImage=el.style.maskImage=u;el.style.webkitMaskSize=el.style.maskSize='100% 100%';
    if(k<STEPS)setTimeout(tick,55);else done()};
  tick();
}
function resetConsent(el){el.hidden=false;el.style.display='';el.style.webkitMaskImage=el.style.maskImage=el.style.webkitMaskSize=el.style.maskSize=''}
function toast(t,ms){const el=document.getElementById('bToast');el.textContent=t;el.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('on'),ms||2600)}
/* hold the pop-up where it is while its form collapses, so it does not jump */
function anchorPop(){const r=popEl.getBoundingClientRect();popEl.style.transition='none';popEl.style.top=r.top+'px';popEl.style.transform='translate(-50%,0)';void popEl.offsetWidth;popEl.style.transition=''}
/* the consent text and its unchecked checkbox stay in place; messages go in the line below them */
function wireSms(form,input,box,msg,source,onSuccess){let busy=false;
  const say=t=>{msg.textContent=t};
  box.addEventListener('change',()=>{if(box.checked&&msg.dataset.need)say('')});
  form.addEventListener('submit',e=>{e.preventDefault();if(busy)return;delete msg.dataset.need;
    const v=input.value.replace(/\D/g,'');
    if(v.length!==10){say('Enter a 10 digit US or Canada mobile number.');SFX.deny();return}
    if(!box.checked){msg.dataset.need='1';say('Check the box to agree to texts before joining.');SFX.deny();return}
    if(!KLAVIYO_PUBLIC_KEY||!KLAVIYO_SMS_LIST){say('Sign-up opens soon. Nothing was sent.');SFX.deny();return}
    busy=true;const btn=form.querySelector('button[type="submit"]');if(btn)btn.disabled=true;
    smsSubscribe(v,source).then(()=>{input.value='';box.checked=false;say('');SFX.add();onSuccess(say)})
      .catch(()=>{say('That didn’t go through. Check the number and try again.');SFX.deny()})
      .finally(()=>{busy=false;if(btn)btn.disabled=false})});
}
/* homepage and video page: the whole sign-up box breaks apart in pixel squares and is gone */
wireSms(signup,document.getElementById('phone'),document.getElementById('smsOk'),document.getElementById('fine'),'Homepage',()=>{
  signup.style.pointerEvents='none';
  disintegrate(signup,()=>{signup.style.display='none';appEl.classList.add('vid-joined');
    toast(appEl.classList.contains('vid-on')?'You’re in. Enjoy the video':'You’re in. Watch for a text');
    if(window._fillSideArt)window._fillSideArt()})});
/* pop-up: the form and consent break apart, the confirmation stays in the pop-up */
wireSms(document.getElementById('popForm'),document.getElementById('popPhone'),document.getElementById('popOk'),document.getElementById('popFine'),'Pop-up',say=>{
  const parts=[document.getElementById('popForm'),document.getElementById('popOk').closest('.consent')];let left=parts.length;
  parts.forEach(el=>disintegrate(el,()=>{if(--left)return;anchorPop();parts.forEach(x=>x.style.display='none');say('You’re in. Watch for a text from Soleilsportswear.')}))});
/* the pop-up starts fresh each time it closes */
function resetPop(){setTimeout(()=>{if(appEl.classList.contains('pop-on'))return;popEl.style.top=popEl.style.transform='';resetConsent(document.getElementById('popOk').closest('.consent'));resetConsent(document.getElementById('popForm'));document.getElementById('popFine').textContent=''},250)}
const bgv=document.getElementById('bgv');let vidLoaded=false;
bgv.addEventListener('error',()=>appEl.classList.add('vid-err'));
function showVideo(on){
  appEl.classList.toggle('vid-on',on);
  if(on){if(!vidLoaded){vidLoaded=true;bgv.src='video.mp4'}const p=bgv.play();if(p&&p.catch)p.catch(()=>{})}
  else if(!bgv.paused)bgv.pause();
}
/* ---------- Phone fields: numbers only, 10 digits ---------- */
function fmtPhone(d){if(d.length<4)return d;if(d.length<7)return '('+d.slice(0,3)+') '+d.slice(3);return '('+d.slice(0,3)+') '+d.slice(3,6)+'-'+d.slice(6)}
['phone','popPhone'].forEach(id=>{const el=document.getElementById(id);if(!el)return;
  el.addEventListener('input',()=>{let d=el.value.replace(/\D/g,'');if(d.length===11&&d[0]==='1')d=d.slice(1);d=d.slice(0,10);el.value=fmtPhone(d)});
  el.addEventListener('keydown',e=>{if(e.key.length===1&&!/[0-9]/.test(e.key)&&!e.metaKey&&!e.ctrlKey)e.preventDefault()});
});
/* ---------- Side art: repeat down the whole left side ---------- */
(function(){const el=document.querySelector('.side-art');if(!el)return;const unit=el.textContent.replace(/\n+$/,'');
  const su=document.getElementById('signup'),root=document.documentElement;
  /* leave a clean gap in the braille behind the sign-up box, cut on whole lines, one line of space above */
  function gap(){const a=el.getBoundingClientRect(),b=su&&su.getBoundingClientRect();
    if(!b||!b.height||a.right<b.left&&innerWidth-a.right>b.right){root.classList.remove('sa-gap');return}
    const cs=getComputedStyle(el);let lh=parseFloat(cs.lineHeight);if(!lh)lh=parseFloat(cs.fontSize)*1.08;
    const t=Math.max(0,Math.floor((b.top-a.top)/lh)-1)*lh,u=Math.ceil((b.bottom-a.top)/lh)*lh;
    root.style.setProperty('--sa-g1',t+'px');root.style.setProperty('--sa-g2',u+'px');root.classList.add('sa-gap')}
  function fill(){const h=innerHeight;el.textContent=unit;el.style.bottom='auto';const bh=el.offsetHeight||1;el.style.bottom='';const n=Math.max(1,Math.ceil(h/bh)+1);el.textContent=Array(n).fill(unit).join('\n');gap()}
  fill();addEventListener('resize',()=>{clearTimeout(fill.t);fill.t=setTimeout(fill,150)});window._fillSideArt=fill})();

/* ---------- Pixel clouds (every page except the booth; interactive on the landing page only) ---------- */
(function(){const box=document.getElementById('clouds');if(!box)return;
  /* each cloud is a pixel grid: # is a filled block. Wider at the bottom, stepped at the top. */
  const SHAPES=[
    ['      ####      ','   #########    ','  ############  ',' ############## ','################'],
    ['         #####          ','   ####  #######        ','  ################ ###  ',' ###################### ','########################','########################'],
    ['    ###     ','  #######   ',' ########## ','############'],
    ['           ######              ','     ###  ##########           ','   #######################     ','  ##########################   ',' ############################# ','###############################','###############################'],
    ['   ####    ',' ######### ','###########'],
    ['       ###  ####     ','    ##############   ','  ################## ',' ####################','#####################']];
  /* shape, top as % of the screen, size multiplier, seconds per crossing, start offset 0 to 1 */
  const LAYOUT=[[0,2,1,150,.1],[1,8,1.2,210,.55],[2,20,.8,120,.8],[3,0,1.4,260,.3],[4,30,.7,105,.4],[5,14,1,175,.95],
    [2,40,1,190,.2],[0,50,.9,140,.65],[5,60,1.1,230,.05],[4,70,.8,115,.75],[1,78,1.3,250,.45],[3,88,1,200,.85],
    /* extra clouds through the middle of the screen */
    [4,25,.9,160,.6],[0,35,1.1,220,.15],[2,45,.9,135,.9],[1,52,1,195,.35],[3,57,.9,240,.7],[5,65,.8,150,.25]];
  const NS='http://www.w3.org/2000/svg',C=[];
  LAYOUT.forEach(([si,top,k,dur,off],i)=>{const rows=SHAPES[si],w=rows[0].length,h=rows.length;
    let d='';rows.forEach((r,y)=>{r.replace(/#+/g,(m,x)=>{d+='M'+x+' '+y+'h'+m.length+'v1h-'+m.length+'z';return m})});
    const el=document.createElement('div');el.className='cloud';
    const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 '+w+' '+h);
    /* light shade dither: two small dots per block, offset like a checkerboard */
    svg.innerHTML='<defs><pattern id="cdot'+i+'" width="1" height="1" patternUnits="userSpaceOnUse"><rect width=".25" height=".25" fill="currentColor"/><rect x=".5" y=".5" width=".25" height=".25" fill="currentColor"/></pattern></defs><path d="'+d+'" fill="url(#cdot'+i+')"/>';
    el.appendChild(svg);el.style.top=top+'%';el.style.width='calc('+(w*k)+' * var(--cell))';box.appendChild(el);
    C.push({el,rows,top,dur,off,x:0,y:0,s:1,fx:0,fy:0,px:0,py:0,w:0,h:0,gone:false})});
  /* motion is driven here (not CSS) so clouds can be pushed, dragged, flung, resized and popped on the homepage */
  const measure=()=>C.forEach(c=>{c.w=c.el.offsetWidth;c.h=c.el.offsetHeight});
  addEventListener('resize',()=>{clearTimeout(measure.t);measure.t=setTimeout(measure,150)});
  const root=document.documentElement,app0=document.getElementById('app');
  const live=()=>root.classList.contains('is-home')&&!app0.classList.contains('vid-on')&&!app0.classList.contains('open')&&!app0.classList.contains('pop-on');
  const BLOCK='.item,.signup,button,a,input,label,.marquee,.mbar,.sheet,.pop,.b-toast,#musicBtn';
  const topPx=c=>c.top/100*innerHeight;
  /* hit test against the cloud's own pixel grid, with one block of slack */
  function hit(x,y){for(let i=C.length-1;i>=0;i--){const c=C[i];if(c.gone)continue;const r=c.el.getBoundingClientRect();
      if(x<r.left||x>r.right||y<r.top||y>r.bottom)continue;
      const cols=c.rows[0].length,rws=c.rows.length,cx=Math.floor((x-r.left)/r.width*cols),cy=Math.floor((y-r.top)/r.height*rws);
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const row=c.rows[cy+dy];if(row&&row[cx+dx]==='#')return c}}
    return null}
  let ptr=null,drag=null,last=performance.now();
  function frame(now){const dt=Math.min((now-last)/1000,.05);last=now;
    if(root.classList.contains('show-clouds')){const W=innerWidth,H=innerHeight;
      C.forEach(c=>{if(c.gone)return;
        /* measured once visible (the box is hidden until the first route) */
        if(!c.w){c.w=c.el.offsetWidth;c.h=c.el.offsetHeight;if(!c.w)return;if(!c.init){c.x=-c.w+c.off*(W+c.w);c.init=true}}
        if(!drag||drag.c!==c){
          if(!reduce)c.x+=(W+c.w)/c.dur*dt;
          c.x+=c.fx*dt;c.y+=c.fy*dt;const fr=Math.pow(.06,dt);c.fx*=fr;c.fy*=fr;
          const vt=topPx(c)+c.y+c.h*(1-c.s)/2,mn=-c.h*c.s*.5,mx=H-c.h*c.s*.5;
          if(vt<mn){c.y+=mn-vt;c.fy*=-.4}else if(vt>mx){c.y-=vt-mx;c.fy*=-.4}
          const vl=c.x+c.w*(1-c.s)/2;if(vl>W)c.x=-c.w*(1+c.s)/2-10;
        }
        /* push: slide away from a nearby finger or mouse, then settle back */
        let tx=0,ty=0;
        if(ptr&&live()&&!(drag&&drag.c===c)){const cx=c.x+c.w/2,cy=topPx(c)+c.y+c.h/2,dx=cx-ptr.x,dy=cy-ptr.y,dd=Math.hypot(dx,dy)||1,R=Math.max(c.w,c.h)*c.s/2+70;
          if(dd<R){const f=(R-dd)/R;tx=dx/dd*f*60;ty=dy/dd*f*40}}
        const e=Math.min(1,dt*6);c.px+=(tx-c.px)*e;c.py+=(ty-c.py)*e;
        c.el.style.transform='translate('+(c.x+c.px).toFixed(1)+'px,'+(c.y+c.py).toFixed(1)+'px) scale('+c.s.toFixed(3)+')'})}
    requestAnimationFrame(frame)}
  requestAnimationFrame(frame);
  function pop(c){c.gone=true;if(typeof SFX!=='undefined')SFX.select();
    disintegrate(c.el,()=>{c.el.style.display='none';
      setTimeout(()=>{c.el.style.display='';c.el.style.webkitMaskImage=c.el.style.maskImage=c.el.style.webkitMaskSize=c.el.style.maskSize='';
        c.s=1;c.y=0;c.fx=c.fy=c.px=c.py=0;c.x=-c.w-20;c.gone=false},2500+Math.random()*3500)})}
  const stg=document.getElementById('stage');
  document.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='mouse')ptr={x:e.clientX,y:e.clientY};
    if(drag){if(drag.pts.size<2&&!drag.pts.has(e.pointerId)){drag.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
        const [p,q]=[...drag.pts.values()];drag.d0=Math.hypot(q.x-p.x,q.y-p.y)||1;drag.s0=drag.c.s;drag.two=true;e.preventDefault()}return}
    if(!live()||G.b||(e.pointerType==='mouse'&&e.button!==0)||e.target.closest(BLOCK))return;
    const c=hit(e.clientX,e.clientY);if(!c)return;
    e.preventDefault();c.fx=c.fy=0;
    drag={c,id:e.pointerId,pts:new Map([[e.pointerId,{x:e.clientX,y:e.clientY}]]),sx:e.clientX,sy:e.clientY,gx:e.clientX-c.x,gy:e.clientY-c.y,t0:performance.now(),moved:false,two:false,vx:0,vy:0,lt:performance.now(),lx:e.clientX,ly:e.clientY};
    stg.style.cursor='grabbing'});
  document.addEventListener('pointermove',e=>{
    if(e.pointerType==='mouse'||(drag&&drag.pts.has(e.pointerId))||e.buttons)ptr={x:e.clientX,y:e.clientY};
    if(!drag){if(e.pointerType==='mouse')stg.style.cursor=live()&&!G.b&&!e.target.closest(BLOCK)&&hit(e.clientX,e.clientY)?'grab':'';return}
    if(!drag.pts.has(e.pointerId))return;drag.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});const c=drag.c;
    if(drag.pts.size===2){const [p,q]=[...drag.pts.values()];c.s=Math.min(3,Math.max(.4,drag.s0*Math.hypot(q.x-p.x,q.y-p.y)/drag.d0));return}
    if(e.pointerId!==drag.id)return;
    if(!drag.moved&&Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)>6)drag.moved=true;
    if(!drag.moved)return;
    const now=performance.now(),t=Math.max(now-drag.lt,1);drag.vx=(e.clientX-drag.lx)/t*1000;drag.vy=(e.clientY-drag.ly)/t*1000;drag.lt=now;drag.lx=e.clientX;drag.ly=e.clientY;
    c.x=e.clientX-drag.gx;c.y=e.clientY-drag.gy});
  function end(e){if(e.pointerType!=='mouse')ptr=null;
    if(!drag||!drag.pts.has(e.pointerId))return;drag.pts.delete(e.pointerId);
    if(drag.pts.size===1){/* one finger left: keep dragging with it */const [id,p]=[...drag.pts.entries()][0];drag.id=id;drag.gx=p.x-drag.c.x;drag.gy=p.y-drag.c.y;drag.moved=true;return}
    const c=drag.c,tap=!drag.moved&&!drag.two&&performance.now()-drag.t0<500;
    if(tap&&e.type==='pointerup')pop(c);
    else if(!drag.two&&performance.now()-drag.lt<80){c.fx=Math.max(-2500,Math.min(2500,drag.vx));c.fy=Math.max(-2500,Math.min(2500,drag.vy))}
    drag=null;stg.style.cursor=''}
  document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
  root.addEventListener('mouseleave',()=>{ptr=null});
  /* desktop: scroll or trackpad pinch over a cloud resizes it */
  document.addEventListener('wheel',e=>{if(!live()||G.b||e.target.closest(BLOCK))return;const c=drag?drag.c:hit(e.clientX,e.clientY);if(!c)return;
    e.preventDefault();c.s=Math.min(3,Math.max(.4,c.s*Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015))))},{passive:false});
})();

/* ---------- Archive (Pynk Project) ---------- */
const pgArchive=document.getElementById('pg-archive');
const AR_CAT={csh003:'Garment',hoodiepink:'Garment',bagside:'Bag',bagfront:'Bag',bear:'Mark',star:'Mark',cs:'Mark',official:'Mark',graffiti:'Mark'};
const AR_NOTE={Garment:'check rib width',Bag:'zip pull color?',Sticker:'die cut 1/8 in border',Mark:'rebuild as vector'};
let arBuilt=false,arFilter='all',arList=[];
function hex(r,g,b){return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase()}
function palette(img,n){try{const c=document.createElement('canvas'),s=64;c.width=c.height=s;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0,s,s);
  const d=g.getImageData(0,0,s,s).data,m=new Map();
  for(let i=0;i<d.length;i+=4){if(d[i+3]<200)continue;const k=(d[i]>>4)+','+(d[i+1]>>4)+','+(d[i+2]>>4);const e=m.get(k)||[0,0,0,0];e[0]+=d[i];e[1]+=d[i+1];e[2]+=d[i+2];e[3]++;m.set(k,e)}
  const top=[...m.values()].sort((a,b)=>b[3]-a[3]),out=[];
  for(const e of top){const c2=[Math.round(e[0]/e[3]),Math.round(e[1]/e[3]),Math.round(e[2]/e[3])];
    if(out.every(o=>Math.abs(o[0]-c2[0])+Math.abs(o[1]-c2[1])+Math.abs(o[2]-c2[2])>60))out.push(c2);if(out.length>=n)break}
  return out.map(c3=>hex(c3[0],c3[1],c3[2]))}catch(_){return[]}}
function arSrc(a){return a.it.dark&&matchMedia('(prefers-color-scheme: dark)').matches?a.it.dark:a.it.src}
function arGroup(c){return c==='Bag'?'Garment':c}
function buildArchive(){
  if(!arBuilt){arBuilt=true;
    arList=ITEMS.filter(x=>!x.mock).map((x,i)=>({it:x,code:'PP-'+String(i+1).padStart(3,'0'),cat:AR_CAT[x.id]||'Sticker',w:0,h:0,cols:[]}));
    arList.forEach(a=>{const im=new Image();im.onload=()=>{a.w=im.naturalWidth;a.h=im.naturalHeight;a.cols=palette(im,4);const card=pgArchive.querySelector('[data-code="'+a.code+'"]');if(card)fillCard(card,a)};im.src=a.it.src});
  }
  const counts={all:arList.length,Garment:0,Sticker:0,Mark:0};arList.forEach(a=>counts[arGroup(a.cat)]++);
  const F2=[['all','All'],['Garment','Garments'],['Sticker','Stickers'],['Mark','Marks']];
  pgArchive.innerHTML='<header class="ar-head"><h1 id="arTitle">Pynk <span>Project</span></h1></header>'+
    '<div class="ar-meta"><div><small>Collection</small>Pynk Project</div><div><small>Season</small>01</div><div><small>Items</small>'+arList.length+'</div><div><small>Document</small>Archive</div><div><small>Rev</small>A</div><div><small>Status</small>Design files, not product photos</div></div>'+
    '<div class="ar-bar"><div class="ar-filters" role="group" aria-label="Filter">'+F2.map(f=>'<button type="button" data-f="'+f[0]+'" aria-pressed="'+(arFilter===f[0])+'">'+f[1]+' ('+counts[f[0]]+')</button>').join('')+'</div>'+
    '<button type="button" class="ar-shuffle" id="arShuffle">Shuffle</button></div>'+
    '<div class="ar-board" id="arBoard" aria-label="Archive sheets. Drag them around or open one."></div>';
  const board=document.getElementById('arBoard');
  const show=arList.filter(a=>arFilter==='all'||arGroup(a.cat)===arFilter);
  board.innerHTML=show.map(a=>'<button type="button" class="ar-card" data-code="'+a.code+'" aria-label="'+a.code+' '+a.it.name+'">'+
    '<div class="ar-top"><b>'+a.code+'</b><span>'+a.cat+'</span></div>'+
    '<div class="ar-fig"><i class="cm tl"></i><i class="cm tr"></i><i class="cm bl"></i><i class="cm br"></i><img src="'+arSrc(a)+'" alt="" draggable="false"><span class="dim-w"><b class="w">W</b></span><span class="dim-h"><b class="h">H</b></span></div>'+
    '<dl class="ar-spec"><dt>Name</dt><dd>'+a.it.name+'</dd><dt>Colorway</dt><dd class="sw"></dd></dl></button>').join('');
  show.forEach(a=>{if(a.w)fillCard(board.querySelector('[data-code="'+a.code+'"]'),a)});
  requestAnimationFrame(()=>arScatter(board));
}
/* archive board motion: drag, flick, two-finger rotate + resize, tap to open */
function arApply(c){c.style.transform='translate3d('+c._x+'px,'+c._y+'px,0) rotate('+c._r+'deg) scale('+c._s+')'}
function arClamp(c){const b=c.parentNode;if(!b)return;const W=b.clientWidth,H=b.clientHeight,w=c.offsetWidth,h=c.offsetHeight;
  c._x=Math.min(Math.max(c._x,-w*.4),W-w*.6);c._y=Math.min(Math.max(c._y,-h*.3),H-h*.5)}
let arZ=10;
function arScatter(board){const W=board.clientWidth,H=board.clientHeight,cw=Math.max(140,Math.min(220,W*.42));
  [...board.children].forEach(c=>{c.style.setProperty('--cw',cw+'px');c._s=1;c._r=(Math.random()-.5)*16;
    c._x=Math.random()*Math.max(1,W-cw);c._y=Math.random()*Math.max(1,H-c.offsetHeight*.7);c._vx=c._vy=0;arClamp(c);c.style.zIndex=++arZ;arApply(c)})}
const AG={c:null,pts:new Map(),moved:false,two:false};
function agOne(){const p=[...AG.pts.values()][0];AG.sx=AG.lx=p.x;AG.sy=AG.ly=p.y;AG.bx=AG.c._x;AG.by=AG.c._y;AG.lt=performance.now();AG.two=false}
function agTwo(){const [p,q]=[...AG.pts.values()];AG.a0=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI;AG.r0=AG.c._r;AG.d0=Math.hypot(q.x-p.x,q.y-p.y)||1;AG.s0=AG.c._s;AG.mx=(p.x+q.x)/2;AG.my=(p.y+q.y)/2;AG.bx=AG.c._x;AG.by=AG.c._y;AG.two=true;AG.moved=true}
pgArchive.addEventListener('pointerdown',e=>{const c=e.target.closest('.ar-card');if(!c||AG.c||(e.pointerType==='mouse'&&e.button!==0))return;
  AG.c=c;AG.pts.clear();AG.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});AG.moved=false;try{c.setPointerCapture(e.pointerId)}catch(_){}
  cancelAnimationFrame(c._raf);c._vx=c._vy=0;c.style.zIndex=++arZ;c.classList.add('held');agOne()});
document.addEventListener('pointerdown',e=>{if(!AG.c||AG.pts.has(e.pointerId)||AG.pts.size>=2)return;e.stopPropagation();e.preventDefault();AG.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});agTwo()},true);
document.addEventListener('pointermove',e=>{const c=AG.c;if(!c||!AG.pts.has(e.pointerId))return;AG.pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(AG.two&&AG.pts.size===2){const [p,q]=[...AG.pts.values()];let d=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI-AG.a0;if(d>180)d-=360;if(d<-180)d+=360;
    c._r=AG.r0+d;c._s=Math.min(2.6,Math.max(.5,AG.s0*Math.hypot(q.x-p.x,q.y-p.y)/AG.d0));c._x=AG.bx+(p.x+q.x)/2-AG.mx;c._y=AG.by+(p.y+q.y)/2-AG.my;arClamp(c);arApply(c);return}
  const dx=e.clientX-AG.sx,dy=e.clientY-AG.sy;if(!AG.moved&&Math.hypot(dx,dy)>6)AG.moved=true;if(!AG.moved)return;
  const now=performance.now(),dt=Math.max(now-AG.lt,1);c._vx=(e.clientX-AG.lx)/dt*16;c._vy=(e.clientY-AG.ly)/dt*16;AG.lt=now;AG.lx=e.clientX;AG.ly=e.clientY;
  c._x=AG.bx+dx;c._y=AG.by+dy;arClamp(c);arApply(c)});
function agEnd(e){const c=AG.c;if(!c||!AG.pts.has(e.pointerId))return;AG.pts.delete(e.pointerId);
  if(AG.pts.size===1){c._vx=c._vy=0;agOne();AG.moved=true;return}
  AG.c=null;c.classList.remove('held');
  if(!AG.moved){if(e.type==='pointerup')openArchive(c.dataset.code,c);return}
  if(!reduce&&!AG.two){const step=()=>{c._vx*=.92;c._vy*=.92;if(Math.abs(c._vx)<.2&&Math.abs(c._vy)<.2)return;c._x+=c._vx;c._y+=c._vy;const px=c._x,py=c._y;arClamp(c);if(c._x!==px)c._vx*=-.4;if(c._y!==py)c._vy*=-.4;arApply(c);c._raf=requestAnimationFrame(step)};c._raf=requestAnimationFrame(step)}
  AG.two=false}
document.addEventListener('pointerup',agEnd);document.addEventListener('pointercancel',agEnd);
pgArchive.addEventListener('wheel',e=>{const c=e.target.closest('.ar-card');if(!c)return;e.preventDefault();c._s=Math.min(2.6,Math.max(.5,c._s*Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015))));c.style.zIndex=++arZ;arApply(c)},{passive:false});
pgArchive.addEventListener('keydown',e=>{const c=e.target.closest&&e.target.closest('.ar-card');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openArchive(c.dataset.code,c)}});
addEventListener('resize',()=>{const b=document.getElementById('arBoard');if(b&&!pgArchive.hidden)[...b.children].forEach(c=>{arClamp(c);arApply(c)})});
function fillCard(card,a){if(!card)return;card.querySelector('.w').textContent='W '+a.w+' PX';card.querySelector('.h').textContent='H '+a.h+' PX';
  card.querySelector('.sw').innerHTML=a.cols.map(c=>'<i style="background:'+c+'" title="'+c+'"></i>').join('')}
pgArchive.addEventListener('click',e=>{
  const f=e.target.closest('[data-f]');if(f){arFilter=f.dataset.f;SFX.select();buildArchive();return}
  if(e.target.closest('#arShuffle')){SFX.select();arScatter(document.getElementById('arBoard'))}
});
const arDlg=document.getElementById('arDlg'),arSheet=document.getElementById('arSheet');let arOpener=null;
function openArchive(code,from){
  const a=arList.find(x=>x.code===code);if(!a)return;arOpener=from;SFX.select();
  const extra=a.cat==='Sticker'||a.cat==='Mark'?['Print method','PRINT METHOD']:['Construction','CONSTRUCTION NOTES'];
  arSheet.innerHTML='<div class="ar-top"><b id="arDlgTitle">'+a.code+' / '+a.it.name+'</b><button type="button" class="x" id="arClose">Close</button></div>'+
   '<div class="ar-body"><div class="ar-fig"><i class="cm tl"></i><i class="cm tr"></i><i class="cm bl"></i><i class="cm br"></i><img src="'+arSrc(a)+'" alt="'+a.it.name+'"><span class="dim-w"><b>W '+a.w+' PX</b></span><span class="dim-h"><b>H '+a.h+' PX</b></span></div>'+
   '<dl class="ar-spec"><dt>Code</dt><dd>'+a.code+'</dd><dt>Name</dt><dd>'+a.it.name+'</dd><dt>Category</dt><dd>'+a.cat+'</dd><dt>Collection</dt><dd>Pynk Project / 01</dd>'+
   '<dt>Colorway</dt><dd class="sw">'+a.cols.map(c=>'<span><i style="background:'+c+'"></i>'+c+'</span>').join('')+'</dd>'+
   '<dt>Source size</dt><dd>'+a.w+' x '+a.h+' PX</dd><dt>Pantone</dt><dd>'+F('TBD')+'</dd><dt>'+extra[0]+'</dt><dd>'+F(extra[1])+'</dd><dt>Status</dt><dd>Archived, not for sale</dd><dt>Notes</dt><dd>'+F('NOTES')+'</dd></dl></div>';
  arDlg.classList.add('on');document.getElementById('arClose').focus({preventScroll:true});
}
function closeArchive(){if(!arDlg.classList.contains('on'))return;arDlg.classList.remove('on');if(arOpener)arOpener.focus({preventScroll:true})}
arDlg.addEventListener('click',e=>{if(e.target===arDlg||e.target.id==='arClose')closeArchive()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeArchive()});

/* moving grid behind the archive */
(function(){let x=0,y=0,last=performance.now();const SPEED=25,SIZE=40;
  function frame(now){const dt=Math.min((now-last)/1000,.1);last=now;
    if(!pgArchive.hidden&&!reduce){x=(x+SPEED*dt)%SIZE;y=(y+SPEED*dt)%SIZE;pgArchive.style.backgroundPosition=x.toFixed(1)+'px '+y.toFixed(1)+'px'}
    requestAnimationFrame(frame)}
  requestAnimationFrame(frame)})();
/* mirror the side art on the right */
(function(){const l=document.querySelector('.side-art');if(!l)return;const r=l.cloneNode(true);r.classList.add('right');l.parentNode.insertBefore(r,l.nextSibling);
  new MutationObserver(()=>{r.textContent=l.textContent}).observe(l,{childList:true,characterData:true,subtree:true})})();
/* router */
const LEGAL_PAGES=['privacy','terms','refunds','shipping'];
function route(){
  let r=(location.hash.slice(1)||'home').toLowerCase();
  /* old #privacy, #terms, #refunds and #shipping links go to the standalone pages */
  if(LEGAL_PAGES.includes(r)){location.replace(r+'/');return}
  if(r==='random'){randomHits++;if(randomHits>=randomTarget){randomHits=0;randomTarget=1+Math.floor(Math.random()*2);
      const sp=lastSpecial?(lastSpecial==='booth'?'video':'booth'):(Math.random()<.5?'booth':'video');lastSpecial=sp;
      location.replace('#'+sp);if(sp==='booth'&&unlocked)boothToast();return}
    const pool=ROUTES.filter(x=>x!==lastRoute&&x!=='booth'&&x!=='video');location.replace('#'+pool[Math.floor(Math.random()*pool.length)]);return}
  if(!ROUTES.includes(r))r='home';
  const home=r==='home'||r==='video';
  document.documentElement.classList.toggle('is-home',home);
  document.documentElement.classList.toggle('show-clouds',r!=='booth');
  stage.hidden=!home;foot.hidden=!home;showVideo(r==='video'&&(unlocked||OPEN_ROUTES.includes(r)));
  curRoute=r;
  const locked=isLocked(r);
  pgLock.hidden=!locked;
  if(locked){showVideo(false);stage.hidden=true;foot.hidden=true;pgShop.hidden=true;pgText.hidden=true;pgBooth.hidden=true;pgArchive.hidden=true;closeArchive();
    document.documentElement.classList.remove('is-home');document.getElementById('lockErr').textContent='';
    closePop();clearTimeout(window._popT);window._popT=setTimeout(()=>{if(!pgLock.hidden)openPop()},350);
    if(lastRoute!==null&&lastRoute!==r)SFX.nav();lastRoute=r;document.title='Locked | soleilsportswear';return}
  closePop();
  pgShop.hidden=!SHOP[r];pgText.hidden=!TEXT[r];pgBooth.hidden=r!=='booth';pgArchive.hidden=r!=='archive';closeArchive();
  if(r==='archive'){buildArchive();pgArchive.scrollTop=0}
  if(r==='booth'){pgBooth.scrollTop=0;requestAnimationFrame(initBooth)}
  if(home&&!scattered){scattered=true;requestAnimationFrame(scatter)}
  if(home&&window._fillSideArt)requestAnimationFrame(window._fillSideArt);
  if(SHOP[r]){
    buildShop(r);
    let idx=0;if(pendingShape){const k=SHOP[r].items.findIndex(x=>x.shape===pendingShape);if(k>=0)idx=k;pendingShape=null}
    select(idx,false);pgShop.scrollTop=0;
  }
  if(r==='cart')pgText.hidden=false;
  if(TEXT[r]){pgText.innerHTML=TEXT[r];pgText.scrollTop=0}
  if(r==='cart'){drawCart();pgText.scrollTop=0}
  if(lastRoute!==null&&lastRoute!==r)SFX.nav();
  lastRoute=r;
  document.title=(r==='home'?'soleilsportswear':r.toUpperCase()+' | soleilsportswear');
}
addEventListener('hashchange',route);
saveCart();
route();
