import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currPoint, prevPoint }: Draw) => void
) => {
  const [mouseDown, setMouseDown] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPointRef = useRef<Point | null>(null);

  const onMouseDown = () => setMouseDown(true);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const currentPoint = computePointInCanvas(e);
      console.log(currentPoint);
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;
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

    return () => canvasRef.current?.removeEventListener("mousemove", handler);
  }, []);

  return { canvasRef, onMouseDown };
};
