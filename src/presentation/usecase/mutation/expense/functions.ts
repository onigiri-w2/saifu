import Expense, { ExpenseId } from '@/src/domain/aggregation/expense';
import { ExpenseCategoryId } from '@/src/domain/aggregation/expenseCategory';
import RepositoryRegistry from '@/src/domain/repositoryRegistry';
import Money from '@/src/domain/model/valueobject/money';

import { CreateRequest, UpdateRequest } from './types';

export async function createExpense(request: CreateRequest): Promise<Expense> {
  const repo = RepositoryRegistry.getInstance().expenseRepository;

  const expense = Expense.create(
    ExpenseCategoryId.build(request.categoryId),
    Money.build(request.amount),
    request.date,
    request.memo,
  );
  await repo.save(expense);
  return expense;
}

export async function updateExpense(request: UpdateRequest): Promise<Expense> {
  const repo = RepositoryRegistry.getInstance().expenseRepository;
  const expense = Expense.build(
    ExpenseId.build(request.id),
    ExpenseCategoryId.build(request.categoryId),
    Money.build(request.amount),
    request.date,
    request.memo,
  );
  await repo.save(expense);
  return expense;
}

export async function deleteExpense(id: string): Promise<void> {
  const repo = RepositoryRegistry.getInstance().expenseRepository;
  await repo.remove(ExpenseId.build(id));
}
