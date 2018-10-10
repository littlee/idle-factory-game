export const LevelMap = {
  warehouse: {
    level1: {
      level: 1,
      count: 1,
      capacity: '4000',
      loadingSpeed: '2000',
      walkSpeed: 0.1
    },
    level2: {
      level: 2,
      count: 1,
      capacity: '4800',
      loadingSpeed: '3000',
      walkSpeed: 0.1 * 1.1
    },
    level3: {
      level: 3,
      count: 1,
      capacity: '5600',
      loadingSpeed: '4000',
      walkSpeed: 0.1 * 1.2
    },
    level4: {
      level: 4,
      count: 2,
      capacity: '6400',
      loadingSpeed: '5000',
      walkSpeed: 0.1 * 1.3
    },
    level5: {
      level: 5,
      count: 2,
      capacity: '7200',
      loadingSpeed: '6000',
      walkSpeed: 0.1 * 1.4
    },
    level6: {
      level: 6,
      count: 2,
      capacity: '8000',
      loadingSpeed: '7000',
      walkSpeed: 0.1 * 1.5
    },
    level7: {
      level: 7,
      count: 3,
      capacity: '8800',
      loadingSpeed: '8000',
      walkSpeed: 0.1 * 1.6
    },
    level8: {
      level: 8,
      count: 2,
      capacity: '9600',
      loadingSpeed: '9000',
      walkSpeed: 0.1 * 1.7
    },
    level9: {
      level: 9,
      count: 2,
      capacity: '10004',
      loadingSpeed: '10000',
      walkSpeed: 0.1 * 1.8
    },
    level10: {
      level: 10,
      count: 4,
      capacity: '11004',
      loadingSpeed: '11000',
      walkSpeed: 0.1 * 1.9
    },
    level11: {
      level: 11,
      count: 4,
      capacity: '12004',
      loadingSpeed: '12000',
      walkSpeed: 0.1 * 2
    }
  },

  market: {
    level1: {
      level: 1,
      count: 1,
      capacity: '4000',
      loadingSpeed: '2000',
      walkSpeed: 0.1
    },
    level2: {
      level: 2,
      count: 1,
      capacity: '4800',
      loadingSpeed: '3000',
      walkSpeed: 0.1 * 1.1
    },
    level3: {
      level: 3,
      count: 1,
      capacity: '5600',
      loadingSpeed: '4000',
      walkSpeed: 0.1 * 1.2
    },
    level4: {
      level: 4,
      count: 2,
      capacity: '6400',
      loadingSpeed: '5000',
      walkSpeed: 0.1 * 1.3
    },
    level5: {
      level: 5,
      count: 2,
      capacity: '7200',
      loadingSpeed: '6000',
      walkSpeed: 0.1 * 1.4
    },
    level6: {
      level: 6,
      count: 2,
      capacity: '8000',
      loadingSpeed: '7000',
      walkSpeed: 0.1 * 1.5
    },
    level7: {
      level: 7,
      count: 3,
      capacity: '8800',
      loadingSpeed: '8000',
      walkSpeed: 0.1 * 1.6
    },
    level8: {
      level: 8,
      count: 2,
      capacity: '9600',
      loadingSpeed: '9000',
      walkSpeed: 0.1 * 1.7
    },
    level9: {
      level: 9,
      count: 2,
      capacity: '10004',
      loadingSpeed: '10000',
      walkSpeed: 0.1 * 1.8
    },
    level10: {
      level: 10,
      count: 4,
      capacity: '11004',
      loadingSpeed: '11000',
      walkSpeed: 0.1 * 1.9
    },
    level11: {
      level: 11,
      count: 4,
      capacity: '12004',
      loadingSpeed: '12000',
      walkSpeed: 0.1 * 2
    }
  }
};

export const marketLevelMap = {};

export const workstationMap = {};

