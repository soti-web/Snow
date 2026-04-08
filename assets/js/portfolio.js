import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyACMH3hBQqS9Jhw-d3xkLlY_RiKr0DOXsI",
  authDomain: "dev-muhamad.firebaseapp.com",
  projectId: "dev-muhamad",
  storageBucket: "dev-muhamad.firebasestorage.app",
  messagingSenderId: "224833840139",
  appId: "1:224833840139:web:365f0ecd685d1c54ea530e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BACKGROUNDS = [
  { bg:'linear-gradient(135deg,#1a0a2e,#0d1b3e)' },
  { bg:'linear-gradient(135deg,#0f2027,#203a43,#2c5364)' },
  { bg:'linear-gradient(135deg,#1a1a2e,#16213e)' },
  { bg:'linear-gradient(135deg,#111,#1a1a1a)' },
  { bg:'linear-gradient(135deg,#0f3460,#533483)' },
  { bg:'linear-gradient(135deg,#1b4332,#081c15)' },
  { bg:'linear-gradient(135deg,#3d0000,#1a0000)' },
  { bg:'linear-gradient(135deg,#2d1b69,#11998e)' },
  { bg:'linear-gradient(135deg,#4a1942,#c94b4b)' },
  { bg:'linear-gradient(135deg,#1a0533,#6b0f6b)' },
  { bg:'linear-gradient(135deg,#0a3d62,#1e3799)' },
  { bg:'linear-gradient(135deg,#44347a,#fc5c7d)' },
];

// ===== HELPERS =====
function avatarHTML(data, size='80px', fontSize='2.2rem') {
  if (data.photoURL) {
    return `<div style="width:${size};height:${size};border-radius:50%;overflow:hidden;border:2.5px solid rgba(255,255,255,0.25);background:rgba(255,255,255,0.08);margin:0 auto 1rem;box-shadow:0 4px 20px rgba(0,0,0,0.3);">
      <img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">
    </div>`;
  }
  return `<div style="width:${size};height:${size};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${fontSize};border:2.5px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);margin:0 auto 1rem;">${data.emoji||'🧑‍💻'}</div>`;
}

function skillsBlock(data, color, bg, border, label) {
  if (!data.skills?.length) return '';
  return `<div style="margin-bottom:1.2rem;">
    <div style="font-size:0.62rem;font-weight:700;color:${label||'rgba(255,255,255,0.32)'};letter-spacing:2px;text-transform:uppercase;margin-bottom:0.5rem;">Skills</div>
    <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
      ${data.skills.map(s=>`<span style="background:${bg||'rgba(255,255,255,0.1)'};border:1px solid ${border||'rgba(255,255,255,0.15)'};border-radius:999px;padding:0.25rem 0.65rem;font-size:0.75rem;color:${color||'rgba(255,255,255,0.82)'};">${s}</span>`).join('')}
    </div>
  </div>`;
}

function workBlock(data, color, sub, date, label) {
  const filled = data.work?.filter(w=>w.title) || [];
  if (!filled.length) return '';
  return `<div style="margin-bottom:1.2rem;">
    <div style="font-size:0.62rem;font-weight:700;color:${label||'rgba(255,255,255,0.32)'};letter-spacing:2px;text-transform:uppercase;margin-bottom:0.5rem;">Experience</div>
    ${filled.map(w=>`
      <div style="margin-bottom:0.6rem;padding:0.7rem 0.9rem;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);">
        <div style="font-size:0.88rem;font-weight:700;color:${color||'#fff'};">${w.title}</div>
        ${w.company?`<div style="font-size:0.78rem;color:${sub||'rgba(255,255,255,0.52)'};">${w.company}</div>`:''}
        ${w.date?`<div style="font-size:0.7rem;color:${date||'rgba(255,255,255,0.32)'};">${w.date}</div>`:''}
      </div>`).join('')}
  </div>`;
}

