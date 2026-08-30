import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, PenTool, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const Scratchpad: React.FC<Props> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#1e293b');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = isEraser ? 16 : lineWidth;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-xl overflow-hidden flex flex-col h-[320px] md:h-[380px]">
      {/* Scratchpad Toolbar */}
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <PenTool className="w-4 h-4 text-sky-600" />
          <span>수학 연습장 (터치/마우스로 자유롭게 계산하세요)</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Color buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            {['#1e293b', '#ef4444', '#3b82f6'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  !isEraser && color === c ? 'scale-125 border-amber-400' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}

            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`p-1 rounded text-xs font-bold flex items-center gap-1 ${
                isEraser ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="지우개"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1"
            title="전체 지우기"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>지우기</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawing Canvas */}
      <div className="flex-1 relative bg-white touch-none cursor-crosshair">
        {/* Background Grid Lines for Math calculations */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full relative z-10"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
};
