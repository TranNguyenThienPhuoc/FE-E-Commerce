import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CartErrorProps {
  error: string
  onRetry?: () => void
}

export function CartError({ error, onRetry }: CartErrorProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p>Lỗi khi tải giỏ hàng: {error}</p>
            <Button 
              className="mt-4" 
              onClick={onRetry || (() => window.location.reload())}
            >
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
