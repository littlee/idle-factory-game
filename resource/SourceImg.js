import Production from '../store/Production';

const SOURCE_IMG_MAP = {
  ore: 'reso_ore',
  copper: 'reso_copper',
  barrel: 'reso_barrel',
  plug: 'reso_plug',
  aluminium: 'reso_aluminium',
  rubber: 'reso_rubber',

  steel: [
    'prod_steel',
    'prod_steel_bronze',
    'prod_steel_silver',
    'prod_steel_gold',
    'prod_steel_jade',
    'prod_steel_ruby'
  ],
  can: [
    'prod_can',
    'prod_can_bronze',
    'prod_can_silver',
    'prod_can_gold',
    'prod_can_jade',
    'prod_can_ruby'
  ],
  drill: [
    'prod_drill',
    'prod_drill_bronze',
    'prod_drill_silver',
    'prod_drill_gold',
    'prod_drill_jade',
    'prod_drill_ruby'
  ],
  toaster: [
    'prod_toaster',
    'prod_toaster_bronze',
    'prod_toaster_silver',
    'prod_toaster_gold',
    'prod_toaster_jade',
    'prod_toaster_ruby'
  ],
  battery: [
    'prod_battery',
    'prod_battery_bronze',
    'prod_battery_silver',
    'prod_battery_gold',
    'prod_battery_jade',
    'prod_battery_ruby'
  ],
  coffee_machine: [
    'prod_coffee_machine',
    'prod_coffee_machine_bronze',
    'prod_coffee_machine_silver',
    'prod_coffee_machine_gold',
    'prod_coffee_machine_jade',
    'prod_coffee_machine_ruby'
  ],
  mp3: [
    'prod_mp3',
    'prod_mp3_bronze',
    'prod_mp3_silver',
    'prod_mp3_gold',
    'prod_mp3_jade',
    'prod_mp3_ruby'
  ],
  speaker: [
    'prod_speaker',
    'prod_speaker_bronze',
    'prod_speaker_silver',
    'prod_speaker_gold',
    'prod_speaker_jade',
    'prod_speaker_ruby'
  ]
};

const SourceImg = {
  get(key) {
    let img = SOURCE_IMG_MAP[key];
    if (Array.isArray(img)) {
      let level = Production.getLevelByKey(key);
      return img[level];
    } else {
      return img;
    }
  }
};


export default SourceImg;
