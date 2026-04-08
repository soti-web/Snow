import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, updateDoc, collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyACMH3hBQqS9Jhw-d3xkLlY_RiKr0DOXsI",
  authDomain: "dev-muhamad.firebaseapp.com",
  projectId: "dev-muhamad",
  storageBucket: "dev-muhamad.firebasestorage.app",
  messagingSenderId: "224833840139",
  appId: "1:224833840139:web:365f0ecd685d1c54ea530e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const EMOJIS = ['🧑‍💻','👨‍🎨','👩‍🎨','🚀','⚡','✨','🎯','💡','🌙','🔥','💎','🌟','🎨','📱','🖥️','🛸','🦄','🐉','🌊','🏔️','🎸','📷','✍️','🧩','🎀','🌸','🦋','🌺','💫','🎭'];

const BACKGROUNDS = [
  { name:'Nebula',   bg:'linear-gradient(135deg,#1a0a2e,#0d1b3e)' },
  { name:'Ocean',    bg:'linear-gradient(135deg,#0f2027,#203a43,#2c5364)' },
  { name:'Midnight', bg:'linear-gradient(135deg,#1a1a2e,#16213e)' },
  { name:'Carbon',   bg:'linear-gradient(135deg,#111,#1a1a1a)' },
  { name:'Cosmos',   bg:'linear-gradient(135deg,#0f3460,#533483)' },
  { name:'Forest',   bg:'linear-gradient(135deg,#1b4332,#081c15)' },
  { name:'Ember',    bg:'linear-gradient(135deg,#3d0000,#1a0000)' },
  { name:'Aurora',   bg:'linear-gradient(135deg,#2d1b69,#11998e)' },
  { name:'Rose',     bg:'linear-gradient(135deg,#4a1942,#c94b4b)' },
  { name:'Dusk',     bg:'linear-gradient(135deg,#1a0533,#6b0f6b)' },
  { name:'Cobalt',   bg:'linear-gradient(135deg,#0a3d62,#1e3799)' },
  { name:'Candy',    bg:'linear-gradient(135deg,#44347a,#fc5c7d)' },
];

const LINK_ICONS = ['🌐','💼','📸','🎨','🐦','📧','📷','🎵','▶️','🔗','📱','💬','🖥️','📝','🎸','📞','💻','🐙'];

// ===== TEMPLATES =====
const TEMPLATES = [
  { id:'minimal',  name:'Minimal',  free:true,  color:'linear-gradient(135deg,#1a1a2e,#16213e)' },
  { id:'blossom',  name:'Blossom',  free:true,  color:'linear-gradient(135deg,#2d0a2e,#6b1a6b)' },
  { id:'sunset',   name:'Sunset',   free:true,  color:'linear-gradient(180deg,#0a0010,#5a1a0a)' },
  { id:'glasspro', name:'Glass Pro',free:true,  color:'linear-gradient(135deg,#1a6aff,#0a1aff)' },
  { id:'gold',     name:'Gold',     free:false, color:'linear-gradient(135deg,#1a1200,#3d2e00)' },
  { id:'fire',     name:'Fire',     free:false, color:'linear-gradient(180deg,#1a0500,#7a2500)' },
  { id:'motion',   name:'Motion',   free:false, color:'linear-gradient(135deg,#0d1b2a,#1b2a4a)' },
  { id:'neon',     name:'Neon',     free:false, color:'linear-gradient(135deg,#000a14,#001a2e)' },
  { id:'glass',    name:'Glass',    free:false, color:'linear-gradient(135deg,#1a2a4a,#2a3a6a)' },
];

let state = {
  emoji: '🧑‍💻',
  photoURL: '',
  bgIdx: 0,
  templateId: 'minimal',
  skills: [],
  work: [],
  links: [],
  dirty: false
};

let currentUsername = '';
let currentUid = '';
let isDark = true;

// ===== AUTH =====
onAuthStateChanged(auth, async (user) => {
  if (!user) { window.location.href = './login.html'; return; }
  currentUid = user.uid;
  await loadPortfolio(user.uid);
});

// ===== LOAD =====
async function loadPortfolio(uid) {
  try {
    const q = query(collection(db, "portfolios"), where("uid","==",uid));
    const snap = await getDocs(q);
    if (snap.empty) { window.location.href = './claim.html'; return; }
    const data = snap.docs[0].data();
    currentUsername = data.username;
    document.getElementById('nav-username').textContent = `@${currentUsername}`;
    document.getElementById('browser-url').textContent = `folio.app/${currentUsername}`;
    document.getElementById('pf-name').value     = data.name     || '';
    document.getElementById('pf-role').value     = data.role     || '';
    document.getElementById('pf-bio').value      = data.bio      || '';
    document.getElementById('pf-location').value = data.location || '';
    state.emoji      = data.emoji      || '🧑‍💻';
    state.photoURL   = data.photoURL   || '';
    state.bgIdx      = data.bgIdx      || 0;
    state.templateId = data.templateId || 'minimal';
    state.skills     = data.skills     || [];
    state.work       = data.work       || [];
    state.links      = data.links      || [];
    if (state.photoURL) showPhoto(state.photoURL);
    else document.getElementById('avatar-emoji-display').textContent = state.emoji;
    renderTemplatesGrid();
    renderBgGrid();
    renderEmojiGrid();
    renderSkills();
    renderWork();
    renderLinks();
    renderPreview();
  } catch (err) { console.error(err); }
}

