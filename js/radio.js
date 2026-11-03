/* SOLEIL radio
   One Webamp player for the whole site. The music bar and the /radio page both control this same player,
   so the audio never restarts. This file does not depend on the rest of the site, so it can move into a
   Shopify theme as is (load it once in theme.liquid, outside the content that page transitions swap).

   Options on the script tag (all optional):
     data-tracks  tracklist JSON (default radio/tracks.json)
     data-skin    Winamp skin (default assets/skins/soleil_radio_v1.wsz)
   Track URLs in the JSON are relative to the site root. */
(function(){
  const WEBAMP_URL='https://cdn.jsdelivr.net/npm/webamp@2.3.1/built/webamp.bundle.min.mjs';
  const me=document.currentScript,root=new URL('.',document.baseURI);
  const TRACKS_URL=new URL((me&&me.dataset.tracks)||'radio/tracks.json',root).href;
  const SKIN_URL=new URL((me&&me.dataset.skin)||'assets/skins/soleil_radio_v1.wsz',root).href;
  /* base window sizes in Winamp pixels: three 275 x 116 windows stacked */
  const W=275,H=348;

  let wa=null,loading=null,host=null,zoom=1,last='',failed=false,rendered=null;
  const subs=[];
  const emit=()=>subs.forEach(f=>{try{f()}catch(_){}});

  function load(){
    if(loading)return loading;
    /* iPhones: play through the silent switch like a music app */
    try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(_){}
    loading=Promise.all([import(WEBAMP_URL),fetch(TRACKS_URL).then(r=>{if(!r.ok)throw new Error('tracks');return r.json()})])
      .then(([mod,list])=>{
        const Webamp=mod.default;
        if(Webamp.browserIsSupported&&!Webamp.browserIsSupported())throw new Error('unsupported');
        const tracks=list.map(t=>({url:new URL(t.url,root).href,duration:t.duration,metaData:{artist:t.artist||'',title:t.title}}));
        tracks.forEach(t=>{meta[t.url]=t.metaData});
        /* lock screen controls are set up below so they also work while the page is away */
        wa=new Webamp({initialSkin:{url:SKIN_URL},initialTracks:tracks,enableMediaSession:false,enableHotkeys:false,
          windowLayout:{main:{position:{top:0,left:0}},equalizer:{position:{top:116,left:0}},playlist:{position:{top:232,left:0}}}});
        if(!wa.isRepeatEnabled())wa.toggleRepeat();
        /* the player stays open; closing it would leave the music bar with nothing to control */
        wa.onWillClose(cancel=>cancel());
        wa.onTrackDidChange(t=>{if(t&&t.url)curUrl=t.url;session();emit()});
        session();
        setInterval(()=>{const s=wa.getMediaStatus();if(s!==last){last=s;emit()}},300);
        emit();mount();return wa;
      })
      .catch(e=>{failed=true;emit();throw e});
    return loading;
  }

  /* ---------- Playing on when the page leaves the screen ----------
     Webamp plays through Web Audio (that is what drives its equalizer and visualizer), and phones pause
     Web Audio as soon as the page leaves the screen. So on phones, when the page is hidden mid-song, a plain
     audio element picks up the same song at the same second and keeps going; when the page comes back,
     Webamp takes over where it left off. */
  const bg=new Audio(),meta={},coarse=matchMedia('(pointer: coarse)').matches;
  bg.preload='auto';bg.setAttribute('playsinline','');
  let away=false,primed=false,curUrl=null;
  const order=()=>{try{const st=wa.store.getState();return st.playlist.trackOrder.map(id=>st.tracks[id].url)}catch(_){return Object.keys(meta)}};
  const elapsed=()=>{try{return wa.store.getState().media.timeElapsed||0}catch(_){return 0}};
  const nowUrl=()=>away?bg.getAttribute('src'):(curUrl||order()[0]);
  /* phones only let an audio element start on its own later if it was started once during a tap */
  function prime(){if(primed||!wa||away)return;const u=nowUrl();if(!u)return;
    if(bg.getAttribute('src')!==u)bg.src=u;bg.muted=true;const p=bg.play();
    if(p&&p.then)p.then(()=>{if(!away)bg.pause();bg.muted=false;primed=true}).catch(()=>{bg.muted=false})}
  ['touchend','click','keydown'].forEach(t=>addEventListener(t,prime,{capture:true,passive:true}));
  function goAway(){if(away||!wa||wa.getMediaStatus()!=='PLAYING')return;const u=nowUrl();if(!u)return;
    const t=elapsed();away=true;if(bg.getAttribute('src')!==u)bg.src=u;
    try{bg.currentTime=t}catch(_){}bg.muted=false;const p=bg.play();if(p&&p.catch)p.catch(()=>{});
    wa.pause();session();emit()}
  function comeBack(){if(!away)return;away=false;
    const on=!bg.paused,t=bg.currentTime,u=bg.getAttribute('src');bg.pause();
    const i=order().indexOf(u);if(i>=0&&u!==curUrl)wa.setCurrentTrack(i);
    /* a song that just changed may still be loading, so keep asking until the jump takes */
    const t0=performance.now(),want=()=>t+(on?(performance.now()-t0)/1000:0);let tries=0;
    const seek=()=>{try{wa.seekToTime(want())}catch(_){}setTimeout(()=>{if(!away&&Math.abs(elapsed()-want())>1.5&&++tries<12)seek()},250)};
    seek();if(on)wa.play();session();emit()}
  function bgStep(d){const o=order(),i=o.indexOf(bg.getAttribute('src'));if(!o.length)return;
    bg.src=o[((i<0?0:i)+d+o.length)%o.length];bg.play().catch(()=>{});session()}
  bg.addEventListener('ended',()=>{if(away)bgStep(1)});
  bg.addEventListener('play',()=>{if(away)emit()});bg.addEventListener('pause',()=>{if(away)emit()});
  document.addEventListener('visibilitychange',()=>{if(!coarse)return;if(document.hidden)goAway();else comeBack()});
  addEventListener('pageshow',()=>{if(!document.hidden)comeBack()});
  /* lock screen and headphone controls */
  function session(){if(!('mediaSession' in navigator))return;const m=meta[nowUrl()];if(!m)return;
    try{navigator.mediaSession.metadata=new MediaMetadata({title:m.title,artist:m.artist||'',album:'SOLEIL radio'})}catch(_){}}
  if('mediaSession' in navigator){const h=(a,f)=>{try{navigator.mediaSession.setActionHandler(a,f)}catch(_){}};
    h('play',()=>{if(away)bg.play().catch(()=>{});else if(wa)wa.play()});
    h('pause',()=>{if(away)bg.pause();else if(wa)wa.pause()});
    h('nexttrack',()=>{if(away)bgStep(1);else if(wa)wa.nextTrack()});
    h('previoustrack',()=>{if(away)bgStep(-1);else if(wa)wa.previousTrack()})}

  /* The player is drawn only once its stage (#radioStage on /radio) is on screen: Webamp centers the
     windows in the stage when it first draws, and windows can be dragged anywhere inside it.
     The music plays without it, so the bar works on every page before /radio is ever opened. */
  function stage(){return document.getElementById('radioStage')}
  function mount(){
    const box=stage();if(!wa||rendered||!box||!box.clientWidth)return;
    host=document.createElement('div');host.className='radio-host';box.appendChild(host);fit();
    /* one tap or click on a song plays it (Winamp itself needs a double click) */
    const cellAt=t=>t&&t.closest&&t.closest('.track-cell');
    const playCell=cell=>{const i=[...cell.parentElement.children].indexOf(cell),titles=host.querySelector('.playlist-track-titles');
      const m=titles&&titles.children[i]&&/^\s*(\d+)\./.exec(titles.children[i].textContent);if(!m)return;
      wa.setCurrentTrack(+m[1]-1);wa.play()};
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

  window.SoleilRadio={
    load,fit,show(){load().then(()=>{mount();fit()}).catch(()=>{})},
    get ready(){return !!wa},
    get failed(){return failed},
    get away(){return away},
    get position(){return away?bg.currentTime:elapsed()},
    get song(){const m=meta[nowUrl()];return m?m.title:''},
    get webamp(){return wa},
    playing:()=>away?!bg.paused:!!wa&&wa.getMediaStatus()==='PLAYING',
    play(){if(wa)wa.play();else load().then(()=>wa.play()).catch(()=>{})},
    pause(){if(wa)wa.pause()},
    next(){if(wa){wa.nextTrack();if(wa.getMediaStatus()!=='PLAYING')wa.play()}else load().then(()=>wa.play()).catch(()=>{})},
    onChange(f){subs.push(f)}
  };
})();
