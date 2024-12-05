const root = 'budgeting-category';
export const budgetingCategoryKeys = {
  root: [root],
  list: [root, 'list'],
  detail: (id: string) => [root, id],
};
