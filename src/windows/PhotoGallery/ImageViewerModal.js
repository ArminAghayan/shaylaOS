import React from "react";
import { Window, WindowContent, Button, Divider, WindowHeader } from "react95";
import photoPlaceholder from "../../assets/photo.png";
import "./ImageViewerStyles.scss";

export default function ImageViewerModal({ onClose, image }) {
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [imgSrc, setImgSrc] = React.useState(image.actualImage || image.avatar || photoPlaceholder);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleImageError = () => {
    console.error("Image failed to load:", imgSrc);
    setError(true);
    setImgSrc(photoPlaceholder);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", imgSrc);
    setLoading(false);
    setError(false);
  };

  const handleReloadImage = () => {
    if (image.actualImage) {
      // Add a cache-busting parameter
      const cacheBuster = `?t=${Date.now()}`;
      const urlWithCacheBuster = image.actualImage.includes('?') 
        ? `${image.actualImage}&cb=${Date.now()}`
        : `${image.actualImage}${cacheBuster}`;
        
      console.log("Reloading image with cache buster:", urlWithCacheBuster);
      setLoading(true);
      setError(false);
      setImgSrc(urlWithCacheBuster);
    }
  };

  React.useEffect(() => {
    console.log("ImageViewerModal - Image data:", image);
  }, [image]);

  return (
    <Window className="win95-image-viewer">
      <WindowHeader className="viewer-header">
        <span>ShaylaOS Image Viewer - {image.name}</span>
        <Button onClick={onClose} className="close-button">X</Button>
      </WindowHeader>
      <WindowContent className="viewer-content">
        <div className="toolbar">
          <div className="zoom-controls">
            <Button onClick={handleZoomOut} disabled={zoomLevel <= 50}>
              <span>-</span>
            </Button>
            <span className="zoom-level">{zoomLevel}%</span>
            <Button onClick={handleZoomIn} disabled={zoomLevel >= 200}>
              <span>+</span>
            </Button>
            <Button onClick={handleResetZoom}>
              Reset
            </Button>
            {error && (
              <Button onClick={handleReloadImage}>
                Reload
              </Button>
            )}
          </div>
        </div>
        
        <Divider />
        
        <div className="image-container">
          {loading && <div className="loading-indicator">Loading image...</div>}
          <img 
            src={imgSrc} 
            alt={image.name}
            style={{ 
              maxWidth: `${zoomLevel}%`,
              maxHeight: '100%',
            }}
            className="image-display"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>
        
        <Divider />
        
        <div className="image-info">
          <div className="info-panel">
            <div className="info-row">
              <span className="info-label">File name:</span>
              <span className="info-value">{image.name}</span>
            </div>
            {image.size && (
              <div className="info-row">
                <span className="info-label">Size:</span>
                <span className="info-value">{image.size}</span>
              </div>
            )}
            {error && (
              <div className="error-message">
                Error loading image. Try the Reload button.
              </div>
            )}
          </div>
        </div>
      </WindowContent>
    </Window>
  );
} 