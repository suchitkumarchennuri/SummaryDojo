import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/utils/db";
import Document from "@/lib/models/Document";
import SearchBar from "./SearchBar";
import DocumentDeleteButton from "./DocumentDeleteButton";
import DownloadButton from "./DownloadButton";

// Interface for serialized document data
interface SerializedDocument {
  _id: string;
  userId: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Key: string;
  s3Url: string;
  extractedText: string;
  summary: string;
  insights: string[];
  embedding: number[];
  createdAt: string;
  updatedAt: string;
}

async function getDocuments(userId: string) {
  await connectDB();
  const documents = await Document.find({ userId }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(documents)) as SerializedDocument[];
}

export default async function Dashboard() {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    redirect("/sign-in");
  }

  const documents = await getDocuments(userId);

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header Section */}
      <div className="theme-card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">
              Welcome to your Dashboard
            </h1>
            <p className="text-muted mt-1">Manage and search your documents</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/upload"
              className="btn-primary inline-flex items-center justify-center"
            >
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
              Upload Document
            </Link>
            <Link
              href="/search"
              className="btn-secondary inline-flex items-center justify-center"
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search Documents
            </Link>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold gradient-text">Recent Documents</h2>
          {documents.length > 0 && (
            <Link
              href="/documents"
              className="text-gradient-mid hover:text-gradient-start text-sm font-medium"
            >
              View All Documents
            </Link>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="theme-card text-center py-16">
            <div className="max-w-md mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-muted mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold mb-2 text-heading">
                No documents yet
              </h3>
              <p className="text-muted mb-6">
                Upload your first document to get started with analysis and
                search
              </p>
              <Link
                href="/upload"
                className="btn-primary inline-flex items-center"
              >
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
                Upload Document
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc: SerializedDocument) => (
              <div
                key={doc._id}
                className="theme-card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start mb-3">
                    <div className="bg-blue-100 rounded-lg p-2 mr-3">
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
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-heading mb-1 truncate">
                        {doc.title}
                      </h3>
                      <p className="text-secondary text-sm">
                        Added on{" "}
                        {new Date(doc.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="h-24 overflow-hidden text-sm text-body mb-4 line-clamp-4">
                    {doc.summary
                      ? doc.summary
                      : "No summary available for this document."}
                  </div>

                  <div className="pt-4 border-t border-dark-border flex justify-between items-center">
                    <div className="flex gap-2 mt-auto flex-wrap">
                      <Link
                        href={`/documents/${doc._id}`}
                        className="inline-flex items-center text-sm text-gradient-mid hover:text-gradient-start"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="truncate">View Details</span>
                      </Link>
                      <DownloadButton documentId={doc._id} />
                      <DocumentDeleteButton documentId={doc._id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="theme-card p-6">
        <h2 className="text-xl font-bold gradient-text mb-4">
          Search Your Documents
        </h2>
        <p className="text-secondary mb-4">
          Find information across all your documents with semantic search
        </p>
        <SearchBar />
      </div>
    </main>
  );
}