// ===== SAVE =====
async function savePortfolio() {
  const btn = document.getElementById('save-btn');
  btn.textContent = '...';
  btn.disabled = true;
  try {
    await updateDoc(doc(db, "portfolios", currentUsername), {
      name:       document.getElementById('pf-name').value     || '',
      role:       document.getElementById('pf-role').value     || '',
      bio:        document.getElementById('pf-bio').value      || '',
      location:   document.getElementById('pf-location').value || '',
      emoji:      state.emoji,
      photoURL:   state.photoURL,
      bgIdx:      state.bgIdx,
      templateId: state.templateId,
      skills:     state.skills,
      work:       state.work,
      links:      state.links,
    });
    state.dirty = false;
    showToast('Saved!');
  } catch (err) { showToast('Error saving.'); console.error(err); }
  btn.textContent = 'Save';
  btn.disabled = false;
}
window.savePortfolio = savePortfolio;

// ===== THEME =====
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('theme-btn').textContent = isDark ? '🌙' : '☀️';
  renderPreview();
}
window.toggleTheme = toggleTheme;

function markDirty() { state.dirty = true; renderPreview(); }
window.markDirty = markDirty;

// ===== PHOTO =====
async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const btn = document.querySelectorAll('.avatar-action-btn')[0];
  btn.textContent = 'Uploading...';
  try {
    const storageRef = ref(storage, `avatars/${currentUid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    state.photoURL = url;
    showPhoto(url);
    renderPreview();
    showToast('Photo uploaded!');
  } catch (err) { showToast('Upload failed.'); console.error(err); }
  btn.textContent = 'Upload photo';
}
window.handlePhotoUpload = handlePhotoUpload;

function showPhoto(url) {
  const img = document.getElementById('avatar-img');
  const emoji = document.getElementById('avatar-emoji-display');
  img.src = url; img.style.display = 'block'; emoji.style.display = 'none';
}

// ===== EMOJI =====
function toggleEmojiPicker() {
  const wrap = document.getElementById('emoji-picker-wrap');
  wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
}
window.toggleEmojiPicker = toggleEmojiPicker;

function renderEmojiGrid() {
  document.getElementById('emoji-grid').innerHTML = EMOJIS.map(e => `
    <button class="emoji-btn ${e===state.emoji?'active':''}" onclick="pickEmoji('${e}')">${e}</button>
  `).join('');
}
function pickEmoji(e) {
  state.emoji = e; state.photoURL = '';
  document.getElementById('avatar-img').style.display = 'none';
  const el = document.getElementById('avatar-emoji-display');
  el.style.display = 'block'; el.textContent = e;
  renderEmojiGrid(); renderPreview();
  document.getElementById('emoji-picker-wrap').style.display = 'none';
}
window.pickEmoji = pickEmoji;

// ===== BACKGROUND =====
function renderBgGrid() {
  document.getElementById('bg-grid').innerHTML = BACKGROUNDS.map((b,i) => `
    <div class="bg-swatch ${i===state.bgIdx?'active':''}" style="background:${b.bg}" onclick="pickBg(${i})">
      <div class="bg-swatch-label">${b.name}</div>
    </div>
  `).join('');
}
function pickBg(i) { state.bgIdx = i; renderBgGrid(); renderPreview(); }
window.pickBg = pickBg;

// ===== TEMPLATES GRID =====
function renderTemplatesGrid() {
  document.getElementById('templates-grid').innerHTML = TEMPLATES.map(t => `
    <div class="template-card ${t.id===state.templateId?'active':''} ${!t.free?'locked':''}"
      style="background:${t.color};"
      onclick="${t.free ? `pickTemplate('${t.id}')` : `showUpgradeModal()`}">
      <div class="template-preview">
        ${t.id==='fire'?'<div class="fire-anim"></div>':''}
        ${t.id==='motion'?'<div class="motion-orb"></div><div class="motion-orb-2"></div>':''}
        ${t.id==='glasspro'?`
          <div style="width:100%;height:100%;backdrop-filter:blur(8px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;">
            <div style="width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,0.3);border:1.5px solid rgba(255,255,255,0.5);"></div>
            <div style="width:40px;height:3px;border-radius:999px;background:rgba(255,255,255,0.4);"></div>
            <div style="width:30px;height:2px;border-radius:999px;background:rgba(255,255,255,0.25);"></div>
          </div>
        `:''}
      </div>
      <div class="template-name">${t.name}</div>
      ${t.free ? `<div class="template-free-badge">FREE</div>` : `<div class="template-badge">PRO</div>`}
    </div>
  `).join('');
}
function pickTemplate(id) { state.templateId = id; renderTemplatesGrid(); renderPreview(); }
window.pickTemplate = pickTemplate;

// ===== SKILLS =====
function renderSkills() {
  document.getElementById('skills-list').innerHTML = state.skills.map((s,i) => `
    <div class="skill-tag">${s}<button onclick="removeSkill(${i})">×</button></div>
  `).join('');
  renderPreview();
}
function addSkill() {
  const input = document.getElementById('skill-input');
  const val = input.value.trim();
  if (!val || state.skills.includes(val)) return;
  state.skills.push(val); input.value = ''; renderSkills();
}
function removeSkill(i) { state.skills.splice(i,1); renderSkills(); }
function handleSkillKey(e) { if (e.key==='Enter') addSkill(); }
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.handleSkillKey = handleSkillKey;

// ===== WORK =====
function renderWork() {
  document.getElementById('work-list').innerHTML = state.work.map((w,i) => `
    <div class="work-item">
      <div class="work-item-header">
        <span>Experience ${i+1}</span>
        <button class="del-item-btn" onclick="removeWork(${i})">×</button>
      </div>
      <input type="text" placeholder="Job Title" value="${w.title||''}" oninput="setWork(${i},'title',this.value)">
      <input type="text" placeholder="Company" value="${w.company||''}" oninput="setWork(${i},'company',this.value)">
      <input type="text" placeholder="2022 – Present" value="${w.date||''}" oninput="setWork(${i},'date',this.value)">
    </div>
  `).join('');
  renderPreview();
}
function addWork() { state.work.push({title:'',company:'',date:''}); renderWork(); }
function removeWork(i) { state.work.splice(i,1); renderWork(); }
function setWork(i,f,v) { state.work[i][f]=v; renderPreview(); }
window.addWork = addWork;
window.removeWork = removeWork;
window.setWork = setWork;

// ===== LINKS =====
function renderLinks() {
  document.getElementById('links-list').innerHTML = state.links.map((l,i) => `
    <div class="link-item">
      <button class="link-icon-btn" onclick="cycleLinkIcon(${i})">${l.icon||'🔗'}</button>
      <input type="text" placeholder="Label" value="${l.title||''}" oninput="setLinkField(${i},'title',this.value)">
      <input type="text" class="url-in" placeholder="https://..." value="${l.url||''}" oninput="setLinkField(${i},'url',this.value)">
      <button class="del-item-btn" onclick="removeLink(${i})">×</button>
    </div>
  `).join('');
  renderPreview();
}
function addLink() { state.links.push({icon:'🔗',title:'',url:''}); renderLinks(); }
function removeLink(i) { state.links.splice(i,1); renderLinks(); }
function setLinkField(i,f,v) { state.links[i][f]=v; renderPreview(); }
function cycleLinkIcon(i) {
  const cur = LINK_ICONS.indexOf(state.links[i].icon||'🔗');
  state.links[i].icon = LINK_ICONS[(cur+1)%LINK_ICONS.length];
  renderLinks();
}
window.addLink = addLink;
window.removeLink = removeLink;
window.setLinkField = setLinkField;
window.cycleLinkIcon = cycleLinkIcon;

// ===== AVATAR HTML =====
function avatarHTML(data, size='66px', fontSize='1.9rem') {
  if (data.photoURL) {
    return `<div style="width:${size};height:${size};border-radius:50%;overflow:hidden;border:2.5px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.1);margin:0 auto 0.75rem;">
      <img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">
    </div>`;
  }
  return `<div style="width:${size};height:${size};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${fontSize};border:2.5px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);margin:0 auto 0.75rem;">${data.emoji}</div>`;
}

// ===== PREVIEW =====
function renderPreview() {
  const data = {
    name:     document.getElementById('pf-name')?.value     || '',
    role:     document.getElementById('pf-role')?.value     || '',
    bio:      document.getElementById('pf-bio')?.value      || '',
    location: document.getElementById('pf-location')?.value || '',
    emoji:    state.emoji,
    photoURL: state.photoURL,
    skills:   state.skills,
    work:     state.work,
    links:    state.links,
  };
  const bg = BACKGROUNDS[state.bgIdx].bg;
  const html = buildTemplate(state.templateId, data, bg, isDark);
  document.getElementById('pf-preview-card').innerHTML = html;
}
window.renderPreview = renderPreview;

// ===== BUILD TEMPLATE =====
function buildTemplate(id, data, bg, isDark) {
  switch(id) {
    case 'gold':     return renderGold(data, bg, isDark);
    case 'fire':     return renderFire(data, bg, isDark);
    case 'motion':   return renderMotion(data, bg, isDark);
    case 'blossom':  return renderBlossom(data, bg, isDark);
    case 'neon':     return renderNeon(data, bg, isDark);
    case 'glass':    return renderGlass(data, bg, isDark);
    case 'sunset':   return renderSunset(data, bg, isDark);
    case 'glasspro': return renderGlassPro(data, bg, isDark);
    default:         return renderMinimal(data, bg, isDark);
  }
}

// ===== HELPERS =====
function skillsBlock(data, color='rgba(255,255,255,0.78)', bg='rgba(255,255,255,0.1)', border='rgba(255,255,255,0.15)', label='rgba(255,255,255,0.35)') {
  if (!data.skills.length) return '';
  return `<div style="padding-top:0.9rem;">
    <div style="font-size:0.6rem;font-weight:700;color:${label};letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Skills</div>
    <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
      ${data.skills.map(s=>`<span style="background:${bg};border:1px solid ${border};border-radius:999px;padding:0.2rem 0.55rem;font-size:0.68rem;color:${color};">${s}</span>`).join('')}
    </div>
  </div>`;
}

function workBlock(data, color='#fff', sub='rgba(255,255,255,0.52)', date='rgba(255,255,255,0.32)', label='rgba(255,255,255,0.32)') {
  const filled = data.work.filter(w=>w.title);
  if (!filled.length) return '';
  return `<div style="padding-top:0.9rem;">
    <div style="font-size:0.6rem;font-weight:700;color:${label};letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Experience</div>
    ${filled.map(w=>`
      <div style="margin-bottom:0.45rem;">
        <div style="font-size:0.8rem;font-weight:700;color:${color};">${w.title}</div>
        ${w.company?`<div style="font-size:0.72rem;color:${sub};">${w.company}</div>`:''}
        ${w.date?`<div style="font-size:0.66rem;color:${date};">${w.date}</div>`:''}
      </div>`).join('')}
  </div>`;
}

function linksBlock(data, color='rgba(255,255,255,0.85)', bg='rgba(255,255,255,0.08)', border='rgba(255,255,255,0.1)', label='rgba(255,255,255,0.32)') {
  const filled = data.links.filter(l=>l.title);
  if (!filled.length) return '';
  return `<div style="padding-top:0.9rem;">
    <div style="font-size:0.6rem;font-weight:700;color:${label};letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Links</div>
    ${filled.map(l=>`
      <div style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem;border-radius:9px;background:${bg};border:1px solid ${border};font-size:0.8rem;color:${color};margin-bottom:0.38rem;">
        ${l.icon||'🔗'} ${l.title}
      </div>`).join('')}
  </div>`;
}

function footer(bg='#0d0d14', color='rgba(255,255,255,0.2)', border='rgba(255,255,255,0.07)') {
  return `<div style="text-align:center;padding:0.75rem;border-top:1px solid ${border};background:${bg};font-size:0.6rem;font-family:'Space Mono',monospace;color:${color};">folio.app</div>`;
}

// ===== TEMPLATE: MINIMAL =====
function renderMinimal(data, bg, isDark) {
  const bodyBg = isDark ? '#0d0d14' : '#fff';
  const textColor = isDark ? 'rgba(255,255,255,0.85)' : '#111';
  return `
    <div style="background:${bg};padding:1.8rem 1.4rem 1.4rem;text-align:center;">
      ${avatarHTML(data)}
      <div style="font-size:1.15rem;font-weight:800;color:#fff;">${data.name||'Your Name'}</div>
      <div style="font-size:0.74rem;color:rgba(255,255,255,0.58);margin:0.2rem 0 0.4rem;">${data.role||'Your Title'}</div>
      ${data.location?`<div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:0.3rem;">📍 ${data.location}</div>`:''}
      ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,255,255,0.7);line-height:1.55;">${data.bio}</div>`:''}
    </div>
    <div style="background:${bodyBg};padding:0 1.1rem 1.2rem;color:${textColor};">
      ${skillsBlock(data)}${workBlock(data)}${linksBlock(data)}
    </div>
    ${footer(bodyBg)}`;
}

// ===== TEMPLATE: GLASS PRO =====
function renderGlassPro(data, bg, isDark) {
  // دوو کارت — شین و رەش — بەجوڵەی swipe
  return `
    <style>
      .gp-slider { position:relative; overflow:hidden; touch-action:pan-y; user-select:none; }
      .gp-track { display:flex; transition:transform 0.45s cubic-bezier(0.4,0,0.2,1); }
      .gp-slide { min-width:100%; flex-shrink:0; }
      .gp-dots { display:flex; justify-content:center; gap:6px; padding:0.6rem 0; }
      .gp-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.25); cursor:pointer; transition:all 0.2s; }
      .gp-dot.active { background:#fff; width:18px; border-radius:999px; }
      @keyframes glassShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
      .shimmer::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent); animation:glassShimmer 3s ease-in-out infinite; }
    </style>

    <div class="gp-slider" id="gp-slider" style="border-radius:18px;overflow:hidden;">
      <div class="gp-track" id="gp-track">

        <!-- CARD 1: BLUE GLASS -->
        <div class="gp-slide">
          <div style="background:linear-gradient(135deg,rgba(30,100,255,0.85),rgba(10,40,180,0.9));backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding:2rem 1.5rem 1.5rem;text-align:center;position:relative;overflow:hidden;" class="shimmer">
            <div style="position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.06);"></div>
            <div style="position:absolute;bottom:-30px;left:-30px;width:90px;height:90px;border-radius:50%;background:rgba(255,255,255,0.04);"></div>
            <div style="position:relative;z-index:1;">
              <div style="width:72px;height:72px;border-radius:50%;margin:0 auto 0.9rem;border:2px solid rgba(255,255,255,0.5);background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;font-size:2rem;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,80,0.3);">
                ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
              </div>
              <div style="font-size:1.2rem;font-weight:800;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,0.3);">${data.name||'Your Name'}</div>
              <div style="font-size:0.76rem;color:rgba(255,255,255,0.75);margin:0.2rem 0 0.5rem;">${data.role||'Your Title'}</div>
              ${data.location?`<div style="font-size:0.7rem;color:rgba(255,255,255,0.55);margin-bottom:0.5rem;">📍 ${data.location}</div>`:''}
              ${data.bio?`<div style="font-size:0.8rem;color:rgba(255,255,255,0.8);line-height:1.6;font-style:italic;">"${data.bio}"</div>`:''}
            </div>
          </div>
          <div style="background:rgba(10,30,120,0.92);backdrop-filter:blur(20px);padding:0.8rem 1.3rem 1.2rem;">
            ${data.skills.length?`
              <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:0.7rem;padding-top:0.5rem;">
                ${data.skills.map(s=>`<span style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:999px;padding:0.22rem 0.6rem;font-size:0.7rem;color:rgba(255,255,255,0.9);">${s}</span>`).join('')}
              </div>`:''}
            ${data.links.filter(l=>l.title).length?`
              <div style="display:flex;flex-direction:column;gap:0.45rem;">
                ${data.links.filter(l=>l.title).map(l=>`
                  <div style="display:flex;align-items:center;gap:0.55rem;padding:0.65rem 0.9rem;border-radius:12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:#fff;font-size:0.82rem;backdrop-filter:blur(8px);">
                    ${l.icon||'🔗'} ${l.title}
                  </div>`).join('')}
              </div>`:''}
          </div>
          <div style="background:rgba(10,30,120,0.92);text-align:center;padding:0.6rem;border-top:1px solid rgba(255,255,255,0.08);font-size:0.58rem;font-family:'Space Mono',monospace;color:rgba(255,255,255,0.3);">folio.app</div>
        </div>

        <!-- CARD 2: DARK GLASS -->
        <div class="gp-slide">
          <div style="background:linear-gradient(135deg,rgba(15,15,25,0.92),rgba(5,5,15,0.96));backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);padding:2rem 1.5rem 1.5rem;text-align:center;position:relative;overflow:hidden;" class="shimmer">
            <div style="position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;background:rgba(124,109,250,0.08);"></div>
            <div style="position:absolute;bottom:-30px;left:-30px;width:90px;height:90px;border-radius:50%;background:rgba(250,109,143,0.06);"></div>
            <div style="position:relative;z-index:1;">
              <div style="width:72px;height:72px;border-radius:50%;margin:0 auto 0.9rem;border:2px solid rgba(124,109,250,0.4);background:rgba(124,109,250,0.1);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;font-size:2rem;overflow:hidden;box-shadow:0 4px 20px rgba(124,109,250,0.2);">
                ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
              </div>
              <div style="font-size:1.2rem;font-weight:800;color:#fff;">${data.name||'Your Name'}</div>
              <div style="font-size:0.76rem;color:rgba(124,109,250,0.8);margin:0.2rem 0 0.5rem;">${data.role||'Your Title'}</div>
              ${data.location?`<div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:0.5rem;">📍 ${data.location}</div>`:''}
              ${data.bio?`<div style="font-size:0.8rem;color:rgba(255,255,255,0.65);line-height:1.6;font-style:italic;">"${data.bio}"</div>`:''}
            </div>
          </div>
          <div style="background:rgba(8,8,16,0.95);backdrop-filter:blur(20px);padding:0.8rem 1.3rem 1.2rem;">
            ${data.skills.length?`
              <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:0.7rem;padding-top:0.5rem;">
                ${data.skills.map(s=>`<span style="background:rgba(124,109,250,0.1);border:1px solid rgba(124,109,250,0.25);border-radius:999px;padding:0.22rem 0.6rem;font-size:0.7rem;color:#a89cfc;">${s}</span>`).join('')}
              </div>`:''}
            ${data.links.filter(l=>l.title).length?`
              <div style="display:flex;flex-direction:column;gap:0.45rem;">
                ${data.links.filter(l=>l.title).map(l=>`
                  <div style="display:flex;align-items:center;gap:0.55rem;padding:0.65rem 0.9rem;border-radius:12px;background:rgba(124,109,250,0.08);border:1px solid rgba(124,109,250,0.18);color:rgba(255,255,255,0.85);font-size:0.82rem;">
                    ${l.icon||'🔗'} ${l.title}
                  </div>`).join('')}
              </div>`:''}
          </div>
          <div style="background:rgba(8,8,16,0.95);text-align:center;padding:0.6rem;border-top:1px solid rgba(124,109,250,0.1);font-size:0.58rem;font-family:'Space Mono',monospace;color:rgba(124,109,250,0.25);">folio.app</div>
        </div>

      </div>

      <!-- DOTS -->
      <div class="gp-dots" style="background:${isDark?'rgba(8,8,16,0.95)':'rgba(255,255,255,0.95)'};">
        <div class="gp-dot active" id="gp-dot-0" onclick="gpGoTo(0)"></div>
        <div class="gp-dot" id="gp-dot-1" onclick="gpGoTo(1)"></div>
      </div>
    </div>

    <script>
      let gpCurrent = 0;
      let gpStartX = 0;
      const gpSlider = document.getElementById('gp-slider');
      const gpTrack = document.getElementById('gp-track');
      if (gpSlider) {
        gpSlider.addEventListener('touchstart', e => { gpStartX = e.touches[0].clientX; }, {passive:true});
        gpSlider.addEventListener('touchend', e => {
          const diff = gpStartX - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) gpGoTo(diff > 0 ? 1 : 0);
        });
        gpSlider.addEventListener('mousedown', e => { gpStartX = e.clientX; });
        gpSlider.addEventListener('mouseup', e => {
          const diff = gpStartX - e.clientX;
          if (Math.abs(diff) > 40) gpGoTo(diff > 0 ? 1 : 0);
        });
      }
      function gpGoTo(idx) {
        gpCurrent = idx;
        if (gpTrack) gpTrack.style.transform = \`translateX(-\${idx * 100}%)\`;
        document.querySelectorAll('.gp-dot').forEach((d,i) => d.classList.toggle('active', i===idx));
      }
      window.gpGoTo = gpGoTo;
    <\/script>`;
}

