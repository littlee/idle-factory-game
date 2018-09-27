const CONFIG = {
  width: 537,
  height: 85,
  subWidth: 146, // the right block
  subHeight: 85,
  bgColor: 0x000000,
  bgAlpha: 0.1,
  subColor: 0x3A0A00,
  subAlpha: 0.8
};

function getFontStyle (fSize, color, align, weight) {
  return {
    fontWeight: weight || 'bold',
    fontSize: fSize,
    fill: color || '#3A0A00', // '#00FF00',
    boundsAlignH: 'center',
    boundsAlignV: 'middle',
    align: align || 'left'
  };
}

class UpgradeItem extends window.Phaser.Group {

  constructor({game, parent, key, txt, x, y, currTxt, futureTxt}) {
    super(game, parent);
    this.key = key;
    this.txt = txt;
    this.posX = x;
    this.posY = y;
    this.plainTxtCurr = currTxt;
    this.plainTxtFuture = futureTxt;

    this._getInit();
  }

  _getInit = () => {
    this.x = this.posX;
    this.y = this.posY;

    this.bg = this.game.make.graphics(0, 0);
    this.bg.beginFill(CONFIG.bgColor, CONFIG.bgAlpha);
    this.bg.drawRect(0, 0, CONFIG.width, CONFIG.height);
    this.bg.endFill();

    this.icon = this.game.make.image(0, CONFIG.height / 2, this.key);
    this.icon.anchor.set(0, 0.5);

    this.txtDes = this.game.make.text(0, 0, this.txt, getFontStyle('30px'));
    this.txtDes.alignTo(this.icon, Phaser.RIGHT_BOTTOM, 10, -15);

    this.block = this.game.make.graphics(0, 0);
    this.block.beginFill(CONFIG.subColor, CONFIG.subAlpha);
    this.block.drawRect(0, 0, CONFIG.subWidth, CONFIG.subHeight);
    this.block.endFill();
    this.block.alignTo(this.bg, Phaser.TOP_RIGHT, -10, -85);

    this.txtCurr = this.game.make.text(0, 0, this.plainTxtCurr, getFontStyle('24px', 'white', 'center', 'normal'));
    this.txtCurr.alignTo(this.block, Phaser.TOP_RIGHT, -5, -45);

    this.txtFuture = this.game.make.text(0, 0, this.plainTxtFuture, getFontStyle('24px', '#38ec43', 'center', 'normal'));
    this.txtFuture.alignTo(this.block, Phaser.TOP_RIGHT, -5, -80);

    this.addChild(this.bg);
    this.addChild(this.icon);
    this.addChild(this.txtDes);
    this.addChild(this.block);
    this.addChild(this.txtCurr);
    this.addChild(this.txtFuture);
  }
}

export default UpgradeItem;
