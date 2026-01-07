"use client";
import ErrorPage1Container from "@/Components/Other/ErrorPage/ErrorPage1Container";
import { useGetAppranceQuery } from "@/Redux/Reducers/Appearance/AppearanceApi";
import Store from "@/Redux/Store";
import { useSession } from "next-auth/react";
import React, { ErrorInfo, ReactNode, useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { Provider } from "react-redux";

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
    if (error.message.includes("ToastContainer")) return;
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) return <ErrorPage1Container />;
    return this.props.children;
  }
}

const AppearanceFontApplier: React.FC<MainProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const { data: appearanceData } = useGetAppranceQuery(undefined, {
    skip: !session?.user, // Skip the query if user is not authenticated
  });

  useEffect(() => {
    if (typeof document === "undefined") return;

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
      root.style.setProperty("--app-body-font", mappedFont);
    } else {
      root.style.removeProperty("--app-body-font");
    }
  }, [appearanceData?.font_family]);

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
