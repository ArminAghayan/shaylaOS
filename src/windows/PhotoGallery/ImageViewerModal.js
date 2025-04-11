import React from "react";
import { Window, WindowContent, Button, Toolbar, Divider } from "react95";
import Draggable from "react-draggable";

export default function ImageViewerModal({ onClose, image }) {
  const [zoomLevel, setZoomLevel] = React.useState(100);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <Draggable
      handle=".handle"
      defaultPosition={{ x: 0, y: 0 }}
    >
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 999,
          width: '80%',
          maxWidth: '640px'
        }}
      >
        <Window className="image-viewer">
          <div className="handle" style={{ cursor: 'move' }}>
            <WindowContent style={{ padding: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Toolbar style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button onClick={handleZoomOut} disabled={zoomLevel <= 50} style={{ marginRight: '4px' }}>
                      <span style={{ fontWeight: 'bold' }}>-</span>
                    </Button>
                    <span style={{ margin: '0 8px' }}>{zoomLevel}%</span>
                    <Button onClick={handleZoomIn} disabled={zoomLevel >= 200} style={{ marginRight: '4px' }}>
                      <span style={{ fontWeight: 'bold' }}>+</span>
                    </Button>
                    <Button onClick={handleResetZoom} style={{ marginRight: '4px' }}>
                      Reset
                    </Button>
                  </div>
                  <Button onClick={onClose}>
                    <span style={{ fontWeight: 'bold' }}>X</span>
                  </Button>
                </Toolbar>
                <Divider />
                <div 
                  style={{ 
                    padding: '16px', 
                    background: '#c0c0c0',
                    overflowY: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    minHeight: '300px'
                  }}
                >
                  <div 
                    style={{ 
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <img 
                      src={image.avatar} 
                      alt={image.name}
                      style={{ 
                        maxWidth: `${zoomLevel}%`,
                        maxHeight: '100%',
                        objectFit: 'contain',
                        imageRendering: 'pixelated', // Windows 95 style pixelated rendering
                      }}
                      className="pixelated"
                    />
                  </div>
                </div>
                <Divider />
                <div style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{image.name}</span>
                  <span>Size: {image.size || 'Unknown'}</span>
                </div>
              </div>
            </WindowContent>
          </div>
        </Window>
      </div>
    </Draggable>
  );
} 