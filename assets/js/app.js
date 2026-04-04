// ===== FIREBASE SETUP =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyACMH3hBQqS9Jhw-d3xkLlY_RiKr0DOXsI",
  authDomain: "dev-muhamad.firebaseapp.com",
  projectId: "dev-muhamad",
  storageBucket: "dev-muhamad.firebasestorage.app",
  messagingSenderId: "224833840139",
  appId: "1:224833840139:web:365f0ecd685d1c54ea530e"
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

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

const SAMPLES = [
  {name:'Hama Karwan', role:'Web Developer',   emoji:'🧑‍💻', theme:0,
   links:[{i:'🌐',t:'My Website'},{i:'💼',t:'GitHub'},{i:'📸',t:'Instagram'}]},
  {name:'Sara Design',  role:'UI/UX Designer',  emoji:'👩‍🎨', theme:5,
   links:[{i:'🎨',t:'Behance Portfolio'},{i:'🐦',t:'Twitter'},{i:'📧',t:'Contact Me'}]},
  {name:'Ali Photo',    role:'Photographer',    emoji:'📷',   theme:6,
   links:[{i:'📷',t:'Instagram'},{i:'🖼️',t:'Gallery'},{i:'📞',t:'Book a Session'}]},
  {name:'Nar Music',    role:'Music Producer',  emoji:'🎸',   theme:4,
   links:[{i:'🎵',t:'Spotify'},{i:'▶️',t:'YouTube'},{i:'🎸',t:'SoundCloud'}]},
  {name:'Lara Codes',   role:'Full-Stack Dev',  emoji:'🚀',   theme:7,
   links:[{i:'💼',t:'GitHub'},{i:'🌐',t:'Portfolio'},{i:'💬',t:'LinkedIn'}]},
];

const ICONS = ['🌐','💼','📸','🎨','🐦','📧','📷','🎵','▶️','🔗','📱','💬','🖥️','📝','🎸','📞','🛒','📌'];

let state = {
  emoji: '🧑‍💻',
  themeIdx: 0,
  links: [
    {icon:'🌐', title:'', url:''},
    {icon:'💼', title:'', url:''},
  ]
};
let isDark = true;

// ===== THEME =====
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const icon = isDark ? '🌙' : '☀️';
  ['theme-btn','theme-btn-2'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.textContent = icon;
  });
  updatePfBg();
}

// ===== INIT =====
function init() {
  renderSamples();
  renderEmojis();
  renderColors();
  renderLinks();
  updatePreview();
}

// ===== SAMPLES =====
function renderSamples() {
  document.getElementById('profiles-container').innerHTML = SAMPLES.map((p,i) => `
    <div class="profile-card" onclick="loadSample(${i})">
      <div class="profile-avi" style="background:${THEMES[p.theme].bg}">${p.emoji}</div>
      <h3>${p.name}</h3>
      <div class="profile-role">${p.role}</div>
      <div class="profile-link-list">
        ${p.links.map(l => `<div class="profile-link-item"><span>${l.i}</span>${l.t}</div>`).join('')}
      </div>
    </div>`).join('');
}

// ===== EMOJIS =====
function renderEmojis() {
  document.getElementById('emoji-grid').innerHTML = EMOJIS.map(e => `
    <button class="emoji-btn ${e === state.emoji ? 'active' : ''}" onclick="pickEmoji('${e}')">${e}</button>`
  ).join('');
}
function pickEmoji(e) { state.emoji = e; renderEmojis(); updatePreview(); }

// ===== COLORS =====
function renderColors() {
  document.getElementById('color-grid').innerHTML = THEMES.map((t,i) => `
    <div class="color-swatch ${i === state.themeIdx ? 'active' : ''}"
      style="background:${t.bg}" title="${t.name}"
      onclick="pickTheme(${i})"></div>`
  ).join('');
}
function pickTheme(i) { state.themeIdx = i; renderColors(); updatePreview(); }

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
  state.links[i].icon = ICONS[(cur + 1) % ICONS.length];
  renderLinks(); updatePreview();
}
function setLink(i, f, v) { state.links[i][f] = v; updatePreview(); }
function addLink()       { state.links.push({icon:'🔗',title:'',url:''}); renderLinks(); updatePreview(); }
function removeLink(i)   { state.links.splice(i,1); renderLinks(); updatePreview(); }

// ===== PREVIEW =====
function updatePreview() {
  const name = document.getElementById('pf-name')?.value || '';
  const role = document.getElementById('pf-role')?.value || '';
  const bio  = document.getElementById('pf-bio')?.value  || '';
  const slug = (name||'you').toLowerCase().replace(/\s+/g,'').replace(/[^a-z0-9]/g,'') || 'you';

  document.getElementById('pf-name-out').textContent = name || 'Your Name';
  document.getElementById('pf-role-out').textContent = role || 'Your Title';
  document.getElementById('pf-bio-out').textContent  = bio  || 'Your bio will appear here...';
  document.getElementById('pf-avi').textContent = state.emoji;
  document.getElementById('browser-url-text').textContent = `folio.app/${slug}`;
  document.getElementById('modal-url-text').textContent   = `folio.app/${slug}`;
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
  if (b) b.style.background  = isDark ? '#0a0a0f' : '#ffffff';
}

