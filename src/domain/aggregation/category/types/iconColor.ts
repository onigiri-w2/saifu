export const iconColors = [
  '#E53E3E', // レッド
  '#FD79A8', // ピンク
  '#F35F00', // オレンジ
  '#FFB700', // ゴールド
  '#9C5221', // ブラウン
  '#2ECD71', // グリーン
  '#0F9B8E', // ティール
  '#0CB7E4', // シアン
  '#0066CC', // ブルー
  '#952BA3', // ディープマゼンタパープル（赤紫）
  '#8491A3', // グレー
  '#2D3748', // ブラック
] as const;
export type IconColor = (typeof iconColors)[number];
