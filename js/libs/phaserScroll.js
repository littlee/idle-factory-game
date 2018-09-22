/*
问题遗留：
-1- 弹窗出来之后，背景依然可以被scroll
-2- 弹窗可以被scroll的区域不是mask的部分，而是最长的那个display object
*/
export default (
  {
    mask = null, // 一个对象 {height: xx, width: xx}
    direction = 'vertical',
    targetToScroll = null, // should be a group
  }
) => {
  let pressed,
      lastY, // 相对release时候的y，比较得出要不要惯性滑动
      lastOffset = 0,
      offset = 0,
      vUsed, // 缓和过的，将被用来作为惯性滑动initial value的速度
      amplitude,
      timestamp,
      ticker,
      delta,
      // new
      max,
      target,
      min,
      margin = 100;

  function touchScreen(pointerGame, pointerObj) {
    let pointer = targetToScroll ? pointerObj : pointerGame;
    let initPos = direction === 'vertical' ? pointer.y : pointer.x;
    initializeDataBehavior(initPos);
    return false;
  }

  function initializeDataBehavior(initPos) {
    let targetSize, minosSize;
    pressed = true;
    lastY = initPos;

    vUsed = amplitude = 0;
    timestamp = Date.now();
    ticker = setInterval(trackVelocity, 100);

    min = 0;
    targetSize = direction === 'vertical' ? targetToScroll.height : targetToScroll.width;
    minosSize = direction === 'vertical'
      ? mask === null ? targetToScroll.game.camera.view.height : mask.height
      : mask === null ? targetToScroll.game.camera.view.width : mask.width;
    max = mask === null ? targetSize - minosSize : targetSize - minosSize + margin;
    return true
  }

  function trackVelocity() {
    // trace and update vUsed every 100ms
    let now, elapsed, vReal, delta;
    if (!pressed) return false;

    now = Date.now();
    elapsed = now - timestamp;
    delta = offset - lastOffset;
    lastOffset = offset;
    timestamp = now;

    vReal = (1000 * delta) / (1 + elapsed);
    vUsed = 0.8 * vReal + 0.2 * vUsed;
  }

  function dragOnScreen(pointer) {
    let nowY, delta;
    if (pressed) {
      let nowY = direction === 'vertical' ? pointer.y : pointer.x;
      delta = lastY - nowY; // lastY is the reference
      if (delta > 2 || delta < -2) {
        lastY = nowY;

        getScrolling(delta + offset);
      }
    }
    return false;
  }

  function getScrolling(delta2scroll) {
    offset = (delta2scroll > max) ? max : (delta2scroll < min) ? min : delta2scroll;
    if (direction === 'vertical') {
      targetToScroll.y = -offset;
    } else {
      targetToScroll.x = -offset;
    }
  }

  function releasePointer() {
    clearInterval(ticker);
    pressed = false;

    if (vUsed > 10 || vUsed < -10) {
      // factor 0.1 is tweakable, fancy a 'heavy-scrolling-feel', reduce the value of factor.
      amplitude = Math.round(0.3 * vUsed);
      target = Math.round(offset + amplitude);
      timestamp = Date.now();
      // requestAnimationFrame only schedules a single update to the script-based animation. If subsequent animation frames are needed, then requestAnimationFrame will need to be called again from within the callback.
      requestAnimationFrame(getAutoSlide);
    }
    return false;
  }

  function getAutoSlide() {
    let timeConstant = 325;
    let elapsed, delta;

    if (amplitude) {
      elapsed = Date.now() - timestamp;
      delta = -amplitude * Math.exp(-elapsed / timeConstant);
      if (delta > 0.5 || delta < -0.5) {
        getScrolling(target + delta);
        requestAnimationFrame(getAutoSlide);
      } else {
        getScrolling(target);
      }
    }
  }
  targetToScroll.game.input.addMoveCallback(dragOnScreen);
  targetToScroll.setAllChildren('inputEnabled', true);
  targetToScroll.onChildInputDown.add(touchScreen);
  targetToScroll.onChildInputUp.add(releasePointer);


};
