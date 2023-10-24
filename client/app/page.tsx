'use client'; // Strict mode
import { FC, useState, useRef } from 'react'; 
import { useDraw } from '../hooks/useDraw'; 
import { ChromePicker } from 'react-color'; 

interface PageProps { } 

const Page: FC<PageProps> = () => { 
  const [linesWidth, setLinesWidth] = useState<number>(5); 
  const [color, setColor] = useState<string>('#000'); 
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine); 
  const prevPoint = useRef<Point | null>(null); 

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) { // Function for drawing a line
   
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