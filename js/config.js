
export const OUTPUT_INPUT_INFO = {
  steel: {
    inputList: ['ore'],
    cnDes: '2钢筋',
  },
  can: {
    inputList: ['ore'],
    cnDes: '2罐子'
  },
  drill: {
    inputList: ['steel'],
    cnDes: '1电砖'
  },
  toaster: {
    inputList: ['steel', 'can'],
    cnDes: '1烤箱'
  },

  battery: {
    inputList: ['copper'],
    cnDes: '2电池'
  },
  coffeeMachine: {
    inputList: ['copper'],
    cnDes: '2咖啡机'
  },
  mp3: {
    inputList: ['battery'],
    cnDes: '3MP3'
  },
  speaker: {
    inputList: ['battery', 'mp3'],
    cnDes: '1扩音器'
  },

  plasticBar: {
    inputList: ['barrel'],
    cnDes: '2塑料条'
  },
  wheel: {
    inputList: ['barrel'],
    cnDes: '2车轮'
  },
  screen: {
    inputList: ['plasticBar'],
    cnDes: '3屏幕'
  },
  phone: {
    inputList: ['plasticBar', 'screen'],
    cnDes: '1手机'
  },

  circuit: {
    inputList: ['plug'],
    cnDes: '2芯片'
  },
  tv: {
    inputList: ['plug'],
    cnDes: '1TV'
  },
  computer: {
    inputList: ['circuit'],
    cnDes: '1电脑'
  },
  vr: {
    inputList: ['circuit', 'computer'],
    cnDes: '1VR'
  },

  // aluminium goes here
  engine: {
    inputList: ['aluminium'],
    cnDes: '2引擎'
  },
  solarPanel: {
    inputList: ['aluminium'],
    cnDes: '3太阳能板'
  },
  car: {
    inputList: ['engine'],
    cnDes: '3汽车'
  },
  telescope: {
    inputList: ['engine', 'car'],
    cnDes: '1望远镜'
  },

  // rubber goes here
  projector: {
    inputList: ['rubber'],
    cnDes: '1投影仪'
  },
  headset: {
    inputList: ['rubber'],
    cnDes: '2耳机'
  },
  walkieTalkie: {
    inputList: ['projector'],
    cnDes: '对讲机'
  },
  radio: {
    inputList: ['projector', 'walkieTalkie'],
    cnDes: '2收音机'
  },
};

export const CN_NAME_MAP = {
  ore: '铁矿',
  copper: '黄铜',
  aluminium: '铝器',
  plug: '电器',
  barrel: '油桶',
  rubber: '橡胶',

  steel: '钢筋',
  can: '罐子',
  drill: '电砖',
  toaster: '烤箱',

  battery: '电池',
  coffeeMachine: '咖啡机',
  mp3: 'MP3',
  speaker: '扩音器',

  plasticBar: '塑料条',
  wheel: '车轮',
  screen: '屏幕',
  phone: '手机',

  circuit: '芯片',
  tv: 'TV',
  computer: '电脑',
  vr: 'VR',

  engine: '引擎',
  solarPanel: '太阳能板',
  car: '汽车',
  telescope: '望远镜',

  projector: '投影仪',
  headset: '耳机',
  walkieTalkie: '对讲机',
  radio: '收音机'
};

const PROD_LIST = [
	'steel',
	'can',
	'drill',
	'toaster',
	'battery',
	'coffeeMachine',
	'mp3',
	'speaker',
	'plasticBar',
	'wheel',
	'screen',
	'phone',
	'circuit',
	'tv',
	'computer',
	'vr',
	'engine',
	'solarPanel',
	'car',
	'telescope',
	'projector',
	'headset',
	'walkieTalkie',
	'radio'
];

/* steel: {
  price: 5,
  coinNeeded: 0,
  cashNeeded: 0,
  bought: true,
  activated: false
},
can: {
  price: 10,
  coinNeeded: 1000,
  cashNeeded: 100,
  bought: false,
  activated: false
}, */
export let prodInfo = PROD_LIST.reduce((prev, curr, index) => {
  prev[curr] = {
    price: 5 * (index + 1),
    coinNeeded: `${index}000`,
    cashNeeded: 100 * index,
    bought: index === 0 ? true : false,
    activated: false,
  };
  return prev;
}, {});

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
      name: 'coffeeMachine',
      bought: false
    },
    {
      name: 'mp3',
      bought: false
    },
    {
      name: 'speaker',
      bought: false
    }
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
    }
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
    }
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
    }
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
    },
    {
      name: 'radio',
      bought: false
    }
  ]
};

export let bellRedInfo = {
  boughtCount: 1, // skills point bought total count
  level: 1,
  point: 0, // skills point bought but haven't used count
};
