import ModalRaw from './ModalRaw.js';

window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

// let const = {};
function fn () {
  console.log('lala');
}

class ModalLevel extends ModalRaw {
  constructor({game, headingTxt, scrollable, cb=fn}) {
    // parems
    super(game, headingTxt, undefined, undefined, scrollable, cb);
    this.data = 'data';
    // this.test = this._test;

    this.test();
  }

  _handleUpgrade = () => {
    console.log('可以。。。');
  }

  getContextGroupInit = () => {
    // 添加的东西 y 要 >= this.headingH
    console.log('执行？');
    this.test = this.game.make.graphics(0, 0); // graphics( [x] [, y] )
    this.test.beginFill(0xFF0000);
    this.test.drawRect(80, this.headingH + 20, this.w - 160, this.h);
    this.test.endFill();
    this.test1 = this.game.make.graphics(0, 0); // graphics( [x] [, y] )
    this.test1.beginFill(0x00FF00);
    this.test1.drawRect(80, this.headingH + 20 + this.h, this.w - 160, this.h);
    this.test1.endFill();
    this.test2 = this.game.make.graphics(0, 0); // graphics( [x] [, y] )
    this.test2.beginFill(0x0000FF);
    this.test2.drawRect(80, this.headingH + 20 + this.h * 2, this.w - 160, this.h);
    this.test2.endFill();
    this.contentGroup.addChild(this.test);
    this.contentGroup.addChild(this.test1);
    this.contentGroup.addChild(this.test2);
  }
}

export default ModalLevel;
