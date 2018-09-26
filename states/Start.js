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
    this.load.image('btn_buy_ws_cash', 'images/btn_buy_ws_cash.png');
    this.load.image('btn_buy_ws_super_cash', 'images/btn_buy_ws_super_cash.png');
    this.load.image('btn_cash', 'images/btn_cash.png');
    this.load.image('btn_idle_cash', 'images/btn_idle_cash.png');
    this.load.image('btn_level', 'images/btn_level.png');
    this.load.image('btn_product_holder', 'images/btn_product_holder.png');
    this.load.image('btn_super_cash', 'images/btn_super_cash.png');
    this.load.image('ground_level_1', 'images/ground_level_1.png');
    this.load.image('icon_level_up', 'images/icon_level_up.png');
    this.load.image('market_truck', 'images/market_truck.png');
    this.load.image('mgr_market', 'images/mgr_market.png');
    this.load.image('mgr_warehouse', 'images/mgr_warehouse.png');
    this.load.image('mgr_worker', 'images/mgr_worker.png');
    this.load.image('source_ore', 'images/source_ore.png');
    this.load.image('source_steel', 'images/source_steel.png');
    this.load.image('table_cover', 'images/table_cover.png');
    this.load.image('table_level_1', 'images/table_level_1.png');
    this.load.image('wall', 'images/wall.png');
    this.load.image('warehouse_table', 'images/warehouse_table.png');
    this.load.spritesheet('worker_market', 'images/worker_market.png', 84, 126);
    this.load.spritesheet('worker_warehouse', 'images/worker_warehouse.png', 84, 126);
    this.load.spritesheet('worker', 'images/worker.png', 96, 110);
    this.load.image('arrow_fast_scroll', 'images/arrow_fast_scroll.png');

    this.load.image('test_ground', 'test/Ground00_88400421.png');
    this.load.image('test_wall', 'test/WallWide_88400188.png');
    this.load.image('test_iconEgg', 'test/Egg_Base.png');
    this.load.image('test_panel', 'test/act_rule_frame.png');
    this.load.image('test_txt', 'test/act_rule_text.png');
    // try
    this.load.image('btn_close', 'images/btn_close.png');
    this.load.image('avatar_tran_warehose', 'images/avatar_transporter.png');
    this.load.image('arrow_levelUp', 'images/arrow_level_upgrade.png');
    this.load.image('icon_loading_speed', 'images/icon_loading_speed.png');
    this.load.image('icon_transporter', 'images/icon_transporter.png');
    this.load.image('icon_walk_speed', 'images/icon_walk_speed.png');
    this.load.image('icon_max_resource', 'images/icon_max_resource.png');
    this.load.image('icon_transporter_capacity', 'images/icon_transporter_capacity.png');
    this.load.image('icon_money_transported', 'images/icon_money_transported.png');
    this.load.image('btn_level_upgrade', 'images/btn_level_upgrade.png');
    this.load.image('btn_pick_upgrade', 'images/btn_activated.png');
    this.load.image('avatar_tran_market', 'images/avatar_market_transporter.png');
  }

  create() {
    this.state.start('Game');
    // this.state.start('Test');

    // console.log(formatBigNum(Big('123456789123456789')))
  }
}

export default Start;
