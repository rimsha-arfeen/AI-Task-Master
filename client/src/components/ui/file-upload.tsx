import React, { useState, useRef } from "react";

interface FileUploadProps extends React.ComponentPropsWithoutRef<"div"> {
  accept?: string;
  maxSize?: number;
  onFileChange?: (file: File | null) => void;
  children?: React.ReactNode;
}

export const FileUpload = ({
  accept = "*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  onFileChange,
  children,
  className,
  ...props
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Validate file type
    if (accept !== "*") {
      const acceptedTypes = accept.split(",");
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!acceptedTypes.some(type => type.trim() === fileExtension || type.trim() === file.type)) {
        alert(`File type not accepted. Please upload: ${accept}`);
        return;
      }
    }

    // Validate file size
    if (file.size > maxSize) {
      alert(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Pass the file to parent component
    onFileChange?.(file);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`${className} ${dragActive ? "border-primary bg-primary/5" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
      />
      {children || (
        <div className="flex flex-col items-center justify-center p-6">
          <button
            type="button"
            onClick={handleButtonClick}
            className="text-primary hover:underline"
          >
            Choose file
          </button>
          <p className="mt-2 text-sm text-muted-foreground">
            or drag and drop
          </p>
        </div>
      )}
    </div>
  );
};
