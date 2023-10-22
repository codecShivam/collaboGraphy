import { useEffect, useRef } from "react";

export const useDraw = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const currentPoint = computePointInCanvas(e);
      console.log(currentPoint);
    };

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    };

    canvasRef.current?.addEventListener("mousemove", handler);
  }, []);

  return { canvasRef };
};
