// AI-ASSISTED: Cursor
// PROMPT: Migrate ProductsPage interactive elements to automation helpers
// ACCEPTED-BY: vignesh
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Button, TextField, Grid, Card, CardMedia, CardContent, CardActions,
  Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Autocomplete, Stack, IconButton, FormControl, InputLabel, Select,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useForm, Controller } from 'react-hook-form'
import { PageHeader, EmptyState } from '../../components/common/PageHeader'
import { addProduct, updateProduct, deleteProduct } from '../../store'
import { CATEGORIES } from '../../data/mockData'
import { aid, btn, iconBtn, field, select, option, input, dyn, optId } from '../../utils/automation'

export default function ProductsPage() {
  const dispatch = useDispatch()
  const products = useSelector((s) => s.data.products)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [preview, setPreview] = useState('')
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm()

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase()
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      const matchCat = categoryFilter.length === 0 || categoryFilter.includes(p.category)
      return matchSearch && matchCat
    })
  }, [products, search, categoryFilter])

  const openCreate = () => {
    setEditing(null)
    setPreview('')
    reset({ name: '', sku: '', category: 'Electronics', price: 0, stock: 0, status: 'active', description: '', tags: [] })
    setDialogOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setPreview(p.image)
    reset(p)
    setDialogOpen(true)
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setValue('image', url)
  }

  const onSave = (data) => {
    const payload = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      image: preview || data.image || 'https://picsum.photos/seed/new/200/200',
      tags: data.tags || [],
    }
    if (editing) dispatch(updateProduct({ ...editing, ...payload }))
    else dispatch(addProduct({ ...payload, id: String(Date.now()), createdAt: new Date().toISOString().slice(0, 10) }))
    setDialogOpen(false)
  }

  return (
    <Box {...aid('products-page')}>
      <PageHeader
        pageId="products"
        title="Product Management"
        subtitle="CRUD with categories, multi-select filters, file upload & image preview"
        breadcrumbs={['Products']}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} {...btn('products-add', 'Add Product')}>
            Add Product
          </Button>
        }
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          {...field('products-search')}
          sx={{ minWidth: 240 }}
        />
        <Autocomplete
          multiple
          options={CATEGORIES}
          value={categoryFilter}
          onChange={(_, v) => setCategoryFilter(v)}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Categories" {...field('products-category-filter')} />
          )}
          sx={{ minWidth: 280 }}
          {...aid('products-multi-select')}
        />
      </Stack>

      {filtered.length === 0 ? (
        <EmptyState title="No products found" />
      ) : (
        <Grid container spacing={2} {...aid('products-grid')}>
          {filtered.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card {...aid(dyn('product-card', p.id))} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="img" height="160" image={p.image} alt={p.name} {...aid(dyn('product-image', p.id))} />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>{p.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{p.sku} · {p.category}</Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>${p.price}</Typography>
                  <Stack direction="row" spacing={0.5} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                    <Chip label={`Stock: ${p.stock}`} size="small" />
                    <Chip label={p.status} size="small" color={p.status === 'active' ? 'success' : 'default'} />
                  </Stack>
                </CardContent>
                <CardActions>
                  <IconButton size="small" onClick={() => openEdit(p)} {...iconBtn(dyn('product-edit', p.id), 'Edit product')}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => dispatch(deleteProduct(p.id))} {...iconBtn(dyn('product-delete', p.id), 'Delete product')}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth {...aid('product-dialog')}>
        <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSave)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 2,
                    textAlign: 'center', minHeight: 200, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                  {...aid('product-image-preview')}
                >
                  {preview ? (
                    <Box component="img" src={preview} alt="Preview" sx={{ maxWidth: '100%', maxHeight: 180, borderRadius: 1 }} />
                  ) : (
                    <Typography color="text.secondary">Image Preview</Typography>
                  )}
                  <Button component="label" startIcon={<CloudUploadIcon />} sx={{ mt: 1 }} {...btn('product-upload-btn', 'Upload Image')}>
                    Upload Image
                    <input type="file" accept="image/*" hidden onChange={onFile} {...input('product-file-input')} />
                  </Button>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    fullWidth
                    {...field('product-form-name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {...register('name', { required: 'Required' })}
                  />
                  <TextField
                    label="SKU"
                    fullWidth
                    {...field('product-form-sku')}
                    {...register('sku', { required: 'Required' })}
                  />
                  <TextField
                    select
                    label="Category"
                    fullWidth
                    defaultValue="Electronics"
                    {...field('product-form-category')}
                    {...register('category')}
                  >
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c} {...option(optId('product-form-category', c), c)}>{c}</MenuItem>
                    ))}
                  </TextField>
                  <Stack direction="row" spacing={2}>
                    <TextField label="Price" type="number" fullWidth {...field('product-form-price')} {...register('price')} />
                    <TextField label="Stock" type="number" fullWidth {...field('product-form-stock')} {...register('stock')} />
                  </Stack>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      defaultValue="active"
                      {...select('product-form-status', 'status', 'Product status')}
                      {...register('status')}
                    >
                      <MenuItem value="active" {...option(optId('product-form-status', 'active'), 'Active')}>Active</MenuItem>
                      <MenuItem value="draft" {...option(optId('product-form-status', 'draft'), 'Draft')}>Draft</MenuItem>
                      <MenuItem value="out_of_stock" {...option(optId('product-form-status', 'out_of_stock'), 'Out of Stock')}>Out of Stock</MenuItem>
                    </Select>
                  </FormControl>
                  <Controller
                    name="tags"
                    control={control}
                    defaultValue={[]}
                    render={({ field: rhf }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={['featured', 'new', 'sale', 'popular']}
                        value={rhf.value || []}
                        onChange={(_, v) => rhf.onChange(v)}
                        renderInput={(params) => (
                          <TextField {...params} label="Tags" {...field('product-form-tags')} />
                        )}
                      />
                    )}
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    {...field('product-form-description')}
                    {...register('description')}
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} {...btn('product-form-cancel', 'Cancel')}>Cancel</Button>
            <Button type="submit" variant="contained" {...btn('product-form-save', 'Save')}>Save</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}
