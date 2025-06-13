import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Next.js frontend URL
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ... existing interfaces ...
interface ProductData {
  title: string;
  brand: string;
  price: string;
  rating: string;
  localImages?: string[];
  features: string[];
  // description: string;
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

interface VideoJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  productData: ProductData;
  aiContent: AIContent;
  videoUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

// In-memory storage
const videoJobs: Map<string, VideoJob> = new Map();

// Ensure directories exist
const publicDir = path.join(__dirname, 'public');
const videosDir = path.join(publicDir, 'videos');
const uploadsDir = path.join(publicDir, 'uploads');

[publicDir, videosDir, uploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper function to download images
async function downloadImage(url: string, filepath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err: Error) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Helper function to process images for video generation
async function processProductImages(productData: ProductData): Promise<ProductData> {
  const processedImages: string[] = [];
  
  // Download images from URLs if they exist
  if (productData.images && productData.images.length > 0) {
    for (let i = 0; i < Math.min(productData.images.length, 3); i++) {
      try {
        const imageUrl = productData.images[i];
        const filename = `product_${Date.now()}_${i}.jpg`;
        const filepath = path.join(uploadsDir, filename);
        
        await downloadImage(imageUrl, filepath);
        processedImages.push(`http://localhost:${PORT}/uploads/${filename}`);
      } catch (error) {
        console.warn(`Failed to download image ${i}:`, error);
      }
    }
  }
  
  return {
    ...productData,
    localImages: processedImages.length > 0 ? processedImages : productData.localImages
  };
}

// Sample test data
const sampleProductData: ProductData = {
  title: "Amazon Echo Dot (5th Gen, 2022 release) | Smart speaker with Alexa",
  brand: "Amazon",
  price: "$49.99",
  rating: "4.7 out of 5 stars",
  localImages: [],
  features: [
    "Our most popular smart speaker – Now with better audio",
    "Voice control your entertainment – Stream songs from Amazon Music, Apple Music, Spotify",
    "Ready to help – Ask Alexa to tell a joke, play music, answer questions",
    "Connect with others – Call friends and family who have Alexa devices",
    "Smart home made easy – Use your voice to turn on lights, adjust thermostats"
  ],
  // description: "Meet the all-new Echo Dot - our most popular smart speaker with Alexa. The sleek, compact design delivers crisp vocals and balanced bass for full sound.",
  url: "https://amazon.com/test",
  availability: "In Stock",
  images: []
};

const sampleAIContent: AIContent = {
  script: `🔥 INTRODUCING THE GAME-CHANGING ECHO DOT! 

Are you tired of manually controlling every device in your home? 

The new Amazon Echo Dot is here to revolutionize your daily routine! With crystal-clear audio and Alexa built-in, you can:
✅ Stream music from any platform with just your voice
✅ Control your entire smart home effortlessly  
✅ Get instant answers to any question
✅ Stay connected with hands-free calling

With 4.7-star ratings from thousands of happy customers, this isn't just a speaker - it's your personal assistant!

For just $49.99, transform your home into a smart sanctuary!

🚀 DON'T WAIT - GET YOUR ECHO DOT TODAY!`,
  headline: "🔥 Revolutionary Echo Dot - Now 50% Smarter!",
  keyPoints: [
    "🎵 Premium Audio Quality with Alexa",
    "🏠 Complete Smart Home Control",
    "⭐ 4.7-Star Customer Rating"
  ],
  textOverlays: [
    "🔥 Limited Time Deal!",
    "✅ Voice-Controlled Everything",
    "🚀 Order Now - Only $49.99!"
  ],
  tone: "Exciting and energetic with urgency"
};

// Helper function to generate video
async function generateVideo(jobId: string): Promise<void> {
  const job = videoJobs.get(jobId);
  if (!job) throw new Error('Job not found');

  try {
    console.log(`\n🎬 Starting video generation for job ${jobId}`);
    job.status = 'processing';

    // Process images first
    const processedProductData = await processProductImages(job.productData);
    job.productData = processedProductData;

    const outputFilename = `product-ad-${jobId}.mp4`;
    const outputPath = path.join(videosDir, outputFilename);

    console.log(`📦 Bundling Remotion project...`);
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, 'remotion/index.ts'),
      onProgress: (progress) => {
        console.log(`   Bundling: ${Math.round(progress * 100)}%`);
      },
    });

