
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, XMarkIcon } from './icons';

interface CameraViewProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const cleanupStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }, [stream]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check permissions and try again.");
      }
    };

    startCamera();

    return () => {
      cleanupStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        onCapture(dataUrl);
        cleanupStream();
      }
    }
  };
  
  const handleClose = () => {
    cleanupStream();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4 text-center">
            {error}
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/75 transition-colors"
          aria-label="Close camera"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleCapture}
          disabled={!!error}
          className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-full flex items-center gap-3 text-lg hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          <CameraIcon className="w-7 h-7" />
          <span>Capture</span>
        </button>
      </div>
    </div>
  );
};
