'use client'; // Strict mode
import { FC, useState, useRef } from 'react'; // Import React hooks
import { useDraw } from '../hooks/useDraw'; // Import custom hook for drawing on canvas
import { ChromePicker } from 'react-color'; // Import color picker component

interface PageProps { } // Define interface for component props

const Page: FC<PageProps> = () => { // Define functional component
  const [linesWidth, setLinesWidth] = useState<number>(5); // State for selected color
  const [color, setColor] = useState<string>('#000'); // State for selected color
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine); // Custom hook for drawing on canvas
  const prevPoint = useRef<Point | null>(null); // Ref for previous point (if any)

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) { // Function for drawing a line
    const { x: currX, y: currY } = currentPoint; // Destructure current point
    const lineColor = color; // Get selected color
    const lineWidth = linesWidth; // Set line width

    let startPoint = prevPoint ?? currentPoint; // Set start point to previous point or current point
    ctx.beginPath(); // Begin new path
    ctx.lineWidth = lineWidth; // Set line width
    ctx.strokeStyle = lineColor; // Set line color
    ctx.moveTo(startPoint.x, startPoint.y); // Move to start point
    ctx.lineTo(currX, currY); // Draw line to current point
    ctx.stroke(); // Stroke the line

    ctx.fillStyle = lineColor; // Set fill color
    ctx.beginPath(); // Begin new path
    ctx.arc(startPoint.x, startPoint.y, lineWidth / 2, 0, 2 * Math.PI); // Draw a small circle at start point
    ctx.fill(); // Fill the circle
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row md:justify-center md:items-center">
      <div className="bg-white p-4 md:p-8 flex flex-col items-center md:w-1/3">
        <h1 className="text-2xl mb-4 text-gray-700">Color Picker</h1> {/* Color picker heading */}
        <ChromePicker color={color} onChange={(e: any) => setColor(e.hex)} /> {/* Color picker component */}
        <input type="number" className='bg-gray-100 mt-10 text-gray-700' onChange={(e: any) => setLinesWidth(e.target.value)} />
        <button
          type="button"
          className="mt-4 p-2 bg-cyan-400 text-gray-500 hover:text-gray-600 hover:bg-cyan-500 focus:outline-none rounded-md transition duration-300"
          onClick={clear}
        >
          Clear Canvas
        </button> {/* Button to clear canvas */}
      </div>
      <div className="flex-1 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          width={750}
          height={750}
          className="border border-gray-300 rounded-lg shadow-lg animate-scale-in"
        /> {/* Canvas for drawing */}
      </div>
    </div>
  );
};

export default Page; // Exporting the component