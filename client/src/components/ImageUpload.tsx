import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, X, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onImageUpload: (urls: string[]) => void;
  existingImages?: string[];
}

export default function ImageUpload({ onImageUpload, existingImages = [] }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload images");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      onImageUpload(data.urls);
      setPreviews([...existingImages, ...data.urls]);
      setFiles([]);
      setUploadError(null);
      toast({
        title: "Images uploaded successfully",
        description: `${data.urls.length} images have been uploaded.`,
      });
    },
    onError: (error) => {
      setUploadError((error as Error).message);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your images. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate file size (5MB limit)
    const validFiles = acceptedFiles.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length < acceptedFiles.length) {
      toast({
        title: "File too large",
        description: "Some files exceed the 5MB size limit and were not added.",
        variant: "destructive",
      });
    }
    
    // Limit to 3 files total
    const newFiles = [...files, ...validFiles].slice(0, 3 - existingImages.length);
    
    setFiles(newFiles);
    
    // Create object URLs for previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    // Clean up old object URLs
    files.forEach(file => {
      if (!newFiles.includes(file)) {
        URL.revokeObjectURL(URL.createObjectURL(file));
      }
    });
    
    setPreviews([...existingImages, ...newPreviews]);
  }, [files, existingImages, toast]);

  const removeFile = (index: number) => {
    const isExistingImage = index < existingImages.length;
    
    if (isExistingImage) {
      // Remove from existing images
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setPreviews([...newExistingImages, ...previews.slice(existingImages.length)]);
      onImageUpload(newExistingImages);
    } else {
      // Remove from new files
      const adjustedIndex = index - existingImages.length;
      const newFiles = [...files];
      
      // Revoke object URL
      URL.revokeObjectURL(URL.createObjectURL(newFiles[adjustedIndex]));
      
      newFiles.splice(adjustedIndex, 1);
      setFiles(newFiles);
      
      // Update previews
      const newPreviews = [...existingImages];
      newFiles.forEach(file => {
        newPreviews.push(URL.createObjectURL(file));
      });
      
      setPreviews(newPreviews);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 3 - (existingImages.length + files.length),
    disabled: (existingImages.length + files.length) >= 3 || uploadMutation.isPending
  });

  const handleUpload = () => {
    if (files.length > 0) {
      uploadMutation.mutate(files);
    }
  };

  return (
    <div className="space-y-4">
      {uploadError && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{uploadError}</span>
        </div>
      )}
      
      {previews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative rounded-md overflow-hidden h-48 bg-gray-100">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {(existingImages.length + files.length) < 3 && (
        <div
          {...getRootProps()}
          className={`border-4 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${
            isDragActive ? "border-primary bg-blue-50" : "border-gray-300"
          } ${uploadMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            <Camera className="h-12 w-12 text-gray-400 mb-3" />
            {isDragActive ? (
              <p className="text-primary">Drop the files here</p>
            ) : (
              <>
                <p className="text-gray-500">
                  <span className="text-primary font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Upload up to {3 - (existingImages.length + files.length)} photos of the dog (Max 5MB each)
                </p>
              </>
            )}
          </div>
        </div>
      )}
      
      {files.length > 0 && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="flex items-center"
          >
            {uploadMutation.isPending ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload {files.length} {files.length === 1 ? "file" : "files"}
              </>
            )}
          </Button>
        </div>
      )}
      
      {(existingImages.length + files.length) >= 3 && (
        <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>Maximum number of images (3) reached</span>
        </div>
      )}
    </div>
  );
}
