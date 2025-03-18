"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmationModal from "@/components/ConfirmationModal";

interface DeleteButtonProps {
  documentId: string;
}

export default function DeleteButton({ documentId }: DeleteButtonProps) {
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
        router.push("/dashboard");
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
        className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors justify-center whitespace-nowrap"
        onClick={() => setShowConfirmation(true)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white flex-shrink-0"
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
            Deleting...
          </>
        ) : (
          <>
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </>
        )}
      </button>

      <ConfirmationModal
        isOpen={showConfirmation}
        title="Delete Document"
        message="Do you want to delete this document?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isProcessing={isDeleting}
        processingText="Deleting..."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmation(false)}
      />
    </>
  );
}
