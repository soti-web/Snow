import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs
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

// ===== DATA =====
const EMOJIS = ['🧑‍💻','👨‍🎨','👩‍🎨','🚀','⚡','✨','🎯','💡','🌙','🔥','💎','🌟','🎨','📱','🖥️','🛸','🦄','🐉','🌊','🏔️','🎸','📷','✍️','🧩'];

const BACKGROUNDS = [
  { name:'Nebula',   bg:'linear-gradient(135deg,#1a0a2e,#0d1b3e)' },
  { name:'Ocean',    bg:'linear-gradient(135deg,#0f2027,#203a43,#2c5364)' },
  { name:'Midnight', bg:'linear-gradient(135deg,#1a1a2e,#16213e)' },
  { name:'Carbon',   bg:'linear-gradient(135deg,#111,#222)' },
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

let state = {
  emoji: '🧑‍💻',
  photoURL: '',
  bgIdx: 0,
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

    state.emoji    = data.emoji    || '🧑‍💻';
    state.photoURL = data.photoURL || '';
    state.bgIdx    = data.bgIdx    || 0;
    state.skills   = data.skills   || [];
    state.work     = data.work     || [];
    state.links    = data.links    || [];

    // Avatar
    if (state.photoURL) {
      showPhoto(state.photoURL);
    } else {
      document.getElementById('avatar-emoji-display').textContent = state.emoji;
    }

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
  btn.textContent = '⏳';
  btn.disabled = true;

  try {
    await updateDoc(doc(db, "portfolios", currentUsername), {
      name:     document.getElementById('pf-name').value     || '',
      role:     document.getElementById('pf-role').value     || '',
      bio:      document.getElementById('pf-bio').value      || '',
      location: document.getElementById('pf-location').value || '',
      emoji:    state.emoji,
      photoURL: state.photoURL,
      bgIdx:    state.bgIdx,
      skills:   state.skills,
      work:     state.work,
      links:    state.links,
    });
    state.dirty = false;
    showToast('✓ Saved!');
  } catch (err) {
    showToast('✗ Error saving.');
    console.error(err);
  }

  btn.textContent = '💾 Save';
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

// ===== DIRTY FLAG =====
function markDirty() { state.dirty = true; renderPreview(); }
window.markDirty = markDirty;

// ===== PHOTO UPLOAD =====
async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const btn = document.querySelectorAll('.avatar-action-btn')[0];
  btn.textContent = '⏳ Uploading...';

  try {
    const storageRef = ref(storage, `avatars/${currentUid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    state.photoURL = url;
    showPhoto(url);
    renderPreview();
    showToast('✓ Photo uploaded!');
  } catch (err) {
    showToast('✗ Upload failed.');
    console.error(err);
  }
  btn.textContent = '📷 Upload photo';
}
window.handlePhotoUpload = handlePhotoUpload;

function showPhoto(url) {
  const img = document.getElementById('avatar-img');
  const emoji = document.getElementById('avatar-emoji-display');
  img.src = url;
  img.style.display = 'block';
  emoji.style.display = 'none';
}

// ===== EMOJI PICKER =====
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
  const img = document.getElementById('avatar-img');
  const emojiEl = document.getElementById('avatar-emoji-display');
  img.style.display = 'none';
  emojiEl.style.display = 'block';
  emojiEl.textContent = e;
  renderEmojiGrid();
  renderPreview();
  document.getElementById('emoji-picker-wrap').style.display = 'none';
}
window.pickEmoji = pickEmoji;

// ===== BACKGROUND =====
function renderBgGrid() {
  document.getElementById('bg-grid').innerHTML = BACKGROUNDS.map((b,i) => `
    <div class="bg-swatch ${i===state.bgIdx?'active':''}"
      style="background:${b.bg}"
      onclick="pickBg(${i})">
      <div class="bg-swatch-label">${b.name}</div>
    </div>
  `).join('');
}
function pickBg(i) { state.bgIdx = i; renderBgGrid(); renderPreview(); }
window.pickBg = pickBg;

// ===== SKILLS =====
function renderSkills() {
  document.getElementById('skills-list').innerHTML = state.skills.map((s,i) => `
    <div class="skill-tag">
      ${s}
      <button onclick="removeSkill(${i})">×</button>
    </div>
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
function handleSkillKey(e) { if (e.key === 'Enter') addSkill(); }
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
      <input type="text" placeholder="Job Title" value="${w.title||''}"
        oninput="setWork(${i},'title',this.value)">
      <input type="text" placeholder="Company" value="${w.company||''}"
        oninput="setWork(${i},'company',this.value)">
      <input type="text" placeholder="Date (e.g. 2022 – Present)" value="${w.date||''}"
        oninput="setWork(${i},'date',this.value)">
    </div>
  `).join('');
  renderPreview();
}
function addWork() {
  state.work.push({ title:'', company:'', date:'' });
  renderWork();
}
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
      <input type="text" placeholder="Label" value="${l.title||''}"
        oninput="setLinkField(${i},'title',this.value)">
      <input type="text" class="url-in" placeholder="https://..." value="${l.url||''}"
        oninput="setLinkField(${i},'url',this.value)">
      <button class="del-item-btn" onclick="removeLink(${i})">×</button>
    </div>
  `).join('');
  renderPreview();
}
function addLink() {
  state.links.push({ icon:'🔗', title:'', url:'' });
  renderLinks();
}
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
  const name     = document.getElementById('pf-name')?.value     || '';
  const role     = document.getElementById('pf-role')?.value     || '';
  const bio      = document.getElementById('pf-bio')?.value      || '';
  const location = document.getElementById('pf-location')?.value || '';
  const bg       = BACKGROUNDS[state.bgIdx].bg;
  const bodyBg   = isDark ? '#0a0a0f' : '#ffffff';
  const bodyText = isDark ? 'rgba(255,255,255,0.85)' : '#111';

  // Avatar
  const avatarHTML = state.photoURL
    ? `<div class="pf-prev-avi"><img src="${state.photoURL}" alt=""></div>`
    : `<div class="pf-prev-avi">${state.emoji}</div>`;

  // Skills
  const skillsHTML = state.skills.length ? `
    <div>
      <div class="pf-prev-section-title">Skills</div>
      <div class="pf-prev-skills">
        ${state.skills.map(s=>`<span class="pf-prev-skill">${s}</span>`).join('')}
      </div>
    </div>` : '';

  // Work
  const workHTML = state.work.filter(w=>w.title).length ? `
    <div>
      <div class="pf-prev-section-title">Experience</div>
      ${state.work.filter(w=>w.title).map(w=>`
        <div class="pf-prev-work-item">
          <div class="pf-prev-work-title">${w.title}</div>
          ${w.company?`<div class="pf-prev-work-company">${w.company}</div>`:''}
          ${w.date?`<div class="pf-prev-work-date">${w.date}</div>`:''}
        </div>`).join('')}
    </div>` : '';

  // Links
  const linksHTML = state.links.filter(l=>l.title).length ? `
    <div>
      <div class="pf-prev-section-title">Links</div>
      ${state.links.filter(l=>l.title).map(l=>`
        <div class="pf-prev-link">${l.icon||'🔗'} ${l.title}</div>`).join('')}
    </div>` : '';

  document.getElementById('pf-preview-card').innerHTML = `
    <div class="pf-prev-header" style="background:${bg};">
      ${avatarHTML}
      <div class="pf-prev-name">${name||'Your Name'}</div>
      <div class="pf-prev-role">${role||'Your Title'}</div>
      ${location?`<div class="pf-prev-location">📍 ${location}</div>`:''}
      ${bio?`<div class="pf-prev-bio">${bio}</div>`:''}
    </div>
    <div class="pf-prev-body" style="background:${bodyBg}; color:${bodyText};">
      ${skillsHTML}
      ${workHTML}
      ${linksHTML}
      ${!skillsHTML&&!workHTML&&!linksHTML?'<div style="text-align:center;padding:1rem;font-size:0.78rem;color:rgba(150,150,180,0.5);">Add sections from the editor</div>':''}
    </div>
    <div class="pf-prev-footer" style="background:${bodyBg};">folio.app · built with ❤️</div>
  `;
}
window.renderPreview = renderPreview;

// ===== VIEW / LOGOUT =====
function viewPortfolio() {
  window.open(`./portfolio.html?u=${currentUsername}`, '_blank');
}
window.viewPortfolio = viewPortfolio;

async function logout() {
  await signOut(auth);
  window.location.href = './login.html';
}
window.logout = logout;

// ===== MOBILE TABS =====
function showMobileTab(tab) {
  const sidebar  = document.getElementById('dash-sidebar');
  const preview  = document.getElementById('dash-preview');
  const editBtn  = document.getElementById('mob-edit-btn');
  const prevBtn  = document.getElementById('mob-preview-btn');

  if (tab === 'edit') {
    sidebar.style.display  = '';
    preview.style.display  = 'none';
    editBtn.classList.add('active');
    prevBtn.classList.remove('active');
  } else {
    sidebar.style.display  = 'none';
    preview.style.display  = 'block';
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

// ===== WARN UNSAVED =====
window.addEventListener('beforeunload', (e) => {
  if (state.dirty) {
    e.preventDefault();
    e.returnValue = '';
  }
});
