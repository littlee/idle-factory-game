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

class PanelUpgrade extends window.Phaser.Group {
  constructor({ game, parent}) {
    super(game, parent);

    this._getInit();
  }

  _getInit = () => {
    this.bg = this.game.make.graphics(0, 0);
    this.bg.beginFill(0x000000, 0.1);
    this.bg.drawRect(0, 0, 290, 85);
    this.bg.endFill();
    this.bg.alignTo(this.parent, Phaser.TOP_LEFT, -30, -910);

    this.one = this.game.make.text(0, 0, 'x1', getFontStyle());
    this.one.setTextBounds(0, 0, 72, 85);
    this.one.alignTo(this.bg, Phaser.TOP_LEFT, 0, -40);
    this.btnOne = this.game.make.image(0, 0, 'btn_pick_upgrade');
    this.btnOne.alignTo(this.bg, Phaser.TOP_LEFT, -2, -90);


    this.ten = this.game.make.text(0, 0, 'x10', getFontStyle());
    this.ten.setTextBounds(0, 0, 72, 85);
    this.ten.alignTo(this.bg, Phaser.TOP_LEFT, -72, -40);
    this.btnTen = this.game.make.image(0, 0, 'btn_pick_upgrade');
    this.btnTen.alignTo(this.bg, Phaser.TOP_LEFT, -2 - 72, -90);
    this.btnTen.visible = false;

    this.fifth = this.game.make.text(0, 0, 'x50', getFontStyle());
    this.fifth.setTextBounds(0, 0, 72, 85);
    this.fifth.alignTo(this.bg, Phaser.TOP_LEFT, -72 * 2, -40);
    this.btnFifth = this.game.make.image(0, 0, 'btn_pick_upgrade');
    this.btnFifth.alignTo(this.bg, Phaser.TOP_LEFT, -2 - 72 * 2, -90);
    this.btnFifth.visible = false;

    this.max = this.game.make.text(0, 0, '最高', getFontStyle());
    this.fifth.setTextBounds(0, 0, 72, 85);
    this.max.alignTo(this.bg, Phaser.TOP_LEFT, -74 * 3, -63);
    this.btnMax = this.game.make.image(0, 0, 'btn_pick_upgrade');
    this.btnMax.alignTo(this.bg, Phaser.TOP_LEFT, -2 - 72 * 3, -90);
    this.btnMax.visible = false;
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
  }

  _handleInput = () => {

  }
}

export default PanelUpgrade;
