import { useState, useEffect } from 'react'
import { 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowLeft,

  Layers,
  RefreshCw
} from 'lucide-react'
import { useSeller } from '@/contexts/SellerContext'
import { productService } from '@/services/product.service'
import { ProductVariant, CreateVariantRequest } from '@/interfaces'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export function VariantManagement() {
  const { 
    selectedProductId, 
    setSelectedProductId, 
    setActiveView, 
    products,
    createVariant,
    updateVariant,
    deleteVariant
  } = useSeller()

  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const product = products.find(p => p.id === selectedProductId)

  const [formData, setFormData] = useState<CreateVariantRequest>({
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    attributes: {}
  })

  const fetchVariants = async () => {
    if (!selectedProductId) return
    setIsLoading(true)
    try {
      const res = await productService.getVariants(selectedProductId)
      if (res.success && res.data) {
        setVariants(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch variants', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVariants()
  }, [selectedProductId])

  const handleBack = () => {
    setSelectedProductId(null)
    setActiveView('products')
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this variant?')) {
      await deleteVariant(id)
      fetchVariants()
    }
  }

  const openCreateDialog = () => {
    setEditingVariant(null)
    setFormData({
      name: '',
      sku: '',
      price: product?.price || 0,
      stock: 0,
      attributes: {}
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (variant: ProductVariant) => {
    setEditingVariant(variant)
    setFormData({
      name: variant.name,
      sku: variant.sku,
      price: variant.price,
      stock: variant.stock,
      attributes: variant.attributes
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProductId) return

    setIsSubmitting(true)
    try {
      if (editingVariant) {
        await updateVariant(editingVariant.id, {
          price: formData.price,
          stock: formData.stock,
          isActive: editingVariant.isActive
        })
      } else {
        await createVariant(selectedProductId, formData)
      }
      setIsDialogOpen(false)
      fetchVariants()
    } catch (error) {
      console.error('Failed to save variant', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-muted-foreground">Product not found</p>
        <Button onClick={handleBack}>Back to Products</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{product.name}</h2>
          <p className="text-muted-foreground">Manage variations for this product</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Variants</CardTitle>
            <CardDescription>
              {variants.length} variation{variants.length !== 1 ? 's' : ''} defined
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchVariants} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variant Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Attributes</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                    Loading variants...
                  </TableCell>
                </TableRow>
              ) : variants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No variants found. Add one to get started.</p>
                  </TableCell>
                </TableRow>
              ) : (
                variants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">{variant.name}</TableCell>
                    <TableCell className="font-mono text-xs">{variant.sku}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(variant.attributes).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>${variant.price.toFixed(2)}</TableCell>
                    <TableCell>{variant.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(variant)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(variant.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingVariant ? 'Edit Variant' : 'Create New Variant'}</DialogTitle>
              <DialogDescription>
                {editingVariant 
                  ? `Updating ${editingVariant.name}. You can only update price and stock for existing variants.` 
                  : 'Fill in the details for the product variation.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!editingVariant && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="v-name">Variant Name</Label>
                    <Input 
                      id="v-name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Blue / Large"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="v-sku">SKU</Label>
                    <Input 
                      id="v-sku" 
                      value={formData.sku} 
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      placeholder="SKU-001"
                      required
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="v-price">Price ($)</Label>
                  <Input 
                    id="v-price" 
                    type="number" 
                    step="0.01"
                    value={formData.price} 
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="v-stock">Stock</Label>
                  <Input 
                    id="v-stock" 
                    type="number" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>
              {!editingVariant && (
                <div className="grid gap-2">
                  <Label>Attributes (JSON format)</Label>
                  <Input 
                    placeholder='{"Color": "Blue", "Size": "L"}'
                    onChange={(e) => {
                      try {
                        const attrs = JSON.parse(e.target.value)
                        setFormData({...formData, attributes: attrs})
                      } catch (e) {
                        // Silent fail while typing
                      }
                    }}
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Enter attributes as a JSON object, e.g., {"{\"Color\": \"Red\"}"}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingVariant ? 'Update Variant' : 'Create Variant'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}