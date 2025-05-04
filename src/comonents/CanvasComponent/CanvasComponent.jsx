import React, { useRef, useEffect, useState } from 'react';

const CanvasComponent = ({ imageSrc }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [selectedStickerIndex, setSelectedStickerIndex] = useState(null);
  const [isDraggingSticker, setIsDraggingSticker] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const drawingPaths = useRef([]); // Stores freehand drawing paths

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      drawCanvas(ctx, img, stickers);
    };
  }, [imageSrc, stickers]);

  const drawCanvas = (ctx, backgroundImage, stickersList) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(backgroundImage, 0, 0);

    // Redraw all drawing paths
    drawingPaths.current.forEach((path) => {
      if (path.points.length > 1) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'red';
        ctx.moveTo(path.points[0].x, path.points[0].y);
        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }
        ctx.stroke();
      }
    });

    // Draw stickers
    stickersList.forEach(({ image, x, y }) => {
      ctx.drawImage(image, x, y, 100, 100);
    });
  };

  const startDrawing = () => setDrawing(true);

  const endDrawing = () => {
    setDrawing(false);
    canvasRef.current.getContext('2d').beginPath();
    const lastPath = drawingPaths.current[drawingPaths.current.length - 1];
    if (lastPath) lastPath.done = true;
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Get or start current path
    let currentPath = drawingPaths.current[drawingPaths.current.length - 1];
    if (!currentPath || currentPath.done) {
      currentPath = { points: [], done: false };
      drawingPaths.current.push(currentPath);
    }

    currentPath.points.push({ x, y });

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'red';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const sticker = new Image();
    const src = e.dataTransfer.getData('text/plain');
    sticker.src = src;

    sticker.onload = () => {
      setStickers((prev) => [...prev, { image: sticker, x, y }]);
    };
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = stickers.length - 1; i >= 0; i--) {
      const { x, y } = stickers[i];
      if (mouseX >= x && mouseX <= x + 100 && mouseY >= y && mouseY <= y + 100) {
        setSelectedStickerIndex(i);
        setIsDraggingSticker(true);
        setDragOffset({ x: mouseX - x, y: mouseY - y });
        return;
      }
    }

    setSelectedStickerIndex(null);
    startDrawing();
  };

  const handleMouseUp = () => {
    endDrawing();
    setIsDraggingSticker(false);
  };

  const handleMouseMove = (e) => {
    if (isDraggingSticker && selectedStickerIndex !== null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const updatedStickers = [...stickers];
      updatedStickers[selectedStickerIndex] = {
        ...updatedStickers[selectedStickerIndex],
        x: mouseX - dragOffset.x,
        y: mouseY - dragOffset.y,
      };
      setStickers(updatedStickers);
    } else {
      draw(e);
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    for (let i = stickers.length - 1; i >= 0; i--) {
      const { x, y } = stickers[i];
      if (mouseX >= x && mouseX <= x + 100 && mouseY >= y && mouseY <= y + 100) {
        const updated = [...stickers];
        updated.splice(i, 1);
        setStickers(updated);
        return;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onContextMenu={handleContextMenu}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{ border: '2px solid black', marginTop: 10 }}
    />
  );
};

export default CanvasComponent;
