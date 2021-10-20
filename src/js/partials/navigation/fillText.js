/* eslint-disable max-len */

const maxTextLength = 170;

function fillText(text, elem, story = false, readable = false) {
  if (!story) {
    elem.textContent = text;
  } else {
    if (text.length > maxTextLength) {
      const begining = text.substring(0, maxTextLength),
        ending = text.substring(maxTextLength);

      elem.querySelector('p').innerHTML = `<span class="story-item__text">${begining}</span><span class="story-item__dots">...</span><span class="story-item__hidden">${ending}</span>`;

      if (!readable) {
        elem.querySelector('.js-more').style.display = 'block';
      }
    } else {
      elem.querySelector('p').textContent = text;
    }
  }
}
