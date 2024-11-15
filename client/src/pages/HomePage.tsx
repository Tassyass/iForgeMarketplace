import { ModelCard } from "@/components/ModelCard";
import { ModelCardSkeleton } from "@/components/ModelCardSkeleton";
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

export function HomePage() {
  const { models, isLoading } = useModels();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -mt-16 h-[500px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h20v20H0z\" fill=\"none\"%2F%3E%3Cpath d=\"M10 0l10 10-10 10L0 10z\" fill=\"%23ff4d0012\"%2F%3E%3C%2Fsvg%3E')",
            backgroundSize: "30px 30px",
          }}
        >
          <div className="container h-full flex items-center">
            <div className="max-w-2xl space-y-4">
              <motion.h1 
                className="text-5xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Discover, Create & Print Amazing 3D Models
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground"
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
              >
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:scale-105 transition-transform"
                >
                  Start Exploring
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-card">
        <div className="container py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Box, label: "Total Models", value: "10,000+" },
            { icon: Users, label: "Creators", value: "1,000+" },
            { icon: Printer, label: "Prints Completed", value: "50,000+" },
            { icon: DollarSign, label: "Trading Volume", value: "$2M+" },
          ].map(({ icon: Icon, label, value }, index) => (
            <motion.div 
              key={label} 
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container">
        <h2 className="text-2xl font-semibold mb-8">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center gap-4">
                  <Icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold">{name}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Collections */}
      <section className="container">
        <h2 className="text-2xl font-semibold mb-8">Top Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <div className="absolute -left-4 -top-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <ModelCard model={model} />
                </motion.div>
              ))}
        </div>
      </section>

      {/* Notable Drops */}
      <section className="container">
        <h2 className="text-2xl font-semibold mb-8">Notable Drops</h2>
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Activity Feed */}
      <section className="container pb-16">
        <h2 className="text-2xl font-semibold mb-8">Recent Activity</h2>
        <div className="space-y-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
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
                <Card key={model.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10" />
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
