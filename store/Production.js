// price acc 30%, 80%, 150%, 250%, 400%

class Production {
  constructor() {
    this._prodPrice = {
      // ore
      steel: [1, 1.3, 1.8, 2.5, 3.5, 5],
      can: [4, 5.2, 7.2, 10, 14, 20],
      drill: [25, 32.5, 45, 62.5, 87.5, 125],
      toaster: [117, 152.1, 210.6, 292.5, 409.5, 585],
      // copper
      battery: [18, 23.4, 32.4, 45, 63, 90],
      coffeeMachine: [45, 58.5, 81, 112.5, 157.5, 225],
      mp3: [180, 234, 324, 450, 630, 900],
      speaker: [1980, 2574, 3564, 4950, 6930, 9900],
      // oil barrel
      plasticBar: 0,
      wheel: 0,
      screen: [],
      phone: [],
      // plug
      circuit: [],
      tv: [],
      computer: [],
      vr: [],
      // aluminium
      engine: [],
      solarPanel: [],
      car: [],
      telescope: [],
      // rubber
      projector: [],
      headset: [],
      walkieTalkie: [],
      radio: []
    };

    this._prodLevel = {
      steel: 0,
      can: 0,
      drill: 0,
      toaster: 0,
      battery: 0,
      coffeeMachine: 0,
      mp3: 0,
      speaker: 0,
      plasticBar: 0,
      wheel: 0,
      screen: 0,
      phone: 0,
      circuit: 0,
      tv: 0,
      computer: 0,
      vr: 0,
      // aluminium
      engine: 0,
      solarPanel: 0,
      car: 0,
      telescope: 0,
      // rubber
      projector: 0,
      headset: 0,
      walkieTalkie: 0,
      radio: 0
    };
  }

  setPrice(config) {
    this._prodPrice = config;
  }

  getPriceByKey(key) {
    let level = this._prodLevel[key];
    return this._prodPrice[key][level];
  }

  getLevelByKey(key) {
    return this._prodLevel[key];
  }

  setLevelByKey(key, level) {
    this._prodLevel[key] = level;
    console.log('更新', key, '到level: ', level);
  }
}

export default new Production();
