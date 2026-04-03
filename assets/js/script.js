// Menu Toggle
const menuBtn = document.querySelectorAll('.btn-icon')[1];
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Theme Toggle
const themeBtn = document.getElementById('themeBtn');

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');

  if (document.body.classList.contains('light')) {
    themeBtn.textContent = '🌙';
  } else {
    themeBtn.textContent = '☀️';
  }
});

