import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Text } from "react-konva";
import { Loader2, Download } from "lucide-react";
import { Button } from "../ui/Button";
import { Location } from "@/types/review";

interface ImageAnnotationProps {
  location: Location;
  testId: string;
  color?: string;
}

export default function ImageAnnotation({ location, testId, color = "#ef4444" }: ImageAnnotationProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageUrl = location.url || "";

  // Load image and set natural size
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Fix: Tainted canvases error
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
      setNaturalSize({ width: img.width, height: img.height });
    };
  }, [imageUrl]);

  // Handle responsive resizing
  useEffect(() => {
    if (!naturalSize.width || !containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const newScale = containerWidth / naturalSize.width;
      
      setScale(newScale);
      setDisplaySize({
        width: containerWidth,
        height: naturalSize.height * newScale
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [naturalSize]);

  const handleDownload = () => {
    if (!stageRef.current) return;
    
    // Save current display state
    const oldScale = stageRef.current.scaleX();
    const oldWidth = stageRef.current.width();
    const oldHeight = stageRef.current.height();

    // Set to natural resolution for full export
    stageRef.current.width(naturalSize.width);
    stageRef.current.height(naturalSize.height);
    stageRef.current.scale({ x: 1, y: 1 });
    
    // Capture high-quality data URL
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });

    // Restore original display state
    stageRef.current.width(oldWidth);
    stageRef.current.height(oldHeight);
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
      <div className="relative rounded-xl border border-gray-200 bg-white flex flex-col shadow-sm transition-all hover:shadow-md">
        {!image ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-3 bg-gray-50/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm font-medium text-gray-500">Loading image...</span>
          </div>
        ) : (
          <div className="w-full relative group">
            {/* Download Button - Top Right */}
            <div className="absolute top-4 right-4 z-20 transition-opacity">
              <Button
                onClick={handleDownload}
                variant="outline"
                size="icon"
                className="w-9 h-9 bg-white/90 hover:bg-white text-primary border-primary/20 shadow-lg backdrop-blur-sm rounded-full transition-transform hover:scale-110"
                title="Download Annotated Image"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <Stage
              width={displaySize.width}
              height={displaySize.height}
              scaleX={scale}
              scaleY={scale}
              ref={stageRef}
              className="bg-white overflow-hidden"
            >
              <Layer>
                <KonvaImage
                  image={image}
                  width={naturalSize.width}
                  height={naturalSize.height}
                />
                {location.annotation_data && location.annotation_data.filter((ann: any) => ann.bbox && (ann.bbox.width > 0 || ann.bbox.height > 0)).map((ann: any, i: number) => (
                  <React.Fragment key={i}>
                    <Rect
                      x={ann.bbox.x}
                      y={ann.bbox.y}
                      width={ann.bbox.width}
                      height={ann.bbox.height}
                      stroke={color}
                      strokeWidth={4 / scale} // Adjust stroke to look consistent
                      fill={color.includes("rgba") ? color : `${color}26`}
                    />
                    {ann.note && (
                      <Text
                        text={ann.note}
                        x={10 / scale} // Position relative to actual scale
                        y={(10 + (i * 20)) / scale}
                        fontSize={12 / scale}
                        fill={color}
                        fontStyle="bold"
                        shadowColor="white"
                        shadowBlur={2 / scale}
                        shadowOpacity={1}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Layer>
            </Stage>
          </div>
        )}
      </div>
    </div>
  );
}
