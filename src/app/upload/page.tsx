"use client";

import { useState, FormEvent, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import UploadProgressBar from "@/components/UploadProgressBar";
import FileList from "@/components/FileList";

export default function Upload() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [error, setError] = useState("");
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Filter files by type and size
    const validFiles = acceptedFiles.filter((file) => {
      // Check file type
      const isValidType =
        file.type.includes("pdf") ||
        file.type.includes("word") ||
        file.type.includes("docx") ||
        file.type.includes("doc");

      // Check file size
      const isValidSize = file.size <= MAX_FILE_SIZE;

      if (!isValidType) {
        setError(
          `File "${file.name}" is not supported. Only PDF and Word documents are allowed.`
        );
        return false;
      }

      if (!isValidSize) {
        setError(`File "${file.name}" exceeds the 10MB size limit.`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 10,
  });

  const removeFile = (index: number) => {
    setFiles((files) => files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);
    setCurrentFileIndex(0);
    setError("");
    setUploadSuccess(false);

    try {
      // Process files sequentially
      for (let i = 0; i < files.length; i++) {
        setCurrentFileIndex(i);
        const file = files[i];

        // Initialize progress for this file
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 0,
        }));

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const currentProgress = prev[file.name] || 0;
            if (currentProgress >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return {
              ...prev,
              [file.name]: currentProgress + Math.floor(Math.random() * 10),
            };
          });
        }, 300);

        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", title || file.name);

          console.log(
            `Uploading file ${i + 1}/${files.length}:`,
            file.name,
            "Size:",
            file.size
          );

          const response = await fetch("/api/documents", {
            method: "POST",
            body: formData,
          });

          clearInterval(progressInterval);
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

          console.log("Response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.log("Error response text:", errorText);

            let errorMessage = `Failed to upload document: ${file.name}`;

            try {
              // Try to parse as JSON
              const errorData = JSON.parse(errorText);
              console.log("Parsed error data:", errorData);
              errorMessage = errorData.error || errorMessage;
            } catch (e) {
              console.log("Error parsing response as JSON:", e);
              // If not JSON, it might be HTML from a redirect
              if (response.status === 401) {
                errorMessage =
                  "You are not authenticated. Please sign in again.";
                router.push("/sign-in");
                return;
              }
            }

            throw new Error(errorMessage);
          }

          const result = await response.json();
          console.log(`Upload ${i + 1}/${files.length} successful:`, result);
        } catch (error) {
          console.error(
            `Error uploading document ${i + 1}/${files.length}:`,
            error
          );
          setError(
            error instanceof Error
              ? error.message
              : `Failed to upload document: ${file.name}`
          );
          break; // Stop the upload process on error
        }
      }

      // All files uploaded successfully
      if (!error) {
        setUploadSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during upload process:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload documents"
      );
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (isUploading && currentFileIndex < files.length) {
      setCurrentFile(files[currentFileIndex]?.name || "");
      setProgress(uploadProgress[files[currentFileIndex]?.name] || 0);
    }
  }, [isUploading, currentFileIndex, files, uploadProgress]);

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 truncate">
          Upload Documents
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6 line-clamp-2">
          Upload multiple PDF or Word documents to analyze with AI (max 10MB per
          file)
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <label
              htmlFor="title"
              className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
            >
              Default Document Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a default title for your documents"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 focus:outline-none transition duration-200 text-sm sm:text-base"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              If left blank, filenames will be used as titles
            </p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Document Files
            </label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? "border-blue-400 bg-blue-50"
                  : files.length > 0
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />

              {files.length > 0 ? (
                <div className="py-4">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-green-500 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-base sm:text-lg font-medium mb-4 text-gray-800">
                    {files.length} {files.length === 1 ? "file" : "files"}{" "}
                    selected
                  </p>

                  <FileList
                    files={files}
                    onRemove={(index) => {
                      removeFile(index);
                    }}
                    uploading={isUploading}
                    uploadProgress={uploadProgress}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Add More Files
                  </button>
                </div>
              ) : isDragActive ? (
                <div className="py-8">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-base sm:text-lg font-medium mb-2 text-blue-600 line-clamp-1">
                    Drop your files here
                  </p>
                </div>
              ) : (
                <div className="py-8">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-base sm:text-lg font-medium mb-2 line-clamp-1">
                    Drag and drop your documents here
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-1">
                    or click to browse files
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    Supported formats: PDF, Word (.doc, .docx) • Max size: 10MB
                    per file
                  </p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm line-clamp-3">{error}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                Upload completed successfully! Redirecting to dashboard...
              </span>
            </div>
          )}

          {isUploading &&
            files.length > 0 &&
            currentFileIndex < files.length && (
              <UploadProgressBar
                fileName={currentFile}
                progress={progress}
                index={currentFileIndex + 1}
                total={files.length}
              />
            )}

          <div>
            <button
              type="submit"
              disabled={isUploading || files.length === 0}
              className={`w-full py-2 sm:py-3 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center text-sm sm:text-base ${
                isUploading || files.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload {files.length}{" "}
                  {files.length === 1 ? "Document" : "Documents"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center truncate">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="truncate">What happens after upload?</span>
        </h2>
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 flex h-6 items-center">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm">
                1
              </div>
            </div>
            <div className="ml-4">
              <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                Your documents are securely stored in our system
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex h-6 items-center">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm">
                2
              </div>
            </div>
            <div className="ml-4">
              <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                Our AI extracts all text content from the PDF or Word documents
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex h-6 items-center">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm">
                3
              </div>
            </div>
            <div className="ml-4">
              <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                The AI generates a concise summary of each document
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex h-6 items-center">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm">
                4
              </div>
            </div>
            <div className="ml-4">
              <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                Key insights are identified and extracted
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex h-6 items-center">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm">
                5
              </div>
            </div>
            <div className="ml-4">
              <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                The documents are indexed for semantic search
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
