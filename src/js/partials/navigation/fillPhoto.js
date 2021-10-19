function fillPhoto(photo, name, position, elem) {
  elem.src = `/images/${photo}`;
  elem.alt = `${name} — ${position}`;
}
