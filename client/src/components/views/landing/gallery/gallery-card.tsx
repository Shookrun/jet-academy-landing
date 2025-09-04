import { cn } from "@/utils/cn";
import Image from "next/image";
import { MdFullscreen } from "react-icons/md";

interface GalleryCardProps {
  imageUrl?: string;
  title?: string | null;
  isLoading?: boolean;
}

// URL düzeltme fonksiyonu
const getImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return "/default-gallery-image.jpg"; 
  
  if (imageUrl.startsWith("http://api.jetschool.az")) {
    const httpsUrl = imageUrl.replace("http://", "https://");
    return httpsUrl;
  }
  
  if (imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith("/uploads")) {
    const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "https://api.jetschool.az";
    return cdnUrl + imageUrl;
  }
  
  // CDN URL varsa kullan
  return `${process.env.NEXT_PUBLIC_CDN_URL || "https://api.jetschool.az"}/${imageUrl}`;
};

export default function GalleryCard({
  imageUrl,
  title,
  isLoading = false,
}: GalleryCardProps) {
  return (
    <div className="relative w-full h-[280px] sm:h-[320px] md:h-[350px] lg:h-[300px] xl:h-[350px] cursor-pointer overflow-hidden rounded-3xl group">
      {isLoading ? (
        <div className="w-full h-full bg-gray-300 ease-in-out duration-200 animate-pulse rounded-3xl"></div>
      ) : (
        <div className="relative w-full h-full transition-transform duration-300 md:group-hover:scale-105">
          <Image
            src={getImageUrl(imageUrl)}
            alt={title || "Gallery image"}
            fill
            className="object-cover rounded-3xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
            onError={(e) => {
              console.log('Gallery image failed to load:', imageUrl);
              // Fallback image
              e.currentTarget.src = '/default-gallery-image.jpg';
            }}
          />
        </div>
      )}
      
      {!isLoading && title && (
        <div
          className={cn(
            "absolute inset-0 md:flex bg-gradient-to-t from-black/60 via-black/30 to-transparent hidden flex-col justify-center items-center px-6 backdrop-blur-sm transition-all duration-300 delay-[50ms]",
            "md:opacity-0 md:group-hover:opacity-100"
          )}
        >
          <div className="bg-jsyellow md:group-hover:opacity-100 opacity-0 transition-all duration-400 delay-75 ease-in-out px-6 py-6 sm:px-8 sm:py-8 justify-center w-fit text-2xl sm:text-3xl rounded-full flex items-center shadow-lg">
            <MdFullscreen />
          </div>
          
          {/* Title overlay - isteğe bağlı */}
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-medium text-sm sm:text-base md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100 text-center">
              {title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}