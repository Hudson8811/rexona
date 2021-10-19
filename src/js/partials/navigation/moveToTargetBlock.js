function moveToTargetBlock(selector) {
  document.querySelector(selector).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
