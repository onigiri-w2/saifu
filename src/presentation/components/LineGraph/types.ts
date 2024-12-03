export type Padding = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};
export type EnsuredPadding = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export interface ISeries<T> {
  maxVal: () => number;
  length: number;
  divideBy: (key: T) => { left: ISeries<T>; right: ISeries<T>; divideIndex: number };
  values: number[];
}
