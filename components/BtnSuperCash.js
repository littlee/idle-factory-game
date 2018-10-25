const TEXT_STYLE = {
  font: 'Arial',
  fontSize: 36,
  fill: '#38ec43'
};

class BtnSuperCash extends window.Phaser.Group {
  constructor(game, x, y) {
    super(game);
    this.x = x;
    this.y = y;
    this.gameRef = game;

    this.img = this.gameRef.make.image(0, 0, 'btn_super_cash');
    this.add(this.img);

    this.text = this.gameRef.make.text(55, 45, '0', TEXT_STYLE);
    this.add(this.text);
  }

  setText(text) {
    this.text.setText(text);
  }

  onClick(func, context) {
    this.img.inputEnabled = true;
    this.img.events.onInputDown.add(func, context);
  }
}

export default BtnSuperCash;
