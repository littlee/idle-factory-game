window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

/*
key:
-1- 定位: 居中于camera的view bounds, fixed to camera
-2- 有默认的宽高
-3- 默认可以scroll(暂时不做)
-4- 右上角有关闭按钮(关闭时候有动画效果)
-5- modal后面有veil，点击时候的behavior和关闭按钮一致
*/
const config = {
  HEIGHT: 935,
  WIDTH: 589,
  FRAME_RGB: 0xE1D6CC,
  FRAME_LINE_WIDTH: 2,
  FRAME_LINE_COLOR: 0x000000,
};

class ModalRaw extends window.Phaser.Group {
  // new Group(game [, parent] [, name] [, addToStage] [, enableBody] [, physicsBodyType])
  constructor({game, height = config.HEIGHT, width = config.WIDTH, scrollable = true}) {
    // params
    super(game);
    this.h = height;
    this.w = width;
    this.scrollable = scrollable;

    // shared
    this.cameraView = this.game.camera.view;
    this.worldCenterX = this.game.world.centerX;
    this.worldCenterY = this.game.world.centerY;

    // init
    this._getInit();

  }

  _getInit = () => {
    // init group 的 position & size
    this.x = (this.cameraView.width - this.w) / 2;
    this.y = (this.cameraView.height - this.h) / 2;
    console.log(`group pos: ${this.x} ${this.y}`);
    console.log(`size : ${this.width} ${this.height}`);
    console.log(`shoule be size : ${config.WIDTH} ${config.HEIGHT}`);
    // 画框+veil+按钮
    this.frame = this.game.add.graphics(0, 0, this); // graphics( [x] [, y] [, group])
    this.frame.beginFill(config.FRAME_RGB);
    this.frame.drawRect(0, 0, this.w, this.h);
    this.frame.endFill();
    // this.frame.lineStyle(config.FRAME_LINE_WIDTH, config.FRAME_LINE_COLOR);
    // this.frame.moveTo(this.x, this.y);
    // this.frame.lineTo(this.x + this.w, this.y);
  }

  // _handleClose = () => {

  // }

  // _increasePriority = () => {

  // }

  // _decreasePriorty = () => {

  // }

  exposeTheFrame = () => {
    return this.veil;
  }

}

export default ModalRaw;
