'use client';

import { useState, FormEvent, useEffect } from 'react';
import { URLInputForm } from './scraping/URLInputForm';
import { LoadingState } from './scraping/LoadingState';
import { ErrorState } from './scraping/ErrorState';
import { SuccessMessage } from './scraping/SuccessMessage';
import { AIGeneratedContent } from './scraping/AIGeneratedContent';
import { VideoGeneration } from './scraping/VideoGeneration';
import { ToastNotification } from './ToastNotification';

interface ProductData {
  title: string;
  brand: string;
  price: string;
  rating: string;
  localImages?: string[];
  features: string[];
  url: string;
  availability: string;
  images: string[];
}

interface AIContent {
  script: string;
  headline: string;
  keyPoints: string[] | string;
  textOverlays: string[] | string;
  tone: string;
}

interface APIResponse {
  success: boolean;
  productData: ProductData;
  aiContent: AIContent;
  generatedAt: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

interface VideoJobResponse {
  success: boolean;
  jobId: string;
  message: string;
  statusUrl: string;
}

interface VideoStatusResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

const VIDEO_SERVER_URL = 'http://localhost:3001';

export default function ProductScraper() {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<APIResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [videoJobId, setVideoJobId] = useState<string>('');
  const [videoStatus, setVideoStatus] = useState<VideoStatusResponse | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Toast notification states
  const [showScriptToast, setShowScriptToast] = useState<boolean>(false);
  const [showVideoToast, setShowVideoToast] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a product URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setVideoJobId('');
    setVideoStatus(null);

    try {
      console.log('🚀 Starting product analysis...');
      const response = await fetch('/api/scrape-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data: APIResponse | ErrorResponse = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        throw new Error(errorData.error || 'Failed to process product');
      }

      const resultData = data as APIResponse;
      setResult(resultData);
      setShowScriptToast(true);
      console.log('✅ Product analysis completed!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('❌ Product analysis failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async (): Promise<void> => {
    if (!result) return;

    setError('');
    setVideoStatus(null);

    try {
      console.log('🎬 Starting video generation...');
      const response = await fetch(`${VIDEO_SERVER_URL}/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productData: result.productData,
          aiContent: result.aiContent,
        }),
      });

      const data: VideoJobResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to start video generation');
      }

      setVideoJobId(data.jobId);
      startPollingVideoStatus(data.jobId);
      console.log('🎥 Video generation started, job ID:', data.jobId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Video generation failed: ${errorMessage}`);
      console.error('❌ Video generation failed:', errorMessage);
    }
  };

  const startPollingVideoStatus = (jobId: string): void => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${VIDEO_SERVER_URL}/video-status/${jobId}`);
        const status: VideoStatusResponse = await response.json();

        setVideoStatus(status);
        console.log(`📊 Video status: ${status.status}`);

        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval);
          setPollingInterval(null);
          
          if (status.status === 'completed') {
            setShowVideoToast(true);
            console.log('🎉 Video generation completed!');
          } else {
            console.error('❌ Video generation failed:', status.error);
          }
        }
      } catch (err) {
        console.error('Error polling video status:', err);
      }
    }, 2000);

    setPollingInterval(interval);
  };

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  return (
    <div className="min-h-screen bg-black">
      {/* Toast Notifications */}
      <ToastNotification
        message="AI script generated successfully!"
        type="success"
        isVisible={showScriptToast}
        onClose={() => setShowScriptToast(false)}
        showScrollHint={true}
      />
      
      <ToastNotification
        message="Video generation completed!"
        type="success"
        isVisible={showVideoToast}
        onClose={() => setShowVideoToast(false)}
        showScrollHint={false}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-16 px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            AI Video Generator
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Transform any Amazon product into a professional marketing video using artificial intelligence. 
            Simply paste a product URL and watch the magic happen.
          </p>
        </div>
        
        {/* URL Input Form */}
        <div className="px-8 pb-16">
          <URLInputForm
            url={url}
            setUrl={setUrl}
            loading={loading}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="border-t border-gray-800">
            <LoadingState />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="border-t border-gray-800">
            <ErrorState error={error} />
          </div>
        )}

        {/* Results Display */}
        {result && (
          <>
            {/* Success Message */}
            <div className="border-t border-gray-800">
              <SuccessMessage />
            </div>

            {/* AI Generated Content */}
            <div className="border-t border-gray-800">
              <AIGeneratedContent aiContent={result.aiContent} />
            </div>

            {/* Video Generation */}
            <div className="border-t border-gray-800">
              <VideoGeneration
                videoJobId={videoJobId}
                videoStatus={videoStatus}
                error={error}
                onGenerateVideo={handleGenerateVideo}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}