// ===== TEMPLATE: GOLD =====
function renderGold(data, bg, isDark) {
  return `
    <div style="background:linear-gradient(135deg,#1a1200,#3d2e00);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at top,rgba(245,200,66,0.12),transparent 70%);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        ${avatarHTML(data)}
        <div style="font-size:1.15rem;font-weight:800;color:#f5c842;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(245,200,66,0.6);margin:0.2rem 0 0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(245,200,66,0.4);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(245,200,66,0.72);line-height:1.55;margin-top:0.4rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#110e00;padding:0 1.1rem 1.2rem;">
      ${skillsBlock(data,'#f5c842','rgba(245,200,66,0.1)','rgba(245,200,66,0.25)','rgba(245,200,66,0.32)')}
      ${workBlock(data,'#f5c842','rgba(245,200,66,0.5)','rgba(245,200,66,0.3)','rgba(245,200,66,0.32)')}
      ${linksBlock(data,'#f5c842','rgba(245,200,66,0.07)','rgba(245,200,66,0.15)','rgba(245,200,66,0.32)')}
    </div>
    ${footer('#110e00','rgba(245,200,66,0.2)','rgba(245,200,66,0.1)')}`;
}

// ===== TEMPLATE: FIRE =====
function renderFire(data, bg, isDark) {
  return `
    <style>
      @keyframes fireFlicker{0%,100%{opacity:1;transform:scaleY(1)}50%{opacity:.88;transform:scaleY(1.05)}}
      @keyframes ember{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-60px) scale(0);opacity:0}}
      .ff{animation:fireFlicker 1.2s ease-in-out infinite}
      .ep{position:absolute;width:3px;height:3px;border-radius:50%;animation:ember 2s ease-out infinite}
    </style>
    <div style="background:linear-gradient(180deg,#0d0200,#2a0800,#5a1500);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div class="ff" style="position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(180deg,transparent,rgba(255,80,0,0.22),rgba(255,40,0,0.45));"></div>
      <div class="ep" style="left:20%;animation-delay:0s;background:#ff4500;"></div>
      <div class="ep" style="left:55%;animation-delay:0.7s;background:#ff6a00;"></div>
      <div class="ep" style="left:78%;animation-delay:1.2s;background:#ffa500;"></div>
      <div style="position:relative;z-index:1;">
        ${avatarHTML(data)}
        <div style="font-size:1.15rem;font-weight:800;color:#ff8c42;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(255,140,66,0.62);margin:0.2rem 0 0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(255,140,66,0.42);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,140,66,0.75);line-height:1.55;margin-top:0.4rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#0d0200;padding:0 1.1rem 1.2rem;">
      ${skillsBlock(data,'#ff8c42','rgba(255,100,0,0.1)','rgba(255,100,0,0.28)','rgba(255,140,66,0.32)')}
      ${linksBlock(data,'#ff8c42','rgba(255,80,0,0.08)','rgba(255,80,0,0.18)','rgba(255,140,66,0.32)')}
    </div>
    ${footer('#0d0200','rgba(255,140,66,0.2)','rgba(255,80,0,0.1)')}`;
}

