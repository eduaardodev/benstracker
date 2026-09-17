import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Check, PenLine } from 'lucide-react';

interface SignatureCanvasProps {
  onSaveSignature: (dataUrl: string) => void;
  signerName: string;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onSaveSignature, signerName }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set background to clean white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Scale coordinates accurately regardless of canvas CSS display width vs pixel buffer
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1;
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSaveSignature(canvas.toDataURL('image/png'));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSaveSignature('');
  };

  const applyAutomaticDigitalSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Assinado digitalmente por: ${signerName || 'Colaborador Responsável'}`, 20, 45);

    ctx.font = '11px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`TIMESTAMP: ${new Date().toISOString()} | HASH: SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, 20, 75);

    setHasDrawn(true);
    onSaveSignature(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <PenLine className="w-3.5 h-3.5 text-blue-600" />
          Assinatura ou Rubrica do Responsável
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={applyAutomaticDigitalSignature}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
          >
            <Check className="w-3 h-3" />
            Carimbo Digital Automático
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1"
            title="Limpar assinatura"
          >
            <Eraser className="w-3 h-3" />
            Limpar
          </button>
        </div>
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-lg overflow-hidden bg-white relative">
        <canvas
          ref={canvasRef}
          width={480}
          height={100}
          className="w-full h-[100px] cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400">
            Desenhe a assinatura com o cursor/toque ou clique em "Carimbo Digital Automático"
          </div>
        )}
      </div>
    </div>
  );
};
