const INPUT_NUM_STYLE = {
  font: 'Arail',
  fontSize: 24,
  fill: '#fff',
  stroke: '#000',
  strokeThickness: 5
};

class ResourecePile extends window.Phaser.Group {
  constructor(game, key, hasNumber) {
    super(game);

    this.pileWidth = 0;

    this.createMultiple(5, key, null, true, (item, index) => {
      if (index === 0) {
        this.pileWidth = item.width;
      }
      return (item.y = index * 5);
    });
    this.sort('z', window.Phaser.Group.SORT_DESCENDING);

    if (hasNumber) {
      this.number = this.game.make.text(0, -10, '0', INPUT_NUM_STYLE);
      this.centerNumText();
      this.add(this.number);
    }
  }

  centerNumText() {
    this.number.x = (this.pileWidth - this.number.width)/ 2;
  }

  setNum(text) {
    this.number && this.number.setText(text);
    this.centerNumText();
  }

  changeTexture(key) {
    this.forEach((item, index) => {
      item.loadTexture(key);
      if (index === 0) {
        this.pileWidth = item.width;
      }
    });
  }
}

export default ResourecePile;
