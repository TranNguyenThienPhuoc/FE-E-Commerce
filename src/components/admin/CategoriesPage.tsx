import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { categoryService } from '@/services/category.service'
import { Category, CreateCategoryRequest } from '@/interfaces'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState<CreateCategoryRequest>({ name: '', description: '' })
  
  const { showToast } = useToast()

  const fetchCategories = async (currentPage: number) => {
    try {
      setIsLoading(true)
      const res = await categoryService.getCategories({ page: currentPage, limit: 10 })
      if (res.success) {
        setCategories(res.data)
        if (res.pagination) setPagination(res.pagination)
      } else {
        throw new Error('Failed')
      }
    } catch (err) {
      showToast({ title: 'Lỗi', description: 'Không thể tải danh sách danh mục', variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories(page)
  }, [page])

  const handleAdd = () => {
    setSelectedCategory(null)
    setFormData({ name: '', description: '' })
    setIsFormOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormData({ name: category.name, description: category.description || '' })
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setCategoryToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return
    setIsSubmitting(true)
    try {
      await categoryService.deleteCategory(categoryToDelete)
      showToast({ title: 'Thành công', description: 'Đã xóa danh mục', variant: 'success' })
      fetchCategories(page)
    } catch (err) {
      showToast({ title: 'Lỗi', description: 'Không thể xóa danh mục', variant: 'error' })
    } finally {
      setIsSubmitting(false)
      setIsDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }
  
  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (selectedCategory) {
        await categoryService.updateCategory(selectedCategory.id, formData)
        showToast({ title: 'Thành công', description: 'Đã cập nhật danh mục', variant: 'success' })
      } else {
        await categoryService.createCategory(formData)
        showToast({ title: 'Thành công', description: 'Đã thêm danh mục mới', variant: 'success' })
      }
      setIsFormOpen(false)
      fetchCategories(page)
    } catch (err) {
      showToast({ title: 'Lỗi', description: 'Thao tác thất bại', variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h2>
          <p className="text-muted-foreground">
            Quản lý các danh mục sản phẩm của hệ thống
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            {isLoading ? 'Đang tải...' : `Tổng cộng ${pagination.total} danh mục`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Chưa có danh mục nào</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Đường dẫn (Slug)</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>{cat.slug}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{cat.description}</TableCell>
                    <TableCell>{new Date(cat.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Hiển thị trang {pagination.page} trên tổng số {pagination.totalPages} trang
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1 || isLoading}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                >
                  Tiếp
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tên danh mục</label>
              <Input 
                required 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="Nhập tên danh mục..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mô tả</label>
              <Input 
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Nhập mô tả..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Hủy</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa danh mục này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Xác nhận xóa'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
