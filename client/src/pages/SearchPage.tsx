import { useModels } from "@/hooks/use-models";
import ModelCard from "@/components/ModelCard";
import ModelCardSkeleton from "@/components/ModelCardSkeleton";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash-es";

function SearchPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1]);
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const { models, isLoading } = useModels();

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setLocation(`/search?q=${encodeURIComponent(term)}`);
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch]);

  const filteredModels = query
    ? models?.filter(
        (model) =>
          model.title.toLowerCase().includes(query.toLowerCase()) ||
          model.description.toLowerCase().includes(query.toLowerCase()) ||
          model.category.toLowerCase().includes(query.toLowerCase())
      )
    : models;

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <a href="/">
            <ChevronLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold">Search Models</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search models..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ModelCardSkeleton key={i} />)
        ) : filteredModels?.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-muted-foreground">No models found</p>
          </div>
        ) : (
          filteredModels?.map((model) => <ModelCard key={model.id} model={model} />)
        )}
      </div>
    </div>
  );
}

export default SearchPage;
