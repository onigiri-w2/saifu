import { ValidationError } from '@/src/domain/error';

class Money {
  private constructor(public readonly value: number) {
    this._validate();
  }

  static build(value: number) {
    return new Money(value);
  }

  private _validate() {
    if (this.value < 0) {
      throw new ValidationError('金額は0以上である必要があります', {
        context: {
          value: this.value,
        },
      });
    }
  }
}
export default Money;
