import { useModels } from "@/hooks/use-models";
import ModelCard from "@/components/ModelCard";
import ModelCardSkeleton from "@/components/ModelCardSkeleton";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gamepad, 
  Cog, 
  Paintbrush, 
  Wrench,
  ChevronLeft,
  SlidersHorizontal
} from "lucide-react";
import { useState, useEffect } from "react";

const categories = [
  { icon: Gamepad, name: "Gaming", slug: "gaming" },
  { icon: Cog, name: "Mechanical", slug: "mechanical" },
  { icon: Paintbrush, name: "Art", slug: "art" },
  { icon: Wrench, name: "Utility", slug: "utility" },
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
];

function CategoriesPage() {
  const [location] = useLocation();
  const selectedCategory = new URLSearchParams(location.split("?")[1]).get("category");
  const { models, isLoading } = useModels();
  
  // Filtering and sorting states
  const [activeCategory, setActiveCategory] = useState(selectedCategory);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  // Filter and sort logic
  const filteredAndSortedModels = models
    ?.filter((model) => {
      const matchesCategory = !activeCategory || model.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = !searchTerm || 
        model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriceRange = 
        model.price >= priceRange[0] * 100 && 
        model.price <= priceRange[1] * 100;
      
      return matchesCategory && matchesSearch && matchesPriceRange;
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "popular":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="/">
                <ChevronLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Browse Models</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Main content with sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            className={`md:col-span-3 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {categories.map(({ icon: Icon, name, slug }) => (
                  <Button
                    key={slug}
                    variant={activeCategory === slug ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveCategory(slug)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Sort By</h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Price Range</h2>
              <div className="space-y-6">
                <Slider
                  value={priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Models Grid */}
          <div className="md:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${sortBy}-${searchTerm}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <ModelCardSkeleton key={i} />
                  ))
                ) : filteredAndSortedModels?.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-muted-foreground">No models found</p>
                    <Button className="mt-6" onClick={() => {
                      setActiveCategory(null);
                      setSortBy("newest");
                      setPriceRange([0, 1000]);
                      setSearchTerm("");
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  filteredAndSortedModels?.map((model) => (
                    <motion.div
                      key={model.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ModelCard model={model} />
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
