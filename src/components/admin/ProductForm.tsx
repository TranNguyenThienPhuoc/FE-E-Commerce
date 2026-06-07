import { useState, useRef, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productService } from '@/services/product.service'
import { useCategories } from '@/hooks/useCategories'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
  FieldContent,
} from '@/components/ui/field'
import { Loader2, Plus, X, Image as ImageIcon, Upload } from 'lucide-react'
import { productSchema, type ProductFormValues } from '@/lib/schema/product.schema'
import { Product } from '@/interfaces'

interface ProductFormProps {
  initialData?: Product
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useCategories()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = categoriesResponse?.data || []
  const isEdit = !!initialData

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      images: initialData?.images || [],
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price,
        stock: initialData.stock,
        images: initialData.images || [],
      })
    }
  }, [initialData, reset])

  const images = watch('images')

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
      setIsLoading(true)
      let response
      if (isEdit && initialData) {
        response = await productService.updateProduct(initialData.id, values)
      } else {
        response = await productService.createProduct(values)
      }

      if (response.success) {
        showToast({
          title: isEdit ? 'Product Updated' : 'Product Created',
          description: `Your product has been successfully ${isEdit ? 'updated' : 'created'}.`,
          variant: 'success',
        })
        if (!isEdit) reset()
        onSuccess?.()
      } else {
        showToast({
          title: isEdit ? 'Update Failed' : 'Creation Failed',
          description: response.message || `Failed to ${isEdit ? 'update' : 'create'} product.`,
          variant: 'error',
        })
      }
    } catch (error) {
      console.error(`Failed to ${isEdit ? 'update' : 'create'} product`, error)
      showToast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addImageUrl = (url: string) => {
    const currentImages = getValues('images') || []
    setValue('images', [...currentImages, url], { shouldValidate: true })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setIsUploading(true)
      const file = files[0]
      const key = await productService.uploadImage(file)
      addImageUrl(key)
      showToast({
        title: 'Upload Success',
        description: 'Image uploaded successfully.',
        variant: 'success',
      })
    } catch (error) {
      console.error('Upload failed:', error)
      showToast({
        title: 'Upload Failed',
        description: 'Failed to upload image.',
        variant: 'error',
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImageUrl = async (index: number) => {
    const currentImages = getValues('images') || []
    const imageUrl = currentImages[index]
    if (!imageUrl) return

    try {
      if (imageUrl.includes('social-commerce-s3')) {
        await productService.deleteImage(imageUrl)
      }
      setValue('images', currentImages.filter((_, i) => i !== index), { shouldValidate: true })
    } catch (error) {
      console.error('Failed to delete image:', error)
      showToast({
        title: 'Error',
        description: 'Failed to delete image from storage.',
        variant: 'error',
      })
      setValue('images', currentImages.filter((_, i) => i !== index), { shouldValidate: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {isEdit ? 'Edit Product' : 'Create New Product'}
        </h2>
        <p className="text-muted-foreground text-sm">
          {isEdit ? 'Update the details of your product.' : 'Fill in the details to list a new product in the store.'}
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>Product Name</FieldLabel>
          <FieldContent>
            <Input 
              placeholder="e.g. Organic Green Tea" 
              {...register('name')} 
              data-invalid={!!errors.name}
            />
            <FieldError errors={[errors.name]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <FieldContent>
            <Textarea 
              placeholder="Provide a detailed description of your product..." 
              className="min-h-[120px] resize-none" 
              {...register('description')}
              data-invalid={!!errors.description}
            />
            <FieldError errors={[errors.description]} />
          </FieldContent>
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <FieldLabel>Category</FieldLabel>
            <FieldContent>
              <Select 
                onValueChange={(value) => setValue('category', value, { shouldValidate: true })}
                value={watch('category')}
                disabled={isLoadingCategories}
              >
                <SelectTrigger data-invalid={!!errors.category}>
                  <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.category]} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Price ($)</FieldLabel>
            <FieldContent>
              <Input 
                type="number" 
                step="0.01" 
                min="0" 
                placeholder="0.00" 
                {...register('price', { valueAsNumber: true })}
                data-invalid={!!errors.price}
              />
              <FieldError errors={[errors.price]} />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Stock Quantity</FieldLabel>
          <FieldContent>
            <Input 
              type="number" 
              min="0" 
              placeholder="0" 
              {...register('stock', { valueAsNumber: true })}
              data-invalid={!!errors.stock}
            />
            <FieldError errors={[errors.stock]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Product Images</FieldLabel>
          <FieldContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Paste image URL..."
                    className="pl-9"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (imageUrlInput) {
                          addImageUrl(imageUrlInput)
                          setImageUrlInput('')
                        }
                      }
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => {
                      if (imageUrlInput) {
                        addImageUrl(imageUrlInput)
                        setImageUrlInput('')
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                  
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images?.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
                    <img 
                      src={url} 
                      alt={`Product preview ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {(!images || images.length === 0) && !isUploading && (
                  <div className="aspect-square rounded-md border border-dashed flex flex-col items-center justify-center text-muted-foreground text-xs p-2 text-center">
                    <ImageIcon className="h-8 w-8 mb-2 opacity-20" />
                    No images added
                  </div>
                )}
                {isUploading && (
                  <div className="aspect-square rounded-md border border-dashed flex flex-col items-center justify-center text-muted-foreground text-xs p-2 text-center bg-muted/50">
                    <Loader2 className="h-8 w-8 mb-2 animate-spin opacity-50" />
                    Uploading...
                  </div>
                )}
              </div>
              <FieldError errors={[errors.images]} />
            </div>
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-4 pt-6 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading || isUploading}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading || isUploading} className="min-w-[140px]">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEdit ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </form>
  )
}
