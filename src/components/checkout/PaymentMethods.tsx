import { Label } from '@/components/ui/label'
import { type CheckoutFormValues } from '@/lib/schema/checkout.schema'

interface PaymentMethodsProps {
  form: any
}

export function PaymentMethods({ form }: PaymentMethodsProps) {
  return (
    <div className="space-y-4">
      <form.Field
        name="paymentMethod"
      >
        {(field: any) => (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input 
                  type="radio" 
                  id="bank" 
                  name={field.name} 
                  checked={field.state.value === 'bank_transfer'} 
                  onChange={() => field.handleChange('bank_transfer')}
                  className="w-5 h-5 accent-black"
                />
                <Label htmlFor="bank">Bank</Label>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-[8px]">VNPAY</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input 
                type="radio" 
                id="cod" 
                name={field.name} 
                checked={field.state.value === 'cod'} 
                onChange={() => field.handleChange('cod')}
                className="w-5 h-5 accent-black"
              />
              <Label htmlFor="cod">Cash on delivery</Label>
            </div>
          </div>
        )}
      </form.Field>
    </div>
  )
}
