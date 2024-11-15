import { useUser } from "@/hooks/use-user";
import { useModels } from "@/hooks/use-models";
import ModelCard from "@/components/ModelCard";
import ModelCardSkeleton from "@/components/ModelCardSkeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft } from "lucide-react";

function ProfilePage() {
  const { user } = useUser();
  const { models, isLoading } = useModels();

  if (!user) {
    return (
      <div className="container py-8">
        <p>Please login to view your profile</p>
      </div>
    );
  }

  const userModels = models?.filter((model) => model.creatorId === user.id);
  const purchasedModels = models?.filter((model) => model.purchasedBy?.includes(user.id));

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <a href="/">
            <ChevronLeft className="h-4 w-4" />
          </a>
        </Button>
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarFallback>
                {user.name?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-center">{user.name || user.email}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" asChild>
                <a href="/settings">Settings</a>
              </Button>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="created">
            <TabsList>
              <TabsTrigger value="created">Created Models</TabsTrigger>
              <TabsTrigger value="purchased">Purchased Models</TabsTrigger>
            </TabsList>
            <TabsContent value="created" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <ModelCardSkeleton key={i} />
                  ))
                ) : userModels?.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-muted-foreground">
                      You haven't created any models yet
                    </p>
                    <Button className="mt-4" asChild>
                      <a href="/create">Create Your First Model</a>
                    </Button>
                  </div>
                ) : (
                  userModels?.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="purchased" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <ModelCardSkeleton key={i} />
                  ))
                ) : purchasedModels?.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-muted-foreground">
                      You haven't purchased any models yet
                    </p>
                    <Button className="mt-4" asChild>
                      <a href="/categories">Browse Models</a>
                    </Button>
                  </div>
                ) : (
                  purchasedModels?.map((model) => (
                    <ModelCard key={model.id} model={model} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
