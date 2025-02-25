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
  updateTimestamp: (timestamp: number) => void;
};

export type OnSavedFunction = (success: boolean, keeping: boolean) => void;
export type OnRemovedFunction = (success: boolean) => void;
export type OnDirtyChangeFunction = (dirty: boolean) => void;
