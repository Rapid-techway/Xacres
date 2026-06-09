import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface KMLDropzoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export function KMLDropzone({ onFileSelect, isProcessing }: KMLDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
    // Clear the input value so that the same file can be selected and imported again
    e.target.value = '';
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`relative w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-5 text-center transition-all duration-200 cursor-pointer min-h-[110px] group ${
        isDragActive
          ? 'border-blue-600 bg-blue-50/20'
          : 'border-slate-200 bg-slate-50/30 hover:bg-white hover:border-blue-500/60'
      } ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".kml"
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
        className="hidden"
        disabled={isProcessing}
      />

      <div className="flex flex-col items-center gap-2">
        {isProcessing ? (
          <Loader2 size={18} className="text-blue-600 animate-spin" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors">
            <Upload size={14} />
          </div>
        )}

        <div className="space-y-0.5">
          <span className="text-[10.5px] font-bold text-slate-700 block">
            {isProcessing ? 'Importing boundaries...' : 'Import KML Boundary'}
          </span>
          <span className="text-[9px] font-semibold text-slate-450 uppercase tracking-wider block">
            Drag & drop or click to browse (.kml)
          </span>
        </div>
      </div>
    </div>
  );
}
