// AI-ASSISTED: Cursor
// PROMPT: Add ecommerce pageId for Automation Help on shop/cart/checkout
// ACCEPTED-BY: vignesh
import { useState } from 'react'
import { Routes, Route, Link as RouterLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button,
  IconButton, Stack, TextField, Stepper, Step, StepLabel, Paper, Divider,
  Radio, RadioGroup, FormControlLabel, Alert, Badge,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import DeleteIcon from '@mui/icons-material/Delete'
import { PageHeader } from '../../components/common/PageHeader'
import { ECOM_PRODUCTS } from '../../data/mockData'
import { addToCart, removeFromCart, updateQty, clearCart, toggleWishlist } from '../../store'
import { aid, btn, iconBtn, field, control } from '../../utils/automation'

function Shop() {
  const dispatch = useDispatch()
  const wishlist = useSelector((s) => s.cart.wishlist)

  return (
    <Box {...aid('ecommerce-shop')}>
      <PageHeader
        pageId="ecommerce"
        title="E-Commerce"
        subtitle="Cart, wishlist, checkout, address, payment"
        breadcrumbs={['E-Commerce']}
        actions={
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/ecommerce/wishlist" {...btn('goto-wishlist', 'Wishlist')}>Wishlist</Button>
            <Button component={RouterLink} to="/ecommerce/cart" variant="contained" {...btn('goto-cart', 'Cart')}>Cart</Button>
          </Stack>
        }
      />
      <Grid container spacing={2}>
        {ECOM_PRODUCTS.map((p) => {
          const wished = wishlist.some((w) => w.id === p.id)
          return (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card {...aid(`ecom-product-${p.id}`)}>
                <CardMedia component="img" height="160" image={p.image} alt={p.name} />
                <CardContent>
                  <Typography variant="subtitle1" noWrap fontWeight={600}>{p.name}</Typography>
                  <Typography color="primary" fontWeight={700}>${p.price}</Typography>
                  <Typography variant="caption">★ {p.rating} ({p.reviews} reviews)</Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color={wished ? 'error' : 'default'}
                    onClick={() => dispatch(toggleWishlist(p))}
                    {...iconBtn(`wishlist-toggle-${p.id}`, wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`)}
                  >
                    {wished ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Button
                    size="small"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => dispatch(addToCart(p))}
                    {...btn(`add-cart-${p.id}`, `Add ${p.name} to cart`)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector((s) => s.cart.items)
  const total = items.reduce((a, i) => a + i.price * i.qty, 0)

  return (
    <Box {...aid('cart-page')}>
      <PageHeader pageId="ecommerce" title="Shopping Cart" breadcrumbs={['E-Commerce', 'Cart']} />
      {items.length === 0 ? (
        <Alert severity="info" {...aid('cart-empty')}>
          Your cart is empty.{' '}
          <Button component={RouterLink} to="/ecommerce" {...btn('continue-shopping', 'Continue shopping')}>
            Continue shopping
          </Button>
        </Alert>
      ) : (
        <Paper sx={{ p: 2 }}>
          {items.map((item) => {
            const qtyField = field(`cart-qty-${item.id}`)
            return (
              <Stack key={item.id} direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }} {...aid(`cart-item-${item.id}`)}>
                <Box component="img" src={item.image} alt="" sx={{ width: 64, height: 64, borderRadius: 1 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography variant="body2">${item.price}</Typography>
                </Box>
                <TextField
                  type="number"
                  size="small"
                  value={item.qty}
                  onChange={(e) => dispatch(updateQty({ id: item.id, qty: Math.max(1, +e.target.value) }))}
                  sx={{ width: 80 }}
                  {...qtyField}
                  slotProps={{
                    htmlInput: {
                      ...qtyField.slotProps.htmlInput,
                      min: 1,
                    },
                  }}
                />
                <Typography sx={{ width: 80 }}>${(item.price * item.qty).toFixed(2)}</Typography>
                <IconButton
                  color="error"
                  onClick={() => dispatch(removeFromCart(item.id))}
                  {...iconBtn(`cart-remove-${item.id}`, `Remove ${item.name} from cart`)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            )
          })}
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" {...aid('cart-total')}>Total: ${total.toFixed(2)}</Typography>
            <Button variant="contained" onClick={() => navigate('/ecommerce/checkout')} {...btn('goto-checkout', 'Checkout')}>Checkout</Button>
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

function WishlistPage() {
  const dispatch = useDispatch()
  const wishlist = useSelector((s) => s.cart.wishlist)

  return (
    <Box {...aid('wishlist-page')}>
      <PageHeader pageId="ecommerce" title="Wishlist" breadcrumbs={['E-Commerce', 'Wishlist']} />
      {wishlist.length === 0 ? (
        <Alert {...aid('wishlist-empty')}>Wishlist is empty</Alert>
      ) : (
        <Grid container spacing={2}>
          {wishlist.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card {...aid(`wishlist-item-${p.id}`)}>
                <CardContent>
                  <Typography fontWeight={600}>{p.name}</Typography>
                  <Typography>${p.price}</Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => dispatch(addToCart(p))} {...btn(`wishlist-add-cart-${p.id}`, `Add ${p.name} to cart`)}>Add to Cart</Button>
                  <Button color="error" onClick={() => dispatch(toggleWishlist(p))} {...btn(`wishlist-remove-${p.id}`, `Remove ${p.name} from wishlist`)}>Remove</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector((s) => s.cart.items)
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState({ line1: '', city: '', zip: '', country: 'US' })
  const [payment, setPayment] = useState({ method: 'card', card: '', expiry: '', cvv: '' })
  const [done, setDone] = useState(false)
  const total = items.reduce((a, i) => a + i.price * i.qty, 0)

  const placeOrder = () => {
    setDone(true)
    dispatch(clearCart())
  }

  if (done) {
    return (
      <Box {...aid('checkout-success')}>
        <Alert severity="success" sx={{ mb: 2 }}>Order placed successfully!</Alert>
        <Button onClick={() => navigate('/ecommerce')} {...btn('back-to-shop', 'Back to Shop')}>Back to Shop</Button>
      </Box>
    )
  }

  return (
    <Box {...aid('checkout-page')}>
      <PageHeader pageId="ecommerce" title="Checkout" breadcrumbs={['E-Commerce', 'Checkout']} />
      <Stepper activeStep={step} sx={{ mb: 3 }} {...aid('checkout-stepper')}>
        <Step><StepLabel>Address</StepLabel></Step>
        <Step><StepLabel>Payment</StepLabel></Step>
        <Step><StepLabel>Review</StepLabel></Step>
      </Stepper>

      {step === 0 && (
        <Paper sx={{ p: 3, maxWidth: 480 }} {...aid('checkout-address')}>
          <Typography variant="h6" gutterBottom>Shipping Address</Typography>
          <Stack spacing={2}>
            <TextField label="Address Line" value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} {...field('address-line1')} />
            <TextField label="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} {...field('address-city')} />
            <TextField label="ZIP" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} {...field('address-zip')} />
            <TextField label="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} {...field('address-country')} />
            <Button variant="contained" disabled={!address.line1 || !address.city} onClick={() => setStep(1)} {...btn('address-next', 'Continue')}>Continue</Button>
          </Stack>
        </Paper>
      )}

      {step === 1 && (
        <Paper sx={{ p: 3, maxWidth: 480 }} {...aid('checkout-payment')}>
          <Typography variant="h6" gutterBottom>Payment</Typography>
          <RadioGroup value={payment.method} onChange={(e) => setPayment({ ...payment, method: e.target.value })} {...aid('payment-method')}>
            <FormControlLabel
              value="card"
              control={<Radio {...control('payment-card', 'method', 'Credit Card')} />}
              label="Credit Card"
              {...aid('payment-label-card')}
            />
            <FormControlLabel
              value="paypal"
              control={<Radio {...control('payment-paypal', 'method', 'PayPal')} />}
              label="PayPal"
              {...aid('payment-label-paypal')}
            />
            <FormControlLabel
              value="cod"
              control={<Radio {...control('payment-cod', 'method', 'Cash on Delivery')} />}
              label="Cash on Delivery"
              {...aid('payment-label-cod')}
            />
          </RadioGroup>
          {payment.method === 'card' && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField label="Card Number" value={payment.card} onChange={(e) => setPayment({ ...payment, card: e.target.value })} {...field('card-number')} placeholder="4242 4242 4242 4242" />
              <Stack direction="row" spacing={2}>
                <TextField label="Expiry" value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} {...field('card-expiry')} placeholder="12/28" />
                <TextField label="CVV" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} {...field('card-cvv')} />
              </Stack>
            </Stack>
          )}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button onClick={() => setStep(0)} {...btn('payment-back', 'Back')}>Back</Button>
            <Button variant="contained" onClick={() => setStep(2)} {...btn('payment-next', 'Continue')}>Continue</Button>
          </Stack>
        </Paper>
      )}

      {step === 2 && (
        <Paper sx={{ p: 3, maxWidth: 480 }} {...aid('checkout-review')}>
          <Typography variant="h6" gutterBottom>Review Order</Typography>
          <Typography variant="body2">Ship to: {address.line1}, {address.city} {address.zip}</Typography>
          <Typography variant="body2">Payment: {payment.method}</Typography>
          <Typography variant="h6" sx={{ my: 2 }} {...aid('checkout-total')}>Total: ${total.toFixed(2)}</Typography>
          <Stack direction="row" spacing={1}>
            <Button onClick={() => setStep(1)} {...btn('review-back', 'Back')}>Back</Button>
            <Button variant="contained" onClick={placeOrder} {...btn('place-order', 'Place Order')}>Place Order</Button>
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

export default function EcommercePage() {
  return (
    <Routes>
      <Route index element={<Shop />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="wishlist" element={<WishlistPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
    </Routes>
  )
}
