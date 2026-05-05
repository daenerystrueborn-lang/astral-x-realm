import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 1200, enabled = true) {
  const [value, setValue] = useState(enabled ? 0 : target);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    started.current = false;
    setValue(0);
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const from = 0;

        function tick(now: number) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          setValue(Math.round(from + (target - from) * eased));
          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.25 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, enabled]);

  return { ref, value };
}
