import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Giỏ hàng trống</h2>
            <p className="text-muted-foreground mb-6">
              Hãy bắt đầu mua sắm và thêm sản phẩm vào giỏ hàng!
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
