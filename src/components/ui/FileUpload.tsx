import * as React from 'react';
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileText,
  CheckCircle2
} from 'lucide-react';

import Button from './Button';
import { Card } from './Card';
import { cn } from './Utils';

type FileUploadVariant = 'default' | 'compact';

type FileUploadProps = {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  value?: File[];
  onChange?: (files: File[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  variant?: FileUploadVariant;
};

export default function FileUpload({
  accept = 'image/*',
  maxSize = 2 * 1024 * 1024,
  maxFiles = 1,
  multiple = false,
  value = [],
  onChange,
  onError,
  disabled = false,
  className,
  variant = 'default'
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<File[]>(value);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];

    for (const file of fileArray) {
      if (file.size > maxSize) {
        onError?.(
          `File "${file.name}" exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(1)}MB`
        );
        continue;
      }

      if (accept && accept !== '*') {
        const acceptTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        const fileExtension = `.${file.name.split('.').pop()}`;

        const isValidType = acceptTypes.some(type => {
          if (type.endsWith('/*')) {
            return fileType.startsWith(type.replace('/*', ''));
          }
          return type === fileType || type === fileExtension;
        });

        if (!isValidType) {
          onError?.(
            `File "${file.name}" has invalid type. Accepted: ${accept}`
          );
          continue;
        }
      }

      validFiles.push(file);
    }

    const totalFiles = multiple ? [...files, ...validFiles] : validFiles;
    if (totalFiles.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);
      return;
    }

    const newFileList = multiple ? totalFiles : validFiles;
    setFiles(newFileList);
    onChange?.(newFileList);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5" />;
    }
    if (file.type.startsWith('text/')) {
      return <FileText className="h-5 w-5" />;
    }
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (variant === 'compact') {
    return (
      <div data-slot="file-upload" className={cn('space-y-2', className)}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={e => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled}
          className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          {files.length > 0
            ? `${files.length} file(s) selected`
            : 'Choose File'}
        </Button>

        {files.length > 0 && (
          <div className="space-y-1">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm bg-muted/50 rounded-md px-3 py-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getFileIcon(file)}
                  <span className="truncate">{file.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div data-slot="file-upload" className={cn('space-y-4', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={e => handleFiles(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      <Card
        className={cn(
          'relative border-2 border-dashed transition-colors cursor-pointer',
          isDragging && 'border-primary bg-primary/5',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'hover:border-primary/50 hover:bg-muted/30'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}>
        <div className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>

          <p className="text-sm font-medium mb-1">
            {isDragging
              ? 'Drop files here'
              : 'Click to upload or drag and drop'}
          </p>

          <p className="text-xs text-muted-foreground">
            {accept === 'image/*' ? 'Images only' : accept}
            {' • '}
            Max {(maxSize / 1024 / 1024).toFixed(0)}MB
            {multiple && ` • Up to ${maxFiles} files`}
          </p>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <Card
              key={index}
              className="p-4 border-l-4 border-l-accent bg-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  disabled={disabled}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export type { FileUploadProps, FileUploadVariant };
