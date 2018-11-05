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
  coffeeMachine: [
    'prod_coffeeMachine',
    'prod_coffeeMachine_bronze',
    'prod_coffeeMachine_silver',
    'prod_coffeeMachine_gold',
    'prod_coffeeMachine_jade',
    'prod_coffeeMachine_ruby'
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
  ],
  car: [
    'prod_car',
    'prod_car_bronze',
    'prod_car_silver',
    'prod_car_gold',
    'prod_car_jade',
    'prod_car_ruby'
  ],
  circuit: [
    'prod_circuit',
    'prod_circuit_bronze',
    'prod_circuit_silver',
    'prod_circuit_gold',
    'prod_circuit_jade',
    'prod_circuit_ruby'
  ],
  computer: [
    'prod_computer',
    'prod_computer_bronze',
    'prod_computer_silver',
    'prod_computer_gold',
    'prod_computer_jade',
    'prod_computer_ruby'
  ],
  engine: [
    'prod_engine',
    'prod_engine_bronze',
    'prod_engine_silver',
    'prod_engine_gold',
    'prod_engine_jade',
    'prod_engine_ruby'
  ],
  headset: [
    'prod_headset',
    'prod_headset_bronze',
    'prod_headset_silver',
    'prod_headset_gold',
    'prod_headset_jade',
    'prod_headset_ruby'
  ],
  phone: [
    'prod_phone',
    'prod_phone_bronze',
    'prod_phone_silver',
    'prod_phone_gold',
    'prod_phone_jade',
    'prod_phone_ruby'
  ],
  plasticBar: [
    'prod_plasticBar',
    'prod_plasticBar_bronze',
    'prod_plasticBar_silver',
    'prod_plasticBar_gold',
    'prod_plasticBar_jade',
    'prod_plasticBar_ruby'
  ],
  projector: [
    'prod_projector',
    'prod_projector_bronze',
    'prod_projector_silver',
    'prod_projector_gold',
    'prod_projector_jade',
    'prod_projector_ruby'
  ],
  radio: [
    'prod_radio',
    'prod_radio_bronze',
    'prod_radio_silver',
    'prod_radio_gold',
    'prod_radio_jade',
    'prod_radio_ruby'
  ],
  screen: [
    'prod_screen',
    'prod_screen_bronze',
    'prod_screen_silver',
    'prod_screen_gold',
    'prod_screen_jade',
    'prod_screen_ruby'
  ],
  solarPanel: [
    'prod_solarPanel',
    'prod_solarPanel_bronze',
    'prod_solarPanel_silver',
    'prod_solarPanel_gold',
    'prod_solarPanel_jade',
    'prod_solarPanel_ruby'
  ],
  telescope: [
    'prod_telescope',
    'prod_telescope_bronze',
    'prod_telescope_silver',
    'prod_telescope_gold',
    'prod_telescope_jade',
    'prod_telescope_ruby'
  ],
  tv: [
    'prod_tv',
    'prod_tv_bronze',
    'prod_tv_silver',
    'prod_tv_gold',
    'prod_tv_jade',
    'prod_tv_ruby'
  ],
  vr: [
    'prod_vr',
    'prod_vr_bronze',
    'prod_vr_silver',
    'prod_vr_gold',
    'prod_vr_jade',
    'prod_vr_ruby'
  ],
  walkieTalkie: [
    'prod_walkieTalkie',
    'prod_walkieTalkie_bronze',
    'prod_walkieTalkie_silver',
    'prod_walkieTalkie_gold',
    'prod_walkieTalkie_jade',
    'prod_walkieTalkie_ruby'
  ],
  wheel: [
    'prod_wheel',
    'prod_wheel_bronze',
    'prod_wheel_silver',
    'prod_wheel_gold',
    'prod_wheel_jade',
    'prod_wheel_ruby'
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
