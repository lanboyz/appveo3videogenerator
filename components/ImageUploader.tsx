import React, { useState, useCallback } from 'react';
import { UploadIcon, XIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: { base64: string; mimeType: string } | null) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check for valid file types
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        alert('Invalid file type. Please upload a PNG, JPG, or WEBP image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        onImageUpload({ base64: base64String, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const removeImage = () => {
    setPreview(null);
    onImageUpload(null);
  };

  return (
    <div className="w-full min-h-[192px] flex flex-col items-center justify-center bg-white/50 border-2 border-dashed border-blue-300 rounded-lg p-4 transition-all duration-300">
      {preview ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img src={preview} alt="Reference preview" className="max-h-32 object-contain rounded-md" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-white/80 backdrop-blur-sm text-blue-600 rounded-full p-1 shadow-md hover:bg-blue-100 disabled:opacity-50"
            disabled={disabled}
            aria-label="Remove image"
          >
            <XIcon />
          </button>
        </div>
      ) : (
        <label htmlFor="image-upload" className={`cursor-pointer text-center w-full h-full flex flex-col justify-center items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <div className="text-blue-500 mx-auto">
            <UploadIcon />
          </div>
          <p className="mt-1 text-sm font-semibold text-blue-700">Click to upload</p>
          <p className="text-xs text-blue-500">PNG, JPG, WEBP</p>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            onClick={(event) => { (event.target as HTMLInputElement).value = '' }}
            disabled={disabled}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUploader;