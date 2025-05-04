import React from 'react';
import sticker1 from '../../assets/ideas.png';
import sticker2 from '../../assets/creativity.png';
import sticker3 from '../../assets/sticker3.png';

const StickerLibrary = () => {
  const handleDragStart = (e, src) => {
    e.dataTransfer.setData('text/plain', src);
  };

  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
      <img
        src={sticker1}
        alt="sticker1"
        width={60}
        draggable
        onDragStart={(e) => handleDragStart(e, sticker1)}
      />
      <img
        src={sticker2}
        alt="sticker2"
        width={60}
        draggable
        onDragStart={(e) => handleDragStart(e, sticker2)}
      />
      <img
        src={sticker3}
        alt="sticker3"
        width={60}
        draggable
        onDragStart={(e) => handleDragStart(e, sticker3)}
      />
    </div>
  );
};

export default StickerLibrary;
