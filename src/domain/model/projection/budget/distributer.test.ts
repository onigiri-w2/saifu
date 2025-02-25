import { MoneyFairDistributer } from './distributer';

describe('FairMoneyDistributer.distribute', () => {
  describe('[既存金額フローの合計値が分配金以上の場合] => 既存金額フローを返す', () => {
    test('amount: 500, target: [0, 0, 0, 500] => [0, 0, 0, 500]', () => {
      const sut = new MoneyFairDistributer(0);
      const amount = 500;
      const target = [0, 0, 0, 500];

      const actual = sut.distribute(amount, target);

      expect(actual).not.toBe(target);
      expect(actual).toEqual(target);
    });
  });
  describe('[分配完了後の基本日次予算より既存金が大きい日は] => 予算が1円も降りない', () => {
    test('amount: 1000, target: [0, 0, 0, 400] => [200, 200, 400, 200]', () => {
      const sut = new MoneyFairDistributer(0);
      const amount = 1000;
      const target = [0, 0, 400, 0];

      const actual = sut.distribute(amount, target);

      expect(actual).not.toBe(target);
      expect(actual).toEqual([200, 200, 400, 200]);
    });
    test('amount: 1000, target: [0, 300, 0, 400] => [150, 300, 150, 400]', () => {
      const sut = new MoneyFairDistributer(0);
      const amount = 1000;
      const target = [0, 300, 0, 400];

      const actual = sut.distribute(amount, target);

      expect(actual).not.toBe(target);
      expect(actual).toEqual([150, 300, 150, 400]);
    });
  });
  describe('[分配完了後の基本日次予算以下の既存金である日は] => 金額が日次予算に更新される', () => {
    test('amount: 1000, target: [0, 0, 0, 0] => [250, 250, 250, 250]', () => {
      const sut = new MoneyFairDistributer(0);
      const amount = 1000;
      const target = [0, 0, 0, 0];

      const actual = sut.distribute(amount, target);

      expect(actual).not.toBe(target);
      expect(actual).toEqual([250, 250, 250, 250]);
    });
    test('amount: 1000, target: [0, 100, 0, 249] => [250, 250, 250, 250]', () => {
      const sut = new MoneyFairDistributer(0);
      const amount = 1000;
      const target = [0, 100, 0, 249];

      const actual = sut.distribute(amount, target);

      expect(actual).not.toBe(target);
      expect(actual).toEqual([250, 250, 250, 250]);
    });
  });
  describe('[端数がある場合] => 一番若い日から順に最小単位（ex: 1円）ずつ足していく（予算超過日は除く）', () => {
    test('amount: 1002, target: [0, 400, 0, 0] => [201, 400, 201, 201]', () => {
      const sut = new MoneyFairDistributer(0);
      const amount = 1002;
      const target = [0, 400, 0, 0];

      const actual = sut.distribute(amount, target);

      expect(actual).not.toBe(target);
      expect(actual).toEqual([201, 400, 201, 200]);
    });
    test('amount: 1002, target: [0, 200, 0, 400] => [201, 201, 200, 400]', () => {
      const sut = new MoneyFairDistributer(0);
      const amount = 1002;
      const target = [0, 200, 0, 400];

      const actual = sut.distribute(amount, target);

      expect(actual).not.toBe(target);
      expect(actual).toEqual([201, 201, 200, 400]);
    });
  });
  describe('[基準小数点が1以上の場合] => 基準額や端数の少数点がその分低くなる', () => {
    test('fractionalDigit: 1, amount: 1.1, target: [0, 4, 0, 0] => [2.1, 4, 2.1, 2]', () => {
      const sut = new MoneyFairDistributer(1);
      const amount = 10.2;
      const target = [0, 4, 0, 0];

      const actual = sut.distribute(amount, target);

      expect(actual).not.toBe(target);
      expect(actual).toEqual([2.1, 4, 2.1, 2]);
    });
    test('fractionalDigit: 2, amount: 1.02, target: [0, 0.2, 0, 0.4] => [0.21, 0.21, 0.2, 0.4]', () => {
      const sut = new MoneyFairDistributer(2);
      const amount = 1.02;
      const target = [0, 0.2, 0, 0.4];

      const actual = sut.distribute(amount, target);

      expect(actual).not.toBe(target);
      expect(actual).toEqual([0.21, 0.21, 0.2, 0.4]);
    });
  });
  describe('その他', () => {
    describe('[分配額が0の場合] => 何も分配しない', () => {
      test('amount: 0, target: [0, 200, 0, 0] => [0, 200, 0, 0]', () => {
        const sut = new MoneyFairDistributer(0);
        const amount = 0;
        const target = [0, 200, 0, 0];

        const actual = sut.distribute(amount, target);

        expect(actual).not.toBe(target);
        expect(actual).toEqual(target);
      });
    });

    describe('[targetが1要素だけの場合] => 予算が正確に適用', () => {
      test('amount: 1000, target: [0] => [1000]', () => {
        const sut = new MoneyFairDistributer(0);
        const amount = 1000;
        const target = [0];

        const actual = sut.distribute(amount, target);

        expect(actual).not.toBe(target);
        expect(actual).toEqual([1000]);
      });
      test('amount: 200, target: [1000] => [1000]', () => {
        const sut = new MoneyFairDistributer(0);
        const amount = 200;
        const target = [1000];

        const actual = sut.distribute(amount, target);

        expect(actual).not.toBe(target);
        expect(actual).toEqual([1000]);
      });
    });
    describe('[(適当) ランダムな金額フローの場合] => いい感じに分配される', () => {
      test('amount: 1000, target: [100, 0, 0, 400] => [200, 200, 200, 400]', () => {
        const sut = new MoneyFairDistributer(0);
        const amount = 1000;
        const target = [100, 0, 0, 400];

        const actual = sut.distribute(amount, target);

        expect(actual).not.toBe(target);
        expect(actual).toEqual([200, 200, 200, 400]);
      });
    });
  });
});
