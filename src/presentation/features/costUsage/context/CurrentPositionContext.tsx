import { MutableRefObject, createContext } from 'react';

type CurrentPositionContextType = MutableRefObject<number>;
export const CurrentPositionContext = createContext({} as CurrentPositionContextType);
