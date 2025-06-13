// import React from 'react';
// import {
//   AbsoluteFill,
//   Img,
//   Sequence,
//   useCurrentFrame,
//   useVideoConfig,
//   interpolate,
//   spring,
// } from 'remotion';

// export interface ProductData {
//   title: string;
//   brand: string;
//   price: string;
//   rating: string;
//   localImages?: string[];
//   features: string[];
//   url: string;
//   availability: string;
//   images: string[];
// }

// export interface AIContent {
//   script: string;
//   headline: string;
//   keyPoints: string[] | string;
//   textOverlays: string[] | string;
//   tone: string;
// }

// export interface ProductAdVideoProps {
//   productData: ProductData;
//   aiContent: AIContent;
// }

// export const ProductAdVideo: React.FC<ProductAdVideoProps> = ({
//   productData,
//   aiContent,
// }) => {
//   const frame = useCurrentFrame();
//   const { fps } = useVideoConfig();

//   // Animation helpers
//   const fadeIn = (start: number, duration: number = 30) => {
//     return interpolate(frame, [start, start + duration], [0, 1], {
//       extrapolateLeft: 'clamp',
//       extrapolateRight: 'clamp',
//     });
//   };

//   const slideIn = (start: number, duration: number = 30) => {
//     return interpolate(frame, [start, start + duration], [100, 0], {
//       extrapolateLeft: 'clamp',
//       extrapolateRight: 'clamp',
//     });
//   };

//   const scale = (start: number) => {
//     return spring({
//       frame: frame - start,
//       fps,
//       config: {
//         damping: 12,
//         stiffness: 200,
//       },
//     });
//   };

//   // Safe array conversion with fallbacks
//   const textOverlays = Array.isArray(aiContent.textOverlays) 
//     ? aiContent.textOverlays 
//     : aiContent.textOverlays 
//       ? [aiContent.textOverlays]
//       : ['🔥 Amazing Deal!', '✅ Premium Quality', '🚀 Get Yours Now!'];

//   const keyPoints = Array.isArray(aiContent.keyPoints) 
//     ? aiContent.keyPoints 
//     : aiContent.keyPoints
//       ? [aiContent.keyPoints]
//       : productData.features?.slice(0, 3) || ['Great Product', 'Amazing Quality', 'Best Value'];

//   // Safe data access with fallbacks
//   const safeProductData = {
//     title: productData.title || 'Amazing Product',
//     brand: productData.brand || 'Premium Brand',
//     price: productData.price || '$99.99',
//     rating: productData.rating || '5 stars',
//     localImages: productData.localImages || [],
//     features: productData.features || [],
//   };

//   const safeAIContent = {
//     headline: aiContent.headline || 'Incredible Product - Limited Time!',
//     script: aiContent.script || 'Discover this amazing product today!',
//     tone: aiContent.tone || 'Exciting',
//   };

//   return (
//     <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
//       {/* Hook/Opening Scene (0-3 seconds) */}
//       <Sequence from={0} durationInFrames={fps * 3}>
//         <AbsoluteFill
//           style={{
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             flexDirection: 'column',
//           }}
//         >
//           <div
//             style={{
//               fontSize: '48px',
//               fontWeight: 'bold',
//               color: 'white',
//               textAlign: 'center',
//               opacity: fadeIn(0),
//               transform: `translateY(${slideIn(0)}px)`,
//               textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
//               padding: '20px',
//               maxWidth: '80%',
//               wordWrap: 'break-word',
//             }}
//           >
//             {textOverlays[0]}
//           </div>
//           <div
//             style={{
//               fontSize: '24px',
//               color: 'white',
//               textAlign: 'center',
//               opacity: fadeIn(fps * 1),
//               marginTop: '20px',
//               padding: '0 40px',
//               maxWidth: '90%',
//               wordWrap: 'break-word',
//             }}
//           >
//             {safeAIContent.headline}
//           </div>
//         </AbsoluteFill>
//       </Sequence>

