(function () {
  "use strict";

  const DESIGN_WIDTH = 1600;
  const DESIGN_HEIGHT = 900;
  const MOBILE_BREAKPOINT = 650;
  const viewport = document.getElementById("game-viewport");
  const stage = document.getElementById("game");

  if (!viewport || !stage) return;

  function updateStageScale() {
    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;
    const useMobileLayout = viewportWidth <= MOBILE_BREAKPOINT;

    viewport.classList.toggle("game-viewport--mobile", useMobileLayout);

    if (useMobileLayout) {
      stage.style.setProperty("--game-scale", "1");
      return;
    }

    const scale = Math.min(
      1,
      viewportWidth / DESIGN_WIDTH,
      viewportHeight / DESIGN_HEIGHT
    );
    stage.style.setProperty("--game-scale", String(scale));
  }

  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(updateStageScale);
    observer.observe(viewport);
  } else {
    window.addEventListener("resize", updateStageScale, { passive: true });
  }

  updateStageScale();
})();
