const INPUT_NUM_STYLE = {
  font: 'Arail',
  fontSize: 28,
  fill: '#fff',
  stroke: '#000',
  strokeThickness: 5
};

class ResourecePile extends window.Phaser.Group {
  constructor(game, key, hasNumber) {
    super(game);

    this.pileWidth = 0;

    this.pile = this.game.add.group();
    this.pile.createMultiple(5, key, null, true, (item, index) => {
      if (index === 0) {
        this.pileWidth = item.width;
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

    // this.changeTexture('reso_copper');

  }

  centerNumText() {
    if (this.number) {
      this.number.x = (this.pileWidth - this.number.width) / 2;
    }
  }

  setNum(text) {
    this.number && this.number.setText(text);
    this.centerNumText();
  }

  changeTexture(key) {
    this.pile.forEach((item) => {
      item.loadTexture(key);
      if (this.pile.getChildIndex(item) === 0) {
        this.pileWidth = item.width;
      }
    });
    this.centerNumText();
  }
}

export default ResourecePile;
