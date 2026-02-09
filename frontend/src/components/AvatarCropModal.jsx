import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

const AvatarCropModal = ({ image, onSave, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getRadianAngle = (degreeValue) => {
    return (degreeValue * Math.pi) / 180;
  };

  const rotateSize = (width, height, rotation) => {
    const rotRad = getRadianAngle(rotation);
    
    const rotatedWidth = Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height);
    const rotatedHeight = Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height);

    // Ensure we never return 0 or negative values
    return {
      width: Math.max(1, Math.round(rotatedWidth)),
      height: Math.max(1, Math.round(rotatedHeight)),
    };
  };

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    
    // Validate pixel crop values
    if (!pixelCrop || 
        typeof pixelCrop.width !== 'number' || 
        typeof pixelCrop.height !== 'number' ||
        pixelCrop.width <= 0 || 
        pixelCrop.height <= 0) {
      console.error('Invalid pixelCrop:', pixelCrop);
      throw new Error('Invalid crop area dimensions');
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    // Set canvas size for rotation
    canvas.width = safeArea;
    canvas.height = safeArea;

    // Translate to center, rotate, then translate back
    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate(getRadianAngle(rotation));
    ctx.translate(-safeArea / 2, -safeArea / 2);

    // Draw the image in the center
    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    // Calculate the position for cropping from the rotated image
    const cropX = safeArea / 2 - image.width * 0.5 + pixelCrop.x;
    const cropY = safeArea / 2 - image.height * 0.5 + pixelCrop.y;

    // Create a new canvas for the final circular crop
    const size = Math.min(pixelCrop.width, pixelCrop.height);
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = size;
    finalCanvas.height = size;
    
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) {
      throw new Error('Could not get final canvas context');
    }

    // Fill with white background
    finalCtx.fillStyle = '#FFFFFF';
    finalCtx.fillRect(0, 0, size, size);

    // Create circular clipping path
    finalCtx.beginPath();
    finalCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    finalCtx.closePath();
    finalCtx.clip();

    // Draw the cropped portion from the rotated canvas
    finalCtx.drawImage(
      canvas,
      cropX,
      cropY,
      size,
      size,
      0,
      0,
      size,
      size
    );

    return new Promise((resolve, reject) => {
      finalCanvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.92);
    });
  };

  const handleSave = async () => {
    try {
      if (!croppedAreaPixels) {
        console.error('No cropped area pixels available');
        alert('Silakan atur area crop terlebih dahulu');
        return;
      }

      // Validate croppedAreaPixels has valid dimensions
      if (!croppedAreaPixels.width || !croppedAreaPixels.height || 
          croppedAreaPixels.width <= 0 || croppedAreaPixels.height <= 0) {
        console.error('Invalid cropped area dimensions:', croppedAreaPixels);
        alert('Area crop tidak valid. Silakan coba lagi.');
        return;
      }



      if (!image) {
        throw new Error('No image available to crop');
      }

      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      );
      
      if (!croppedImage) {
        throw new Error('Failed to create cropped image');
      }
      
      onSave(croppedImage);
    } catch (e) {
      console.error('Error cropping image:', e);
      alert('Gagal memotong gambar: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-dark-border flex-shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            Potong Foto
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-cardHover transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Crop Area */}
        <div className="relative bg-gray-100 dark:bg-gray-800 h-64 sm:h-80">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="p-3 sm:p-4 space-y-3 border-t border-gray-200 dark:border-dark-border">
          {/* Zoom Control */}
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1.5 sm:space-x-2">
                <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Zoom</span>
              </label>
              <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700 dark:text-gray-300" />
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-dark-bg rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Rotation Control */}
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1.5 sm:space-x-2">
                <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Rotasi</span>
              </label>
              <span className="text-xs text-gray-500 dark:text-gray-400">{rotation}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-dark-bg rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-200 dark:bg-dark-bg text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-cardHover transition-colors font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropModal;
