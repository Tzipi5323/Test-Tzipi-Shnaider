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
        case 'fill':
          ctx.fillStyle = cmd.color || 'white';
          ctx.fillRect(0, 0, width, height);
          break;
        case 'circle':
          if (typeof cmd.x !== 'number' || typeof cmd.y !== 'number' || typeof cmd.radius !== 'number') continue;
          ctx.beginPath();
          ctx.arc(cmd.x, cmd.y, cmd.radius, 0, 2 * Math.PI);
          ctx.fillStyle = cmd.color || 'yellow';
          ctx.fill();
          break;
        case 'rect':
          if (typeof cmd.x !== 'number' || typeof cmd.y !== 'number' || typeof cmd.width !== 'number' || typeof cmd.height !== 'number') continue;
          ctx.fillStyle = cmd.color || 'blue';
          ctx.fillRect(cmd.x, cmd.y, cmd.width, cmd.height);
          break;
        case 'line':
          if (typeof cmd.x1 !== 'number' || typeof cmd.y1 !== 'number' || typeof cmd.x2 !== 'number' || typeof cmd.y2 !== 'number') continue;
          ctx.strokeStyle = cmd.color || 'black';
          ctx.lineWidth = cmd.width || 2;
          ctx.beginPath();
          ctx.moveTo(cmd.x1, cmd.y1);
          ctx.lineTo(cmd.x2, cmd.y2);
          ctx.stroke();
          break;
        case 'triangle':
          if (!Array.isArray(cmd.points) || cmd.points.length !== 6) continue;
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

export type DrawCommand =
  | { type: 'fill'; color?: string }
  | { type: 'circle'; x: number; y: number; radius: number; color?: string }
  | { type: 'rect'; x: number; y: number; width: number; height: number; color?: string }
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; color?: string; width?: number }
  | { type: 'triangle'; points: [number, number, number, number, number, number]; color?: string }
  | { type: 'heart'; x: number; y: number; size: number; color?: string }
  | { type: 'star'; x: number; y: number; radius: number; points?: number; color?: string }
  | { type: 'flower'; x: number; y: number; radius: number; petals?: number; color?: string }
  | { type: 'grass'; y: number; height: number; width: number; color?: string }
  | { type: 'text'; x: number; y: number; text: string; color?: string; fontSize?: number }
  | { type: 'image'; x: number; y: number; url: string; width?: number; height?: number };