export const prodUpgradeMap = {
  steel: {
    base: {
      duration: '0s',
      coin: 0,
      cash: 0,
      pieActivatedTimestamp: 1538820968140
    },
    bronze: {
      duration: '30s',
      coin: 2000,
      cash: 10,
      pieActivatedTimestamp: null
    },
    silver: {
      duration: '40s',
      coin: 300000,
      cash: 20,
      pieActivatedTimestamp: null
    },
    gold: {
      duration: '50s',
      coin: 4000000,
      cash: 30,
      pieActivatedTimestamp: null
    },
    jade: {
      duration: '1m',
      coin: 500000000,
      cash: 40,
      pieActivatedTimestamp: null
    },
    ruby: {
      duration: '1m10s',
      coin: 60000000000,
      cash: 50,
      pieActivatedTimestamp: null
    }
  },
  can: {
    base: {
      duration: '0s',
      coin: 0,
      cash: 0,
      pieActivatedTimestamp: 1538820968140
    },
    bronze: {
      duration: '30s',
      coin: 2000,
      cash: 10,
      pieActivatedTimestamp: null
    },
    silver: {
      duration: '40s',
      coin: 300000,
      cash: 20,
      pieActivatedTimestamp: null
    },
    gold: {
      duration: '50s',
      coin: 4000000,
      cash: 30,
      pieActivatedTimestamp: null
    },
    jade: {
      duration: '1m',
      coin: 500000000,
      cash: 40,
      pieActivatedTimestamp: null
    },
    ruby: {
      duration: '1m10s',
      coin: 60000000000,
      cash: 50,
      pieActivatedTimestamp: null
    }
  },
  drill: {
    base: {
      duration: '0s',
      coin: 0,
      cash: 0,
      pieActivatedTimestamp: 1538820968140
    },
    bronze: {
      duration: '30s',
      coin: 2000,
      cash: 10,
      pieActivatedTimestamp: null
    },
    silver: {
      duration: '40s',
      coin: 300000,
      cash: 20,
      pieActivatedTimestamp: null
    },
    gold: {
      duration: '50s',
      coin: 4000000,
      cash: 30,
      pieActivatedTimestamp: null
    },
    jade: {
      duration: '1m',
      coin: 500000000,
      cash: 40,
      pieActivatedTimestamp: null
    },
    ruby: {
      duration: '1m10s',
      coin: 60000000000,
      cash: 50,
      pieActivatedTimestamp: null
    }
  },
  toaster: {
    base: {
      duration: '0s',
      coin: 0,
      cash: 0,
      pieActivatedTimestamp: 1538820968140
    },
    bronze: {
      duration: '30s',
      coin: 2000,
      cash: 10,
      pieActivatedTimestamp: null
    },
    silver: {
      duration: '40s',
      coin: 300000,
      cash: 20,
      pieActivatedTimestamp: null
    },
    gold: {
      duration: '50s',
      coin: 4000000,
      cash: 30,
      pieActivatedTimestamp: null
    },
    jade: {
      duration: '1m',
      coin: 500000000,
      cash: 40,
      pieActivatedTimestamp: null
    },
    ruby: {
      duration: '1m10s',
      coin: 60000000000,
      cash: 50,
      pieActivatedTimestamp: null
    }
  },
  battery: {
    base: {
      duration: '0s',
      coin: 0,
      cash: 0,
      pieActivatedTimestamp: 1538820968140
    },
    bronze: {
      duration: '30s',
      coin: 2000,
      cash: 10,
      pieActivatedTimestamp: null
    },
    silver: {
      duration: '40s',
      coin: 300000,
      cash: 20,
      pieActivatedTimestamp: null
    },
    gold: {
      duration: '50s',
      coin: 4000000,
      cash: 30,
      pieActivatedTimestamp: null
    },
    jade: {
      duration: '1m',
      coin: 500000000,
      cash: 40,
      pieActivatedTimestamp: null
    },
    ruby: {
      duration: '1m10s',
      coin: 60000000000,
      cash: 50,
      pieActivatedTimestamp: null
    }
  },
  coffee_machine: {
    base: {
      duration: '0s',
      coin: 0,
      cash: 0,
      pieActivatedTimestamp: 1538820968140
    },
    bronze: {
      duration: '30s',
      coin: 2000,
      cash: 10,
      pieActivatedTimestamp: null
    },
    silver: {
      duration: '40s',
      coin: 300000,
      cash: 20,
      pieActivatedTimestamp: null
    },
    gold: {
      duration: '50s',
      coin: 4000000,
      cash: 30,
      pieActivatedTimestamp: null
    },
    jade: {
      duration: '1m',
      coin: 500000000,
      cash: 40,
      pieActivatedTimestamp: null
    },
    ruby: {
      duration: '1m10s',
      coin: 60000000000,
      cash: 50,
      pieActivatedTimestamp: null
    }
  },
  mp3: {
    base: {
      duration: '0s',
      coin: 0,
      cash: 0,
      pieActivatedTimestamp: 1538820968140
    },
    bronze: {
      duration: '30s',
      coin: 2000,
      cash: 10,
      pieActivatedTimestamp: null
    },
    silver: {
      duration: '40s',
      coin: 300000,
      cash: 20,
      pieActivatedTimestamp: null
    },
    gold: {
      duration: '50s',
      coin: 4000000,
      cash: 30,
      pieActivatedTimestamp: null
    },
    jade: {
      duration: '1m',
      coin: 500000000,
      cash: 40,
      pieActivatedTimestamp: null
    },
    ruby: {
      duration: '1m10s',
      coin: 60000000000,
      cash: 50,
      pieActivatedTimestamp: null
    }
  },
  speaker: {
    base: {
      duration: '0s',
      coin: 0,
      cash: 0,
      pieActivatedTimestamp: 1538820968140
    },
    bronze: {
      duration: '30s',
      coin: 2000,
      cash: 10,
      pieActivatedTimestamp: null
    },
    silver: {
      duration: '40s',
      coin: 300000,
      cash: 20,
      pieActivatedTimestamp: null
    },
    gold: {
      duration: '50s',
      coin: 4000000,
      cash: 30,
      pieActivatedTimestamp: null
    },
    jade: {
      duration: '1m',
      coin: 500000000,
      cash: 40,
      pieActivatedTimestamp: null
    },
    ruby: {
      duration: '1m10s',
      coin: 60000000000,
      cash: 50,
      pieActivatedTimestamp: null
    }
  }
};
