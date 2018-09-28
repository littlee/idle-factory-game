const GOODS_MAP = {
  ore: {
    key: 'reso_ore',
    x: 0,
    y: 100
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
      this.goods.create(item.x, item.y, item.key, null, false);
    });

    this.add(this.table);
    this.add(this.goods);

    this.addGood('ore');
  }

  addGood(key) {
    this._data.currentGoods.push(key);
    this.goods.forEachDead(item => {
      if (item.key === GOODS_MAP[key].key) {
        item.revive();
      }
    });
  }

  getCurrentGoods() {
    return this._data.currentGoods;
  }

  onClick(func, context) {
    this.table.inputEnabled = true;
    this.table.input.priorityID = 999;
    this.table.events.onInputDown.add(func, context);
  }
}

export default Warehouse;
