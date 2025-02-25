import { assert } from '@/src/utils/errors';

export class MoneyFairDistributer {
  constructor(private readonly fractionalDigits: number) {
    assert(fractionalDigits >= 0 && fractionalDigits <= 6, 'fractionalDigits は0以上6以下である必要があります');
  }
  private get scaleFactor(): number {
    return Math.pow(10, this.fractionalDigits);
  }

  distribute(amount: number, target: readonly number[]) {
    // 入力値の検証
    assert(target.length > 0, '分配対象が空です');
    assert(!target.some((n) => n < 0), '分配対象に負の値が含まれています');

    // スケーリング処理（小数点以下の桁数に応じて整数に変換。最後に戻す）
    const scaledAmount = Math.round(amount * this.scaleFactor);
    const scaledTarget = target.map((n) => Math.round(n * this.scaleFactor));

    // 対象の合計が分配額以上なら、そのまま返却
    const sumOfTarget = scaledTarget.reduce((acc, cur) => acc + cur, 0);
    if (sumOfTarget >= scaledAmount) return [...target];

    // 基準額を超過する対象のインデックスを管理
    const exceedIndexes = new Set<number>();
    // 対象を降順でソート（インデックスも保持）
    const sortedTarget = [...scaledTarget]
      .map((value, initialIndex) => ({ value, initialIndex }))
      .sort((a, b) => b.value - a.value);

    // 初期の一人当たり基準額を計算
    let baseDaily = Math.floor(scaledAmount / target.length);

    // 基準額を超過する対象を特定し、残りの対象での再計算を繰り返す
    for (let i = 0; i < sortedTarget.length; i++) {
      const diff = baseDaily - sortedTarget[i].value;
      if (diff >= 0) break;
      exceedIndexes.add(sortedTarget[i].initialIndex);
      const exceededSum = [...exceedIndexes].reduce((acc, j) => acc + scaledTarget[j], 0);
      const remainingDays = target.length - exceedIndexes.size;
      if (remainingDays > 0) {
        baseDaily = Math.floor((scaledAmount - exceededSum) / remainingDays);
      }
    }

    const result = [...scaledTarget];
    let remainder =
      scaledAmount -
      (target.length - exceedIndexes.size) * baseDaily -
      [...exceedIndexes].reduce((acc, i) => acc + scaledTarget[i], 0);

    // 端数を1ずつ分配
    for (let i = 0; i < target.length; i++) {
      if (exceedIndexes.has(i)) continue;
      const df = remainder > 0 ? 1 : 0;
      result[i] = baseDaily + df;
      remainder -= 1;
    }

    // スケールを戻して返却
    return result.map((n) => n / this.scaleFactor);
  }
}
