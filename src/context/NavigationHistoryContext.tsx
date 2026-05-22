"use client";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

// module-level — never resets between renders
const historyStack: string[] = [];
let cursor = -1;
let skipNext = false;

const NavigationHistoryContext = createContext({
  canGoBack: false,
  canGoForward: false,
  back: () => {},
  forward: () => {},
});

export function NavigationHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    // console.log("pathname changed:", pathname);

    if (skipNext) {
      skipNext = false;
      return;
    }

    if (historyStack[cursor] === pathname) return;

    // truncate forward stack
    historyStack.splice(cursor + 1);
    historyStack.push(pathname);
    cursor = historyStack.length - 1;

    // console.log("stack:", [...historyStack], "cursor:", cursor);

    setCanGoBack(cursor > 0);
    setCanGoForward(false);
  }, [pathname]);

  const back = () => {
    if (cursor <= 0) return;
    skipNext = true;
    cursor--;
    setCanGoBack(cursor > 0);
    setCanGoForward(true);
    router.push(historyStack[cursor]);
  };

  const forward = () => {
    if (cursor >= historyStack.length - 1) return;
    skipNext = true;
    cursor++;
    setCanGoBack(true);
    setCanGoForward(cursor < historyStack.length - 1);
    router.push(historyStack[cursor]);
  };

  return (
    <NavigationHistoryContext.Provider
      value={{ canGoBack, canGoForward, back, forward }}
    >
      {children}
    </NavigationHistoryContext.Provider>
  );
}

export const useNavigationHistory = () => useContext(NavigationHistoryContext);
