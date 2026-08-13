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
  const audioCache = new Map();
  let background = null;
  let backgroundWanted = false;
  let backgroundPlaying = false;
  let backgroundPlayPending = false;
  let audioWarmed = false;

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
    if (audioCache.has(name)) return audioCache.get(name);
    const audio = new window.Audio(sources[name]);
    audio.preload = "auto";
    audio.loop = Boolean(loop);
    audio.addEventListener("error", () => unavailable.add(name), { once: true });
    if (name === "background") {
      audio.addEventListener("playing", () => { backgroundPlaying = true; });
      audio.addEventListener("pause", () => { backgroundPlaying = false; });
    }
    audioCache.set(name, audio);
    return audio;
  }

  function safelyPlay(audio, name, onStarted, onRejected) {
    if (!audio || unavailable.has(name)) return null;
    try {
      const playAttempt = audio.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.then(() => onStarted?.()).catch(() => onRejected?.());
      } else {
        onStarted?.();
      }
      return playAttempt;
    } catch (error) {
      onRejected?.();
      return null;
    }
  }

  function warmAudio() {
    if (audioWarmed) return;
    audioWarmed = true;
    Object.keys(sources).forEach((name) => {
      const audio = createAudio(name, name === "background");
      try {
        audio?.load();
      } catch (error) {
        // Loading can be deferred by embedded-browser policies.
      }
    });
  }

  function tryBackground() {
    if (backgroundPlaying && background?.paused) backgroundPlaying = false;
    if (!backgroundWanted || backgroundPlaying || backgroundPlayPending || settings.muted) return;
    background = background || createAudio("background", true);
    if (!background) return;
    background.volume = effectiveVolume(MUSIC_LEVEL);
    backgroundPlayPending = true;
    safelyPlay(
      background,
      "background",
      () => {
        backgroundPlayPending = false;
        backgroundPlaying = true;
      },
      () => {
        backgroundPlayPending = false;
        backgroundPlaying = false;
      }
    );
  }

  function unlock() {
    warmAudio();
    tryBackground();
  }

  function startBackground() {
    backgroundWanted = true;
    unlock();
  }

  function playEffect(name) {
    unlock();
    const audio = createAudio(name, false);
    if (!audio) return;
    audio.volume = effectiveVolume(EFFECT_LEVEL);
    try {
      audio.currentTime = 0;
    } catch (error) {
      // The file may still be preparing inside an iframe.
    }
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
    if (!settings.muted) tryBackground();
    saveSettings();
    return settings.muted;
  }

  function getSettings() {
    return { volume: settings.volume, muted: settings.muted };
  }

  window.GameAudio = {
    unlock,
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
