import React from "react";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  uploading: boolean;
  uploadProgress: { [key: string]: number };
}

const FileList: React.FC<FileListProps> = ({
  files,
  onRemove,
  uploading,
  uploadProgress,
}) => {
  return (
    <div className="max-h-60 overflow-y-auto mb-4">
      <ul className="space-y-2">
        {files.map((file, index) => (
          <li
            key={index}
            className={`flex items-center justify-between bg-white p-3 rounded-lg border ${
              uploadProgress[file.name] === 100
                ? "border-green-200 bg-green-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-md mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                  {uploading && uploadProgress[file.name] && (
                    <span className="ml-2">
                      • {uploadProgress[file.name]}%{" "}
                      {uploadProgress[file.name] === 100
                        ? "Complete"
                        : "Uploading"}
                    </span>
                  )}
                </p>
              </div>
            </div>
            {uploading ? (
              uploadProgress[file.name] === 100 ? (
                <div className="w-6 h-6 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-500"
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
                </div>
              )
            ) : (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove file"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
