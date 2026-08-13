(function () {
  "use strict";

  const IMAGE_BASE = "https://english-with-svetlana.github.io/the-missing-diamond/assets/images/";
  const imageUrl = (filename) => `${IMAGE_BASE}${filename}`;
  const paths = {
    detectiveOffice: imageUrl("detective-office.png"),
    alexStart: imageUrl("alex-reed.png"),
    alexCompanion: imageUrl("alex-reed-full.png"),
    caseSolved: imageUrl("case-solved-diamond.png"),
    notebook: imageUrl("alex-notebook.png"),
    emma: imageUrl("emma-brooks.png"),
    james: imageUrl("james-miller.png"),
    oliver: imageUrl("oliver-grant.png"),
    crimeScene: imageUrl("museum-crime-scene.png"),
    interrogationRoom: imageUrl("interrogation-room.png"),
    evidenceBoard: imageUrl("evidence-board.png")
  };

  const startAssets = [paths.detectiveOffice, paths.alexStart];
  const preloadGroups = [
    [paths.emma, paths.james, paths.oliver, paths.crimeScene, paths.alexCompanion],
    [paths.notebook],
    [paths.interrogationRoom, paths.evidenceBoard, paths.caseSolved]
  ];
  const images = new Map();
  const records = new Map();

  function requestImage(path) {
    const existing = records.get(path);
    if (existing?.status === "loaded") return Promise.resolve(true);
    if (existing?.status === "loading") return existing.promise;

    const record = { status: "loading", promise: null };
    record.promise = new Promise((resolve) => {
      if (typeof window.Image !== "function") {
        record.status = "failed";
        resolve(false);
        return;
      }

      const image = new window.Image();
      images.set(path, image);
      let settled = false;
      const finish = (loaded) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeoutId);
        record.status = loaded ? "loaded" : "failed";
        resolve(loaded);
      };
      const timeoutId = window.setTimeout(() => finish(false), 12000);
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = path;
      if (image.complete && image.naturalWidth > 0) finish(true);
    });

    records.set(path, record);
    return record.promise;
  }

  function loadImage(path, retries) {
    return requestImage(path).then((loaded) => {
      if (loaded || retries <= 0) return loaded;
      return new Promise((resolve) => window.setTimeout(resolve, 250))
        .then(() => loadImage(path, retries - 1));
    });
  }

  function preload(pathsToLoad, onProgress, retries) {
    let completed = 0;
    if (onProgress) onProgress(0, pathsToLoad.length);
    return Promise.all(pathsToLoad.map((path) => loadImage(path, retries || 0).then((loaded) => {
      completed += 1;
      if (onProgress) onProgress(completed, pathsToLoad.length);
      return { path, loaded };
    })));
  }

  function preloadStart(onProgress) {
    return preload(startAssets, onProgress);
  }

  function preloadRemaining() {
    return preloadGroups.reduce(
      (sequence, group) => sequence.then(() => preload(group, null, 1)),
      Promise.resolve()
    );
  }

  window.GameAssets = {
    paths,
    preloadStart,
    preloadRemaining,
    whenReady: (path) => loadImage(path, 2)
  };
})();
