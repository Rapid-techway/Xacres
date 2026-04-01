'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Trash2, LayoutGrid, CheckCircle2, XCircle, Copy, Code2 } from 'lucide-react';
import {
  GeoJsonFeature,
  GeoJsonFeatureCollection,
  getEditableVertices,
  EXAMPLE_GEOJSON,
} from '../../lib/types';

interface BoundarySheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  polygonsData: GeoJsonFeature[];
  onUpdateCoordinate: (
    polygonIndex: number,
    vertexIndex: number,
    field: 'lat' | 'lng',
    value: string
  ) => void;
  onRemovePolygon: (index: number) => void;
  onImportGeoJson: (geoJson: GeoJsonFeatureCollection) => void;
}

export default function BoundarySheet({
  isOpen,
  onOpenChange,
  polygonsData,
  onUpdateCoordinate,
  onRemovePolygon,
  onImportGeoJson,
}: BoundarySheetProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccess, setJsonSuccess] = useState(false);
  const [showExample, setShowExample] = useState(true);

  const handleCopyExample = () => {
    const exampleText = JSON.stringify(EXAMPLE_GEOJSON, null, 2);
    navigator.clipboard.writeText(exampleText);
  };

  const handleImportJson = () => {
    setJsonError(null);
    setJsonSuccess(false);

    if (!jsonInput.trim()) {
      setJsonError('Please enter GeoJSON data');
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      // Validate basic structure
      if (!parsed.type) {
        throw new Error('Missing "type" field');
      }

      // Support both FeatureCollection and single Feature
      let featureCollection: GeoJsonFeatureCollection;

      if (parsed.type === 'FeatureCollection') {
        if (!Array.isArray(parsed.features)) {
          throw new Error('FeatureCollection must have a "features" array');
        }
        featureCollection = parsed;
      } else if (parsed.type === 'Feature') {
        // Wrap single feature in collection
        featureCollection = {
          type: 'FeatureCollection',
          features: [parsed],
        };
      } else {
        throw new Error('GeoJSON must be a Feature or FeatureCollection');
      }

      // Validate features
      for (let i = 0; i < featureCollection.features.length; i++) {
        const feature = featureCollection.features[i];
        if (feature.type !== 'Feature') {
          throw new Error(`Feature ${i + 1}: type must be "Feature"`);
        }
        if (!feature.geometry || feature.geometry.type !== 'Polygon') {
          throw new Error(`Feature ${i + 1}: geometry must be type "Polygon"`);
        }
        if (!Array.isArray(feature.geometry.coordinates)) {
          throw new Error(`Feature ${i + 1}: missing coordinates array`);
        }
        if (feature.geometry.coordinates.length === 0) {
          throw new Error(`Feature ${i + 1}: coordinates array is empty`);
        }
      }

      // Import successful
      onImportGeoJson(featureCollection);
      setJsonSuccess(true);
      setJsonInput('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setJsonSuccess(false), 3000);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setJsonError('Invalid JSON syntax');
      } else if (error instanceof Error) {
        setJsonError(error.message);
      } else {
        setJsonError('Failed to parse GeoJSON');
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-900 font-semibold text-xs px-4 py-2.5 h-auto rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <LayoutGrid size={14} strokeWidth={2.5} />
          Boundary Manager
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-xl p-0 border-l border-gray-100 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/50">
          <SheetHeader className="space-y-1.5">
            <SheetTitle className="text-lg font-bold tracking-tight text-gray-900 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                <MapPin size={16} strokeWidth={2.5} />
              </div>
              Boundary Manager
            </SheetTitle>
            <p className="text-xs text-gray-500 font-medium">
              Import GeoJSON or view existing polygon coordinates
            </p>
          </SheetHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* GeoJSON Import Section */}
          <div className="p-6 space-y-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Import GeoJSON</h3>
              <button
                onClick={() => setShowExample(!showExample)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Code2 size={12} />
                {showExample ? 'Hide' : 'Show'} Example
              </button>
            </div>

            {/* Example GeoJSON */}
            {showExample && (
              <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={handleCopyExample}
                    className="p-1.5 bg-gray-900/80 hover:bg-gray-900 text-white rounded-md transition-colors"
                    title="Copy example"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <pre className="text-[10px] bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto font-mono leading-relaxed">
{JSON.stringify(EXAMPLE_GEOJSON, null, 2)}
                </pre>
                <p className="text-[10px] text-gray-500 mt-1.5 font-medium italic">
                  Format: FeatureCollection with Polygon geometry • Coordinates: [longitude, latitude]
                </p>
              </div>
            )}

            {/* JSON Input */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-gray-700">
                Paste Your GeoJSON
              </Label>
              <Textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                  setJsonSuccess(false);
                }}
                placeholder='{"type": "FeatureCollection", "features": [...]}'
                className="min-h-[120px] text-xs font-mono bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-400 rounded-lg resize-none"
              />
              
              {/* Error Message */}
              {jsonError && (
                <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-medium">{jsonError}</p>
                </div>
              )}

              {/* Success Message */}
              {jsonSuccess && (
                <div className="flex items-start gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700 font-medium">
                    GeoJSON imported successfully!
                  </p>
                </div>
              )}

              {/* Import Button */}
              <Button
                onClick={handleImportJson}
                disabled={!jsonInput.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold text-xs h-10 rounded-lg shadow-sm transition-all"
              >
                Import to Map
              </Button>
            </div>
          </div>

          {/* Current Polygons Section */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Current Polygons</h3>
              {polygonsData.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                  {polygonsData.length} polygon{polygonsData.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {polygonsData.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <LayoutGrid className="w-10 h-10 text-gray-300 mb-3" strokeWidth={1.5} />
                <p className="text-sm font-semibold text-gray-500">No polygons yet</p>
                <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                  Import GeoJSON or draw boundaries on the map
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Array.isArray(polygonsData) && polygonsData.map((poly, pIdx) => {
                  const editableVertices = getEditableVertices(poly.geometry.coordinates[0]);
                  
                  return (
                    <div key={pIdx} className="space-y-3 group">
                      {/* Polygon Header */}
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                            {pIdx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">
                              Polygon {pIdx + 1}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-medium">
                              {editableVertices.length} vertices
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemovePolygon(pIdx)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Coordinates Grid */}
                      <div className="space-y-2">
                        {editableVertices.map((coord, cIdx) => (
                          <div key={cIdx} className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              {cIdx === 0 && (
                                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-0.5">
                                  Latitude
                                </Label>
                              )}
                              <Input
                                type="number"
                                step="any"
                                value={coord[1]}
                                onChange={(e) => onUpdateCoordinate(pIdx, cIdx, 'lat', e.target.value)}
                                className="h-9 px-2.5 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-400 rounded-lg text-xs font-mono transition-colors"
                                placeholder="28.7041"
                              />
                            </div>
                            <div className="space-y-1">
                              {cIdx === 0 && (
                                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-0.5">
                                  Longitude
                                </Label>
                              )}
                              <Input
                                type="number"
                                step="any"
                                value={coord[0]}
                                onChange={(e) => onUpdateCoordinate(pIdx, cIdx, 'lng', e.target.value)}
                                className="h-9 px-2.5 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white focus:border-blue-400 rounded-lg text-xs font-mono transition-colors"
                                placeholder="76.0856"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-br from-gray-50/50 to-white">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-gray-900 hover:bg-black text-white font-semibold text-xs h-11 rounded-lg shadow-sm transition-all"
          >
            Close Manager
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}