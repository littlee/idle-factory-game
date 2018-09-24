window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

/*
key:
-1- 定位: 居中于camera的view bounds
-2- 有默认的宽高
-3- 默认可以scroll(暂时不做)
-4- 右上角有关闭按钮(关闭时候有动画效果)
-5- modal后面有veil，点击时候的behavior和关闭按钮一致
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

class ModalRaw extends window.Phaser.Group {
  // new Group(game [, parent] [, name] [, addToStage] [, enableBody] [, physicsBodyType])
  constructor({game, height = config.HEIGHT, width = config.WIDTH, /* scrollable = true, */ priority = 10}) {
    // params
    super(game);
    this.h = height;
    this.w = width;
    // this.scrollable = scrollable;
    this.priority = priority;

    // shared
    this.cameraView = this.game.camera.view;
    this.worldCenterX = this.game.world.centerX;
    this.worldCenterY = this.game.world.centerY;

    // init
    this._getInit();

  }

  _getInit = () => {
    // init group 的 position & size: this.x this.y this.w this.h
    this.x = (this.cameraView.width - this.w) / 2;
    this.y = (this.cameraView.height - this.h) / 2;

    this._drawVeilnAdd2World();

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

    // btn_close ...should be a sprite rather than img
    this.btnClose = this.game.make.button(this.w - 1, 0 + 1, 'btn_close', this._handleClose);
    this.btnClose.anchor.set(1, 0);

    // the display object in this group, from top down
    this.addChild(this.veil);
    this.addChild(this.frame);
    this.addChild(this.btnClose);

    // prep for input
    this.setAllChildren('inputEnabled', true);
    this.setAllChildren('input.priorityID', this.priority);

  }

  _drawVeilnAdd2World = () => {
    // veil beginFill(color, alpha)
    let x = -this.x;
    let y = -this.y;
    let w = this.cameraView.width + this.x;
    let h = this.cameraView.height + this.y;

    this.veil = this.game.make.graphics(x, y);
    this.veil.beginFill(config.VEIL_RGB, config.VEIL_ALPHA);
    this.veil.drawRect(x, y, w, h);
    this.veil.endFill();

    this.veil.fixedToCamera = true;
    this.veil.inputEnabled = true;
    this.veil.events.onInputDown.add(this._handleClose);
  }

  _handleClose = () => {
    console.log('close modal');
    this.visible = false;
  }

}

export default ModalRaw;
