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

// ===== EMOJIS =====
const EMOJIS = ['🧑‍💻','👨‍🎨','👩‍🎨','🚀','⚡','✨','🎯','💡','🌙','🔥','💎','🌟','🎨','📱','🖥️','🛸','🦄','🐉','🌊','🏔️','🎸','📷','✍️','🧩','🎀','🌸','🦋','🌺','💫','🎭'];

// ===== BACKGROUNDS =====
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

// ===== TEMPLATES =====
const TEMPLATES = [
  {
    id: 'minimal',
    name: 'Minimal',
    free: true,
    style: 'background: linear-gradient(135deg,#1a1a2e,#16213e);',
    animClass: '',
    render: (data, bg, isDark) => renderMinimal(data, bg, isDark),
  },
  {
    id: 'gold',
    name: 'Gold',
    free: false,
    style: 'background: linear-gradient(135deg,#1a1200,#3d2e00); border-color: #f5c842;',
    animClass: 'tpl-gold',
    render: (data, bg, isDark) => renderGold(data, bg, isDark),
  },
  {
    id: 'fire',
    name: 'Fire',
    free: false,
    style: 'background: linear-gradient(180deg,#1a0500,#7a2500);',
    animClass: 'fire-bg',
    render: (data, bg, isDark) => renderFire(data, bg, isDark),
  },
  {
    id: 'motion',
    name: 'Motion',
    free: false,
    style: 'background: linear-gradient(135deg,#0d1b2a,#1b2a4a);',
    animClass: 'motion-bg',
    render: (data, bg, isDark) => renderMotion(data, bg, isDark),
  },
  {
    id: 'blossom',
    name: 'Blossom',
    free: true,
    style: 'background: linear-gradient(135deg,#2d0a2e,#6b1a6b);',
    animClass: '',
    render: (data, bg, isDark) => renderBlossom(data, bg, isDark),
  },
  {
    id: 'neon',
    name: 'Neon',
    free: false,
    style: 'background: linear-gradient(135deg,#000a14,#001a2e);',
    animClass: '',
    render: (data, bg, isDark) => renderNeon(data, bg, isDark),
  },
  {
    id: 'glass',
    name: 'Glass',
    free: false,
    style: 'background: linear-gradient(135deg,#1a2a4a,#2a3a6a);',
    animClass: '',
    render: (data, bg, isDark) => renderGlass(data, bg, isDark),
  },
  {
    id: 'sunset',
    name: 'Sunset',
    free: true,
    style: 'background: linear-gradient(135deg,#2a0a1a,#6a2a0a);',
    animClass: '',
    render: (data, bg, isDark) => renderSunset(data, bg, isDark),
  },
];

const LINK_ICONS = ['🌐','💼','📸','🎨','🐦','📧','📷','🎵','▶️','🔗','📱','💬','🖥️','📝','🎸','📞','💻','🐙'];

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
    showToast('✓ Saved!');
  } catch (err) {
    showToast('Error saving.');
    console.error(err);
  }

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
    showToast('✓ Photo uploaded!');
  } catch (err) {
    showToast('Upload failed.');
    console.error(err);
  }
  btn.textContent = 'Upload photo';
}
window.handlePhotoUpload = handlePhotoUpload;

function showPhoto(url) {
  const img = document.getElementById('avatar-img');
  const emoji = document.getElementById('avatar-emoji-display');
  img.src = url;
  img.style.display = 'block';
  emoji.style.display = 'none';
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
  state.emoji = e;
  state.photoURL = '';
  document.getElementById('avatar-img').style.display = 'none';
  const el = document.getElementById('avatar-emoji-display');
  el.style.display = 'block';
  el.textContent = e;
  renderEmojiGrid();
  renderPreview();
  document.getElementById('emoji-picker-wrap').style.display = 'none';
}
window.pickEmoji = pickEmoji;

