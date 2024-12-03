const root = 'budgeting-category';
export const keys = {
  list: [root],
  detail: (id: string) => [root, id],
};
