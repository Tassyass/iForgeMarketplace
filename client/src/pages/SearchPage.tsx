import { useModels } from "@/hooks/use-models";
import ModelCard from "@/components/ModelCard";
import ModelCardSkeleton from "@/components/ModelCardSkeleton";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash-es";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "@/hooks/use-search-params";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const { models, isLoading } = useModels();
  const [displayCount, setDisplayCount] = useState(12);
  const { ref: loadMoreRef, inView } = useInView();

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const newParams = new URLSearchParams();
      if (term) newParams.set("q", term);
      setSearchParams(newParams);
    }, 300),
    [setSearchParams]
  );

  useEffect(() => {
    if (searchTerm !== initialQuery) {
      debouncedSearch(searchTerm);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, initialQuery, debouncedSearch]);

  useEffect(() => {
    if (inView) {
      setDisplayCount((prev) => prev + 12);
    }
  }, [inView]);

  const filteredModels = searchTerm
    ? models?.filter(
        (model) =>
          model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : models;

  const displayedModels = filteredModels?.slice(0, displayCount);

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
            <Button className="mt-4" asChild>
              <a href="/categories">Browse All Models</a>
            </Button>
          </div>
        ) : (
          <>
            {displayedModels?.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
            {displayedModels?.length < (filteredModels?.length || 0) && (
              <div ref={loadMoreRef} className="col-span-full h-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
