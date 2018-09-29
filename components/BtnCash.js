const TEXT_STYLE = {
  font: 'Arial',
  fontSize: 36,
  fill: '#fbf36d'
};

class BtnCash extends window.Phaser.Group {
  constructor(game, x, y) {
    super(game);
    this.x = x;
    this.y = y;
    this.gameRef = game;

    this.img = this.gameRef.make.image(0, 0, 'btn_cash');
    this.add(this.img);

    this.text = this.gameRef.make.text(55, 45, '666', TEXT_STYLE);
    this.add(this.text);

    this.setAllChildren('inputEnabled', true);
    this.setAllChildren('input.priorityID', 888);
  }

  setText(text) {
    this.text.setText(text);
  }

  onClick(func, context) {
    this.img.inputEnabled = true;
    this.img.events.onInputDown.add(func, context);
  }
}

export default BtnCash;
