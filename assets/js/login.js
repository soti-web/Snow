import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, collection, query, where, getDocs
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

// Show error
function showError(msg) {
  const el = document.getElementById('login-error');
  el.textContent = msg;
  el.classList.add('show');
}

// Email login
async function loginWithEmail() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) { showError('Please fill in all fields.'); return; }

  const btn = document.querySelector('.btn-primary');
  btn.textContent = '⏳ Logging in...';
  btn.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = './dashboard.html';
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
      showError('Wrong email or password. Try again.');
    } else if (err.code === 'auth/too-many-requests') {
      showError('Too many attempts. Please try again later.');
    } else {
      showError(err.message);
    }
    btn.textContent = 'Login →';
    btn.disabled = false;
  }
}
window.loginWithEmail = loginWithEmail;

// Google login
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithRedirect(auth, provider);
  } catch (err) {
    showError(err.message);
  }
}
window.signInWithGoogle = signInWithGoogle;

// Handle redirect result
getRedirectResult(auth).then(async (cred) => {
  if (cred) {
    const uid = cred.user.uid;
    const q = query(collection(db, "portfolios"), where("uid", "==", uid));
    const snap = await getDocs(q);
    if (snap.empty) {
      window.location.href = './claim.html';
    } else {
      window.location.href = './dashboard.html';
    }
  }
}).catch(err => console.error(err));
