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
      plasticBar: [1980, 2574, 3564, 4950, 6930, 9900],
      wheel: [1980, 2574, 3564, 4950, 6930, 9900],
      screen: [1980, 2574, 3564, 4950, 6930, 9900],
      phone: [1980, 2574, 3564, 4950, 6930, 9900],
      // plug
      circuit: [1980, 2574, 3564, 4950, 6930, 9900],
      tv: [1980, 2574, 3564, 4950, 6930, 9900],
      computer: [1980, 2574, 3564, 4950, 6930, 9900],
      vr: [1980, 2574, 3564, 4950, 6930, 9900],
      // aluminium
      engine: [1980, 2574, 3564, 4950, 6930, 9900],
      solarPanel: [1980, 2574, 3564, 4950, 6930, 9900],
      car: [1980, 2574, 3564, 4950, 6930, 9900],
      telescope: [1980, 2574, 3564, 4950, 6930, 9900],
      // rubber
      projector: [1980, 2574, 3564, 4950, 6930, 9900],
      headset: [1980, 2574, 3564, 4950, 6930, 9900],
      walkieTalkie: [1980, 2574, 3564, 4950, 6930, 9900],
      radio: [1980, 2574, 3564, 4950, 6930, 9900]
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

    this._prodTexture = {
      steel: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      can: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      drill: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      toaster: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      battery: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      coffeeMachine: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      mp3: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      speaker: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      plasticBar: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      wheel: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      screen: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      phone: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      circuit: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      tv: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      computer: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      vr: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      // aluminium
      engine: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      solarPanel: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      car: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      telescope: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      // rubber
      projector: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      headset: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      walkieTalkie: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby'],
      radio: ['', 'bronze', 'silver', 'gold', 'jade', 'ruby']
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

  getLatestTextureByKey(key) {
    let idx = this._prodLevel[key];
    return idx ? `prod_${key}_${this._prodTexture[key][idx]}` : `prod_${key}`;
  }

  setLevelByKey(key, level) {
    this._prodLevel[key] = level;
    console.log('更新', key, '到level: ', level);
  }
}

export default new Production();
