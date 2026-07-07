import React, { useState } from 'react'
import { Plus, Search, Loader2, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useProducts, useUpdateProduct } from '@/hooks/useProducts'
import { Product } from '@/interfaces'
import { useToast } from '@/contexts/ToastContext'

export function FlashSalesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [flashSalePrice, setFlashSalePrice] = useState('')
  const [flashSaleEndDate, setFlashSaleEndDate] = useState('')

  const { data: productsData, isLoading, refetch } = useProducts({ 
    isFlashSale: true, 
    limit: 100 
  })
  const flashSaleProducts = productsData?.data || []

  const updateProductMutation = useUpdateProduct()
  const { showToast } = useToast()

  const handleRemoveFromFlashSale = async (product: Product) => {
    try {
      await updateProductMutation.mutateAsync({
        id: product.id,
        data: {
          isFlashSale: false,
          flashSalePrice: null,
          flashSaleEndDate: null,
        } as any
      })
      showToast({ title: 'Đã xóa khỏi Flash Sale', variant: 'success' })
      refetch()
    } catch (error) {
      showToast({ title: 'Lỗi khi xóa khỏi Flash Sale', variant: 'error' })
    }
  }

  const handleAddToFlashSale = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !flashSalePrice || !flashSaleEndDate) return

    try {
      await updateProductMutation.mutateAsync({
        id: selectedProduct.id,
        data: {
          isFlashSale: true,
          flashSalePrice: Number(flashSalePrice),
          flashSaleEndDate: new Date(flashSaleEndDate).toISOString(),
        } as any
      })
      showToast({ title: 'Thêm vào Flash Sale thành công', variant: 'success' })
      setIsAddModalOpen(false)
      setSelectedProduct(null)
      setFlashSalePrice('')
      setFlashSaleEndDate('')
      refetch()
    } catch (error) {
      showToast({ title: 'Lỗi khi thêm vào Flash Sale', variant: 'error' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Flash Sales</h2>
          <p className="text-muted-foreground">
            Quản lý các sản phẩm đang chạy Flash Sale
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm Sale
        </Button>
      </div>

      <div className="flex items-center w-full max-w-sm space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm sản phẩm sale..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Giá gốc</TableHead>
              <TableHead>Giá Sale</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : flashSaleProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  Không có sản phẩm nào đang Sale
                </TableCell>
              </TableRow>
            ) : (
              flashSaleProducts
                .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((product) => {
                  const endDate = new Date(product.flashSaleEndDate || '')
                  const isExpired = endDate < new Date()
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {product.images[0] && (
                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                          )}
                          <span>{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>${product.price.toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-red-500">
                        ${product.flashSalePrice?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {endDate.toLocaleString('vi-VN')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isExpired ? (
                          <Badge variant="destructive">Đã hết hạn</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                            Đang chạy
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFromFlashSale(product)}
                          disabled={updateProductMutation.isPending}
                        >
                          Gỡ bỏ
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm vào Flash Sale</DialogTitle>
            <DialogDescription>
              Tìm kiếm sản phẩm và thiết lập giá sale cùng thời gian kết thúc.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ProductSelectionForm
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
            {selectedProduct && (
              <form onSubmit={handleAddToFlashSale} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Giá Sale ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={flashSalePrice}
                    onChange={(e) => setFlashSalePrice(e.target.value)}
                    placeholder={`Giá gốc: $${selectedProduct.price}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thời gian kết thúc</Label>
                  <Input
                    type="datetime-local"
                    required
                    value={flashSaleEndDate}
                    onChange={(e) => setFlashSaleEndDate(e.target.value)}
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit" disabled={updateProductMutation.isPending}>
                    {updateProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Lưu cấu hình
                  </Button>
                </div>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProductSelectionForm({ 
  selectedProduct, 
  setSelectedProduct 
}: { 
  selectedProduct: Product | null, 
  setSelectedProduct: (p: Product) => void 
}) {
  const [search, setSearch] = useState('')
  const { data } = useProducts({ search: search || undefined, limit: 100 })
  const products = data?.data || []

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tìm sản phẩm</Label>
        <Input 
          placeholder="Nhập tên sản phẩm..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {products.length > 0 && !selectedProduct && (
        <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
          {products.map(p => (
            <div 
              key={p.id} 
              className="p-3 hover:bg-muted cursor-pointer flex justify-between items-center"
              onClick={() => setSelectedProduct(p)}
            >
              <span>{p.name}</span>
              <span className="text-muted-foreground">${p.price}</span>
            </div>
          ))}
        </div>
      )}
      {selectedProduct && (
        <div className="p-4 bg-muted/50 rounded-lg flex items-start gap-4">
          {selectedProduct.images[0] && (
            <img src={selectedProduct.images[0]} alt="" className="w-16 h-16 rounded object-cover" />
          )}
          <div className="flex-1">
            <h4 className="font-medium">{selectedProduct.name}</h4>
            <p className="text-sm text-muted-foreground">Giá gốc: ${selectedProduct.price}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null as any)}>
            Đổi
          </Button>
        </div>
      )}
    </div>
  )
}
