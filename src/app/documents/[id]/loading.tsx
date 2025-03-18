import Loading from "@/components/Loading";

export default function DocumentDetailLoading() {
  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header Section Skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-lg p-2 mr-3 h-10 w-10 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="flex gap-3 self-end md:self-auto">
            <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="h-5 bg-gray-200 rounded w-40 animate-pulse mb-4"></div>

        <div className="flex flex-wrap gap-2 mt-4">
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Summary Section Skeleton */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
            <div className="p-6 bg-white">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Document Content Section Skeleton */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
            <div className="p-6 bg-white">
              <div className="space-y-2">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded w-full animate-pulse"
                    style={{
                      width: `${Math.floor(Math.random() * 30) + 70}%`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Key Insights Section Skeleton */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-36 animate-pulse"></div>
            </div>
            <div className="p-6 bg-white">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex">
                    <div className="h-6 w-6 bg-gray-200 rounded-full mr-3 flex-shrink-0 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Document Info Section Skeleton */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
            <div className="p-6 bg-white">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between py-3">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                ))}

                <div className="mt-6">
                  <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
