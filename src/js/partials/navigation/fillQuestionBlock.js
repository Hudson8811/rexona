function fillQuestionBlock(hero) {
  const block = document.getElementById('question'),
    photo = block.querySelector('img'),
    name = block.querySelector('.question-story__person-name'),
    position = block.querySelector('.question-story__person-position'),
    story = block.querySelector('.question-story__item'),
    buttons = block.querySelectorAll('.question-answers__buttons-item');

  fillPhoto(hero.photo, hero.name, hero.position, photo);

  fillText(hero.name, name);
  fillText(hero.position, position);
  fillText(hero.story, story, true);

  buttons.forEach((item, index) => {
    item.querySelector('.question-answers__buttons-text').textContent = hero.answers[index];
  });
}
