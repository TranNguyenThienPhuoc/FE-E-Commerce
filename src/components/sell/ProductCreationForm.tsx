import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  Check,
  Layers,
  Image as ImageIcon,
  Info
} from 'lucide-react'
import { useSeller } from '@/contexts/SellerContext'
import { categoryService } from '@/services/category.service'
import { productService } from '@/services/product.service'
import { Category } from '@/interfaces'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  stock: z.coerce.number().min(0, 'Stock must be positive'),
  attributes: z.array(z.object({
    key: z.string().min(1, 'Key required'),
    value: z.string().min(1, 'Value required')
  }))
})

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  stock: z.coerce.number().min(0, 'Stock must be positive'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  variants: z.array(variantSchema).optional()
})

type ProductFormValues = z.infer<typeof productSchema>

export function ProductCreationForm() {
  const { setActiveView, createProduct } = useSeller()
  const [step, setStep] = useState(1)
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      images: [],
      variants: []
    }
  })

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants'
  })

  const watchedImages = watch('images')
  const watchedVariants = watch('variants')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getCategories()
        if (res.success) setCategories(res.data)
      } catch (error) {
        console.error('Failed to fetch categories', error)
      }
    }
    fetchCategories()
  }, [])

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProductFormValues)[] = []
    if (step === 1) fieldsToValidate = ['name', 'description', 'category', 'price', 'stock']
    if (step === 2) fieldsToValidate = ['images']
    if (step === 3) fieldsToValidate = ['variants']
    
    const isValid = await trigger(fieldsToValidate)
    if (isValid) setStep(s => s + 1)
  }

  const prevStep = () => setStep(prev => prev - 1)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(file => productService.uploadImage(file))
      const urls = await Promise.all(uploadPromises)
      setValue('images', [...watchedImages, ...urls])
    } catch (error) {
      console.error('Upload failed', error)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...watchedImages]
    newImages.splice(index, 1)
    setValue('images', newImages)
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      // Format variants if they exist
      const formattedVariants = data.variants?.map((v: any) => {
        const attributes: Record<string, string> = {}
        v.attributes?.forEach((attr: any) => {
          if (attr.key && attr.value) {
            attributes[attr.key] = attr.value
          }
        })
        return {
          name: v.name,
          sku: v.sku,
          price: v.price,
          stock: v.stock,
          attributes
        }
      })

      // Create Product with variants in one go
      await createProduct({
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category: data.category,
        images: data.images,
        status: 'active',
        variants: formattedVariants && formattedVariants.length > 0 ? formattedVariants : undefined
      })

      setActiveView('products')
    } catch (error) {
      console.error('Submission failed', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step >= i ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'
              }`}>
                {step > i ? <Check className="h-5 w-5" /> : i}
              </div>
              {i < 4 && (
                <div className={`h-1 w-12 md:w-24 mx-2 ${step > i ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between px-2 text-xs font-medium text-muted-foreground">
          <span>Basic Info</span>
          <span>Media</span>
          <span>Variants</span>
          <span>Review</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the core details of your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...register('name')} placeholder="e.g. Wireless Headphones" />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register('description')} placeholder="Describe your product features..." />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message as string}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(val) => setValue('category', val)} defaultValue={watch('category')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price ($)</Label>
                  <Input id="price" type="number" step="0.01" {...register('price')} />
                  {errors.price && <p className="text-sm text-destructive">{errors.price.message as string}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Total Stock</Label>
                <Input id="stock" type="number" {...register('stock')} />
                {errors.stock && <p className="text-sm text-destructive">{errors.stock.message as string}</p>}
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button type="button" onClick={nextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
              <CardDescription>Upload high-quality images of your product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {watchedImages.map((url: string, index: number) => (
                  <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                    <img src={url} alt={`Product ${index}`} className="h-full w-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 cursor-pointer transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Upload Image</span>
                  <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              {uploading && <p className="text-sm text-center text-muted-foreground animate-pulse">Uploading images...</p>}
              {errors.images && <p className="text-sm text-destructive">{errors.images.message as string}</p>}
            </CardContent>
            <CardFooter className="justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={nextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Variants</CardTitle>
                  <CardDescription>Add variations like size, color, or material.</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => appendVariant({
                  name: '', sku: '', price: watch('price'), stock: 0, attributes: [{ key: '', value: '' }]
                })}>
                  <Plus className="h-4 w-4 mr-2" /> Add Variant
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {variantFields.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-muted-foreground">No variants added. This product will be sold as a single item.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {variantFields.map((field, index) => (
                    <Card key={field.id} className="bg-muted/30">
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">Variant #{index + 1}</h4>
                          <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeVariant(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Variant Name</Label>
                            <Input {...register(`variants.${index}.name`)} placeholder="e.g. Red / XL" />
                          </div>
                          <div className="space-y-2">
                            <Label>SKU</Label>
                            <Input {...register(`variants.${index}.sku`)} placeholder="SKU-001" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Price ($)</Label>
                            <Input type="number" step="0.01" {...register(`variants.${index}.price`)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Stock</Label>
                            <Input type="number" {...register(`variants.${index}.stock`)} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Attributes</Label>
                          <div className="flex gap-2">
                            <Input 
                              placeholder="Key (e.g. Color)" 
                              {...register(`variants.${index}.attributes.0.key`)}
                            />
                            <Input 
                              placeholder="Value (e.g. Red)" 
                              {...register(`variants.${index}.attributes.0.value`)}
                            />
                          </div>
                          {(errors.variants as any)?.[index]?.attributes && (
                            <p className="text-sm text-destructive">Attributes are required</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-between">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="button" onClick={nextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Publish</CardTitle>
              <CardDescription>Check everything before making your product live.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-6">
                <div className="h-32 w-32 rounded-lg border overflow-hidden shrink-0">
                  <img src={watchedImages[0]} alt="Preview" className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{watch('name')}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{watch('description')}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{categories.find(c => c.id === watch('category'))?.name}</Badge>
                    <Badge variant="outline">${watch('price')}</Badge>
                    <Badge variant="outline">{watch('stock')} in stock</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2" /> Media ({watchedImages.length})
                </h4>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {watchedImages.map((url: string, i: number) => (
                    <img key={i} src={url} className="h-16 w-16 rounded border object-cover" />
                  ))}
                </div>
              </div>

              {watchedVariants && watchedVariants.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Layers className="h-4 w-4 mr-2" /> Variants ({watchedVariants.length})
                  </h4>
                  <div className="space-y-2">
                    {watchedVariants?.map((v: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded border bg-muted/20 text-sm">
                        <span>{v.name} <span className="text-muted-foreground ml-2">({v.sku})</span></span>
                        <div className="flex gap-4">
                          <span>${v.price}</span>
                          <span className="font-medium">{v.stock} units</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground">
                  By publishing, your product will be visible to customers. You can always edit these details later in the inventory management section.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Product'}
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  )
}