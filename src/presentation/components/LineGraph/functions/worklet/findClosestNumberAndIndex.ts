export function findClosestNumberAndIndex(sortedNumbers: number[], target: number): { value: number; index: number } {
  'worklet';
  // 配列が空の場合はnullを返す
  if (sortedNumbers.length === 0) throw new Error('Array is empty');

  // 配列の長さが1の場合は最初の要素とインデックス0を返す
  if (sortedNumbers.length === 1) return { value: sortedNumbers[0], index: 0 };

  // 二分探索のための左右のインデックス
  let left = 0;
  let right = sortedNumbers.length - 1;

  while (left <= right) {
    // 中央のインデックスを計算
    const mid = Math.floor((left + right) / 2);

    // 中央の値が目標値と一致する場合、その値とインデックスを返す
    if (sortedNumbers[mid] === target) {
      return { value: sortedNumbers[mid], index: mid };
    }

    // 目標値が中央値より小さい場合、右側を狭める
    if (target < sortedNumbers[mid]) {
      right = mid - 1;
    }
    // 目標値が中央値より大きい場合、左側を狭める
    else {
      left = mid + 1;
    }
  }

  // 探索が終了した時点で、leftとrightは隣接しているか、
  // または入れ替わっている。どちらの値が目標値に近いかを判断する。
  if (right < 0) return { value: sortedNumbers[left], index: left };
  if (left >= sortedNumbers.length) {
    return { value: sortedNumbers[right], index: right };
  }

  if (Math.abs(sortedNumbers[left] - target) < Math.abs(sortedNumbers[right] - target)) {
    return { value: sortedNumbers[left], index: left };
  } else {
    return { value: sortedNumbers[right], index: right };
  }
}