// ===== TEMPLATE: MOTION =====
function renderMotion(data, bg, isDark) {
  return `
    <style>
      @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes floatDown{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
      .orb1{animation:floatUp 3s ease-in-out infinite}
      .orb2{animation:floatDown 4s ease-in-out infinite}
      .orb3{animation:floatUp 5s ease-in-out infinite;animation-delay:1s;}
    </style>
    <div style="background:linear-gradient(135deg,#0d1b2a,#1b2a4a);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div class="orb1" style="position:absolute;top:8%;left:8%;width:55px;height:55px;border-radius:50%;background:radial-gradient(circle,rgba(124,109,250,0.35),transparent);pointer-events:none;"></div>
      <div class="orb2" style="position:absolute;bottom:12%;right:8%;width:38px;height:38px;border-radius:50%;background:radial-gradient(circle,rgba(250,109,143,0.3),transparent);pointer-events:none;"></div>
      <div class="orb3" style="position:absolute;top:50%;left:4%;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle,rgba(109,250,204,0.25),transparent);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        ${avatarHTML(data)}
        <div style="font-size:1.15rem;font-weight:800;color:#fff;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(124,109,250,0.85);margin:0.2rem 0 0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(255,255,255,0.42);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,255,255,0.7);line-height:1.55;margin-top:0.4rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#080e1a;padding:0 1.1rem 1.2rem;">
      ${skillsBlock(data)}${workBlock(data)}${linksBlock(data)}
    </div>
    ${footer('#080e1a','rgba(124,109,250,0.25)','rgba(124,109,250,0.1)')}`;
}

