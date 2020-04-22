function showMenu() {
  document.getElementById('mobile-menu').classList.remove('mobile-menu-hidden');
  document.getElementById('mobile-menu').classList.add('mobile-menu-shown');
}

function hideMenu() {
  document.getElementById('mobile-menu').classList.remove('mobile-menu-shown');
  document.getElementById('mobile-menu').classList.add('mobile-menu-hidden');
}

window.addEventListener('load', function() {
  document.getElementById('menu-open').onclick = showMenu;
  document.getElementById('menu-close').onclick = hideMenu;
});
