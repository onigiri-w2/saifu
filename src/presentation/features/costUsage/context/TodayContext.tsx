import { createContext, useContext } from 'react';

import Today from '@/src/domain/aggregation/today';

type TodayContextValue = Today;
export const TodayContext = createContext({} as TodayContextValue);
export const useTodayContext = () => useContext(TodayContext);
