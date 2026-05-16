"use client";

import { useLayoutEffect } from "react";

export default function ProcessScrollController() {
  useLayoutEffect(() => {
    const sticky = document.querySelector<HTMLElement>(".process-horizontal-sticky");

    if (!sticky) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    const root = document.documentElement;
    const body = document.body;

    window.history.scrollRestoration = "manual";
    root.classList.add("process-page-active");
    body.classList.add("process-page-active");

    let targetScroll = sticky.scrollLeft;
    let frame = 0;
    let initialFrame = 0;
    let isAnimating = false;

    const clampScroll = (value: number) =>
      Math.max(0, Math.min(value, sticky.scrollWidth - sticky.clientWidth));

    const panels = Array.from(
      sticky.querySelectorAll<HTMLElement>(".process-panel"),
    );

    const getPanelScroll = (panel: HTMLElement) => {
      const firstPanel = panels[0];
      return panel.offsetLeft - (firstPanel?.offsetLeft ?? 0);
    };

    const animate = () => {
      const delta = targetScroll - sticky.scrollLeft;
      sticky.scrollLeft += delta * 0.12;

      if (Math.abs(delta) > 0.5) {
        frame = window.requestAnimationFrame(animate);
      } else {
        sticky.scrollLeft = targetScroll;
        frame = 0;
        isAnimating = false;
      }
    };

    const stopAnimation = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      isAnimating = false;
    };

    const requestScroll = (nextScroll: number) => {
      targetScroll = clampScroll(nextScroll);
      isAnimating = true;

      if (!frame) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const jumpImmediately = (nextScroll: number) => {
      stopAnimation();
      targetScroll = clampScroll(nextScroll);
      sticky.scrollLeft = targetScroll;
      window.scrollTo(0, 0);
    };

    const scrollToPanel = (panel: HTMLElement, immediate = false) => {
      const nextScroll = getPanelScroll(panel);

      if (immediate) {
        jumpImmediately(nextScroll);
      } else {
        requestScroll(nextScroll);
      }
    };

    const scrollToHash = (immediate = false) => {
      const hash = window.location.hash;
      const panel = hash
        ? panels.find((item) => `#${item.id}` === hash)
        : panels[0];

      if (panel) scrollToPanel(panel, immediate);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;

      const scrollDelta =
        Math.abs(event.deltaY) > Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;

      if (scrollDelta === 0) return;

      event.preventDefault();
      requestScroll(targetScroll + scrollDelta);
    };

    const jumpToPanel = (event: Event) => {
      const link = event.currentTarget as HTMLAnchorElement;
      const panel = panels.find(
        (item) => `#${item.id}` === link.getAttribute("href"),
      );

      if (!panel) return;

      event.preventDefault();
      scrollToPanel(panel);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#${panel.id}`,
      );
    };

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        ".process-scene-list a[href^='#process-scene-']",
      ),
    );

    const syncTarget = () => {
      if (isAnimating) return;
      targetScroll = sticky.scrollLeft;
    };

    const onHashChange = () => {
      scrollToHash();
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    sticky.addEventListener("scroll", syncTarget, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    links.forEach((link) => {
      link.addEventListener("click", jumpToPanel);
    });

    initialFrame = window.requestAnimationFrame(() => {
      scrollToHash(true);
    });

    return () => {
      stopAnimation();
      if (initialFrame) window.cancelAnimationFrame(initialFrame);
      window.history.scrollRestoration = previousScrollRestoration;
      root.classList.remove("process-page-active");
      body.classList.remove("process-page-active");
      window.removeEventListener("wheel", onWheel, { capture: true });
      sticky.removeEventListener("scroll", syncTarget);
      window.removeEventListener("hashchange", onHashChange);
      links.forEach((link) => {
        link.removeEventListener("click", jumpToPanel);
      });
    };
  }, []);

  return null;
}
