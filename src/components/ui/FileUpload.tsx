import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from '@radix-ui/react-icons';

const FileUpload = () => {
    const [fileInfo, setFileInfo] = useState<{ name: string; uploadDate: string } | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const uploadDate = new Date().toLocaleString();
            setFileInfo({ name: file.name, uploadDate });
            console.log(`File uploaded: ${file.name} on ${uploadDate}`);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept: {
            'application/zip': ['.zip'],
        },
        maxFiles: 1,
    });

    const getMessage = () => {
        if (fileRejections.length > 0) {
            return <span className="text-red-500">Please upload only ZIP files.</span>;
        }
        if (fileInfo) {
            return <span className="">File uploaded: {fileInfo.name} on {fileInfo.uploadDate}</span>;
        }
        if (isDragActive) {
            return "Drop the ZIP file here";
        }
        return "Drag & drop a ZIP file here, or click to select";
    };

    return (
        <div className="w-full flex flex-col align-start justify-start">
            <div
                {...getRootProps()}
                className={`p-4 mt-4 border-2 border-dashed flex items-center justify-start gap-3 rounded-lg cursor-pointer transition-colors duration-200 ease-in-out w-full ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
            >
                <input {...getInputProps()} />
                <UploadIcon className="h-5 w-5 mt-2 text-gray-400" />
                <p className="mt-2 text-sm">
                    {getMessage()}
                </p>
            </div>
        </div>
    );
};

export default FileUpload;