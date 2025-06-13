export function LoadingState() {
  return (
    <div className="p-16 text-center">
      {/* Main Loading Spinner */}
      <div className="inline-flex items-center justify-center w-20 h-20 mb-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
      
      {/* Status Text */}
      <h3 className="text-2xl font-semibold text-white mb-3">Analyzing Product</h3>
      <p className="text-gray-400 text-lg mb-8">
        Scraping product data and generating AI content...
      </p>
      
      {/* Progress Dots */}
      <div className="flex justify-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}