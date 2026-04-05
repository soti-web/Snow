import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore, doc, setDoc, getDoc, serverTimestamp
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

// Theme
let isDark = true;
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('theme-btn').textContent = isDark ? '🌙' : '☀️';
}
window.toggleTheme = toggleTheme;

// Get claimed username
const username = sessionStorage.getItem('claimed_username') || localStorage.getItem('claimed_username');
if (!username) window.location.href = './claim.html';
document.getElementById('username-display').textContent = `folio.app/${username}`;

// Show error
function showError(msg) {
  const el = document.getElementById('reg-error');
  el.textContent = msg;
  el.classList.add('show');
}

// Save user to Firestore
async function saveUser(uid, email) {
  const snap = await getDoc(doc(db, "portfolios", username));
  if (snap.exists() && snap.data().uid !== uid) {
    showError('Sorry, this username was just taken. Please choose another.');
    setTimeout(() => window.location.href = './claim.html', 2000);
    return false;
  }
  await setDoc(doc(db, "portfolios", username), {
    username, uid, email,
    name: '', role: '', bio: '',
    emoji: '🧑‍💻', themeIdx: 0, links: [],
    createdAt: serverTimestamp()
  });
  await setDoc(doc(db, "users", uid), {
    uid, email, username,
    createdAt: serverTimestamp()
  });
  return true;
}

// Email register
async function registerWithEmail() {
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  if (!email || !password) { showError('Please fill in all fields.'); return; }
  if (password.length < 6) { showError('Password must be at least 6 characters.'); return; }

  const btn = document.querySelector('.btn-primary');
  btn.textContent = '⏳ Creating...';
  btn.disabled = true;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const ok = await saveUser(cred.user.uid, email);
    if (ok) {
      sessionStorage.removeItem('claimed_username');
      window.location.href = './dashboard.html';
    }
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      showError('This email is already registered. Try logging in.');
    } else {
      showError(err.message);
    }
    btn.textContent = 'Register →';
    btn.disabled = false;
  }
}
window.registerWithEmail = registerWithEmail;

// Google register
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    localStorage.setItem('google_pending', 'true');
    await signInWithRedirect(auth, provider);
  } catch (err) {
    showError(err.message);
  }
}

window.signInWithGoogle = signInWithGoogle;

// Handle redirect result (after Google redirect comes back)
getRedirectResult(auth).then(async (cred) => {
  if (cred && sessionStorage.getItem('google_register')) {
    sessionStorage.removeItem('google_register');
    const ok = await saveUser(cred.user.uid, cred.user.email);
    if (ok) {
      sessionStorage.removeItem('claimed_username');
      localStorage.removeItem('claimed_username');
      window.location.href = './dashboard.html';
    }
  }
}).catch(err => console.error(err));
