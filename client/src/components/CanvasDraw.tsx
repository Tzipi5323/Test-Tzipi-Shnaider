
import React, { useRef, useEffect } from 'react';
import type { DrawCommand } from '../types';

interface CanvasDrawProps {
  commands: DrawCommand[];
  width?: number;
  height?: number;
}

const CanvasDraw: React.FC<CanvasDrawProps> = ({ commands, width = 500, height = 400 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (const cmd of commands) {
      switch (cmd.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(cmd.x, cmd.y, cmd.radius, 0, 2 * Math.PI);
          ctx.fillStyle = cmd.color || 'yellow';
          ctx.fill();
          break;
        case 'rect':
          ctx.fillStyle = cmd.color || 'blue';
          ctx.fillRect(cmd.x, cmd.y, cmd.width, cmd.height);
          break;
        case 'line':
          ctx.strokeStyle = cmd.color || 'black';
          ctx.lineWidth = cmd.width || 2;
          ctx.beginPath();
          ctx.moveTo(cmd.x1, cmd.y1);
          ctx.lineTo(cmd.x2, cmd.y2);
          ctx.stroke();
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(cmd.points[0], cmd.points[1]);
          ctx.lineTo(cmd.points[2], cmd.points[3]);
          ctx.lineTo(cmd.points[4], cmd.points[5]);
          ctx.closePath();
          ctx.fillStyle = cmd.color || 'green';
          ctx.fill();
          break;
        default:
          break;
      }
    }
  }, [commands, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} style={{ border: '1px solid #ccc', background: '#fff' }} />;
};

export default CanvasDraw;
