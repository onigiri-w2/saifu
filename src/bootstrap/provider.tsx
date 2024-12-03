import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import { bootstrap } from '.';

type AppBootstrapProps = {
  children: React.ReactNode;
};
export function AppBootstrap({ children }: AppBootstrapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    bootstrap()
      .then(() => {
        setIsLoading(false);
      })
      .catch((e) => {
        // TODO: ここで通知する？いや、エラーをキャッチさせて通知する機構をさらに上位に作った方がいいな。
        // エラー処理ちゃんと考えて作れ
        setIsError(true);
        if (__DEV__) {
          console.error('Failed to bootstrap', e);
        }
      });
  }, []);

  if (isLoading) return null;
  if (isError) {
    return (
      <View>
        <Text>エラーが発生しました</Text>
      </View>
    );
  }

  return <>{children ?? null}</>;
}
