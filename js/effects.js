(function () {
  "use strict";

  let gameArea = null;
  let crosshair = null;
  let crosshairEnabled = false;
  let pointerX = 0;
  let pointerY = 0;
  const ALEX_IMAGE = "./assets/images/alex-reed-full.png";
  const NOTEBOOK_IMAGE = "./assets/images/alex-notebook.png";

  function whenImageReady(path) {
    return window.GameAssets?.whenReady(path) || Promise.resolve(true);
  }

  function createCrosshair() {
    const element = document.createElement("div");
    element.className = "crosshair";
    element.setAttribute("aria-hidden", "true");
    element.innerHTML = `<span class="crosshair__ring"></span><span class="crosshair__line crosshair__line--h"></span><span class="crosshair__line crosshair__line--v"></span><span class="crosshair__dot"></span>`;
    return element;
  }

  function positionCrosshair(clientX, clientY) {
    if (!gameArea || !crosshair) return;
    const bounds = gameArea.getBoundingClientRect();
    pointerX = clientX - bounds.left;
    pointerY = clientY - bounds.top;
    crosshair.style.left = `${pointerX}px`;
    crosshair.style.top = `${pointerY}px`;
  }

  function initialize(container) {
    gameArea = container;
    crosshair = createCrosshair();

    gameArea.addEventListener("mousemove", (event) => {
      if (!crosshairEnabled) return;
      positionCrosshair(event.clientX, event.clientY);
      crosshair.classList.add("crosshair--visible");
      crosshair.classList.toggle("crosshair--targeting", Boolean(event.target.closest("[data-answer], [data-suspect]")));
    });
    gameArea.addEventListener("mouseleave", () => crosshair.classList.remove("crosshair--visible"));
  }

  function syncCrosshair(enabled) {
    if (!gameArea || !crosshair) return;
    crosshairEnabled = enabled;
    gameArea.classList.toggle("crosshair-active", enabled);
    if (enabled) {
      if (!crosshair.isConnected) gameArea.appendChild(crosshair);
      crosshair.style.left = `${pointerX}px`;
      crosshair.style.top = `${pointerY}px`;
    } else {
      crosshair.classList.remove("crosshair--visible", "crosshair--targeting", "crosshair--recoil");
      if (crosshair.isConnected) crosshair.remove();
    }
  }

  function findRenderedTarget(answerValue, correct) {
    const candidates = Array.from(gameArea.querySelectorAll("[data-answer]"));
    return candidates.find((candidate) => candidate.dataset.answer === String(answerValue))
      || (correct ? gameArea.querySelector(".correct-word") : null);
  }

  function showShotFlash(clientX, clientY, answerValue, outcome) {
    if (!gameArea) return;
    positionCrosshair(clientX, clientY);
    const flash = document.createElement("span");
    flash.className = "shot-flash";
    flash.style.left = `${pointerX}px`;
    flash.style.top = `${pointerY}px`;
    gameArea.appendChild(flash);
    flash.addEventListener("animationend", () => flash.remove(), { once: true });

    if (crosshair) {
      crosshair.classList.remove("crosshair--recoil");
      void crosshair.offsetWidth;
      crosshair.classList.add("crosshair--recoil");
      window.setTimeout(() => crosshair.classList.remove("crosshair--recoil"), 220);
    }

    const target = findRenderedTarget(answerValue, outcome === "correct");
    if (target) {
      target.classList.add("target-hit", `target-hit--${outcome}`);
      window.setTimeout(() => target.classList.remove("target-hit", `target-hit--${outcome}`), 480);
    }
  }

  function showScorePopup(clientX, clientY) {
    const bounds = gameArea.getBoundingClientRect();
    const popup = document.createElement("strong");
    popup.className = "score-popup";
    popup.textContent = "+100";
    popup.style.left = `${clientX - bounds.left}px`;
    popup.style.top = `${clientY - bounds.top}px`;
    gameArea.appendChild(popup);
    popup.addEventListener("animationend", () => popup.remove(), { once: true });
  }

  function showWrongEffect() {
    const glow = document.createElement("div");
    glow.className = "wrong-edge-glow";
    glow.setAttribute("aria-hidden", "true");
    gameArea.appendChild(glow);
    glow.addEventListener("animationend", () => glow.remove(), { once: true });
  }

  function animateEvidenceReady(text, onImpact, onComplete) {
    const evidenceButton = gameArea.querySelector("[data-action='evidence']");
    if (!evidenceButton) {
      onImpact();
      onComplete();
      return;
    }

    const card = document.createElement("article");
    card.className = "new-evidence-card";
    card.setAttribute("role", "status");
    card.innerHTML = `<div class="new-evidence-card__note"><strong>NEW EVIDENCE</strong><span>${text}</span></div>`;
    gameArea.appendChild(card);

    window.setTimeout(() => {
      const notebookBounds = card.getBoundingClientRect();
      const targetBounds = evidenceButton.getBoundingClientRect();
      const flyingNotebook = card.cloneNode(true);
      flyingNotebook.classList.add("new-evidence-card--clone");
      flyingNotebook.style.left = `${notebookBounds.left}px`;
      flyingNotebook.style.top = `${notebookBounds.top}px`;
      flyingNotebook.style.width = `${notebookBounds.width}px`;
      flyingNotebook.style.height = `${notebookBounds.height}px`;
      document.body.appendChild(flyingNotebook);

      const targetX = targetBounds.left + targetBounds.width / 2;
      const targetY = targetBounds.top + targetBounds.height / 2;
      const notebookX = notebookBounds.left + notebookBounds.width / 2;
      const notebookY = notebookBounds.top + notebookBounds.height / 2;

      const travelX = targetX - notebookX;
      const travelY = targetY - notebookY;
      const flight = flyingNotebook.animate([
        { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1, offset: 0 },
        { transform: `translate(${travelX * .5}px, ${travelY * .5}px) scale(.55) rotate(2deg)`, opacity: 1, offset: .5 },
        { transform: `translate(${travelX * .72}px, ${travelY * .72}px) scale(.32) rotate(3deg)`, opacity: 1, offset: .72 },
        { transform: `translate(${travelX * .92}px, ${travelY * .92}px) scale(.15) rotate(4deg)`, opacity: .72, offset: .92 },
        { transform: `translate(${travelX}px, ${travelY}px) scale(.1) rotate(5deg)`, opacity: 0, offset: 1 }
      ], {
        duration: 1800,
        easing: "cubic-bezier(.35, 0, .18, 1)",
        fill: "forwards"
      });
      card.style.visibility = "hidden";

      flight.addEventListener("finish", () => {
        flyingNotebook.remove();
        card.remove();
        evidenceButton.classList.add("evidence-button--received");
        window.setTimeout(() => {
          evidenceButton.classList.remove("evidence-button--received");
          onImpact();
          onComplete();
        }, 320);
      }, { once: true });
    }, 3900);
  }

  function animateEvidence(text, onImpact, onComplete) {
    whenImageReady(NOTEBOOK_IMAGE).then(() => animateEvidenceReady(text, onImpact, onComplete));
  }

  function showAlexGuideReady(message, onComplete) {
    if (!gameArea) {
      onComplete();
      return;
    }

    const guide = document.createElement("aside");
    guide.className = "alex-guide";
    guide.setAttribute("role", "status");
    guide.innerHTML = `<div class="alex-guide__stage"><div class="alex-guide__bubble">${message}</div><img class="alex-guide__figure" src="${ALEX_IMAGE}" alt="Detective Alex Reed"></div>`;
    gameArea.appendChild(guide);

    window.requestAnimationFrame(() => guide.classList.add("alex-guide--visible"));
    window.setTimeout(() => guide.classList.add("alex-guide--leaving"), 4000);
    window.setTimeout(() => {
      guide.remove();
      onComplete();
    }, 4500);
  }

  function showAlexGuide(message, onComplete) {
    whenImageReady(ALEX_IMAGE).then(() => showAlexGuideReady(message, onComplete));
  }

  window.GameEffects = {
    initialize,
    syncCrosshair,
    showShotFlash,
    showScorePopup,
    showWrongEffect,
    animateEvidence,
    showAlexGuide
  };
})();
