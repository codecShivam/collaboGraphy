'use client';

import React, { useEffect, useState } from 'react';
import { useDraw } from '../hooks/useDraw';
import { ChromePicker } from 'react-color';
import { io } from 'socket.io-client';
import { drawLine } from '../utils/drawLine';

const socket = io('http://localhost:3001'); // Update with your Vercel domain
// const socket = io('http://collabography.vercel.app'); // Update with your Vercel domain

export default function Page() {
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState<string>('#fff');
  const [eraserMode, setEraserMode] = useState(false);
  const [brushWidth, setBrushWidth] = useState<number>(5);
  const [color, setColor] = useState<string>('#000');
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
  const [drawingHistory, setDrawingHistory] = useState<DrawLineProps[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);

  const toggleEraserMode = () => {
    setEraserMode(!eraserMode);
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');

    socket.emit('client-ready');

    socket.on('get-canvas-state', () => {
      if (!canvasRef.current?.toDataURL()) return;
      console.log('sending canvas state');
      socket.emit('canvas-state', canvasRef.current.toDataURL());
    });

    socket.on('canvas-state-from-server', (state: string) => {
      console.log('I received the state');
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on('draw-line', (action: DrawLineProps) => {
      if (!ctx) return console.log('no ctx here');
      drawLine({ prevPoint: action.prevPoint, currentPoint: action.currentPoint, ctx, color: action.color, brushWidth: action.brushWidth });
      setDrawingHistory((history) => [...history, action]);
      setCurrentStep((step) => step + 1);
    });

    socket.on('clear', clear);

    return () => {
      socket.off('draw-line');
      socket.off('get-canvas-state');
      socket.off('canvas-state-from-server');
      socket.off('clear');
    };
  }, [canvasRef, clear]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    const lineColor = eraserMode ? canvasBackgroundColor : color;
    if (ctx) { // Check if ctx is not null or undefined
      const action: DrawLineProps = { prevPoint, currentPoint, color: lineColor, brushWidth };
      socket.emit('draw-line', action);
      drawLine({ prevPoint, currentPoint, ctx, color: lineColor, brushWidth });
      setDrawingHistory((history) => {
        const newHistory = history.slice(0, currentStep + 1);
        newHistory.push(action);
        return newHistory;
      });
      setCurrentStep((step) => step + 1);
    }
  }

  function undo() {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
      clearCanvas();
      redrawHistory();
    }
  }

  function redo() {
    if (currentStep < drawingHistory.length - 1) {
      setCurrentStep((step) => step + 1);
      const action = drawingHistory[currentStep + 1];
      const ctx = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D; // Type assertion
      drawLine({ prevPoint: action.prevPoint, currentPoint: action.currentPoint, ctx, color: action.color, brushWidth: action.brushWidth });
    }
  }

  function clearCanvas() {
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
  }

  function redrawHistory() {
    for (let i = 0; i <= currentStep; i++) {
      const ctx = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D; // Type assertion
      const action = drawingHistory[i];
      if(action)
      drawLine({ prevPoint: action.prevPoint, currentPoint: action.currentPoint, ctx, color: action.color, brushWidth: action.brushWidth });
    }
  }


  return (
    <div className='min-h-screen bg-white flex justify-center items-center'>
      <div className='flex flex-col space-y-10 pr-10'>
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          type='button'
          className='px-4 py-2 rounded-md border border-black'
          onClick={() => socket.emit('clear')}>
          Clear canvas
        </button>
      </div>
      <div className='flex flex-col space-y-14'>
        <div>
          <label htmlFor='color' className='text-lg'>Choose canvas bg color</label>
          <input
            type='color'
            value={canvasBackgroundColor}
            onChange={(e) => setCanvasBackgroundColor(e.target.value)}
          />
        </div>
        <button
          type='button'
          className='px-4 py-2 rounded-md border border-black'
          onClick={toggleEraserMode}
        >
          {eraserMode ? 'Exit Eraser Mode' : 'Eraser Mode'}
        </button>
        <div>
          <label htmlFor='brush-size' className='text-lg'>Brush size</label>
          <input type='number' className='px-4 py-2 border border-black rounded-md' onChange={(e) => setBrushWidth(+e.target.value)} />
        </div>
      </div>
      <div>
        <button type='button' onClick={undo}>
          Undo
        </button>
        <button type='button' onClick={redo}>
          Redo
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={750}
        height={750}
        className='shadow-xl border'
        style={{ cursor: eraserMode ? 'cell' : 'crosshair', backgroundColor: canvasBackgroundColor }}
      />
    </div>
  );
}