    console.log(`🎯 Getting composition...`);
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'ProductAd',
      inputProps: {
        productData: job.productData,
        aiContent: job.aiContent,
      },
    });

    console.log(`🎥 Rendering video...`);
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        productData: job.productData,
        aiContent: job.aiContent,
      },
      onProgress: ({ renderedFrames, progress }) => {
        const progressPercent = Math.round(progress * 100);
        console.log(`   Rendering: ${progressPercent}% (${renderedFrames} frames)`);
      },
    });

    job.status = 'completed';
    job.videoUrl = `http://localhost:${PORT}/videos/${outputFilename}`;
    job.completedAt = new Date().toISOString();

    console.log(`✅ Video generation completed for job ${jobId}`);
    console.log(`📹 Video URL: ${job.videoUrl}`);
  } catch (error) {
    console.error(`❌ Video generation failed for job ${jobId}:`, error);
    job.status = 'failed';
    job.error = error instanceof Error ? error.message : 'Unknown error';
  }
}

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Video Generation Server',
    status: 'Running',
    endpoints: {
      health: 'GET /health',
      testVideo: 'POST /test-video',
      generateVideo: 'POST /generate-video',
      videoStatus: 'GET /video-status/:jobId',
      videos: 'GET /videos/:filename',
      uploads: 'GET /uploads/:filename'
    },
    timestamp: new Date().toISOString()
  });
});

