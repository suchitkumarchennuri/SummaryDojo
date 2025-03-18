import { Suspense } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export const metadata = {
  title: "Search Documents - SummaryDojo",
  description:
    "Search across your documents using powerful AI-based semantic search",
};

// Add a fallback component for authentication errors
function AuthenticationFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-medium text-gray-900">
          Loading your search page...
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we authenticate your session.
        </p>
      </div>
    </div>
  );
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AuthenticationFallback />}>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </Suspense>
  );
}
