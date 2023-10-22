'use client'
import { useDraw } from "@/hooks/useDraw";

export default function Home() {
  const { canvasRef } = useDraw();

  return (
    <main className="flex min-h-screen flex-col items-center sm:justify-center p-24">
      <canvas
        ref={canvasRef}
        id="canvas"
        className="w-[24em] sm:w-[45em] h-[24rem] sm:h-[45em] border rounded-lg shadow-xl border-slate-300"
      ></canvas>
    </main>
  );
}
