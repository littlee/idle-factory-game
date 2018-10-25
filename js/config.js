export const OUTPUT_INPUT_MAP = {
  steel: ['ore'],
  can: ['ore'],
  drill: ['steel'],
  toaster: ['steel', 'can'],

  battery: ['copper'],
  coffee_machine: ['copper'],
  mp3: ['battery'],
  speaker: ['battery', 'mp3'],

  plasticBar: ['barrel'],
  wheel: ['barrel'],
  screen: ['plasticBar'],
  phone: ['plasticBar', 'screen'],

  circuit: ['plug'],
  tv: ['plug'],
  computer: ['circuit'],
  vr: ['circuit', 'computer'],

  // aluminium goes here
  engine: ['aluminium'],
  solarPanel: ['aluminium'],
  car: ['engine'],
  telescope: ['engine', 'car'],

  // rubber goes here
  projector: ['rubber'],
  headset: ['rubber'],
  walkieTalkie: ['projector'],
  radio: ['projector', 'walkieTalkie']
};

export const PROD_DES = {
  steel: '2钢筋',
  can: '2罐子',
  drill: '1电砖',
  toaster: '1烤箱',

  battery: '2电池',
  coffee_machine: '2咖啡机',
  mp3: '3MP3',
  speaker: '1扩音器',

  plasticBar: '2塑料条',
  wheel: '2车轮',
  screen: '3屏幕',
  phone: '1手机',

  circuit: '2芯片',
  tv: '1TV',
  computer: '1电脑',
  vr: '1VR',

  // aluminium goes here
  engine: '2引擎',
  solarPanel: '3太阳能板',
  car: '3汽车',
  telescope: '1望远镜',

  projector: '1投影仪',
  headset: '2耳机',
  walkieTalkie: '3对讲机',
  radio: '2收音机'
};

export let prod_info = {
  steel: {
    price: 5,
    coinNeeded: 0,
    cashNeeded: 0,
    bought: true,
    activated: true
  },
  can: {
    price: 10,
    coinNeeded: 1000,
    cashNeeded: 100,
    bought: false,
    activated: false
  },
  drill: {
    price: 250,
    coinNeeded: 1000,
    cashNeeded: 200,
    bought: false,
    activated: false
  },
  toaster: {
    price: 1000,
    coinNeeded: 1000,
    cashNeeded: 250,
    bought: false,
    activated: false
  },
  battery: {
    price: 1000,
    coinNeeded: 1500,
    cashNeeded: 200,
    bought: false,
    activated: false
  },
  coffee_machine: {
    price: 1000,
    coinNeeded: 1000,
    cashNeeded: 300,
    bought: false,
    activated: false
  },
  mp3: {
    price: 1000,
    coinNeeded: 1000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },
  speaker: {
    price: 10000,
    coinNeeded: 10500000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },

  plasticBar: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },
  wheel: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },
  screen: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },
  phone: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },

  circuit: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },
  tv: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },
  computer: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },
  vr: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },

  engine: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },

  solarPanel: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },

  car: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },

  telescope: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },

  projector: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },
  headset: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },
  walkieTalkie: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  },
  radio: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350,
    bought: false,
    activated: false
  }
};

export let upgradedMap = {
  ore: [
    {
      name: 'steel',
      bought: true
    },
    {
      name: 'can',
      bought: false
    },
    {
      name: 'drill',
      bought: false
    },
    {
      name: 'toaster',
      bought: false
    }
  ],
  copper: [
    {
      name: 'battery',
      bought: false
    },
    {
      name: 'coffee_machine',
      bought: false
    },
    {
      name: 'mp3',
      bought: false
    },
    {
      name: 'speaker',
      bought: false
    },
  ],
  barrel: [
    {
      name: 'plasticBar',
      bought: false
    },
    {
      name: 'wheel',
      bought: false
    },
    {
      name: 'screen',
      bought: false
    },
    {
      name: 'phone',
      bought: false
    },
  ],
  plug: [
    {
      name: 'circuit',
      bought: false
    },
    {
      name: 'tv',
      bought: false
    },
    {
      name: 'computer',
      bought: false
    },
    {
      name: 'vr',
      bought: false
    },
  ],
  aluminium: [
    {
      name: 'engine',
      bought: false
    },
    {
      name: 'solarPanel',
      bought: false
    },
    {
      name: 'car',
      bought: false
    },
    {
      name: 'telescope',
      bought: false
    },
  ],
  rubber: [
    {
      name: 'projector',
      bought: false
    },
    {
      name: 'headset',
      bought: false
    },
    {
      name: 'walkieTalkie',
      bought: false
    },{
      name: 'radio',
      bought: false
    },
  ]
};
