export default function DocumentsLoading() {
  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded w-40 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Info box skeleton */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 flex items-center">
          <div className="h-5 w-5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          {/* Table Header Skeleton */}
          <div className="bg-gray-50 p-3">
            <div className="flex">
              <div className="w-2/5 px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="w-1/5 px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="w-1/5 px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
              <div className="w-1/5 px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Table Rows Skeleton */}
          <div className="bg-white">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex border-t border-gray-200 py-4">
                <div className="w-2/5 px-6 py-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="ml-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="w-1/5 px-6 py-2">
                  <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                </div>
                <div className="w-1/5 px-6 py-2">
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
                <div className="w-1/5 px-6 py-2 flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-12 mr-6 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
