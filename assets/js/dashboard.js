import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs
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
const auth = getAuth(app);
const db = getFirestore(app);

// ===== DATA =====
const EMOJIS = ['🧑‍💻','👨‍🎨','👩‍🎨','🚀','⚡','✨','🎯','💡','🌙','🔥','💎','🌟','🎨','📱','🖥️','🛸','🦄','🐉','🌊','🏔️','🎸','📷','✍️','🧩'];

const THEMES = [
  {bg:'linear-gradient(135deg,#1a0a2e,#0d1b3e)',name:'Nebula'},
  {bg:'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',name:'Ocean'},
  {bg:'linear-gradient(135deg,#1a1a2e,#16213e)',name:'Midnight'},
  {bg:'linear-gradient(135deg,#111,#222)',name:'Carbon'},
  {bg:'linear-gradient(135deg,#0f3460,#533483)',name:'Cosmos'},
  {bg:'linear-gradient(135deg,#1b4332,#081c15)',name:'Forest'},
  {bg:'linear-gradient(135deg,#3d0000,#1a0000)',name:'Ember'},
  {bg:'linear-gradient(135deg,#2d1b69,#11998e)',name:'Aurora'},
  {bg:'linear-gradient(135deg,#4a1942,#c94b4b)',name:'Rose'},
  {bg:'linear-gradient(135deg,#1a0533,#6b0f6b)',name:'Dusk'},
  {bg:'linear-gradient(135deg,#0a3d62,#1e3799)',name:'Cobalt'},
  {bg:'linear-gradient(135deg,#44347a,#fc5c7d)',name:'Candy'},
];

const ICONS = ['🌐','💼','📸','🎨','🐦','📧','📷','🎵','▶️','🔗','📱','💬','🖥️','📝','🎸','📞','🛒','📌'];

let state = { emoji:'🧑‍💻', themeIdx:0, links:[] };
let isDark = true;
let currentUsername = '';
let currentUid = '';

// ===== AUTH CHECK =====
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = './login.html';
    return;
  }
  currentUid = user.uid;
  await loadUserPortfolio(user.uid);
});

// ===== LOAD PORTFOLIO =====
async function loadUserPortfolio(uid) {
  try {
    const q = query(collection(db, "portfolios"), where("uid", "==", uid));
    const snap = await getDocs(q);

    if (snap.empty) {
      window.location.href = './claim.html';
      return;
    }

    const data = snap.docs[0].data();
    currentUsername = data.username;

    document.getElementById('nav-username').textContent = `@${currentUsername}`;
    document.getElementById('browser-url-text').textContent = `folio.app/${currentUsername}`;

    // Fill editor
    document.getElementById('pf-name').value = data.name || '';
    document.getElementById('pf-role').value = data.role || '';
    document.getElementById('pf-bio').value  = data.bio  || '';

    state.emoji    = data.emoji    || '🧑‍💻';
    state.themeIdx = data.themeIdx || 0;
    state.links    = data.links    || [];

    renderEmojis();
    renderColors();
    renderLinks();
    updatePreview();

  } catch (err) {
    console.error(err);
  }
}

// ===== SAVE =====
async function savePortfolio() {
  const btn = document.querySelector('.publish-btn');
  btn.textContent = '⏳ Saving...';
  btn.disabled = true;

  try {
    await updateDoc(doc(db, "portfolios", currentUsername), {
      name:     document.getElementById('pf-name').value || '',
      role:     document.getElementById('pf-role').value || '',
      bio:      document.getElementById('pf-bio').value  || '',
      emoji:    state.emoji,
      themeIdx: state.themeIdx,
      links:    state.links,
    });

    const t = document.getElementById('toast');
    t.textContent = '✓ Saved!';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);

  } catch (err) {
    const t = document.getElementById('toast');
    t.textContent = '✗ Error saving.';
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
  }

  btn.textContent = '💾 Save';
  btn.disabled = false;
}
window.savePortfolio = savePortfolio;

// ===== VIEW PORTFOLIO =====
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

