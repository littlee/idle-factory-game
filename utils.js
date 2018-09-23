export function formatBigNum(bigNum) {
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
