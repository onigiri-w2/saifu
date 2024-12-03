import { HashMap } from '@/src/utils/collections';

import LocalDate from './localdate';

class DateNumberMap {
  private constructor(private readonly map: HashMap<LocalDate, number>) {}

  getValue(date: LocalDate): number | undefined {
    return this.map.get(date);
  }

  updateAt(date: LocalDate, val: number): DateNumberMap {
    const copied = new HashMap(this.map);
    copied.set(date, val);
    return new DateNumberMap(copied);
  }
  updateSome(map: HashMap<LocalDate, number>): DateNumberMap {
    const copied = new HashMap(this.map);
    map.forEach((value, key) => {
      copied.set(key, value);
    });
    return new DateNumberMap(copied);
  }
  deleteAt(date: LocalDate): DateNumberMap {
    const copied = new HashMap(this.map);
    copied.delete(date);
    return DateNumberMap.build(copied);
  }

  getMap(): HashMap<LocalDate, number> {
    // TODO: コピーして渡した方がいい。危険。
    return this.map;
  }

  merge(other: DateNumberMap): DateNumberMap {
    return this.updateSome(other.map);
  }

  /**
   * 期間内のデータを抽出する
   * Note1: fromがtoより後の日付だった場合、空のDateNumberMapを返す
   * Note2: from, toの期間がmapの範囲を超えている場合、超えている部分は無視される
   * @param from 開始日
   * @param to 終了日
   * @returns DateNumberMap
   */
  extract(from: LocalDate, to: LocalDate): DateNumberMap {
    if (from.isAfterThan(to)) return DateNumberMap.empty();

    const result = new HashMap<LocalDate, number>();
    for (const [date, val] of this._entries()) {
      if (date.isIncludedIn(from, to)) {
        result.set(date, val);
      }
    }
    return new DateNumberMap(result);
  }

  values() {
    return this.map.values();
  }
  dates(): LocalDate[] {
    return Array.from(this.map.strKeys()).map((key) => LocalDate.decode(key));
  }

  calcTotal(): number {
    let total = 0;
    for (const value of this.map.values()) {
      total += value;
    }
    return total;
  }

  genList(): { localdate: LocalDate; value: number }[] {
    return Array.from(this.map.entries()).map(([hash, value]) => {
      return { localdate: LocalDate.decode(hash), value };
    });
  }

  copy() {
    return new DateNumberMap(new HashMap(this.map));
  }

  static build(map: HashMap<LocalDate, number>): DateNumberMap {
    return new DateNumberMap(map);
  }
  static empty(): DateNumberMap {
    return new DateNumberMap(new HashMap());
  }
  private _entries(): [LocalDate, number][] {
    return Array.from(this.map.entries()).map(([hash, value]) => {
      return [LocalDate.decode(hash), value];
    });
  }
}
export default DateNumberMap;
