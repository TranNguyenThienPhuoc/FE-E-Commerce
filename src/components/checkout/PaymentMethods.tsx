import { Label } from '@/components/ui/label'

interface PaymentMethodsProps {
  form: any
}

export function PaymentMethods({ form }: PaymentMethodsProps) {
  return (
    <div className="space-y-4">
      <form.Field name="paymentMethod">
        {(field: any) => (
          <div className="space-y-4">
            <div className="flex items-start justify-between border rounded-md p-4">
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  id="payos" 
                  name={field.name} 
                  checked={field.state.value === 'payos'} 
                  onChange={() => field.handleChange('payos')}
                  className="w-5 h-5 accent-black mt-0.5"
                />
                <div className="flex flex-col">
                  <Label htmlFor="payos" className="font-medium text-base">PayOS</Label>
                  <span className="text-xs text-muted-foreground mt-1">VietQR - ATM - Visa - MasterCard — instant</span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 px-2 bg-blue-600 rounded flex items-center justify-center text-[10px] text-white font-bold tracking-wider">PayOS</div>
              </div>
            </div>
          </div>
        )}
      </form.Field>
    </div>
  )
}
