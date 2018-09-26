import Scroller from './Scroller.js';
window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

/*
key:
-1- 定位: 居中于camera的view bounds
-2- 有默认的宽高
-3- 默认可以scroll
-4- 右上角有关闭按钮(关闭时候有动画效果)
-5- modal后面有veil，点击时候的behavior和关闭按钮一致
-6- 这里的scroll不能设置mask，因为有veil，mask设置的话，veil就看不见了
-7- 所以，应该在这里放多一个sub-group, mask才能正确function
-8- group里头chidlren的priorityID要和Scroller的veil一样。否则veil收不到事件
-9- 应该有个heading, 和btnClose的水平位置差不多，这样滑动的时候，才不会有overlay btnClose的可能。[未实现]
-10- this.contentGroup里头的值，以及heading的尺寸和具体高度，要可以传入。[未实现]
-11- mask和Scroller的veil的尺寸的位置要更加heading的尺寸做相应的调整。[为实现]
-12- modal 的scroll里头的对象如果要有自己的input事件，需要设置priority > 1000
*/
const config = {
  HEIGHT: 935,
  WIDTH: 589,
  VEIL_RGB: 0x000000,
  VEIL_ALPHA: 0.5,
  FRAME_RGB: 0xE1D6CC,
  FRAME_LINE_WIDTH: 1,
  FRAME_LINE_COLOR: 0x000000,
  FRAME_LINE_ALPHA: 0.7,
};

const FONT_STYLE = {
  fontWeight: 'bold',
  fontSize: '48px',
  fill: '#3A0A00', // '#00FF00',
  boundsAlignH: 'center',
  boundsAlignV: 'middle',
};

class ModalRaw extends window.Phaser.Group {
  // new Group(game [, parent] [, name] [, addToStage] [, enableBody] [, physicsBodyType])
  constructor(game, headingTxt, height = config.HEIGHT, width = config.WIDTH, scrollable = true, cb, priority = 1000, headingH = 100) {
    // params
    super(game);
    this.h = height;
    this.w = width;
    this.scrollable = scrollable;
    this.priorityID = priority;
    this.headingTxt = headingTxt || '标题';
    this.headingH = headingH;

    // shortcuts
    this.cameraView = this.game.camera.view;
    // UI properties
    this.subGroup = this.game.make.group();
    this.contentGroup = this.game.make.group();
    this.scroller = null;
    this.x = 0;
    this.y = 0;

    // 方法
    this.getContextGroupInit = cb.bind(this) || null;

    // init
    this._getInit();
  }

  _getInit = () => {
    // init group 的 position & size: this.x this.y this.w this.h
    this.x = (this.cameraView.width - this.w) / 2;
    this.y = (this.cameraView.height - this.h) / 2;
    this.visible = false;

    this._createVeil();
    // this._createVeilTop(); // for bug fixing
    this._getSubGroupInit();

    // the display object in this group, from top down
    this.addChild(this.veil);
    this.addChild(this.subGroup);
    // this.addChild(this.veilTop); // for bug fixing

    // prep for input
    this.setAllChildren('inputEnabled', true);
    this.setAllChildren('input.priorityID', this.priorityID);
    this.btnClose.input.priorityID = this.priorityID + 1;

    // prep for scrolling, let the inherit class call this instead
    this._getScrollWhenNeeded();
  }

  _getSubGroupInit = () => {
    /* frame, heading, btn_close, mask for contentGroup */
    // this._setMask4SubGroup();

    // frame
    this.frame = this.game.make.graphics(0, 0); // graphics( [x] [, y] )
    this.frame.beginFill(config.FRAME_RGB);
    this.frame.drawRect(0, 0, this.w, this.h);
    this.frame.endFill();
    this.frame.lineStyle(config.FRAME_LINE_WIDTH, config.FRAME_LINE_COLOR, config.FRAME_LINE_ALPHA);
    this.frame.moveTo(0, 0);
    this.frame.lineTo(this.w, 0);
    this.frame.lineTo(this.w, this.h);
    this.frame.lineTo(0, this.h);
    this.frame.lineTo(0, 0);

    /* real content goes here */
    this._setMask4SubGroup();
    this.getContextGroupInit();

    // btn_close ...should be a sprite rather than img
    this.btnClose = this.game.make.button(this.w - 1, 0 + 1, 'btn_close', this._handleClose);
    this.btnClose.anchor.set(1, 0);

    this.heading = this.game.make.text(0, 0, this.headingTxt, FONT_STYLE);
    this.heading.setTextBounds(0, 0, this.w - this.btnClose.width, this.headingH);

    // the display object in the sub-group, from top down
    this.subGroup.addChild(this.frame);
    this.subGroup.addChild(this.contentGroup);
    this.subGroup.addChild(this.btnClose);
    this.subGroup.addChild(this.heading);
  }

  _createVeil = () => {
    // veil beginFill(color, alpha)
    let x = -this.x;
    let y = -this.y;
    let w = this.cameraView.width + this.x;
    let h = this.cameraView.height + this.y;

    this.veil = this.game.make.graphics(x, y);
    this.veil.fixedToCamera = true;
    this.veil.beginFill(config.VEIL_RGB, config.VEIL_ALPHA);
    this.veil.drawRect(x, y, w, h);
    this.veil.endFill();

    this.veil.inputEnabled = true;
    this.veil.events.onInputDown.add(this._handleClose);
  }

  // for improve, not use yet
  _createVeilTop = () => {
    let x = -this.x;
    let y = -this.y;
    let w = this.cameraView.width + this.x;
    let h = this.y;

    this.veilTop = this.game.make.graphics(x, y);
    this.veilTop.fixedToCamera = true;
    this.veilTop.beginFill(0xFF0000, 0.7);
    this.veilTop.drawRect(x, y, w, h);
    this.veilTop.endFill();

    this.veilTop.inputEnabled = true;
    this.veilTop.events.onInputDown.add(this._handleClose);
  }

  _handleClose = () => {
    console.log('close modal');
    this.visible = false;
  }

  _setMask4SubGroup = () => {
    let mask = this.game.add.graphics(0, 0, this.subGroup); // graphics( [x] [, y] [, group] )
    mask.beginFill(0xFF0000, 0.5);
    mask.drawRect(0, this.headingH, this.w, this.h - this.headingH);
    mask.endFill();
    this.contentGroup.mask = mask;
  }


  _getScrollWhenNeeded = () => {
    if (this.scrollable === false) return false;
    this.scroller = new Scroller({
      targetToScroll: this.contentGroup,
      priority: this.priorityID,
      mask: {
        width: this.w,
        height: this.h - this.headingH
      },
      heading: this.headingH,
      margin: 0,
    });
    this.scroller.enableScroll();
  }

  // try-out 在继承的类那里直接调用这个方法来添加内容
  getContextGroupInit = () => {
    // empty
  }


}

export default ModalRaw;
