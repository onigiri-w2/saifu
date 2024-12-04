import { createContext, useContext, useEffect, useRef } from 'react';

import Yearmonth from '@/src/domain/valueobject/yearmonth';

type RenderingMode = 'immediate' | 'deferred';

type RenderingModeMap = Map<string, RenderingMode>;

type ContextValue = {
  modes: RenderingModeMap;
  switchMode: (yearMonth: Yearmonth, mode: RenderingMode) => void;
};
const RenderingModeSwitchContext = createContext<ContextValue>({
  modes: new Map<string, RenderingMode>(),
  switchMode: () => { },
});

const initializeMode = (yearmonth: Yearmonth) => {
  const map = new Map<string, RenderingMode>();
  Array.from({ length: 3 }).forEach((_, i) => {
    const key = yearmonth.addMonths(i + 1).toString();
    map.set(key, 'deferred');
  });
  Array.from({ length: 3 }).forEach((_, i) => {
    const key = yearmonth.addMonths(-(i + 1)).toString();
    map.set(key, 'deferred');
  });
  map.set(yearmonth.toString(), 'immediate');
  return map;
};
type Props = {
  initialYearmonth: Yearmonth;
  useDeferredRendering: boolean;
  children: React.ReactNode;
};
export const RenderingModeSwitchProvider = ({ useDeferredRendering, initialYearmonth, children }: Props) => {
  const currentYearmonth = useRef<string>(initialYearmonth.toString());
  const modes = useRef(new Map<string, RenderingMode>(initializeMode(initialYearmonth)));

  const switchMode = (yearMonth: Yearmonth, mode: RenderingMode) => {
    modes.current.set(currentYearmonth.current?.toString() || '', mode === 'immediate' ? 'deferred' : 'immediate');
    modes.current.set(yearMonth.toString(), mode);
    currentYearmonth.current = yearMonth.toString();
  };

  useEffect(() => {
    if (useDeferredRendering) {
      Array.from(modes.current.keys()).forEach((k) => {
        modes.current.set(k, 'deferred');
      });
    } else {
      Array.from(modes.current.keys()).forEach((k) => {
        if (k === currentYearmonth.current) {
          modes.current.set(k, 'immediate');
        }
      });
    }
  }, [useDeferredRendering]);

  return (
    <RenderingModeSwitchContext.Provider
      value={{
        modes: modes.current,
        switchMode,
      }}
    >
      {children}
    </RenderingModeSwitchContext.Provider>
  );
};

export const useRenderingModeSwitchContext = () => useContext(RenderingModeSwitchContext);
