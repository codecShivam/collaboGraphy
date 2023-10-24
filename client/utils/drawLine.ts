type DrawLineProps = Draw & {
  color: string;
  linesWidth: number;
};

const drawLine = ({
  currentPoint,
  prevPoint,
  ctx,
  color,
  linesWidth,
}: DrawLineProps) => {
  const { x: currX, y: currY } = currentPoint; // Destructure current point
  const lineColor = color;
  const lineWidth = linesWidth;

  let startPoint = prevPoint ?? currentPoint; // Set start point to previous point or current point
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(startPoint.x, startPoint.y); // Move to start point
  ctx.lineTo(currX, currY); // Draw line to current point
  ctx.stroke(); // Stroke the line

  ctx.fillStyle = lineColor; // Set fill color
  ctx.beginPath(); // Begin new path
  ctx.arc(startPoint.x, startPoint.y, lineWidth / 2.5, 0, 2 * Math.PI); // Draw a small circle at start point
  ctx.fill(); // Fill the circle
};
export default drawLine;