// ===== TEMPLATE: BLOSSOM =====
function renderBlossom(data, bg, isDark) {
  return `
    <style>
      @keyframes petalFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-10px) rotate(8deg)}}
      .petal{position:absolute;animation:petalFloat 3s ease-in-out infinite;pointer-events:none;font-size:0.85rem;}
    </style>
    <div style="background:linear-gradient(135deg,#2d0a2e,#6b1a4a,#2a0a3e);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <span class="petal" style="top:8%;left:10%;animation-delay:0s;">🌸</span>
      <span class="petal" style="top:14%;right:8%;animation-delay:0.8s;">🌺</span>
      <span class="petal" style="bottom:18%;left:6%;animation-delay:1.5s;font-size:0.68rem;">🌸</span>
      <span class="petal" style="bottom:8%;right:12%;animation-delay:0.4s;font-size:0.72rem;">✨</span>
      <div style="position:relative;z-index:1;">
        ${avatarHTML(data)}
        <div style="font-size:1.15rem;font-weight:800;color:#ffb3d9;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(255,150,200,0.65);margin:0.2rem 0 0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(255,150,200,0.42);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,180,220,0.75);line-height:1.55;margin-top:0.4rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#1a0520;padding:0 1.1rem 1.2rem;">
      ${skillsBlock(data,'#ffb3d9','rgba(255,100,180,0.1)','rgba(255,100,180,0.25)','rgba(255,150,200,0.32)')}
      ${linksBlock(data,'#ffb3d9','rgba(255,100,180,0.07)','rgba(255,100,180,0.15)','rgba(255,150,200,0.32)')}
    </div>
    ${footer('#1a0520','rgba(255,150,200,0.2)','rgba(255,100,180,0.1)')}`;
}

