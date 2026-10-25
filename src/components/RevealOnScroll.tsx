"use client";

import { useEffect } from "react";

/**
 * Fades elements marked with `.rv` in as they scroll into view.
 *
 * Nothing is hidden by CSS alone: this component decides, per element, whether
 * it is below the fold. Only those get `.rv-hide`; everything already on screen
 * (or scrolled past) stays visible. Visibility is checked on scroll, resize and
 * load rather than relying on IntersectionObserver alone, and new `.rv` nodes
 * (hot reload, client re-renders) are picked up by a mutation observer, so a
 * card can never stay invisible.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pending = new Set<HTMLElement>();
    const seen = new WeakSet<Element>();
    const limit = () => window.innerHeight * 0.92;

    const reveal = (el: HTMLElement) => {
      el.classList.add("in");
      pending.delete(el);
    };

    const check = () => {
      const edge = limit();
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < edge) reveal(el);
      });
    };

    const scan = () => {
      const edge = limit();
      document.querySelectorAll<HTMLElement>(".rv").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (el.classList.contains("in") || el.getBoundingClientRect().top < edge) {
          el.classList.add("in");
          return;
        }
        el.classList.add("rv-hide");
        pending.add(el);
      });
      check();
    };

    scan();

    let frame = 0;
    const later = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", later, { passive: true });
    window.addEventListener("resize", later);
    window.addEventListener("load", later);

    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", later);
      window.removeEventListener("resize", later);
      window.removeEventListener("load", later);
      mo.disconnect();
      document.querySelectorAll(".rv-hide").forEach((el) => el.classList.remove("rv-hide"));
    };
  }, []);

  return null;
}
