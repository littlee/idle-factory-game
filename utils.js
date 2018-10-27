export function formatBigNum(bigNum) {
  if (bigNum.round) {
    bigNum = bigNum.round();
  }
  let numStr = bigNum.toString();
  const UNITS = ['', 'K', 'M', 'B', 'T', 'aa', 'ab', 'ac', 'ad'];
  const UNIT_CARRTY = 3;
  const DIGITS_LEN = 3;

  let zeroPadCount = 0;
  while (numStr.length % UNIT_CARRTY !== 0) {
    numStr = `0${numStr}`;
    zeroPadCount++;
  }

  let unitIndex = Math.floor(numStr.length / UNIT_CARRTY) - 1;
  let unit = UNITS[unitIndex];
  let digits = numStr.slice(zeroPadCount, zeroPadCount + DIGITS_LEN);

  if (unit && zeroPadCount > 0) {
    digits = digits.slice(0, -zeroPadCount) + '.' + digits.slice(-zeroPadCount);
  }
  return `${digits}${unit}`;
}


function padZero(num) {
  if (`${num}`.length < 2) {
    num = `0${num}`;
  }
  return num;
}

export function formatSec(sec) {
  let min = Math.floor(sec / 60);

  sec = sec % 60;

  return `${padZero(min)}:${padZero(sec)}`;
}

export function arrayIntersect(a, b) {
  return a.filter(item => b.indexOf(item) !== -1);
}

// all Big 一分钟每个market worker的最大运输现金
export function getMrtMaxCashSpeed(allTime, transCapacity) {
  return Big(60).div(allTime).times(transCapacity); // eslint-disable-line
}

// 单位是s
export function getMrtWorkerTimePerRound(workstationCount, transCapacity, loadSpeed, walkSpeed) {
  let loadingTime = transCapacity.div(loadSpeed).times(2);
  let walkTime = workstationCount.div(walkSpeed).times(2);
  return loadingTime.plus(walkTime);
}

// 闲置现金计算, 没用excel的。根据一分钟每个market worker的最大运输现金 * marker worker的HC得出
export function getCashProduceSpeed(marketMaxCash, mWorkerCount) {
  return marketMaxCash.times(mWorkerCount);
}
