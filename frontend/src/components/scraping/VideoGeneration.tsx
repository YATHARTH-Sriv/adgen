function VideoLoadingState() {
  return (
    <div className="p-16 text-center">
      {/* Main Loading Spinner */}
      <div className="inline-flex items-center justify-center w-20 h-20 mb-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
      
      {/* Status Text */}
      <h3 className="text-2xl font-semibold text-white mb-3">Generating Video</h3>
      <p className="text-gray-400 text-lg mb-8">
        Creating your professional marketing video...
      </p>
      
      {/* Progress Dots */}
      <div className="flex justify-center space-x-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}

interface VideoStatusResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

interface VideoGenerationProps {
  videoJobId: string;
  videoStatus: VideoStatusResponse | null;
  error: string;
  onGenerateVideo: () => void;
}

export function VideoGeneration({ videoJobId, videoStatus, error, onGenerateVideo }: VideoGenerationProps) {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'processing': return 'text-purple-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': 
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
      case 'failed': 
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
      case 'processing': 
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>;
      default: 
        return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-900/30 to-purple-900/30 border border-pink-700/50 rounded-full text-sm text-pink-300 mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Video Generation
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Create Your Video
          </h2>
        </div>
        
        {/* Ready to Generate State */}
        {!videoJobId && !videoStatus && (
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 text-center">
            <div className="space-y-8">
              {/* Checkmarks */}
              <div className="space-y-4">
                <div className="flex items-center justify-center text-green-400">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">Product data extracted successfully</span>
                </div>
                <div className="flex items-center justify-center text-green-400">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">AI content generated</span>
                </div>
                <div className="flex items-center justify-center text-green-400">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-lg">Images downloaded and processed</span>
                </div>
              </div>
              
              {/* Ready Message */}
              <div className="py-6">
                <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30 mb-4">
                  <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-purple-300 font-medium text-lg">Ready to generate professional marketing video!</span>
                </div>
              </div>
              
              {/* Generate Button */}
              <button 
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={onGenerateVideo}
                type="button"
              >
                <span className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Marketing Video
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Video Generation Loading */}
        {videoStatus?.status === 'processing' && (
          <VideoLoadingState />
        )}

        {/* Video Status Display */}
        {videoStatus && videoStatus.status !== 'processing' && (
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-700 space-y-6">
            <div className="flex items-center justify-center space-x-3">
              <div className={getStatusColor(videoStatus.status)}>
                {getStatusIcon(videoStatus.status)}
              </div>
              <span className={`font-semibold text-xl ${getStatusColor(videoStatus.status)}`}>
                Status: {videoStatus.status.toUpperCase()}
              </span>
            </div>

            {videoStatus.status === 'failed' && videoStatus.error && (
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-red-400 font-semibold">Error</h4>
                    <p className="text-red-300 mt-1">{videoStatus.error}</p>
                  </div>
                </div>
              </div>
            )}

            {videoStatus.status === 'completed' && videoStatus.videoUrl && (
              <div className="space-y-6">
                <div className="bg-green-900/20 border border-green-800 rounded-xl p-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-green-400 font-semibold">Success!</h4>
                      <p className="text-green-300 mt-1">Your marketing video has been generated successfully!</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Your Generated Video```tsx:frontend/src/components/scraping/VideoGeneration.tsx
                  </h4>
                  <video
                    controls
                    className="w-full max-w-4xl rounded-xl shadow-2xl border border-gray-600"
                    src={videoStatus.videoUrl}
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={videoStatus.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Full Screen
                  </a>
                  <a
                    href={videoStatus.videoUrl}
                    download={`product-ad-${videoJobId}.mp4`}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4 4V3" />
                    </svg>
                    Download Video
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && error.includes('Video generation failed') && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-red-400 font-semibold">Video Generation Failed</h4>
                <p className="text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}