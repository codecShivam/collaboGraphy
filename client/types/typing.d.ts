type Draw = {
  ctx: CanvasRenderingContext2D
  currentPoint: Point
  prevPoint: Point | null
}

type Point = { x: number; y: number }

type DrawLineProps = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
  brushWidth: number;
};