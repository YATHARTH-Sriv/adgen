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

interface ProductInformationProps {
  productData: ProductData;
}

export function ProductInformation({ productData }: ProductInformationProps) {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-black mb-8 text-center">
        Product Information
      </h2>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-black mb-2 uppercase tracking-wide">
                Title
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">{productData.title}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-2 uppercase tracking-wide">
                  Brand
                </h3>
                <p className="text-gray-700">{productData.brand}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-black mb-2 uppercase tracking-wide">
                  Rating
                </h3>
                <p className="text-gray-700">{productData.rating}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-black mb-2 uppercase tracking-wide">
                Price
              </h3>
              <p className="text-2xl font-bold text-black">{productData.price}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
                Key Features
              </h3>
              <ul className="space-y-2">
                {productData.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-black mr-3 mt-1">•</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Product Images */}
          <div>
            <h3 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
              Product Images
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {productData.localImages?.map((image: string, index: number) => (
                <div key={index} className="border-2 border-black overflow-hidden">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
              {(!productData.localImages || productData.localImages.length === 0) && (
                <div className="col-span-2 border-2 border-black h-32 flex items-center justify-center">
                  <span className="text-gray-500">No images available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}