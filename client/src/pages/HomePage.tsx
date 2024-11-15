import ModelCard from "@/components/ModelCard";
import ModelCardSkeleton from "@/components/ModelCardSkeleton";
import { useModels } from "@/hooks/use-models";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { 
  Box, 
  Users, 
  Printer, 
  DollarSign,
  Gamepad,
  Cog,
  Paintbrush,
  Wrench
} from "lucide-react";

function HomePage() {
  const { models, isLoading } = useModels();

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative -mt-16 min-h-[600px] w-full overflow-hidden bg-gradient-to-b from-background to-primary/5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h20v20H0z\" fill=\"none\"%2F%3E%3Cpath d=\"M10 0l10 10-10 10L0 10z\" fill=\"%23ff4d0012\"%2F%3E%3C%2Fsvg%3E')",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="container relative h-full flex items-center">
          <div className="max-w-2xl space-y-6">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-4"
            >
              <Button 
                size="lg" 
                className="h-12 px-8 text-lg font-medium bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              >
                Start Exploring
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-card/50 backdrop-blur-sm">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Box, label: "Total Models", value: "10,000+" },
              { icon: Users, label: "Creators", value: "1,000+" },
              { icon: Printer, label: "Prints Completed", value: "50,000+" },
              { icon: DollarSign, label: "Trading Volume", value: "$2M+" },
            ].map(({ icon: Icon, label, value }, index) => (
              <motion.div 
                key={label} 
                className="flex flex-col items-center text-center gap-4 p-6 rounded-lg bg-background/50 border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Icon className="h-10 w-10 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold tracking-tight">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Gamepad, name: "Gaming" },
            { icon: Cog, name: "Mechanical" },
            { icon: Paintbrush, name: "Art" },
            { icon: Wrench, name: "Utility" },
          ].map(({ icon: Icon, name }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2">
                <CardContent className="p-8 flex flex-col items-center gap-4">
                  <Icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-semibold">{name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Collections */}
      <section className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Top Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ModelCardSkeleton key={i} />
              ))
            : models?.slice(0, 4).map((model, index) => (
                <motion.div 
                  key={model.id} 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="absolute -left-4 -top-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold z-10">
                    {index + 1}
                  </div>
                  <ModelCard model={model} />
                </motion.div>
              ))}
        </div>
      </section>

      {/* Notable Drops */}
      <section className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Notable Drops</h2>
        <ScrollArea className="w-full">
          <div className="flex space-x-6 pb-6">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-[300px] flex-none">
                    <ModelCardSkeleton />
                  </div>
                ))
              : models?.slice(0, 6).map((model, index) => (
                  <motion.div 
                    key={model.id} 
                    className="w-[300px] flex-none"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ModelCard model={model} />
                  </motion.div>
                ))}
          </div>
          <ScrollBar orientation="horizontal" className="bg-primary/10" />
        </ScrollArea>
      </section>

      {/* Activity Feed */}
      <section className="container pb-20">
        <h2 className="text-3xl font-bold tracking-tight mb-8">Recent Activity</h2>
        <div className="space-y-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="border-2">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-3 w-[150px]" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-[100px]" />
                  </CardContent>
                </Card>
              ))
            : models?.slice(0, 5).map((model) => (
                <Card key={model.id} className="border-2 hover:shadow-md transition-shadow">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Box className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{model.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Purchased by {model.creatorName}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${(model.price / 100).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
