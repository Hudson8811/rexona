/* eslint-disable max-len */
//= ./quiz/setActiveSection.js
//= ./quiz/calcResult.js
//= ./quiz/postData.js

function quiz() {
  const RESULTS = {
    '1': {
      title: 'Выиграйте подарок для настоящей карьеристки!',
      text: 'Кажется, пошатнуть ваше внутреннее равновесие могут только рабочие вопросы. Карьера — дело тонкое, берегите себя! Почувствовать себя уверенно в любой ситуации поможет подарок от Rexona!',
    },
    '2': {
      title: 'Выиграйте подарок для экстремалки!',
      text: 'Больше адреналина и вдохновения! Ваше тело явно требует новых впечатлений, и ничто не должно мешать ими наслаждаться. Почувствовать себя уверенно в любой ситуации поможет подарок от Rexona!',
    },
    '3': {
      title: 'Выиграйте подарок для романтической натуры!',
      text: 'Вы натура утонченная, как героини песен Валерия Меладзе. Девушка из высшего общества должна наслаждаться романтикой и красотой момента, а не страдать в поте лица. Почувствовать себя уверенно в любой ситуации поможет подарок от Rexona!',
    },
    '4': {
      title: 'Выиграйте подарок для истинной модницы!',
      text: 'Разные носки иногда хорошо сочетаются и придают образу изюминку. Меньше стресса и тревоги, тогда точно покорите модный Олимп! Почувствовать себя уверенно в любой ситуации поможет подарок от Rexona!',
    },
  };

  const quiz = document.getElementById('quiz'),
    sections = quiz.querySelectorAll('.quiz-sections__item'),
    result = document.getElementById('result'),
    resultTitle = quiz.querySelector('.quiz-reg__title'),
    resultText = quiz.querySelector('.quiz-reg__text'),
    answers = [],
    modal = document.querySelector('.quiz-reg__modal'),
    modalRegistration = modal.querySelector('.quiz-modal__first'),
    modalLoader = modal.querySelector('.quiz-modal__loader'),
    modalAfter = modal.querySelector('.quiz-modal__after'),
    modalError = modal.querySelector('.quiz-modal__error'),
    form = quiz.querySelector('form');

  let activeSection = 0;

  quiz.addEventListener('click', e => {
    if (e.target.classList.contains('quiz-index__button-item')) {
      e.preventDefault();

      activeSection++;
      setActiveSection(sections, activeSection);
    }

    if (e.target.classList.contains('quiz-answer__input')) {
      activeSection++;

      answers.push(e.target.dataset.value);

      if (activeSection === sections.length - 1) {
        resultTitle.textContent = RESULTS[calcResult(answers)].title;
        resultText.textContent = RESULTS[calcResult(answers)].text;
        result.value = calcResult(answers);
      }

      setTimeout(() => {
        setActiveSection(sections, activeSection);
      }, 300);
    }

    if (e.target.classList.contains('quiz-reg__cta-button')) {
      e.preventDefault();

      modal.classList.add('active');
    }

    if (e.target.classList.contains('quiz-modal__overlay') || e.target.classList.contains('quiz-modal__close')) {
      modal.classList.remove('active');
    }

    // console.log(e.target);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    modalRegistration.style.display = 'none';
    modalLoader.style.display = 'block';

    const formData = new FormData(form),
      body = {};

    formData.forEach((value, key) => {
      body[key] = value;
    });

    postData(body)
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Network status is not 200');
        }

        return response;
      })
      .then(data => {
        const result = JSON.parse(data);

        if (result.error_no === 0) {

          setTimeout(() => {
            modalLoader.style.display = 'none';
            modalAfter.style.display = 'block';
          }, 2000);

        } else if (result.error_no > 1) {

          setTimeout(() => {
            modalLoader.style.display = 'none';
            modalRegistration.style.display = 'block';

            modalError.textContent = result.error_text;
            modalError.style.display = 'block';
          }, 2000);

        }
      })
      .catch(error => {
        console.error(error);

        setTimeout(() => {
          modalLoader.style.display = 'none';
          modalRegistration.style.display = 'block';
          modalError.style.display = 'block';
        }, 2000);
      });
  });
}
