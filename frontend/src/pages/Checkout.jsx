import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { createOrder } from '../api/ordersApi'
import { getProfile } from '../api/userApi'
import { getErrorMessage } from '../api/apiClient'
import Spinner from '../components/Spinner'
import { formatPrice, calcShipping } from '../utils/format'

const FIELDS = [
  ['fullName', 'Full name', 'col-span-2'],
  ['phone', 'Phone', 'col-span-2 sm:col-span-1'],
  ['postalCode', 'Postal code', 'col-span-2 sm:col-span-1'],
  ['street', 'Street address', 'col-span-2'],
  ['city', 'City', 'col-span-2 sm:col-span-1'],
  ['state', 'State', 'col-span-2 sm:col-span-1'],
]

const METHODS = [
  { id: 'cod', label: 'Cash on delivery', hint: 'Pay when your order arrives' },
  { id: 'card', label: 'Credit / Debit card', hint: 'Pay online (demo gateway)' },
  { id: 'upi', label: 'UPI', hint: 'Pay online (demo gateway)' },
]

function Checkout() {
  const { cart, loading, resetCart } = useCart()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'India' })
  const [method, setMethod] = useState('cod')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill with the address saved in Settings
  useEffect(() => {
    getProfile()
      .then((p) => setAddress((a) => ({ ...a, ...Object.fromEntries(Object.entries(p.address || {}).filter(([, v]) => v)) })))
      .catch(() => {})
  }, [])

  if (loading && cart.items.length === 0) return <Spinner />

  if (cart.items.length === 0 && !submitting) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Nothing to check out</h1>
        <Link to="/" className="inline-block mt-5 text-sky-600 hover:underline">Back to shop</Link>
      </div>
    )
  }

  const shipping = calcShipping(cart.total)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const order = await createOrder({ shippingAddress: address, paymentMethod: method })
      resetCart()
      toast('Order placed!')
      navigate(method === 'cod' ? `/my-orders/${order._id}` : `/payments/${order._id}`, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Shipping address</h2>
            <div className="grid grid-cols-2 gap-4">
              {FIELDS.map(([key, label, span]) => (
                <label key={key} className={`${span} block`}>
                  <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
                  <input
                    required
                    value={address[key]}
                    onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-800 mb-4">Payment method</h2>
            <div className="space-y-2">
              {METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer ${method === m.id ? 'border-sky-500 bg-sky-50' : 'border-gray-200'}`}
                >
                  <input type="radio" name="method" checked={method === m.id} onChange={() => setMethod(m.id)} />
                  <span>
                    <span className="block text-sm font-medium text-slate-800">{m.label}</span>
                    <span className="block text-xs text-slate-500">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 h-fit">
          <h2 className="font-semibold text-slate-800">Order summary</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {cart.items.map((i) => (
              <li key={i._id} className="flex justify-between gap-2">
                <span className="truncate">{i.product.name} × {i.quantity}</span>
                <span>{formatPrice(i.totalPrice)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm border-t pt-3">
            <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd>{formatPrice(cart.total)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between border-t pt-3 text-base font-bold"><dt>Total</dt><dd>{formatPrice(cart.total + shipping)}</dd></div>
          </dl>

          {error && <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition shadow-md shadow-sky-100"
          >
            {submitting ? 'Placing order...' : method === 'cod' ? 'Place order' : 'Place order & pay'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default Checkout
