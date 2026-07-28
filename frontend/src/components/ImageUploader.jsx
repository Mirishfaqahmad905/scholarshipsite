import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export const ImageUploader = ({
  value,
  onChange,
  label = 'Upload Image (Stored as Base64 format)',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|jpg|webp|gif|svg\+xml)$/)) {
      setError('Please upload a valid image file (JPG, PNG, WEBP, SVG)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('File size must be less than 8MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', file);

      try {
        const { data } = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (data.filePath || data.base64) {
          onChange(data.filePath || data.base64);
          return;
        }
      } catch (apiErr) {
        console.warn('Server upload failed, converting directly to Base64 in browser...');
      }

      const base64Uri = await convertFileToBase64(file);
      onChange(base64Uri);
    } catch (err) {
      console.error('File upload error:', err);
      setError(err.message || 'Failed to process image file into Base64 format');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label}
      </label>

      {value ? (
        <div className="relative rounded-xl border border-slate-700 bg-slate-950 p-2 flex items-center gap-3">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-16 h-16 object-cover rounded-lg border border-slate-800"
            onError={(e) => {
              e.target.src = '/uploads/default-scholarship.jpg';
            }}
          />
          <div className="flex-1 min-w-0 text-xs">
            <p className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Image Stored in Base64 Format
            </p>
            <p className="text-slate-400 truncate text-[11px] mt-0.5">
              {value.startsWith('data:') ? 'Base64 Data String (Self-Contained)' : value}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-400 bg-slate-950/60 rounded-xl p-4 text-center cursor-pointer transition-colors group">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg,image/svg+xml"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center space-y-1">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-amber-400 transition-colors" />
            )}
            <p className="text-xs font-medium text-slate-200">
              {uploading ? 'Converting image to Base64...' : 'Click or drag image file to upload'}
            </p>
            <p className="text-[10px] text-slate-500">JPG, PNG, WEBP, SVG (Auto-encoded as Base64)</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
