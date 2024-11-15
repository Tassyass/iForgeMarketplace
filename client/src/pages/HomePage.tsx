import ModelCard from "@/components/ModelCard";
import ModelCardSkeleton from "@/components/ModelCardSkeleton";
import { useModels } from "@/hooks/use-models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Gamepad, 
  Cog, 
  Paintbrush, 
  Wrench,
  SlidersHorizontal
} from "lucide-react";
import { useState } from "react";

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

function HomePage() {
  const { models, isLoading } = useModels();
  
  // Filtering and sorting states
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-16 min-h-[600px] w-full overflow-hidden bg-gradient-to-b from-background to-primary/5">
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h20v20H0z\" fill=\"none\"%2F%3E%3Cpath d=\"M10 0l10 10-10 10L0 10z\" fill=\"%23ff4d0012\"%2F%3E%3C%2Fsvg%3E')",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="container relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Discover, Create & Print Amazing 3D Models
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The world's first marketplace for direct 3D printing from talented creators
            </motion.p>
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                size="lg" 
                className="h-12 px-8 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              >
                Start Exploring
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section with Full Functionality */}
      <section className="container px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Browse Models</h2>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            className={`md:col-span-3 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {categories.map(({ icon: Icon, name, slug }) => (
                  <Button
                    key={slug}
                    variant={activeCategory === slug ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveCategory(activeCategory === slug ? null : slug)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Sort By</h3>
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
              <h3 className="text-lg font-semibold">Price Range</h3>
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
      </section>
    </div>
  );
}

export default HomePage;
