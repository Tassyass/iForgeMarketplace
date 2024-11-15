import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";
import { useState } from "react";
import { useRoute } from "wouter";
import { ModelViewer } from "@/components/ModelViewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Model, PrintOptions } from "@/lib/types";

function ModelPage() {
  const [, params] = useRoute("/model/:id");
  const { data: model, error, mutate } = useSWR<Model>(`/api/models/${params?.id}`);
  const { user } = useUser();
  const { toast } = useToast();
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    material: "PLA",
    color: "white",
    size: 100,
  });
  const [isOrdering, setIsOrdering] = useState(false);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">Error loading model</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase this model",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/models/${model.id}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Purchase failed");

      toast({
        title: "Success!",
        description: "Model purchased successfully",
      });
      
      // Refresh model data
      await mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process purchase",
        variant: "destructive",
      });
    }
  };

  const handlePrint = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to order prints",
        variant: "destructive",
      });
      return;
    }

    setIsOrdering(true);
    try {
      const response = await fetch(`/api/models/${model.id}/print`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ printOptions }),
      });

      if (!response.ok) throw new Error("Print order failed");

      toast({
        title: "Success!",
        description: "Print order placed successfully",
      });
      
      // Refresh model data
      await mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place print order",
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden shadow-lg bg-card">
          <ModelViewer modelUrl={model.modelUrl} />
        </div>

        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl font-bold">{model.title}</CardTitle>
              <CardDescription className="text-base">
                by {model.creatorName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-2xl font-bold text-primary">
                ${(model.price / 100).toFixed(2)}
              </p>
              <p className="text-base leading-relaxed">{model.description}</p>
              <div className="flex flex-wrap gap-3">
                <Badge className="text-sm px-3 py-1">{model.category}</Badge>
                {model.directPrintEnabled && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    Direct Print Available
                  </Badge>
                )}
                {model.status && (
                  <Badge variant={model.status === 'active' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                    {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full h-12 text-lg font-semibold"
                onClick={handlePurchase}
                disabled={!user || model.status !== 'active'}
              >
                Purchase Model
              </Button>

              {model.directPrintEnabled && model.status === 'active' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-12 text-lg font-semibold">
                      Order Print
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] p-6">
                    <DialogHeader className="space-y-3">
                      <DialogTitle className="text-2xl">Print Options</DialogTitle>
                      <DialogDescription className="text-base">
                        Configure your print specifications
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Material</label>
                        <Select
                          value={printOptions.material}
                          onValueChange={(value: any) =>
                            setPrintOptions((prev) => ({ ...prev, material: value }))
                          }
                        >
                          <SelectTrigger className="w-full h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PLA">PLA</SelectItem>
                            <SelectItem value="ABS">ABS</SelectItem>
                            <SelectItem value="PETG">PETG</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium">Color</label>
                        <Select
                          value={printOptions.color}
                          onValueChange={(value: any) =>
                            setPrintOptions((prev) => ({ ...prev, color: value }))
                          }
                        >
                          <SelectTrigger className="w-full h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="white">White</SelectItem>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="gray">Gray</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="blue">Blue</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium">Size (%)</label>
                        <Select
                          value={printOptions.size.toString()}
                          onValueChange={(value) =>
                            setPrintOptions((prev) => ({
                              ...prev,
                              size: parseInt(value),
                            }))
                          }
                        >
                          <SelectTrigger className="w-full h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50">50%</SelectItem>
                            <SelectItem value="100">100%</SelectItem>
                            <SelectItem value="150">150%</SelectItem>
                            <SelectItem value="200">200%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        className="w-full h-11 text-lg font-semibold"
                        onClick={handlePrint}
                        disabled={isOrdering || !user}
                      >
                        {isOrdering ? "Processing..." : "Place Print Order"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">Print Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">File Format</span>
                <span className="text-sm">{model.fileFormat?.toUpperCase() || 'GLB'}</span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">File Size</span>
                <span className="text-sm">
                  {model.fileSize 
                    ? `${(model.fileSize / (1024 * 1024)).toFixed(2)} MB`
                    : 'N/A'}
                </span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Polygon Count</span>
                <span className="text-sm">
                  {model.polygonCount?.toLocaleString() || 'N/A'}
                </span>
              </div>
              <Separator className="bg-border/50" />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm">
                  {model.lastModified 
                    ? new Date(model.lastModified).toLocaleDateString()
                    : new Date(model.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ModelPage;
