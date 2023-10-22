'use client'
import { FC, useState } from 'react';
import { useDraw } from '../hooks/useDraw';
import { ChromePicker } from 'react-color';

interface PageProps { }

const Page: FC<PageProps> = () => {
  const [color, setColor] = useState<string>('#000');
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row md:justify-center md:items-center">
      <div className="bg-white p-4 md:p-8 flex flex-col items-center md:w-1/3">
        <h1 className="text-2xl mb-4 text-gray-700">Color Picker</h1>
        <ChromePicker color={color} onChange={(e: any) => setColor(e.hex)} />
        <button
          type="button"
          className="mt-4 p-2 bg-cyan-400 text-gray-500 hover:text-gray-600 hover:bg-cyan-500 focus:outline-none rounded-md transition duration-300"
          onClick={clear}
        >
          Clear Canvas
        </button>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          width={750}
          height={750}
          className="border border-gray-300 rounded-lg shadow-lg animate-scale-in"
        />
      </div>
    </div>
  );
};

export default Page;
