import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppState = (onForeground?: () => void, onBackground?: () => void) => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        onForeground?.();
      } else if (appState.current === 'active' && nextState.match(/inactive|background/)) {
        onBackground?.();
      }
      appState.current = nextState;
    });

    return () => {
      subscription.remove();
    };
  }, [onForeground, onBackground]);

  return appState.current;
};
