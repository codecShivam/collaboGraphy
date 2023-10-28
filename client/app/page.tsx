'use client'
import React, { useEffect, useState } from 'react';
import { useDraw } from '../hooks/useDraw';
import { ChromePicker } from 'react-color';
import { io } from 'socket.io-client';
import { drawLine } from '../utils/drawLine';

const socket = io('http://localhost:3001');

export default function Page() {
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState<string>('#fff');
  const [eraserMode, setEraserMode] = useState(false);
  const [brushWidth, setBrushWidth] = useState<number>(5);
  const [color, setColor] = useState<string>('#000');
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
  const [strokeHistory, setStrokeHistory] = useState<DrawLineProps[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawLineProps[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);

  const toggleEraserMode = () => {
    setEraserMode(!eraserMode);
  };

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    const lineColor = eraserMode ? canvasBackgroundColor : color;
    if (ctx) {
      const action: DrawLineProps = { prevPoint, currentPoint, color: lineColor, brushWidth };
      const newStroke = [...currentStroke, action];
      setCurrentStroke(newStroke);
      drawLine({ prevPoint, currentPoint, ctx, color: lineColor, brushWidth });
      socket.emit('draw-line', action); // Emit the draw event to the server
    }
  }

  function saveCurrentStroke() {
    if (currentStroke.length > 0) {
      const newHistory = [...strokeHistory, currentStroke];
      setStrokeHistory(newHistory);
      setCurrentStroke([]);
      setCurrentStep(newHistory.length);
      socket.emit('canvas-state', canvasRef.current?.toDataURL()); // Emit the canvas state to the server
    }
  }

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
      drawLine({
        prevPoint: action.prevPoint,
        currentPoint: action.currentPoint,
        ctx,
        color: action.color,
        brushWidth: action.brushWidth,
      });
      setStrokeHistory((history: any) => [...history, action]);
      setCurrentStep((step) => step + 1);
    });

    socket.on('clear', () => {
      clearCanvas();
      setStrokeHistory([]);
      setCurrentStep(-1);
    });

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mouseup', saveCurrentStroke);
    }

    return () => {
      socket.off('draw-line');
      socket.off('get-canvas-state');
      socket.off('canvas-state-from-server');
      socket.off('clear');
      if (canvas) {
        canvas.removeEventListener('mouseup', saveCurrentStroke);
      }
    };
  }, [canvasRef, clear]);

  function undo() {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      redrawHistory(newStep);
    }
  }

  function redo() {
    if (currentStep < strokeHistory.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      redrawHistory(newStep);
    }
  }

  function redrawHistory(step: number) {
    clearCanvas();
    for (let i = 0; i < step; i++) {
      const actions = strokeHistory[i];
      if (actions) {
        actions.forEach((action) => {
          const ctx = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D;
          drawLine({
            prevPoint: action.prevPoint,
            currentPoint: action.currentPoint,
            ctx,
            color: action.color,
            brushWidth: action.brushWidth,
          });
        });
      }
    }
  }

  function clearCanvas() {
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
    socket.emit('clear'); // Emit a clear event to the server
  }

  return (
    <div>
      <div className='min-h-screen bg-white flex flex-row items-center justify-center'>
        <div className='flex flex-col space-y-6 pr-6'>
          <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
          <button
            type='button'
            className='px-4 py-2 rounded-md border border-black'
            onClick={() => socket.emit('clear')}
          >
            Clear Canvas
          </button>
        </div>

        <div className='flex flex-col space-y-4'>
          <div className="flex flex-col space-y-2">
            <label htmlFor='canvas-background-color' className='text-lg'>
              Choose Canvas Background Color
            </label>
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

          <div className="flex flex-col space-y-2">
            <label htmlFor='brush-size' className='text-lg'>
              Brush Size
            </label>
            <input
              type='number'
              className='px-4 py-2 border border-black rounded-md'
              onChange={(e) => setBrushWidth(+e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
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
          className='shadow-xl border mt-4'
          style={{
            cursor: eraserMode ? 'cell' : 'crosshair',
            backgroundColor: canvasBackgroundColor
          }}
        />
      </div>
    </div>
  );
}
