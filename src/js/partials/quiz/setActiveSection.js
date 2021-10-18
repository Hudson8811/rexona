function setActiveSection(sections, current) {
  sections.forEach((item, index) => {
    if (index !== current) {
      item.classList.remove('active');
    } else {
      item.classList.add('active');
    }
  });
}
