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

export function ModelPage() {
  const [, params] = useRoute("/model/:id");
  const { data: model, error } = useSWR<Model>(`/api/models/${params?.id}`);
  const { user } = useUser();
  const { toast } = useToast();
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    material: "PLA",
    color: "white",
    size: 100,
  });
  const [isOrdering, setIsOrdering] = useState(false);

  if (error) {
    return <div>Error loading model</div>;
  }

  if (!model) {
    return <div>Loading...</div>;
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
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: model.id,
          type: "purchase",
        }),
      });

      if (!response.ok) throw new Error("Purchase failed");

      toast({
        title: "Success!",
        description: "Model purchased successfully",
      });
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
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: model.id,
          type: "print",
          printOptions,
        }),
      });

      if (!response.ok) throw new Error("Print order failed");

      toast({
        title: "Success!",
        description: "Print order placed successfully",
      });
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <ModelViewer modelUrl={model.modelUrl} />
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{model.title}</CardTitle>
            <CardDescription>by {model.creatorName}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              ${(model.price / 100).toFixed(2)}
            </p>
            <p className="mt-4">{model.description}</p>
            <div className="flex gap-2 mt-4">
              <Badge>{model.category}</Badge>
              {model.directPrintEnabled && (
                <Badge variant="secondary">Direct Print Available</Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full"
              onClick={handlePurchase}
              disabled={!user}
            >
              Purchase Model
            </Button>

            {model.directPrintEnabled && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Order Print
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Print Options</DialogTitle>
                    <DialogDescription>
                      Configure your print specifications
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label>Material</label>
                      <Select
                        value={printOptions.material}
                        onValueChange={(value) =>
                          setPrintOptions({ ...printOptions, material: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PLA">PLA</SelectItem>
                          <SelectItem value="ABS">ABS</SelectItem>
                          <SelectItem value="PETG">PETG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label>Color</label>
                      <Select
                        value={printOptions.color}
                        onValueChange={(value) =>
                          setPrintOptions({ ...printOptions, color: value })
                        }
                      >
                        <SelectTrigger>
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

                    <div className="space-y-2">
                      <label>Size (%)</label>
                      <Select
                        value={printOptions.size.toString()}
                        onValueChange={(value) =>
                          setPrintOptions({
                            ...printOptions,
                            size: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger>
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

        <Card>
          <CardHeader>
            <CardTitle>Print Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Recommended Material</span>
              <span>PLA</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span>Print Time (approx)</span>
              <span>4-6 hours</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span>Support Required</span>
              <span>Minimal</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
