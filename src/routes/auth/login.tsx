import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/auth.service'
import { emailSchema } from '@/lib/schema/auth.schema'

export const Route = createFileRoute("/auth/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { login, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const success = await login(value.email, value.password);
      setIsLoading(false);

      if (success) {
        // Use stored user from authService (cookie) to determine redirect
        const storedUser = authService.getStoredUser()
        if (storedUser?.role === 'admin') {
          navigate({ to: '/admin/products' })
        } else {
          navigate({ to: "/" });
        }
      }
    },
  });

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

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Log in to Social e-commerce
            </h1>
            <p className="text-gray-600">Enter your details below</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
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
                onChange: ({ value }) =>
                  value.length < 6
                    ? "Password must be at least 6 characters"
                    : undefined,
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

            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <div className="flex items-center justify-between gap-4">
              <Button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-12"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
              <a
                href="#forgot-password"
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Forget Password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
