import Loading from "@/components/Loading";

export default function DashboardLoading() {
  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Documents</h1>
        <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="h-7 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
