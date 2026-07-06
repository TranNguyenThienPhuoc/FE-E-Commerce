import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Clock, Search, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/contexts/ToastContext'
import { apiClient } from '@/services/api'
import { User } from '@/interfaces'

export function SellersApprovalPage() {
  const [sellers, setSellers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { showToast } = useToast()

  const fetchSellers = async () => {
    setLoading(true)
    try {
      const res: any = await apiClient.get('/admin/sellers/pending?limit=100')
      if (res.success && res.data?.data) {
        setSellers(res.data.data)
      } else {
        showToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách người bán' })
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Lỗi', message: 'Lỗi kết nối' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSellers()
  }, [])

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    try {
      const res: any = await apiClient.post(`/admin/sellers/${id}/approve`, {})
      if (res.success) {
        showToast({ type: 'success', title: 'Thành công', message: 'Đã duyệt yêu cầu người bán' })
        setSellers(sellers.filter(s => s.id !== id))
      } else {
        showToast({ type: 'error', title: 'Lỗi', message: res.message || 'Không thể duyệt' })
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Lỗi', message: 'Lỗi kết nối' })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    try {
      const res: any = await apiClient.post(`/admin/sellers/${id}/reject`, {})
      if (res.success) {
        showToast({ type: 'success', title: 'Thành công', message: 'Đã từ chối yêu cầu người bán' })
        setSellers(sellers.filter(s => s.id !== id))
      } else {
        showToast({ type: 'error', title: 'Lỗi', message: res.message || 'Không thể từ chối' })
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Lỗi', message: 'Lỗi kết nối' })
    } finally {
      setProcessingId(null)
    }
  }

  const filteredSellers = sellers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.shopName && s.shopName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Duyệt Người Bán</h2>
          <p className="text-muted-foreground mt-2">
            Quản lý các yêu cầu đăng ký trở thành người bán
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu ({sellers.length})</CardTitle>
          <CardDescription>
            Xem và duyệt các thông tin cửa hàng mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tên, email, tên shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={fetchSellers} disabled={loading}>
              Làm mới
            </Button>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Tên Cửa Hàng</TableHead>
                  <TableHead>Địa Chỉ</TableHead>
                  <TableHead>Mô Tả</TableHead>
                  <TableHead>Ngày Đăng Ký</TableHead>
                  <TableHead className="text-right">Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : filteredSellers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Không có yêu cầu nào đang chờ duyệt
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <div className="font-medium">{seller.name}</div>
                        <div className="text-sm text-muted-foreground">{seller.email}</div>
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {seller.shopName || 'Không có tên'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={seller.shopAddress}>
                        {seller.shopAddress || 'N/A'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate" title={seller.shopDescription}>
                        {seller.shopDescription || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(seller.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"
                          onClick={() => handleReject(seller.id)}
                          disabled={processingId === seller.id}
                        >
                          Từ chối
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(seller.id)}
                          disabled={processingId === seller.id}
                        >
                          Duyệt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
