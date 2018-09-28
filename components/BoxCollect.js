const INPUT_NUM_STYLE = {
  font: 'Arail',
  fontSize: 30,
  fill: '#fff',
  stroke: '#000',
  strokeThickness: 5
};

class BoxCollect extends window.Phaser.Group {
  constructor(game) {
    super(game);

    this.box = this.game.make.image(0, 0, 'box_collect');
    this.num = this.game.make.text(0, 0, '0', INPUT_NUM_STYLE);
    this.alignNum();

    this.add(this.box);
    this.add(this.num);
  }

  alignNum() {
    this.num.alignIn(this.box, window.Phaser.TOP_CENTER);
  }

  setNum(text) {
    this.num.setText(text);
    this.alignNum();
  }
}

export default BoxCollect;