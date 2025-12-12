import React, { useRef, useEffect, useState } from 'react';
import { Eraser, PenTool } from 'lucide-react';

interface Props {
  onSave: (dataUrl: string | null) => void;
}

const SignaturePad: React.FC<Props> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set proper resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = '#5D4037';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling on touch
    setIsDrawing(true);
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      setHasDrawn(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (hasDrawn && canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      onSave(null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative border-4 border-dashed border-ac-brown/30 rounded-2xl bg-white overflow-hidden touch-none h-48 w-full">
         {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
                <PenTool className="mr-2" />
                <span>請在此簽名</span>
            </div>
         )}
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <button 
        type="button"
        onClick={clear}
        className="self-end text-ac-brown/70 hover:text-red-500 text-sm font-bold flex items-center gap-1"
      >
        <Eraser size={16} /> 清除重寫
      </button>
    </div>
  );
};

export default SignaturePad;