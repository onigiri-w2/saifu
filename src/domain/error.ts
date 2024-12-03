import { BaseError } from '../utils/errors';

export class ValidationError extends BaseError {}

export class RepositoryError extends BaseError {}
export class CategoryRepositoryError extends RepositoryError {}
export class BudgetPlanRepositoryError extends RepositoryError {}
export class CalendarRepositoryError extends RepositoryError {}
export class ExpenseRepositoryError extends RepositoryError {}
