import confetti from "canvas-confetti";

const BRAND_COLORS = ["#d32240", "#138669", "#f1ac22"];

export function burstConfettiAt(x: number, y: number) {
  confetti({
    particleCount: 22,
    spread: 50,
    startVelocity: 22,
    gravity: 1.1,
    scalar: 0.65,
    ticks: 90,
    origin: { x, y },
    colors: BRAND_COLORS,
    disableForReducedMotion: true,
  });
}

export function burstCelebration() {
  const end = Date.now() + 700;
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 70,
      startVelocity: 45,
      origin: { x: 0, y: 0.6 },
      colors: BRAND_COLORS,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 70,
      startVelocity: 45,
      origin: { x: 1, y: 0.6 },
      colors: BRAND_COLORS,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({
    particleCount: 90,
    spread: 100,
    startVelocity: 35,
    origin: { x: 0.5, y: 0.3 },
    colors: BRAND_COLORS,
    disableForReducedMotion: true,
  });
}

export const encouragingMessages = ["🎉 Nice work!", "✅ Done!", "🍬 Sweet!", "⭐ Great job!", "🙌 Another one finished!", "💪 Keep it up!"];

export const allDoneMessages = [
  "🎉 All today's jobs completed!",
  "🍬 Production complete for today!",
  "🚚 Everything is ready for dispatch!",
];

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
