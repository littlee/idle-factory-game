import Bell from './Bell';

/* 
- 15 分钟冷却
- 30 秒持续效果
 */

class BellRed extends Bell {
  constructor(game, x, y) {
    super(game, x, y, 'red');
  }
}


export default BellRed;