type RequestBase = {
  amount: number;
  categoryId: string;
  date: Date;
  memo: string;
};

export type CreateRequest = RequestBase;
export type UpdateRequest = RequestBase & {
  id: string;
};
export type DeleteRequest = {
  id: string;
};
