import puppeteer, { Browser, Page } from 'puppeteer';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { NextRequest, NextResponse } from 'next/server';

// Type definitions
interface ProductData {
  title: string;
  price: string;
  brand: string;
  // description: string;
  features: string[];
  images: string[];
  rating: string;
  availability: string;
  url: string;
  localImages?: string[];
}

interface AIContent {
  script: string;
  headline: string;
  keyPoints: string[];
  textOverlays: string[];
  tone: string;
}

interface APIResponse {
  success: boolean;
  productData: ProductData;
  aiContent: AIContent;
  generatedAt: string;
}

interface RequestBody {
  url: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

// Utility function to download images
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

// Amazon Product Scraper
async function scrapeAmazonProduct(url: string): Promise<ProductData> {
  let browser: Browser | null = null;
  
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page: Page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate to the product page
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for key elements to load
    await page.waitForSelector('#productTitle', { timeout: 10000 });
    
    // Extract product data
    const productData: ProductData = await page.evaluate(() => {
      // Helper function to safely get text content
      const getTextContent = (selector: string): string => {
        const element = document.querySelector(selector);
        return element ? element.textContent?.trim() || '' : '';
      };
      
      // Helper function to get attribute
      const getAttribute = (selector: string, attribute: string): string => {
        const element = document.querySelector(selector);
        return element ? element.getAttribute(attribute) || '' : '';
      };
      
      // Extract product title
      const title = getTextContent('#productTitle');
      
      // Extract price
      const price = getTextContent('.a-price-whole') || 
                   getTextContent('.a-offscreen') || 
                   getTextContent('#price_inside_buybox') ||
                   getTextContent('.a-price .a-offscreen') ||
                   'Price not available';
      
      // Extract product images
      const images: string[] = [];
      
      // Main product image
      const mainImage = getAttribute('#landingImage', 'src') || 
                       getAttribute('#imgBlkFront', 'src') ||
                       getAttribute('#ebooksImgBlkFront', 'src');
      if (mainImage) images.push(mainImage);
      
      // Additional images from thumbnail section
      const thumbnails = document.querySelectorAll('#altImages img, .imageThumbnail img');
      thumbnails.forEach((img: Element) => {
        const src = (img as HTMLImageElement).getAttribute('src');
        if (src && !images.includes(src)) {
          // Convert thumbnail to larger image
          const largeImageSrc = src.replace(/\._[A-Z0-9,_]+_\./, '.');
          images.push(largeImageSrc);
        }
      });
      
      // Extract product features/bullet points
      const features: string[] = [];
      const featureElements = document.querySelectorAll('#feature-bullets li span, .a-unordered-list .a-list-item');
      featureElements.forEach((element: Element) => {
        const text = element.textContent?.trim() || '';
        if (text && text.length > 10 && !text.includes('Make sure') && !text.includes('See more')) {
          features.push(text);
        }
      });
      
      // Extract description
      const description = getTextContent('#productDescription') || 
                         getTextContent('#feature-bullets') ||
                         getTextContent('#aplus') ||
                         'Description not available';
      
      // Extract brand
      const brand = getTextContent('#bylineInfo') || 
                   getTextContent('.author') ||
                   getTextContent('#brand') ||
                   'Brand not available';
      
      // Extract rating
      const rating = getTextContent('.reviewCountTextLinkedHistogram') || 
                    getTextContent('#acrPopover') ||
                    getTextContent('.a-icon-alt') ||
                    'Rating not available';
      
      // Extract availability
      const availability = getTextContent('#availability span') || 
                          getTextContent('#merchant-info') ||
                          'Availability not specified';
      
      return {
        title,
        price,
        brand,
        description,
        features: features.slice(0, 10), // Limit to first 10 features
        images: images.slice(0, 5), // Limit to first 5 images
        rating,
        availability,
        url: window.location.href
      };
    });
    
    return productData;
    
  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error(`Failed to scrape product: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// AI Content Generation
async function generateAdContent(productData: ProductData): Promise<AIContent> {
  const prompt = `
You are an expert copywriter creating compelling video ad scripts for e-commerce products.

Product Information:
- Title: ${productData.title}
- Brand: ${productData.brand}
- Price: ${productData.price}
- Features: ${productData.features.join(', ')}
- Rating: ${productData.rating}

Create a compelling 15-30 second video ad script with the following structure:
1. Hook (attention-grabbing opening line)
2. Problem/Pain Point (what problem does this solve?)
3. Solution (how this product helps)
4. Key Benefits (2-3 main benefits)
5. Social Proof (mention ratings if available)
6. Call to Action (compelling CTA)

Also provide:
- A catchy headline for the ad
- 3 key selling points
- Suggested text overlays for the video
- Emotional tone to use

Format the response as JSON with these keys: script, headline, keyPoints, textOverlays, tone.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }
    
    // Try to parse JSON response
    try {
      return JSON.parse(aiResponse) as AIContent;
    } catch (parseError) {
      // If JSON parsing fails, create structured response manually
      return {
        script: aiResponse,
        headline: `Amazing ${productData.title} - Limited Time Offer!`,
        keyPoints: productData.features.slice(0, 3),
        textOverlays: [
          "🔥 Hot Deal Alert!",
          "✅ Premium Quality",
          "🚀 Order Now!"
        ],
        tone: "Excited and Persuasive"
      };
    }
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// POST handler for App Router
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Product URL is required' },
        { status: 400 }
      );
    }

    // Validate Amazon URL
    if (!url.includes('amazon.')) {
      return NextResponse.json(
        { error: 'Only Amazon URLs are supported in this MVP' },
        { status: 400 }
      );
    }

    // Step 1: Scrape product data
    console.log('🕷️ Starting product scraping...');
    const productData = await scrapeAmazonProduct(url);
    
    if (!productData.title) {
      return NextResponse.json(
        { error: 'Could not extract product information. Please check the URL.' },
        { status: 400 }
      );
    }

    // Step 2: Download product images to frontend
    console.log('📸 Downloading product images...');
    const downloadedImages: string[] = [];
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    for (let i = 0; i < Math.min(productData.images.length, 3); i++) {
      try {
        const imageUrl = productData.images[i];
        const filename = `product_${Date.now()}_${i}.jpg`;
        const filepath = path.join(uploadsDir, filename);
        
        await downloadImage(imageUrl, filepath);
        downloadedImages.push(`/uploads/${filename}`);
      } catch (downloadError) {
        console.warn(`Failed to download image ${i}:`, downloadError instanceof Error ? downloadError.message : 'Unknown error');
      }
    }

    // Step 3: Generate AI content
    console.log('🤖 Generating AI content...');
    const aiContent = await generateAdContent(productData);

    // Step 4: Return complete data
    const result: APIResponse = {
      success: true,
      productData: {
        ...productData,
        localImages: downloadedImages
      },
      aiContent,
      generatedAt: new Date().toISOString()
    };

    console.log('✅ Product scraping and AI generation completed successfully');
    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}