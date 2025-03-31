'use client'

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Analyzing your spending...</p>
      </div>
    </div>
  );
}