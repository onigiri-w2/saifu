export type FormDataState = {
  amount: number;
  timestamp: number;
  categoryId: string | undefined;
  memo: string;
};
export type FormDataStore = {
  form: FormDataState;
  isDirty: () => boolean;
  isValid: () => boolean;
  subscribe: (callback: (isDirty: boolean, isValid: boolean) => void) => () => void;
  updateTimestamp: (timestamp: number) => void;
  getId: () => string | undefined;
};
