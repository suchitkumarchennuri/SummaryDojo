import React from "react";

interface UploadProgressBarProps {
  fileName: string;
  progress: number;
  index: number;
  total: number;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({
  fileName,
  progress,
  index,
  total,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 flex items-center">
          <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">
            {index}
          </span>
          <span>
            File {index} of {total}
          </span>
        </span>
        <span className="text-sm font-medium text-blue-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          className={`${
            progress === 100 ? "bg-green-500" : "bg-blue-600"
          } h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-600 truncate max-w-[70%]">{fileName}</p>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          {progress < 100 ? "Uploading..." : "Processing..."}
        </span>
      </div>
    </div>
  );
};

export default UploadProgressBar;
