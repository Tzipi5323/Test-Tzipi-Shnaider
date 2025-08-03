import React, { useRef, useEffect } from 'react';
import type { DrawCommand } from '../types';

interface CanvasDrawProps {
  commands: DrawCommand[];
  width?: number;
  height?: number;
}

function drawCircle(ctx: CanvasRenderingContext2D, cmd: DrawCommand) {
  if (
    cmd.type === 'circle' &&
    typeof cmd.x === 'number' &&
    typeof cmd.y === 'number' &&
    typeof cmd.radius === 'number'
  ) {
    ctx.beginPath();
    ctx.arc(cmd.x, cmd.y, cmd.radius, 0, 2 * Math.PI);
    ctx.fillStyle = cmd.color || 'yellow';
    ctx.fill();
  }
}

function drawRect(ctx: CanvasRenderingContext2D, cmd: DrawCommand) {
  if (
    cmd.type === 'rect' &&
    typeof cmd.x === 'number' &&
    typeof cmd.y === 'number' &&
    typeof cmd.width === 'number' &&
    typeof cmd.height === 'number'
  ) {
    ctx.fillStyle = cmd.color || 'blue';
    ctx.fillRect(cmd.x, cmd.y, cmd.width, cmd.height);
  }
}

function drawLine(ctx: CanvasRenderingContext2D, cmd: DrawCommand) {
  if (
    cmd.type === 'line' &&
    typeof cmd.x1 === 'number' &&
    typeof cmd.y1 === 'number' &&
    typeof cmd.x2 === 'number' &&
    typeof cmd.y2 === 'number'
  ) {
    ctx.strokeStyle = cmd.color || 'black';
    ctx.lineWidth = cmd.width || 2;
    ctx.beginPath();
    ctx.moveTo(cmd.x1, cmd.y1);
    ctx.lineTo(cmd.x2, cmd.y2);
    ctx.stroke();
  }
}

function drawTriangle(ctx: CanvasRenderingContext2D, cmd: DrawCommand) {
  if (cmd.type === 'triangle' && Array.isArray(cmd.points) && cmd.points.length === 6) {
    ctx.beginPath();
    ctx.moveTo(cmd.points[0], cmd.points[1]);
    ctx.lineTo(cmd.points[2], cmd.points[3]);
    ctx.lineTo(cmd.points[4], cmd.points[5]);
    ctx.closePath();
    ctx.fillStyle = cmd.color || 'green';
    ctx.fill();
  }
}

const CanvasDraw: React.FC<CanvasDrawProps> = ({ commands, width = 500, height = 400 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (const cmd of commands) {
      switch (cmd.type) {
        case 'fill':
          ctx.fillStyle = cmd.color || 'white';
          ctx.fillRect(0, 0, width, height);
          break;
        case 'circle':
          drawCircle(ctx, cmd);
          break;
        case 'rect':
          drawRect(ctx, cmd);
          break;
        case 'line':
          drawLine(ctx, cmd);
          break;
        case 'triangle':
          drawTriangle(ctx, cmd);
          break;
        default:
          break;
      }
    }
  }, [commands, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ border: '1px solid #ccc', background: '#fff' }}
    />
  );
};

export default CanvasDraw;
