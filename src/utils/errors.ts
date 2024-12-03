export class BaseError extends Error {
  readonly context!: Record<string, unknown>;

  constructor(
    message: string,
    options: {
      cause?: ErrorOptions['cause'];
      context?: Record<string, unknown>;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.context = options.context ?? {};
    this.name = this.constructor.name;
  }
}

export class AssertionError extends BaseError {}
export class NotImplementedError extends BaseError {
  constructor(label: string, checkValue: never) {
    super(`${label}の処理が実装されていません`, { context: { checkValue } });
  }
}
export class DataIntegrityError extends BaseError {}
export class DbMigrationError extends BaseError {}

export function assert(condition: unknown, message: string, context: Record<string, unknown> = {}): asserts condition {
  if (!condition) {
    throw new AssertionError(message, context);
  }
}
