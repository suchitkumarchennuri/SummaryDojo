"use client";

interface DownloadButtonProps {
  documentId: string;
}

export default function DownloadButton({ documentId }: DownloadButtonProps) {
  const handleDownload = () => {
    // Use direct=true to get a redirect to the signed URL
    window.open(
      `/api/documents/download?id=${documentId}&direct=true`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleDownload}
      className="text-secondary hover:text-gradient-mid text-sm font-medium inline-flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1 flex-shrink-0"
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
      <span className="truncate">Download</span>
    </button>
  );
}
