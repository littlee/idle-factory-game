import range from '../js/libs/_/range';
export const LevelMap = {
  warehouse: range(20).reduce((prev, curr, index) => {
    prev[`level${index + 1}`] = {
      level: index + 1,
      count: Math.floor(index / 2) + 1,
      capacity: 4000 + index * 600 + '',
      loadingSpeed: 2000 + index * 1000 + '',
      walkSpeed: 0.05 * (1 + index),
      coinNeeded: 2000 * index + ''
    };
    return prev;
  }, {}),

  market: range(20).reduce((prev, curr, index) => {
    prev[`level${index + 1}`] = {
      level: index + 1,
      count:  Math.floor(index / 2) + 1,
      capacity: 4000 + index * 800 + '',
      loadingSpeed: 2000 + index * 1000 + '',
      walkSpeed: 0.03 * (1 + index),
      coinNeeded: 3000 * index + ''
    };
    return prev;
  }, {}),

  workstation: range(20).reduce((prev, curr, index) => {
    prev[`level${index + 1}`] = {
      level: index + 1,
      count: index + 1,
      input: 10000 + 1000 * index + '',
      output: 10000 + 1000 * index + '',
      power: 1000 + 100 * index + '',
      coinNeeded: 1000 * index + '',
    };
    return prev;
  }, {}),
};

export let prodUpgradeMap = {
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
  coffeeMachine: {
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
  },
  plasticBar: {
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
  wheel: {
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
  screen: {
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
  phone: {
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
  circuit: {
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
  tv: {
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
  computer: {
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
  vr: {
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
  engine: {
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
  solarPanel: {
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
  car: {
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
  telescope: {
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
  projector: {
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
  headset: {
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
  walkieTalkie: {
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
  radio: {
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
};
