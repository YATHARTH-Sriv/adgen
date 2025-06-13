import React from 'react';
import { Composition } from 'remotion';
import { ProductAdVideo, ProductAdVideoProps } from './ProductAdVideo';

const ProductAdVideoWrapper: React.FC<Record<string, unknown>> = (props) => {
  return <ProductAdVideo {...props as unknown as ProductAdVideoProps} />;
};


export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ProductAd"
        component={ProductAdVideoWrapper}
        durationInFrames={450} // 15 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          productData: {
            title: 'Sample Product',
            brand: 'Sample Brand',
            price: '$99.99',
            rating: '4.5 stars',
            localImages: [],
            features: ['Premium Quality', 'Fast Shipping', 'Great Value'],
            description: 'This is an amazing product that will change your life!',
            url: 'https://example.com',
            availability: 'In Stock',
            images: [],
          },
          aiContent: {
            script: 'Discover the amazing product that everyone is talking about!',
            headline: 'Revolutionary Product - Limited Time!',
            keyPoints: ['Premium Quality', 'Affordable Price', 'Fast Delivery'],
            textOverlays: ['🔥 Hot Deal!', '✅ Premium Quality', '🚀 Order Now!'],
            tone: 'Exciting and Persuasive',
          },
        } as ProductAdVideoProps}
      />
    </>
  );
};