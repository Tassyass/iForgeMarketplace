import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

const categories = [
  { name: "Gaming", value: "gaming" },
  { name: "Mechanical", value: "mechanical" },
  { name: "Art", value: "art" },
  { name: "Utility", value: "utility" },
];

function CreatePage() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    directPrintEnabled: false,
  });
  const [files, setFiles] = useState({
    model: null as File | null,
    thumbnail: null as File | null,
  });

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!files.model || !files.thumbnail) {
      toast({
        title: "Error",
        description: "Please upload both model and thumbnail files",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("description", formData.description);
      formPayload.append("price", formData.price);
      formPayload.append("category", formData.category);
      formPayload.append("directPrintEnabled", String(formData.directPrintEnabled));
      formPayload.append("model", files.model);
      formPayload.append("thumbnail", files.thumbnail);

      const response = await fetch("/api/models", {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error("Failed to create model");
      }

      toast({
        title: "Success",
        description: "Model created successfully",
      });
      setLocation("/profile");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "model" | "thumbnail"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
    }
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <a href="/">
            <ChevronLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold">Create New Model</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model File (GLB, GLTF, OBJ)</Label>
            <Input
              id="model"
              type="file"
              accept=".glb,.gltf,.obj"
              onChange={(e) => handleFileChange(e, "model")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail Image</Label>
            <Input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "thumbnail")}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="directPrint"
              checked={formData.directPrintEnabled}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, directPrintEnabled: checked }))
              }
            />
            <Label htmlFor="directPrint">Enable Direct Printing</Label>
          </div>
        </div>

        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Creating..." : "Create Model"}
        </Button>
      </form>
    </div>
  );
}

export default CreatePage;