// ===== THEME =====
let isDarkMode = true;
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  document.getElementById('theme-btn').textContent = isDarkMode ? '🌙' : '☀️';
  updatePfBg();
}
window.toggleTheme = toggleTheme;

// ===== EMOJIS =====
function renderEmojis() {
  document.getElementById('emoji-grid').innerHTML = EMOJIS.map(e => `
    <button class="emoji-btn ${e===state.emoji?'active':''}" onclick="pickEmoji('${e}')">${e}</button>`
  ).join('');
}
function pickEmoji(e) { state.emoji=e; renderEmojis(); updatePreview(); }
window.pickEmoji = pickEmoji;

// ===== COLORS =====
function renderColors() {
  document.getElementById('color-grid').innerHTML = THEMES.map((t,i) => `
    <div class="color-swatch ${i===state.themeIdx?'active':''}"
      style="background:${t.bg}" title="${t.name}"
      onclick="pickTheme(${i})"></div>`
  ).join('');
}
function pickTheme(i) { state.themeIdx=i; renderColors(); updatePreview(); }
window.pickTheme = pickTheme;

// ===== LINKS =====
function renderLinks() {
  document.getElementById('link-items').innerHTML = state.links.map((l,i) => `
    <div class="link-row">
      <button class="icon-btn" onclick="cycleIcon(${i})">${l.icon}</button>
      <input type="text" placeholder="Link name" value="${l.title}"
        oninput="setLink(${i},'title',this.value)">
      <input type="text" class="url-input" placeholder="https://..." value="${l.url}"
        oninput="setLink(${i},'url',this.value)">
      <button class="del-btn" onclick="removeLink(${i})">×</button>
    </div>`
  ).join('');
}
function cycleIcon(i) {
  const cur = ICONS.indexOf(state.links[i].icon);
  state.links[i].icon = ICONS[(cur+1)%ICONS.length];
  renderLinks(); updatePreview();
}
function setLink(i,f,v) { state.links[i][f]=v; updatePreview(); }
function addLink() { state.links.push({icon:'🔗',title:'',url:''}); renderLinks(); updatePreview(); }
function removeLink(i) { state.links.splice(i,1); renderLinks(); updatePreview(); }
window.cycleIcon   = cycleIcon;
window.setLink     = setLink;
window.addLink     = addLink;
window.removeLink  = removeLink;

// ===== PREVIEW =====
function updatePreview() {
  const name = document.getElementById('pf-name')?.value || '';
  const role = document.getElementById('pf-role')?.value || '';
  const bio  = document.getElementById('pf-bio')?.value  || '';

  document.getElementById('pf-name-out').textContent = name || 'Your Name';
  document.getElementById('pf-role-out').textContent = role || 'Your Title';
  document.getElementById('pf-bio-out').textContent  = bio  || 'Your bio will appear here...';
  document.getElementById('pf-avi').textContent = state.emoji;
  updatePfBg();

  const filled = state.links.filter(l => l.title);
  document.getElementById('pf-links-inner').innerHTML = filled.length
    ? filled.map(l => `<div class="pf-link-btn">${l.icon} ${l.title}</div>`).join('')
    : '<div class="pf-empty-msg">Add links from the editor</div>';
}
function updatePfBg() {
  const h = document.getElementById('pf-header-block');
  const b = document.getElementById('pf-links-out');
  if (h) h.style.background = THEMES[state.themeIdx].bg;
  if (b) b.style.background  = isDarkMode ? '#0a0a0f' : '#ffffff';
}
window.updatePreview = updatePreview;

// ===== TABS =====
function switchTab(tab) {
  const ep   = document.getElementById('editor-panel');
  const pp   = document.getElementById('preview-panel');
  const tabs = document.querySelectorAll('.tab-btn');
  if (tab==='editor') {
    ep.style.display=''; pp.style.display='none';
    tabs[0].classList.add('active'); tabs[1].classList.remove('active');
  } else {
    pp.style.display=''; ep.style.display='none';
    tabs[1].classList.add('active'); tabs[0].classList.remove('active');
    updatePreview();
  }
}
window.switchTab = switchTab;
