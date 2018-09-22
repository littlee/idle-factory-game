import getScrolling from '../js/libs/phaserScroll.js';

window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');


class Game extends window.Phaser.State {
  create() {
    let wall = this.add.tileSprite(
      0,
      0,
      this.world.width,
      this.world.height * 3,
      'wall'
    );
    this.bgGroup = this.add.group();
    this.bgGroup.addChild(wall)

    this.panelGroup = this.add.group();
    this.panelGroup.visible = false;
    this.txtGroup = this.add.group();
    let panel = this.add.image(this.game.world.centerX, this.game.world.centerY, 'panel');
    panel.anchor.set(0.5, 0.5);

    let txt = this.add.image(this.game.world.centerX + 35, this.game.world.centerY - 30, 'txt');
    txt.anchor.set(0.5, 0);
    txt.mask = this.game.add.graphics();
    txt.mask.drawRect(txt.x - txt.width / 2, txt.y, txt.width, 360);
    this.txtGroup.addChild(txt);
    this.panelGroup.addChild(panel);
    this.panelGroup.addChild(this.txtGroup);

    getScrolling({
      targetToScroll: this.txtGroup,
      mask: {
        height: 360,
        width: txt.width
      },
      testMask: txt.mask
    })


    let icon = this.add.image(this.game.width, 100, 'iconEgg');
    icon.anchor.set(1, 0);
    icon.inputEnabled = true;
    icon.events.onInputDown.add(() => {
      console.log('egg is clicked');
      this.panelGroup.visible = this.panelGroup.visible === false ? true : false;
    })

    getScrolling({
      targetToScroll: this.bgGroup
    })


  }

  update() {
    // this.bg.tilePosition.y += 1;
  }

  render() {
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
  }
}

export default Game;
