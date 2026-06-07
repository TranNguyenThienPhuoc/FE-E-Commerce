import { 
  RefreshCw,
  Search,
  Filter,
  Eye
} from 'lucide-react'
import { useSeller } from '@/contexts/SellerContext'
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function SellerOrders() {
  const { orders, isLoading, refreshOrders } = useSeller()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage your customer orders and fulfillment status.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshOrders} disabled={isLoading.orders}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading.orders ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="flex items-center gap-2 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders by ID or customer..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading.orders && orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id?.slice(0, 8)?.toUpperCase() || 'N/A'}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {typeof order.shippingAddress === 'string' 
                          ? order.shippingAddress.split(' | ')[0] 
                          : (order.shippingAddress as any)?.fullName || 'N/A'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {(order.customerId || (order as any).userId)?.slice(0, 6)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'delivered' ? 'default' : 
                      order.status === 'cancelled' ? 'destructive' : 
                      order.status === 'pending' ? 'outline' : 
                      'secondary'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs capitalize">{order.paymentStatus}</span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {(order.totalAmount || (order as any).total)?.toLocaleString('vi-VN')}₫
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