//       {/* Product Showcase (3-8 seconds) */}
//       <Sequence from={fps * 3} durationInFrames={fps * 5}>
//         <AbsoluteFill
//           style={{
//             background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             padding: '40px',
//           }}
//         >
//           {/* Product Image */}
//           <div
//             style={{
//               flex: 1,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               opacity: fadeIn(fps * 3),
//               transform: `scale(${Math.min(scale(fps * 3), 1)})`,
//             }}
//           >
//             {safeProductData.localImages && safeProductData.localImages.length > 0 ? (
//               <Img
//                 src={safeProductData.localImages[0]}
//                 style={{
//                   maxWidth: '400px',
//                   maxHeight: '400px',
//                   borderRadius: '20px',
//                   boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
//                   objectFit: 'contain',
//                 }}
//               />
//             ) : (
//               <div
//                 style={{
//                   width: '400px',
//                   height: '400px',
//                   backgroundColor: '#ddd',
//                   borderRadius: '20px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '24px',
//                   color: '#666',
//                   textAlign: 'center',
//                   padding: '20px',
//                 }}
//               >
//                 📦<br />Product Image
//               </div>
//             )}
//           </div>

//           {/* Product Info */}
//           <div
//             style={{
//               flex: 1,
//               padding: '0 40px',
//               opacity: fadeIn(fps * 4),
//               transform: `translateX(${slideIn(fps * 4)}px)`,
//             }}
//           >
//             <h2
//               style={{
//                 fontSize: '32px',
//                 fontWeight: 'bold',
//                 color: '#2c3e50',
//                 marginBottom: '20px',
//                 lineHeight: '1.2',
//                 maxWidth: '100%',
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 display: '-webkit-box',
//                 WebkitLineClamp: 3,
//                 WebkitBoxOrient: 'vertical',
//                 wordWrap: 'break-word',
//               }}
//             >
//               {safeProductData.title}
//             </h2>
//             <div
//               style={{
//                 fontSize: '32px',
//                 color: '#e74c3c',
//                 fontWeight: 'bold',
//                 marginBottom: '20px',
//               }}
//             >
//               {safeProductData.price}
//             </div>
//             <div
//               style={{
//                 fontSize: '18px',
//                 color: '#7f8c8d',
//                 marginBottom: '10px',
//               }}
//             >
//               Brand: {safeProductData.brand}
//             </div>
//             <div
//               style={{
//                 fontSize: '16px',
//                 color: '#f39c12',
//                 fontWeight: 'bold',
//               }}
//             >
//               ⭐ {safeProductData.rating}
//             </div>
//           </div>
//         </AbsoluteFill>
//       </Sequence>

//       {/* Key Features (8-12 seconds) */}
//       <Sequence from={fps * 8} durationInFrames={fps * 4}>
//         <AbsoluteFill
//           style={{
//             background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             flexDirection: 'column',
//             padding: '60px',
//           }}
//         >
//           <h3
//             style={{
//               fontSize: '36px',
//               fontWeight: 'bold',
//               color: 'white',
//               marginBottom: '40px',
//               opacity: fadeIn(fps * 8),
//               textAlign: 'center',
//             }}
//           >
//             Why Choose This Product?
//           </h3>
//           <div
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '20px',
//               opacity: fadeIn(fps * 9),
//               maxWidth: '80%',
//               width: '100%',
//             }}
//           >
//             {keyPoints.slice(0, 3).map((point, index) => (
//               <div
//                 key={index}
//                 style={{
//                   fontSize: '24px',
//                   color: 'white',
//                   display: 'flex',
//                   alignItems: 'center',
//                   opacity: fadeIn(fps * 9 + index * 15),
//                   transform: `translateX(${slideIn(fps * 9 + index * 15)}px)`,
//                   padding: '10px',
//                   backgroundColor: 'rgba(255,255,255,0.1)',
//                   borderRadius: '10px',
//                 }}
//               >
//                 <span style={{ marginRight: '15px', fontSize: '28px' }}>✅</span>
//                 <span style={{ flex: 1, wordWrap: 'break-word' }}>{point}</span>
//               </div>
//             ))}
//           </div>
//         </AbsoluteFill>
//       </Sequence>

//       {/* Call to Action (12-15 seconds) */}
//       <Sequence from={fps * 12} durationInFrames={fps * 3}>
//         <AbsoluteFill
//           style={{
//             background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             flexDirection: 'column',
//           }}
//         >
//           <div
//             style={{
//               fontSize: '48px',
//               fontWeight: 'bold',
//               color: 'white',
//               textAlign: 'center',
//               opacity: fadeIn(fps * 12),
//               transform: `scale(${Math.min(scale(fps * 12), 1.2)})`,
//               textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
//               padding: '20px',
//               maxWidth: '80%',
//               wordWrap: 'break-word',
//             }}
//           >
//             {textOverlays[textOverlays.length - 1]}
//           </div>
//           <div
//             style={{
//               fontSize: '28px',
//               color: 'white',
//               textAlign: 'center',
//               opacity: fadeIn(fps * 13),
//               marginTop: '20px',
//               padding: '0 40px',
//               fontWeight: 'bold',
//             }}
//           >
//             Limited Time Offer - Don't Miss Out!
//           </div>
//         </AbsoluteFill>
//       </Sequence>
//     </AbsoluteFill>
//   );
// };

