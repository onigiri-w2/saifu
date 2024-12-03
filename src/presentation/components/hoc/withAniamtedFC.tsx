/**
 * 関数コンポーネントをAniamtedで使えるようにするHOC
 *
 * https://github.com/software-mansion/react-native-reanimated/discussions/1527
 */
import React from 'react';

import Animated from 'react-native-reanimated';

export function withAnimatedFc<Props extends object>(WrappedComponent: React.FC<Props>) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  class WithAnimated extends React.Component<Props> {
    static displayName = `WithAnimated(${displayName})`;
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return Animated.createAnimatedComponent<Props>(WithAnimated);
}
