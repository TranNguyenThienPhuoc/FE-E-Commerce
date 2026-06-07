import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, Eye, Loader2, CheckCircle } from 'lucide-react'
import { useState, useMemo, useEffect, useDeferredValue } from 'react'
import { useProducts, useDeleteProduct, useApproveProduct } from '@/hooks/useProducts'
import { useToast } from '@/contexts/ToastContext'
import { ProductForm } from '@/components/admin/ProductForm'
import { Product } from '@/interfaces'

export function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  
  const deferredSearchQuery = useDeferredValue(searchQuery)
  
  const { showToast } = useToast()
  const { data: productsData, isLoading, error, refetch } = useProducts()
  const deleteProductMutation = useDeleteProduct()
  const approveProductMutation = useApproveProduct()
  
  const products = productsData?.data || []
  
  const filteredProducts = useMemo(() => 
    products.filter(product =>
      product.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
      (product.category?.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ?? false)
    ),
    [products, deferredSearchQuery]
  )

  const handleAddProduct = () => {
    setSelectedProduct(undefined)
    setIsFormOpen(true)
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsViewOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsFormOpen(true)
  }

  const handleDeleteProduct = (id: string) => {
    setProductToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return
    
    try {
      await deleteProductMutation.mutateAsync(productToDelete)
      showToast({
        title: 'Thành công',
        description: 'Đã xóa sản phẩm',
        variant: 'success',
      })
    } catch (err) {
      showToast({
        title: 'Lỗi',
        description: 'Không thể xóa sản phẩm',
        variant: 'error',
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const handleApproveProduct = async (id: string) => {
    try {
      await approveProductMutation.mutateAsync(id)
      showToast({
        title: 'Thành công',
        description: 'Đã duyệt sản phẩm',
        variant: 'success',
      })
    } catch (err) {
      showToast({
        title: 'Lỗi',
        description: 'Không thể duyệt sản phẩm',
        variant: 'error',
      })
    }
  }
  
  const statistics = useMemo(() => {
    const lowStockCount = products.filter(p => {
      const total = p.variants && p.variants.length > 0
        ? p.variants.reduce((sum, v) => sum + v.stock, 0)
        : p.stock
      return total > 0 && total <= 20
    }).length
    
    const outOfStockCount = products.filter(p => {
      const total = p.variants && p.variants.length > 0
        ? p.variants.reduce((sum, v) => sum + v.stock, 0)
        : p.stock
      return total === 0
    }).length

    const pendingCount = products.filter(p => p.status === 'pending').length
    
    return {
      total: products.length,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      pending: pendingCount
    }
  }, [products])
  
  useEffect(() => {
    if (error) {
      showToast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách sản phẩm',
        variant: 'error',
      })
    }
  }, [error, showToast])

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý sản phẩm</h2>
            <p className="text-muted-foreground">
              Quản lý danh sách sản phẩm, giá cả và tồn kho
            </p>
          </div>
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Danh sách sản phẩm</CardTitle>
                <CardDescription>
                  {isLoading ? 'Đang tải...' : `Tổng cộng ${filteredProducts.length} sản phẩm${searchQuery !== deferredSearchQuery ? ' (đang tìm kiếm...)' : ''}`}
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? 'Không tìm thấy sản phẩm nào' : 'Chưa có sản phẩm nào'}
              </div>
            ) : (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const totalStock = product.variants && product.variants.length > 0
                    ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
                    : product.stock

                  const prices = product.variants && product.variants.length > 0
                    ? product.variants.map(v => v.price)
                    : [product.price]
                  const minPrice = Math.min(...prices)
                  const maxPrice = Math.max(...prices)
                  const priceDisplay = minPrice === maxPrice 
                    ? `${minPrice.toLocaleString('vi-VN')}₫`
                    : `${minPrice.toLocaleString('vi-VN')}₫ - ${maxPrice.toLocaleString('vi-VN')}₫`
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/150'}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category || 'N/A'}</TableCell>
                      <TableCell className="font-medium">{priceDisplay}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={totalStock > 50 ? 'default' : totalStock > 0 ? 'secondary' : 'destructive'}>
                            {totalStock} sp
                          </Badge>
                          {product.variants && product.variants.length > 0 && (
                            <span className="text-[10px] text-muted-foreground">
                              ({product.variants.length} phân loại)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{product.rating || 0}</span>
                          <span className="text-muted-foreground">({product.reviewCount || 0})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === 'active' ? 'default' : product.status === 'pending' ? 'secondary' : 'outline'}>
                          {product.status === 'active' ? 'Hoạt động' : product.status === 'pending' ? 'Chờ duyệt' : product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {product.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title="Duyệt sản phẩm"
                              onClick={() => handleApproveProduct(product.id)}
                              disabled={approveProductMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Chỉnh sửa"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            title="Xóa"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleteProductMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>


        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
              <DialogDescription>
                Nhập thông tin chi tiết cho sản phẩm của bạn.
              </DialogDescription>
            </DialogHeader>
            <ProductForm 
              initialData={selectedProduct} 
              onSuccess={() => {
                setIsFormOpen(false)
                refetch()
              }}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteProductMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  'Xác nhận xóa'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statistics.total}
              </div>
              <p className="text-xs text-muted-foreground">
                Sản phẩm trong hệ thống
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statistics.pending}
              </div>
              <p className="text-xs text-muted-foreground">
                Cần xem xét và phê duyệt
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sắp hết hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statistics.lowStock}
              </div>
              <p className="text-xs text-muted-foreground">
                Sản phẩm dưới 20 đơn vị
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hết hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : statistics.outOfStock}
              </div>
              <p className="text-xs text-muted-foreground">
                Sản phẩm không còn hàng
              </p>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
