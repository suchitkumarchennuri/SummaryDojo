"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ConfirmationModal";

interface DocumentDeleteButtonProps {
  documentId: string;
}

export default function DocumentDeleteButton({
  documentId,
}: DocumentDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh(); // Refresh the current page instead of redirecting
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to delete document" }));
        alert(errorData.error || "Failed to delete document");
        setIsDeleting(false);
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("An error occurred while deleting the document");
      setIsDeleting(false);
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <button
        style={{ color: "var(--danger)" }}
        className="text-sm font-medium inline-flex items-center hover:opacity-80"
        onClick={() => setShowConfirmation(true)}
        disabled={isDeleting}
        aria-label="Delete document"
      >
        {isDeleting ? (
          <svg
            className="animate-spin h-4 w-4 mr-1 flex-shrink-0"
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
        ) : (
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        )}
        <span className="truncate">Delete</span>
      </button>

      {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          title="Delete Document"
          message="Are you sure you want to delete this document? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isProcessing={isDeleting}
          processingText="Deleting..."
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmation(false)}
          confirmButtonClassName="btn-danger"
          cancelButtonClassName="btn-secondary"
        />
      )}
    </>
  );
}
