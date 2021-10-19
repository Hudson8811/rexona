function fillAnswerBlock(hero, answer) {
  const block = document.getElementById('answer'),
    photo = block.querySelector('img'),
    name = block.querySelector('.answer-story__person-name'),
    position = block.querySelector('.answer-story__person-position'),
    story = block.querySelector('.answer-story__item'),
    storyTitle = story.querySelector('.answer-story__item-title'),
    advise = block.querySelector('.answer-advise'),
    togglerText = block.querySelector('.switch__toggler-text--hero');

  fillPhoto(hero.photo, hero.name, hero.position, photo);
  fillText(hero.name, name);
  fillText(hero.position, position);

  if (answer === 'correct') {
    storyTitle.textContent = 'Так и было!';

    fillText(hero.storyEnding.correct, story, true);
  } else {
    storyTitle.textContent = 'Было не так';

    fillText(hero.storyEnding.wrong, story, true);
  }

  fillText(hero.declension, togglerText);

  fillText(hero.advise.hero, advise, true);
}