// ===== NAVIGATION =====
function showBuilder() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('builder').classList.add('active');

  // تاکو username تۆمار نەکرێت، editor و tabs بنێمخوێن
  const username = document.getElementById('username-input')?.value?.trim();
  if (!username) {
    document.getElementById('editor-panel').classList.add('tab-hidden');
    document.getElementById('preview-panel').classList.add('tab-hidden');
    document.getElementById('builder-tabs').style.display = 'none';
    document.getElementById('username-input').focus();
  }

  updatePreview();
}

function showLanding() {
  document.getElementById('builder').classList.remove('active');
  document.getElementById('landing').style.display = 'flex';
}
function loadSample(idx) {
  const p = SAMPLES[idx];
  showBuilder();
  setTimeout(() => {
    document.getElementById('pf-name').value = p.name;
    document.getElementById('pf-role').value = p.role;
    document.getElementById('pf-bio').value  = '';
    state.emoji    = p.emoji;
    state.themeIdx = p.theme;
    state.links    = p.links.map(l => ({icon:l.i, title:l.t, url:''}));
    renderEmojis(); renderColors(); renderLinks(); updatePreview();
  }, 80);
}

// ===== MOBILE TABS =====
function switchTab(tab) {
  const ep   = document.getElementById('editor-panel');
  const pp   = document.getElementById('preview-panel');
  const tabs = document.querySelectorAll('.tab-btn');
  if (tab === 'editor') {
    ep.classList.remove('tab-hidden'); pp.classList.add('tab-hidden');
    tabs[0].classList.add('active');   tabs[1].classList.remove('active');
  } else {
    pp.classList.remove('tab-hidden'); ep.classList.add('tab-hidden');
    tabs[1].classList.add('active');   tabs[0].classList.remove('active');
    updatePreview();
  }
}

// ===== MODAL =====
function openShareModal()  { document.getElementById('share-modal').classList.add('open'); }
function closeShareModal() { document.getElementById('share-modal').classList.remove('open'); }
function handleModalClick(e) { if (e.target === e.currentTarget) closeShareModal(); }
function copyUrl() {
  navigator.clipboard.writeText(document.getElementById('modal-url-text').textContent).catch(() => {});
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ===== USERNAME + FIREBASE =====
function isValidUsername(username) {
  return /^[a-z0-9_]{3,20}$/.test(username);
}

async function isUsernameTaken(username) {
  const ref = doc(db, "portfolios", username);
  const snap = await getDoc(ref);
  return snap.exists();
}

async function savePortfolio(username, data) {
  const ref = doc(db, "portfolios", username);
  await setDoc(ref, { ...data, username, createdAt: serverTimestamp() });
}

async function handlePublish() {
  const username = document.getElementById("username-input")?.value?.trim().toLowerCase();

  if (!username) { showModalError("Please enter a username."); return; }
  if (!isValidUsername(username)) {
    showModalError("3-20 chars: letters, numbers, underscore only.");
    return;
  }

  const publishBtn = document.querySelector(".publish-btn");
  publishBtn.textContent = "⏳ Checking...";
  publishBtn.disabled = true;

  try {
    const taken = await isUsernameTaken(username);
    if (taken) {
      showModalError(`@${username} is already taken. Try another.`);
      publishBtn.textContent = "🚀 Publish";
      publishBtn.disabled = false;
      return;
    }

    const name = document.getElementById("pf-name")?.value || "";
    const role = document.getElementById("pf-role")?.value || "";
    const bio  = document.getElementById("pf-bio")?.value  || "";

    await savePortfolio(username, {
      name, role, bio,
      emoji: state.emoji,
      themeIdx: state.themeIdx,
      links: state.links
    });

    document.getElementById("modal-url-text").textContent = `folio.app/${username}`;
    openShareModal();

  } catch (err) {
    showModalError("Something went wrong. Please try again.");
    console.error(err);
  }

  publishBtn.textContent = "🚀 Publish";
  publishBtn.disabled = false;
}

function showModalError(msg) {
  const el = document.getElementById("username-error");
  if (el) { el.textContent = msg; el.style.display = "block"; }
}

// ===== MAKE GLOBAL =====
window.toggleTheme = toggleTheme;
window.showBuilder = showBuilder;
window.showLanding = showLanding;
window.switchTab = switchTab;
window.addLink = addLink;
window.removeLink = removeLink;
window.cycleIcon = cycleIcon;
window.pickEmoji = pickEmoji;
window.pickTheme = pickTheme;
window.handlePublish = handlePublish;
window.openShareModal = openShareModal;
window.closeShareModal = closeShareModal;
window.handleModalClick = handleModalClick;
window.copyUrl = copyUrl;
window.loadSample = loadSample;
window.updatePreview = updatePreview;
window.setLink = setLink;

// ===== START =====
init();
