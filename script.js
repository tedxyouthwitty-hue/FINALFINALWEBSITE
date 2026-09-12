/* =========================================================
   TEDxWittyIntlSchoolYouth — script.js
   Handles: countdown timer, scroll-driven corner morph shape.
   ========================================================= */

/* ---------- Countdown ----------
   EDITABLE: change the target date/time below if it changes.
   Format: new Date("YYYY-MM-DDTHH:MM:SS")
*/
const EVENT_DATE = new Date("2026-10-10T09:00:00");

function updateCountdown() {
  const now = new Date();
  const diff = EVENT_DATE - now;

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-mins");
  const secsEl = document.getElementById("cd-secs");

  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minsEl.textContent = "00";
    secsEl.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minsEl.textContent = String(mins).padStart(2, "0");
  secsEl.textContent = String(secs).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ---------- Corner scroll butterfly life-cycle ----------
   Egg (0–25%) -> Caterpillar (25–50%) -> Chrysalis (50–75%) -> Butterfly (75–100%)
   Purely decorative; does not block any content or interaction.
*/
const STAGES = ["stage-egg", "stage-caterpillar", "stage-chrysalis", "stage-butterfly"];
const STAGE_LABELS = ["Egg", "Caterpillar", "Chrysalis", "Butterfly"];
const morphLabel = document.getElementById("morphLabel");

function setStage(progress) {
  let idx;
  if (progress < 0.25) idx = 0;
  else if (progress < 0.5) idx = 1;
  else if (progress < 0.75) idx = 2;
  else idx = 3;

  STAGES.forEach((id, i) => {
    document.getElementById(id).classList.toggle("active", i === idx);
  });
  morphLabel.textContent = STAGE_LABELS[idx];
}

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
  setStage(progress);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* =========================================================
   CUSTOM CURSOR
   A small dot + a lagging ring follow the mouse. The ring
   grows and a text label appears when hovering interactive
   elements (links, buttons, OC names).
   Automatically disabled on touch devices (see CSS + check below).
   ========================================================= */

const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

if (!isTouchDevice) {
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  const cursorLabel = document.getElementById("cursorLabel");

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
    cursorLabel.style.left = mouseX + "px";
    cursorLabel.style.top = mouseY + "px";
  });

  function animateCursorRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    requestAnimationFrame(animateCursorRing);
  }
  animateCursorRing();

  // Generic hover state for links/buttons
  const hoverTargets = document.querySelectorAll("a, button, .oc-item");
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("hover"));
  });
} else {
  // Hide custom cursor entirely on touch devices; default cursor/touch behavior applies
  document.body.classList.add("touch-device");
}

/* =========================================================
   OC SECTION — cursor-following photo preview on hover
   ========================================================= */

if (!isTouchDevice) {
  const ocItems = document.querySelectorAll(".oc-item");
  const ocPreview = document.getElementById("ocPreview");
  const ocPreviewImg = document.getElementById("ocPreviewImg");
  const ocPreviewFallback = document.getElementById("ocPreviewFallback");
  const cursorLabel = document.getElementById("cursorLabel");

  ocItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const imgSrc = item.dataset.img;
      if (imgSrc && imgSrc.trim() !== "") {
        ocPreviewImg.src = imgSrc;
        ocPreviewImg.style.display = "block";
        ocPreviewFallback.style.display = "none";
      } else {
        ocPreviewImg.style.display = "none";
        ocPreviewFallback.style.display = "flex";
      }
      ocPreview.classList.add("visible");
      cursorLabel.classList.add("show");
      cursorLabel.textContent = "View";
    });

    item.addEventListener("mouseleave", () => {
      ocPreview.classList.remove("visible");
      cursorLabel.classList.remove("show");
    });

    item.addEventListener("mousemove", (e) => {
      ocPreview.style.left = e.clientX + "px";
      ocPreview.style.top = (e.clientY - 30) + "px";
    });
  });
}

/* =========================================================
   PARTICLE / DUST TEXT — "METAMORPHOSIS"
   Renders the word as a field of small dots. Moving the
   cursor nearby scatters the dots; they spring back to
   form the word again — a literal fragmentation/reformation
   tied to the Metamorphosis theme.
   ========================================================= */

(function initParticleText() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: -9999, y: -9999 };

  function resizeCanvas() {
    const section = canvas.parentElement;
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    particles = [];
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    const offCtx = off.getContext("2d");
    offCtx.fillStyle = "#fff";

    const fontSize = Math.min(canvas.width / 8, 110);
    offCtx.font = `bold ${fontSize}px Georgia, serif`;
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText("METAMORPHOSIS", canvas.width / 2, canvas.height / 2);

    const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    const gap = window.innerWidth < 700 ? 5 : 4;

    for (let y = 0; y < canvas.height; y += gap) {
      for (let x = 0; x < canvas.width; x += gap) {
        const idx = (y * canvas.width + x) * 4;
        if (imageData[idx + 3] > 128) {
          particles.push({ x, y, baseX: x, baseY: y, vx: 0, vy: 0 });
        }
      }
    }
  }

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });
  // Basic touch support: scatter around touch point too
  canvas.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (touch) {
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    }
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e62b1e";

    particles.forEach((p) => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 85;

      if (dist < repelRadius) {
        const force = (repelRadius - dist) / repelRadius;
        const angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * 4;
        p.vy += Math.sin(angle) * force * 4;
      }

      p.vx += (p.baseX - p.x) * 0.04;
      p.vy += (p.baseY - p.y) * 0.04;
      p.vx *= 0.82;
      p.vy *= 0.82;
      p.x += p.vx;
      p.y += p.vy;

      ctx.fillRect(p.x, p.y, 2, 2);
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  animate();
})();
