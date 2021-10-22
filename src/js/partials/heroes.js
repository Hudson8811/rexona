function heroes() {
  const heroes = document.querySelectorAll('.heroes-item');

  document.addEventListener('click', e => {
    if (e.target.closest('.heroes-item')) {
      setActiveHero(heroes);
    }
  });
}

function setActiveHero(heroes) {
  heroes.forEach(item => {
    if (item.querySelector('input').checked) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}
