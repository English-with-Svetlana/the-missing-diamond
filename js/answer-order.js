(function (root) {
  "use strict";

  function shuffle(items, random) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function buildPositionSequence(questionCount, random) {
    const baseCount = Math.floor(questionCount / 3);
    const counts = [baseCount, baseCount, baseCount];
    shuffle([0, 1, 2], random).slice(0, questionCount % 3).forEach((position) => {
      counts[position] += 1;
    });

    const sequence = [];
    while (sequence.length < questionCount) {
      const blocked = sequence.length >= 2 && sequence.at(-1) === sequence.at(-2)
        ? sequence.at(-1)
        : -1;
      const candidates = shuffle([0, 1, 2], random)
        .filter((position) => counts[position] > 0 && position !== blocked)
        .sort((first, second) => counts[second] - counts[first]);
      const position = candidates[0];
      sequence.push(position);
      counts[position] -= 1;
    }
    return sequence;
  }

  function buildRoundOrders(questions, random) {
    const randomValue = random || Math.random;
    const positions = buildPositionSequence(questions.length, randomValue);
    return questions.reduce((orders, question, index) => {
      const wrongAnswers = shuffle(
        question.answers.filter((answer) => answer !== question.correct),
        randomValue
      );
      wrongAnswers.splice(positions[index], 0, question.correct);
      orders[question.id] = wrongAnswers;
      return orders;
    }, {});
  }

  const api = { buildRoundOrders };
  root.AnswerOrder = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
