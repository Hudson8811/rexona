/* eslint-disable object-shorthand */
/* eslint-disable max-len */

//= ./navigation/setACtiveBlock.js
//= ./navigation/moveToTargetBlock.js
//= ./navigation/chooseYourCharacter.js
//= ./navigation/fillText.js
//= ./navigation/fillPhoto.js
//= ./navigation/fillQuestionBlock.js
//= ./navigation/fillAnswerBlock.js

function navigation() {
  const SECTIONS = [ '#first', '#heroes', '#question', '#answer', '#quiz' ];

  let selectedHero = {},
    currentSection = 0;

  const getSectionIndex = elem => {
    for (const key in SECTIONS) {
      console.log(key);
      if (SECTIONS[key] === elem) return key;
    }
  };

  const indicator = new WheelIndicator({
    elem: document.querySelector('.main'),
    // preventMouse: true,
    callback: function(e) {
      if (e.direction === 'down') {
        if (currentSection < SECTIONS.length - 1) {
          if (document.querySelector(SECTIONS[currentSection + 1]).classList.contains('active')) {
            currentSection++;

            moveToTargetBlock(SECTIONS[currentSection]);
          }
        }
      } else if (e.direction === 'up') {
        if (currentSection > 0) {
          currentSection--;

          moveToTargetBlock(SECTIONS[currentSection]);
        }
      }
    }
  });

  document.addEventListener('mouseover', e => {
    if (e.target.closest('.js-scrollable')) {
      indicator._options.preventMouse = false;
    } else {
      indicator._options.preventMouse = true;
    }
  });

  document.querySelectorAll('.js-scrollable').forEach(item => {
    item.addEventListener('mouseleave', () => {
      if (item.classList.contains('question-story__item-text')) {
        currentSection = 2;
      }

      if (item.classList.contains('answer-story__item-text') || item.classList.contains('answer-advise__text')) {
        currentSection = 3;
      }
    });
  });

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
        currentSection++;
      } else {
        currentSection = 1;
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
