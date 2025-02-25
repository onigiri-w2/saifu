import { BaseError } from '../utils/errors';

export class DomainError extends BaseError {}
export class DomainValidationError extends DomainError {}
export class NotFoundTransactionCategoryError extends DomainError {}

export class RepositoryError extends BaseError {}
export class IncomeCategoryRepositoryError extends RepositoryError {}
export class CategoryRepositoryError extends RepositoryError {}
export class BudgetPlanRepositoryError extends RepositoryError {}
export class CalendarRepositoryError extends RepositoryError {}
export class TransactionRepositoryError extends RepositoryError {}
export class TransactionCategoryRepositoryError extends RepositoryError {}
