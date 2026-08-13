(function () {
  "use strict";

  const game = document.getElementById("game");
  const questions = window.GAME_QUESTIONS || [];
  const ROUND_NAMES = { 1: "CRIME SCENE", 2: "INTERROGATION", 3: "EVIDENCE BOARD" };
  const CORRECT_ANSWER_DELAY = { 1: 2500, 2: 1900, 3: 1900 };

  const state = {
    screen: "start",
    round: 1,
    questionIndex: 0,
    score: 0,
    lives: 3,
    correctShots: 0,
    wrongShots: 0,
    evidence: [],
    startTime: null,
    endTime: null,
    feedback: "",
    feedbackType: "",
    selectedAnswer: null,
    answerLocked: false,
    showEvidence: false,
    answerOrders: {},
    evidenceSequenceActive: false,
    storyGuideActive: false,
    evidenceReactionShown: false
  };

  function roundQuestions(round) {
    return questions.filter((question) => question.round === round);
  }

  function currentQuestion() {
    return roundQuestions(state.round)[state.questionIndex];
  }

  function prepareAnswerOrder(round) {
    const multipleChoiceQuestions = roundQuestions(round).filter((question) => question.type === "multiple-choice");
    if (multipleChoiceQuestions.length) {
      state.answerOrders = Object.assign(
        {},
        state.answerOrders,
        window.AnswerOrder.buildRoundOrders(multipleChoiceQuestions)
      );
    }
  }

  function setScreen(screen) {
    state.screen = screen;
    state.feedback = "";
    state.feedbackType = "";
    render();
  }

  function button(label, action, className) {
    return `<button type="button" class="btn ${className || ""}" data-action="${action}">${label}</button>`;
  }

  function renderAudioControl() {
    const audioSettings = window.GameAudio.getSettings();
    const icon = audioSettings.muted ? "🔇" : "🔊";
    return `<aside class="audio-control" aria-label="Game volume">
      <button type="button" class="audio-control__speaker" data-action="toggle-mute" aria-label="${audioSettings.muted ? "Unmute sound" : "Mute sound"}" aria-pressed="${audioSettings.muted}">${icon}</button>
      <input class="audio-control__slider" type="range" min="0" max="1" step="0.01" value="${audioSettings.volume}" aria-label="Volume">
    </aside>`;
  }

  function syncAudioControl() {
    const audioSettings = window.GameAudio.getSettings();
    const speaker = game.querySelector(".audio-control__speaker");
    const slider = game.querySelector(".audio-control__slider");
    if (speaker) {
      speaker.textContent = audioSettings.muted ? "🔇" : "🔊";
      speaker.setAttribute("aria-label", audioSettings.muted ? "Unmute sound" : "Mute sound");
      speaker.setAttribute("aria-pressed", String(audioSettings.muted));
    }
    if (slider) slider.value = String(audioSettings.volume);
  }

  function renderStart() {
    return `<section class="screen scene scene--start">
      <div class="start-content"><p class="eyebrow">Case file #017</p>
      <h1>THE MISSING DIAMOND</h1>
      <p class="subtitle">A Grammar Detective Game</p>
      <div class="panel start-brief"><p>Detective Alex Reed is waiting for a new case.</p></div>
      <div class="button-row">${button("START INVESTIGATION", "start", "btn--primary")}${button("HOW TO PLAY", "how-to", "btn--ghost")}</div></div>
      <img class="alex-hero" src="./assets/images/alex-reed.png" alt="Detective Alex Reed">
    </section>`;
  }

  function renderHowTo() {
    return renderStart() + `<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="how-title">
      <section class="panel how-to-panel"><h2 id="how-title">HOW TO PLAY</h2><div class="instructions">
        <p>🎯 Move the target with your mouse.</p><p>🔫 Click to shoot.</p><p>🔎 Find the correct answer or the mistake.</p><p>❤️ You have 3 lives.</p><p>🧩 Find clues.</p><p>🕵️ Catch the thief!</p>
      </div>${button("GOT IT!", "close-how", "btn--primary")}</section>
    </div>`;
  }

  function suspectCards(selectable) {
    const suspects = [
      ["emma", "./assets/images/emma-brooks.png", "EMMA BROOKS", "Museum Curator"],
      ["james", "./assets/images/james-miller.png", "JAMES MILLER", "Security Guard"],
      ["oliver", "./assets/images/oliver-grant.png", "OLIVER GRANT", "Photographer"]
    ];
    return `<div class="suspect-grid ${selectable ? "suspect-grid--final" : ""}">${suspects.map(([id, image, name, job]) => selectable
      ? `<button class="suspect-card btn" type="button" data-suspect="${id}"><div class="suspect-portrait"><img src="${image}" alt="${name}"></div><h3>${name}</h3><p>${job}</p></button>`
      : `<article class="suspect-card"><div class="suspect-portrait"><img src="${image}" alt="${name}"></div><h3>${name}</h3><p>${job}</p></article>`).join("")}</div>`;
  }

  function renderBriefing() {
    return `<section class="screen scene scene--briefing"><p class="eyebrow">Case #017</p><h2>THE MISSING DIAMOND</h2>
      <div class="panel briefing-copy"><p>The Blue Star is a famous diamond.</p><p>Last night, someone stole it from the City Museum.</p><p>The museum closed at 9:00 p.m.</p><p>The alarm went off at 9:40 p.m.</p><p>The doors were not broken. The windows were closed.</p><p><strong>The thief may know the museum.</strong></p></div>
      ${suspectCards(false)}${button("ENTER THE CRIME SCENE →", "begin-round", "btn--primary")}</section>`;
  }

  function renderQuestionContent(question) {
    if (question.type === "find-error") {
      const words = question.sentence.split(" ");
      if (state.answerLocked) {
        return `<p class="muted">Correct sentence</p><p class="question resolved-sentence">${words.map((word) =>
          cleanWord(word) === question.target
            ? `<span class="correct-word">${word.replace(question.target, question.correction)}</span>`
            : word).join(" ")}</p>`;
      }
      return `<p class="muted">Find the mistake. Click one word.</p><div class="words">${words.map((word, index) =>
        `<button type="button" class="word" data-answer="${index}" aria-label="Choose ${word}">${word}</button>`).join("")}</div>`;
    }
    const displayedAnswers = state.answerOrders[question.id] || question.answers;
    return `<p class="question">${question.sentence}</p><div class="answer-grid">${displayedAnswers.map((answer) =>
      `<button type="button" class="answer ${state.answerLocked && answer === state.selectedAnswer ? "answer--correct" : ""}" data-answer="${answer}" ${state.answerLocked ? "disabled" : ""}>${answer}</button>`).join("")}</div>
      ${state.answerLocked ? `<p class="question resolved-sentence">${question.sentence.replace("___", `<span class="correct-word">${question.correct}</span>`)}</p>` : ""}`;
  }

  function renderEvidenceOverlay() {
    const items = state.evidence.length
      ? state.evidence.map((item, index) => `<article class="evidence-card"><strong>Clue ${index + 1}</strong><p>${item}</p></article>`).join("")
      : `<p class="muted">No evidence collected yet.</p>`;
    return `<div class="overlay overlay--evidence" role="dialog" aria-modal="true" aria-labelledby="evidence-title"><section class="panel evidence-panel"><h2 id="evidence-title">CASE EVIDENCE</h2><div class="evidence-list">${items}</div><br>${button("CLOSE EVIDENCE", "close-evidence", "btn--primary")}</section></div>`;
  }

  function renderGame() {
    const question = currentQuestion();
    if (!question) return `<section class="screen"><p class="error-message">Question data is missing.</p></section>`;
    return `<section class="screen screen--game"><header class="hud"><strong>SCORE ${state.score}</strong><span aria-label="${state.lives} lives">${"❤️".repeat(state.lives)}${"♡".repeat(3 - state.lives)}</span><strong>CASE PROGRESS ${state.round} / 3</strong><button type="button" class="btn btn--ghost evidence-button" data-action="evidence">📁 EVIDENCE <span class="evidence-count">${state.evidence.length}/10</span></button></header>
      <p class="eyebrow">INVESTIGATION STAGE ${String(state.round).padStart(2, "0")}</p><h2>${ROUND_NAMES[state.round]}</h2>
      <section class="panel"><p class="question-number">TASK ${state.questionIndex + 1} / 10</p>${renderQuestionContent(question)}
      <p class="feedback ${state.feedbackType ? `feedback--${state.feedbackType}` : ""}" role="status">${state.feedback}</p></section></section>`;
  }

  function transitionData(round) {
    if (round === 1) return { completion: "FIRST LEADS FOUND", title: "THE INVESTIGATION BOARD", lines: ["Museum closed — 9:00", "Camera stopped — 9:20", "Window intact", "Metal piece", "Emma's key"], action: "START INTERROGATION" };
    return { completion: "STATEMENTS COLLECTED", title: "NEW EVIDENCE FOUND", lines: ["Emma → computer evidence", "James → security camera evidence", "Oliver → his own statement", "📷 A CAMERA MEMORY CARD"], action: "OPEN EVIDENCE BOARD" };
  }

  function renderTransition() {
    const data = transitionData(state.round);
    return `<section class="screen"><p class="eyebrow">${data.completion}</p><h2>${data.title}</h2><div class="panel"><div class="transition-list">${data.lines.map((line) => `<span>${line}</span>`).join("")}</div></div>${button(data.action, "next-round", "btn--primary")}</section>`;
  }

  function renderRoundFailed() {
    return `<section class="screen"><h2>TRY THIS CASE AGAIN</h2><div class="panel"><p>You lost all three lives.</p><p>Your total score and evidence are safe. Restart investigation stage ${String(state.round).padStart(2, "0")}.</p></div>${button(`RESTART STAGE ${String(state.round).padStart(2, "0")}`, "restart-round", "btn--primary")}</section>`;
  }

  function renderDecision() {
    const decisionHint = state.feedback
      ? `<div class="decision-error" role="status"><strong>LOOK AT THE EVIDENCE AGAIN</strong><span>One suspect lied about the time.</span></div>`
      : "";
    return `<section class="screen decision-screen"><header class="decision-header"><p class="eyebrow">You have all the evidence.</p><h2>WHO STOLE THE BLUE STAR?</h2></header>${button(`📁 REVIEW EVIDENCE (${state.evidence.length}/10)`, "evidence", "btn--ghost decision-evidence-button")}<p class="decision-prompt">Choose a suspect.</p>${suspectCards(true)}<div class="decision-error-slot">${decisionHint}</div></section>`;
  }

  function resultStats() {
    const totalShots = state.correctShots + state.wrongShots;
    const accuracy = totalShots ? Math.round((state.correctShots / totalShots) * 100) : 0;
    const seconds = Math.max(0, Math.floor(((state.endTime || Date.now()) - state.startTime) / 1000));
    const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    const rank = accuracy >= 90 ? "🥇 MASTER DETECTIVE" : accuracy >= 75 ? "🥈 SKILLED DETECTIVE" : "🥉 JUNIOR DETECTIVE";
    return { accuracy, time, rank };
  }

  function renderResults() {
    const stats = resultStats();
    return `<section class="screen"><p class="eyebrow case-closed">Case closed</p><h2>DETECTIVE REPORT</h2><div class="panel"><h3>${stats.rank}</h3><div class="results-grid">
      <div class="stat">Score<strong>${state.score}</strong></div><div class="stat">Accuracy<strong>${stats.accuracy}%</strong></div><div class="stat">Correct Shots<strong>${state.correctShots}</strong></div><div class="stat">Wrong Shots<strong>${state.wrongShots}</strong></div><div class="stat">Evidence Found<strong>${state.evidence.length}/10</strong></div><div class="stat">Time<strong>${stats.time}</strong></div>
      </div><div class="button-row">${button("PLAY AGAIN", "play-again", "btn--primary")}${button("REVIEW THE CASE", "review", "btn--ghost")}</div></div></section>`;
  }

  function correctVersion(question) {
    if (question.type === "multiple-choice") return question.sentence.replace("___", question.correct);
    return question.sentence.split(" ").map((word) => cleanWord(word) === question.target ? word.replace(question.target, question.correction) : word).join(" ");
  }

  function renderReview() {
    const groups = [1, 2, 3].map((round) => `<h3>INVESTIGATION STAGE ${String(round).padStart(2, "0")} — ${ROUND_NAMES[round]}</h3>${roundQuestions(round).map((question) => `<article class="review-item"><strong>${question.id}. ${question.sentence}</strong><p class="corrected">✓ ${correctVersion(question)}</p></article>`).join("")}`).join("");
    return `<section class="screen screen--game"><h2>REVIEW THE CASE</h2><div class="panel"><div class="review-list">${groups}</div><br>${button("BACK TO RESULTS", "back-results", "btn--primary")}</div></section>`;
  }

  function renderCaseClosed() {
    return `<section class="screen case-closed-screen"><p class="eyebrow">Guilty</p><h2 class="case-closed">CASE CLOSED</h2><div class="panel case-closed-panel"><img class="alex-victory" src="./assets/images/alex-reed.png" alt="Detective Alex Reed"><h3>THE BLUE STAR HAS BEEN FOUND</h3><p>Oliver said he had left at 9:00.</p><p>But his camera took a photo at 9:27.</p><p>A piece of his camera strap was found near the diamond.</p><p><strong>He lied.</strong></p></div>${button("VIEW DETECTIVE REPORT", "show-results", "btn--primary case-report-button")}</section>`;
  }

  function render() {
    const views = { start: renderStart, howTo: renderHowTo, briefing: renderBriefing, game: renderGame, transition: renderTransition, roundFailed: renderRoundFailed, decision: renderDecision, caseClosed: renderCaseClosed, results: renderResults, review: renderReview };
    game.dataset.scene = state.screen === "game" ? `round-${state.round}` : state.screen;
    game.innerHTML = (views[state.screen] || renderStart)();
    if (state.screen === "game" && state.showEvidence) game.insertAdjacentHTML("beforeend", renderEvidenceOverlay());
    if (state.screen === "decision" && state.showEvidence) game.insertAdjacentHTML("beforeend", renderEvidenceOverlay());
    game.insertAdjacentHTML("beforeend", renderAudioControl());
    window.GameEffects.syncCrosshair((state.screen === "game" || state.screen === "decision") && !state.showEvidence);
  }

  function cleanWord(word) {
    return word.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, "");
  }

  function collectEvidence(question) {
    if (!question.evidence || !question.evidence.important || state.evidence.includes(question.evidence.text)) return false;
    return question.evidence.text;
  }

  function finishEvidenceCollection(evidenceText) {
    if (!state.evidence.includes(evidenceText)) state.evidence.push(evidenceText);
    const counter = game.querySelector(".evidence-count");
    if (counter) counter.textContent = `${state.evidence.length}/10`;
  }

  function showStoryGuide(message, onComplete) {
    state.storyGuideActive = true;
    window.GameEffects.syncCrosshair(false);
    window.GameEffects.showAlexGuide(message, () => {
      state.storyGuideActive = false;
      onComplete();
    });
  }

  function chooseAnswer(rawValue) {
    if (state.answerLocked) return;
    const question = currentQuestion();
    let isCorrect = false;
    if (question.type === "find-error") {
      const chosenWord = question.sentence.split(" ")[Number(rawValue)];
      isCorrect = cleanWord(chosenWord) === question.target;
    } else {
      isCorrect = rawValue === question.correct;
    }
    if (isCorrect) handleCorrect(question, rawValue); else handleWrong();
  }

  function handleCorrect(question, selectedAnswer) {
    state.answerLocked = true;
    state.selectedAnswer = question.type === "multiple-choice" ? selectedAnswer : question.correction;
    state.correctShots += 1;
    state.score += 100;
    const foundEvidence = collectEvidence(question);
    state.feedbackType = "correct";
    state.feedback = `${question.type === "find-error" ? `${question.target} → ${question.correction}` : question.correct} ✓ +100${foundEvidence ? " · NEW EVIDENCE" : ""}`;
    render();
    window.GameAudio.playCorrect();
    if (foundEvidence) {
      state.evidenceSequenceActive = true;
      window.GameAudio.playClue();
      window.GameEffects.animateEvidence(foundEvidence, () => {
        finishEvidenceCollection(foundEvidence);
      }, () => {
        if (!state.evidenceReactionShown) {
          state.evidenceReactionShown = true;
          showStoryGuide("Good. That's important.", () => {
            state.evidenceSequenceActive = false;
            advanceQuestion();
          });
        } else {
          state.evidenceSequenceActive = false;
          advanceQuestion();
        }
      });
    } else {
      window.setTimeout(advanceQuestion, CORRECT_ANSWER_DELAY[state.round]);
    }
  }

  function handleWrong() {
    state.wrongShots += 1;
    state.lives -= 1;
    state.feedbackType = "wrong";
    state.feedback = "Not correct. Try again.";
    window.GameAudio.playWrong();
    if (state.lives <= 0) {
      window.setTimeout(() => setScreen("roundFailed"), 350);
    } else {
      render();
    }
  }

  function advanceQuestion() {
    if (state.screen !== "game") return;
    if (state.showEvidence) {
      window.setTimeout(advanceQuestion, 200);
      return;
    }
    if (state.questionIndex < 9) {
      state.questionIndex += 1;
      state.answerLocked = false;
      state.selectedAnswer = null;
      state.feedback = "";
      state.feedbackType = "";
      render();
      return;
    }
    state.answerLocked = false;
    state.selectedAnswer = null;
    if (state.round < 3) {
      window.GameAudio.playRoundComplete();
      setScreen("transition");
    } else {
      window.GameAudio.playRoundComplete();
      showStoryGuide("We have enough evidence. Who did it?", () => setScreen("decision"));
    }
  }

  function resetGame() {
    Object.assign(state, { screen: "start", round: 1, questionIndex: 0, score: 0, lives: 3, correctShots: 0, wrongShots: 0, evidence: [], startTime: null, endTime: null, feedback: "", feedbackType: "", showEvidence: false, answerLocked: false, selectedAnswer: null, answerOrders: {}, evidenceSequenceActive: false, storyGuideActive: false, evidenceReactionShown: false });
    render();
  }

  function handleAction(action) {
    if (action === "how-to") setScreen("howTo");
    if (action === "close-how") setScreen("start");
    if (action === "start") {
      state.startTime = Date.now();
      window.GameAudio.startBackground();
      setScreen("briefing");
    }
    if (action === "toggle-mute") { window.GameAudio.toggleMute(); syncAudioControl(); }
    if (action === "begin-round") {
      prepareAnswerOrder(state.round);
      setScreen("game");
      showStoryGuide("Let's search the crime scene.", () => {
        window.GameEffects.syncCrosshair(true);
      });
    }
    if (action === "evidence") { state.showEvidence = true; render(); }
    if (action === "close-evidence") { state.showEvidence = false; render(); }
    if (action === "next-round") {
      const nextRound = state.round + 1;
      const message = nextRound === 2 ? "Time to question the suspects." : "Let's connect the evidence.";
      showStoryGuide(message, () => {
        state.round = nextRound;
        state.questionIndex = 0;
        state.lives = 3;
        state.answerLocked = false;
        state.selectedAnswer = null;
        prepareAnswerOrder(state.round);
        setScreen("game");
      });
    }
    if (action === "restart-round") { state.questionIndex = 0; state.lives = 3; state.answerLocked = false; state.selectedAnswer = null; prepareAnswerOrder(state.round); setScreen("game"); }
    if (action === "show-results") setScreen("results");
    if (action === "play-again") resetGame();
    if (action === "review") setScreen("review");
    if (action === "back-results") setScreen("results");
  }

  game.addEventListener("click", (event) => {
    window.GameAudio.unlock();
    const audioActionTarget = event.target.closest("[data-action='toggle-mute']");
    if (audioActionTarget) { handleAction("toggle-mute"); return; }
    if (state.evidenceSequenceActive || state.storyGuideActive) return;
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) { handleAction(actionTarget.dataset.action); return; }
    const answerTarget = event.target.closest("[data-answer]");
    if (answerTarget && state.screen === "game" && !state.answerLocked) {
      const answerValue = answerTarget.dataset.answer;
      const question = currentQuestion();
      const isCorrect = question.type === "find-error"
        ? cleanWord(question.sentence.split(" ")[Number(answerValue)]) === question.target
        : answerValue === question.correct;
      window.GameAudio.playShot();
      chooseAnswer(answerValue);
      window.GameEffects.showShotFlash(event.clientX, event.clientY, answerValue, isCorrect ? "correct" : "wrong");
      if (isCorrect) window.GameEffects.showScorePopup(event.clientX, event.clientY);
      else window.GameEffects.showWrongEffect();
      return;
    }
    const suspectTarget = event.target.closest("[data-suspect]");
    if (suspectTarget && state.screen === "decision") {
      window.GameAudio.playShot();
      if (suspectTarget.dataset.suspect === "oliver") {
        state.endTime = Date.now();
        window.GameAudio.playVictory();
        setScreen("caseClosed");
      } else {
        window.GameAudio.playWrong();
        state.wrongShots += 1;
        state.feedbackType = "wrong";
        state.feedback = "LOOK AT THE EVIDENCE AGAIN — One suspect lied about the time.";
        render();
      }
    }
  });

  game.addEventListener("input", (event) => {
    if (!event.target.matches(".audio-control__slider")) return;
    window.GameAudio.unlock();
    window.GameAudio.setVolume(event.target.value);
    syncAudioControl();
  });

  if (questions.length !== 30 || [1, 2, 3].some((round) => roundQuestions(round).length !== 10)) {
    game.innerHTML = `<section class="screen"><p class="error-message">The case data could not be loaded correctly.</p></section>`;
  } else {
    window.GameEffects.initialize(game);
    const revealGame = () => {
      render();
      window.GameAssets?.preloadRemaining();
    };
    if (window.GameAssets) {
      window.GameAssets.preloadStart((completed, total) => {
        const progress = game.querySelector(".loading-screen__progress");
        if (progress) progress.textContent = `${Math.round((completed / total) * 100)}%`;
      }).then(revealGame);
    } else {
      revealGame();
    }
  }
})();
