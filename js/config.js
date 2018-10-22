export const OUTPUT_INPUT_MAP = {
  steel: ['ore'],
  can: ['ore'],
  drill: ['steel'],
  toaster: ['steel', 'can'],

  battery: ['copper'],
  coffee_machine: ['copper'],
  mp3: ['battery'],
  speaker: ['battery', 'mp3'],

  plasticBar: ['oilBarrel'],
  wheel: ['oilBarrel'],
  screen: ['plasticBar'],
  phone: ['plasticBar', 'screen'],

  circuit: ['plug'],
  tv: ['plug'],
  computer: ['circuit'],
  vr: ['circuit', 'computer'],

  // aluminium goes here
  // rubber goes here
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
  // rubber goes here
};

export const PROD_PRICE_VALUE = {
  steel: {
    price: 5,
    coinNeeded: 0,
    cashNeeded: 0
  },
  can: {
    price: 10,
    coinNeeded: 1000,
    cashNeeded: 100
  },
  drill: {
    price: 250,
    coinNeeded: 3000,
    cashNeeded: 200
  },
  toaster: {
    price: 1000,
    coinNeeded: 10000,
    cashNeeded: 250
  },
  battery: {
    price: 1300,
    coinNeeded: 15000,
    cashNeeded:  200
  },
  coffee_machine: {
    price: 3000,
    coinNeeded: 1000000,
    cashNeeded: 300
  },
  mp3: {
    price: 5000,
    coinNeeded: 10000000,
    cashNeeded: 350
  },
  speaker: {
    price: 10000,
    coinNeeded: 10500000,
    cashNeeded: 350
  },
};

