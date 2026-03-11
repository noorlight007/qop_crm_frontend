"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Progress } from "reactstrap";

const ProgressBar = () => {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("/")) {
        setVisible(true);
        setProgress(40);
      }
    };
    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, []);

  useEffect(() => {
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, [pathname]);

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
