/*
key：
-1- 调用的方式变成：new一个Scroll的实例，同时传入需要的参数
-2- 要enable手动scroll的话，invoke <instance>.enableScroll() 不需要参数
-3- 要enable滑动到指定target顶部的话，invoke <instance>.scrollToTop() 不需要参数
-4- 要enable滑动指定target到某个位置的话，invoke <instance>.scrollTo(<number>) 参数指定位置的px值
-5- 目前无法避免input被veil吃掉，所以，要scroll的group里头要实现input事件触发的话，需要开发者自行升级game object的priorityID值

todo:
bouncing写错，再来
*/

export default class Scroller {
  constructor({ mask = null, targetToScroll = null, direction = 'vertical', priority = 10, heading = 0, margin = 100 }) {
    // params
    this.mask = mask;
    this.targetToScroll = targetToScroll;
    this.direction = direction;

    // shared
    this.game = targetToScroll.game;
    this.cameraView = targetToScroll.game.camera.view;
    this.tween = this.game.add.tween(targetToScroll);
    this.axis = direction === 'vertical' ? 'y' : 'x';
    this.veil = null;
    this.veilPriorityID = priority;
    this.veilWidth = mask ? this.mask.width : 0;
    this.veilHeight = mask ? this.mask.height : 0;
    this.veilY = heading;
    // this.bounceDistance = 0;
    // this.bouncing = false;

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
      MARGIN: margin, // increase the value of max
      FACTOR: 0.7, // factor 0.6 is tweakable, fancy a 'heavy-scrolling-feel', reduce the value of factor.
      DELTA_STOP_THRESHOLD: 0.5, // when to stop auto-scrolling after release pointer
      DELTA_START_THRESHOLD: 5, // when to start scrolling when dragging
      TWEEN_DURATION: 400,
      // BOUNCE_DURATION: 200,
      // BOUNCE_THRESHOLD: 4,
      // BOUNCE_MARGIN: 105
    };
  }

  _touchScreen = (pointerGame, pointerObj) => {
    // if tweening is running, stop it
    if (this.tween.isRunning) {
      this.tween.stop(true);
    }
    let pointer = this.targetToScroll ? pointerObj : pointerGame;
    let initPos = pointer[this.axis];
    // console.log(`initPos: ${initPos}`);
    this.game.input.addMoveCallback(this._dragOnScreen);
    this._initializeDataBehavior(initPos);
    return false;
  };

  _initializeDataBehavior = initPos => {
    let targetSize, minosSize;
    clearInterval(this.ticker);
    // this.bounceDistance = 0;
    this.bouncing = false;
    this.pressed = true;
    this.lastY = initPos || 0;

    this.lastOffset = this.offset;
    this.vUsed = this.amplitude = 0;
    this.timestamp = Date.now();
    this.ticker = setInterval(this._trackVelocity, 100);

    this.min = 0;
    // 考虑 targetSize 可能 < 理论上的minosSize可能
    targetSize =
      this.direction === 'vertical'
        ? this.targetToScroll.height
        : this.targetToScroll.width;
    minosSize =
      this.direction === 'vertical'
        ? this.mask === null
          ? this.game.camera.view.height > targetSize
            ? targetSize
            : this.game.camera.view.height
          : this.mask.height > targetSize
            ? targetSize
            : this.mask.height
        : this.mask === null
          ? this.game.camera.view.width > targetSize
            ? targetSize
            : this.game.camera.view.width
          : this.mask.width > targetSize
            ? targetSize
            : this.mask.width;
    this.max =
      this.mask === null
        ? targetSize - minosSize
        : targetSize - minosSize + this.config.MARGIN;

    return true;
  };

  _trackVelocity = () => {
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

  _dragOnScreen = pointer => {
    // dont get in the way when tweening, not really works when the arrows are clicked, as this one invokes faster
    if (this.tween.isRunning) return false;
    let nowY, delta;
    if (this.pressed) {
      nowY = pointer[this.axis];
      delta = this.lastY - nowY; // lastY is the reference
      // this.bounceDistance += delta;
      if (delta > this.config.DELTA_START_THRESHOLD || delta < -this.config.DELTA_START_THRESHOLD) {
        // console.log(`drag delta: ${this.lastY} - ${nowY} = delta`);
        if (this.bouncing) return false;
        this.lastY = nowY;
        this._getScrolling(delta + this.offset);
      }
    }
    return false;
  };

  // not good
  _getBouncing = (bounceDistance) => {
    // `max` and `min` are the pos(x || y) of this.targetToScroll's extremities at this.axis
    let max = this.direction === 'vertical'
      ? -(this.targetToScroll.height - this.game.camera.view.height)
      : -(this.targetToScroll.width - this.game.camera.view.width);
    let min = this.min;
    let pos = this.targetToScroll[this.axis];
    if (pos > max && pos < min) return false; // pos is ranging from [-0, -this.targetToScroll.height]

    let end = pos === max ? max : min;
    if (this.pressed) {
      if (this.tween.isRunning === false) {
        this.tween = this.game.add.tween(this.targetToScroll);
        this.tween.to(
          {
            [this.axis]: -bounceDistance
          },
          this.config.BOUNCE_DURATION,
          Phaser.Easing.Quadratic.In,
          true,
          0,
          0,
          false
        );
      }

    } else if (!this.pressed) {
      console.log('bounce back');
      this.tween = this.game.add.tween(this.targetToScroll);
      this.tween.to(
        {
          [this.axis]: end
        },
        this.config.BOUNCE_DURATION,
        Phaser.Easing.Quadratic.Out,
        true,
        0,
        0,
        false
      );
    }
    return false;
  };


  _getScrolling = delta2scroll => {
    if (this.bouncing) return false;
    // console.log('scrolling');
    this.offset =
      delta2scroll > this.max
        ? this.max
        : delta2scroll < this.min
          ? this.min
          : delta2scroll;

    this.targetToScroll[this.axis] = -this.offset;
  };

  _releasePointer = () => {
    clearInterval(this.ticker);
    this.pressed = false;
    this.game.input.deleteMoveCallback(this._dragOnScreen);

    if (this.vUsed > this.config.AUTO_SCROLL_THRESHOLD || this.vUsed < -this.config.AUTO_SCROLL_THRESHOLD) {

      this.amplitude = Math.round(this.config.FACTOR * this.vUsed);
      this.target = Math.round(this.offset + this.amplitude);
      this.timestamp = Date.now();
      // requestAnimationFrame only schedules a single update to the script-based animation. If subsequent animation frames are needed, then requestAnimationFrame will need to be called again from within the callback.
      requestAnimationFrame(this._getAutoSlide);
    }

    return false;
  };

  _getAutoSlide = () => {
    let timeConstant = 325;
    let elapsed, delta;

    if (this.amplitude) {
      elapsed = Date.now() - this.timestamp;
      delta = -this.amplitude * Math.exp(-elapsed / timeConstant);
      if (delta > this.config.DELTA_STOP_THRESHOLD || delta < -this.config.DELTA_STOP_THRESHOLD) {
        this._getScrolling(this.target + delta);
        requestAnimationFrame(this._getAutoSlide);
      } else {
        this._getScrolling(this.target);
      }
    }
  };



  enableScroll = () => {
    // better off this way: attach events to a veil with the same size of the this.targetToScroll, as opposed to attach events to all children of the group
    let width = this.mask ? this.veilWidth : this.cameraView.width;
    let height = this.mask ? this.veilHeight : this.cameraView.height;

    // veil 定位在heading之下
    this.veil = this.game.make.graphics(0, this.veilY);
    this.veil.fixedToCamera = true;
    this.veil.beginFill(0x000000, 0.01);
    this.veil.drawRect(0, 0, width, height);
    this.veil.endFill();

    this.targetToScroll.parent.addChild(this.veil); // this.targetToScroll本身是scroll的，做不了fixed

    this.targetToScroll.setAllChildren('inputEnabled', true);

    this.veil.inputEnabled = true;
    this.veil.events.onInputDown.add(this._touchScreen);
    this.veil.events.onInputUp.add(this._releasePointer);
    this.veil.input.priorityID = this.veilPriorityID;

  };

  scrollToTop = () => {
    this.scrollTo(0);
  };

  scrollTo = pos => {
    // resolve the final pos from its valid range, assign to posSettled
    let posSettled =
      this.direction === 'vertical'
        ? pos > this.targetToScroll.height
          ? this.targetToScroll.height
          : pos
        : pos > this.targetToScroll.width
          ? this.targetToScroll.width
          : pos;

    // level up this.offset and this.lastOffset, and init important value
    this.offset = posSettled;
    this.lastOffset = this.offset;
    this.vUsed = this.amplitude = 0;

    // do the tweening
    if (!this.tween || this.tween.isRunning === false) {
      this.tween = this.game.add.tween(this.targetToScroll);
      this.tween.to(
        {
          [this.axis]: Number(posSettled) * (-1)
        },
        this.config.TWEEN_DURATION,
        Phaser.Easing.Default,
        true,
        0,
        0,
        false
      );
    }
  };
}
