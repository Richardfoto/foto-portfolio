"use client";

import { useLayoutEffect } from "react";

export default function ProcessScrollController() {
  useLayoutEffect(() => {
    const sticky = document.querySelector<HTMLElement>(".process-horizontal-sticky");
    const track = sticky?.querySelector<HTMLElement>(".process-horizontal-track");

    if (!sticky || !track) return;

    const previousScrollRestoration = window.history.scrollRestoration;
    const root = document.documentElement;
    const body = document.body;
    const processRoot = document.querySelector<HTMLElement>(".process-root");

    window.history.scrollRestoration = "manual";
    root.classList.add("process-page-active");
    body.classList.add("process-page-active");

    let currentScroll = 0;
    let targetScroll = 0;
    let frame = 0;
    let initialFrame = 0;
    let resizeFrame = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartScroll = 0;

    const setViewportVars = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const header = document.querySelector<HTMLElement>("header");
      const headerHeight = Math.round(
        header?.getBoundingClientRect().bottom ?? 80,
      );

      root.style.setProperty("--process-viewport-height", `${viewportHeight}px`);
      root.style.setProperty("--process-header-height", `${headerHeight}px`);
      body.style.setProperty("--process-viewport-height", `${viewportHeight}px`);
      body.style.setProperty("--process-header-height", `${headerHeight}px`);
      processRoot?.style.setProperty(
        "--process-viewport-height",
        `${viewportHeight}px`,
      );
      processRoot?.style.setProperty(
        "--process-header-height",
        `${headerHeight}px`,
      );
      window.scrollTo(0, 0);
    };

    const panels = Array.from(
      sticky.querySelectorAll<HTMLElement>(".process-panel"),
    );

    const getPanelScroll = (panel: HTMLElement) => {
      const firstPanel = panels[0];
      return panel.offsetLeft - (firstPanel?.offsetLeft ?? 0);
    };

    const getMaxScroll = () => {
      const lastPanel = panels.at(-1);
      return lastPanel ? getPanelScroll(lastPanel) : 0;
    };

    const clampScroll = (value: number) =>
      Math.max(0, Math.min(value, getMaxScroll()));

    const applyScroll = (value: number) => {
      currentScroll = clampScroll(value);
      track.style.transform = `translate3d(${-currentScroll}px, 0, 0)`;
      sticky.scrollLeft = 0;
    };

    const animate = () => {
      const delta = targetScroll - currentScroll;
      applyScroll(currentScroll + delta * 0.12);

      if (Math.abs(delta) > 0.5) {
        frame = window.requestAnimationFrame(animate);
      } else {
        applyScroll(targetScroll);
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
      applyScroll(targetScroll);
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

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartScroll = targetScroll;
      stopAnimation();
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;

      const deltaX = touchStartX - touch.clientX;
      const deltaY = touchStartY - touch.clientY;
      const scrollDelta =
        Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

      if (Math.abs(scrollDelta) < 2) return;

      event.preventDefault();
      requestScroll(touchStartScroll + scrollDelta);
    };

    const lockDocumentTouch = (event: TouchEvent) => {
      if (event.target instanceof Node && sticky.contains(event.target)) {
        event.preventDefault();
      }
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
      sticky.scrollLeft = 0;
    };

    const onHashChange = () => {
      scrollToHash();
    };

    const onResize = () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);

      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        setViewportVars();
        applyScroll(targetScroll);
        scrollToHash(true);
      });
    };

    setViewportVars();
    applyScroll(0);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchmove", lockDocumentTouch, {
      passive: false,
      capture: true,
    });
    sticky.addEventListener("touchstart", onTouchStart, { passive: true });
    sticky.addEventListener("touchmove", onTouchMove, { passive: false });
    sticky.addEventListener("scroll", syncTarget, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    links.forEach((link) => {
      link.addEventListener("click", jumpToPanel);
    });

    initialFrame = window.requestAnimationFrame(() => {
      scrollToHash(true);
    });

    return () => {
      stopAnimation();
      if (initialFrame) window.cancelAnimationFrame(initialFrame);
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      window.history.scrollRestoration = previousScrollRestoration;
      root.classList.remove("process-page-active");
      body.classList.remove("process-page-active");
      root.style.removeProperty("--process-viewport-height");
      root.style.removeProperty("--process-header-height");
      body.style.removeProperty("--process-viewport-height");
      body.style.removeProperty("--process-header-height");
      processRoot?.style.removeProperty("--process-viewport-height");
      processRoot?.style.removeProperty("--process-header-height");
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchmove", lockDocumentTouch, {
        capture: true,
      });
      sticky.removeEventListener("touchstart", onTouchStart);
      sticky.removeEventListener("touchmove", onTouchMove);
      sticky.removeEventListener("scroll", syncTarget);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      links.forEach((link) => {
        link.removeEventListener("click", jumpToPanel);
      });
    };
  }, []);

  return null;
}
