import { useEffect, useRef } from "react";

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 420;
    canvas.height = 680;

    // Gradient orbs that slowly drift
    const orbs = [
      { x: 80, y: 120, r: 180, color: "#6b21a8", vx: 0.2, vy: 0.15 },
      { x: 340, y: 200, r: 160, color: "#1e3a8a", vx: -0.15, vy: 0.2 },
      { x: 200, y: 400, r: 200, color: "#312e81", vx: 0.1, vy: -0.18 },
      { x: 100, y: 500, r: 140, color: "#0f172a", vx: 0.18, vy: 0.1 },
      { x: 360, y: 500, r: 150, color: "#4c1d95", vx: -0.2, vy: -0.12 },
    ];

    let frame: number;

    const draw = () => {
      ctx.clearRect(0, 0, 420, 680);

      // Deep background
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, 420, 680);

      // Draw each orb
      orbs.forEach((orb) => {
        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r,
        );
        grad.addColorStop(0, orb.color + "cc");
        grad.addColorStop(1, orb.color + "00");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 420, 680);

        // Drift
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges
        if (orb.x < 0 || orb.x > 420) orb.vx *= -1;
        if (orb.y < 0 || orb.y > 680) orb.vy *= -1;
      });

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
