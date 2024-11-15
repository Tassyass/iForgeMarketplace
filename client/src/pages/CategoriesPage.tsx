import { useModels } from "@/hooks/use-models";
import ModelCard from "@/components/ModelCard";
import ModelCardSkeleton from "@/components/ModelCardSkeleton";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Gamepad, 
  Cog, 
  Paintbrush, 
  Wrench,
  ChevronLeft
} from "lucide-react";

const categories = [
  { icon: Gamepad, name: "Gaming", slug: "gaming" },
  { icon: Cog, name: "Mechanical", slug: "mechanical" },
  { icon: Paintbrush, name: "Art", slug: "art" },
  { icon: Wrench, name: "Utility", slug: "utility" },
];

function CategoriesPage() {
  const [location] = useLocation();
  const category = new URLSearchParams(location.split("?")[1]).get("category");
  const { models, isLoading } = useModels();

  const filteredModels = category
    ? models?.filter((model) => model.category.toLowerCase() === category.toLowerCase())
    : models;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <a href="/">
            <ChevronLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold">Browse Models</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(({ icon: Icon, name, slug }) => (
          <Button
            key={slug}
            variant={category === slug ? "default" : "outline"}
            className="h-auto py-8 flex flex-col gap-4"
            asChild
          >
            <a href={`/categories?category=${slug}`}>
              <Icon className="h-8 w-8" />
              <span>{name}</span>
            </a>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <ModelCardSkeleton key={i} />
          ))
        ) : filteredModels?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">No models found</p>
            <Button className="mt-4" asChild>
              <a href="/categories">Browse All Models</a>
            </Button>
          </div>
        ) : (
          filteredModels?.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;
