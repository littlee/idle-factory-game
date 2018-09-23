/*
key：
-1- 调用的方式变成：new一个Scroll的实例，同时传入需要的参数
-2- 要enable手动scroll的话，invoke <instance>.enableScroll() 不需要参数
-3- 要enable滑动到指定target顶部的话，invoke <instance>.scrollToTop() 不需要参数
-4- 要enable滑动指定target到某个位置的话，invoke <instance>.scrollTo(<number>) 参数指定位置的px值

todo:
增加boucing的效果
*/

export default class Scroller {
  constructor({ mask = null, targetToScroll = null, direction = 'vertical' }) {
    // params
    this.mask = mask;
    this.targetToScroll = targetToScroll;
    this.direction = direction;

    // shared
    this.lastOffset = 0;
    this.offset = 0;
    this.target = 0;
    this.pressed = false;
    this.ticker = null;
    this.lastY = 0; // 相对release时候的y，比较得出要不要惯性滑动
    this.vUsed = 0; // 缓和过的，将被用来作为惯性滑动initial value的速度
    this.amplitude = 0;
    this.timestamp = 0;
    this.max = 0;
    this.min = 0;
    this.config = {
      AUTO_SCROLL_THRESHOLD: 4,
      MARGIN: 100, // increase the value of max
      FACTOR: 0.7, // factor 0.6 is tweakable, fancy a 'heavy-scrolling-feel', reduce the value of factor.
      DELTA_STOP_THRESHOLD: 0.5, // when to stop auto-scrolling after release pointer
      DELTA_START_THRESHOLD: 2, // when to start scrolling when dragging
    };
  }

  touchScreen = (pointerGame, pointerObj) => {
    let pointer = this.targetToScroll ? pointerObj : pointerGame;
    let initPos = this.direction === 'vertical' ? pointer.y : pointer.x;
    this.initializeDataBehavior(initPos);
    return false;
  };

  initializeDataBehavior = initPos => {
    let targetSize, minosSize;
    clearInterval(this.ticker);
    this.pressed = true;
    this.lastY = initPos;

    this.lastOffset = this.offset;
    this.vUsed = this.amplitude = 0;
    this.timestamp = Date.now();
    this.ticker = setInterval(this.trackVelocity, 100);

    this.min = 0;
    targetSize =
      this.direction === 'vertical'
        ? this.targetToScroll.height
        : this.targetToScroll.width;
    minosSize =
      this.direction === 'vertical'
        ? this.mask === null
          ? this.targetToScroll.game.camera.view.height
          : this.mask.height
        : this.mask === null
          ? this.targetToScroll.game.camera.view.width
          : this.mask.width;
    this.max =
      this.mask === null
        ? targetSize - minosSize
        : targetSize - minosSize + this.config.MARGIN;
    return true;
  };

  trackVelocity = () => {
    // trace and update vUsed every 100ms
    let now, elapsed, vReal, delta;
    if (!this.pressed) return false;

    now = Date.now();
    elapsed = now - this.timestamp;
    delta = this.offset - this.lastOffset;
    this.lastOffset = this.offset;
    this.timestamp = now;

    vReal = (1000 * delta) / (1 + elapsed);
    this.vUsed = 0.8 * vReal + 0.2 * this.vUsed;
  };

  dragOnScreen = pointer => {
    let nowY, delta;
    if (this.pressed) {
      nowY = this.direction === 'vertical' ? pointer.y : pointer.x;
      delta = this.lastY - nowY; // lastY is the reference
      if (delta > this.config.DELTA_START_THRESHOLD || delta < -this.config.DELTA_START_THRESHOLD) {
        this.lastY = nowY;
        this.getScrolling(delta + this.offset);
      }
    }
    return false;
  };

  getScrolling = delta2scroll => {
    this.offset =
      delta2scroll > this.max
        ? this.max
        : delta2scroll < this.min
          ? this.min
          : delta2scroll;
    if (this.direction === 'vertical') {
      this.targetToScroll.y = -this.offset;
    } else {
      this.targetToScroll.x = -this.offset;
    }
  };

  releasePointer = () => {
    clearInterval(this.ticker);
    this.pressed = false;

    if (this.vUsed > this.config.AUTO_SCROLL_THRESHOLD || this.vUsed < -this.config.AUTO_SCROLL_THRESHOLD) {

      this.amplitude = Math.round(this.config.FACTOR * this.vUsed);
      this.target = Math.round(this.offset + this.amplitude);
      this.timestamp = Date.now();
      // requestAnimationFrame only schedules a single update to the script-based animation. If subsequent animation frames are needed, then requestAnimationFrame will need to be called again from within the callback.
      requestAnimationFrame(this.getAutoSlide);
    }
    return false;
  };

  getAutoSlide = () => {
    let timeConstant = 325;
    let elapsed, delta;

    if (this.amplitude) {
      elapsed = Date.now() - this.timestamp;
      delta = -this.amplitude * Math.exp(-elapsed / timeConstant);
      if (delta > this.config.DELTA_STOP_THRESHOLD || delta < -this.config.DELTA_STOP_THRESHOLD) {
        this.getScrolling(this.target + delta);
        requestAnimationFrame(this.getAutoSlide);
      } else {
        this.getScrolling(this.target);
      }
    }
  };

  enableScroll = () => {
    this.targetToScroll.game.input.addMoveCallback(this.dragOnScreen);
    this.targetToScroll.setAllChildren('inputEnabled', true);
    this.targetToScroll.onChildInputDown.add(this.touchScreen);
    this.targetToScroll.onChildInputUp.add(this.releasePointer);
  };

  scrollToTop = () => {
    this.scrollTo(0);
  };

  scrollTo = pos => {
    // stop the manual scrolling
    let posSettled =
      this.direction === 'vertical'
        ? pos > this.targetToScroll.height
          ? this.targetToScroll.height
          : pos
        : pos > this.targetToScroll.width
          ? this.targetToScroll.width
          : pos;
    let axis = this.direction === 'vertical' ? 'y' : 'x';

    this.offset = posSettled;
    this.initializeDataBehavior();

    // do the tweening
    let game = this.targetToScroll.game;
    let tween = game.add.tween(this.targetToScroll);
    tween.to(
      {
        [axis]: -pos
      },
      500,
      Phaser.Easing.Default,
      true,
      0
    );
  };
}
