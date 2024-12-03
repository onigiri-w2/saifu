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
    let maxY = Math.max(...points.map((p) => p.value));
    if (maxY < WrappedYScale.MIN_VALUE) maxY = WrappedYScale.MIN_VALUE;

    const upperBound = this.roundToSignificantDigit(maxY);
    this.scale = scaleLinear()
      .domain([0, upperBound])
      .range([height - padding.bottom, padding.top]);
  }

  // 後で移動
  private roundToSignificantDigit(value: number) {
    if (value === 0) return 0;
    if (value === Infinity) return Infinity;

    // 小数点以下の桁数を求める
    const numbers = String(value).split('.');
    const decimalCount = numbers[1] ? numbers[1].length : 0;
    if (decimalCount === 0) {
      const magnitude = Math.pow(10, Math.floor(Math.log10(value))) / 10;
      return Math.ceil(value / magnitude) * magnitude;
    } else {
      const multiplier = Math.pow(10, decimalCount - 1);
      return Math.ceil(value * multiplier) / multiplier;
    }
  }
}

export type Scale = {
  xScale: WrappedXScale;
  yScale: WrappedYScale;
};
