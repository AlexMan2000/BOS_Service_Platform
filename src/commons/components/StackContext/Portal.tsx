import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export function Portal({ children }: { children: React.ReactNode }) {
  const el = useRef(document.createElement("div"));

  useEffect(() => {
    const current = el.current;
    document.body.appendChild(current);
    return () => {
      document.body.removeChild(current);
    };
  }, []);

  return createPortal(children, el.current);
}