function linksBlock(data, color, bg, border, label) {
  const filled = data.links?.filter(l=>l.title) || [];
  if (!filled.length) return '';
  return `<div style="margin-bottom:1rem;">
    <div style="font-size:0.62rem;font-weight:700;color:${label||'rgba(255,255,255,0.32)'};letter-spacing:2px;text-transform:uppercase;margin-bottom:0.5rem;">Links</div>
    <div style="display:flex;flex-direction:column;gap:0.5rem;">
      ${filled.map(l=>`
        <a href="${l.url||'#'}" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:0.65rem;padding:0.8rem 1rem;border-radius:12px;background:${bg||'rgba(255,255,255,0.08)'};border:1px solid ${border||'rgba(255,255,255,0.1)'};color:${color||'#fff'};font-size:0.88rem;font-weight:500;text-decoration:none;transition:background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='${bg||'rgba(255,255,255,0.08)'}'">
          <span>${l.icon||'🔗'}</span>${l.title}
        </a>`).join('')}
    </div>
  </div>`;
}

// ===== BUILD TEMPLATE =====
function buildTemplate(id, data, bg) {
  switch(id) {
    case 'gold':     return renderGold(data, bg);
    case 'fire':     return renderFire(data, bg);
    case 'motion':   return renderMotion(data, bg);
    case 'blossom':  return renderBlossom(data, bg);
    case 'neon':     return renderNeon(data, bg);
    case 'glass':    return renderGlass(data, bg);
    case 'sunset':   return renderSunset(data, bg);
    case 'glasspro': return renderGlassPro(data, bg);
    default:         return renderMinimal(data, bg);
  }
}

