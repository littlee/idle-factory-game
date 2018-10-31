import SourceImg from '../resource/SourceImg';

const INPUT_NUM_STYLE = {
  font: 'Arail',
  fontSize: 28,
  fill: '#fff',
  stroke: '#000',
  strokeThickness: 5
};

class ResourecePile extends window.Phaser.Group {
  constructor(game, key = 'ore', hasNumber) {
    super(game);

    this._data = {
      resourceKey: key,
      pileWidth: 0
    };

    this.pile = this.game.add.group();
    let texture = SourceImg.get(key);
    this.pile.createMultiple(5, 'material', texture, true, (item, index) => {
      item.scale.setTo(0.43);
      if (index === 0) {
        this._data.pileWidth = item.width;
      }
      return (item.y = index * 5);
    });
    this.pile.sort('z', window.Phaser.Group.SORT_DESCENDING);
    this.add(this.pile);

    if (hasNumber) {
      this.number = this.game.make.text(0, -10, '0', INPUT_NUM_STYLE);
      this.centerNumText();
      this.add(this.number);
    }
  }

  centerNumText() {
    if (this.number) {
      this.number.x = (this._data.pileWidth - this.number.width) / 2;
    }
  }

  getKey() {
    return this._data.resourceKey;
  }

  setNum(text) {
    this.number && this.number.setText(`${text}`);
    this.centerNumText();
  }

  changeTexture(key) {
    this._data.resourceKey = key;
    this.pile.forEach((item) => {
      let texture = SourceImg.get(key);
      item.loadTexture('material', texture);
      if (this.pile.getChildIndex(item) === 0) {
        this._data.pileWidth = item.width;
      }
    });
    this.centerNumText();
  }

  updateTexture() {
    this.changeTexture(this._data.resourceKey);
  }
}

export default ResourecePile;
