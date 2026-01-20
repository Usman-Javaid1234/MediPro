'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Search, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts, useCategories } from '@/lib/api/hooks';
import { useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/lib/api/hooks/useAdmin';
import { Product } from '@/lib/api/types';
import { ProductCreate, ProductUpdate } from '@/lib/api/admin';

const AdminProducts = () => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductCreate>({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    original_price: undefined,
    category: '',
    subcategory: '',
    stock_quantity: 0,
    sku: '',
    images: [],
    thumbnail: '',
    is_active: true,
    is_featured: false,
  });

  // Fetch data
  const { data: productsData, isLoading, error, refetch } = useProducts({
    page,
    page_size: 20,
    search: searchQuery || undefined,
  });
  const { data: categoriesData } = useCategories({ is_active: true });

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const products = productsData?.items || [];
  const totalPages = productsData?.total_pages || 1;
  const categories = categoriesData?.items || [];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      short_description: '',
      price: 0,
      original_price: undefined,
      category: '',
      subcategory: '',
      stock_quantity: 0,
      sku: '',
      images: [],
      thumbnail: '',
      is_active: true,
      is_featured: false,
    });
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.description || !formData.category || formData.price <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createProduct.mutateAsync(formData);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: 'Product Added',
        description: `${formData.name} has been added successfully.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add product',
        variant: 'destructive',
      });
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    try {
      await updateProduct.mutateAsync({
        productId: editingProduct.id,
        data: formData as ProductUpdate,
      });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      toast({
        title: 'Product Updated',
        description: 'Product has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      await deleteProduct.mutateAsync(product.id);
      toast({
        title: 'Product Deleted',
        description: 'Product has been deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      short_description: product.short_description || '',
      price: product.price,
      original_price: product.original_price || undefined,
      category: product.category,
      subcategory: product.subcategory || '',
      stock_quantity: product.stock_quantity,
      sku: product.sku || '',
      images: product.images || [],
      thumbnail: product.thumbnail || '',
      is_active: product.is_active,
      is_featured: product.is_featured,
    });
    setIsEditDialogOpen(true);
  };

  const ProductForm = ({ onSubmit, isSubmitting }: { onSubmit: () => void; isSubmitting: boolean }) => (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div>
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter product name"
        />
      </div>
      
      <div>
        <Label htmlFor="short_description">Short Description</Label>
        <Input
          id="short_description"
          value={formData.short_description}
          onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
          placeholder="Brief product description"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Full Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detailed product description"
          rows={4}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (PKR) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="original_price">Original Price (Optional)</Label>
          <Input
            id="original_price"
            type="number"
            value={formData.original_price || ''}
            onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || undefined })}
            placeholder="For discounts"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock_quantity">Stock Quantity *</Label>
          <Input
            id="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Product SKU"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug || cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <Input
          id="thumbnail"
          value={formData.thumbnail}
          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="flex items-center justify-between">
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
          {editingProduct ? 'Save Changes' : 'Add Product'}
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
              <CardTitle>Products Management</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>Fill in the details to add a new product</DialogDescription>
                </DialogHeader>
                <ProductForm onSubmit={handleAddProduct} isSubmitting={createProduct.isPending} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-destructive">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Failed to load products
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products found
            </div>
          ) : (
            <>
              {/* Products Table */}
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                  No img
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.sku || 'No SKU'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>PKR {product.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={product.stock_quantity < 10 ? 'text-destructive font-medium' : ''}>
                            {product.stock_quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product)}
                              disabled={deleteProduct.isPending}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          <ProductForm onSubmit={handleEditProduct} isSubmitting={updateProduct.isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;