// ===== BACKGROUND =====
function renderBgGrid() {
  document.getElementById('bg-grid').innerHTML = BACKGROUNDS.map((b,i) => `
    <div class="bg-swatch ${i===state.bgIdx?'active':''}"
      style="background:${b.bg}" onclick="pickBg(${i})">
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
      style="${t.style}"
      onclick="${t.free ? `pickTemplate('${t.id}')` : `showUpgradeModal()`}">
      <div class="template-preview ${t.animClass}">
        ${t.id==='fire' ? '<div class="fire-anim"></div>' : ''}
        ${t.id==='motion' ? '<div class="motion-orb"></div><div class="motion-orb-2"></div>' : ''}
        <div class="template-name">${t.name}</div>
      </div>
      ${t.free
        ? `<div class="template-free-badge">FREE</div>`
        : `<div class="template-badge">PRO</div>`
      }
    </div>
  `).join('');
}
function pickTemplate(id) {
  state.templateId = id;
  renderTemplatesGrid();
  renderPreview();
}
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
  state.skills.push(val);
  input.value = '';
  renderSkills();
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
  const tpl = TEMPLATES.find(t => t.id === state.templateId) || TEMPLATES[0];
  document.getElementById('pf-preview-card').innerHTML = tpl.render(data, bg, isDark);
}
window.renderPreview = renderPreview;

// ===== AVATAR HTML =====
function avatarHTML(data, size='66px', fontSize='1.9rem') {
  return data.photoURL
    ? `<div class="pf-prev-avi" style="width:${size};height:${size};"><img src="${data.photoURL}" alt=""></div>`
    : `<div class="pf-prev-avi" style="width:${size};height:${size};font-size:${fontSize};">${data.emoji}</div>`;
}

function skillsHTML(data) {
  if (!data.skills.length) return '';
  return `<div>
    <div class="pf-prev-section-title">Skills</div>
    <div class="pf-prev-skills">
      ${data.skills.map(s=>`<span class="pf-prev-skill">${s}</span>`).join('')}
    </div>
  </div>`;
}

function workHTML(data) {
  const filled = data.work.filter(w=>w.title);
  if (!filled.length) return '';
  return `<div>
    <div class="pf-prev-section-title">Experience</div>
    ${filled.map(w=>`
      <div class="pf-prev-work-item">
        <div class="pf-prev-work-title">${w.title}</div>
        ${w.company?`<div class="pf-prev-work-company">${w.company}</div>`:''}
        ${w.date?`<div class="pf-prev-work-date">${w.date}</div>`:''}
      </div>`).join('')}
  </div>`;
}

function linksHTML(data) {
  const filled = data.links.filter(l=>l.title);
  if (!filled.length) return '';
  return `<div>
    <div class="pf-prev-section-title">Links</div>
    ${filled.map(l=>`<div class="pf-prev-link">${l.icon||'🔗'} ${l.title}</div>`).join('')}
  </div>`;
}

function emptyMsg() {
  return `<div style="text-align:center;padding:1rem;font-size:0.75rem;color:rgba(150,150,180,0.4);">
    Add info from the editor
  </div>`;
}

function bodyContent(data) {
  const s = skillsHTML(data);
  const w = workHTML(data);
  const l = linksHTML(data);
  return (s||w||l) ? s+w+l : emptyMsg();
}

// ===== TEMPLATE RENDERS =====

// 1. MINIMAL
function renderMinimal(data, bg, isDark) {
  const bodyBg = isDark ? '#0d0d14' : '#fff';
  return `
    <div class="pf-prev-header" style="background:${bg};">
      ${avatarHTML(data)}
      <div class="pf-prev-name">${data.name||'Your Name'}</div>
      <div class="pf-prev-role">${data.role||'Your Title'}</div>
      ${data.location?`<div class="pf-prev-location">📍 ${data.location}</div>`:''}
      ${data.bio?`<div class="pf-prev-bio">${data.bio}</div>`:''}
    </div>
    <div class="pf-prev-body" style="background:${bodyBg};">
      ${bodyContent(data)}
    </div>
    <div class="pf-prev-footer" style="background:${bodyBg};">folio.app · built with ❤️</div>`;
}

