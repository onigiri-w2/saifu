import { scaleLinear, ScaleLinear } from 'd3';

import { EnsuredPadding } from '../../types';

import { TimePoint } from './timepoint';

export class WrappedXScale {
  public readonly scale!: ScaleLinear<number, number, never>;
  constructor(points: TimePoint[], width: number) {
    this.scale = scaleLinear()
      .domain([0, points.length - 1])
      .range([0, width]);
  }
}

export class WrappedYScale {
  static MIN_VALUE = 10000;
  public readonly scale!: ScaleLinear<number, number, never>;
  constructor(points: TimePoint[], height: number, padding: EnsuredPadding) {
    const values = points.map((p) => p.value);
    let minY = Math.min(...values);
    let maxY = Math.max(...values);

    if (maxY < WrappedYScale.MIN_VALUE) {
      maxY = WrappedYScale.MIN_VALUE;
      minY = 0;
    }

    // 1. maxの調整値を計算
    const roundedMax = this.roundToSignificantDigit(maxY, 'ceil');

    // 2. 差分を計算し、その調整値を計算
    const diff = maxY - minY;
    const roundedDiff = this.roundToSignificantDigit(diff, 'floor');

    // 3. minを計算
    const roundedMin = roundedMax - roundedDiff;

    this.scale = scaleLinear()
      .domain([roundedMin, roundedMax])
      .range([height - padding.bottom, padding.top]);
  }

  private roundToSignificantDigit(value: number, direction: 'floor' | 'ceil' = 'ceil') {
    if (value === 0) return 0;
    if (value === Infinity) return Infinity;
    if (value === -Infinity) return -Infinity;

    const absValue = Math.abs(value);
    const magnitude = Math.pow(10, Math.floor(Math.log10(absValue)) - 1); // 1桁小さい単位で丸める

    // データの変動をより見やすくするため、丸め後の値を調整
    const roundedValue =
      direction === 'ceil' ? Math.ceil(value / magnitude) * magnitude : Math.floor(value / magnitude) * magnitude;

    // 丸めた結果と元の値との差が大きすぎる場合は、さらに調整
    const difference = Math.abs(roundedValue - value);
    if (difference / value > 0.2) {
      // 差が20%以上ある場合
      const finerMagnitude = magnitude / 2; // より細かい単位で再度丸める
      return direction === 'ceil'
        ? Math.ceil(value / finerMagnitude) * finerMagnitude
        : Math.floor(value / finerMagnitude) * finerMagnitude;
    }

    return roundedValue;
  }
}

export type Scale = {
  xScale: WrappedXScale;
  yScale: WrappedYScale;
};
