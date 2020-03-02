const SCROLL_BOCKING_RESET_DELAY = 15;
let currentTimeoutId = null;
let releaseTimer = null;

function run(deltaScrollTop, { syncScrollTop, releaseEventBlock }) {
  clearTimeout(releaseTimer);

  syncScrollTop(deltaScrollTop);

  releaseTimer = setTimeout(() => {
    releaseEventBlock();
  }, SCROLL_BOCKING_RESET_DELAY);
}

export function animate(sourceScrollTop, targetScrollTop, stepCB) {
  const diff = targetScrollTop - sourceScrollTop;
  const startTime = Date.now();

  /**
   * Each animation step
   */
  const step = () => {
    const stepTime = Date.now();
    const progress = (stepTime - startTime) / 200; // 200 is animation time
    let deltaValue;

    // if already doing animation
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }

    if (progress < 1) {
      deltaValue = sourceScrollTop + diff * Math.cos(((1 - progress) * Math.PI) / 2);
      run(Math.ceil(deltaValue), stepCB);
      currentTimeoutId = setTimeout(step, 1);
    } else {
      run(targetScrollTop, stepCB);
      currentTimeoutId = null;
    }
  };

  step();
}
