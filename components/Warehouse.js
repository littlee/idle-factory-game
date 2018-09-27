class Warehouse extends window.Phaser.Group {
  constructor(game, x, y) {
    super(game);
    this.x = x;
    this.y = y;

    this.table = this.game.make.image(0, 0, 'warehouse_table');
    this.add(this.table);
  }

  onClick(func, context) {
    this.table.inputEnabled = true;
    this.table.input.priorityID = 999;
    this.table.events.onInputDown.add(func, context);
  }
}

export default Warehouse;