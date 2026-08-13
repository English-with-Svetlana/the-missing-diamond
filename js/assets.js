(function () {
  "use strict";

  const paths = {
    detectiveOffice: "./assets/images/detective-office.png",
    alexStart: "./assets/images/alex-reed.png",
    alexCompanion: "./assets/images/alex-reed-full.png",
    notebook: "./assets/images/alex-notebook.png",
    emma: "./assets/images/emma-brooks.png",
    james: "./assets/images/james-miller.png",
    oliver: "./assets/images/oliver-grant.png",
    crimeScene: "./assets/images/museum-crime-scene.png",
    interrogationRoom: "./assets/images/interrogation-room.png",
    evidenceBoard: "./assets/images/evidence-board.png"
  };

  const startAssets = [paths.detectiveOffice, paths.alexStart];
  const preloadGroups = [
    [paths.emma, paths.james, paths.oliver],
    [paths.crimeScene],
    [paths.alexCompanion, paths.notebook],
    [paths.interrogationRoom, paths.evidenceBoard]
  ];
  const images = new Map();
  const requests = new Map();

  function loadImage(path) {
    if (requests.has(path)) return requests.get(path);

    const request = new Promise((resolve) => {
      if (typeof window.Image !== "function") {
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
        resolve(loaded);
      };
      const timeoutId = window.setTimeout(() => finish(false), 12000);
      image.onload = () => finish(true);
      image.onerror = () => finish(false);
      image.src = path;
      if (image.complete && image.naturalWidth > 0) finish(true);
    });

    requests.set(path, request);
    return request;
  }

  function preload(pathsToLoad, onProgress) {
    let completed = 0;
    if (onProgress) onProgress(0, pathsToLoad.length);
    return Promise.all(pathsToLoad.map((path) => loadImage(path).then((loaded) => {
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
      (sequence, group) => sequence.then(() => preload(group)),
      Promise.resolve()
    );
  }

  window.GameAssets = {
    paths,
    preloadStart,
    preloadRemaining,
    whenReady: loadImage
  };
})();