// 2. GOLD
function renderGold(data, bg, isDark) {
  return `
    <div style="background:linear-gradient(135deg,#1a1200,#3d2e00);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:radial-gradient(ellipse at top,rgba(245,200,66,0.15),transparent 70%);pointer-events:none;"></div>
      <div style="width:66px;height:66px;border-radius:50%;margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.9rem;border:2.5px solid rgba(245,200,66,0.6);background:rgba(245,200,66,0.08);overflow:hidden;">
        ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
      </div>
      <div style="font-size:1.15rem;font-weight:800;color:#f5c842;margin-bottom:0.2rem;">${data.name||'Your Name'}</div>
      <div style="font-size:0.74rem;color:rgba(245,200,66,0.6);margin-bottom:0.4rem;">${data.role||'Your Title'}</div>
      ${data.location?`<div style="font-size:0.7rem;color:rgba(245,200,66,0.4);">📍 ${data.location}</div>`:''}
      ${data.bio?`<div style="font-size:0.78rem;color:rgba(245,200,66,0.7);line-height:1.55;margin-top:0.5rem;">${data.bio}</div>`:''}
    </div>
    <div style="background:#110e00;padding:0 1.1rem 1.4rem;">
      ${data.skills.length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(245,200,66,0.35);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Skills</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
            ${data.skills.map(s=>`<span style="background:rgba(245,200,66,0.1);border:1px solid rgba(245,200,66,0.25);border-radius:999px;padding:0.2rem 0.55rem;font-size:0.68rem;color:#f5c842;">${s}</span>`).join('')}
          </div>
        </div>`:''}
      ${data.work.filter(w=>w.title).length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(245,200,66,0.35);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Experience</div>
          ${data.work.filter(w=>w.title).map(w=>`
            <div style="margin-bottom:0.45rem;">
              <div style="font-size:0.8rem;font-weight:700;color:#f5c842;">${w.title}</div>
              ${w.company?`<div style="font-size:0.72rem;color:rgba(245,200,66,0.5);">${w.company}</div>`:''}
              ${w.date?`<div style="font-size:0.66rem;color:rgba(245,200,66,0.3);">${w.date}</div>`:''}
            </div>`).join('')}
        </div>`:''}
      ${data.links.filter(l=>l.title).length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(245,200,66,0.35);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Links</div>
          ${data.links.filter(l=>l.title).map(l=>`
            <div style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem 0.85rem;border-radius:9px;background:rgba(245,200,66,0.06);border:1px solid rgba(245,200,66,0.12);font-size:0.8rem;color:#f5c842;margin-bottom:0.38rem;">
              ${l.icon||'🔗'} ${l.title}
            </div>`).join('')}
        </div>`:''}
    </div>
    <div style="text-align:center;padding:0.75rem;border-top:1px solid rgba(245,200,66,0.1);background:#110e00;font-size:0.6rem;font-family:'Space Mono',monospace;color:rgba(245,200,66,0.2);">folio.app · built with ❤️</div>`;
}

// 3. FIRE
function renderFire(data, bg, isDark) {
  return `
    <style>
      @keyframes fireFlicker{0%,100%{opacity:1;transform:scaleY(1) translateX(0)}25%{opacity:.85;transform:scaleY(1.06) translateX(1px)}50%{opacity:.9;transform:scaleY(.97) translateX(-1px)}75%{opacity:.88;transform:scaleY(1.04) translateX(1px)}}
      @keyframes ember{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-60px) scale(0);opacity:0}}
      .fire-flicker{animation:fireFlicker 1.2s ease-in-out infinite}
      .ember-particle{position:absolute;width:3px;height:3px;border-radius:50%;background:#ff6a00;animation:ember 2s ease-out infinite}
    </style>
    <div style="background:linear-gradient(180deg,#0d0200,#2a0800,#5a1500);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div class="fire-flicker" style="position:absolute;bottom:0;left:0;right:0;height:45%;background:linear-gradient(180deg,transparent,rgba(255,80,0,0.25),rgba(255,40,0,0.5));"></div>
      <div class="ember-particle" style="left:20%;animation-delay:0s;animation-duration:1.8s;background:#ff4500;"></div>
      <div class="ember-particle" style="left:50%;animation-delay:0.6s;animation-duration:2.2s;background:#ff6a00;"></div>
      <div class="ember-particle" style="left:75%;animation-delay:1.1s;animation-duration:1.6s;background:#ffa500;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:66px;height:66px;border-radius:50%;margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.9rem;border:2.5px solid rgba(255,100,0,0.6);background:rgba(255,60,0,0.15);overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
        </div>
        <div style="font-size:1.15rem;font-weight:800;color:#ff8c42;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(255,140,66,0.6);margin-bottom:0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(255,140,66,0.4);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,140,66,0.75);line-height:1.55;margin-top:0.5rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#0d0200;padding:0 1.1rem 1.4rem;">
      ${data.skills.length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(255,140,66,0.35);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Skills</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
            ${data.skills.map(s=>`<span style="background:rgba(255,100,0,0.12);border:1px solid rgba(255,100,0,0.3);border-radius:999px;padding:0.2rem 0.55rem;font-size:0.68rem;color:#ff8c42;">${s}</span>`).join('')}
          </div>
        </div>`:''}
      ${data.links.filter(l=>l.title).length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(255,140,66,0.35);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Links</div>
          ${data.links.filter(l=>l.title).map(l=>`
            <div style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem;border-radius:9px;background:rgba(255,80,0,0.08);border:1px solid rgba(255,80,0,0.18);font-size:0.8rem;color:#ff8c42;margin-bottom:0.38rem;">
              ${l.icon||'🔗'} ${l.title}
            </div>`).join('')}
        </div>`:''}
    </div>
    <div style="text-align:center;padding:0.75rem;border-top:1px solid rgba(255,80,0,0.1);background:#0d0200;font-size:0.6rem;font-family:'Space Mono',monospace;color:rgba(255,140,66,0.2);">folio.app · built with ❤️</div>`;
}

// 4. MOTION
function renderMotion(data, bg, isDark) {
  return `
    <style>
      @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes floatDown{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
      @keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      .orb-float{animation:floatUp 3s ease-in-out infinite}
      .orb-float2{animation:floatDown 4s ease-in-out infinite}
    </style>
    <div style="background:linear-gradient(135deg,#0d1b2a,#1b2a4a);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div class="orb-float" style="position:absolute;top:10%;left:10%;width:50px;height:50px;border-radius:50%;background:radial-gradient(circle,rgba(124,109,250,0.4),transparent);pointer-events:none;"></div>
      <div class="orb-float2" style="position:absolute;bottom:15%;right:10%;width:35px;height:35px;border-radius:50%;background:radial-gradient(circle,rgba(250,109,143,0.35),transparent);pointer-events:none;"></div>
      <div class="orb-float" style="position:absolute;top:50%;left:5%;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle,rgba(109,250,204,0.3),transparent);pointer-events:none;animation-delay:1s;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:66px;height:66px;border-radius:50%;margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.9rem;border:2.5px solid rgba(124,109,250,0.5);background:rgba(124,109,250,0.1);overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
        </div>
        <div style="font-size:1.15rem;font-weight:800;color:#fff;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(124,109,250,0.8);margin-bottom:0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(255,255,255,0.4);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,255,255,0.7);line-height:1.55;margin-top:0.5rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#080e1a;padding:0 1.1rem 1.4rem;">
      ${bodyContent(data)}
    </div>
    <div style="text-align:center;padding:0.75rem;border-top:1px solid rgba(124,109,250,0.1);background:#080e1a;font-size:0.6rem;font-family:'Space Mono',monospace;color:rgba(124,109,250,0.25);">folio.app · built with ❤️</div>`;
}

// 5. BLOSSOM
function renderBlossom(data, bg, isDark) {
  return `
    <style>
      @keyframes petalFloat{0%,100%{transform:translateY(0) rotate(0deg);opacity:0.7}50%{transform:translateY(-12px) rotate(10deg);opacity:1}}
      .petal{position:absolute;font-size:0.9rem;animation:petalFloat 3s ease-in-out infinite;pointer-events:none;}
    </style>
    <div style="background:linear-gradient(135deg,#2d0a2e,#6b1a4a,#2a0a3e);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <span class="petal" style="top:8%;left:12%;animation-delay:0s;">🌸</span>
      <span class="petal" style="top:15%;right:10%;animation-delay:0.8s;">🌺</span>
      <span class="petal" style="bottom:20%;left:8%;animation-delay:1.5s;font-size:0.7rem;">🌸</span>
      <span class="petal" style="bottom:10%;right:15%;animation-delay:0.4s;font-size:0.75rem;">✨</span>
      <div style="position:relative;z-index:1;">
        <div style="width:66px;height:66px;border-radius:50%;margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.9rem;border:2.5px solid rgba(255,150,200,0.5);background:rgba(255,100,180,0.1);overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
        </div>
        <div style="font-size:1.15rem;font-weight:800;color:#ffb3d9;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(255,150,200,0.65);margin-bottom:0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(255,150,200,0.4);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,180,220,0.75);line-height:1.55;margin-top:0.5rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#1a0520;padding:0 1.1rem 1.4rem;">
      ${data.skills.length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(255,150,200,0.35);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Skills</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
            ${data.skills.map(s=>`<span style="background:rgba(255,100,180,0.1);border:1px solid rgba(255,100,180,0.25);border-radius:999px;padding:0.2rem 0.55rem;font-size:0.68rem;color:#ffb3d9;">${s}</span>`).join('')}
          </div>
        </div>`:''}
      ${data.links.filter(l=>l.title).length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(255,150,200,0.35);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Links</div>
          ${data.links.filter(l=>l.title).map(l=>`
            <div style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem;border-radius:9px;background:rgba(255,100,180,0.07);border:1px solid rgba(255,100,180,0.15);font-size:0.8rem;color:#ffb3d9;margin-bottom:0.38rem;">
              ${l.icon||'🔗'} ${l.title}
            </div>`).join('')}
        </div>`:''}
    </div>
    <div style="text-align:center;padding:0.75rem;border-top:1px solid rgba(255,100,180,0.1);background:#1a0520;font-size:0.6rem;font-family:'Space Mono',monospace;color:rgba(255,150,200,0.2);">folio.app · built with ❤️</div>`;
}

// 6. NEON
function renderNeon(data, bg, isDark) {
  return `
    <style>
      @keyframes neonPulse{0%,100%{text-shadow:0 0 8px #00fff5,0 0 20px #00fff5,0 0 40px #00fff5}50%{text-shadow:0 0 4px #00fff5,0 0 10px #00fff5}}
      @keyframes borderPulse{0%,100%{box-shadow:0 0 8px rgba(0,255,245,0.4)}50%{box-shadow:0 0 20px rgba(0,255,245,0.8)}}
      .neon-text{animation:neonPulse 2s ease-in-out infinite}
      .neon-border{animation:borderPulse 2s ease-in-out infinite}
    </style>
    <div style="background:linear-gradient(135deg,#000a14,#001a2e,#000d1a);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,245,0.02) 2px,rgba(0,255,245,0.02) 4px);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div class="neon-border" style="width:66px;height:66px;border-radius:50%;margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.9rem;border:2px solid rgba(0,255,245,0.6);background:rgba(0,255,245,0.05);overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
        </div>
        <div class="neon-text" style="font-size:1.15rem;font-weight:800;color:#00fff5;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(0,255,245,0.55);margin-bottom:0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(0,255,245,0.35);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(0,255,245,0.65);line-height:1.55;margin-top:0.5rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#000810;padding:0 1.1rem 1.4rem;">
      ${data.skills.length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(0,255,245,0.3);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Skills</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
            ${data.skills.map(s=>`<span style="background:rgba(0,255,245,0.07);border:1px solid rgba(0,255,245,0.25);border-radius:999px;padding:0.2rem 0.55rem;font-size:0.68rem;color:#00fff5;">${s}</span>`).join('')}
          </div>
        </div>`:''}
      ${data.links.filter(l=>l.title).length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(0,255,245,0.3);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Links</div>
          ${data.links.filter(l=>l.title).map(l=>`
            <div style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem;border-radius:9px;background:rgba(0,255,245,0.05);border:1px solid rgba(0,255,245,0.15);font-size:0.8rem;color:#00fff5;margin-bottom:0.38rem;">
              ${l.icon||'🔗'} ${l.title}
            </div>`).join('')}
        </div>`:''}
    </div>
    <div style="text-align:center;padding:0.75rem;border-top:1px solid rgba(0,255,245,0.08);background:#000810;font-size:0.6rem;font-family:'Space Mono',monospace;color:rgba(0,255,245,0.2);">folio.app · built with ❤️</div>`;
}

// 7. GLASS
function renderGlass(data, bg, isDark) {
  return `
    <div style="background:linear-gradient(135deg,#1a2a4a,#2a3a6a,#1a2a5a);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-30%;left:-20%;width:180%;height:180%;background:radial-gradient(ellipse at 30% 40%,rgba(255,255,255,0.06),transparent 60%);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:66px;height:66px;border-radius:50%;margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.9rem;border:1.5px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
        </div>
        <div style="font-size:1.15rem;font-weight:800;color:#fff;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(255,255,255,0.55);margin-bottom:0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(255,255,255,0.38);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,255,255,0.68);line-height:1.55;margin-top:0.5rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:rgba(20,30,60,0.95);padding:0 1.1rem 1.4rem;backdrop-filter:blur(20px);">
      ${data.skills.length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(255,255,255,0.28);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Skills</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
            ${data.skills.map(s=>`<span style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:999px;padding:0.2rem 0.55rem;font-size:0.68rem;color:rgba(255,255,255,0.8);">${s}</span>`).join('')}
          </div>
        </div>`:''}
      ${data.links.filter(l=>l.title).length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(255,255,255,0.28);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Links</div>
          ${data.links.filter(l=>l.title).map(l=>`
            <div style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem;border-radius:9px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);font-size:0.8rem;color:rgba(255,255,255,0.85);margin-bottom:0.38rem;">
              ${l.icon||'🔗'} ${l.title}
            </div>`).join('')}
        </div>`:''}
    </div>
    <div style="text-align:center;padding:0.75rem;border-top:1px solid rgba(255,255,255,0.07);background:rgba(20,30,60,0.95);font-size:0.6rem;font-family:'Space Mono',monospace;color:rgba(255,255,255,0.2);">folio.app · built with ❤️</div>`;
}

// 8. SUNSET
function renderSunset(data, bg, isDark) {
  return `
    <style>
      @keyframes sunsetGlow{0%,100%{opacity:0.6}50%{opacity:1}}
      .sunset-glow{animation:sunsetGlow 3s ease-in-out infinite}
    </style>
    <div style="background:linear-gradient(180deg,#0a0010,#2a0a1a,#5a1a0a,#3a0a00);padding:1.8rem 1.4rem 1.4rem;text-align:center;position:relative;overflow:hidden;">
      <div class="sunset-glow" style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:120px;height:60px;background:radial-gradient(ellipse,rgba(255,120,0,0.4),transparent);pointer-events:none;"></div>
      <div style="position:relative;z-index:1;">
        <div style="width:66px;height:66px;border-radius:50%;margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;font-size:1.9rem;border:2.5px solid rgba(255,140,60,0.5);background:rgba(255,100,0,0.1);overflow:hidden;">
          ${data.photoURL?`<img src="${data.photoURL}" style="width:100%;height:100%;object-fit:cover;">`:`${data.emoji}`}
        </div>
        <div style="font-size:1.15rem;font-weight:800;background:linear-gradient(135deg,#ff8c42,#ff4da6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${data.name||'Your Name'}</div>
        <div style="font-size:0.74rem;color:rgba(255,140,80,0.65);margin-bottom:0.4rem;">${data.role||'Your Title'}</div>
        ${data.location?`<div style="font-size:0.7rem;color:rgba(255,140,80,0.4);">📍 ${data.location}</div>`:''}
        ${data.bio?`<div style="font-size:0.78rem;color:rgba(255,160,100,0.72);line-height:1.55;margin-top:0.5rem;">${data.bio}</div>`:''}
      </div>
    </div>
    <div style="background:#0d0008;padding:0 1.1rem 1.4rem;">
      ${data.skills.length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(255,140,80,0.3);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Skills</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.3rem;">
            ${data.skills.map(s=>`<span style="background:rgba(255,100,0,0.1);border:1px solid rgba(255,100,0,0.25);border-radius:999px;padding:0.2rem 0.55rem;font-size:0.68rem;color:#ff8c42;">${s}</span>`).join('')}
          </div>
        </div>`:''}
      ${data.links.filter(l=>l.title).length?`
        <div style="padding-top:0.9rem;">
          <div style="font-size:0.6rem;font-weight:700;color:rgba(255,140,80,0.3);letter-spacing:1.8px;text-transform:uppercase;margin-bottom:0.35rem;">Links</div>
          ${data.links.filter(l=>l.title).map(l=>`
            <div style="display:flex;align-items:center;gap:0.5rem;padding:0.6rem;border-radius:9px;background:rgba(255,100,0,0.07);border:1px solid rgba(255,100,0,0.15);font-size:0.8rem;color:#ff8c42;margin-bottom:0.38rem;">
              ${l.icon||'🔗'} ${l.title}
            </div>`).join('')}
        </div>`:''}
    </div>
    <div style="text-align:center;padding:0.75rem;border-top:1px solid rgba(255,100,0,0.1);background:#0d0008;font-size:0.6rem;font-family:'Space Mono',monospace;color:rgba(255,140,80,0.2);">folio.app · built with ❤️</div>`;
}

// ===== UPGRADE MODAL =====
function showUpgradeModal() {
  document.getElementById('upgrade-modal').classList.add('open');
}
function closeUpgradeModal() {
  document.getElementById('upgrade-modal').classList.remove('open');
}
function handleModalClick(e) {
  if (e.target === e.currentTarget) closeUpgradeModal();
}
window.showUpgradeModal = showUpgradeModal;
window.closeUpgradeModal = closeUpgradeModal;
window.handleModalClick = handleModalClick;

// ===== VIEW =====
function viewPortfolio() {
  window.open(`./portfolio.html?u=${currentUsername}`, '_blank');
}
window.viewPortfolio = viewPortfolio;

// ===== LOGOUT =====
async function logout() {
  await signOut(auth);
  window.location.href = './login.html';
}
window.logout = logout;

// ===== MOBILE TABS =====
function showMobileTab(tab) {
  const sidebar = document.getElementById('dash-sidebar');
  const preview = document.getElementById('dash-preview');
  const editBtn = document.getElementById('mob-edit-btn');
  const prevBtn = document.getElementById('mob-preview-btn');

  if (tab === 'edit') {
    sidebar.style.display = '';
    preview.style.display = 'none';
    editBtn.classList.add('active');
    prevBtn.classList.remove('active');
  } else {
    sidebar.style.display = 'none';
    preview.style.display = 'block';
    prevBtn.classList.add('active');
    editBtn.classList.remove('active');
    renderPreview();
  }
}
window.showMobileTab = showMobileTab;

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ===== UNSAVED WARNING =====
window.addEventListener('beforeunload', (e) => {
  if (state.dirty) { e.preventDefault(); e.returnValue = ''; }
});
