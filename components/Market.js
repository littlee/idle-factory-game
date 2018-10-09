import range from '../js/libs/_/range';
// import Big from '../js/libs/big.min';
import { formatBigNum } from '../utils';

const TEXT_START_X = 100;
const TEXT_START_Y = 160;

const INC_NUM_STYLE = {
  font: 'Arail',
  fontSize: 24,
  fill: '#fff',
  stroke: '#000',
  strokeThickness: 5
};

const INIT_MULTIPLE = 1;

function getSellText(amount, multiple) {
  let text = `${formatBigNum(amount)}`;
  if (multiple > 1) {
    text += ` x ${multiple}`;
  }
  return text;
}

class Market extends window.Phaser.Group {
  constructor(game, x, y) {
    super(game);

    this._data = {
      multiple: INIT_MULTIPLE
    };

    this.x = x;
    this.y = y;

    this.onSellCallback = null;
    this.onSellContext = null;

    this.truck = this.game.make.sprite(0, 0, 'market_truck');

    this.textGroup = this.game.add.group();
    range(10).forEach(index => {
      let item = this.game.make.text(
        TEXT_START_X,
        TEXT_START_Y,
        '+0',
        INC_NUM_STYLE
      );
      item.kill();
      this.textGroup.add(item);
    });

    this.add(this.truck);
    this.add(this.textGroup);

    this.killQueue = [];
  }

  // amount: Big
  sell(amount) {
    let textItem = this.textGroup.getFirstDead();
    textItem.reset(TEXT_START_X, TEXT_START_Y);
    textItem.alpha = 1;
    textItem.setText(getSellText(amount, this._data.multiple));
    this.killQueue.push(textItem);
    this.game.add
      .tween(textItem)
      .to(
        {
          y: '-80',
          alpha: 0.1
        },
        1000,
        null,
        true
      )
      .onComplete.add(() => {
        let textItem = this.killQueue.shift();
        textItem.kill();
      });

    if (this.onSellCallback) {
      this.onSellCallback.call(
        this.onSellContext,
        amount.times(this._data.multiple)
      );
    }
  }

  onSell(func, context) {
    this.onSellCallback = func;
    this.onSellContext = context;
  }

  getMultiple() {
    return this._data.multiple;
  }

  setMultiple(multiple) {
    this._data.multiple = multiple;
  }

  resetMultiple() {
    this._data.multiple = INIT_MULTIPLE;
  }
}

export default Market;
