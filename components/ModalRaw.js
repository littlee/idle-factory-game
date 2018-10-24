import Scroller from './Scroller.js';

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
-10- this.contentGroup里头的值，以及heading的尺寸和具体高度，要可以传入。
-11- mask和Scroller的veil的尺寸的位置要更加heading的尺寸做相应的调整。
-12- modal 的scroll里头的对象如果要有自己的input事件，需要设置priority > 1000[在ModalRaw这里已经统一enable了所有的children的input和设置了对的priorityID]
*/
const CONFIG = {
  height: 935,
  width: 589,
  veil_rgb: 0x000000,
  veil_alpha: 0.5,
  veil_part_alpha: 0.01, // 0.01
  frame_rgb: 0xe1d6cc,
  frame_line_width: 1,
  frame_line_color: 0x000000,
  frame_line_alpha: 0.7,
  subheading: '升级你的产品从而提升销售价值，赚更多的钱'
};

const FONT_STYLE = {
  fontWeight: 'bold',
  fontSize: '48px',
  fill: '#3A0A00', // '#00FF00',
  boundsAlignH: 'center',
  boundsAlignV: 'middle'
};

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'normal',
    fontSize: fSize || '18px',
    fill: color || '#3A0A00', // '#00FF00',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'center'
  };
}

class ModalRaw extends window.Phaser.Group {
  // new Group(game [, parent] [, name] [, addToStage] [, enableBody] [, physicsBodyType])
  constructor(
    game,
    headingTxt,
    height = CONFIG.height,
    width = CONFIG.width,
    scrollable = true,
    headingStyles = {},
    priority = 1000,
    headingH = 100,
    subHeading = false,
    boost = true,
    contentMargin = 0
  ) {
    // params
    super(game);
    this.h = height;
    this.w = width;
    this.boost = boost;
    this.margin = contentMargin;
    this.scrollable = scrollable;
    this.priorityID = priority;
    this.headingTxt = headingTxt || '';
    this.headingH = headingH;
    this.headingStyles = Object.assign({}, FONT_STYLE, headingStyles);
    this.subHeadingTxt = subHeading ? CONFIG.subHeading : '';

    // shortcuts
    this.cameraView = this.game.camera.view;
    // UI properties
    this.subGroup = this.game.make.group();
    this.contentGroup = this.game.make.group();
    this.scroller = null;
    this.x = 0;
    this.y = 0;
  }

  _positionModal = () => {
    // init group 的 position & size: this.x this.y this.w this.h
    this.x = (this.cameraView.width - this.w) / 2;
    this.y = (this.cameraView.height - this.h) / 2;
    this.visible = false;
  };

  _createOuterVeil = () => {
    // veil beginFill(color, alpha)
    let x = -this.x;
    let y = -this.y;
    let w = this.cameraView.width + this.x;
    let h = this.cameraView.height + this.y;

    this.veil = this.game.make.graphics(x, y);
    this.veil.fixedToCamera = true;
    this.veil.beginFill(CONFIG.veil_rgb, CONFIG.veil_alpha);
    this.veil.drawRect(x, y, w, h);
    this.veil.endFill();

    this.veil.events.onInputDown.add(this._handleClose);
  };

  // how inherited class should be inited
  _getInit = () => {
    this._prepBeforeContentGroup();
    /* real content goes here */
    this._getContextGroupInit();
    // add frame, contentGroup, heading, btn to subGroup
    this._prepAfterContentGroup();
  };

  _prepBeforeContentGroup = () => {
    this._positionModal();
    this._createOuterVeil();
    // frame, btn, heading
    this._drawSubGroupStuff();
    // mask for contentGroup
    this._setMask4ContentGroup();
  }

  _prepAfterContentGroup = () => {
    // add frame, contentGroup, heading, btn to subGroup
    this._addStuff2SubGroup();
    // draw veil parts
    this._createVeilTop();
    this._createVeilDown();
    // add outerveil, subGroup, veilparts to modal
    this._addStuff2Modal();
    // make sure children object inside have higher priority then scroller's veil
    this._boostInputPriority4Children();
    // prep for scrolling, should be called after contentGroup is all set
    this._getScrollWhenNeeded();
  }

  _boostInputPriority4Children = () => {
    // prep for input
    if (this.boost) {
      // bug-prone but won't show when modal cannot be scrolled
      this.setAllChildren('inputEnabled', true);
      this.setAllChildren('input.priorityID', this.priorityID + 1);
    } else {
      this.btnClose.inputEnabled = true;
      this.btnClose.input.priorityID = this.priorityID + 1;
      this.frame.inputEnabled = true;
      this.frame.input.priorityID = this.priorityID; // scroller是1000
      this.veilTop.inputEnabled = true;
      this.veilTop.input.priorityID = this.priorityID + 1; // 主页背景最多是999，这里 +1 可有可无
      this.veilDown.inputEnabled = true;
      this.veilDown.input.priorityID = this.priorityID + 1; // 同上
      this.veil.inputEnabled = true;
      this.veil.input.priorityID = this.priorityID; // z-index在frame之下，不会被触发
    }
  };

