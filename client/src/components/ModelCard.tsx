import { type Model } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Link href={`/model/${model.id}`}>
      <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="aspect-square relative">
            <img
              src={model.thumbnailUrl}
              alt={model.title}
              className="object-cover w-full h-full rounded-t-lg"
            />
            {model.directPrintEnabled && (
              <Badge className="absolute top-2 right-2">
                Direct Print Available
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 p-4">
          <h3 className="font-semibold">{model.title}</h3>
          <p className="text-sm text-muted-foreground">
            by {model.creatorName}
          </p>
          <p className="font-medium">${(model.price / 100).toFixed(2)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
