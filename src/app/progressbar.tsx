"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ProgressBar = () => {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // Listen to ALL link clicks globally
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      // Only trigger for internal links
      if (href && href.startsWith("/")) {
        setVisible(true);
        setProgress(40);
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  // Complete when route changes
  useEffect(() => {
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "5px",
        width: `${progress}%`,
        backgroundColor: "var(--theme-default)",
        zIndex: 999999,
        transition: "width 0.4s ease",
      }}
    />
  );
};

export default ProgressBar;
