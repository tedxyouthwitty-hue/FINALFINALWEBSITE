const EVENT_DATE=new Date("2026-10-10T09:00:00");
function updateCountdown(){const now=new Date(),diff=EVENT_DATE-now;const d=document.getElementById("cd-days"),h=document.getElementById("cd-hours"),m=document.getElementById("cd-mins"),s=document.getElementById("cd-secs");if(!d)return;if(diff<=0){d.textContent=h.textContent=m.textContent=s.textContent="00";return}d.textContent=String(Math.floor(diff/86400000)).padStart(2,"0");h.textContent=String(Math.floor(diff/3600000)%24).padStart(2,"0");m.textContent=String(Math.floor(diff/60000)%60).padStart(2,"0");s.textContent=String(Math.floor(diff/1000)%60).padStart(2,"0")}
updateCountdown();setInterval(updateCountdown,1000);

const STAGES=["stage-egg","stage-caterpillar","stage-chrysalis","stage-butterfly"],LABELS=["Egg","Caterpillar","Chrysalis","Butterfly"],morphLabel=document.getElementById("morphLabel");
function setStage(p){let i=p<.25?0:p<.5?1:p<.75?2:3;STAGES.forEach((id,n)=>document.getElementById(id)?.classList.toggle("active",n===i));if(morphLabel)morphLabel.textContent=LABELS[i]}
function onScroll(){const h=document.documentElement.scrollHeight-innerHeight;setStage(h>0?Math.min(Math.max(scrollY/h,0),1):0)}
addEventListener("scroll",onScroll,{passive:true});onScroll();

const isTouch=matchMedia("(hover:none),(pointer:coarse)").matches;
if(!isTouch){const dot=document.getElementById("cursorDot"),ring=document.getElementById("cursorRing"),label=document.getElementById("cursorLabel");let mx=-100,my=-100,rx=-100,ry=-100;
addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+"px";dot.style.top=my+"px";label.style.left=mx+"px";label.style.top=my+"px"});
(function loop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(loop)})();
document.querySelectorAll("a,button,.oc-item").forEach(el=>{el.addEventListener("mouseenter",()=>ring.classList.add("hover"));el.addEventListener("mouseleave",()=>ring.classList.remove("hover"))});
const preview=document.getElementById("ocPreview"),img=document.getElementById("ocPreviewImg"),fallback=document.getElementById("ocPreviewFallback");
document.querySelectorAll(".oc-item").forEach(item=>{item.addEventListener("mouseenter",()=>{const src=item.dataset.img;if(src){img.src=src;img.style.display="block";fallback.style.display="none"}else{img.style.display="none";fallback.style.display="flex"}preview.classList.add("visible");label.classList.add("show")});item.addEventListener("mouseleave",()=>{preview.classList.remove("visible");label.classList.remove("show")});item.addEventListener("mousemove",e=>{preview.style.left=e.clientX+"px";preview.style.top=e.clientY-30+"px"})})}
else document.body.classList.add("touch-device");

(function(){const canvas=document.getElementById("particleCanvas");if(!canvas)return;const ctx=canvas.getContext("2d");let particles=[],mouse={x:-9999,y:-9999};
function build(){particles=[];const off=document.createElement("canvas");off.width=canvas.width;off.height=canvas.height;const c=off.getContext("2d");c.fillStyle="#fff";const fs=Math.min(canvas.width/8,110);c.font=`bold ${fs}px Georgia,serif`;c.textAlign="center";c.textBaseline="middle";c.fillText("METAMORPHOSIS",canvas.width/2,canvas.height/2);const data=c.getImageData(0,0,canvas.width,canvas.height).data,gap=innerWidth<700?5:4;for(let y=0;y<canvas.height;y+=gap)for(let x=0;x<canvas.width;x+=gap){if(data[(y*canvas.width+x)*4+3]>128)particles.push({x,y,baseX:x,baseY:y,vx:0,vy:0})}}
function resize(){canvas.width=canvas.parentElement.offsetWidth;canvas.height=canvas.parentElement.offsetHeight;build()}
canvas.addEventListener("mousemove",e=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});canvas.addEventListener("mouseleave",()=>{mouse.x=mouse.y=-9999});
function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle="#e62b1e";particles.forEach(p=>{const dx=p.x-mouse.x,dy=p.y-mouse.y,dist=Math.hypot(dx,dy),radius=85;if(dist<radius){const f=(radius-dist)/radius,a=Math.atan2(dy,dx);p.vx+=Math.cos(a)*f*4;p.vy+=Math.sin(a)*f*4}p.vx+=(p.baseX-p.x)*.04;p.vy+=(p.baseY-p.y)*.04;p.vx*=.82;p.vy*=.82;p.x+=p.vx;p.y+=p.vy;ctx.fillRect(p.x,p.y,2,2)});requestAnimationFrame(animate)}
addEventListener("resize",resize);resize();animate()})();

/* ===== Live seats-left counter (100 total) ===== */
(function(){
  const URL="https://uuazwqjhrrbxoeypizky.supabase.co/rest/v1/rpc/tickets_remaining";
  const KEY="sb_publishable_Xv9dLJJEGOG3Z3k_XeTdKA_X346sb7j";
  const btns=document.querySelectorAll("[data-ticket-btn]");
  const labels=document.querySelectorAll("[data-seats-left]");
  const limited=document.querySelectorAll("[data-limited-seats]");
  if(!labels.length)return;
  function render(left){
    labels.forEach(el=>{
      el.classList.toggle("low",left>0&&left<=20);
      el.innerHTML=left>0?'':'All 100 seats are taken';
    });
    limited.forEach(el=>{el.hidden=left<=0});
    btns.forEach(b=>{
      if(left<=0){b.textContent="House full";b.classList.add("house-full");b.removeAttribute("href");b.setAttribute("aria-disabled","true")}
      else{b.textContent="Get tickets";b.classList.remove("house-full");b.setAttribute("href","tickets.html");b.removeAttribute("aria-disabled")}
    });
  }
  async function refresh(){
    try{
      const r=await fetch(URL,{method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},body:"{}",cache:"no-store"});
      if(!r.ok)return;
      const n=Number(await r.json());
      if(Number.isFinite(n))render(n);
    }catch(e){}
  }
  refresh();
  setInterval(refresh,20000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)refresh()});
})();
