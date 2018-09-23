window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

import BtnIdleCash from '../components/BtnIdleCash';
import BtnCash from '../components/BtnCash';
import BtnSuperCash from '../components/BtnSuperCash';

import WorkStation from '../components/WorkStation';

class Game extends window.Phaser.State {
  create() {
    this.wareHouseGround = this.add.graphics();
    this.wareHouseGround.beginFill(0x78fc82);
    this.wareHouseGround.drawRect(0, 0, this.world.width / 2, 674);
    this.wareHouseGround.endFill();

    this.marketGround = this.add.graphics();
    this.marketGround.beginFill(0xfc7b2d);
    this.marketGround.drawRect(this.world.centerX, 0, this.world.width / 2, 674);
    this.marketGround.endFill();

    this.exitGround = this.add.tileSprite(0, 674, this.world.width, 241, 'ground_level_0');

    let workStation = new WorkStation(this.game, 0, 915);


    this.wall = this.add.sprite(this.world.centerX, 81, 'wall');
    this.wall.anchor.setTo(0.5, 0);

    this.menuTop = this.add.graphics();
    this.menuTop.beginFill(0x282c30);
    this.menuTop.drawRect(0, 0, this.world.width, 81);
    this.menuTop.endFill();

    this.btnIdleCash = new BtnIdleCash(this.game, 0, 0);
    this.btnCash = new BtnCash(this.game, 186, 0);
    this.btnSuperCash = new BtnSuperCash(this.game, 186 * 2, 0);

    this.menuBottom = this.add.graphics();
    this.menuBottom.beginFill(0x282c30);
    this.menuBottom.drawRect(0, this.world.height - 81, this.world.width, 81);
    this.menuBottom.endFill();
  }
}

export default Game;
