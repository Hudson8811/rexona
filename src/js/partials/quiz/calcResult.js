function calcResult(array) {
  const answers = {};

  let max = 0,
    resultKey = '';

  array.forEach(item => {
    if (answers[item]) {
      answers[item]++;
    } else {
      answers[item] = 1;
    }
  });

  for (const key in answers) {
    if (answers[key] > max) {
      max = +answers[key];
      resultKey = key;
    }
  }

  return resultKey;
}
