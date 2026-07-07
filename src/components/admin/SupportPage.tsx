
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useSupportTickets } from '@/hooks/useSupportTickets'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/contexts/ToastContext'

export function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const { tickets, isLoading, updateTicket, isUpdating } = useSupportTickets()
  const { showToast } = useToast()

  const filteredTickets = (tickets || []).filter(ticket => {
    const matchesSearch = 
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Mới</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-600">Đang xử lý</Badge>
      case 'resolved':
        return <Badge className="bg-green-600">Đã giải quyết</Badge>
      case 'closed':
        return <Badge variant="secondary">Đã đóng</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Khẩn cấp</Badge>
      case 'high':
        return <Badge className="bg-orange-600">Cao</Badge>
      case 'medium':
        return <Badge className="bg-yellow-600">Trung bình</Badge>
      case 'low':
        return <Badge variant="secondary">Thấp</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  const statusCounts = {
    open: (tickets || []).filter(t => t.status === 'open').length,
    inProgress: (tickets || []).filter(t => t.status === 'in-progress').length,
    resolved: (tickets || []).filter(t => t.status === 'resolved').length,
    closed: (tickets || []).filter(t => t.status === 'closed').length,
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateTicket({ id, data: { status: newStatus as any } })
      showToast({ variant: 'success', title: 'Cập nhật thành công', description: 'Trạng thái đã được lưu' })
    } catch (e) {
      showToast({ variant: 'error', title: 'Lỗi', description: 'Cập nhật thất bại' })
    }
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Trung tâm hỗ trợ</h2>
            <p className="text-muted-foreground">
              Quản lý và xử lý yêu cầu hỗ trợ từ khách hàng
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <CardTitle className="text-sm font-medium">Yêu cầu mới</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{statusCounts.open}</div>
              <p className="text-xs text-muted-foreground">
                Cần xử lý ngay
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm font-medium">Đang xử lý</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Đang giải quyết
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <CardTitle className="text-sm font-medium">Đã giải quyết</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.resolved}</div>
              <p className="text-xs text-muted-foreground">
                Hoàn thành
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-600" />
                <CardTitle className="text-sm font-medium">Đã đóng</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{statusCounts.closed}</div>
              <p className="text-xs text-muted-foreground">
                Không còn hoạt động
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Danh sách yêu cầu hỗ trợ</CardTitle>
                <CardDescription>
                  Tổng cộng {filteredTickets.length} yêu cầu
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    variant={selectedStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('all')}
                  >
                    Tất cả
                  </Button>
                  <Button
                    variant={selectedStatus === 'open' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('open')}
                  >
                    Mới
                  </Button>
                  <Button
                    variant={selectedStatus === 'in-progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStatus('in-progress')}
                  >
                    Đang xử lý
                  </Button>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm yêu cầu..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Độ ưu tiên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Không có yêu cầu hỗ trợ nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {ticket.customerName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{ticket.customerName}</div>
                          <div className="text-sm text-muted-foreground">{ticket.customerEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{ticket.subject}</div>
                      <div className="text-sm text-muted-foreground">#{ticket.id}</div>
                    </TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Xem chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{ticket.subject}</DialogTitle>
                            <DialogDescription>
                              Yêu cầu từ {ticket.customerName} • {ticket.id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Trạng thái</label>
                                <div className="mt-1">
                                  <Select 
                                    defaultValue={ticket.status}
                                    onValueChange={(val) => handleStatusChange(ticket.id, val)}
                                    disabled={isUpdating}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="open">Mới</SelectItem>
                                      <SelectItem value="in-progress">Đang xử lý</SelectItem>
                                      <SelectItem value="resolved">Đã giải quyết</SelectItem>
                                      <SelectItem value="closed">Đã đóng</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Độ ưu tiên</label>
                                <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Nội dung yêu cầu</label>
                              <p className="mt-1 text-sm text-muted-foreground">{ticket.message}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Thông tin khách hàng</label>
                              <div className="mt-1 flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {ticket.customerName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{ticket.customerName}</div>
                                  <div className="text-sm text-muted-foreground">{ticket.customerEmail}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Đóng</Button>
                            <Button onClick={() => showToast({ variant: 'default', title: 'Tính năng đang phát triển', description: 'Gửi email cho khách hàng sẽ sớm ra mắt!' })}>
                              Trả lời khách hàng
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

  )
}
