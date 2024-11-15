import { useUser } from "@/hooks/use-user";
import { useModels } from "@/hooks/use-models";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

// Analytics Chart Component
function AnalyticsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Analytics visualization coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}

// User Management Section
function UserManagement() {
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update user role');
      
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value) => updateUserRole(user.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Model Approval Section
function ModelApproval() {
  const { models, mutate } = useModels();
  const { toast } = useToast();

  const updateModelStatus = async (modelId: number, status: string, note: string) => {
    try {
      const response = await fetch(`/api/admin/models/${modelId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNote: note }),
      });

      if (!response.ok) throw new Error('Failed to update model status');
      
      toast({
        title: "Success",
        description: `Model ${status} successfully`,
      });
      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update model status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Approval</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models?.filter(m => m.status === 'pending').map((model) => (
              <TableRow key={model.id}>
                <TableCell>{model.title}</TableCell>
                <TableCell>{model.creatorName}</TableCell>
                <TableCell>{model.status}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => updateModelStatus(model.id, 'approved', '')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => updateModelStatus(model.id, 'rejected', 'Does not meet guidelines')}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Categories Management
function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error('Failed to add category');
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addCategory} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryDescription">Description</Label>
            <Input
              id="categoryDescription"
              value={newCategory.description}
              onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <Button type="submit">Add Category</Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category: any) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AdminPageContent() {
  const { user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="analytics" className="space-y-8">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AnalyticsChart />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="models">
          <ModelApproval />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AdminPage() {
  return (
    <ErrorBoundary>
      <AdminPageContent />
    </ErrorBoundary>
  );
}

export default AdminPage;
