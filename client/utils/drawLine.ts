type Draw = {
  prevPoint: Point | null;
  currentPoint: Point;
  ctx: CanvasRenderingContext2D | null;
};

type Point = { x: number; y: number };

type DrawLineProps = Draw & {
  color: string;
  brushWidth: number;
};

export const drawLine = ({ prevPoint, currentPoint, ctx, color, brushWidth }: DrawLineProps) => {
  if (!ctx) return;
  const { x: currX, y: currY } = currentPoint;
  const lineColor = color;

  let startPoint = prevPoint || currentPoint;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();

  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, brushWidth / 2, 0, 2 * Math.PI);
  ctx.fill();
};
