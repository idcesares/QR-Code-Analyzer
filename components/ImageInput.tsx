
import React from 'react';
import { CameraIcon, PhotoIcon } from './icons';

interface ImageInputProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onFileChange, onCameraClick, fileInputRef }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-600 rounded-xl text-center">
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        ref={fileInputRef}
        id="file-upload"
      />
      <h2 className="text-2xl font-semibold mb-2 text-white">Get Started</h2>
      <p className="text-gray-400 mb-6 max-w-sm">
        Choose an image from your device, use your camera, or simply paste an image from your clipboard.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <label
          htmlFor="file-upload"
          className="flex-1 cursor-pointer bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
        >
          <PhotoIcon className="w-6 h-6" />
          <span>Upload Image</span>
        </label>
        <button
          onClick={onCameraClick}
          className="flex-1 bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
        >
          <CameraIcon className="w-6 h-6" />
          <span>Use Camera</span>
        </button>
      </div>
    </div>
  );
};