// ===== TEMPLATE: NEON =====
function renderNeon(data, bg, isDark) {
  return `
    <style>
      @keyframes neonPulse{0%,100%{text-shadow:0 0 6px #00fff5,0 0 18px #00fff5}50%{text-shadow:0 0 3px #00fff5,0 0 8px #00fff5}}
      @keyframes borderPulse{0%,100%{box-shadow:0 0 8px rgba(0,255,245,0.35)}50%{box-shadow:0 0 18px rgba(0,255,245,0.7)}}
      .nt{animation:neonPulse 2.5s ease-in-out infinite}
      .nb{animation:borderPulse 2.5s ease-in-out infinite}
    </style>
    <div style="background:linear-gradient(135deg,#000a14,#001a2e,#000d1a);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,245,0.015) 2px,rgba(0,255,245,0.015) 4px);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div class="nb" style="width:66px;height:66px;border-radius:50%;margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.9rem;border:2px solid rgba(0,255,245,0.55);background:rgba(0,255,245,0.05);overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
        </div>
        <div class="nt" style="font-size:1.15rem;font-weight:800;color:#00fff5;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(0,255,245,0.55);margin:0.2rem 0 0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(0,255,245,0.35);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(0,255,245,0.65);line-height:1.55;margin-top:0.4rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#000810;padding:0 1.1rem 1.2rem;">
      ${skillsBlock(data,'#00fff5','rgba(0,255,245,0.07)','rgba(0,255,245,0.22)','rgba(0,255,245,0.28)')}
      ${linksBlock(data,'#00fff5','rgba(0,255,245,0.05)','rgba(0,255,245,0.15)','rgba(0,255,245,0.28)')}
    </div>
    ${footer('#000810','rgba(0,255,245,0.2)','rgba(0,255,245,0.08)')}`;
}

