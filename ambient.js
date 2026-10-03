/* Drifting red ember dust behind the whole page */
(function(){
  const c=document.getElementById("emberCanvas");if(!c)return;
  if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  const ctx=c.getContext("2d");let w,h,dpr,parts=[];
  function size(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;c.width=w*dpr;c.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const n=Math.round(Math.min(90,w*h/16000));parts=Array.from({length:n},mk)}
  function mk(){return{x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+.3,vy:-(Math.random()*.25+.05),vx:(Math.random()-.5)*.15,a:Math.random()*.6+.15,t:Math.random()*6.28}}
  function tick(){ctx.clearRect(0,0,w,h);
    for(const p of parts){p.x+=p.vx;p.y+=p.vy;p.t+=.02;
      if(p.y<-5){p.y=h+5;p.x=Math.random()*w}
      const al=p.a*(.6+.4*Math.sin(p.t));
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fillStyle=`rgba(230,${40+(p.r*20|0)},30,${al})`;ctx.shadowColor="rgba(230,43,30,.8)";ctx.shadowBlur=6;ctx.fill()}
    requestAnimationFrame(tick)}
  addEventListener("resize",size);size();tick();
})();
