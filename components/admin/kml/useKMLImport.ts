import { useState } from 'react';
import { parseKMLToGeoJSON, KMLParserResult } from './KMLParser';

interface UseKMLImportProps {
  onImportSuccess: (result: KMLParserResult) => void;
}

export function useKMLImport({ onImportSuccess }: UseKMLImportProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const importKML = async (file: File): Promise<boolean> => {
    setError(null);
    setIsProcessing(true);

    try {
      // 1. File type check
      if (!file.name.toLowerCase().endsWith('.kml')) {
        throw new Error('Please upload a valid KML file (.kml).');
      }

      // 2. Read file contents
      const fileReader = new FileReader();
      
      const fileText = await new Promise<string>((resolve, reject) => {
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = () => reject(new Error('Failed to read the file.'));
        fileReader.readAsText(file);
      });

      // 3. Parse KML contents
      const result = parseKMLToGeoJSON(fileText);
      
      // 4. Trigger success callback
      onImportSuccess(result);
      return true;
    } catch (err) {
      console.error('KML import failed:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during KML import.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    importKML,
    error,
    isProcessing,
    setError,
  };
}
