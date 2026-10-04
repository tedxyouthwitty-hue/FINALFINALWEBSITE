/* Full-screen menu + metamorphosis scroll progress bar */
(function(){
  var toggle=document.getElementById("menuToggle"),
      overlay=document.getElementById("menuOverlay"),
      label=toggle&&toggle.querySelector(".menu-toggle-text");
  if(toggle&&overlay){
    function open(){
      overlay.hidden=false;
      requestAnimationFrame(function(){overlay.classList.add("open")});
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded","true");
      if(label)label.textContent="Close";
    }
    function close(){
      overlay.classList.remove("open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded","false");
      if(label)label.textContent="Menu";
      setTimeout(function(){if(!overlay.classList.contains("open"))overlay.hidden=true},350);
    }
    toggle.addEventListener("click",function(){overlay.classList.contains("open")?close():open()});
    overlay.querySelectorAll("a").forEach(function(a){a.addEventListener("click",close)});
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&overlay.classList.contains("open"))close()});
  }

  var fill=document.getElementById("navProgressFill"),
      stages=[].slice.call(document.querySelectorAll(".nav-progress-stage")),
      ticking=false;
  function update(){
    ticking=false;
    var h=document.documentElement.scrollHeight-innerHeight,
        p=h>0?Math.min(Math.max(scrollY/h,0),1):0;
    if(fill)fill.style.transform="scaleX("+p+")";
    var cur=p<.25?0:p<.5?1:p<.75?2:3;
    stages.forEach(function(s,i){
      s.classList.toggle("reached",i<=cur);
      s.classList.toggle("current",i===cur);
    });
  }
  addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  addEventListener("resize",update);
  update();
})();
