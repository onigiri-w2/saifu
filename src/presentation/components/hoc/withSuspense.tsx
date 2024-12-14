import { Suspense, forwardRef } from 'react';

import LoadingView from '../LoadingView';

export function withSuspense<P extends object>(
  Component: React.ComponentType<P>,
  Fallback: React.ComponentType = DefaultFallback,
) {
  return (props: P) => {
    return (
      <Suspense fallback={<Fallback />}>
        <Component {...(props as P)} />
      </Suspense>
    );
  };
}

export function withSuspenseRef<T, P extends object>(
  Component: React.ForwardRefExoticComponent<P & React.RefAttributes<T>>,
  Fallback: React.ComponentType = DefaultFallback,
) {
  return forwardRef<T, P>((props, ref) => {
    return (
      <Suspense fallback={<Fallback />}>
        <Component {...(props as P)} ref={ref} />
      </Suspense>
    );
  });
}

function DefaultFallback() {
  return <LoadingView />;
}
