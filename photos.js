/* Photos: team, speakers and gallery.
   To add a photo, upload it with the matching file name:
   - Team:     assets/team/<first-last>.jpg   (e.g. assets/team/meer-shah.jpg)
   - Speakers: assets/speakers/guest-1..3.jpg and student-1..5.jpg
   - Gallery:  assets/gallery/round2-1.jpg … round2-12.jpg
   Anything not uploaded yet shows a placeholder. */
(function(){
  function load(src, ok, fail){
    if(!src){fail();return}
    var im=new Image();
    im.onload=function(){ok(im)};
    im.onerror=fail;
    im.src=src;
  }

  // Team + speaker photos
  document.querySelectorAll(".person-photo").forEach(function(el){
    var initials=el.dataset.initials||"";
    load(el.dataset.img,function(im){
      im.alt="";im.loading="lazy";
      el.appendChild(im);el.classList.add("has-img");
      var item=el.closest(".oc-item");if(item)item.dataset.photoOk="1";
    },function(){
      el.textContent=initials;el.classList.add("no-img");
    });
  });

  // Gallery
  var items=[].slice.call(document.querySelectorAll(".gallery-item"));
  var loaded=[];
  items.forEach(function(btn,i){
    load(btn.dataset.img,function(im){
      im.alt="Speaker Round 2 photo "+(i+1);im.loading="lazy";
      btn.appendChild(im);btn.classList.add("has-img");
      loaded[i]=btn.dataset.img;
    },function(){
      btn.classList.add("no-img");btn.disabled=true;
      btn.innerHTML='<span>Photo coming soon</span>';
    });
  });

  var box=document.getElementById("lightbox"),boxImg=document.getElementById("lightboxImg"),cur=-1;
  if(!box)return;
  function list(){return loaded.filter(Boolean)}
  function show(src){var l=list();cur=l.indexOf(src);boxImg.src=src;box.hidden=false;document.body.style.overflow="hidden"}
  function step(d){var l=list();if(!l.length)return;cur=(cur+d+l.length)%l.length;boxImg.src=l[cur]}
  function close(){box.hidden=true;boxImg.src="";document.body.style.overflow=""}
  items.forEach(function(btn){btn.addEventListener("click",function(){if(btn.classList.contains("has-img"))show(btn.dataset.img)})});
  document.getElementById("lightboxClose").addEventListener("click",close);
  document.getElementById("lightboxPrev").addEventListener("click",function(){step(-1)});
  document.getElementById("lightboxNext").addEventListener("click",function(){step(1)});
  box.addEventListener("click",function(e){if(e.target===box)close()});
  document.addEventListener("keydown",function(e){if(box.hidden)return;if(e.key==="Escape")close();if(e.key==="ArrowLeft")step(-1);if(e.key==="ArrowRight")step(1)});
})();
