'use client';
import ErrorPage1Container from '@/Components/Other/ErrorPage/ErrorPage1Container';
import { useAppDispatch } from '@/Redux/Hooks';
import {
  useGetAppranceQuery,
  useGetPublicAppranceQuery,
} from '@/Redux/Reducers/Appearance/AppearanceApi';
import { addColor } from '@/Redux/Reducers/ThemeCustomizerReducer';
import Store from '@/Redux/Store';
import { registerUpdateSession } from '@/utils/sessionUpdate';
import { useSession } from 'next-auth/react';
import React, { ErrorInfo, ReactNode, useEffect } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { Provider } from 'react-redux';

interface MainProviderProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

unstable_batchedUpdates(() => {
  console.error = () => {};
  console.warn = () => {};
});

class ErrorBoundary extends React.Component<
  MainProviderProps,
  ErrorBoundaryState
> {
  constructor(props: MainProviderProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.message.includes('ToastContainer')) return;
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) return <ErrorPage1Container />;
    return this.props.children;
  }
}

const AppearanceFontApplier: React.FC<MainProviderProps> = ({ children }) => {
  const { data: session, update } = useSession();
  const dispatch = useAppDispatch();

  // Authenticated appearance
  const { data: privateAppearance } = useGetAppranceQuery(undefined, {
    skip: !session?.user,
  });

  // Public appearance for unauthenticated pages (e.g., auth/login)
  const { data: publicAppearance } = useGetPublicAppranceQuery(undefined, {
    skip: !!session?.user,
  });

  const appearanceData = privateAppearance || publicAppearance;

  // Sync localStorage tokens to NextAuth session and register update function
  useEffect(() => {
    if (typeof window === 'undefined' || !update) return;

    registerUpdateSession(update);

    const localToken = localStorage.getItem('token');
    const localRefreshToken = localStorage.getItem('refreshToken');

    if (localToken || localRefreshToken) {
      const needsUpdate =
        (localToken && session?.user?.accessToken !== localToken) ||
        (localRefreshToken &&
          session?.user?.refreshToken !== localRefreshToken);

      if (needsUpdate) {
        update({
          ...session?.user,
          ...(localToken ? { accessToken: localToken } : {}),
          ...(localRefreshToken ? { refreshToken: localRefreshToken } : {}),
        } as any);
      }
    }

    return () => {
      registerUpdateSession(null as any);
    };
  }, [session, update]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const fontKey = appearanceData?.font_family;

    const fontMap: Record<string, string> = {
      ROBOTO: "'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif",
      POPPINS: "'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif",
      PLAYFAIR_DISPLAY: "'Playfair Display', 'Times New Roman', serif",
      RALEWAY: "'Raleway', system-ui, -apple-system, 'Segoe UI', sans-serif",
      SATISFY: "'Satisfy', 'Comic Sans MS', cursive",
      KARLA: "'Karla', system-ui, -apple-system, 'Segoe UI', sans-serif",
      MONTSERRAT:
        "'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif",
      INTER: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
      CAVEAT: "'Caveat', 'Comic Sans MS', cursive",
      OPEN_SANS:
        "'Open Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    };

    const mappedFont = fontKey ? fontMap[fontKey] : undefined;

    if (mappedFont) {
      root.style.setProperty('--app-body-font', mappedFont);
    } else {
      root.style.removeProperty('--app-body-font');
    }
  }, [appearanceData?.font_family]);

  // Apply theme colors for unauthenticated pages using public appearance
  useEffect(() => {
    if (session?.user) return;

    const primary = (appearanceData as any)?.primary_color as
      | string
      | undefined;
    const secondary = (appearanceData as any)?.secondary_color as
      | string
      | undefined;

    if (primary && secondary) {
      dispatch(addColor({ primary, secondary }));
    }
  }, [appearanceData, session, dispatch]);

  return children as JSX.Element;
};

const MainProvider: React.FC<MainProviderProps> = ({ children }) => {
  return (
    <Provider store={Store}>
      <AppearanceFontApplier>
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppearanceFontApplier>
    </Provider>
  );
};

export default MainProvider;
