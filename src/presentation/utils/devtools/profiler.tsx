import React, { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
) {
  // Aggregate or log render timings...
  // いい感じの出力表示をする。
  console.log(`phace: ${phase} actualDuration: ${actualDuration}, baseDuration: ${baseDuration}`);
}

type Props = {
  children: React.ReactNode;
};
function MyProfiler({ children }: Props) {
  if (!__DEV__) {
    return <>{children}</>;
  }
  return (
    <Profiler id="MyComponent" onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
}

export default MyProfiler;
