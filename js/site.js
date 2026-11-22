(function(){
  const panels=[...document.querySelectorAll('[data-panel]')], tabs=[...document.querySelectorAll('.tab')];
  function go(id,push){
    if(!panels.some(p=>p.dataset.panel===id)) id='inicio';
    panels.forEach(p=>p.hidden=p.dataset.panel!==id);
    tabs.forEach(t=>t.setAttribute('aria-selected',t.dataset.go===id?'true':'false'));
    if(push){try{history.replaceState(null,'','#'+id)}catch(e){}}
    window.scrollTo({top:0,behavior:'auto'});
  }
  document.addEventListener('click',e=>{const el=e.target.closest('[data-go]');if(!el)return;e.preventDefault();go(el.dataset.go,true)});
  go((location.hash||'#inicio').slice(1),false);
  window.addEventListener('hashchange',()=>go(location.hash.slice(1),false));

  const chips=[...document.querySelectorAll('.chip[data-f]')], items=[...document.querySelectorAll('.item')];
  chips.forEach(c=>c.addEventListener('click',()=>{chips.forEach(x=>x.setAttribute('aria-pressed',x===c?'true':'false'));const f=c.dataset.f;items.forEach(i=>i.hidden=!!f&&i.dataset.a!==f)}));

  const fchips=[...document.querySelectorAll('[data-ff]')], groups=[...document.querySelectorAll('.fgroup')];
  fchips.forEach(c=>c.addEventListener('click',()=>{fchips.forEach(x=>x.setAttribute('aria-pressed',x===c?'true':'false'));const f=c.dataset.ff;groups.forEach(g=>g.hidden=!!f&&g.dataset.a!==f)}));
  document.getElementById('f').addEventListener('submit',e=>{
    e.preventDefault();
    const n=document.getElementById('f-nome').value.trim(), a=document.getElementById('f-area').value, m=document.getElementById('f-msg').value.trim();
    const txt='Olá, meu nome é '+(n||'(não informado)')+'. Assunto: '+a+'.'+(m?' '+m:'');
    const url='https://wa.me/'+(/Trabalho|Penal/.test(a)?'5511958057136':'5511970343931')+'?text='+encodeURIComponent(txt);
    const a2=document.createElement('a');a2.href=url;a2.target='_blank';a2.rel='noopener';document.body.appendChild(a2);a2.click();a2.remove();
  });
})();


/* Fundo em shader: seda marinho com veios dourados, discreto (AnimatedWebs-style WebGL hero) */
(function(){
  var c=document.querySelector('.hero canvas.fx'); if(!c) return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var gl=null; try{gl=c.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'});}catch(e){}
  if(!gl){c.style.background='radial-gradient(120% 90% at 80% 20%,#2a2f78,#151946 60%,#0e1134)';return;}
  var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  var fs='precision mediump float;uniform vec2 r;uniform float t;'+
  'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}'+
  'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}'+
  'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}'+
  'void main(){vec2 uv=gl_FragCoord.xy/r.xy;vec2 p=uv*vec2(r.x/r.y,1.)*1.6;float s=t*.035;'+
  'vec2 q=vec2(fbm(p+s),fbm(p+vec2(5.2,1.3)-s));float f=fbm(p+2.2*q+vec2(s*.6,0.));'+
  'vec3 navy=vec3(.071,.082,.247),deep=vec3(.106,.122,.341),gold=vec3(.77,.63,.35);'+
  'vec3 col=mix(navy,deep,smoothstep(.2,.8,f));'+
  'float vein=smoothstep(.47,.497,abs(fract(f*6.+q.x*2.)-.5));'+
  'col=mix(col,gold*.9,vein*.35*smoothstep(.25,1.,uv.x));'+
  'col+=gold*.06*smoothstep(.55,.95,f)*uv.x;'+
  'col*=.85+.25*smoothstep(1.2,.2,length(uv-vec2(.85,.75)));'+
  'gl_FragColor=vec4(col,1.);}';
  function sh(type,src){var o=gl.createShader(type);gl.shaderSource(o,src);gl.compileShader(o);return o;}
  var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){c.style.background='#151946';return;}
  gl.useProgram(pr);
  var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  var ur=gl.getUniformLocation(pr,'r'),ut=gl.getUniformLocation(pr,'t');
  var scale=.5, visible=true, t0=performance.now(), raf=0;
  function size(){var w=Math.max(1,Math.round(c.clientWidth*scale)),h=Math.max(1,Math.round(c.clientHeight*scale));if(c.width!==w||c.height!==h){c.width=w;c.height=h;gl.viewport(0,0,w,h);}}
  function draw(now){size();gl.uniform2f(ur,c.width,c.height);gl.uniform1f(ut,reduce?12.:(now-t0)/1000+12.);gl.drawArrays(gl.TRIANGLES,0,3);}
  function loop(now){draw(now);if(visible&&!reduce)raf=requestAnimationFrame(loop);}
  if('IntersectionObserver' in window){new IntersectionObserver(function(e){visible=e[0].isIntersecting;cancelAnimationFrame(raf);if(visible&&!reduce)raf=requestAnimationFrame(loop);}).observe(c);}
  addEventListener('resize',function(){draw(performance.now());});
  requestAnimationFrame(loop);
})();


(function(){
  var top=document.querySelector('.top'); if(!top) return;
  var root=document.documentElement, ticking=false;
  function px(n){return parseFloat(getComputedStyle(root).getPropertyValue(n))||0;}
  function update(){
    ticking=false;
    var max=px('--logo-max'), min=px('--logo-min'), range=220;
    var k=Math.min(1,Math.max(0,scrollY/range));
    k=k*k*(3-2*k);
    top.style.setProperty('--logo',(max-(max-min)*k).toFixed(1)+'px');
    top.classList.toggle('is-shrunk',k>0.98);
  }
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',update);
  update();
})();
