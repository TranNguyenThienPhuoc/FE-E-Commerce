import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { nameSchema, emailSchema, passwordSchema } from '@/lib/schema/auth.schema'

export const Route = createFileRoute('/auth/register')({
  component: Register,
})

function Register() {
  const navigate = useNavigate()
  const { register, error: authError } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      setSuccessMessage(null)
      const success = await register(value.name, value.email, value.password)
      setIsLoading(false)
      
      if (success) {
        setSuccessMessage('Registration successful! Redirecting to login...')
        setTimeout(() => {
          navigate({ to: '/auth/login' })
        }, 2000)
      }
    },
  })

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md aspect-square flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop"
            alt="Shopping"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create an account
            </h1>
            <p className="text-gray-600">Enter your details below</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  const result = nameSchema.safeParse(value);
                  return result.success ? undefined : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-gray-700">
                    Name
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const result = emailSchema.safeParse(value);
                  return result.success ? undefined : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  const result = passwordSchema.safeParse(value);
                  return result.success ? undefined : result.error.issues[0].message;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {authError && (
              <p className="text-sm text-red-600">{authError}</p>
            )}
            
            {successMessage && (
              <p className="text-sm text-green-600">{successMessage}</p>
            )}

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <p className="text-center text-sm text-gray-600">
                Already have account?{' '}
                <Link
                  to="/auth/login"
                  className="text-gray-900 hover:underline font-medium"
                >
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
