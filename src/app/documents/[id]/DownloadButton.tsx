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
      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors justify-center whitespace-nowrap"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 flex-shrink-0"
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
      Download
    </button>
  );
}
