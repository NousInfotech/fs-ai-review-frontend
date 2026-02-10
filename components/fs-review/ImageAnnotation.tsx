import React, { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Text } from "react-konva";
import { Loader2, Download, Eye, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Location } from "@/types/review";

interface ImageAnnotationProps {
  location: Location;
  testId: string;
  color?: string;
}

export default function ImageAnnotation({ location, testId, color = "#ef4444" }: ImageAnnotationProps) {
  const [isViewing, setIsViewing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnnotated, setShowAnnotated] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [zoomScale, setZoomScale] = useState(1);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageUrl = location.url || "";

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
      setStageSize({ width: img.width, height: img.height });
    };
  }, [imageUrl]);

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomScale(1);

  const handleView = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAnnotated(true);
    }, 2000);
  };

  const handleDownload = () => {
    if (!stageRef.current) return;
    // To ensure download is full resolution regardless of view zoom
    const oldScale = stageRef.current.scaleX();
    stageRef.current.scale({ x: 1, y: 1 });
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    stageRef.current.scale({ x: oldScale, y: oldScale });

    const link = document.createElement("a");
    link.download = `annotated-${testId}-page-${location.page_no}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4 w-full" ref={containerRef}>
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex flex-col shadow-sm transition-all hover:shadow-md">
        {!showAnnotated ? (
          <div className="relative w-full overflow-hidden" style={{ height: 350 }}>
            {image && (
              <img
                src={imageUrl}
                alt="preview"
                className="w-full h-full object-cover bg-white blur-md opacity-60 scale-105"
              />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 hover:bg-black/10 transition-colors">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-white/90 rounded-full shadow-lg backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 bg-white/80 px-4 py-1.5 rounded-full backdrop-blur-sm">
                    AI is processing markings...
                  </span>
                </div>
              ) : (
                <Button onClick={handleView} className="shadow-xl px-8 h-12 rounded-full text-base font-bold bg-primary hover:bg-primary/90 transition-all hover:scale-105">
                  <Eye className="w-5 h-5 mr-2" />
                  View Markings
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative w-full">
            {/* Scrollable Container */}
            <div className="w-full overflow-auto max-h-[550px] border-b border-gray-100 bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              <div className="flex justify-center bg-gray-50 p-6 min-w-max">
                <Stage
                  width={stageSize.width * zoomScale}
                  height={stageSize.height * zoomScale}
                  scaleX={zoomScale}
                  scaleY={zoomScale}
                  ref={stageRef}
                  className="shadow-2xl rounded-sm overflow-hidden bg-white transition-all duration-300 ease-out"
                >
                  <Layer>
                    {image && (
                      <KonvaImage
                        image={image}
                        width={stageSize.width}
                        height={stageSize.height}
                      />
                    )}
                    {location.annotation_data.map((ann, i) => (
                      <React.Fragment key={i}>
                        <Rect
                          x={ann.bbox.x}
                          y={ann.bbox.y}
                          width={ann.bbox.width}
                          height={ann.bbox.height}
                          stroke={color}
                          strokeWidth={4 / zoomScale} // Adjust stroke to look consistent when zoomed
                          fill={color.includes("rgba") ? color : `${color}26`}
                        />
                        {ann.note && (
                          <Text
                            text={ann.note}
                            x={10}
                            y={10 + (i * 20)} // Offset if multiple notes
                            fontSize={12 / zoomScale}
                            fill={color}
                            fontStyle="bold"
                            shadowColor="white"
                            shadowBlur={2}
                            shadowOpacity={1}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </Layer>
                </Stage>
              </div>
            </div>
            
            {/* Floating Controls Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              {/* Download Button */}
              <Button
                onClick={handleDownload}
                variant="outline"
                size="icon"
                className="w-10 h-10 bg-white/90 hover:bg-white text-primary border-primary/20 shadow-xl backdrop-blur-sm transition-all hover:scale-110 rounded-full"
                title="Download Annotated Image"
              >
                <Download className="w-5 h-5" />
              </Button>

              {/* Zoom Controls */}
              <div className="flex flex-col gap-1 p-1 bg-white/90 backdrop-blur-sm rounded-full border border-primary/20 shadow-xl overflow-hidden">
                <Button
                  onClick={handleZoomIn}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 hover:bg-primary/10 text-primary rounded-full"
                  title="Zoom In"
                  disabled={zoomScale >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                
                <div className="text-[10px] font-bold text-primary text-center py-0.5" style={{ lineHeight: '1.5' }}>
                  {Math.round(zoomScale * 100)}%
                </div>

                <Button
                  onClick={handleZoomOut}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 hover:bg-primary/10 text-primary rounded-full"
                  title="Zoom Out"
                  disabled={zoomScale <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>

                <Button
                  onClick={handleResetZoom}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 hover:bg-primary/10 text-primary rounded-full mt-1 border-t border-primary/10 pt-1"
                  title="Reset Zoom"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
