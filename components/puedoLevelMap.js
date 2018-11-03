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
			count: Math.floor(index / 2) + 1,
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
			coinNeeded: 1000 * index + ''
		};
		return prev;
	}, {})
};

const TEXTURE_INFO_MAP = [
	{
		name: 'base',
    pieActivatedTimestamp: 1538820968140,
    coin: 0,
    cash: 0,
    duration: 0 // 最终需要有单位, 处理成 '0s'
	},
	{
		name: 'bronze',
    pieActivatedTimestamp: null,
    coin: 2000,
    cash: 100,
    duration: 30
	},
	{
		name: 'silver',
    pieActivatedTimestamp: null,
    coin: 400000,
    cash: 100,
    duration: 60
	},
	{
		name: 'gold',
    pieActivatedTimestamp: null,
    coin: 60000000,
    cash: 300,
    duration: 70
	},
	{
		name: 'jade',
    pieActivatedTimestamp: null,
    coin: 8000000000,
    cash: 400,
    duration: 80
	},
	{
		name: 'ruby',
    pieActivatedTimestamp: null,
    coin: 1000000000,
    cash: 500,
    duration: 90
	}
];
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

// 每个texture需要的数据：
/* base: {
  duration: '0s',
  coin: 0,
  cash: 0,
  pieActivatedTimestamp: 1538820968140
}, */
export let prodUpgradeMap = PROD_LIST.reduce((prev, curr, index) => {
  prev[curr] = TEXTURE_INFO_MAP.reduce((prev, curr, idx) => {
    prev[curr.name] = {
      pieActivatedTimestamp: curr.pieActivatedTimestamp,
      coin: `${curr.coin * (index + 1)}`,
      cash: curr.cash,
      duration: `${curr.duration * (1 + Math.floor(index / 4))}s`
    };
    return prev;
  }, {});
  return prev;
}, {});
