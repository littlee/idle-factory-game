const CONFIG = {
  width: 537,
  height: 85,
  subWidth: 146, // the right block
  subHeight: 85,
  bgColor: 0x000000,
  bgAlpha: 0.1,
  subColor: 0x3a0a00,
  subAlpha: 0.8
};

const INIT = {
  value: 1,
  increment: 0.1
};

function getFontStyle(fSize, color, align, weight) {
  return {
    fontWeight: weight || 'bold',
    fontSize: fSize,
    fill: color || '#3A0A00', // '#00FF00',
    boundsAlignH: 'right',
    boundsAlignV: 'middle',
    align: align || 'left'
    // backgroundColor: '#CCCCCC'
  };
}

// 随便写
function formatTo3digits(num) {
  let integer = num.toString().split('.');
  let result;
  if (integer[0].length >= 3) {
    let tmp = integer[0].length > 3 ? integer[3] : 0;
    if (tmp >= 5) {
      result = integer[0].slice(0, 3);
      result = Number(result) + 1;
    } else {
      result = Number(integer[0].slice(0, 3));
    }
  } else {
    if (integer[0].length === 2) {
      result = Number(num.toFixed(1));
    } else if (integer[0].length === 1) {
      result = Number(num.toFixed(2));
    }
  }

  return result;
}

class LevelUpgradeItem extends window.Phaser.Group {
  constructor({ game, parent, key, txt, x, y, levelType, itemName, value = null, increment = null, panelUpgradeInstance = null }) {
    super(game, parent);
    this.key = key;
    this.plainTxt = txt;
    this.posX = x;
    this.posY = y;

    this.increment = increment === null ? INIT.increment : increment;
    this.panelUpgradeInstance = panelUpgradeInstance;

    this._data = {
      value: value === null ? INIT.value : value,
      levelType: levelType,
      itemName: itemName,
    };

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

    this.txtDes = this.game.make.text(0, 0, this.plainTxt, getFontStyle('30px'));
    this.txtDes.alignTo(this.icon, Phaser.RIGHT_BOTTOM, 10, -15);

    this.block = this.game.make.graphics(0, 0);
    this.block.beginFill(CONFIG.subColor, CONFIG.subAlpha);
    this.block.drawRect(0, 0, CONFIG.subWidth, CONFIG.subHeight);
    this.block.endFill();
    this.block.alignTo(this.bg, Phaser.TOP_RIGHT, -10, -85);

    // 要变化的 setTextBounds( [x] [, y] [, width] [, height])
    this.txtCurr = this.game.make.text(
      0,
      0,
      formatTo3digits(this._data.value),
      getFontStyle('24px', 'white', 'center', 'normal')
    );
    this.txtCurr.setTextBounds(0, 0, this.block.width - 10, 28);
    this.txtCurr.alignTo(this.block, Phaser.TOP_LEFT, -5, -45);

    this.txtFuture = this.game.make.text(
      0,
      0,
      `+${formatTo3digits(this.increment)}`,
      getFontStyle('24px', '#38ec43', 'center', 'normal')
    );
    this.txtFuture.setTextBounds(0, 0, this.block.width - 10, 28);
    this.txtFuture.alignTo(this.block, Phaser.TOP_LEFT, -5, -80);

    this.addChild(this.bg);
    this.addChild(this.icon);
    this.addChild(this.txtDes);
    this.addChild(this.block);
    this.addChild(this.txtCurr);
    this.addChild(this.txtFuture);
  }

  getData = () => {
    return this._data;
  }

  getDesUpdated = (upgraded = false) => {
    let map = {
      '1': 0.01,
      '10': 0.1,
      '50': 0.5
    };

    if (Object.is(this.panelUpgradeInstance.getMultiplier(), NaN)) {
      console.log('max 选中...');
    } else {
      this.increment = this._data.value * map[this.panelUpgradeInstance.getMultiplier().toString()];
      this.txtCurr.setText(formatTo3digits(this._data.value));
      this.txtFuture.setText(`+${formatTo3digits(this.increment)}`);
      if (upgraded === true) {
        this._data.value = formatTo3digits(
          this.increment + this._data.value
        );
        // console.log(
        //   this._data.levelType,
        //   this._data.itemName,
        //   this._data.value
        // );
        this.txtCurr.setText(
          formatTo3digits(this._data.value)
        );
        this.txtFuture.setText(
          `+ ${formatTo3digits(
            this._data.value *
              map[this.panelUpgradeInstance.getMultiplier().toString()]
          )}`
        );
      }
    }
  };
}

export default LevelUpgradeItem;
