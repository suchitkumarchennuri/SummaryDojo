"use client";

import { useState } from "react";

interface DocumentDownloadButtonProps {
  documentId: string;
  fileName: string;
}

export default function DocumentDownloadButton({
  documentId,
  fileName,
}: DocumentDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Get the signed URL from our API
      const response = await fetch(`/api/documents/download?id=${documentId}`);

      if (!response.ok) {
        let errorMessage = "Failed to download document";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If not JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const downloadUrl = data.url;

      // Open the URL in a new tab to force download
      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error("Error downloading document:", error);
      setError(error instanceof Error ? error.message : "Download failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium"
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 mr-1 text-gray-500"
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
          Downloading...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Download</span>
        </>
      )}

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </button>
  );
}
