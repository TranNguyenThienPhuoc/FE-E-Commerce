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
import { Search, UserPlus, Eye, Mail, Loader2 } from 'lucide-react'
import { useState, useMemo, useDeferredValue, useEffect } from 'react'
import { useUsers } from '@/hooks/useUsers'
import { useToast } from '@/contexts/ToastContext'
import type { User } from '@/interfaces'

export function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)
  const [viewDetailOpen, setViewDetailOpen] = useState(false)
  const { showToast } = useToast()
  const deferredSearchQuery = useDeferredValue(searchQuery)
  
  const { data: usersData, isLoading, error } = useUsers()
  
  const users = usersData?.data || []
  const pagination = usersData?.pagination
  
  const customers = useMemo(() => 
    users.filter(user => user.role === 'customer'),
    [users]
  )

  const filteredCustomers = useMemo(() => 
    customers.filter(customer =>
      customer.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(deferredSearchQuery.toLowerCase())
    ),
    [customers, deferredSearchQuery]
  )
  
  // Show error toast if query fails
  useEffect(() => {
    if (error) {
      showToast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách khách hàng',
        variant: 'error',
      })
    }
  }, [error, showToast])

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý khách hàng</h2>
            <p className="text-muted-foreground">
              Xem và quản lý thông tin khách hàng
            </p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Thêm khách hàng
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm khách hàng mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin khách hàng để thêm vào hệ thống
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Họ và tên</label>
                  <Input placeholder="Nhập họ và tên" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="example@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Số điện thoại</label>
                  <Input type="tel" placeholder="0123456789" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Địa chỉ</label>
                  <Input placeholder="Nhập địa chỉ" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Hủy</Button>
                <Button>Thêm khách hàng</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : customers.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Khách hàng đã đăng ký
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  customers.filter(c => {
                    const createdDate = new Date(c.createdAt)
                    const thirtyDaysAgo = new Date()
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                    return createdDate >= thirtyDaysAgo
                  }).length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Trong 30 ngày qua
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Danh sách khách hàng</CardTitle>
                <CardDescription>
                  {isLoading ? 'Đang tải...' : `Tổng cộng ${pagination?.total || filteredCustomers.length} khách hàng${searchQuery !== deferredSearchQuery ? ' (đang tìm kiếm...)' : ''}`}
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm khách hàng..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? 'Không tìm thấy khách hàng nào' : 'Chưa có khách hàng nào'}
              </div>
            ) : (
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {customer.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {customer.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.role === 'admin' ? 'destructive' : 'default'}>
                        {customer.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(customer.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setViewDetailOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>

        {/* Customer Detail Dialog */}
        <Dialog open={viewDetailOpen} onOpenChange={setViewDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thông tin chi tiết khách hàng</DialogTitle>
              <DialogDescription>
                Xem thông tin đầy đủ của khách hàng
              </DialogDescription>
            </DialogHeader>
            {selectedCustomer && (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">
                      {selectedCustomer.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                    <p className="text-sm text-muted-foreground break-all">ID: {selectedCustomer.id}</p>
                    <Badge variant={selectedCustomer.role === 'admin' ? 'destructive' : 'default'} className="mt-2">
                      {selectedCustomer.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-sm break-all">{selectedCustomer.email}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Vai trò</p>
                        <p className="text-sm">{selectedCustomer.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Ngày tham gia</p>
                        <p className="text-sm">
                          {new Date(selectedCustomer.createdAt).toLocaleString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</p>
                        <p className="text-sm">
                          {new Date(selectedCustomer.updatedAt).toLocaleString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDetailOpen(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}