  _drawSubGroupStuff = () => {
    /* frame, heading, btn_close*/
    // frame
    this.frame = this.game.make.graphics(0, 0); // graphics( [x] [, y] )
    this.frame.beginFill(CONFIG.frame_rgb);
    this.frame.drawRect(0, 0, this.w, this.h);
    this.frame.endFill();
    this.frame.lineStyle(
      CONFIG.frame_line_width,
      CONFIG.frame_line_color,
      CONFIG.frame_line_alpha
    );
    this.frame.moveTo(0, 0);
    this.frame.lineTo(this.w, 0);
    this.frame.lineTo(this.w, this.h);
    this.frame.lineTo(0, this.h);
    this.frame.lineTo(0, 0);

    // btn_close ...should be a sprite rather than img
    this.btnClose = this.game.make.button(
      this.w - 1,
      0 + 1,
      'btn_close',
      this._handleClose
    );
    this.btnClose.anchor.set(1, 0);

    if (
      typeof this.subHeadingTxt === 'string' &&
      this.subHeadingTxt.length > 0
    ) {
      // 20 写死的，subHeading bound的 高度
      this.heading = this.game.make.text(
        0,
        0,
        this.headingTxt,
        this.headingStyles
      );
      this.heading.setTextBounds(
        0,
        0,
        this.w - this.btnClose.width,
        this.headingH - 20
      );
      this.subHeading = this.game.make.text(
        0,
        0,
        this.subHeadingTxt,
        getFontStyle()
      );
      this.subHeading.setTextBounds(
        0,
        this.headingH - 20 * 2,
        this.w - this.btnClose.width,
        20
      );
    } else {
      this.heading = this.game.make.text(
        0,
        0,
        this.headingTxt,
        this.headingStyles
      );
      this.heading.setTextBounds(
        0,
        0,
        this.w - this.btnClose.width,
        this.headingH
      );
    }
  };

  _addStuff2SubGroup = () => {
    // the display object in the sub-group, from top down
    this.subGroup.addChild(this.frame);
    this.subGroup.addChild(this.contentGroup);
    this.subGroup.addChild(this.btnClose);
    this.subGroup.addChild(this.heading);
    if (this.subHeading !== undefined) {
      this.subGroup.addChild(this.subHeading);
    }
  };

  _addStuff2Modal = () => {
    // the display object in this group, from top down
    this.addChild(this.veil);
    this.addChild(this.subGroup);
    this.addChild(this.veilTop);
    this.addChild(this.veilDown);
  };

  // for improve, not use yet
  _createVeilTop = () => {
    let x = 0;
    let y = -this.y / 2;
    let w = this.w;
    let h = this.y;

    this.veilTop = this.game.make.graphics(x, y);
    this.veilTop.fixedToCamera = true;
    this.veilTop.beginFill(CONFIG.veil_rgb, CONFIG.veil_part_alpha);
    this.veilTop.drawRect(x, y, w, h);
    this.veilTop.endFill();

    this.veilTop.events.onInputDown.add(this._handleClose);;
  };

  _createVeilDown = () => {
    let x = 0;
    let y = this.h / 2;
    let w = this.w;
    let h = this.y;

    this.veilDown = this.game.make.graphics(x, y);
    this.veilDown.fixedToCamera = true;
    this.veilDown.beginFill(CONFIG.veil_rgb, CONFIG.veil_part_alpha);
    this.veilDown.drawRect(x, y, w, h);
    this.veilDown.endFill();

    this.veilDown.events.onInputDown.add(this._handleClose);
  }

  _handleClose = () => {
    // console.log('close modal');
    this.visible = false;
  };

  _setMask4ContentGroup = () => {
    let mask = this.game.add.graphics(0, 0, this.subGroup); // graphics( [x] [, y] [, group] )
    mask.beginFill(0xff0000, 0.5);
    mask.drawRect(0, this.headingH, this.w, this.h - this.headingH);
    mask.endFill();
    this.contentGroup.mask = mask;
  };

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
      margin: this.margin
    });
    this.scroller.enableScroll();
  };

  _getContextGroupInit = () => {
    /*empty
    添加的东西 y 要 >= this.headingH
    const OFFSET = this.headingH;*/
  };
}

export default ModalRaw;
