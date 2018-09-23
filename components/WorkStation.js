window.PIXI = require('../js/libs/pixi.min');
window.p2 = require('../js/libs/p2.min');
window.Phaser = require('../js/libs/phaser-split.min');

const COLLECT_TYPES = {
  CASH: 'cash',
  PROD: 'prod'
};

class WorkStation extends window.Phaser.Group {
  constructor(game, x, y, stationLevel = 0, index = 1) {
    super(game);
    this.x = x;
    this.y = y;
    this.gameRef = game;

    this._data = {
      collectType: 'cash'
    };

    this.ground = this.gameRef.make.image(0, 0, `ground_level_${stationLevel}`);

    this.table = this.gameRef.make.image(0, 0, `table_level_${stationLevel}`);
    this.table.alignIn(this.ground, window.Phaser.TOP_CENTER);

    this.worker = this.gameRef.make.sprite(0, 0, 'worker');
    this.worker.alignTo(this.table, window.Phaser.TOP_CENTER);

    this.manager = this.gameRef.make.sprite(0, 0, 'mgr_worker');
    this.manager.alignIn(this.table, window.Phaser.TOP_LEFT, -15, 100);

    this.boxCollect = this.gameRef.make.sprite(0, 0, 'box_collect');

    this.boxHolderProd = this.gameRef.make.sprite(0, 0, 'box_collect_holder');
    this.boxHolderProd.alignTo(this.table, window.Phaser.BOTTOM_LEFT, -20, -5);
    this.boxHolderProd.inputEnabled = true;
    this.boxHolderProd.events.onInputDown.add(this._setCollectType.bind(this, COLLECT_TYPES.PROD));
    
    this.boxHolderCash = this.gameRef.make.sprite(0, 0, 'box_collect_holder');
    this.boxHolderCash.alignTo(this.table, window.Phaser.BOTTOM_RIGHT, -20, -5);
    this.boxHolderCash.inputEnabled = true;
    this.boxHolderCash.events.onInputDown.add(this._setCollectType.bind(this, COLLECT_TYPES.CASH));

    // for simple z-depth
    this.add(this.ground);
    this.add(this.manager);
    this.add(this.table);
    this.add(this.worker);
    this.add(this.boxHolderProd);
    this.add(this.boxHolderCash);
    this.add(this.boxCollect);

    this._init();
  }

  _init() {
    this._setCollectType(COLLECT_TYPES.CASH);
  }

  _setData(data) {
    this._data = {
      ...this._data,
      ...data
    };
  }

  _setCollectType(collectType) {

    if (!collectType) {
      return;
    }

    this._setData({
      collectType
    });

    if (collectType === COLLECT_TYPES.CASH) {
      this.boxCollect.alignIn(this.boxHolderCash, window.Phaser.CENTER);
      this.boxHolderCash.frame = 1;
      this.boxHolderProd.frame = 0;
    }
    else if (collectType === COLLECT_TYPES.PROD) {
      this.boxCollect.alignIn(this.boxHolderProd, window.Phaser.CENTER);
      this.boxHolderProd.frame = 1;
      this.boxHolderCash.frame = 0;
    }
    
  }
}

export default WorkStation;
