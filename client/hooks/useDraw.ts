import { useEffect, useRef, useState } from "react";

// Custom hook for drawing on canvas
export function useDraw(onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void) {
  const [mouseDown, setMouseDown] = useState(false); // State for mouse down event

  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for canvas element
  const prevPoint = useRef<null | Point>(null); // Ref for previous point (if any)

  const onMouseDown = () => setMouseDown(true); // Handler for mouse down event

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mouseDown) return;
      const currentPoint = computePointInCanvas(e); // Compute current point

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current }); // Draw line
      prevPoint.current = currentPoint; // Update previous point
    };

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };

    canvasRef.current?.addEventListener("mousemove", handler); // Add event listener for mouse move
    window.addEventListener("mouseup", mouseUpHandler); // Add event listener for mouse up

    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler); // Remove event listener for mouse move
      window.removeEventListener("mouseup", mouseUpHandler); // Remove event listener for mouse up
    };
  }, [onDraw]);

  return { canvasRef, onMouseDown, clear };
}

