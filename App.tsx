
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { CameraView } from './components/CameraView';
import { ResultDisplay } from './components/ResultDisplay';
import { ImageInput } from './components/ImageInput';
import { QrCodeIcon, XMarkIcon } from './components/icons';

// Make jsQR available globally from the script loaded in index.html
declare const jsQR: (data: Uint8ClampedArray, width: number, height: number) => { data: string } | null;

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setImageSrc(null);
    setQrData(null);
    setError(null);
    setIsLoading(false);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, []);

  const analyzeQRCode = useCallback((src: string) => {
    setIsLoading(true);
    setQrData(null);
    setError(null);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Could not get canvas context.');
        setIsLoading(false);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      try {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) {
          setQrData(code.data);
        } else {
          setError('No QR Code found in the image. Please try another one.');
        }
      } catch (e) {
        setError('An error occurred while scanning the QR code.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    img.onerror = () => {
      setError('Failed to load the image.');
      setIsLoading(false);
    };
    img.src = src;
  }, []);

  useEffect(() => {
    if (imageSrc) {
      analyzeQRCode(imageSrc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (imageSrc || isCameraOpen) {
        return;
      }

      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
              setImageSrc(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            return;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [imageSrc, isCameraOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = (dataUrl: string) => {
    setImageSrc(dataUrl);
    setIsCameraOpen(false);
  };
  
  if (isCameraOpen) {
    return <CameraView onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />;
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 text-gray-100 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
            <div className="inline-block p-2">
                <div className="flex items-center justify-center gap-4">
                    <QrCodeIcon className="h-10 w-10 text-indigo-400" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">QR Code Analyzer</h1>
                </div>
            </div>
            <p className="text-lg text-gray-400 mt-4">Upload an image or use your camera to instantly decode QR codes.</p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-xl border border-dashed border-gray-700 rounded-2xl shadow-2xl shadow-indigo-900/20 p-6 transition-all duration-300">
          {imageSrc ? (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md mb-6">
                <img src={imageSrc} alt="QR Code Preview" className="rounded-lg shadow-lg w-full object-contain max-h-80" />
                <button 
                  onClick={resetState}
                  className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-transform hover:scale-110"
                  aria-label="Close preview"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <ResultDisplay isLoading={isLoading} qrData={qrData} error={error} />
            </div>
          ) : (
            <ImageInput 
              onFileChange={handleFileChange} 
              onCameraClick={() => setIsCameraOpen(true)}
              fileInputRef={fileInputRef}
            />
          )}
        </main>
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Vibe coded by{' '}
            <a 
              href="https://dcesares.dev" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              @idcesares
            </a>{' '}
            | Github{' '}
            <a 
              href="https://github.com/idcesares" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              @idcesares
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
