export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-white"></div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500 font-medium">Loading...</p>
    </div>
  );
}
