function fillPhoto(photo, name, position, elem) {
  // Temp: all imgs have 'build/...'
  elem.src = `./build/images/${photo}`;
  elem.alt = `${name} — ${position}`;
}
