import React, { useState } from 'react';
import CameraComponent from '../src/comonents/CameraComponent/CameraComponent';
import CanvasComponent from '../src/comonents/CanvasComponent/CanvasComponent';
import StickerLibrary from '../src/comonents/StickerLibrary/StickerLibrary';

function App() {
  const [photo, setPhoto] = useState(null);

  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'edited-photo.png';
    link.href = image;
    link.click();
  };

  const handleReset = () => {
    window.location.reload(); // simple reset
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📷 Interactive Photo Canvas</h2>
      {!photo ? (
        <CameraComponent onCapture={setPhoto} />
      ) : (
        <>
          <CanvasComponent imageSrc={photo} />
          <StickerLibrary />
          <div style={{ marginTop: 20 }}>
            <button onClick={handleExport}>💾 Export</button>
            <button onClick={handleReset}>❌ Discard</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
