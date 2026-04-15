import React, { useRef, useState } from 'react';
import { uploadFile } from '@/api/services';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, label }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadFile(file);
      onChange(url);
    } catch (e: any) {
      setError(e.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-gray-300">{label}</p>}

      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="preview"
            className="h-32 w-auto rounded-lg border border-white/10 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragging
            ? 'border-blue-400 bg-blue-500/10'
            : 'border-white/20 hover:border-white/40 bg-white/5'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400" />
            <p className="text-sm text-gray-400">Uploading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            {value ? <ImageIcon size={24} /> : <Upload size={24} />}
            <p className="text-sm">{value ? 'Click or drag to replace' : 'Click or drag image here'}</p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10 MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {/* Manual URL input */}
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/images/example.jpg or paste URL"
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default ImageUploader;
