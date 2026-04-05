import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Theme
let isDark = true;
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('theme-btn').textContent = isDark ? '🌙' : '☀️';
}
window.toggleTheme = toggleTheme;

// Check username availability
let checkTimer = null;
async function checkUsername() {
  const val = document.getElementById('claim-input').value.trim();
  const status = document.getElementById('claim-status');
  const btn = document.getElementById('claim-btn');

  btn.disabled = true;
  status.className = 'claim-status';
  status.textContent = '';

  if (val.length < 3) {
    if (val.length > 0) {
      status.className = 'claim-status taken';
      status.textContent = 'At least 3 characters required.';
    }
    return;
  }

  status.className = 'claim-status checking';
  status.textContent = 'Checking...';

  clearTimeout(checkTimer);
  checkTimer = setTimeout(async () => {
    try {
      const snap = await getDoc(doc(db, "portfolios", val));
      if (snap.exists()) {
        status.className = 'claim-status taken';
        status.textContent = `✗ @${val} is already taken.`;
        btn.disabled = true;
      } else {
        status.className = 'claim-status available';
        status.textContent = `✓ @${val} is available!`;
        btn.disabled = false;
      }
    } catch (e) {
      status.className = 'claim-status taken';
      status.textContent = 'Error checking. Try again.';
    }
  }, 300);
}
window.checkUsername = checkUsername;

// Save username to sessionStorage and go to register
function claimUsername() {
  const val = document.getElementById('claim-input').value.trim();
  if (!val || val.length < 3) return;
  sessionStorage.setItem('claimed_username', val);
  window.location.href = './register.html';
}
window.claimUsername = claimUsername;

