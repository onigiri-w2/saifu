import { ComponentType, ForwardRefExoticComponent, RefAttributes, forwardRef } from 'react';

import KeyboardAwareLayout from '../KeyboardAwareLayout';

export function withKeyboardAwareLayout<P extends object>(Component: ComponentType<P>) {
  return function WithKeybaordAwareLayoutComponent(props: P) {
    return (
      <KeyboardAwareLayout>
        <Component {...props} />
      </KeyboardAwareLayout>
    );
  };
}

export function withKeyboardAwareLayoutRef<T, P extends object>(
  Component: ForwardRefExoticComponent<P & RefAttributes<T>>,
) {
  return forwardRef<T, P>((props, ref) => {
    return (
      <KeyboardAwareLayout>
        <Component {...props} ref={ref} />
      </KeyboardAwareLayout>
    );
  });
}
