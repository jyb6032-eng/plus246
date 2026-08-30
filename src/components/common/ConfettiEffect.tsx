import confetti from 'canvas-confetti';

export function triggerConfetti(level: 'small' | 'medium' | 'huge' = 'medium') {
  try {
    if (level === 'small') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } else if (level === 'huge') {
      const end = Date.now() + 1500;
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];
      (function frame() {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } else {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  } catch (e) {
    console.log('Confetti effect triggered');
  }
}
