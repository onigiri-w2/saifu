import { proxy } from 'valtio';

type Store = {
  costOrTransaction: 'cost' | 'transaction';
};

export const costUsagePreferenceStore = proxy<Store>({
  costOrTransaction: 'cost',
});
