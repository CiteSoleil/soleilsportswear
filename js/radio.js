/* SOLEIL radio
   One Webamp player for the whole site. The music bar and the /radio page both control this same player,
   so the audio never restarts. This file does not depend on the rest of the site, so it can move into a
   Shopify theme as is (load it once in theme.liquid, outside the content that page transitions swap).

   Options on the script tag (all optional):
     data-tracks  playlists JSON (default radio/tracks.json)
     data-skin    Winamp skin (default assets/skins/soleil_radio_v1.wsz)
   Track URLs in the JSON are relative to the site root.

   Playlists: radio/tracks.json holds {"playlists":[{"name":"SOLEIL","tracks":[...]}, ...]} (a plain list
   of tracks still works and becomes one playlist called SOLEIL). The first playlist plays by default.
   A playlist with no songs yet shows as Coming soon. Listeners pick one from Load list in the player's
   LIST menu, or from any element with data-radio-pick (the PLAYLIST line under the player). */
(function(){
  const WEBAMP_URL='https://cdn.jsdelivr.net/npm/webamp@2.3.1/built/webamp.bundle.min.mjs';
  const me=document.currentScript,root=new URL('.',document.baseURI);
  const TRACKS_URL=new URL((me&&me.dataset.tracks)||'radio/tracks.json',root).href;
  const SKIN_URL=new URL((me&&me.dataset.skin)||'assets/skins/soleil_radio_v1.wsz',root).href;
  /* base window sizes in Winamp pixels: three 275 x 116 windows stacked */
  const W=275,H=348;

  const PICK_KEY='ssw-playlist';
  let wa=null,loading=null,host=null,zoom=1,last='',failed=false,rendered=null,lists=[],current='';
  const subs=[];
  const emit=()=>subs.forEach(f=>{try{f()}catch(_){}});

  function toTrack(t){return{url:new URL(t.url,root).href,duration:t.duration,metaData:{artist:t.artist||'',title:t.title}}}

  function load(){
    if(loading)return loading;
    /* iPhones: play through the silent switch like a music app */
    try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(_){}
    loading=Promise.all([import(WEBAMP_URL),fetch(TRACKS_URL).then(r=>{if(!r.ok)throw new Error('tracks');return r.json()})])
      .then(([mod,list])=>{
        const Webamp=mod.default;
        if(Webamp.browserIsSupported&&!Webamp.browserIsSupported())throw new Error('unsupported');
        lists=Array.isArray(list)?[{name:'SOLEIL',tracks:list}]:(list.playlists||[]);
        lists=lists.map(p=>({name:String(p.name||''),tracks:(p.tracks||[]).map(toTrack)})).filter(p=>p.name);
        let saved='';try{saved=localStorage.getItem(PICK_KEY)||''}catch(_){}
        const start=lists.find(p=>p.name===saved&&p.tracks.length)||lists.find(p=>p.tracks.length);
        if(!start)throw new Error('tracks');
        current=start.name;syncPick();
        wa=new Webamp({initialSkin:{url:SKIN_URL},initialTracks:start.tracks,enableMediaSession:true,enableHotkeys:false,
          windowLayout:{main:{position:{top:0,left:0}},equalizer:{position:{top:116,left:0}},playlist:{position:{top:232,left:0}}}});
        if(!wa.isRepeatEnabled())wa.toggleRepeat();
        /* the player stays open; closing it would leave the music bar with nothing to control */
        wa.onWillClose(cancel=>cancel());
        wa.onTrackDidChange(emit);
        setInterval(()=>{const s=wa.getMediaStatus()+heard();if(s!==last){last=s;emit()}},300);
        emit();mount();return wa;
      })
      .catch(e=>{failed=true;emit();throw e});
    return loading;
  }

  /* The player is drawn only once its stage (#radioStage on /radio) is on screen: Webamp centers the
     windows in the stage when it first draws, and windows can be dragged anywhere inside it.
     The music plays without it, so the bar works on every page before /radio is ever opened. */
  function stage(){return document.getElementById('radioStage')}
  function mount(){
    const box=stage();if(!wa||rendered||!box||!box.clientWidth)return;
    host=document.createElement('div');host.className='radio-host';box.appendChild(host);fit();
    /* Load list in the LIST menu opens the playlist chooser instead of a file picker */
    box.addEventListener('click',e=>{if(!e.target.closest||!e.target.closest('#playlist-list-menu .load-list'))return;
      e.stopPropagation();e.preventDefault();
      /* a click outside the menu closes it, as it would after any menu choice */
      setTimeout(()=>{box.dispatchEvent(new MouseEvent('click',{bubbles:true}))},0);
      openPicker()},true);
    /* one tap or click on a song plays it (Winamp itself needs a double click) */
    const cellAt=t=>t&&t.closest&&t.closest('.track-cell');
    const playCell=cell=>{const i=[...cell.parentElement.children].indexOf(cell),titles=host.querySelector('.playlist-track-titles');
      const m=titles&&titles.children[i]&&/^\s*(\d+)\./.exec(titles.children[i].textContent);if(!m)return;
      wake();wa.setCurrentTrack(+m[1]-1);wa.play()};
    host.addEventListener('click',e=>{const cell=cellAt(e.target);if(!cell||e.shiftKey||e.metaKey||e.ctrlKey)return;playCell(cell)},true);
    /* Phones: Webamp turns the mouse event a phone sends after a tap into a drag that moves the song
       up a row. Taps on songs are handled here and never reach Webamp. */
    let tap=null;
    host.addEventListener('touchstart',e=>{const cell=cellAt(e.target);if(!cell)return;e.stopPropagation();
      const t=e.changedTouches[0];tap={cell,x:t.clientX,y:t.clientY}},{capture:true,passive:true});
    host.addEventListener('touchmove',e=>{if(!tap)return;e.stopPropagation();const t=e.changedTouches[0];
      if(Math.hypot(t.clientX-tap.x,t.clientY-tap.y)>10)tap=null},{capture:true,passive:true});
    host.addEventListener('touchend',e=>{if(!cellAt(e.target))return;e.stopPropagation();e.preventDefault();
      if(tap)playCell(tap.cell);tap=null},{capture:true,passive:false});
    rendered=wa.renderInto(host).then(()=>{fit();emit()})}
  /* scale to the stage: bigger on desktop, full width on phones; the host fills the stage in Winamp pixels */
  function fit(){
    const box=stage();if(!host||!box||!box.clientWidth)return;
    const aw=box.clientWidth,ah=box.clientHeight,pad=aw<720?16:24;
    zoom=Math.max(1,Math.min((aw-pad*2)/W,(ah-pad*2>200?ah-pad*2:Infinity)/H,2.4));zoom=Math.floor(zoom*20)/20;
    host.style.zoom=zoom;host.style.width=(aw/zoom)+'px';host.style.height=(Math.max(ah,H*zoom)/zoom)+'px'}
  addEventListener('resize',()=>{clearTimeout(fit.t);fit.t=setTimeout(fit,120)});

  /* Webamp moves dragged windows by the raw finger distance, which runs ahead of the finger once the
     player is scaled up. Scale the coordinates of mouse and touch events that start on the player so
     windows stay under the finger. Sliders use pointer events and are left alone. */
  let dragging=false;
  const scaleEv=e=>{if(zoom===1)return;
    const fix=o=>{try{const x=o.clientX/zoom,y=o.clientY/zoom;Object.defineProperty(o,'clientX',{value:x,configurable:true});Object.defineProperty(o,'clientY',{value:y,configurable:true})}catch(_){}};
    if(e.touches){[...new Set([...e.touches,...e.targetTouches,...e.changedTouches])].forEach(fix)}else fix(e)};
  /* the song list is left out: Webamp checks list drags against the list's on-screen box, so scaling would reorder songs on a tap */
  ['mousedown','touchstart'].forEach(t=>addEventListener(t,e=>{if(host&&host.contains(e.target)&&!e.target.closest('.playlist-tracks')){dragging=true;scaleEv(e)}},{capture:true,passive:true}));
  ['mousemove','touchmove'].forEach(t=>addEventListener(t,e=>{if(dragging)scaleEv(e)},{capture:true,passive:true}));
  ['mouseup','touchend','touchcancel'].forEach(t=>addEventListener(t,()=>{dragging=false},{capture:true,passive:true}));

  /* Webamp says PLAYING even when the browser blocked the sound (it ignores the failed play), so check
     the real audio: the song element is moving and the Web Audio context is running. */
  function parts(){const m=wa&&wa.media;return{ctx:m&&m._context,el:m&&m._source&&m._source._audio}}
  function heard(){const{ctx,el}=parts();return(!el||!el.paused)&&(!ctx||ctx.state==='running')}
  /* resume the audio inside the tap itself; phones only allow it there */
  function wake(){const{ctx}=parts();if(ctx&&ctx.state!=='running'){try{ctx.resume().then(emit,()=>{})}catch(_){}}}

  /* playlist chooser: a small gray window in the player's style, shared by Load list and the PLAYLIST line */
  let picker=null,pickerFrom=null;
  function syncPick(){document.querySelectorAll('[data-radio-pick]').forEach(b=>{const v=b.querySelector('[data-radio-current]')||b;v.textContent=current||'SOLEIL'})}
  function closePicker(){if(!picker)return;picker.remove();picker=null;removeEventListener('keydown',pickKey,true);
    if(pickerFrom&&pickerFrom.focus)try{pickerFrom.focus({preventScroll:true})}catch(_){}pickerFrom=null}
  function pickKey(e){if(e.key==='Escape'){e.stopPropagation();closePicker()}}
  function openPicker(){
    if(picker)return;pickerFrom=document.activeElement;
    picker=document.createElement('div');picker.className='rp-scrim';
    const win=document.createElement('div');win.className='rp-win';win.setAttribute('role','dialog');win.setAttribute('aria-modal','true');win.setAttribute('aria-labelledby','rpTitle');
    const head=document.createElement('div');head.className='rp-head';
    const title=document.createElement('span');title.id='rpTitle';title.textContent='Playlists';
    const x=document.createElement('button');x.type='button';x.className='rp-x';x.setAttribute('aria-label','Close');x.textContent='\u00D7';x.onclick=closePicker;
    head.append(title,x);
    const ul=document.createElement('ul');ul.className='rp-list';
    lists.forEach(p=>{const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.className='rp-item';
      const n=document.createElement('span');n.textContent=p.name;
      const c=document.createElement('span');c.className='rp-count';
      c.textContent=p.tracks.length?p.tracks.length+(p.tracks.length===1?' song':' songs'):'Coming soon';
      b.append(n,c);
      if(p.name===current){b.classList.add('rp-on');b.setAttribute('aria-current','true')}
      if(!p.tracks.length)b.disabled=true;
      b.onclick=()=>{choose(p.name);closePicker()};
      li.appendChild(b);ul.appendChild(li)});
    win.append(head,ul);picker.appendChild(win);
    picker.addEventListener('click',e=>{if(e.target===picker)closePicker()});
    document.body.appendChild(picker);addEventListener('keydown',pickKey,true);
    const first=win.querySelector('.rp-on')||win.querySelector('.rp-item:not(:disabled)');if(first)first.focus({preventScroll:true})}
  /* swap the songs and start the new playlist; the music bar follows because it controls this same player */
  function choose(name){
    const p=lists.find(q=>q.name===name);if(!p||!p.tracks.length)return;
    try{localStorage.setItem(PICK_KEY,name)}catch(_){}
    if(name===current&&wa){if(wa.getMediaStatus()!=='PLAYING'){wake();wa.play()}return}
    current=name;syncPick();
    if(wa){wake();wa.setTracksToPlay(p.tracks);setTimeout(emit,400)}emit()}
  document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-radio-pick]');if(!b)return;e.preventDefault();
    if(wa)openPicker();else load().then(openPicker).catch(()=>{})});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncPick);else syncPick();

  window.SoleilRadio={
    get playlist(){return current},
    get playlists(){return lists.map(p=>({name:p.name,songs:p.tracks.length}))},
    choose,
    load,fit,show(){load().then(()=>{mount();fit()}).catch(()=>{})},
    get ready(){return !!wa},
    get failed(){return failed},
    playing:()=>!!wa&&wa.getMediaStatus()==='PLAYING'&&heard(),
    play(){if(wa){wake();wa.play();setTimeout(emit,400)}else load().then(()=>{wake();wa.play();setTimeout(emit,400)}).catch(()=>{})},
    pause(){if(wa)wa.pause()},
    next(){if(wa){wake();wa.nextTrack();if(wa.getMediaStatus()!=='PLAYING')wa.play()}else load().then(()=>wa.play()).catch(()=>{})},
    onChange(f){subs.push(f)}
  };
})();
