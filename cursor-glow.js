document.addEventListener("DOMContentLoaded", () => {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.append(glow);

  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let targetX = glowX;
  let targetY = glowY;
  let glowIntensity = 0;
  let targetIntensity = 0;
  let lastMoveTime = 0;
  let lastMoveX = glowX;
  let lastMoveY = glowY;
  let glowRafId = null;

  const animateGlow = () => {
    glowX += (targetX - glowX) * 0.2;
    glowY += (targetY - glowY) * 0.2;
    glowIntensity += (targetIntensity - glowIntensity) * 0.12;

    glow.style.setProperty("--glow-x", `${glowX}px`);
    glow.style.setProperty("--glow-y", `${glowY}px`);
    glow.style.setProperty(
      "--glow-opacity",
      (0.15 + glowIntensity * 0.6).toFixed(3)
    );
    glow.style.setProperty(
      "--glow-scale",
      (0.6 + glowIntensity * 0.7).toFixed(3)
    );

    if (
      Math.abs(targetX - glowX) > 0.1 ||
      Math.abs(targetY - glowY) > 0.1 ||
      glowIntensity > 0.01
    ) {
      glowRafId = window.requestAnimationFrame(animateGlow);
    } else {
      glowRafId = null;
    }
  };

  const onGlowMove = (event) => {
    const now = performance.now();
    const dx = event.clientX - lastMoveX;
    const dy = event.clientY - lastMoveY;
    const dt = Math.max(1, now - lastMoveTime);
    const speed = Math.hypot(dx, dy) / dt;

    targetX = event.clientX;
    targetY = event.clientY;
    targetIntensity = Math.min(1, speed * 0.35);

    lastMoveTime = now;
    lastMoveX = event.clientX;
    lastMoveY = event.clientY;

    if (!glowRafId) {
      glowRafId = window.requestAnimationFrame(animateGlow);
    }
  };

  window.addEventListener("mousemove", onGlowMove);
  window.addEventListener("mouseleave", () => {
    targetIntensity = 0;
  });
});
