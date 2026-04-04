import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
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

// Get claimed username from sessionStorage
const username = sessionStorage.getItem('claimed_username');
if (!username) {
  window.location.href = './claim.html';
}
document.getElementById('username-display').textContent = `folio.app/${username}`;

// Show error
function showError(msg) {
  const el = document.getElementById('reg-error');
  el.textContent = msg;
  el.classList.add('show');
}

// Save user to Firestore after register
async function saveUser(uid, email) {
  // Check username still available
  const snap = await getDoc(doc(db, "portfolios", username));
  if (snap.exists()) {
    showError('Sorry, this username was just taken. Please choose another.');
    setTimeout(() => window.location.href = './claim.html', 2000);
    return false;
  }

  // Save portfolio doc
  await setDoc(doc(db, "portfolios", username), {
    username,
    uid,
    email,
    name: '',
    role: '',
    bio: '',
    emoji: '🧑‍💻',
    themeIdx: 0,
    links: [],
    createdAt: serverTimestamp()
  });

  // Save user doc
  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    username,
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
  try {
    const cred = await signInWithPopup(auth, provider);
    const ok = await saveUser(cred.user.uid, cred.user.email);
    if (ok) {
      sessionStorage.removeItem('claimed_username');
      window.location.href = './dashboard.html';
    }
  } catch (err) {
    showError(err.message);
  }
}
window.signInWithGoogle = signInWithGoogle;
