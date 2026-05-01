import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  opacity: number;
  angle: number;
  angleSpeed: number;
}

export default function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const COUNT = 55;
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: 0.4 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.3,
      size: 1 + Math.random() * 1.5,
      opacity: 0.06 + Math.random() * 0.1,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.02,
    }));

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();

        p.y += p.vy;
        p.x += p.vx + Math.sin(p.angle) * 0.25;
        p.angle += p.angleSpeed;

        if (p.y > canvas.height + 4) {
          p.y = -4;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
      }
      frame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
