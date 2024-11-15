import { ModelCard } from "@/components/ModelCard";
import { useModels } from "@/hooks/use-models";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5">
          <div className="container h-full flex items-center">
            <div className="max-w-2xl space-y-4">
              <h1 className="text-5xl font-bold">
                Discover, Create & Print Amazing 3D Models
              </h1>
              <p className="text-xl text-muted-foreground">
                The world's first marketplace for direct 3D printing from talented creators
              </p>
              <Button size="lg" className="bg-primary text-white">
                Start Exploring
              </Button>
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
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
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
          ].map(({ icon: Icon, name }) => (
            <Card key={name} className="group cursor-pointer hover:shadow-lg transition-all">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <Icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold">{name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Collections */}
      <section className="container">
        <h2 className="text-2xl font-semibold mb-8">Top Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] rounded-xl" />
              ))
            : models?.slice(0, 4).map((model, index) => (
                <div key={model.id} className="relative">
                  <div className="absolute -left-4 -top-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <ModelCard model={model} />
                </div>
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
                  <Skeleton key={i} className="h-[300px] w-[300px] flex-none rounded-xl" />
                ))
              : models?.slice(0, 6).map((model) => (
                  <div key={model.id} className="w-[300px] flex-none">
                    <ModelCard model={model} />
                  </div>
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
                <Skeleton key={i} className="h-16 rounded-lg" />
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