// ===== TEMPLATE: GLASS =====
function renderGlass(data, bg, isDark) {
  return `
    <div style="background:linear-gradient(135deg,#1a2a4a,#2a3a6a,#1a2a5a);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-30%;left:-20%;width:180%;height:180%;background:radial-gradient(ellipse at 30% 40%,rgba(255,255,255,0.06),transparent 60%);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:66px;height:66px;border-radius:50%;margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.9rem;border:1.5px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
        </div>
        <div style="font-size:1.15rem;font-weight:800;color:#fff;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(255,255,255,0.55);margin:0.2rem 0 0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(255,255,255,0.38);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,255,255,0.68);line-height:1.55;margin-top:0.4rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:rgba(14,22,50,0.96);padding:0 1.1rem 1.2rem;">
      ${skillsBlock(data)}${workBlock(data)}${linksBlock(data)}
    </div>
    ${footer('rgba(14,22,50,0.96)')}`;
}

// ===== TEMPLATE: SUNSET =====
function renderSunset(data, bg, isDark) {
  return `
    <style>
      @keyframes sunsetGlow{0%,100%{opacity:0.55}50%{opacity:0.95}}
      .sg{animation:sunsetGlow 3.5s ease-in-out infinite}
    </style>
    <div style="background:linear-gradient(180deg,#0a0010,#2a0a1a,#5a1a0a,#3a0a00);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div class="sg" style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:130px;height:65px;background:radial-gradient(ellipse,rgba(255,120,0,0.38),transparent);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        ${avatarHTML(data)}
        <div style="font-size:1.15rem;font-weight:800;background:linear-gradient(135deg,#ff8c42,#ff4da6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(255,140,80,0.65);margin:0.2rem 0 0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(255,140,80,0.42);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,160,100,0.72);line-height:1.55;margin-top:0.4rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#0d0008;padding:0 1.1rem 1.2rem;">
      ${skillsBlock(data,'#ff8c42','rgba(255,100,0,0.1)','rgba(255,100,0,0.25)','rgba(255,140,80,0.3)')}
      ${linksBlock(data,'#ff8c42','rgba(255,100,0,0.07)','rgba(255,100,0,0.15)','rgba(255,140,80,0.3)')}
    </div>
    ${footer('#0d0008','rgba(255,140,80,0.2)','rgba(255,100,0,0.1)')}`;
}

