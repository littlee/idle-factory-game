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
  constructor({ game, parent, x, y, adjacentGroup}) {
    super(game, parent);
    this.adjacentGroup = adjacentGroup;
    this.posX = x;
    this.posY = y;

    this._getInit();
  }

  _getInit = () => {
    this.bg = this.game.make.graphics(0, 0);
    this.bg.beginFill(0x000000, 0.1);
    this.bg.drawRect(0, 0, 290, 85);
    this.bg.endFill();
    this.bg.alignTo(this.adjacentGroup, Phaser.BOTTOM_LEFT, 0, 22);

    this.one = this.game.make.text(0, 0, 'x1', getFontStyle());
    this.one.setTextBounds(0, 0, 72, 85);
    this.one.alignTo(this.bg, Phaser.TOP_LEFT, 0, -40);
    this.btnOne = this.game.make.image(0, 0, 'btn_pick_upgrade');
    this.btnOne.alignTo(this.bg, Phaser.TOP_LEFT, 1, -90);
    this.btnOne.alpha = 1;


    this.ten = this.game.make.text(0, 0, 'x10', getFontStyle());
    this.ten.setTextBounds(0, 0, 72, 85);
    this.ten.alignTo(this.bg, Phaser.TOP_LEFT, -72, -40);
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

    this._handleInput();
  }

  _handleInput = () => {
    let tmp = [
      {key: 'btnOne', txt: 'one'},
      {key: 'btnTen', txt: 'ten'},
      {key: 'btnFifth', txt: 'fifth'},
      {key: 'btnMax', txt: 'max'}
    ];
    tmp.forEach(
      (item) => {
        this[item.key].events.onInputDown.add(() => {
          let curr = item.key;
          this[item.key].alpha = this[item.key].alpha === 1 ? 0 : 1;
          tmp.forEach(
            (entry) => {
              if (entry.key === curr) return;
              this[entry.key].alpha = this[item.key].alpha === 1 ? 0 : 1;;
            }
          );
        });
        this[item.txt].events.onInputDown.add(() => {
          let curr = item.key;
          this[item.key].alpha = this[item.key].alpha === 1 ? 0 : 1;
          tmp.forEach(
            (entry) => {
              if (entry.key === curr) return;
              this[entry.key].alpha = this[item.key].alpha === 1 ? 0 : 1;;
            }
          );
        });
      }
    );

  }
}

export default PanelUpgrade;
