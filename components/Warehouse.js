import ResourceEmitter from './ResourceEmitter';

const GOODS_MAP = {
  ore: {
    key: 'reso_ore',
    x: -5,
    y: 80
  },
  copper: {
    key: 'reso_copper',
    x: 85,
    y: 85
  },
  barrel: {
    key: 'reso_barrel',
    x: 157,
    y: 85
  },
  plug: {
    key: 'reso_plug',
    x: 2,
    y: 17
  },
  aluminium: {
    key: 'reso_aluminium',
    x: 94,
    y: 0
  },
  rubber: {
    key: 'reso_rubber',
    x: 153,
    y: 3
  }
};

export const GOODS = {
  ore: 'ore',
  copper: 'copper',
  barrel: 'barrel',
  plug: 'plug',
  aluminium: 'aluminium',
  rubber: 'rubber'
};

class Warehouse extends window.Phaser.Group {
  static RESOURCE = ['ore', 'copper', 'barrel', 'plug', 'aluminium', 'rubber'];

  constructor(game, x, y) {
    super(game);
    this.x = x;
    this.y = y;

    this._data = {
      currentGoods: []
    };

    this.table = this.game.make.image(0, 0, 'warehouse_table');

    this.goods = this.game.add.group();
    Object.keys(GOODS_MAP).forEach(goodKey => {
      let item = GOODS_MAP[goodKey];
      let good = this.goods.create(item.x, item.y, 'material', item.key, false);
      good.scale.setTo(0.5);
    });

    this.goodsOutputs = this.game.add.group();
    Object.keys(GOODS_MAP).forEach(goodKey => {
      let output = new ResourceEmitter(
        this.game,
        0,
        0,
        GOODS_MAP[goodKey].key,
        [-80, -120],
        [80, 120],
        1000,
        this.game.rnd.between(300, 500)
      );
      output.alignIn(this.table, window.Phaser.CENTER);
      this.goodsOutputs.add(output);
    });

    this.add(this.table);
    this.add(this.goods);
    this.add(this.goodsOutputs);

    this.addGood('ore');
  }

  addGood(key) {
    this._data.currentGoods.push(key);
    this.goods.forEachDead(item => {
      if (item.frameName === GOODS_MAP[key].key) {
        item.revive();
      }
    });
  }

  getCurrentGoods() {
    return this._data.currentGoods;
  }

  // 根据现有工作台的需求来确定输出，传入 keys
  outputGoods(keys) {
    keys = keys.map(k => `reso_${k}`);
    this.goodsOutputs.forEach(output => {
      if (keys.indexOf(output.particleKey) !== -1) {
        output.start();
      }
    });
  }

  stopOutput() {
    this.goodsOutputs.forEach(output => output.stop());
  }

  onClick(func, context) {
    this.table.inputEnabled = true;
    this.table.input.priorityID = 999;
    this.table.events.onInputDown.add(func, context);
  }
}

export default Warehouse;
