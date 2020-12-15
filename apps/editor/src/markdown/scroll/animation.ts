import { SyncCallbackObj } from './scrollSync';

type WinSetTimeout = typeof window.setTimeout;

const ANIMATION_TIME = 100;
const SCROLL_BOCKING_RESET_DELAY = 15;
let currentTimeoutId: number | null = null;
let releaseTimer: number | null = null;

function run(deltaScrollTop: number, { syncScrollTop, releaseEventBlock }: SyncCallbackObj) {
  if (releaseTimer) {
    clearTimeout(releaseTimer);
  }

  syncScrollTop(deltaScrollTop);

  releaseTimer = (setTimeout as WinSetTimeout)(() => {
    releaseEventBlock();
  }, SCROLL_BOCKING_RESET_DELAY);
}

export function animate(
  curScrollTop: number,
  targetScrollTop: number,
  syncCallbackObj: SyncCallbackObj
) {
  const diff = targetScrollTop - curScrollTop;
  const startTime = Date.now();

  const step = () => {
    const stepTime = Date.now();
    const progress = (stepTime - startTime) / ANIMATION_TIME;
    let deltaValue;

    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }

    if (progress < 1) {
      deltaValue = curScrollTop + diff * Math.cos(((1 - progress) * Math.PI) / 2);
      run(Math.ceil(deltaValue), syncCallbackObj);
      currentTimeoutId = (setTimeout as WinSetTimeout)(step, 1);
    } else {
      run(targetScrollTop, syncCallbackObj);
      currentTimeoutId = null;
    }
  };

  step();
}
