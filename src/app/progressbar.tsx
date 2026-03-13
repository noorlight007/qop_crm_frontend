"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Progress } from "reactstrap";

const ProgressBar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = useMemo(() => searchParams?.toString() ?? "", [searchParams]);

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const navigatingRef = useRef(false);
  const lastUrlNoHashRef = useRef<string>("");
  const trickleIntervalRef = useRef<number | null>(null);
  const showDelayTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const failSafeTimeoutRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (trickleIntervalRef.current) {
      window.clearInterval(trickleIntervalRef.current);
      trickleIntervalRef.current = null;
    }
    if (showDelayTimeoutRef.current) {
      window.clearTimeout(showDelayTimeoutRef.current);
      showDelayTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (failSafeTimeoutRef.current) {
      window.clearTimeout(failSafeTimeoutRef.current);
      failSafeTimeoutRef.current = null;
    }
  }, []);

  const stripHash = useCallback((href: string) => {
    const hashIndex = href.indexOf("#");
    return hashIndex === -1 ? href : href.slice(0, hashIndex);
  }, []);

  const toAbsoluteHref = useCallback((urlLike: unknown): string | null => {
    if (typeof window === "undefined") return null;
    if (!urlLike) return null;

    if (urlLike instanceof URL) return urlLike.href;
    if (typeof urlLike === "string") {
      try {
        return new URL(urlLike, window.location.origin).href;
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  const beginProgress = useCallback(() => {
    if (typeof window === "undefined") return;

    if (navigatingRef.current) return;
    navigatingRef.current = true;

    clearTimers();

    // Avoid flashing for ultra-fast transitions.
    showDelayTimeoutRef.current = window.setTimeout(() => {
      setVisible(true);
      setProgress(10);

      trickleIntervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          const capped = Math.min(prev, 90);
          if (capped >= 90) return 90;
          const step = 2 + Math.floor(Math.random() * 6); // 2..7
          return Math.min(90, capped + step);
        });
      }, 200);
    }, 120);

    // Failsafe so it never gets stuck.
    failSafeTimeoutRef.current = window.setTimeout(() => {
      navigatingRef.current = false;
      setProgress(100);
      hideTimeoutRef.current = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }, 10000);
  }, [clearTimers]);

  const startNavigation = useCallback(
    (nextHref?: string | null) => {
      if (typeof window === "undefined") return;

      const currentNoHash = lastUrlNoHashRef.current
        ? lastUrlNoHashRef.current
        : stripHash(window.location.href);

      const nextNoHash = nextHref ? stripHash(nextHref) : currentNoHash;
      if (nextNoHash && currentNoHash && nextNoHash === currentNoHash) return;

      beginProgress();
    },
    [beginProgress, stripHash],
  );

  const finishNavigation = useCallback(() => {
    if (!navigatingRef.current) {
      // Still keep last URL in sync for hash-only interactions.
      if (typeof window !== "undefined") {
        lastUrlNoHashRef.current = stripHash(window.location.href);
      }
      return;
    }

    navigatingRef.current = false;
    clearTimers();

    setVisible(true);
    setProgress(100);

    hideTimeoutRef.current = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);

    if (typeof window !== "undefined") {
      lastUrlNoHashRef.current = stripHash(window.location.href);
    }
  }, [clearTimers, stripHash]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastUrlNoHashRef.current = stripHash(window.location.href);

    const isModifiedClick = (e: MouseEvent) =>
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

    const isSameOriginInternal = (href: string) => {
      try {
        const url = new URL(href, window.location.origin);
        return url.origin === window.location.origin;
      } catch {
        return false;
      }
    };

    const handleDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return; // left click only
      if (isModifiedClick(e)) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;

      const targetAttr = anchor.getAttribute("target");
      if (targetAttr && targetAttr !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const rel = (anchor.getAttribute("rel") || "").toLowerCase();
      if (rel.includes("external")) return;

      const hrefAttr = anchor.getAttribute("href");
      if (!hrefAttr) return;
      if (hrefAttr.startsWith("#")) return; // hash-only
      if (hrefAttr.startsWith("mailto:") || hrefAttr.startsWith("tel:")) return;

      const absHref = toAbsoluteHref(hrefAttr);
      if (!absHref) return;
      if (!isSameOriginInternal(absHref)) return;

      // Ignore hash-only changes to the same page.
      const nextNoHash = stripHash(absHref);
      const currentNoHash = lastUrlNoHashRef.current;
      if (nextNoHash === currentNoHash) return;

      startNavigation(absHref);
    };

    const handlePopState = () => {
      startNavigation(window.location.href);
    };

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      const nextHref = toAbsoluteHref(args[2]);
      startNavigation(nextHref);
      return originalPushState.apply(this, args);
    };

    history.replaceState = function (...args) {
      const nextHref = toAbsoluteHref(args[2]);
      startNavigation(nextHref);
      return originalReplaceState.apply(this, args);
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      clearTimers();
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [clearTimers, startNavigation, stripHash, toAbsoluteHref]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // On hard reload, we can't show anything until JS runs, but we can still
    // indicate "page still loading" during slow hydration/assets.
    if (document.readyState === "complete") return;

    beginProgress();

    const onLoad = () => finishNavigation();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [beginProgress, finishNavigation]);

  useEffect(() => {
    // When the URL observed by Next updates, mark navigation complete.
    finishNavigation();
  }, [pathname, search, finishNavigation]);

  if (!visible) return null;

  return (
    <Progress
      animated
      striped
      value={progress}
      color="primary"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "7px",
        borderRadius: 0,
        zIndex: 999999,
        backgroundColor: "transparent",
      }}
    />
  );
};

export default ProgressBar;