// ===== UPGRADE MODAL =====
function showUpgradeModal() { document.getElementById('upgrade-modal').classList.add('open'); }
function closeUpgradeModal() { document.getElementById('upgrade-modal').classList.remove('open'); }
function handleModalClick(e) { if (e.target===e.currentTarget) closeUpgradeModal(); }
window.showUpgradeModal = showUpgradeModal;
window.closeUpgradeModal = closeUpgradeModal;
window.handleModalClick = handleModalClick;

// ===== VIEW / LOGOUT =====
function viewPortfolio() { window.open(`./portfolio.html?u=${currentUsername}`, '_blank'); }
window.viewPortfolio = viewPortfolio;

async function logout() { await signOut(auth); window.location.href = './login.html'; }
window.logout = logout;

// ===== MOBILE TABS =====
function showMobileTab(tab) {
  const sidebar = document.getElementById('dash-sidebar');
  const preview = document.getElementById('dash-preview');
  const editBtn = document.getElementById('mob-edit-btn');
  const prevBtn = document.getElementById('mob-preview-btn');
  if (tab==='edit') {
    sidebar.style.display=''; preview.style.display='none';
    editBtn.classList.add('active'); prevBtn.classList.remove('active');
  } else {
    sidebar.style.display='none'; preview.style.display='block';
    prevBtn.classList.add('active'); editBtn.classList.remove('active');
    renderPreview();
  }
}
window.showMobileTab = showMobileTab;

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

window.addEventListener('beforeunload', (e) => {
  if (state.dirty) { e.preventDefault(); e.returnValue=''; }
});
