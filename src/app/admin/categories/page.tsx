'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, Loader2, AlertTriangle, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/lib/api/hooks';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/lib/api/hooks/useAdmin';
import { Category } from '@/lib/api/types';
import { CategoryCreate, CategoryUpdate } from '@/lib/api/admin';

const AdminCategories = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryCreate>({
    name: '',
    description: '',
    slug: '',
    image_url: '',
    is_active: true,
    is_featured: false,
    sort_order: 0,
  });

  // Fetch data
  const { data: categoriesData, isLoading, error } = useCategories({});
  
  // Mutations
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories = categoriesData?.items || [];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      slug: '',
      image_url: '',
      is_active: true,
      is_featured: false,
      sort_order: 0,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleAddCategory = async () => {
    if (!formData.name) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a category name',
        variant: 'destructive',
      });
      return;
    }

    const data = {
      ...formData,
      slug: formData.slug || generateSlug(formData.name),
    };

    try {
      await createCategory.mutateAsync(data);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: 'Category Added',
        description: `${formData.name} has been added successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add category',
        variant: 'destructive',
      });
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      await updateCategory.mutateAsync({
        categoryId: editingCategory.id,
        data: formData as CategoryUpdate,
      });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      resetForm();
      toast({
        title: 'Category Updated',
        description: 'Category has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    try {
      await deleteCategory.mutateAsync(category.id);
      toast({
        title: 'Category Deleted',
        description: 'Category has been deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete category. It may have products.',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug || '',
      image_url: category.image_url || '',
      is_active: category.is_active,
      is_featured: category.is_featured,
      sort_order: category.sort_order || 0,
    });
    setIsEditDialogOpen(true);
  };

  const CategoryForm = ({ onSubmit, isSubmitting }: { onSubmit: () => void; isSubmitting: boolean }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData({ 
              ...formData, 
              name: e.target.value,
              slug: formData.slug || generateSlug(e.target.value)
            });
          }}
          placeholder="Enter category name"
        />
      </div>
      
      <div>
        <Label htmlFor="slug">Slug (URL-friendly name)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="category-slug"
        />
        <p className="text-xs text-muted-foreground mt-1">Leave empty to auto-generate from name</p>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter category description"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div>
        <Label htmlFor="sort_order">Sort Order</Label>
        <Input
          id="sort_order"
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
          placeholder="0"
        />
        <p className="text-xs text-muted-foreground mt-1">Lower numbers appear first</p>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="is_featured"
            checked={formData.is_featured}
            onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
          />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {editingCategory ? 'Save Changes' : 'Add Category'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Categories Management</CardTitle>
              <CardDescription>Organize your products into categories</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>Create a new product category</DialogDescription>
                </DialogHeader>
                <CategoryForm onSubmit={handleAddCategory} isSubmitting={createCategory.isPending} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Failed to load categories
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No categories yet. Create your first category!</p>
            </div>
          ) : (
            <>
              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {categories.map((category) => (
                  <Card key={category.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {category.image_url ? (
                            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Layers className="h-6 w-6 text-primary" />
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {category.product_count || 0} products
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteCategory(category)}
                            disabled={deleteCategory.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description || 'No description'}
                      </p>
                      <div className="flex gap-2 mt-3">
                        {category.is_active ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                        {category.is_featured && (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Categories Table */}
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                        <TableCell>{category.product_count || 0}</TableCell>
                        <TableCell>{category.sort_order || 0}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            category.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {category.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCategory(category)}
                              disabled={deleteCategory.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>
          <CategoryForm onSubmit={handleEditCategory} isSubmitting={updateCategory.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;