app.post('/test-video', async (req, res) => {
  try {
    console.log('\n🧪 TEST VIDEO GENERATION STARTED');
    
    const jobId = Date.now().toString();
    const job: VideoJob = {
      id: jobId,
      status: 'pending',
      productData: sampleProductData,
      aiContent: sampleAIContent,
      createdAt: new Date().toISOString(),
    };

    videoJobs.set(jobId, job);
    generateVideo(jobId).catch(console.error);

    res.json({
      success: true,
      jobId,
      message: 'Test video generation started with sample data',
      statusUrl: `http://localhost:${PORT}/video-status/${jobId}`,
      sampleData: {
        productTitle: sampleProductData.title,
        headline: sampleAIContent.headline
      }
    });
  } catch (error) {
    console.error('❌ Error starting test video generation:', error);
    res.status(500).json({
      error: 'Failed to start test video generation',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/generate-video', async (req, res) => {
  try {
    const { productData, aiContent } = req.body;

    if (!productData || !aiContent) {
      return res.status(400).json({
        error: 'Product data and AI content are required'
      });
    }

    console.log('\n🎬 CUSTOM VIDEO GENERATION STARTED');
    console.log('📦 Product:', productData.title);

    const jobId = Date.now().toString();
    const job: VideoJob = {
      id: jobId,
      status: 'pending',
      productData,
      aiContent,
      createdAt: new Date().toISOString(),
    };

    videoJobs.set(jobId, job);
    generateVideo(jobId).catch(console.error);

    res.json({
      success: true,
      jobId,
      message: 'Video generation started',
      statusUrl: `http://localhost:${PORT}/video-status/${jobId}`,
    });
  } catch (error) {
    console.error('❌ Error starting video generation:', error);
    res.status(500).json({
      error: 'Failed to start video generation',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/video-status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = videoJobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({
    id: job.id,
    status: job.status,
    videoUrl: job.videoUrl,
    error: job.error,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
  });
});

app.get('/jobs', (req, res) => {
  const jobs = Array.from(videoJobs.values()).map(job => ({
    id: job.id,
    status: job.status,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
    productTitle: job.productData.title.substring(0, 50) + '...',
    videoUrl: job.videoUrl
  }));

  res.json({
    totalJobs: jobs.length,
    jobs: jobs.reverse()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.listen(PORT, () => {
  console.log('\n🚀 Video Generation Server Started!');
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: http://localhost:3000`);
  console.log('\n📋 Available endpoints:');
  console.log(`   GET  /              - Server info`);
  console.log(`   GET  /health        - Health check`);
  console.log(`   POST /test-video    - Generate test video`);
  console.log(`   POST /generate-video - Generate video with custom data`);
  console.log(`   GET  /video-status/:id - Check video status`);
  console.log(`   GET  /jobs          - List all jobs`);
  console.log(`   GET  /videos/:file  - Serve generated videos`);
  console.log(`   GET  /uploads/:file - Serve uploaded images`);
  console.log('\n🧪 Quick Test: POST http://localhost:3001/test-video\n');
});











// import express, { Request, Response } from 'express';
// import cors from 'cors';
// import path from 'path';
// import fs from 'fs';
// import { bundle } from '@remotion/bundler';
// import { renderMedia, selectComposition } from '@remotion/renderer';

// const app = express();
// const PORT = 3001;

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use('/videos', express.static(path.join(__dirname, '../public/videos')));

// // Types (same as before)
// interface ProductData {
//   title: string;
//   brand: string;
//   price: string;
//   rating: string;
//   localImages?: string[];
//   features: string[];
//   description: string;
//   url: string;
//   availability: string;
//   images: string[];
// }

// interface AIContent {
//   script: string;
//   headline: string;
//   keyPoints: string[] | string;
//   textOverlays: string[] | string;
//   tone: string;
// }

// interface VideoJob {
//   id: string;
//   status: 'pending' | 'processing' | 'completed' | 'failed';
//   productData: ProductData;
//   aiContent: AIContent;
//   videoUrl?: string;
//   error?: string;
//   createdAt: string;
//   completedAt?: string;
// }

// // In-memory storage
// const videoJobs: Map<string, VideoJob> = new Map();

// // Ensure directories exist
// const publicDir = path.join(__dirname, '../public');
// const videosDir = path.join(publicDir, 'videos');

// [publicDir, videosDir].forEach(dir => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });

// // Sample test data
// const sampleProductData: ProductData = {
//   title: "Amazon Echo Dot (5th Gen, 2022 release) | Smart speaker with Alexa",
//   brand: "Amazon",
//   price: "$49.99",
//   rating: "4.7 out of 5 stars",
//   localImages: [],
//   features: [
//     "Our most popular smart speaker – Now with better audio",
//     "Voice control your entertainment – Stream songs from Amazon Music, Apple Music, Spotify",
//     "Ready to help – Ask Alexa to tell a joke, play music, answer questions",
//     "Connect with others – Call friends and family who have Alexa devices",
//     "Smart home made easy – Use your voice to turn on lights, adjust thermostats"
//   ],
//   description: "Meet the all-new Echo Dot - our most popular smart speaker with Alexa. The sleek, compact design delivers crisp vocals and balanced bass for full sound.",
//   url: "https://amazon.com/test",
//   availability: "In Stock",
//   images: []
// };

// const sampleAIContent: AIContent = {
//   script: `🔥 INTRODUCING THE GAME-CHANGING ECHO DOT! 

// Are you tired of manually controlling every device in your home? 

// The new Amazon Echo Dot is here to revolutionize your daily routine! With crystal-clear audio and Alexa built-in, you can:
// ✅ Stream music from any platform with just your voice
// ✅ Control your entire smart home effortlessly  
// ✅ Get instant answers to any question
// ✅ Stay connected with hands-free calling

// With 4.7-star ratings from thousands of happy customers, this isn't just a speaker - it's your personal assistant!

// For just $49.99, transform your home into a smart sanctuary!

// 🚀 DON'T WAIT - GET YOUR ECHO DOT TODAY!`,
//   headline: "🔥 Revolutionary Echo Dot - Now 50% Smarter!",
//   keyPoints: [
//     "🎵 Premium Audio Quality with Alexa",
//     "🏠 Complete Smart Home Control",
//     "⭐ 4.7-Star Customer Rating"
//   ],
//   textOverlays: [
//     "🔥 Limited Time Deal!",
//     "✅ Voice-Controlled Everything",
//     "🚀 Order Now - Only $49.99!"
//   ],
//   tone: "Exciting and energetic with urgency"
// };

// // Helper function to generate video
// async function generateVideo(jobId: string): Promise<void> {
//   const job = videoJobs.get(jobId);
//   if (!job) throw new Error('Job not found');

//   try {
//     console.log(`\n🎬 Starting video generation for job ${jobId}`);
//     job.status = 'processing';

//     const outputFilename = `product-ad-${jobId}.mp4`;
//     const outputPath = path.join(videosDir, outputFilename);

//     console.log(`📦 Bundling Remotion project...`);
//     // Bundle the Remotion project
//     const bundleLocation = await bundle({
//       entryPoint: path.join(__dirname, 'remotion/index.ts'),
//       onProgress: (progress) => {
//         console.log(`   Bundling: ${Math.round(progress * 100)}%`);
//       },
//     });

//     console.log(`🎯 Getting composition...`);
//     // Get composition
//     const composition = await selectComposition({
//       serveUrl: bundleLocation,
//       id: 'ProductAd',
//       inputProps: {
//         productData: job.productData,
//         aiContent: job.aiContent,
//       },
//     });

//     console.log(`🎥 Rendering video...`);
//     console.log(`   Resolution: ${composition.width}x${composition.height}`);
//     console.log(`   Duration: ${composition.durationInFrames} frames (${Math.round(composition.durationInFrames / composition.fps)}s)`);

//     // Render the video
//     await renderMedia({
//       composition,
//       serveUrl: bundleLocation,
//       codec: 'h264',
//       outputLocation: outputPath,
//       inputProps: {
//         productData: job.productData,
//         aiContent: job.aiContent,
//       },
//       onProgress: ({ renderedFrames, progress }) => {
//         const progressPercent = Math.round(progress * 100);
//         console.log(`   Rendering: ${progressPercent}% (${renderedFrames} frames)`);
//       },
//     });

//     // Update job status
//     job.status = 'completed';
//     job.videoUrl = `http://localhost:${PORT}/videos/${outputFilename}`;
//     job.completedAt = new Date().toISOString();

//     console.log(`✅ Video generation completed for job ${jobId}`);
//     console.log(`📹 Video URL: ${job.videoUrl}`);
//     console.log(`📁 File location: ${outputPath}`);
//   } catch (error) {
//     console.error(`❌ Video generation failed for job ${jobId}:`, error);
//     job.status = 'failed';
//     job.error = error instanceof Error ? error.message : 'Unknown error';
//   }
// }

// // API Routes
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Video Generation Server',
//     status: 'Running',
//     endpoints: {
//       health: 'GET /health',
//       testVideo: 'POST /test-video',
//       generateVideo: 'POST /generate-video',
//       videoStatus: 'GET /video-status/:jobId',
//       videos: 'GET /videos/:filename'
//     },
//     timestamp: new Date().toISOString()
//   });
// });

// // Test endpoint with sample data
// app.post('/test-video', async (req, res) => {
//   try {
//     console.log('\n🧪 TEST VIDEO GENERATION STARTED');
//     console.log('📋 Using sample product data...');

//     // Create job with sample data
//     const jobId = Date.now().toString();
//     const job: VideoJob = {
//       id: jobId,
//       status: 'pending',
//       productData: sampleProductData,
//       aiContent: sampleAIContent,
//       createdAt: new Date().toISOString(),
//     };

//     videoJobs.set(jobId, job);

//     // Start video generation in background
//     generateVideo(jobId).catch(console.error);

//     res.json({
//       success: true,
//       jobId,
//       message: 'Test video generation started with sample data',
//       statusUrl: `http://localhost:${PORT}/video-status/${jobId}`,
//       sampleData: {
//         productTitle: sampleProductData.title,
//         headline: sampleAIContent.headline
//       }
//     });
//   } catch (error) {
//     console.error('❌ Error starting test video generation:', error);
//     res.status(500).json({
//       error: 'Failed to start test video generation',
//       details: error instanceof Error ? error.message : 'Unknown error',
//     });
//   }
// });

// app.post('/generate-video', async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { productData, aiContent } = req.body;

//     if (!productData || !aiContent) {
//       res.status(400).json({
//         error: 'Product data and AI content are required'
//       });
//       return;
//     }

//     console.log('\n🎬 CUSTOM VIDEO GENERATION STARTED');

//     // Create job
//     const jobId = Date.now().toString();
//     const job: VideoJob = {
//       id: jobId,
//       status: 'pending',
//       productData,
//       aiContent,
//       createdAt: new Date().toISOString(),
//     };

//     videoJobs.set(jobId, job);

//     // Start video generation in background
//     generateVideo(jobId).catch(console.error);

//     res.json({
//       success: true,
//       jobId,
//       message: 'Video generation started',
//       statusUrl: `http://localhost:${PORT}/video-status/${jobId}`,
//     });
//   } catch (error) {
//     console.error('❌ Error starting video generation:', error);
//     res.status(500).json({
//       error: 'Failed to start video generation',
//       details: error instanceof Error ? error.message : 'Unknown error',
//     });
//   }
// });

// app.get('/video-status/:jobId', (req, res): void => {
//   const { jobId } = req.params;
//   const job = videoJobs.get(jobId);

//   if (!job) {
//     res.status(404).json({ error: 'Job not found' });
//     return;
//   }

//   res.json({
//     id: job.id,
//     status: job.status,
//     videoUrl: job.videoUrl,
//     error: job.error,
//     createdAt: job.createdAt,
//     completedAt: job.completedAt,
//   });
// });

// app.get('/jobs', (req, res) => {
//   const jobs = Array.from(videoJobs.values()).map(job => ({
//     id: job.id,
//     status: job.status,
//     createdAt: job.createdAt,
//     completedAt: job.completedAt,
//     productTitle: job.productData.title.substring(0, 50) + '...',
//     videoUrl: job.videoUrl
//   }));

//   res.json({
//     totalJobs: jobs.length,
//     jobs: jobs.reverse() // Most recent first
//   });
// });

// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     memory: process.memoryUsage()
//   });
// });

// app.listen(PORT, () => {
//   console.log('\n🚀 Video Generation Server Started!');
//   console.log(`📍 Server URL: http://localhost:${PORT}`);
//   console.log('\n📋 Available endpoints:');
//   console.log(`   GET  /              - Server info`);
//   console.log(`   GET  /health        - Health check`);
//   console.log(`   POST /test-video    - Generate test video with sample data`);
//   console.log(`   POST /generate-video - Generate video with custom data`);
//   console.log(`   GET  /video-status/:id - Check video generation status`);
//   console.log(`   GET  /jobs          - List all jobs`);
//   console.log(`   GET  /videos/:file  - Serve generated videos`);
//   console.log('\n🧪 Quick Test: POST http://localhost:3001/test-video');
//   console.log('📺 Videos will be saved to: public/videos/\n');
// });