"use client";

import { useEffect } from "react";
import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Dashboard
        </Link>
      </div>

      <ErrorMessage
        title="Something went wrong!"
        message={
          error.message || "Failed to load your documents. Please try again."
        }
        retry={reset}
      />
    </main>
  );
}
