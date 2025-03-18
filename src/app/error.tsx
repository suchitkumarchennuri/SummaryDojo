"use client";

import { useEffect } from "react";
import Link from "next/link";
import ErrorMessage from "@/components/ErrorMessage";

export default function GlobalError({
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600">
            We're sorry, but we encountered an unexpected error.
          </p>
        </div>

        <ErrorMessage
          message={
            error.message || "An unexpected error occurred. Please try again."
          }
          retry={reset}
        />

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
