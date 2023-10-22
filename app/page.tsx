'use client'
import { useDraw } from "@/hooks/useDraw";

export default function Home() {

  const drawLine = ({ ctx, currPoint, prevPoint }: Draw) => {
    const { x: currX, y: currY } = currPoint;
    const lineColor = "#000";
    const lineWidth = 5;
    let startPoint = prevPoint ?? currPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  const { canvasRef, onMouseDown } = useDraw(drawLine);

  return (
    <main className="flex min-h-screen flex-col items-center sm:justify-center p-24">
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        id="canvas"
        className="w-[24em] sm:w-[45em] h-[24rem] sm:h-[45em] border rounded-lg shadow-xl border-slate-300"
      ></canvas>
    </main>
  );
}
