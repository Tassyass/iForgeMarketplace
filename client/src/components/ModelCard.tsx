import { type Model } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ModelCardProps {
  model: Model;
}

function ModelCard({ model }: ModelCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const fallbackThumbnail = `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(model.title)}`;

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Link href={`/model/${model.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <Card 
          className="h-full cursor-pointer overflow-hidden group"
          role="article"
          aria-label={`${model.title} by ${model.creatorName}`}
        >
          <CardContent className="p-0">
            <div className="aspect-square relative">
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" 
                aria-hidden="true"
              />
              
              {/* Loading skeleton */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    className="absolute inset-0 bg-muted animate-pulse"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    aria-hidden="true"
                  />
                )}
              </AnimatePresence>

              {/* Main image with lazy loading */}
              <motion.img
                src={model.thumbnailUrl || fallbackThumbnail}
                alt={`3D model preview of ${model.title}`}
                className={`object-cover w-full h-full rounded-t-lg transform group-hover:scale-105 transition-transform duration-300 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Error fallback */}
              {hasError && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-muted/50"
                  role="alert"
                  aria-label="Failed to load image"
                >
                  <div className="text-center p-4">
                    <svg
                      className="w-10 h-10 mx-auto text-muted-foreground mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm text-muted-foreground">Failed to load image</p>
                  </div>
                </div>
              )}

              {model.directPrintEnabled && (
                <Badge 
                  className="absolute top-2 right-2 z-20 shadow-lg"
                  role="status"
                  aria-label="Direct print available"
                >
                  Direct Print Available
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 p-4 group-hover:bg-muted/50 transition-colors">
            <h3 className="font-semibold line-clamp-1" title={model.title}>
              {model.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              by {model.creatorName}
            </p>
            <p className="font-medium">
              <span className="sr-only">Price:</span>
              ${(model.price / 100).toFixed(2)}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}

export default ModelCard;
