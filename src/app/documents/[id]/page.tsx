import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/utils/db";
import Document from "@/lib/models/Document";
import DeleteButton from "./DeleteButton";
import DownloadButton from "./DownloadButton";
import SearchWithinDocument from "./SearchWithinDocument";

async function getDocument(id: string, userId: string) {
  await connectDB();
  const document = await Document.findOne({ _id: id, userId });
  if (!document) return null;
  return JSON.parse(JSON.stringify(document));
}

interface DocumentDetailProps {
  params: {
    id: string;
  };
}

export default async function DocumentDetail({ params }: DocumentDetailProps) {
  const { id } = params;
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    redirect("/sign-in");
  }

  // Using destructured id to avoid the params.id warning
  const document = await getDocument(id, userId);

  if (!document) {
    return (
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1 flex-shrink-0"
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
              <span className="truncate">Back to Dashboard</span>
            </Link>
          </div>

          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Document not found</h2>
            <p className="text-gray-600 mb-6">
              The document you're looking for doesn't exist or you don't have
              access to it.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="truncate">Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 flex-shrink-0"
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
            <span className="truncate">Back to Dashboard</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div className="flex items-center max-w-full md:max-w-[75%] overflow-hidden">
            <div className="bg-blue-100 rounded-lg p-2 mr-3 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
              {document.title}
            </h1>
          </div>
          <div className="flex gap-3 self-end md:self-auto flex-shrink-0">
            <DownloadButton documentId={document._id} />
            <DeleteButton documentId={document._id} />
          </div>
        </div>

        <p className="text-sm sm:text-base text-gray-500 mb-2 line-clamp-1">
          Uploaded on{" "}
          {new Date(document.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {document.fileType.toUpperCase()}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 truncate max-w-[120px]">
            {(document.fileSize / 1024 / 1024).toFixed(2)} MB
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 truncate max-w-[120px]">
            AI Processed
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Summary Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                Summary
              </h2>
            </div>
            <div className="p-6 bg-white">
              {document.summary ? (
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line line-clamp-none sm:line-clamp-none">
                  {document.summary}
                </p>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm sm:text-base text-gray-500">
                    No summary available for this document.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Document Content Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
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
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                Document Content
              </h2>
            </div>
            <div className="p-6 bg-white">
              {document.extractedText ? (
                <div className="max-h-[32rem] overflow-y-auto pr-2 custom-scrollbar">
                  <pre className="whitespace-pre-wrap font-sans text-sm sm:text-base text-gray-700">
                    {document.extractedText}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm sm:text-base text-gray-500">
                    No content available for this document.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Key Insights Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                Key Insights
              </h2>
            </div>
            <div className="p-6 bg-white">
              {document.insights && document.insights.length > 0 ? (
                <ul className="space-y-3">
                  {document.insights.map((insight: string, index: number) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm mr-3 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 line-clamp-3 sm:line-clamp-none">
                        {insight}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm sm:text-base text-gray-500">
                    No insights available for this document.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Document Info Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
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
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                Document Info
              </h2>
            </div>
            <div className="p-6 bg-white">
              <div className="divide-y divide-gray-100">
                <div className="py-3 flex justify-between">
                  <span className="text-sm sm:text-base text-gray-500">
                    File Name
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 font-medium truncate max-w-[180px]">
                    {document.fileName}
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-sm sm:text-base text-gray-500">
                    File Type
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 font-medium">
                    {document.fileType.toUpperCase()}
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-sm sm:text-base text-gray-500">
                    File Size
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 font-medium">
                    {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-sm sm:text-base text-gray-500">
                    Uploaded On
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 font-medium truncate max-w-[180px]">
                    {new Date(document.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="py-3 flex justify-between">
                  <span className="text-sm sm:text-base text-gray-500">
                    Last Modified
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 font-medium truncate max-w-[180px]">
                    {new Date(document.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <SearchWithinDocument documentId={document._id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
