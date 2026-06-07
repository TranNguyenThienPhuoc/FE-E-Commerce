import { useState } from 'react'
import { 
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  AlertCircle
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

export function SellerInventory() {
  const { inventory, isLoading, refreshInventory } = useSeller()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredInventory = inventory.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.variantSku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory Tracking</CardTitle>
            <CardDescription>Monitor stock levels, reserved items, and availability across variants.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshInventory} disabled={isLoading.inventory}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading.inventory ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="flex items-center gap-2 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by product name or SKU..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              <TableHead>Product / Variant</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-center">Total Stock</TableHead>
              <TableHead className="text-center">Reserved</TableHead>
              <TableHead className="text-center">Available</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading.inventory && inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                  Loading inventory data...
                </TableCell>
              </TableRow>
            ) : filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No inventory items found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.variantSku}</TableCell>
                  <TableCell className="text-center">{item.stock}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{item.reserved}</TableCell>
                  <TableCell className="text-center font-semibold">{item.available}</TableCell>
                  <TableCell>
                    <Badge variant={
                      item.status === 'in_stock' ? 'secondary' : 
                      item.status === 'low_stock' ? 'outline' : 
                      'destructive'
                    } className={item.status === 'low_stock' ? 'border-orange-500 text-orange-500' : ''}>
                      {item.status === 'low_stock' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Adjust
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