// ===== MINIMAL =====
function renderMinimal(data, bg) {
  return `
    <div style="background:${bg};padding:3rem 2rem 2rem;text-align:center;">
      ${avatarHTML(data)}
      <div style="font-size:1.6rem;font-weight:800;color:#fff;letter-spacing:-0.5px;">${data.name||''}</div>
      <div style="font-size:0.9rem;color:rgba(255,255,255,0.6);margin:0.3rem 0 0.6rem;">${data.role||''}</div>
      ${data.location?`<div style="font-size:0.82rem;color:rgba(255,255,255,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
      ${data.bio?`<div style="font-size:0.92rem;color:rgba(255,255,255,0.72);line-height:1.65;max-width:340px;margin:0 auto;">${data.bio}</div>`:''}
    </div>
    <div style="background:#0d0d14;padding:1.5rem 1.8rem 2rem;">
      ${skillsBlock(data)}${workBlock(data)}${linksBlock(data)}
    </div>
    <div style="background:#0d0d14;text-align:center;padding:1rem;border-top:1px solid rgba(255,255,255,0.06);font-size:0.68rem;font-family:'Space Mono',monospace;color:rgba(255,255,255,0.2);">
      <a href="./claim.html" style="color:inherit;text-decoration:none;">Made with folio.</a>
    </div>`;
}

// ===== GLASS PRO =====
function renderGlassPro(data, bg) {
  return `
    <style>
      .gp-slider-pf{position:relative;overflow:hidden;touch-action:pan-y;user-select:none;}
      .gp-track-pf{display:flex;transition:transform 0.45s cubic-bezier(0.4,0,0.2,1);}
      .gp-slide-pf{min-width:100%;flex-shrink:0;}
      .gp-dots-pf{display:flex;justify-content:center;gap:7px;padding:0.8rem 0;}
      .gp-dot-pf{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.22);cursor:pointer;transition:all 0.2s;}
      .gp-dot-pf.active{background:#fff;width:22px;border-radius:999px;}
      @keyframes glassShimmerPf{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
      .shimmer-pf{position:relative;overflow:hidden;}
      .shimmer-pf::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);animation:glassShimmerPf 4s ease-in-out infinite;}
      .swipe-hint{display:flex;align-items:center;justify-content:center;gap:0.4rem;font-size:0.7rem;color:rgba(255,255,255,0.35);padding:0.3rem 0;font-family:'Space Mono',monospace;}
    </style>

    <div class="gp-slider-pf" id="gp-slider-pf">
      <div class="gp-track-pf" id="gp-track-pf">

        <!-- CARD 1: BLUE GLASS -->
        <div class="gp-slide-pf">
          <div class="shimmer-pf" style="background:linear-gradient(135deg,rgba(20,90,255,0.88),rgba(8,35,180,0.93));padding:3rem 2rem 2rem;text-align:center;position:relative;overflow:hidden;">
            <div style="position:absolute;top:-50px;right:-50px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.05);"></div>
            <div style="position:absolute;bottom:-40px;left:-40px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.04);"></div>
            <div style="position:relative;z-index:1;">
              <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(255,255,255,0.45);background:rgba(255,255,255,0.15);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,80,0.35);">
                ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
              </div>
              <div style="font-size:1.6rem;font-weight:800;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,0.3);letter-spacing:-0.5px;">${data.name||''}</div>
              <div style="font-size:0.9rem;color:rgba(255,255,255,0.75);margin:0.3rem 0 0.6rem;">${data.role||''}</div>
              ${data.location?`<div style="font-size:0.82rem;color:rgba(255,255,255,0.52);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
              ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,255,255,0.82);line-height:1.65;max-width:340px;margin:0 auto;font-style:italic;">"${data.bio}"</div>`:''}
            </div>
          </div>
          <div style="background:rgba(8,28,110,0.94);padding:1.5rem 1.8rem 1rem;">
            ${skillsBlock(data,'rgba(255,255,255,0.9)','rgba(255,255,255,0.12)','rgba(255,255,255,0.22)','rgba(255,255,255,0.35)')}
            ${workBlock(data,'#fff','rgba(255,255,255,0.55)','rgba(255,255,255,0.32)','rgba(255,255,255,0.35)')}
            ${linksBlock(data,'#fff','rgba(255,255,255,0.1)','rgba(255,255,255,0.16)','rgba(255,255,255,0.35)')}
          </div>
          <div style="background:rgba(8,28,110,0.94);text-align:center;padding:0.8rem;border-top:1px solid rgba(255,255,255,0.08);font-size:0.65rem;font-family:'Space Mono',monospace;color:rgba(255,255,255,0.28);">
            <a href="./claim.html" style="color:inherit;text-decoration:none;">Made with folio.</a>
          </div>
        </div>

        <!-- CARD 2: DARK GLASS -->
        <div class="gp-slide-pf">
          <div class="shimmer-pf" style="background:linear-gradient(135deg,rgba(12,12,22,0.95),rgba(5,5,14,0.98));padding:3rem 2rem 2rem;text-align:center;position:relative;overflow:hidden;">
            <div style="position:absolute;top:-50px;right:-50px;width:160px;height:160px;border-radius:50%;background:rgba(124,109,250,0.07);"></div>
            <div style="position:absolute;bottom:-40px;left:-40px;width:120px;height:120px;border-radius:50%;background:rgba(250,109,143,0.05);"></div>
            <div style="position:relative;z-index:1;">
              <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(124,109,250,0.45);background:rgba(124,109,250,0.1);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;box-shadow:0 6px 24px rgba(124,109,250,0.2);">
                ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
              </div>
              <div style="font-size:1.6rem;font-weight:800;color:#fff;letter-spacing:-0.5px;">${data.name||''}</div>
              <div style="font-size:0.9rem;color:rgba(124,109,250,0.85);margin:0.3rem 0 0.6rem;">${data.role||''}</div>
              ${data.location?`<div style="font-size:0.82rem;color:rgba(255,255,255,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
              ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,255,255,0.68);line-height:1.65;max-width:340px;margin:0 auto;font-style:italic;">"${data.bio}"</div>`:''}
            </div>
          </div>
          <div style="background:rgba(6,6,14,0.97);padding:1.5rem 1.8rem 1rem;">
            ${skillsBlock(data,'#a89cfc','rgba(124,109,250,0.1)','rgba(124,109,250,0.25)','rgba(124,109,250,0.38)')}
            ${workBlock(data,'#fff','rgba(124,109,250,0.6)','rgba(124,109,250,0.35)','rgba(124,109,250,0.38)')}
            ${linksBlock(data,'rgba(255,255,255,0.88)','rgba(124,109,250,0.08)','rgba(124,109,250,0.18)','rgba(124,109,250,0.38)')}
          </div>
          <div style="background:rgba(6,6,14,0.97);text-align:center;padding:0.8rem;border-top:1px solid rgba(124,109,250,0.1);font-size:0.65rem;font-family:'Space Mono',monospace;color:rgba(124,109,250,0.28);">
            <a href="./claim.html" style="color:inherit;text-decoration:none;">Made with folio.</a>
          </div>
        </div>

      </div>

      <!-- DOTS + HINT -->
      <div style="background:#08080f;padding:0.2rem 0 0.5rem;">
        <div class="swipe-hint">← swipe →</div>
        <div class="gp-dots-pf">
          <div class="gp-dot-pf active" id="gpf-dot-0" onclick="gpfGoTo(0)"></div>
          <div class="gp-dot-pf" id="gpf-dot-1" onclick="gpfGoTo(1)"></div>
        </div>
      </div>
    </div>

    <script>
      (function(){
        let cur = 0, startX = 0;
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

// ===== GOLD =====
function renderGold(data, bg) {
  return `
    <div style="background:linear-gradient(135deg,#1a1200,#3d2e00);padding:3rem 2rem 2rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at top,rgba(245,200,66,0.12),transparent 70%);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(245,200,66,0.5);background:rgba(245,200,66,0.08);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div style="font-size:1.6rem;font-weight:800;color:#f5c842;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.9rem;color:rgba(245,200,66,0.6);margin:0.3rem 0 0.6rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(245,200,66,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(245,200,66,0.72);line-height:1.65;max-width:340px;margin:0 auto;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#110e00;padding:1.5rem 1.8rem 2rem;">
      ${skillsBlock(data,'#f5c842','rgba(245,200,66,0.1)','rgba(245,200,66,0.25)','rgba(245,200,66,0.32)')}
      ${workBlock(data,'#f5c842','rgba(245,200,66,0.5)','rgba(245,200,66,0.3)','rgba(245,200,66,0.32)')}
      ${linksBlock(data,'#f5c842','rgba(245,200,66,0.07)','rgba(245,200,66,0.15)','rgba(245,200,66,0.32)')}
    </div>
    <div style="background:#110e00;text-align:center;padding:1rem;border-top:1px solid rgba(245,200,66,0.1);font-size:0.68rem;font-family:'Space Mono',monospace;color:rgba(245,200,66,0.2);">
      <a href="./claim.html" style="color:inherit;text-decoration:none;">Made with folio.</a>
    </div>`;
}

// ===== FIRE =====
function renderFire(data, bg) {
  return `
    <style>
      @keyframes ff2{0%,100%{opacity:1;transform:scaleY(1)}50%{opacity:.88;transform:scaleY(1.05)}}
      @keyframes em2{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-80px) scale(0);opacity:0}}
      .ff2{animation:ff2 1.2s ease-in-out infinite}
      .ep2{position:absolute;width:4px;height:4px;border-radius:50%;animation:em2 2s ease-out infinite}
    </style>
    <div style="background:linear-gradient(180deg,#0d0200,#2a0800,#5a1500);padding:3rem 2rem 2rem;text-align:center;position:relative;overflow:hidden;">
      <div class="ff2" style="position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(180deg,transparent,rgba(255,80,0,0.22),rgba(255,40,0,0.45));"></div>
      <div class="ep2" style="left:18%;animation-delay:0s;background:#ff4500;"></div>
      <div class="ep2" style="left:52%;animation-delay:0.7s;background:#ff6a00;"></div>
      <div class="ep2" style="left:76%;animation-delay:1.3s;background:#ffa500;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(255,100,0,0.55);background:rgba(255,60,0,0.12);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div style="font-size:1.6rem;font-weight:800;color:#ff8c42;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.9rem;color:rgba(255,140,66,0.62);margin:0.3rem 0 0.6rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,140,66,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,140,66,0.75);line-height:1.65;max-width:340px;margin:0 auto;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#0d0200;padding:1.5rem 1.8rem 2rem;">
      ${skillsBlock(data,'#ff8c42','rgba(255,100,0,0.1)','rgba(255,100,0,0.28)','rgba(255,140,66,0.32)')}
      ${workBlock(data,'#ff8c42','rgba(255,140,66,0.5)','rgba(255,140,66,0.3)','rgba(255,140,66,0.32)')}
      ${linksBlock(data,'#ff8c42','rgba(255,80,0,0.08)','rgba(255,80,0,0.18)','rgba(255,140,66,0.32)')}
    </div>
    <div style="background:#0d0200;text-align:center;padding:1rem;border-top:1px solid rgba(255,80,0,0.1);font-size:0.68rem;font-family:'Space Mono',monospace;color:rgba(255,140,66,0.2);">
      <a href="./claim.html" style="color:inherit;text-decoration:none;">Made with folio.</a>
    </div>`;
}

// ===== MOTION =====
function renderMotion(data, bg) {
  return `
    <style>
      @keyframes fu2{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      @keyframes fd2{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}
      .o1{animation:fu2 3s ease-in-out infinite}
      .o2{animation:fd2 4s ease-in-out infinite}
      .o3{animation:fu2 5s ease-in-out infinite;animation-delay:1.2s;}
    </style>
    <div style="background:linear-gradient(135deg,#0d1b2a,#1b2a4a);padding:3rem 2rem 2rem;text-align:center;position:relative;overflow:hidden;">
      <div class="o1" style="position:absolute;top:8%;left:6%;width:70px;height:70px;border-radius:50%;background:radial-gradient(circle,rgba(124,109,250,0.32),transparent);pointer-events:none;"></div>
      <div class="o2" style="position:absolute;bottom:10%;right:6%;width:50px;height:50px;border-radius:50%;background:radial-gradient(circle,rgba(250,109,143,0.28),transparent);pointer-events:none;"></div>
      <div class="o3" style="position:absolute;top:45%;left:3%;width:28px;height:28px;border-radius:50%;background:radial-gradient(circle,rgba(109,250,204,0.22),transparent);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        ${avatarHTML(data)}
        <div style="font-size:1.6rem;font-weight:800;color:#fff;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.9rem;color:rgba(124,109,250,0.85);margin:0.3rem 0 0.6rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,255,255,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,255,255,0.7);line-height:1.65;max-width:340px;margin:0 auto;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#080e1a;padding:1.5rem 1.8rem 2rem;">
      ${skillsBlock(data)}${workBlock(data)}${linksBlock(data)}
    </div>
    <div style="background:#080e1a;text-align:center;padding:1rem;border-top:1px solid rgba(124,109,250,0.1);font-size:0.68rem;font-family:'Space Mono',monospace;color:rgba(124,109,250,0.25);">
      <a href="./claim.html" style="color:inherit;text-decoration:none;">Made with folio.</a>
    </div>`;
}

// ===== BLOSSOM =====
function renderBlossom(data, bg) {
  return `
    <style>
      @keyframes pf2{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(8deg)}}
      .pt2{position:absolute;animation:pf2 3.5s ease-in-out infinite;pointer-events:none;}
    </style>
    <div style="background:linear-gradient(135deg,#2d0a2e,#6b1a4a,#2a0a3e);padding:3rem 2rem 2rem;text-align:center;position:relative;overflow:hidden;">
      <span class="pt2" style="top:8%;left:10%;animation-delay:0s;font-size:1rem;">🌸</span>
      <span class="pt2" style="top:14%;right:8%;animation-delay:0.8s;font-size:0.9rem;">🌺</span>
      <span class="pt2" style="bottom:18%;left:6%;animation-delay:1.5s;font-size:0.75rem;">🌸</span>
      <span class="pt2" style="bottom:8%;right:12%;animation-delay:0.4s;font-size:0.8rem;">✨</span>
      <div style="position:relative;z-index:1;">
        <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(255,150,200,0.45);background:rgba(255,100,180,0.1);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div style="font-size:1.6rem;font-weight:800;color:#ffb3d9;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.9rem;color:rgba(255,150,200,0.65);margin:0.3rem 0 0.6rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,150,200,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,180,220,0.75);line-height:1.65;max-width:340px;margin:0 auto;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#1a0520;padding:1.5rem 1.8rem 2rem;">
      ${skillsBlock(data,'#ffb3d9','rgba(255,100,180,0.1)','rgba(255,100,180,0.25)','rgba(255,150,200,0.32)')}
      ${workBlock(data,'#ffb3d9','rgba(255,150,200,0.5)','rgba(255,150,200,0.3)','rgba(255,150,200,0.32)')}
      ${linksBlock(data,'#ffb3d9','rgba(255,100,180,0.07)','rgba(255,100,180,0.15)','rgba(255,150,200,0.32)')}
    </div>
    <div style="background:#1a0520;text-align:center;padding:1rem;border-top:1px solid rgba(255,100,180,0.1);font-size:0.68rem;font-family:'Space Mono',monospace;color:rgba(255,150,200,0.2);">
      <a href="./claim.html" style="color:inherit;text-decoration:none;">Made with folio.</a>
    </div>`;
}

// ===== NEON =====
function renderNeon(data, bg) {
  return `
    <style>
      @keyframes np2{0%,100%{text-shadow:0 0 8px #00fff5,0 0 22px #00fff5}50%{text-shadow:0 0 4px #00fff5,0 0 10px #00fff5}}
      @keyframes bp2{0%,100%{box-shadow:0 0 10px rgba(0,255,245,0.38)}50%{box-shadow:0 0 22px rgba(0,255,245,0.72)}}
      .nt2{animation:np2 2.5s ease-in-out infinite}
      .nb2{animation:bp2 2.5s ease-in-out infinite}
    </style>
    <div style="background:linear-gradient(135deg,#000a14,#001a2e,#000d1a);padding:3rem 2rem 2rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,245,0.012) 2px,rgba(0,255,245,0.012) 4px);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div class="nb2" style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2px solid rgba(0,255,245,0.55);background:rgba(0,255,245,0.05);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div class="nt2" style="font-size:1.6rem;font-weight:800;color:#00fff5;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.9rem;color:rgba(0,255,245,0.55);margin:0.3rem 0 0.6rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(0,255,245,0.35);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(0,255,245,0.65);line-height:1.65;max-width:340px;margin:0 auto;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#000810;padding:1.5rem 1.8rem 2rem;">
      ${skillsBlock(data,'#00fff5','rgba(0,255,245,0.07)','rgba(0,255,245,0.22)','rgba(0,255,245,0.28)')}
      ${workBlock(data,'#00fff5','rgba(0,255,245,0.4)','rgba(0,255,245,0.25)','rgba(0,255,245,0.28)')}
      ${linksBlock(data,'#00fff5','rgba(0,255,245,0.05)','rgba(0,255,245,0.15)','rgba(0,255,245,0.28)')}
    </div>
    <div style="background:#000810;text-align:center;padding:1rem;border-top:1px solid rgba(0,255,245,0.08);font-size:0.68rem;font-family:'Space Mono',monospace;color:rgba(0,255,245,0.2);">
      <a href="./claim.html" style="color:inherit;text-decoration:none;">Made with folio.</a>
    </div>`;
}

// ===== GLASS =====
function renderGlass(data, bg) {
  return `
    <div style="background:linear-gradient(135deg,#1a2a4a,#2a3a6a,#1a2a5a);padding:3rem 2rem 2rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-40%;left:-20%;width:180%;height:180%;background:radial-gradient(ellipse at 30% 40%,rgba(255,255,255,0.06),transparent 60%);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.1);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div style="font-size:1.6rem;font-weight:800;color:#fff;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.9rem;color:rgba(255,255,255,0.55);margin:0.3rem 0 0.6rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,255,255,0.38);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,255,255,0.68);line-height:1.65;max-width:340px;margin:0 auto;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:rgba(12,20,46,0.97);padding:1.5rem 1.8rem 2rem;">
      ${skillsBlock(data)}${workBlock(data)}${linksBlock(data)}
    </div>
    <div style="background:rgba(12,20,46,0.97);text-align:center;padding:1rem;border-top:1px solid rgba(255,255,255,0.06);font-size:0.68rem;font-family:'Space Mono',monospace;color:rgba(255,255,255,0.2);">
      <a href="./claim.html" style="color:inherit;text-decoration:none;">Made with folio.</a>
    </div>`;
}

// ===== SUNSET =====
function renderSunset(data, bg) {
  return `
    <style>
      @keyframes sg2{0%,100%{opacity:0.5}50%{opacity:0.95}}
      .sg2{animation:sg2 3.5s ease-in-out infinite}
    </style>
    <div style="background:linear-gradient(180deg,#0a0010,#2a0a1a,#5a1a0a,#3a0a00);padding:3rem 2rem 2rem;text-align:center;position:relative;overflow:hidden;">
      <div class="sg2" style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:160px;height:80px;background:radial-gradient(ellipse,rgba(255,120,0,0.35),transparent);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;border:2.5px solid rgba(255,140,60,0.45);background:rgba(255,100,0,0.1);display:flex;align-items:center;justify-content:center;font-size:2.4rem;overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji||'🧑‍💻'}`}
        </div>
        <div style="font-size:1.6rem;font-weight:800;background:linear-gradient(135deg,#ff8c42,#ff4da6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-0.5px;">${data.name||''}</div>
        <div style="font-size:0.9rem;color:rgba(255,140,80,0.65);margin:0.3rem 0 0.6rem;">${data.role||''}</div>
        ${data.location?`<div style="font-size:0.82rem;color:rgba(255,140,80,0.42);margin-bottom:0.6rem;">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.9rem;color:rgba(255,160,100,0.72);line-height:1.65;max-width:340px;margin:0 auto;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#0d0008;padding:1.5rem 1.8rem 2rem;">
      ${skillsBlock(data,'#ff8c42','rgba(255,100,0,0.1)','rgba(255,100,0,0.25)','rgba(255,140,80,0.3)')}
      ${workBlock(data,'#ff8c42','rgba(255,140,80,0.5)','rgba(255,140,80,0.3)','rgba(255,140,80,0.3)')}
      ${linksBlock(data,'#ff8c42','rgba(255,100,0,0.07)','rgba(255,100,0,0.15)','rgba(255,140,80,0.3)')}
    </div>
    <div style="background:#0d0008;text-align:center;padding:1rem;border-top:1px solid rgba(255,100,0,0.1);font-size:0.68rem;font-family:'Space Mono',monospace;color:rgba(255,140,80,0.2);">
      <a href="./claim.html" style="color:inherit;text-decoration:none;">Made with folio.</a>
    </div>`;
}

// ===== LOAD PORTFOLIO =====
async function loadPortfolio() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get('u');
  if (!username) { showNotFound(); return; }

  try {
    const snap = await getDoc(doc(db, "portfolios", username));
    if (!snap.exists()) { showNotFound(); return; }

    const data = snap.data();
    document.title = `${data.name || username} — folio.`;

    const bg = BACKGROUNDS[data.bgIdx || 0].bg;
    const html = buildTemplate(data.templateId || 'minimal', data, bg);

    document.getElementById('portfolio-wrap').innerHTML = html;
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('portfolio-wrap').style.display = 'block';

  } catch (err) {
    console.error(err);
    showNotFound();
  }
}

function showNotFound() {
  document.getElementById('loading-screen').style.display = 'none';
  document.getElementById('not-found').style.display = 'flex';
}

loadPortfolio();
