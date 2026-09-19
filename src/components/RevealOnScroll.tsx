"use client";

import { useEffect } from "react";

/**
 * Fades elements marked with `.rv` in as they scroll into view.
 * Content stays fully visible until this mounts (the hidden state is scoped
 * to `html.rv-on`), so nothing is lost without JS or before hydration.
 */
export function RevealOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    root.classList.add("rv-on");

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((t) => io.observe(t));

    return () => {
      io.disconnect();
      root.classList.remove("rv-on");
    };
  }, []);

  return null;
}
