/* eslint-disable max-len */

//= ./navigation/setACtiveBlock.js
//= ./navigation/moveToTargetBlock.js
//= ./navigation/chooseYourCharacter.js
//= ./navigation/fillText.js
//= ./navigation/fillPhoto.js
//= ./navigation/fillQuestionBlock.js
//= ./navigation/fillAnswerBlock.js

function navigation() {
  const SECTIONS = [

  ];

  let selectedHero = {};

  document.addEventListener('click', e => {
    if (e.target.classList.contains('js-nav')) {
      if (e.target.tagName.toLowerCase() === 'a') {
        e.preventDefault();
      }

      if (e.target.dataset.target) {
        document.querySelectorAll('.js-radio').forEach(item => {
          item.checked = false;
        });

        if (document.querySelector('.readable')) {
          document.querySelectorAll('.readable').forEach(item => {
            item.classList.remove('readable');

            item.querySelector('.js-more').style.display = 'block';
          });
        }

        document.getElementById('answer').classList.remove('active');

        selectedHero = chooseYourCharacter(e.target.dataset.target);

        fillQuestionBlock(selectedHero);
      }

      if (e.target.dataset.answer) {
        fillAnswerBlock(selectedHero, e.target.dataset.answer);
      }

      if (!e.target.classList.contains('answer-advise__another')) {
        setActiveBlock(e.target.dataset.nav);
      }

      setTimeout(() => {
        moveToTargetBlock(e.target.dataset.nav);
      }, 200);
    }

    if (e.target.classList.contains('js-more')) {
      e.preventDefault();

      e.target.style.display = 'none';
      e.target.closest('.js-more-parent').classList.add('readable');
    }

    if (e.target.classList.contains('js-advise-toggler')) {
      const advise = e.target.closest('.answer-advise'),
        readable = (e.target.closest('.answer-advise').querySelector('.js-more').style.display === 'none') ? true : false;

      if (e.target.checked) {
        fillText(selectedHero.advise.rexona, advise, true, readable);
      } else {
        fillText(selectedHero.advise.hero, advise, true, readable);
      }
    }
  });
}
