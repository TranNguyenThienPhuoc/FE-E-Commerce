import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, XCircle, Clock, Loader2, DollarSign } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/api'
import { useToast } from '@/contexts/ToastContext'

// API Types
interface Withdrawal {
  id: string;
  sellerId: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  note?: string;
  status: string;
  createdAt: string;
  processedAt?: string;
}

export function SettlementsPage() {
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  // Query pending withdrawals
  const { data: withdrawalsResponse, isLoading, error } = useQuery({
    queryKey: ['admin-withdrawals'],
    queryFn: () => apiClient.get<{ success: boolean; data: Withdrawal[] }>('/settlements/admin/withdrawals'),
  })

  // Mutations
  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.post<{ success: boolean }>(`/settlements/admin/withdrawals/${id}/approve`, {}),
    onSuccess: () => {
      showToast({ type: 'success', title: 'Thành công', message: 'Đã duyệt yêu cầu rút tiền' })
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] })
      setDialogOpen(false)
    },
    onError: (error: any) => {
      showToast({ type: 'error', title: 'Lỗi', message: error.message || 'Không thể duyệt yêu cầu' })
    }
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => 
      apiClient.post<{ success: boolean }>(`/settlements/admin/withdrawals/${id}/reject`, { note }),
    onSuccess: () => {
      showToast({ type: 'success', title: 'Thành công', message: 'Đã từ chối yêu cầu rút tiền' })
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] })
      setDialogOpen(false)
      setRejectNote('')
    },
    onError: (error: any) => {
      showToast({ type: 'error', title: 'Lỗi', message: error.message || 'Không thể từ chối yêu cầu' })
    }
  })

  const withdrawals = withdrawalsResponse?.data || []

  const handleOpenDialog = (withdrawal: Withdrawal, action: 'approve' | 'reject') => {
    setSelectedWithdrawal(withdrawal)
    setActionType(action)
    setRejectNote('')
    setDialogOpen(true)
  }

  const handleConfirm = () => {
    if (!selectedWithdrawal) return

    if (actionType === 'approve') {
      approveMutation.mutate(selectedWithdrawal.id)
    } else {
      if (!rejectNote.trim()) {
        showToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng nhập lý do từ chối' })
        return
      }
      rejectMutation.mutate({ id: selectedWithdrawal.id, note: rejectNote })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1"/> Đang chờ</Badge>
      case 'Approved':
      case 'Paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1"/> Đã duyệt</Badge>
      case 'Rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1"/> Từ chối</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
          <XCircle size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Không thể tải dữ liệu</h2>
        <p className="text-gray-500">Đã xảy ra lỗi khi lấy danh sách yêu cầu rút tiền.</p>
        <Button className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] })}>Thử lại</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thanh toán Seller</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các yêu cầu rút tiền từ ví của Người Bán (Sellers).
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chờ duyệt</CardTitle>
          <CardDescription>
            Các yêu cầu rút tiền đang chờ xử lý từ Người bán.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã Y/C</TableHead>
                  <TableHead>Mã Người bán</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Ngân hàng</TableHead>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                    </TableCell>
                  </TableRow>
                ) : withdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Không có yêu cầu rút tiền nào đang chờ duyệt.
                    </TableCell>
                  </TableRow>
                ) : (
                  withdrawals.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-xs">{item.id.substring(0, 8)}...</TableCell>
                      <TableCell className="text-xs">{item.sellerId.substring(0, 8)}...</TableCell>
                      <TableCell className="font-bold text-blue-600">{formatCurrency(item.amount)}</TableCell>
                      <TableCell>{item.bankName}</TableCell>
                      <TableCell>
                        <div className="font-medium">{item.bankAccount}</div>
                        <div className="text-xs text-gray-500">{item.accountHolder}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleOpenDialog(item, 'reject')}
                          >
                            Từ chối
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleOpenDialog(item, 'approve')}
                          >
                            Duyệt
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{actionType === 'approve' ? 'Duyệt yêu cầu rút tiền' : 'Từ chối yêu cầu rút tiền'}</DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'Xác nhận bạn đã chuyển tiền cho Seller và hệ thống sẽ trừ tiền trong ví của họ.'
                : 'Vui lòng cho biết lý do từ chối yêu cầu này. Tiền sẽ được hoàn lại vào ví khả dụng của Seller.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedWithdrawal && (
            <div className="py-4 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Số tiền:</span>
                  <span className="font-bold">{formatCurrency(selectedWithdrawal.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngân hàng:</span>
                  <span className="font-medium">{selectedWithdrawal.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số tài khoản:</span>
                  <span className="font-medium">{selectedWithdrawal.bankAccount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chủ tài khoản:</span>
                  <span className="font-medium">{selectedWithdrawal.accountHolder}</span>
                </div>
              </div>

              {actionType === 'reject' && (
                <div className="space-y-2">
                  <label htmlFor="note" className="text-sm font-medium">Lý do từ chối <span className="text-red-500">*</span></label>
                  <Textarea 
                    id="note" 
                    placeholder="VD: Sai thông tin ngân hàng..." 
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button 
              variant={actionType === 'approve' ? 'default' : 'destructive'} 
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={handleConfirm}
              disabled={approveMutation.isPending || rejectMutation.isPending}
            >
              {(approveMutation.isPending || rejectMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {actionType === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
