'use client';

import { useState } from 'react';

const examples = [
  {
    id: 1,
    title: "Wireless Headphones",
    category: "Electronics",
    thumbnail: "/api/placeholder/400/300",
    videoUrl: "./public/sample/sampleone.mp4",
    metrics: { views: "2.3M", engagement: "8.5%", conversions: "+127%" }
  },
  {
    id: 2,
    title: "Smart Fitness Watch",
    category: "Wearables",
    thumbnail: "/api/placeholder/400/300",
    videoUrl: "/api/placeholder/video/2",
    metrics: { views: "1.8M", engagement: "12.3%", conversions: "+89%" }
  },
  {
    id: 3,
    title: "Organic Skincare Set",
    category: "Beauty",
    thumbnail: "/api/placeholder/400/300",
    videoUrl: "/api/placeholder/video/3",
    metrics: { views: "3.1M", engagement: "15.7%", conversions: "+203%" }
  },
  {
    id: 4,
    title: "Gaming Mechanical Keyboard",
    category: "Gaming",
    thumbnail: "/api/placeholder/400/300",
    videoUrl: "/api/placeholder/video/4",
    metrics: { views: "1.5M", engagement: "9.8%", conversions: "+156%" }
  }
];

export default function Examples() {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  return (
    <section id="examples" className="py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-full text-sm text-gray-300 mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            See AI-Generated Ads
            <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
              In Action
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real products transformed into high-converting video advertisements using our AI technology
          </p>
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {examples.map((example) => (
            <div
              key={example.id}
              className="group bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gray-800 overflow-hidden">
                <img
                  src={example.thumbnail}
                  alt={example.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                
                {/* Play Button */}
                <button
                  onClick={() => setSelectedVideo(example.id)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </button>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {example.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-blue-400 transition-colors duration-200">
                  {example.title}
                </h3>
                
                {/* Metrics */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Views</span>
                    <span className="text-white font-medium">{example.metrics.views}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Engagement</span>
                    <span className="text-green-400 font-medium">{example.metrics.engagement}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Conversions</span>
                    <span className="text-blue-400 font-medium">{example.metrics.conversions}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Create Your First Video Ad
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700">
              <div className="aspect-video bg-black">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>Video Preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}