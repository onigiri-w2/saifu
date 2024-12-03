import { ToDTO } from '../../types';
import LocalDate from '../../valueobject/localdate';

export type TodayDTO = ToDTO<Today>;
class Today {
  private constructor(public readonly date: LocalDate) {}

  static build(date: LocalDate) {
    return new Today(date);
  }
}
export default Today;
