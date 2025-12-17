"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";
import { ChevronLeft, ChevronRight, Maximize2, Play, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title?: string;
  id?: number;
}

interface MediaGalleryProps {
  images: string[];
  videos?: Array<{
    id: number;
    type: string;
    url: string;
    thumbnail: string;
    title: string;
  }>;
  productId: string;
  productName: string;
}

// Helper function to check and fix image URLs
const getValidImageUrl = (url: string | null | undefined): string => {
  // Handle null, undefined, or non-string values
  if (!url || typeof url !== "string") {
    console.warn("Invalid URL provided to getValidImageUrl:", url);
    return "/placeholder.svg";
  }

  // If it's a localhost URL, replace it with placeholder
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    console.warn("Localhost URL detected in product image:", url);
    return "/placeholder.svg";
  }

  // If it doesn't start with http/https, assume it's a relative path
  if (!url.startsWith("http")) {
    return url.startsWith("/") ? url : `/${url}`;
  }

  return url;
};

export const MediaGallery = ({
  images,
  videos = [],
  productId,
  productName,
}: MediaGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  // Combine images and videos into media items
  const mediaItems: MediaItem[] = [
    ...images.map((url) => ({ type: "image" as const, url })),
    ...videos.map((v) => ({
      type: "video" as const,
      url: v.url,
      thumbnail: v.thumbnail,
      title: v.title,
      id: v.id,
    })),
  ];

  const currentMedia = mediaItems[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious();
    }
    if (e.key === "ArrowRight") {
      handleNext();
    }
    if (e.key === "Escape") {
      setLightboxOpen(false);
    }
  };

  const handleVideoPlay = (videoId: number, type: string) => {
    setPlayingVideo(videoId);
    trackEvent({
      event: "media_play",
      product_id: productId,
      media_id: videoId,
      type: type,
    });
  };

  const renderVideoEmbed = (url: string, videoId: number, type: string) => {
    let embedUrl = url;

    if (type === "youtube") {
      const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (videoIdMatch) {
        embedUrl = `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1`;
      }
    } else if (type === "vimeo") {
      const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
      if (videoIdMatch) {
        embedUrl = `https://player.vimeo.com/video/${videoIdMatch[1]}?autoplay=1`;
      }
    }

    return (
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={`Video player ${videoId}`}
      />
    );
  };

  return (
    <>
      <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
        {/* Main Display */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
          {currentMedia?.type === "image" ? (
            <div className="relative w-full h-full">
              <Image
                src={getValidImageUrl(currentMedia.url)}
                alt={productName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          ) : currentMedia?.type === "video" && currentMedia.id !== undefined ? (
            <div className="relative w-full h-full">
              {playingVideo === currentMedia.id ? (
                renderVideoEmbed(
                  currentMedia.url,
                  currentMedia.id,
                  videos.find((v) => v.id === currentMedia.id)?.type || "youtube"
                )
              ) : (
                <>
                  <div className="relative w-full h-full">
                    <Image
                      src={getValidImageUrl(currentMedia.thumbnail || "")}
                      alt={currentMedia.title || "Video thumbnail"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full"
                    onClick={() =>
                      handleVideoPlay(
                        currentMedia.id,
                        videos.find((v) => v.id === currentMedia.id)?.type || "youtube"
                      )
                    }
                    aria-label="Play video"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
          ) : null}

          {/* Expand to lightbox button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setLightboxOpen(true)}
            aria-label="Open in fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          {/* Navigation arrows */}
          {mediaItems.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNext}
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {mediaItems.length > 1 && (
          <div className="grid grid-cols-5 gap-2">
            {mediaItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedIndex(idx);
                  setPlayingVideo(null);
                }}
                className={`relative aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedIndex === idx ? "border-primary" : "border-transparent"
                }`}
                aria-label={item.type === "video" ? `Video ${idx + 1}` : `Image ${idx + 1}`}
              >
                <Image
                  src={getValidImageUrl(item.type === "image" ? item.url : item.thumbnail || "")}
                  alt={
                    item.type === "video"
                      ? item.title || "Video thumbnail"
                      : `${productName} ${idx + 1}`
                  }
                  fill
                  className="object-cover"
                  sizes="20vw"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl h-[90vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {currentMedia?.type === "image" ? (
              <div className="relative w-full h-full">
                <Image
                  src={getValidImageUrl(currentMedia.url)}
                  alt={productName}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            ) : currentMedia?.type === "video" && currentMedia.id !== undefined ? (
              <div className="w-full h-full flex items-center justify-center">
                {renderVideoEmbed(
                  currentMedia.url,
                  currentMedia.id,
                  videos.find((v) => v.id === currentMedia.id)?.type || "youtube"
                )}
              </div>
            ) : null}

            {/* Lightbox controls */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </Button>

            {mediaItems.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handlePrevious}
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedIndex + 1} / {mediaItems.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
