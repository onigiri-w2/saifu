import { Year, Month, Day, DayOfWeek } from '@/src/domain/valueobject/types';
import { Hashable } from '@/src/utils/collections';
import { clampDateToMonthEnd, getDaysInMonth } from '@/src/utils/dates';

const MS_IN_DAY = 24 * 60 * 60 * 1000;
class LocalDate implements Hashable {
  public readonly year!: Year;
  public readonly month!: Month;
  public readonly day!: Day;

  private constructor(year: Year, month: Month, day: Day) {
    const clamped = clampDateToMonthEnd(year, month, day);
    this.year = clamped.year;
    this.month = clamped.month;
    this.day = clamped.day;
  }
  get datetime() {
    return new Date(this.year, this.month - 1, this.day);
  }
  get dayOfWeek() {
    // 0: 日曜, 1: 月曜, ..., 6: 土曜
    // PERF: timezoneを触るので、初期化が少し遅くなる(1ms程度)
    // NOTE: これも、ある日の曜日がわかってれば、自然に計算できるんじゃね？。テストありきで作ろう。
    return new Date(this.year, this.month - 1, this.day).getDay();
  }

  format(): LocalDateFormat {
    return LocalDateFormat.fromYmd(this.year, this.month, this.day);
  }

  compare(other: LocalDate) {
    if (this.year !== other.year) return this.year - other.year;
    if (this.month !== other.month) return this.month - other.month;
    return this.day - other.day;
  }
  isBeforeThan(other: LocalDate) {
    return this.compare(other) < 0;
  }
  isAfterThan(other: LocalDate) {
    return this.compare(other) > 0;
  }
  isAfterOrEqual(other: LocalDate) {
    return this.compare(other) >= 0;
  }
  isBeforeOrEqual(other: LocalDate) {
    return this.compare(other) <= 0;
  }
  isSame(other: LocalDate) {
    return this.compare(other) === 0;
  }
  isIncludedIn(start: LocalDate, end: LocalDate) {
    return start.isBeforeOrEqual(this) && this.isBeforeOrEqual(end);
  }

  addDays(days: number): LocalDate {
    if (days < 0) return this.subDays(-days);

    let year = this.year;
    let month = this.month;
    let day = this.day + days;

    while (true) {
      const daysInMonth = getDaysInMonth(year, month);
      if (day <= daysInMonth) break;
      day -= daysInMonth;
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
    return LocalDate.build(year, month, day as Day);
  }
  subDays(days: number) {
    let year = this.year;
    let month = this.month;
    let day = this.day - days;

    while (true) {
      if (day > 0) break;
      month--;
      if (month < 1) {
        month = 12;
        year--;
      }
      day += getDaysInMonth(year, month as Month);
    }
    return LocalDate.build(year, month, day as Day);
  }
  /**
   * 加算ぶんの年の同じ日付を返す
   * Note: もし、2/29がある年に1年加算すると、2/28になる。うまいこと調整される。clampedDateToMonthEndが効いてる。
   */
  addYears(years: number) {
    return LocalDate.build(this.year + years, this.month, this.day);
  }
  diffDays(other: LocalDate) {
    // PERF: timezoneを触るので、初期化が少し遅くなる(1ms程度)
    // TODO: これ、夏時間を考慮できてないから注意した方がいい。切り替え時期にバグる。
    // 理由: 切り替え時期は1日の長さが23hか、25hになるのに対し、以下の処理はMS_IN_DAY（24h前提）で計算しているため。
    // new Date使わずとも計算できるやろ。テストありきで作れ。
    const d1 = new Date(this.year, this.month - 1, this.day);
    const d2 = new Date(other.year, other.month - 1, other.day);
    const diff = d1.getTime() - d2.getTime();
    return Math.floor(diff / MS_IN_DAY);
  }
  startOfWeek(weekStartsOn: DayOfWeek) {
    const date = new Date(this.year, this.month - 1, this.day);
    const dayOfWeek = date.getDay();
    const diff = (dayOfWeek - weekStartsOn + 7) % 7;
    date.setDate(date.getDate() - diff);
    return LocalDate.fromDate(date);
  }
  endOfWeek(weekStartsOn: DayOfWeek) {
    const start = this.startOfWeek(weekStartsOn);
    return start.addDays(6);
  }

  hash() {
    return this.format().value;
  }

  toString() {
    return `${this.year}-${this.month}-${this.day}`;
  }

  static decode(hash: string) {
    return this.fromFormat(LocalDateFormat.build(hash));
  }

  static build(year: Year, month: Month, day: Day) {
    return new LocalDate(year, month, day);
  }
  static fromFormat(format: LocalDateFormat) {
    return LocalDate.build(format.year, format.month, format.day);
  }
  static fromDate(date: Date) {
    // PERF: timezoneを触るので、初期化が少し遅くなる(1ms程度)
    return LocalDate.build(date.getFullYear(), (date.getMonth() + 1) as Month, date.getDate() as Day);
  }
  static min(dates: LocalDate[]) {
    return dates.reduce((min, date) => (date.isBeforeThan(min) ? date : min), dates[0]);
  }
  static max(dates: LocalDate[]) {
    return dates.reduce((max, date) => (date.isAfterThan(max) ? date : max), dates[0]);
  }
}

export class LocalDateFormat {
  private constructor(public readonly value: string) {
    this._validate(value);
  }
  static build(value: string) {
    return new LocalDateFormat(value);
  }
  static fromYmd(year: Year, month: Month, day: Day) {
    const y = String(year).padStart(4, '0');
    const m = String(month).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return new LocalDateFormat(`${y}${m}${d}`);
  }
  get year() {
    return Number(this.value.slice(0, 4)) as Year;
  }
  get month() {
    return Number(this.value.slice(4, 6)) as Month;
  }
  get day() {
    return Number(this.value.slice(6, 8)) as Day;
  }
  private _validate(value: string) {
    if (!/^\d{8}$/.test(value)) throw new Error('数字8桁で入力してください');
    const month = value.slice(4, 6);
    const day = value.slice(6, 8);
    if (month < '01' || month > '12') throw new Error('月は1から12の間で入力してください');
    if (day < '01' || day > '31') throw new Error('日は1から31の間で入力してください');
  }
}

export default LocalDate;
