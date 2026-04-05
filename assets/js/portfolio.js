import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyACMH3hBQqS9Jhw-d3xkLlY_RiKr0DOXsI",
  authDomain: "soti-web.github.io",
  projectId: "dev-muhamad",
  storageBucket: "dev-muhamad.firebasestorage.app",
  messagingSenderId: "224833840139",
  appId: "1:224833840139:web:365f0ecd685d1c54ea530e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const THEMES = [
  {bg:'linear-gradient(135deg,#1a0a2e,#0d1b3e)'},
  {bg:'linear-gradient(135deg,#0f2027,#203a43,#2c5364)'},
  {bg:'linear-gradient(135deg,#1a1a2e,#16213e)'},
  {bg:'linear-gradient(135deg,#111,#222)'},
  {bg:'linear-gradient(135deg,#0f3460,#533483)'},
  {bg:'linear-gradient(135deg,#1b4332,#081c15)'},
  {bg:'linear-gradient(135deg,#3d0000,#1a0000)'},
  {bg:'linear-gradient(135deg,#2d1b69,#11998e)'},
  {bg:'linear-gradient(135deg,#4a1942,#c94b4b)'},
  {bg:'linear-gradient(135deg,#1a0533,#6b0f6b)'},
  {bg:'linear-gradient(135deg,#0a3d62,#1e3799)'},
  {bg:'linear-gradient(135deg,#44347a,#fc5c7d)'},
];

async function loadPortfolio() {
  // Get username from URL ?u=username
  const params = new URLSearchParams(window.location.search);
  const username = params.get('u');

  if (!username) {
    showNotFound();
    return;
  }

  try {
    const snap = await getDoc(doc(db, "portfolios", username));

    if (!snap.exists()) {
      showNotFound();
      return;
    }

    const data = snap.data();

    // Set page title
    document.title = `${data.name || username} — folio.`;

    // Fill data
    document.getElementById('pf-full-avi').textContent  = data.emoji || '🧑‍💻';
    document.getElementById('pf-full-name').textContent = data.name  || username;
    document.getElementById('pf-full-role').textContent = data.role  || '';
    document.getElementById('pf-full-bio').textContent  = data.bio   || '';

    // Theme
    const bg = THEMES[data.themeIdx || 0].bg;
    document.getElementById('pf-full-header').style.background = bg;

    // Links
    const linksEl = document.getElementById('pf-full-links');
    const links = data.links || [];
    if (links.length) {
      linksEl.innerHTML = links
        .filter(l => l.title)
        .map(l => `
          <a class="pf-full-link" href="${l.url || '#'}" target="_blank" rel="noopener">
            <span class="pf-full-link-icon">${l.icon}</span>
            ${l.title}
          </a>`
        ).join('');
    } else {
      linksEl.innerHTML = '';
    }

    // Show page
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('portfolio-page').style.display = 'flex';

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
