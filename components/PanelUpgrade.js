function getFontStyle (fSize, color, align, weight) {
  return {
    fontWeight: weight || 'normal',
    fontSize: fSize || '28px',
    fill: color || 'white', // '#00FF00',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'center'
  };
}

/*
key:
-1- 点击升级级数按钮，panel里头的items会发生相应的变化，记住当前选中的升级级数
NOTE: 被toggle inputEnabled之后的object的priorityID会变成0.

 */
class PanelUpgrade extends window.Phaser.Group {
  constructor({ game, parent, veilHeight, levelType }) {
    super(game, parent);
    this.veilHeight = veilHeight;
    this.propsCoin = this.game.share.coin;
    this.levelType = levelType;
    this.base = 100;

    this._getInit();
    this._handleInput();
  }

  _getInit = () => {
    this.bg = this.game.make.graphics(0, 0);
    this.bg.beginFill(0x000000, 0.1);
    this.bg.drawRect(0, 0, 290, 85);
    this.bg.endFill();
    this.bg.alignTo(this.parent, Phaser.TOP_LEFT, -30, -this.veilHeight - 75);

    this.one = this.game.make.text(0, 0, 'x1', getFontStyle());
    this.one.setTextBounds(0, 0, 72, 85);
    this.one.alignTo(this.bg, Phaser.TOP_LEFT, 72 * 0, -40);
    this.btnOne = this.game.make.image(0, 0, 'btn_pick_upgrade');
    this.btnOne.alignTo(this.bg, Phaser.TOP_LEFT, 1, -90);
    this.btnOne.alpha = 1;

    this.ten = this.game.make.text(0, 0, 'x10', getFontStyle());
    this.ten.setTextBounds(0, 0, 72, 85);
    this.ten.alignTo(this.bg, Phaser.TOP_LEFT, -72 * 1, -40);
    this.btnTen = this.game.make.image(0, 0, 'btn_pick_upgrade');
    this.btnTen.alignTo(this.bg, Phaser.TOP_LEFT, -2 - 72, -90);
    this.btnTen.alpha = 0;

    this.fifth = this.game.make.text(0, 0, 'x50', getFontStyle());
    this.fifth.setTextBounds(0, 0, 72, 85);
    this.fifth.alignTo(this.bg, Phaser.TOP_LEFT, -72 * 2, -40);
    this.btnFifth = this.game.make.image(0, 0, 'btn_pick_upgrade');
    this.btnFifth.alignTo(this.bg, Phaser.TOP_LEFT, -2 - 72 * 2, -90);
    this.btnFifth.alpha = 0;

    this.max = this.game.make.text(0, 0, '最高', getFontStyle());
    this.fifth.setTextBounds(0, 0, 72, 85);
    this.max.alignTo(this.bg, Phaser.TOP_LEFT, -74 * 3, -63);
    this.btnMax = this.game.make.image(0, 0, 'btn_pick_upgrade');
    this.btnMax.alignTo(this.bg, Phaser.TOP_LEFT, -2 - 72 * 3, -90);
    this.btnMax.alpha = 0;

    // 确定升级按钮
    this.btnUpgradeGroup = this.game.make.group();
    this.btnUpgrade = this.game.make.image(0, 0, 'btn_level_upgrade');
    this.btnUpgrade.alignTo(this.bg, Phaser.RIGHT_BOTTOM, 75);
    this.txtUpgradeCoinNeeded = this.game.make.text(0, 0, this.base.toString(), getFontStyle('24px', 'white', 'center', 'normal'));
    this.txtUpgradeCoinNeeded.alignTo(this.bg, Phaser.RIGHT_TOP, 140, -5);
    this.btnUpgradeGroup.addChild(this.btnUpgrade);
    this.btnUpgradeGroup.addChild(this.txtUpgradeCoinNeeded);
    this.btnUpgradeGroup.onChildInputDown.add(() => {
      this.game.share[this.levelType].level += this.game.share[this.levelType].multiplier;
      this.game.share.coin -= Number(this.txtUpgradeCoinNeeded.text);
    });

    // 66 89
    this.addChild(this.bg);
    this.addChild(this.btnOne);
    this.addChild(this.one);
    this.addChild(this.btnTen);
    this.addChild(this.ten);
    this.addChild(this.btnFifth);
    this.addChild(this.fifth);
    this.addChild(this.btnMax);
    this.addChild(this.max);
    this.addChild(this.btnUpgradeGroup);
  }

  _handleInput = () => {
    // UI变化，items描述变化，记录当前选中升级级数
    let tmp = [
      {key: 'btnOne', txt: 'one', num: 1},
      {key: 'btnTen', txt: 'ten', num: 10},
      {key: 'btnFifth', txt: 'fifth', num: 50},
      {key: 'btnMax', txt: 'max', num: NaN}
    ];
    tmp.forEach(
      (item, index) => {
        this[item.key].events.onInputDown.add(() => {
          let curr = item.key;
          this.game.share[this.levelType].multiplier = item.num;
          this[item.key].alpha = 1;
          tmp.forEach(
            (entry) => {
              if (entry.key === curr) return;
              this[entry.key].alpha = 0;
            }
          );
          this._updateBtnUpgradePanel(this.game.share[this.levelType].multiplier);
        });
        this[item.txt].events.onInputDown.add(() => {
          let curr = item.key;
          this.game.share[this.levelType].multiplier = item.num;
          this[item.key].alpha = 1;
          tmp.forEach(
            (entry) => {
              if (entry.key === curr) return;
              this[entry.key].alpha = 0;
            }
          );
          this._updateBtnUpgradePanel(this.game.share[this.levelType].multiplier);
        });
      }
    );
  }

  _updateBtnUpgradePanel = (multiplier) => {
    let map = {
      '1': 1,
      '10': 9.5,
      '50': 45,
    };
    if (Object.is(multiplier, NaN)) {
      console.log('max 选中。。。未实现');
      // 要根据当前game的coin去计算可以升的最高级别，然后除了要改变升级要用的coin之外，能升多少级也要显示
    } else {
      let tmp = this.base * map[multiplier.toString()];
      this.txtUpgradeCoinNeeded.setText(tmp.toString());
    }
  }

  updateLevelUpgradeBtnUI = () => {
    // 判断当前coin是不是 > UI上显示的数字，是：绿；否：灰
    // setTexture(texture [, destroy])
    let parsedCoin = parseFloat(this.game.share.coin);
    let parsedNeeded = parseFloat(this.txtUpgradeCoinNeeded.text);
    if (Object.is(parsedCoin, NaN) || Object.is(parsedNeeded, NaN)) {
      throw new Error('updateLevelUpgradeBtnUI() 的操作数应该都是valid string');
    }
    if ( parsedCoin < parsedNeeded) {
      this.btnUpgrade.loadTexture('btn_level_upgrade_unable');
      this.btnUpgradeGroup.setAllChildren('inputEnabled', false);
    } else {
      // console.log('可以买');
      this.btnUpgrade.loadTexture('btn_level_upgrade');
      this.btnUpgradeGroup.setAllChildren('inputEnabled', true);
      this.btnUpgradeGroup.setAllChildren('input.priorityID', 1000 + 1);
    }
    return true;

  }


}

export default PanelUpgrade;
