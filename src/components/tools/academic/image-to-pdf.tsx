"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Upload, 
  X, 
  Download, 
  GripVertical, 
  RotateCw,
  FileImage,
  Settings2,
  Maximize2,
  Trash2,
  ArrowUpDown,
  Eye,
  Copy,
  ImagePlus,
  Loader2
} from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  x: number;
  y: number;
  fitToPage: boolean;
}

type PageSize = "A4" | "Letter" | "Legal" | "A3" | "A5";
type Orientation = "portrait" | "landscape";

const PAGE_SIZES = {
  A4: { width: 595, height: 842, label: "A4 (210 × 297 mm)" },
  Letter: { width: 612, height: 792, label: "Letter (8.5 × 11 in)" },
  Legal: { width: 612, height: 1008, label: "Legal (8.5 × 14 in)" },
  A3: { width: 842, height: 1191, label: "A3 (297 × 420 mm)" },
  A5: { width: 420, height: 595, label: "A5 (148 × 210 mm)" }
};

export default function ImageToPDF() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [pdfName, setPdfName] = useState("document.pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [margin, setMargin] = useState(20);
  const [quality, setQuality] = useState(0.92);
  const [oneImagePerPage, setOneImagePerPage] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      toast.error("No valid image files found");
      return;
    }

    if (acceptedFiles.length !== validFiles.length) {
      toast.warning(`${acceptedFiles.length - validFiles.length} non-image file(s) skipped`);
    }

    const newImages: ImageItem[] = [];
    let loadedCount = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const imageItem: ImageItem = {
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: e.target?.result as string,
            width: img.width,
            height: img.height,
            rotation: 0,
            scale: 1,
            x: 0,
            y: 0,
            fitToPage: true
          };
          newImages.push(imageItem);
          loadedCount++;
          
          if (loadedCount === validFiles.length) {
            setImages(prev => [...prev, ...newImages]);
            toast.success(`${newImages.length} image(s) added successfully`);
          }
        };
        img.onerror = () => {
          toast.error(`Failed to load ${file.name}`);
          loadedCount++;
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
        loadedCount++;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (selectedImageId === id) setSelectedImageId(null);
    toast.success("Image removed");
  };

  const clearAllImages = () => {
    if (images.length === 0) return;
    setImages([]);
    setSelectedImageId(null);
    toast.success("All images cleared");
  };

  const duplicateImage = (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image) return;
    
    const newImage: ImageItem = {
      ...image,
      id: `${Date.now()}-${Math.random()}`,
    };
    
    const index = images.findIndex(img => img.id === id);
    setImages(prev => [...prev.slice(0, index + 1), newImage, ...prev.slice(index + 1)]);
    toast.success("Image duplicated");
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const updateImageScale = (id: string, value: number) => {
    setImages(prev => prev.map(img => 
      img.id === id 
        ? { ...img, scale: value / 100 }
        : img
    ));
  };

  const rotateImage = (id: string, degrees: number = 90) => {
    setImages(prev => prev.map(img => 
      img.id === id 
        ? { ...img, rotation: (img.rotation + degrees) % 360 }
        : img
    ));
  };

  const resetImage = (id: string) => {
    setImages(prev => prev.map(img => 
      img.id === id 
        ? { ...img, rotation: 0, scale: 1, x: 0, y: 0, fitToPage: true }
        : img
    ));
    toast.success("Image reset to default");
  };

  const moveImage = (id: string, direction: 'up' | 'down') => {
    const index = images.findIndex(img => img.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;
    
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    
    setImages(newImages);
  };

  const generatePDF = async () => {
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setIsGenerating(true);
    const loadingToast = toast.loading("Generating PDF...");
    
    try {
      const { jsPDF } = await import('jspdf');
      
      const pageConfig = PAGE_SIZES[pageSize];
      const isLandscape = orientation === "landscape";
      const pageWidth = isLandscape ? pageConfig.height : pageConfig.width;
      const pageHeight = isLandscape ? pageConfig.width : pageConfig.height;
      
      const pdf = new jsPDF({
        orientation,
        unit: 'pt',
        format: pageSize.toLowerCase() as any
      });

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        if (i > 0 && oneImagePerPage) {
          pdf.addPage();
        }

        let imgWidth = image.width;
        let imgHeight = image.height;
        
        if (image.rotation === 90 || image.rotation === 270) {
          [imgWidth, imgHeight] = [imgHeight, imgWidth];
        }

        const availableWidth = pageWidth - (2 * margin);
        const availableHeight = pageHeight - (2 * margin);

        let finalWidth: number;
        let finalHeight: number;
        
        if (image.fitToPage) {
          const widthRatio = availableWidth / imgWidth;
          const heightRatio = availableHeight / imgHeight;
          const ratio = Math.min(widthRatio, heightRatio) * image.scale;
          
          finalWidth = imgWidth * ratio;
          finalHeight = imgHeight * ratio;
        } else {
          finalWidth = imgWidth * image.scale;
          finalHeight = imgHeight * image.scale;
        }

        const x = margin + (availableWidth - finalWidth) / 2 + image.x;
        const y = margin + (availableHeight - finalHeight) / 2 + image.y;

        if (image.rotation !== 0) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          if (image.rotation === 90 || image.rotation === 270) {
            canvas.width = image.height;
            canvas.height = image.width;
          } else {
            canvas.width = image.width;
            canvas.height = image.height;
          }
          
          const img = new Image();
          img.src = image.preview;
          
          await new Promise((resolve) => {
            img.onload = () => {
              ctx.save();
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate((image.rotation * Math.PI) / 180);
              ctx.drawImage(img, -img.width / 2, -img.height / 2);
              ctx.restore();
              resolve(null);
            };
          });
          
          const rotatedImage = canvas.toDataURL('image/jpeg', quality);
          pdf.addImage(rotatedImage, 'JPEG', x, y, finalWidth, finalHeight);
        } else {
          pdf.addImage(image.preview, 'JPEG', x, y, finalWidth, finalHeight, undefined, 'FAST');
        }
        
        const progress = Math.round(((i + 1) / images.length) * 100);
        toast.loading(`Generating PDF... ${progress}%`, { id: loadingToast });
      }

      const fileName = pdfName.endsWith('.pdf') ? pdfName : `${pdfName}.pdf`;
      pdf.save(fileName);
      
      toast.success(`PDF generated successfully! (${images.length} ${images.length === 1 ? 'page' : 'pages'})`, { id: loadingToast });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF. Please try again.", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedImage = selectedImageId ? images.find(img => img.id === selectedImageId) : null;

  return (
    <div className="space-y-6">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{images.length}</p>
              <p className="text-xs text-muted-foreground">Total Images</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{oneImagePerPage ? images.length : 1}</p>
              <p className="text-xs text-muted-foreground">PDF Pages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{pageSize}</p>
              <p className="text-xs text-muted-foreground">Page Size</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary capitalize">{orientation}</p>
              <p className="text-xs text-muted-foreground">Orientation</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
                  ${isDragActive 
                    ? 'border-primary bg-primary/5 scale-[1.02]' 
                    : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/5'}`}
              >
                <input {...getInputProps()} ref={fileInputRef} />
                <Upload className={`mx-auto h-12 w-12 mb-4 transition-colors ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'Drop images here' : 'Drag & drop images'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse (PNG, JPG, GIF, WebP, BMP)
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {images.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Images ({images.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllImages}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                    <Button 
                      onClick={generatePDF} 
                      disabled={isGenerating}
                      size="sm"
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Generate PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedImageId(image.id)}
                    className={`flex items-center gap-3 p-3 border rounded-lg transition-all cursor-pointer
                      ${draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100'}
                      ${selectedImageId === image.id 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border hover:border-primary/50 hover:bg-accent/5'}`}
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0 cursor-grab active:cursor-grabbing" />
                    
                    <div className="relative w-16 h-16 flex-shrink-0 bg-muted rounded overflow-hidden border">
                      <img
                        src={image.preview}
                        alt={image.file.name}
                        className="w-full h-full object-contain"
                        style={{
                          transform: `rotate(${image.rotation}deg) scale(${image.scale})`
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{image.file.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {image.width} × {image.height}px
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(image.file.size / 1024).toFixed(1)} KB
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(image.scale * 100).toFixed(0)}%
                        </p>
                        {image.rotation !== 0 && (
                          <p className="text-xs text-primary font-medium">
                            {image.rotation}°
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveImage(image.id, 'up');
                        }}
                        disabled={index === 0}
                        title="Move Up"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateImage(image.id);
                        }}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(image.id);
                        }}
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {images.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileImage className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No images added yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload images using the area above to get started
                </p>
                <Button 
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Add Images
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                PDF Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-name">File Name</Label>
                <Input
                  id="pdf-name"
                  value={pdfName}
                  onChange={(e) => setPdfName(e.target.value)}
                  placeholder="document.pdf"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="page-size">Page Size</Label>
                <Select value={pageSize} onValueChange={(value: PageSize) => setPageSize(value)}>
                  <SelectTrigger id="page-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PAGE_SIZES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orientation">Orientation</Label>
                <Select value={orientation} onValueChange={(value: Orientation) => setOrientation(value)}>
                  <SelectTrigger id="orientation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="one-per-page" className="text-sm">One image per page</Label>
                  <Switch
                    id="one-per-page"
                    checked={oneImagePerPage}
                    onCheckedChange={setOneImagePerPage}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="margin" className="text-sm">Margin</Label>
                    <span className="text-xs text-muted-foreground">{margin}pt</span>
                  </div>
                  <Slider
                    id="margin"
                    min={0}
                    max={100}
                    step={5}
                    value={[margin]}
                    onValueChange={([value]) => setMargin(value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quality" className="text-sm">Image Quality</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(quality * 100)}%</span>
                  </div>
                  <Slider
                    id="quality"
                    min={0.5}
                    max={1}
                    step={0.01}
                    value={[quality]}
                    onValueChange={([value]) => setQuality(value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedImage && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Edit Selected Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-square w-full bg-muted rounded-lg overflow-hidden border-2 border-dashed">
                  <img
                    src={selectedImage.preview}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    style={{
                      transform: `rotate(${selectedImage.rotation}deg) scale(${selectedImage.scale})`
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="scale" className="text-sm">Scale</Label>
                      <span className="text-xs text-muted-foreground">{Math.round(selectedImage.scale * 100)}%</span>
                    </div>
                    <Slider
                      id="scale"
                      min={10}
                      max={300}
                      step={1}
                      value={[selectedImage.scale * 100]}
                      onValueChange={([value]) => updateImageScale(selectedImage.id, value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rotateImage(selectedImage.id, -90)}
                      className="w-full"
                    >
                      <RotateCw className="h-4 w-4 mr-2 scale-x-[-1]" />
                      Rotate Left
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rotateImage(selectedImage.id, 90)}
                      className="w-full"
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Rotate Right
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Label className="text-sm">Fit to Page</Label>
                    <Switch
                      checked={selectedImage.fitToPage}
                      onCheckedChange={(checked) => {
                        setImages(prev => prev.map(img => 
                          img.id === selectedImage.id ? { ...img, fitToPage: checked } : img
                        ));
                      }}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetImage(selectedImage.id)}
                      className="w-full"
                    >
                      <Maximize2 className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateImage(selectedImage.id)}
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(selectedImage.id)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Image
                  </Button>
                </div>

                <div className="pt-2 text-xs text-muted-foreground space-y-1">
                  <p><strong>Original:</strong> {selectedImage.width} × {selectedImage.height}px</p>
                  <p><strong>Size:</strong> {(selectedImage.file.size / 1024).toFixed(2)} KB</p>
                  <p><strong>Rotation:</strong> {selectedImage.rotation}°</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>• Click on an image to select and edit it</p>
              <p>• Drag images by the grip handle to reorder</p>
              <p>• Use quality slider to reduce PDF file size</p>
              <p>• Increase margins for better page aesthetics</p>
              <p>• Rotate images in 90° increments</p>
              <p>• Duplicate images for multiple pages</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
