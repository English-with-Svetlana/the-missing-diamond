(function () {
  "use strict";

  const STORAGE_KEY = "missingDiamondAudio";
  const DEFAULT_VOLUME = 0.5;
  const MUSIC_LEVEL = 0.35;
  const EFFECT_LEVEL = 0.9;
  const sources = {
    background: "./assets/audio/background.mp3",
    shot: "./assets/audio/shot.mp3",
    correct: "./assets/audio/correct.mp3",
    wrong: "./assets/audio/wrong.mp3",
    clue: "./assets/audio/clue.mp3",
    roundComplete: "./assets/audio/round-complete.mp3",
    victory: "./assets/audio/victory.mp3"
  };

  function loadSettings() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return {
        volume: Number.isFinite(saved?.volume) ? Math.min(1, Math.max(0, saved.volume)) : DEFAULT_VOLUME,
        muted: Boolean(saved?.muted)
      };
    } catch (error) {
      return { volume: DEFAULT_VOLUME, muted: false };
    }
  }

  const settings = loadSettings();
  const unavailable = new Set();
  let background = null;
  let musicStarted = false;

  function saveSettings() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      // Storage can be unavailable in private or embedded contexts.
    }
  }

  function effectiveVolume(level) {
    return settings.muted ? 0 : settings.volume * level;
  }

  function createAudio(name, loop) {
    if (unavailable.has(name) || typeof window.Audio !== "function") return null;
    const audio = new window.Audio(sources[name]);
    audio.preload = "none";
    audio.loop = Boolean(loop);
    audio.addEventListener("error", () => unavailable.add(name), { once: true });
    return audio;
  }

  function safelyPlay(audio, name) {
    if (!audio || unavailable.has(name)) return;
    try {
      const playAttempt = audio.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => unavailable.add(name));
      }
    } catch (error) {
      unavailable.add(name);
    }
  }

  function startBackground() {
    if (musicStarted) return;
    musicStarted = true;
    background = background || createAudio("background", true);
    if (!background) return;
    background.volume = effectiveVolume(MUSIC_LEVEL);
    safelyPlay(background, "background");
  }

  function playEffect(name) {
    const audio = createAudio(name, false);
    if (!audio) return;
    audio.volume = effectiveVolume(EFFECT_LEVEL);
    safelyPlay(audio, name);
  }

  function setVolume(value) {
    const nextVolume = Number(value);
    if (!Number.isFinite(nextVolume)) return settings.volume;
    settings.volume = Math.min(1, Math.max(0, nextVolume));
    if (settings.volume > 0 && settings.muted) settings.muted = false;
    if (background) background.volume = effectiveVolume(MUSIC_LEVEL);
    saveSettings();
    return settings.volume;
  }

  function toggleMute() {
    settings.muted = !settings.muted;
    if (background) background.volume = effectiveVolume(MUSIC_LEVEL);
    saveSettings();
    return settings.muted;
  }

  function getSettings() {
    return { volume: settings.volume, muted: settings.muted };
  }

  window.GameAudio = {
    startBackground,
    playShot: () => playEffect("shot"),
    playCorrect: () => playEffect("correct"),
    playWrong: () => playEffect("wrong"),
    playClue: () => playEffect("clue"),
    playRoundComplete: () => playEffect("roundComplete"),
    playVictory: () => playEffect("victory"),
    setVolume,
    toggleMute,
    getSettings
  };
})();
