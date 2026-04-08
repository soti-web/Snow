import { initializeApp } from “https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js”;
import {
getFirestore, doc, getDoc
} from “https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js”;

const firebaseConfig = {
apiKey: “AIzaSyACMH3hBQqS9Jhw-d3xkLlY_RiKr0DOXsI”,
authDomain: “dev-muhamad.firebaseapp.com”,
projectId: “dev-muhamad”,
storageBucket: “dev-muhamad.firebasestorage.app”,
messagingSenderId: “224833840139”,
appId: “1:224833840139:web:365f0ecd685d1c54ea530e”
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BACKGROUNDS = [
{ bg:‘linear-gradient(135deg,#1a0a2e,#0d1b3e)’ },
{ bg:‘linear-gradient(135deg,#0f2027,#203a43,#2c5364)’ },
{ bg:‘linear-gradient(135deg,#1a1a2e,#16213e)’ },
{ bg:‘linear-gradient(135deg,#111,#1a1a1a)’ },
{ bg:‘linear-gradient(135deg,#0f3460,#533483)’ },
{ bg:‘linear-gradient(135deg,#1b4332,#081c15)’ },
{ bg:‘linear-gradient(135deg,#3d0000,#1a0000)’ },
{ bg:‘linear-gradient(135deg,#2d1b69,#11998e)’ },
{ bg:‘linear-gradient(135deg,#4a1942,#c94b4b)’ },
{ bg:‘linear-gradient(135deg,#1a0533,#6b0f6b)’ },
{ bg:‘linear-gradient(135deg,#0a3d62,#1e3799)’ },
{ bg:‘linear-gradient(135deg,#44347a,#fc5c7d)’ },
];

// ─── INJECT PORTFOLIO STYLES ──────────────────────────────────────────────────
(function injectPortfolioStyles() {
if (document.getElementById(‘pf-injected-styles’)) return;
const style = document.createElement(‘style’);
style.id = ‘pf-injected-styles’;
style.textContent = `
@import url(‘https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap’);

```
:root {
  --glass-border: rgba(255,255,255,0.09);
  --text-primary: rgba(255,255,255,0.92);
  --text-secondary: rgba(255,255,255,0.45);
  --text-muted: rgba(255,255,255,0.28);
  --accent: #7c6dfa;
  --accent-glow: rgba(124,109,250,0.3);
}

* { box-sizing: border-box; }

body {
  font-family: 'DM Sans', sans-serif;
  background: #07070f;
  color: var(--text-primary);
  margin: 0;
  min-height: 100vh;
}

/* ── LOADING SCREEN ── */
#loading-screen {
  position: fixed;
  inset: 0;
  background: #07070f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  z-index: 100;
}
.loading-logo {
  font-family: 'Syne', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
}
.loading-logo span { color: var(--accent); }
.loading-bar-wrap {
  width: 120px;
  height: 2px;
  background: rgba(255,255,255,0.08);
  border-radius: 999px;
  overflow: hidden;
}
.loading-bar {
  height: 100%;
  width: 40%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), #fa6d8f);
  animation: loadSlide 1.2s ease-in-out infinite;
}
@keyframes loadSlide {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

/* ── NOT FOUND ── */
#not-found {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 12px;
  padding: 2rem;
  text-align: center;
}
.nf-code {
  font-family: 'Syne', sans-serif;
  font-size: 4rem;
  font-weight: 800;
  color: rgba(255,255,255,0.08);
  line-height: 1;
}
.nf-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}
.nf-sub {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.nf-link {
  margin-top: 8px;
  padding: 10px 22px;
  background: rgba(124,109,250,0.15);
  border: 1px solid rgba(124,109,250,0.3);
  border-radius: 999px;
  color: #a89cfc;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none;
  transition: background 0.15s;
}
.nf-link:hover { background: rgba(124,109,250,0.25); }

/* ── PORTFOLIO WRAP ── */
#portfolio-wrap {
  display: none;
  min-height: 100vh;
}

/* ── PORTFOLIO CARD ── */
.pf-card {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
}

/* ── SECTION LABELS ── */
.pf-section-label {
  font-family: 'Syne', sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.55rem;
}

/* ── SKILL CHIPS ── */
.pf-skill {
  display: inline-block;
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  transition: transform 0.15s;
}
.pf-skill:hover { transform: translateY(-1px); }

/* ── WORK CARD ── */
.pf-work-card {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 0.55rem;
  transition: transform 0.15s;
}
.pf-work-card:hover { transform: translateX(3px); }

/* ── LINK ROW ── */
.pf-link-row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: transform 0.15s, opacity 0.15s;
  font-family: 'DM Sans', sans-serif;
}
.pf-link-row:hover { transform: translateX(4px); opacity: 0.88; }
.pf-link-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* ── FOLIO FOOTER ── */
.pf-footer {
  text-align: center;
  padding: 1rem;
  font-family: 'Syne', sans-serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
}
.pf-footer a { text-decoration: none; opacity: 0.6; transition: opacity 0.15s; }
.pf-footer a:hover { opacity: 1; }

/* ── GLASS SHIMMER ── */
@keyframes glassShimmerPf {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.shimmer-pf {
  position: relative;
  overflow: hidden;
}
.shimmer-pf::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  animation: glassShimmerPf 4s ease-in-out infinite;
}

/* ── SWIPE DOTS ── */
.gp-dots-pf {
  display: flex;
  justify-content: center;
  gap: 7px;
  padding: 0.8rem 0 0.5rem;
}
.gp-dot-pf {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: rgba(255,255,255,0.22);
  cursor: pointer;
  transition: all 0.22s;
}
.gp-dot-pf.active {
  background: #fff;
  width: 22px;
  border-radius: 999px;
}
.swipe-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  color: rgba(255,255,255,0.28);
  padding: 0.4rem 0 0;
  font-family: 'Syne', sans-serif;
  letter-spacing: 1px;
}

/* ── ENTER ANIMATION ── */
@keyframes pfFadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pf-animate {
  animation: pfFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both;
}
.pf-animate-delay-1 { animation-delay: 0.08s; }
.pf-animate-delay-2 { animation-delay: 0.16s; }
.pf-animate-delay-3 { animation-delay: 0.24s; }
.pf-animate-delay-4 { animation-delay: 0.32s; }
```

`;
document.head.appendChild(style);
})();

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function avatarHTML(data, size=‘90px’, fontSize=‘2.4rem’) {
if (data.photoURL) {
return `<div style="width:${size};height:${size};border-radius:50%;overflow:hidden;border:2.5px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.08);margin:0 auto 1rem;box-shadow:0 4px 24px rgba(0,0,0,0.35);"> <img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;"> </div>`;
}
return `<div style="width:${size};height:${size};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${fontSize};border:2.5px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.07);margin:0 auto 1rem;">${data.emoji||'🧑‍💻'}</div>`;
}

function skillsBlock(data, color, bg, border, label) {
if (!data.skills?.length) return ‘’;
return `

  <div class="pf-animate pf-animate-delay-2" style="margin-bottom:1.4rem;">
    <div class="pf-section-label" style="color:${label||'rgba(255,255,255,0.32)'};">Skills</div>
    <div style="display:flex;flex-wrap:wrap;gap:0.45rem;">
      ${data.skills.map(s=>`
        <span class="pf-skill" style="background:${bg||'rgba(255,255,255,0.1)'};border:1px solid ${border||'rgba(255,255,255,0.15)'};color:${color||'rgba(255,255,255,0.82)'};">${s}</span>
      `).join('')}
    </div>
  </div>`;
}

function workBlock(data, color, sub, date, label, cardBg, cardBorder) {
const filled = data.work?.filter(w=>w.title) || [];
if (!filled.length) return ‘’;
return `

  <div class="pf-animate pf-animate-delay-3" style="margin-bottom:1.4rem;">
    <div class="pf-section-label" style="color:${label||'rgba(255,255,255,0.32)'};">Experience</div>
    ${filled.map(w=>`
      <div class="pf-work-card" style="background:${cardBg||'rgba(255,255,255,0.04)'};border:1px solid ${cardBorder||'rgba(255,255,255,0.07)'};">
        <div style="font-size:0.9rem;font-weight:700;color:${color||'#fff'};font-family:'Syne',sans-serif;">${w.title}</div>
        ${w.company?`<div style="font-size:0.8rem;color:${sub||'rgba(255,255,255,0.52)'};margin-top:2px;">${w.company}</div>`:''}
        ${w.date?`<div style="font-size:0.72rem;color:${date||'rgba(255,255,255,0.32)'};margin-top:2px;">${w.date}</div>`:''}
      </div>`).join('')}
  </div>`;
}

function linksBlock(data, color, bg, border, label, iconBg) {
const filled = data.links?.filter(l=>l.title) || [];
if (!filled.length) return ‘’;
return `

  <div class="pf-animate pf-animate-delay-4" style="margin-bottom:1rem;">
    <div class="pf-section-label" style="color:${label||'rgba(255,255,255,0.32)'};">Links</div>
    ${filled.map(l=>`
      <a href="${l.url||'#'}" target="_blank" rel="noopener" class="pf-link-row"
        style="background:${bg||'rgba(255,255,255,0.07)'};border:1px solid ${border||'rgba(255,255,255,0.1)'};color:${color||'#fff'};">
        <div class="pf-link-icon" style="background:${iconBg||'rgba(255,255,255,0.08)'};">${l.icon||'🔗'}</div>
        <span>${l.title}</span>
        <span style="margin-left:auto;font-size:0.75rem;opacity:0.4;">↗</span>
      </a>`).join('')}
  </div>`;
}

function footer(color, borderColor) {
return `

  <div class="pf-footer" style="color:${color||'rgba(255,255,255,0.22)'};border-top:1px solid ${borderColor||'rgba(255,255,255,0.06)'};">
    <a href="./claim.html" style="color:inherit;">Made with folio.</a>
  </div>`;
}

// ─── BUILD TEMPLATE ───────────────────────────────────────────────────────────
function buildTemplate(id, data, bg) {
switch(id) {
case ‘gold’:     return renderGold(data, bg);
case ‘fire’:     return renderFire(data, bg);
case ‘motion’:   return renderMotion(data, bg);
case ‘blossom’:  return renderBlossom(data, bg);
case ‘neon’:     return renderNeon(data, bg);
case ‘glass’:    return renderGlass(data, bg);
case ‘sunset’:   return renderSunset(data, bg);
case ‘glasspro’: return renderGlassPro(data, bg);
default:         return renderMinimal(data, bg);
}
}

// ─── MINIMAL ──────────────────────────────────────────────────────────────────
function renderMinimal(data, bg) {
return `

  <div class="pf-card">
    <div class="pf-animate" style="background:${bg};padding:3.5rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.04),transparent 65%);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        ${avatarHTML(data)}
        <div style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#fff;letter-spacing:-0.5px;line-height:1.1;">${data.name||''}</div>
        <div style="font-size:0.92rem;color:rgba(255,255,255,0.58);margin:0.35rem 0 0.5rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,255,255,0.38);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.92rem;color:rgba(255,255,255,0.7);line-height:1.7;max-width:340px;margin:0.5rem auto 0;">${data.bio}</div>`:''}
      </div>
    </div>
    <div class="pf-animate pf-animate-delay-1" style="background:#0d0d14;padding:1.8rem 1.8rem 0.8rem;">
      ${skillsBlock(data)}
      ${workBlock(data)}
      ${linksBlock(data)}
    </div>
    ${footer('rgba(255,255,255,0.2)','rgba(255,255,255,0.06)')}
  </div>`;
}

// ─── GLASS PRO ────────────────────────────────────────────────────────────────
function renderGlassPro(data, bg) {
return `

  <div class="pf-card">
    <div style="position:relative;overflow:hidden;touch-action:pan-y;user-select:none;" id="gp-slider-pf">
      <div style="display:flex;transition:transform 0.45s cubic-bezier(0.4,0,0.2,1);" id="gp-track-pf">

```
    <!-- CARD 1 — BLUE GLASS -->
    <div style="min-width:100%;flex-shrink:0;">
      <div class="shimmer-pf pf-animate"
        style="background:linear-gradient(135deg,rgba(20,90,255,0.88),rgba(8,35,180,0.93));padding:3.5rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.04);"></div>
        <div style="position:absolute;bottom:-50px;left:-50px;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,0.03);"></div>
        <div style="position:relative;z-index:1;">
          <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(255,255,255,0.45);background:rgba(255,255,255,0.14);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,80,0.38);">
            ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
          </div>
          <div style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#fff;letter-spacing:-0.5px;text-shadow:0 2px 12px rgba(0,0,0,0.25);">${data.name||''}</div>
          <div style="font-size:0.92rem;color:rgba(255,255,255,0.72);margin:0.35rem 0 0.5rem;">${data.role||''}</div>
          ${data.location?`<div style="font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
          ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,255,255,0.8);line-height:1.7;max-width:340px;margin:0.5rem auto 0;font-style:italic;">"${data.bio}"</div>`:''}
        </div>
      </div>
      <div class="pf-animate pf-animate-delay-1" style="background:rgba(8,28,110,0.94);backdrop-filter:blur(20px);padding:1.8rem 1.8rem 0.8rem;">
        ${skillsBlock(data,'rgba(255,255,255,0.9)','rgba(255,255,255,0.12)','rgba(255,255,255,0.22)','rgba(255,255,255,0.38)')}
        ${workBlock(data,'#fff','rgba(255,255,255,0.55)','rgba(255,255,255,0.32)','rgba(255,255,255,0.38)','rgba(255,255,255,0.06)','rgba(255,255,255,0.1)')}
        ${linksBlock(data,'#fff','rgba(255,255,255,0.1)','rgba(255,255,255,0.16)','rgba(255,255,255,0.38)','rgba(255,255,255,0.1)')}
      </div>
      ${footer('rgba(255,255,255,0.3)','rgba(255,255,255,0.08)')}
    </div>

    <!-- CARD 2 — DARK GLASS -->
    <div style="min-width:100%;flex-shrink:0;">
      <div class="shimmer-pf pf-animate"
        style="background:linear-gradient(135deg,rgba(12,12,22,0.96),rgba(5,5,14,0.99));backdrop-filter:blur(20px);padding:3.5rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:rgba(124,109,250,0.06);"></div>
        <div style="position:absolute;bottom:-50px;left:-50px;width:150px;height:150px;border-radius:50%;background:rgba(250,109,143,0.04);"></div>
        <div style="position:relative;z-index:1;">
          <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(124,109,250,0.45);background:rgba(124,109,250,0.1);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;box-shadow:0 8px 28px rgba(124,109,250,0.18);">
            ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
          </div>
          <div style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#fff;letter-spacing:-0.5px;">${data.name||''}</div>
          <div style="font-size:0.92rem;color:rgba(124,109,250,0.85);margin:0.35rem 0 0.5rem;">${data.role||''}</div>
          ${data.location?`<div style="font-size:0.82rem;color:rgba(255,255,255,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
          ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,255,255,0.65);line-height:1.7;max-width:340px;margin:0.5rem auto 0;font-style:italic;">"${data.bio}"</div>`:''}
        </div>
      </div>
      <div class="pf-animate pf-animate-delay-1" style="background:rgba(6,6,14,0.98);padding:1.8rem 1.8rem 0.8rem;">
        ${skillsBlock(data,'#a89cfc','rgba(124,109,250,0.1)','rgba(124,109,250,0.25)','rgba(124,109,250,0.4)')}
        ${workBlock(data,'#fff','rgba(124,109,250,0.6)','rgba(124,109,250,0.35)','rgba(124,109,250,0.4)','rgba(124,109,250,0.06)','rgba(124,109,250,0.14)')}
        ${linksBlock(data,'rgba(255,255,255,0.88)','rgba(124,109,250,0.08)','rgba(124,109,250,0.18)','rgba(124,109,250,0.4)','rgba(124,109,250,0.12)')}
      </div>
      ${footer('rgba(124,109,250,0.3)','rgba(124,109,250,0.1)')}
    </div>

  </div>

  <!-- DOTS + HINT -->
  <div style="background:#07070f;padding:0.3rem 0 0.8rem;">
    <div class="swipe-hint">← SWIPE →</div>
    <div class="gp-dots-pf">
      <div class="gp-dot-pf active" id="gpf-dot-0" onclick="gpfGoTo(0)"></div>
      <div class="gp-dot-pf" id="gpf-dot-1" onclick="gpfGoTo(1)"></div>
    </div>
  </div>
</div>
```

  </div>

  <script>
    (function(){
      let cur=0, startX=0;
      const slider = document.getElementById('gp-slider-pf');
      const track  = document.getElementById('gp-track-pf');
      if (!slider) return;
      slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
      slider.addEventListener('touchend',   e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 35) gpfGoTo(diff > 0 ? 1 : 0);
      });
      slider.addEventListener('mousedown', e => { startX = e.clientX; });
      slider.addEventListener('mouseup',   e => {
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 35) gpfGoTo(diff > 0 ? 1 : 0);
      });
      window.gpfGoTo = function(idx) {
        cur = idx;
        if (track) track.style.transform = \`translateX(-\${idx*100}%)\`;
        document.querySelectorAll('.gp-dot-pf').forEach((d,i) => d.classList.toggle('active', i===idx));
      };
    })();
  <\/script>`;
}

// ─── GOLD ─────────────────────────────────────────────────────────────────────
function renderGold(data, bg) {
  return `
  <div class="pf-card">
    <div class="pf-animate" style="background:linear-gradient(135deg,#1a1200,#3d2e00);padding:3.5rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at 50% -10%,rgba(245,200,66,0.14),transparent 65%);pointer-events:none;"></div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(245,200,66,0.25),transparent);"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(245,200,66,0.5);background:rgba(245,200,66,0.08);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;box-shadow:0 0 28px rgba(245,200,66,0.15);">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#f5c842;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.92rem;color:rgba(245,200,66,0.6);margin:0.35rem 0 0.5rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(245,200,66,0.4);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(245,200,66,0.72);line-height:1.7;max-width:340px;margin:0.5rem auto 0;">${data.bio}</div>`:''}
      </div>
    </div>
    <div class="pf-animate pf-animate-delay-1" style="background:#110e00;padding:1.8rem 1.8rem 0.8rem;">
      ${skillsBlock(data,'#f5c842','rgba(245,200,66,0.1)','rgba(245,200,66,0.25)','rgba(245,200,66,0.35)')}
      ${workBlock(data,'#f5c842','rgba(245,200,66,0.55)','rgba(245,200,66,0.3)','rgba(245,200,66,0.35)','rgba(245,200,66,0.05)','rgba(245,200,66,0.12)')}
      ${linksBlock(data,'#f5c842','rgba(245,200,66,0.07)','rgba(245,200,66,0.15)','rgba(245,200,66,0.35)','rgba(245,200,66,0.1)')}
    </div>
    ${footer('rgba(245,200,66,0.22)','rgba(245,200,66,0.1)')}
  </div>`;
}

// ─── FIRE ─────────────────────────────────────────────────────────────────────
function renderFire(data, bg) {
  return `
  <style>
    @keyframes ff2{0%,100%{opacity:1;transform:scaleY(1)}50%{opacity:.88;transform:scaleY(1.06)}}
    @keyframes em2{0%{transform:translateY(0) scale(1);opacity:.9}100%{transform:translateY(-90px) scale(0);opacity:0}}
    .ff2{animation:ff2 1.3s ease-in-out infinite}
    .ep2{position:absolute;width:4px;height:4px;border-radius:50%;animation:em2 2.2s ease-out infinite}
  </style>

  <div class="pf-card">
    <div class="pf-animate" style="background:linear-gradient(180deg,#0d0200,#2a0800,#5a1500);padding:3.5rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;">
      <div class="ff2" style="position:absolute;bottom:0;left:0;right:0;height:45%;background:linear-gradient(180deg,transparent,rgba(255,80,0,0.2),rgba(255,40,0,0.42));"></div>
      <div class="ep2" style="left:18%;animation-delay:0s;background:#ff4500;bottom:20px;"></div>
      <div class="ep2" style="left:52%;animation-delay:0.7s;background:#ff6a00;bottom:20px;"></div>
      <div class="ep2" style="left:76%;animation-delay:1.3s;background:#ffa500;bottom:20px;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(255,100,0,0.55);background:rgba(255,60,0,0.12);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;box-shadow:0 0 28px rgba(255,80,0,0.2);">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#ff8c42;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.92rem;color:rgba(255,140,66,0.62);margin:0.35rem 0 0.5rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,140,66,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,140,66,0.75);line-height:1.7;max-width:340px;margin:0.5rem auto 0;">${data.bio}</div>`:''}
      </div>
    </div>
    <div class="pf-animate pf-animate-delay-1" style="background:#0d0200;padding:1.8rem 1.8rem 0.8rem;">
      ${skillsBlock(data,'#ff8c42','rgba(255,100,0,0.1)','rgba(255,100,0,0.28)','rgba(255,140,66,0.35)')}
      ${workBlock(data,'#ff8c42','rgba(255,140,66,0.55)','rgba(255,140,66,0.3)','rgba(255,140,66,0.35)','rgba(255,80,0,0.07)','rgba(255,80,0,0.15)')}
      ${linksBlock(data,'#ff8c42','rgba(255,80,0,0.08)','rgba(255,80,0,0.18)','rgba(255,140,66,0.35)','rgba(255,80,0,0.12)')}
    </div>
    ${footer('rgba(255,140,66,0.22)','rgba(255,80,0,0.1)')}
  </div>`;
}

// ─── MOTION ───────────────────────────────────────────────────────────────────
function renderMotion(data, bg) {
return `

  <style>
    @keyframes fu2{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
    @keyframes fd2{0%,100%{transform:translateY(0)}50%{transform:translateY(12px)}}
    .o1m{animation:fu2 3s ease-in-out infinite}
    .o2m{animation:fd2 4.2s ease-in-out infinite}
    .o3m{animation:fu2 5.5s ease-in-out infinite;animation-delay:1.2s;}
  </style>

  <div class="pf-card">
    <div class="pf-animate" style="background:linear-gradient(135deg,#0d1b2a,#1b2a4a);padding:3.5rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;">
      <div class="o1m" style="position:absolute;top:8%;left:6%;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,rgba(124,109,250,0.3),transparent);pointer-events:none;"></div>
      <div class="o2m" style="position:absolute;bottom:10%;right:6%;width:55px;height:55px;border-radius:50%;background:radial-gradient(circle,rgba(250,109,143,0.26),transparent);pointer-events:none;"></div>
      <div class="o3m" style="position:absolute;top:45%;left:3%;width:32px;height:32px;border-radius:50%;background:radial-gradient(circle,rgba(109,250,204,0.2),transparent);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        ${avatarHTML(data)}
        <div style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#fff;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.92rem;color:rgba(124,109,250,0.85);margin:0.35rem 0 0.5rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,255,255,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,255,255,0.7);line-height:1.7;max-width:340px;margin:0.5rem auto 0;">${data.bio}</div>`:''}
      </div>
    </div>
    <div class="pf-animate pf-animate-delay-1" style="background:#080e1a;padding:1.8rem 1.8rem 0.8rem;">
      ${skillsBlock(data,'rgba(255,255,255,0.88)','rgba(124,109,250,0.1)','rgba(124,109,250,0.22)','rgba(124,109,250,0.38)')}
      ${workBlock(data,'#fff','rgba(124,109,250,0.55)','rgba(124,109,250,0.32)','rgba(124,109,250,0.38)','rgba(124,109,250,0.05)','rgba(124,109,250,0.12)')}
      ${linksBlock(data,'rgba(255,255,255,0.88)','rgba(124,109,250,0.07)','rgba(124,109,250,0.14)','rgba(124,109,250,0.38)','rgba(124,109,250,0.1)')}
    </div>
    ${footer('rgba(124,109,250,0.28)','rgba(124,109,250,0.1)')}
  </div>`;
}

// ─── BLOSSOM ──────────────────────────────────────────────────────────────────
function renderBlossom(data, bg) {
return `

  <style>
    @keyframes pf2{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-14px) rotate(8deg)}}
    .pt2{position:absolute;animation:pf2 3.5s ease-in-out infinite;pointer-events:none;}
  </style>

  <div class="pf-card">
    <div class="pf-animate" style="background:linear-gradient(135deg,#2d0a2e,#6b1a4a,#2a0a3e);padding:3.5rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;">
      <span class="pt2" style="top:8%;left:10%;animation-delay:0s;font-size:1.1rem;">🌸</span>
      <span class="pt2" style="top:14%;right:8%;animation-delay:0.8s;font-size:0.95rem;">🌺</span>
      <span class="pt2" style="bottom:18%;left:6%;animation-delay:1.5s;font-size:0.8rem;">🌸</span>
      <span class="pt2" style="bottom:8%;right:12%;animation-delay:0.4s;font-size:0.85rem;">✨</span>
      <div style="position:relative;z-index:1;">
        <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(255,150,200,0.45);background:rgba(255,100,180,0.1);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;box-shadow:0 0 28px rgba(255,100,180,0.15);">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#ffb3d9;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.92rem;color:rgba(255,150,200,0.65);margin:0.35rem 0 0.5rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,150,200,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,180,220,0.75);line-height:1.7;max-width:340px;margin:0.5rem auto 0;">${data.bio}</div>`:''}
      </div>
    </div>
    <div class="pf-animate pf-animate-delay-1" style="background:#1a0520;padding:1.8rem 1.8rem 0.8rem;">
      ${skillsBlock(data,'#ffb3d9','rgba(255,100,180,0.1)','rgba(255,100,180,0.25)','rgba(255,150,200,0.35)')}
      ${workBlock(data,'#ffb3d9','rgba(255,150,200,0.55)','rgba(255,150,200,0.3)','rgba(255,150,200,0.35)','rgba(255,100,180,0.06)','rgba(255,100,180,0.14)')}
      ${linksBlock(data,'#ffb3d9','rgba(255,100,180,0.07)','rgba(255,100,180,0.15)','rgba(255,150,200,0.35)','rgba(255,100,180,0.1)')}
    </div>
    ${footer('rgba(255,150,200,0.22)','rgba(255,100,180,0.1)')}
  </div>`;
}

// ─── NEON ─────────────────────────────────────────────────────────────────────
function renderNeon(data, bg) {
return `

  <style>
    @keyframes np2{0%,100%{text-shadow:0 0 10px #00fff5,0 0 28px #00fff5,0 0 50px rgba(0,255,245,0.3)}50%{text-shadow:0 0 5px #00fff5,0 0 12px #00fff5}}
    @keyframes bp2{0%,100%{box-shadow:0 0 12px rgba(0,255,245,0.4),0 0 30px rgba(0,255,245,0.15)}50%{box-shadow:0 0 6px rgba(0,255,245,0.2)}}
    .nt2{animation:np2 2.5s ease-in-out infinite}
    .nb2{animation:bp2 2.5s ease-in-out infinite}
  </style>

  <div class="pf-card">
    <div class="pf-animate" style="background:linear-gradient(135deg,#000a14,#001a2e,#000d1a);padding:3.5rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,245,0.012) 2px,rgba(0,255,245,0.012) 4px);pointer-events:none;"></div>
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(0,255,245,0.04),transparent 70%);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div class="nb2" style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2px solid rgba(0,255,245,0.55);background:rgba(0,255,245,0.05);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div class="nt2" style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#00fff5;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.92rem;color:rgba(0,255,245,0.55);margin:0.35rem 0 0.5rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(0,255,245,0.35);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(0,255,245,0.65);line-height:1.7;max-width:340px;margin:0.5rem auto 0;">${data.bio}</div>`:''}
      </div>
    </div>
    <div class="pf-animate pf-animate-delay-1" style="background:#000810;padding:1.8rem 1.8rem 0.8rem;">
      ${skillsBlock(data,'#00fff5','rgba(0,255,245,0.07)','rgba(0,255,245,0.22)','rgba(0,255,245,0.3)')}
      ${workBlock(data,'#00fff5','rgba(0,255,245,0.42)','rgba(0,255,245,0.25)','rgba(0,255,245,0.3)','rgba(0,255,245,0.04)','rgba(0,255,245,0.12)')}
      ${linksBlock(data,'#00fff5','rgba(0,255,245,0.05)','rgba(0,255,245,0.15)','rgba(0,255,245,0.3)','rgba(0,255,245,0.08)')}
    </div>
    ${footer('rgba(0,255,245,0.22)','rgba(0,255,245,0.08)')}
  </div>`;
}

// ─── GLASS ────────────────────────────────────────────────────────────────────
function renderGlass(data, bg) {
return `

  <div class="pf-card">
    <div class="pf-animate" style="background:linear-gradient(135deg,#1a2a4a,#2a3a6a,#1a2a5a);padding:3.5rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-40%;left:-20%;width:180%;height:180%;background:radial-gradient(ellipse at 35% 35%,rgba(255,255,255,0.07),transparent 55%);pointer-events:none;"></div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.1);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;box-shadow:0 8px 28px rgba(0,0,0,0.3);">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#fff;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.92rem;color:rgba(255,255,255,0.55);margin:0.35rem 0 0.5rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,255,255,0.38);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,255,255,0.68);line-height:1.7;max-width:340px;margin:0.5rem auto 0;">${data.bio}</div>`:''}
      </div>
    </div>
    <div class="pf-animate pf-animate-delay-1" style="background:rgba(12,20,46,0.97);backdrop-filter:blur(20px);padding:1.8rem 1.8rem 0.8rem;">
      ${skillsBlock(data,'rgba(255,255,255,0.85)','rgba(255,255,255,0.08)','rgba(255,255,255,0.14)','rgba(255,255,255,0.35)')}
      ${workBlock(data,'#fff','rgba(255,255,255,0.52)','rgba(255,255,255,0.3)','rgba(255,255,255,0.35)','rgba(255,255,255,0.04)','rgba(255,255,255,0.08)')}
      ${linksBlock(data,'rgba(255,255,255,0.88)','rgba(255,255,255,0.07)','rgba(255,255,255,0.1)','rgba(255,255,255,0.35)','rgba(255,255,255,0.08)')}
    </div>
    ${footer('rgba(255,255,255,0.22)','rgba(255,255,255,0.07)')}
  </div>`;
}

// ─── SUNSET ───────────────────────────────────────────────────────────────────
function renderSunset(data, bg) {
return `

  <style>
    @keyframes sg2{0%,100%{opacity:0.45}50%{opacity:1}}
    .sg2{animation:sg2 3.5s ease-in-out infinite}
  </style>

  <div class="pf-card">
    <div class="pf-animate" style="background:linear-gradient(180deg,#0a0010,#2a0a1a,#5a1a0a,#3a0a00);padding:3.5rem 2rem 2.5rem;text-align:center;position:relative;overflow:hidden;">
      <div class="sg2" style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:180px;height:90px;background:radial-gradient(ellipse,rgba(255,120,0,0.32),transparent);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(255,140,60,0.45);background:rgba(255,100,0,0.1);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;box-shadow:0 0 28px rgba(255,100,0,0.18);">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div style="font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;background:linear-gradient(135deg,#ff8c42,#ff4da6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.92rem;color:rgba(255,140,80,0.65);margin:0.35rem 0 0.5rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,140,80,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,160,100,0.72);line-height:1.7;max-width:340px;margin:0.5rem auto 0;">${data.bio}</div>`:''}
      </div>
    </div>
    <div class="pf-animate pf-animate-delay-1" style="background:#0d0008;padding:1.8rem 1.8rem 0.8rem;">
      ${skillsBlock(data,'#ff8c42','rgba(255,100,0,0.1)','rgba(255,100,0,0.25)','rgba(255,140,80,0.35)')}
      ${workBlock(data,'#ff8c42','rgba(255,140,80,0.55)','rgba(255,140,80,0.3)','rgba(255,140,80,0.35)','rgba(255,80,0,0.06)','rgba(255,80,0,0.14)')}
      ${linksBlock(data,'#ff8c42','rgba(255,100,0,0.07)','rgba(255,100,0,0.15)','rgba(255,140,80,0.35)','rgba(255,100,0,0.1)')}
    </div>
    ${footer('rgba(255,140,80,0.22)','rgba(255,100,0,0.1)')}
  </div>`;
}

// ─── LOAD PORTFOLIO ───────────────────────────────────────────────────────────
async function loadPortfolio() {
const params   = new URLSearchParams(window.location.search);
const username = params.get(‘u’);
if (!username) { showNotFound(); return; }

try {
const snap = await getDoc(doc(db, “portfolios”, username));
if (!snap.exists()) { showNotFound(); return; }

```
const data = snap.data();
document.title = `${data.name || username} — folio.`;

const bg   = BACKGROUNDS[data.bgIdx || 0].bg;
const html = buildTemplate(data.templateId || 'minimal', data, bg);

document.getElementById('portfolio-wrap').innerHTML = html;
document.getElementById('loading-screen').style.display  = 'none';
document.getElementById('portfolio-wrap').style.display  = 'block';
```

} catch (err) {
console.error(err);
showNotFound();
}
}

function showNotFound() {
document.getElementById(‘loading-screen’).style.display = ‘none’;
const nf = document.getElementById(‘not-found’);
if (nf) nf.style.display = ‘flex’;
}

loadPortfolio();