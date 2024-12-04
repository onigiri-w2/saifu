import LocalDate from '../../valueobject/localdate';

class Today {
  private constructor(public readonly date: LocalDate) { }

  static build(date: LocalDate) {
    return new Today(date);
  }
}
export default Today;