import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';

export interface ProductData {
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

export interface AIContent {
  script: string;
  headline: string;
  keyPoints: string[] | string;
  textOverlays: string[] | string;
  tone: string;
}

export interface ProductAdVideoProps {
  productData: ProductData;
  aiContent: AIContent;
}

export const ProductAdVideo: React.FC<ProductAdVideoProps> = ({
  productData,
  aiContent,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Enhanced animation helpers
  const fadeIn = (start: number, duration: number = 20) => {
    return interpolate(frame, [start, start + duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
  };

  const slideInFromRight = (start: number, duration: number = 25) => {
    return interpolate(frame, [start, start + duration], [width, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.7)),
    });
  };

  const slideInFromLeft = (start: number, duration: number = 25) => {
    return interpolate(frame, [start, start + duration], [-width, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.7)),
    });
  };

  const slideInFromBottom = (start: number, duration: number = 25) => {
    return interpolate(frame, [start, start + duration], [height, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.5)),
    });
  };

  const bounceScale = (start: number) => {
    return spring({
      frame: frame - start,
      fps,
      config: {
        damping: 15,
        stiffness: 300,
        mass: 0.8,
      },
    });
  };

  const pulseScale = (start: number, interval: number = 60) => {
    const cycleFrame = (frame - start) % interval;
    return interpolate(cycleFrame, [0, interval / 2, interval], [1, 1.1, 1], {
      easing: Easing.inOut(Easing.sin),
    });
  };

  const rotateIn = (start: number, duration: number = 30) => {
    return interpolate(frame, [start, start + duration], [-180, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.5)),
    });
  };

  // Floating animation for decorative elements
  const float = (offset: number = 0) => {
    return Math.sin((frame + offset) * 0.05) * 10;
  };

  // Safe array conversion with fallbacks
  const textOverlays = Array.isArray(aiContent.textOverlays) 
    ? aiContent.textOverlays 
    : aiContent.textOverlays 
      ? [aiContent.textOverlays]
      : ['🔥 TRENDING NOW', '✨ PREMIUM QUALITY', '⚡ LIMITED TIME'];

  const keyPoints = Array.isArray(aiContent.keyPoints) 
    ? aiContent.keyPoints 
    : aiContent.keyPoints
      ? [aiContent.keyPoints]
      : productData.features?.slice(0, 3) || ['Premium Quality', 'Fast Delivery', 'Best Price'];

  // Safe data access with fallbacks
  const safeProductData = {
    title: productData.title || 'Amazing Product',
    brand: productData.brand || 'Premium Brand',
    price: productData.price || '$99.99',
    rating: productData.rating || '5.0',
    localImages: productData.localImages || [],
    features: productData.features || [],
  };

  const safeAIContent = {
    headline: aiContent.headline || 'You Need This!',
    script: aiContent.script || 'Discover this amazing product today!',
    tone: aiContent.tone || 'Exciting',
  };

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Animated Background Gradient */}
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(
              ${frame * 2}deg, 
              #FF6B6B 0%, 
              #4ECDC4 25%, 
              #45B7D1 50%, 
              #96CEB4 75%, 
              #FFEAA7 100%
            )`,
            opacity: 0.8,
          }}
        />
        {/* Overlay for better text readability */}
        <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />
      </AbsoluteFill>

      {/* Floating Decorative Elements */}
      <AbsoluteFill>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              fontSize: '40px',
              opacity: 0.1,
              transform: `translateY(${float(i * 20)}px) rotate(${frame * (i % 2 ? 1 : -1)}deg)`,
            }}
          >
            {['✨', '🔥', '⭐', '💎', '🚀', '💯'][i]}
          </div>
        ))}
      </AbsoluteFill>

      {/* Hook/Opening Scene (0-3 seconds) */}
      <Sequence from={0} durationInFrames={fps * 3}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {/* Main Headline with Glassmorphism */}
          <div
            style={{
              fontSize: '56px',
              fontWeight: '900',
              color: 'white',
              textAlign: 'center',
              opacity: fadeIn(0),
              transform: `translateY(${slideInFromBottom(0)}px) scale(${Math.min(bounceScale(0), 1.2)})`,
              textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)',
              padding: '30px 40px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '25px',
              border: '2px solid rgba(255,255,255,0.2)',
              maxWidth: '85%',
              wordWrap: 'break-word',
              letterSpacing: '2px',
            }}
          >
            {textOverlays[0]}
          </div>

          {/* Subtitle with Animated Underline */}
          <div
            style={{
              fontSize: '28px',
              color: 'white',
              textAlign: 'center',
              opacity: fadeIn(fps * 1),
              transform: `translateX(${slideInFromRight(fps * 1)}px)`,
              marginTop: '30px',
              padding: '0 40px',
              maxWidth: '90%',
              fontWeight: '600',
              position: 'relative',
            }}
          >
            {safeAIContent.headline}
            <div
              style={{
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${fadeIn(fps * 1.5) * 100}%`,
                height: '4px',
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
                borderRadius: '2px',
                transition: 'all 0.3s ease-out',
              }}
            />
          </div>

          {/* Pulsing CTA Button */}
          <div
            style={{
              opacity: fadeIn(fps * 2),
              transform: `scale(${pulseScale(fps * 2)})`,
              marginTop: '40px',
            }}
          >
            <div
              style={{
                padding: '15px 30px',
                backgroundColor: '#FF6B6B',
                color: 'white',
                borderRadius: '50px',
                fontSize: '20px',
                fontWeight: 'bold',
                boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
                border: '2px solid rgba(255,255,255,0.3)',
                cursor: 'pointer',
              }}
            >
              SWIPE UP TO BUY 👆
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Product Showcase (3-8 seconds) */}
      <Sequence from={fps * 3} durationInFrames={fps * 5}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '20px',
          }}
        >
          {/* Product Image Container with 3D Effect */}
          <div
            style={{
              opacity: fadeIn(fps * 3),
              transform: `
                scale(${Math.min(bounceScale(fps * 3), 1)}) 
                rotateY(${rotateIn(fps * 3)}deg)
                translateY(${float()}px)
              `,
              marginBottom: '30px',
              position: 'relative',
            }}
          >
            {/* Glowing Background */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                right: '-20px',
                bottom: '-20px',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
                borderRadius: '30px',
                filter: 'blur(20px)',
                opacity: 0.6,
              }}
            />
            
            {safeProductData.localImages && safeProductData.localImages.length > 0 ? (
              <Img
                src={safeProductData.localImages[0]}
                style={{
                  width: '350px',
                  height: '350px',
                  borderRadius: '25px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  objectFit: 'cover',
                  border: '4px solid rgba(255,255,255,0.3)',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            ) : (
              <div
                style={{
                  width: '350px',
                  height: '350px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '80px',
                  border: '4px solid rgba(255,255,255,0.3)',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                📦
              </div>
            )}
            
            {/* Floating Rating Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                backgroundColor: '#FFD700',
                color: '#000',
                padding: '10px 15px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 5px 15px rgba(255, 215, 0, 0.4)',
                zIndex: 2,
                transform: `scale(${pulseScale(fps * 4, 40)})`,
              }}
            >
              ⭐ {safeProductData.rating}
            </div>
          </div>

          {/* Product Info Card */}
          <div
            style={{
              opacity: fadeIn(fps * 4),
              transform: `translateY(${slideInFromBottom(fps * 4)}px)`,
              backgroundColor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              padding: '30px',
              borderRadius: '25px',
              border: '2px solid rgba(255,255,255,0.3)',
              maxWidth: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <h2
              style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#2c3e50',
                marginBottom: '15px',
                lineHeight: '1.2',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                wordWrap: 'break-word',
              }}
            >
              {safeProductData.title}
            </h2>
            
            <div
              style={{
                fontSize: '42px',
                color: '#e74c3c',
                fontWeight: '900',
                marginBottom: '15px',
                textShadow: '2px 2px 4px rgba(231, 76, 60, 0.3)',
                transform: `scale(${pulseScale(fps * 4.5, 50)})`,
              }}
            >
              {safeProductData.price}
            </div>
            
            <div
              style={{
                fontSize: '18px',
                color: '#7f8c8d',
                fontWeight: '600',
                marginBottom: '10px',
              }}
            >
              by {safeProductData.brand}
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Key Features (8-12 seconds) */}
      <Sequence from={fps * 8} durationInFrames={fps * 4}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '40px',
          }}
        >
          <h3
            style={{
              fontSize: '42px',
              fontWeight: '900',
              color: 'white',
              marginBottom: '50px',
              opacity: fadeIn(fps * 8),
              transform: `translateY(${slideInFromBottom(fps * 8)}px)`,
              textAlign: 'center',
              textShadow: '0 0 20px rgba(255,255,255,0.5)',
              letterSpacing: '2px',
            }}
          >
            WHY YOU'LL LOVE IT ❤️
          </h3>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '25px',
              maxWidth: '85%',
              width: '100%',
            }}
          >
            {keyPoints.slice(0, 3).map((point, index) => (
              <div
                key={index}
                style={{
                  opacity: fadeIn(fps * 9 + index * 10),
                  transform: `translateX(${slideInFromLeft(fps * 9 + index * 10)}px) scale(${Math.min(bounceScale(fps * 9 + index * 10), 1)})`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px 25px',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                }}
              >
                <div
                  style={{
                    fontSize: '35px',
                    marginRight: '20px',
                    transform: `scale(${pulseScale(fps * 9 + index * 10, 80)})`,
                  }}
                >
                  {['🚀', '💎', '⚡'][index]}
                </div>
                <span
                  style={{
                    fontSize: '24px',
                    color: 'white',
                    fontWeight: '700',
                    flex: 1,
                    wordWrap: 'break-word',
                    textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
                  }}
                >
                  {point}
                </span>
                <div
                  style={{
                    fontSize: '30px',
                    color: '#4ECDC4',
                    marginLeft: '15px',
                  }}
                >
                  ✓
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Call to Action (12-15 seconds) */}
      <Sequence from={fps * 12} durationInFrames={fps * 3}>
        <AbsoluteFill
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {/* Urgent CTA with Animated Border */}
          <div
            style={{
              position: 'relative',
              opacity: fadeIn(fps * 12),
              transform: `scale(${Math.min(bounceScale(fps * 12), 1.1)})`,
            }}
          >
            {/* Animated Border */}
            <div
              style={{
                position: 'absolute',
                top: '-5px',
                left: '-5px',
                right: '-5px',
                bottom: '-5px',
                background: `conic-gradient(from ${frame * 5}deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #FF6B6B)`,
                borderRadius: '35px',
                filter: 'blur(3px)',
              }}
            />
            
            <div
              style={{
                fontSize: '52px',
                fontWeight: '900',
                color: 'white',
                textAlign: 'center',
                textShadow: '0 0 30px rgba(255,255,255,0.8)',
                padding: '30px 50px',
                backgroundColor: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '30px',
                maxWidth: '85%',
                wordWrap: 'break-word',
                letterSpacing: '3px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {textOverlays[textOverlays.length - 1] || '🔥 GET YOURS NOW!'}
            </div>
          </div>

          {/* Countdown Timer Effect */}
          <div
            style={{
              opacity: fadeIn(fps * 13),
              transform: `translateY(${slideInFromBottom(fps * 13)}px)`,
              marginTop: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                color: 'white',
                fontWeight: '800',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              ONLY
            </div>
            <div
              style={{
                fontSize: '48px',
                color: '#FF6B6B',
                fontWeight: '900',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '10px 20px',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.3)',
                transform: `scale(${pulseScale(fps * 13, 30)})`,
              }}
            >
              24H
            </div>
            <div
              style={{
                fontSize: '32px',
                color: 'white',
                fontWeight: '800',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              LEFT!
            </div>
          </div>

          {/* Final CTA Button */}
          <div
            style={{
              opacity: fadeIn(fps * 14),
              transform: `scale(${Math.min(bounceScale(fps * 14), 1)})`,
              marginTop: '40px',
            }}
          >
            <div
              style={{
                padding: '20px 40px',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                color: 'white',
                borderRadius: '50px',
                fontSize: '24px',
                fontWeight: '900',
                boxShadow: '0 15px 40px rgba(255, 107, 107, 0.5)',
                border: '3px solid rgba(255,255,255,0.5)',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '2px',
                transform: `scale(${pulseScale(fps * 14, 40)})`,
              }}
            >
              TAP TO ORDER NOW! 🛒
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Instagram-Style Progress Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          height: '4px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(frame / (fps * 15)) * 100}%`,
            background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
            borderRadius: '2px',
            transition: 'width 0.1s ease-out',
          }}
        />
      </div>

      {/* Instagram-Style Like/Share Icons */}
      <div
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          opacity: 0.8,
        }}
      >
        {['❤️', '💬', '📤'].map((icon, index) => (
          <div
            key={index}
            style={{
              fontSize: '32px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: '12px',
              borderRadius: '50%',
              backdropFilter: 'blur(10px)',
              transform: `scale(${pulseScale(fps * 2 + index * 30, 60)})`,
            }}
          >
            {icon}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};