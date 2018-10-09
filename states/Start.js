import serverConfig from '../server_config';
// import Big from '../js/libs/big.min.js';
// import { formatBigNum } from '../utils';

class Start extends window.Phaser.State {
  init() {
    this.stage.backgroundColor = '#fff';
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  preload() {
    this.load.baseURL = serverConfig.BASE_URL;

    this.load.image('arrow', 'images/icon_level_up.png');
    this.load.image('bell_base', 'images/bell_base.png');
    this.load.image('bell_body_red', 'images/bell_body_red.png');
    this.load.image('bell_body_yellow', 'images/bell_body_yellow.png');
    this.load.image('bell_handle_red', 'images/bell_handle_red.png');
    this.load.image('bell_handle_yellow', 'images/bell_handle_yellow.png');
    this.load.image('bell_hole', 'images/bell_hole.png');
    this.load.image('bell_timer', 'images/bell_timer.png');
    this.load.spritesheet('box_collect_holder', 'images/box_collect_holder.png', 75, 75);
    this.load.image('box_collect', 'images/box_collect.png');
    this.load.image('btn_blueprint', 'images/btn_blueprint.png');
    this.load.image('btn_buy_ws_cash', 'images/btn_buy_ws_cash.png');
    this.load.image('btn_buy_ws_super_cash', 'images/btn_buy_ws_super_cash.png');
    this.load.image('btn_cash', 'images/btn_cash.png');
    this.load.image('btn_idle_cash', 'images/btn_idle_cash.png');
    this.load.image('btn_level', 'images/btn_level.png');
    this.load.image('btn_product_holder', 'images/btn_product_holder.png');
    this.load.image('btn_shop', 'images/btn_shop.png');
    this.load.image('btn_super_cash', 'images/btn_super_cash.png');
    this.load.image('btn_wheel_coin', 'images/btn_wheel_coin.png');
    this.load.image('btn_x_cash', 'images/btn_x_cash.png');
    this.load.image('ground_level_1', 'images/ground_level_1.png');
    this.load.image('icon_level_up', 'images/icon_level_up.png');
    this.load.image('market_truck', 'images/market_truck.png');
    this.load.image('mgr_market', 'images/mgr_market.png');
    this.load.image('mgr_warehouse', 'images/mgr_warehouse.png');
    this.load.image('mgr_worker', 'images/mgr_worker.png');
    this.load.image('table_cover', 'images/table_cover.png');
    this.load.image('table_level_1', 'images/table_level_1.png');
    this.load.image('wall', 'images/wall.png');
    this.load.image('warehouse_table', 'images/warehouse_table.png');
    this.load.spritesheet('worker_market', 'images/worker_market.png', 84, 126);
    this.load.spritesheet('worker_warehouse', 'images/worker_warehouse.png', 84, 126);
    this.load.spritesheet('worker', 'images/worker.png', 96, 110);
    this.load.image('arrow_fast_scroll', 'images/arrow_fast_scroll.png');

    // reso
    this.load.image('reso_ore', 'images/material/IronOre_Base.png');
    this.load.image('reso_barrel', 'images/material/Barrel_Base.png');
    this.load.image('reso_copper', 'images/material/Copper_Base.png');
    this.load.image('reso_plug', 'images/material/ElectricDevice_Base.png');
    this.load.image('reso_aluminium', 'images/material/Aluminium_Base.png');
    this.load.image('reso_rubber', 'images/material/Rubber_Base.png');

    // prod
    this.load.image('prod_steel', 'images/material/Steel_Base.png');
    this.load.image('prod_steel_bronze', 'images/material/Steel_Bronze.png');
    this.load.image('prod_steel_silver', 'images/material/Steel_Silver.png');
    this.load.image('prod_steel_gold', 'images/material/Steel_Gold.png');
    this.load.image('prod_steel_jade', 'images/material/Steel_Jade.png');
    this.load.image('prod_steel_ruby', 'images/material/Steel_Ruby.png');

    this.load.image('prod_can', 'images/material/Can_Base.png');
    this.load.image('prod_can_bronze', 'images/material/Can_Bronze.png');
    this.load.image('prod_can_silver', 'images/material/Can_Silver.png');
    this.load.image('prod_can_gold', 'images/material/Can_Gold.png');
    this.load.image('prod_can_jade', 'images/material/Can_Jade.png');
    this.load.image('prod_can_ruby', 'images/material/Can_Ruby.png');

    this.load.image('prod_drill', 'images/material/Drill_Base.png');
    this.load.image('prod_drill_bronze', 'images/material/Drill_Bronze.png');
    this.load.image('prod_drill_silver', 'images/material/Drill_Silver.png');
    this.load.image('prod_drill_gold', 'images/material/Drill_Gold.png');
    this.load.image('prod_drill_jade', 'images/material/Drill_Jade.png');
    this.load.image('prod_drill_ruby', 'images/material/Drill_Ruby.png');

    this.load.image('prod_toaster', 'images/material/Toaster_Base.png');
    this.load.image('prod_toaster_bronze', 'images/material/Toaster_Bronze.png');
    this.load.image('prod_toaster_silver', 'images/material/Toaster_Silver.png');
    this.load.image('prod_toaster_gold', 'images/material/Toaster_Gold.png');
    this.load.image('prod_toaster_jade', 'images/material/Toaster_Jade.png');
    this.load.image('prod_toaster_ruby', 'images/material/Toaster_Ruby.png');

    this.load.image('prod_battery', 'images/material/Battery_Base.png');
    this.load.image('prod_battery_bronze', 'images/material/Battery_Bronze.png');
    this.load.image('prod_battery_silver', 'images/material/Battery_Silver.png');
    this.load.image('prod_battery_gold', 'images/material/Battery_Gold.png');
    this.load.image('prod_battery_jade', 'images/material/Battery_Jade.png');
    this.load.image('prod_battery_ruby', 'images/material/Battery_Ruby.png');

    this.load.image('prod_coffee_machine', 'images/material/CoffeeMachine_Base.png');
    this.load.image('prod_coffee_machine_bronze', 'images/material/CoffeeMachine_Bronze.png');
    this.load.image('prod_coffee_machine_silver', 'images/material/CoffeeMachine_Silver.png');
    this.load.image('prod_coffee_machine_gold', 'images/material/CoffeeMachine_Gold.png');
    this.load.image('prod_coffee_machine_jade', 'images/material/CoffeeMachine_Jade.png');
    this.load.image('prod_coffee_machine_ruby', 'images/material/CoffeeMachine_Ruby.png');

    this.load.image('prod_mp3', 'images/material/MP3_Base.png');
    this.load.image('prod_mp3_bronze', 'images/material/MP3_Bronze.png');
    this.load.image('prod_mp3_silver', 'images/material/MP3_Silver.png');
    this.load.image('prod_mp3_gold', 'images/material/MP3_Gold.png');
    this.load.image('prod_mp3_jade', 'images/material/MP3_Jade.png');
    this.load.image('prod_mp3_ruby', 'images/material/MP3_Ruby.png');

    this.load.image('prod_speaker', 'images/material/Speaker_Base.png');
    this.load.image('prod_speaker_bronze', 'images/material/Speaker_Bronze.png');
    this.load.image('prod_speaker_silver', 'images/material/Speaker_Silver.png');
    this.load.image('prod_speaker_gold', 'images/material/Speaker_Gold.png');
    this.load.image('prod_speaker_jade', 'images/material/Speaker_Jade.png');
    this.load.image('prod_speaker_ruby', 'images/material/Speaker_Ruby.png');

    this.load.image('test_ground', 'test/Ground00_88400421.png');
    this.load.image('test_wall', 'test/WallWide_88400188.png');
    this.load.image('test_iconEgg', 'test/Egg_Base.png');
    this.load.image('test_panel', 'test/act_rule_frame.png');
    this.load.image('test_txt', 'test/act_rule_text.png');
    // try
    this.load.image('ad_campaign', 'images/ad_campaign.png');
    this.load.image('arrow_levelUp', 'images/arrow_level_upgrade.png');
    this.load.image('avatar_tran_market', 'images/avatar_market_transporter.png');
    this.load.image('avatar_tran_warehose', 'images/avatar_transporter.png');
    this.load.image('avatar_worker', 'images/avatar_worker.png');
    this.load.image('bg_base', 'images/background_base.png');
    this.load.image('bg_bronze', 'images/background_copper.png');
    this.load.image('bg_gold', 'images/background_gold.png');
    this.load.image('bg_jade', 'images/background_jade.png');
    this.load.image('bg_ruby', 'images/background_ruby.png');
    this.load.image('bg_silver', 'images/background_silver.png');
    this.load.image('btn_close', 'images/btn_close.png');
    this.load.image('btn_cash_able2buy', 'images/btn_cash_able2buy.png');
    this.load.image('btn_cash_unable2buy', 'images/btn_cash_unable2buy.png');
    this.load.image('btn_watch_ad', 'images/btn_watch_ad.png');
    this.load.image('btn_level_upgrade', 'images/btn_level_upgrade.png');
    this.load.image('btn_level_upgrade_unable', 'images/btn_level_upgrade_unable.png');
    this.load.image('btn_pick_upgrade', 'images/btn_activated.png');
    this.load.image('btn_research_update', 'images/btn_research_update.png');
    this.load.image('btn_research_skip', 'images/btn_research_skip.png');
    this.load.image('btn_research_update_disable', 'images/btn_research_update_disable.png');
    this.load.image('bubble_percentage', 'images/bubble_percentage.png');
    this.load.image('clock_yellow', 'images/clock_yellow.png');
    this.load.image('progressBarSaleBoost', 'images/progressBarSaleBoost.png');
    this.load.image('icon_loading_speed', 'images/icon_loading_speed.png');
    this.load.image('icon_transporter', 'images/icon_transporter.png');
    this.load.image('icon_walk_speed', 'images/icon_walk_speed.png');
    this.load.image('icon_max_resource', 'images/icon_max_resource.png');
    this.load.image('icon_transporter_capacity', 'images/icon_transporter_capacity.png');
    this.load.image('icon_money_transported', 'images/icon_money_transported.png');
    this.load.image('icon_tick', 'images/icon_tick.png');
    this.load.image('icon_ore', 'images/icon_ore.png');
    this.load.image('icon_power', 'images/icon_power.png');
  }

  create() {
    this.state.start('Game');
    // this.state.start('Test');

    // console.log(formatBigNum(Big('123456789123456789')))
  }
}

export default Start;
