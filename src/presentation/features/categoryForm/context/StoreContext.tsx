import { createContext, useContext, useEffect, useRef } from 'react';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { keys as budgetingCategoryQuerykeys } from '@/src/presentation/usecase/query/budgeting-category/keys';
import { queryOptions } from '@/src/presentation/usecase/query/budgeting-category/query-options';

import { FormStore, createFormStore } from '../store/form.store';
import { SelectedItemStore, createSelectedItemStore } from '../store/selectedItem.store';

type StoreContextType = {
  formStore: FormStore;
  selectedItemStore: SelectedItemStore;
};
const StoreContext = createContext<StoreContextType>({} as StoreContextType);

type StoreProviderProps = {
  refreshKey: number;
  categoryId?: string;
  children: React.ReactNode;
};
export function StoreProvider({ refreshKey, categoryId, children }: StoreProviderProps) {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(queryOptions.detail(categoryId ?? ''));
  useEffect(() => {
    queryClient.resetQueries({ queryKey: budgetingCategoryQuerykeys.detail(categoryId ?? '') });
  }, [refreshKey, categoryId]);

  const formStore = useRef<FormStore>();
  if (!formStore.current) formStore.current = createFormStore(data ?? undefined);
  const selectedItemStore = useRef<SelectedItemStore>();
  if (!selectedItemStore.current) selectedItemStore.current = createSelectedItemStore();

  return (
    <StoreContext.Provider
      value={{
        formStore: formStore.current,
        selectedItemStore: selectedItemStore.current,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
export const useStoreContext = () => useContext(StoreContext);
