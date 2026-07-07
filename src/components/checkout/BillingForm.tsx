import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { checkoutSchema } from '@/lib/schema/checkout.schema'

interface BillingFormProps {
  form: any
}

export function BillingForm({ form }: BillingFormProps) {
  return (
    <div className="space-y-6">
      <form.Field
        name="firstName"
        validators={{
          onChange: ({ value }: any) => {
            const result = checkoutSchema.shape.firstName.safeParse(value)
            return result.success ? undefined : result.error.issues[0].message
          }
        }}
      >
        {(field: any) => (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-muted-foreground">Họ và tên<span className="text-[#DB4444]">*</span></Label>
            <Input 
              id={field.name} 
              name={field.name} 
              value={field.state.value} 
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)} 
              aria-invalid={field.state.meta.errors.length > 0}
              className="bg-[#F5F5F5] border-none h-12"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-[#DB4444]">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>
      

      <form.Field
        name="streetAddress"
        validators={{
          onChange: ({ value }: any) => {
            const result = checkoutSchema.shape.streetAddress.safeParse(value)
            return result.success ? undefined : result.error.issues[0].message
          }
        }}
      >
        {(field: any) => (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-muted-foreground">Địa chỉ<span className="text-[#DB4444]">*</span></Label>
            <Input 
              id={field.name} 
              name={field.name} 
              value={field.state.value} 
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)} 
              aria-invalid={field.state.meta.errors.length > 0}
              className="bg-[#F5F5F5] border-none h-12"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-[#DB4444]">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>


      <form.Field
        name="phoneNumber"
        validators={{
          onChange: ({ value }: any) => {
            const result = checkoutSchema.shape.phoneNumber.safeParse(value)
            return result.success ? undefined : result.error.issues[0].message
          }
        }}
      >
        {(field: any) => (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-muted-foreground">Số điện thoại<span className="text-[#DB4444]">*</span></Label>
            <Input 
              id={field.name} 
              name={field.name} 
              value={field.state.value} 
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)} 
              aria-invalid={field.state.meta.errors.length > 0}
              className="bg-[#F5F5F5] border-none h-12"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-[#DB4444]">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="emailAddress"
        validators={{
          onChange: ({ value }: any) => {
            const result = checkoutSchema.shape.emailAddress.safeParse(value)
            return result.success ? undefined : result.error.issues[0].message
          }
        }}
      >
        {(field: any) => (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-muted-foreground">Địa chỉ Email<span className="text-[#DB4444]">*</span></Label>
            <Input 
              id={field.name} 
              name={field.name} 
              type="email" 
              value={field.state.value} 
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)} 
              aria-invalid={field.state.meta.errors.length > 0}
              className="bg-[#F5F5F5] border-none h-12"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="text-xs text-[#DB4444]">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>
    </div>
  )
}
