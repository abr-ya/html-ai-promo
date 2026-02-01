document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loaded");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  let rafId = null;
  const maxShift = 8;

  const updateShift = (event) => {
    const { innerWidth, innerHeight } = window;
    const x = (event.clientX / innerWidth - 0.5) * 2;
    const y = (event.clientY / innerHeight - 0.5) * 2;

    const shiftX = (x * maxShift).toFixed(2);
    const shiftY = (y * maxShift).toFixed(2);

    document.documentElement.style.setProperty("--shift-x", `${shiftX}px`);
    document.documentElement.style.setProperty("--shift-y", `${shiftY}px`);
  };

  const onMouseMove = (event) => {
    if (rafId) {
      return;
    }

    rafId = window.requestAnimationFrame(() => {
      updateShift(event);
      rafId = null;
    });
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseleave", () => {
    document.documentElement.style.setProperty("--shift-x", "0px");
    document.documentElement.style.setProperty("--shift-y", "0px");
  });
});
