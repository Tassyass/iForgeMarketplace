import { type Model } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Link href={`/model/${model.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <Card className="h-full cursor-pointer overflow-hidden group">
          <CardContent className="p-0">
            <div className="aspect-square relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <motion.img
                src={model.thumbnailUrl}
                alt={model.title}
                className="object-cover w-full h-full rounded-t-lg transform group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
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
            <p className="font-medium">${(model.price / 100).toFixed(2)}</p>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}
