import { useState } from 'react';
import { KMLDropzone } from './KMLDropzone';
import { useKMLImport } from './useKMLImport';
import { KMLParserResult } from './KMLParser';
import { AlertCircle, CheckCircle2, FileCode } from 'lucide-react';

interface KMLUploadProps {
  onImportSuccess: (result: KMLParserResult) => void;
}

export function KMLUpload({ onImportSuccess }: KMLUploadProps) {
  const [successFile, setSuccessFile] = useState<string | null>(null);
  
  const { importKML, error, isProcessing, setError } = useKMLImport({
    onImportSuccess: (result) => {
      onImportSuccess(result);
      setError(null);
    },
  });

  const handleFileSelect = async (file: File) => {
    setSuccessFile(null);
    const success = await importKML(file);
    if (success) {
      setSuccessFile(file.name);
      // Automatically clear success state banner after a few seconds
      setTimeout(() => setSuccessFile(null), 5000);
    }
  };

  return (
    <div className="w-full space-y-3">
      <KMLDropzone onFileSelect={handleFileSelect} isProcessing={isProcessing} />

      {/* Error alert banner */}
      {error && (
        <div className="p-3 bg-red-50/50 border border-red-100/50 rounded-xl flex items-start gap-2 text-red-600 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <p className="text-[10px] font-semibold leading-relaxed">{error}</p>
        </div>
      )}

      {/* Success alert banner */}
      {successFile && (
        <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl flex items-start gap-2 text-emerald-700 animate-in fade-in slide-in-from-top-1 duration-200">
          <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider block">Boundary Imported</span>
            <p className="text-[9.5px] font-semibold leading-snug flex items-center gap-1">
              <FileCode size={11} className="shrink-0" />
              {successFile}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
