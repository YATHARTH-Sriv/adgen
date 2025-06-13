interface AIContent {
  script: string;
  headline: string;
  keyPoints: string[] | string;
  textOverlays: string[] | string;
  tone: string;
}

interface AIGeneratedContentProps {
  aiContent: AIContent;
}

export function AIGeneratedContent({ aiContent }: AIGeneratedContentProps) {
  const renderKeyPoints = (keyPoints: string[] | string) => {
    if (Array.isArray(keyPoints)) {
      return keyPoints.map((point: string, index: number) => (
        <li key={index} className="flex items-start text-gray-300 leading-relaxed">
          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
          {point}
        </li>
      ));
    }
    return (
      <li className="flex items-start text-gray-300 leading-relaxed">
        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
        {keyPoints}
      </li>
    );
  };

  const renderTextOverlays = (textOverlays: string[] | string) => {
    if (Array.isArray(textOverlays)) {
      return textOverlays.map((overlay: string, index: number) => (
        <span 
          key={index} 
          className="inline-block bg-gray-800 border border-gray-700 px-4 py-2 rounded-full text-sm text-gray-300 mr-3 mb-3 hover:bg-gray-700 transition-colors duration-200"
        >
          {overlay}
        </span>
      ));
    }
    return <span className="text-gray-300">{textOverlays}</span>;
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-purple-900/30 border border-purple-700/50 rounded-full text-sm text-purple-300 mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Generated Content
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your Marketing Script
            <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl md:text-3xl mt-2">
              Ready for Video Creation
            </span>
          </h2>
        </div>
        
        {/* Main Script Display */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">Video Script</h3>
            </div>
            
            <div className="bg-black/40 rounded-xl p-6 border border-gray-600/30">
              <pre className="whitespace-pre-wrap text-gray-200 text-base leading-relaxed font-mono">
                {typeof aiContent.script === 'string' 
                  ? aiContent.script 
                  : JSON.stringify(aiContent.script, null, 2)}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Headline Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-700/30">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-400">Main Headline</h3>
            </div>
            <p className="text-white text-xl font-medium leading-relaxed">
              {aiContent.headline}
            </p>
          </div>
        </div>
        
        {/* Additional Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Key Points */}
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-400">Key Selling Points</h3>
            </div>
            <ul className="space-y-3">
              {renderKeyPoints(aiContent.keyPoints)}
            </ul>
          </div>
          
          {/* Tone */}
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-600/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16l4-2 4 2V4M7 4a2 2 0 012-2h6a2 2 0 012 2v0" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-yellow-400">Recommended Tone</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {aiContent.tone}
            </p>
          </div>
        </div>
        
        {/* Text Overlays */}
        <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-pink-600/20 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-pink-400">Text Overlays for Video</h3>
          </div>
          <div className="flex flex-wrap">
            {renderTextOverlays(aiContent.textOverlays)}
          </div>
        </div>
      </div>
    </div>
  );
}