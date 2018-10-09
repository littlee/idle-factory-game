// price acc 30%, 80%, 150%, 250%, 400%

class Production {
  constructor() {
    this._prodPrice = {
      steel: [1, 1.3, 1.8, 2.5, 3.5, 5],
      can: [4, 5.2, 7.2, 10, 14, 20],
      drill: [25, 32.5, 45, 62.5, 87.5, 125],
      toaster: [117, 152.1, 210.6, 292.5, 409.5, 585],
      battery: [18, 23.4, 32.4, 45, 63, 90],
      coffee_machine: [45, 58.5, 81, 112.5, 157.5, 225],
      mp3: [180, 234, 324, 450, 630, 900],
      speaker: [1980, 2574, 3564, 4950, 6930, 9900]
    };

    this._prodLevel = {
      steel: 1,
      can: 0,
      drill: 0,
      toaster: 0,
      battery: 0,
      coffee_machine: 0,
      mp3: 0,
      speaker: 0
    };
  }

  getPrice() {
    // 应该是写错
    return this._prodPrice;
  }

  setPrice(config) {
    this._prodPrice = config;
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
