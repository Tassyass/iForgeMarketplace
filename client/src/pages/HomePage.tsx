import { ModelCard } from "@/components/ModelCard";
import { useModels } from "@/hooks/use-models";
import { Button } from "@/components/ui/button";

export function HomePage() {
  const { models, isLoading } = useModels();

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-12 bg-primary/5">
        <h1 className="text-4xl font-bold">Welcome to iForge Maker Store</h1>
        <p className="text-xl text-muted-foreground">
          Discover and print amazing 3D models from talented creators
        </p>
        <Button size="lg">Browse Models</Button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Featured Models</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {models?.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Figurines', 'Prototypes', 'Art', 'Utility'].map((category) => (
            <Button
              key={category}
              variant="outline"
              className="h-32 text-lg"
            >
              {category}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
