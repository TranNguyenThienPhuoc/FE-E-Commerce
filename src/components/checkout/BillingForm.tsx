import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { checkoutSchema, type CheckoutFormValues } from '@/lib/schema/checkout.schema'

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
            <Label htmlFor={field.name} className="text-muted-foreground">First Name<span className="text-[#DB4444]">*</span></Label>
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
        name="companyName"
      >
        {(field: any) => (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-muted-foreground">Company Name</Label>
            <Input 
              id={field.name} 
              name={field.name} 
              value={field.state.value} 
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)} 
              className="bg-[#F5F5F5] border-none h-12"
            />
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
            <Label htmlFor={field.name} className="text-muted-foreground">Street Address<span className="text-[#DB4444]">*</span></Label>
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
        name="apartment"
      >
        {(field: any) => (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-muted-foreground">Apartment, floor, etc. (optional)</Label>
            <Input 
              id={field.name} 
              name={field.name} 
              value={field.state.value} 
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)} 
              className="bg-[#F5F5F5] border-none h-12"
            />
          </div>
        )}
      </form.Field>

      <form.Field
        name="townCity"
        validators={{
          onChange: ({ value }: any) => {
            const result = checkoutSchema.shape.townCity.safeParse(value)
            return result.success ? undefined : result.error.issues[0].message
          }
        }}
      >
        {(field: any) => (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-muted-foreground">Town/City<span className="text-[#DB4444]">*</span></Label>
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
            <Label htmlFor={field.name} className="text-muted-foreground">Phone Number<span className="text-[#DB4444]">*</span></Label>
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
            <Label htmlFor={field.name} className="text-muted-foreground">Email Address<span className="text-[#DB4444]">*</span></Label>
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

      <form.Field
        name="saveInfo"
      >
        {(field: any) => (
          <div className="flex items-center space-x-2 pt-4">
            <input 
              type="checkbox" 
              id={field.name} 
              name={field.name} 
              checked={field.state.value} 
              onChange={(e) => field.handleChange(e.target.checked)}
              className="w-5 h-5 accent-[#DB4444]"
            />
            <Label htmlFor={field.name} className="text-sm">Save this information for faster check-out next time</Label>
          </div>
        )}
      </form.Field>
    </div>
  )
}
