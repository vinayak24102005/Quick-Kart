import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cancelOrder, getOrder } from '../api/ordersApi'
import { getErrorMessage } from '../api/apiClient'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { formatDate, formatPrice } from '../utils/format'

const METHOD_LABEL = { cod: 'Cash on delivery', card: 'Card', upi: 'UPI' }
const STEPS = ['placed', 'processing', 'shipped', 'delivered']

function OrderDetail() {
  const { id } = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getOrder(id).then(setOrder).catch((e) => setError(getErrorMessage(e, 'Could not load order')))
  }, [id])

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!order) return <Spinner />

  const canCancel = ['placed', 'processing'].includes(order.status)
  const canPay = order.paymentMethod !== 'cod' && order.paymentStatus === 'pending' && order.status !== 'cancelled'
  const a = order.shippingAddress

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return
    setBusy(true)
    try {
      setOrder(await cancelOrder(order._id))
      toast('Order cancelled')
    } catch (e) {
      toast(getErrorMessage(e), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <Link to="/my-orders" className="inline-flex items-center gap-1 text-sm text-sky-600 hover:underline">
        <ArrowLeft size={16} /> My orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-slate-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge value={order.status} />
          <StatusBadge value={order.paymentStatus} />
        </div>
      </div>

      {order.status !== 'cancelled' && (
        <ol className="mt-6 flex items-center">
          {STEPS.map((s, idx) => {
            const reached = STEPS.indexOf(order.status) >= idx
            return (
              <li key={s} className="flex-1 flex items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${reached ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{idx + 1}</span>
                  <span className="text-xs mt-1 capitalize text-slate-600">{s}</span>
                </div>
                {idx < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-4 ${STEPS.indexOf(order.status) > idx ? 'bg-sky-600' : 'bg-gray-200'}`} />}
              </li>
            )
          })}
        </ol>
      )}

      <div className="mt-6 grid md:grid-cols-3 gap-6">
        <ul className="md:col-span-2 bg-white border border-slate-200 rounded-xl divide-y">
          {order.items.map((i) => (
            <li key={i.product} className="flex items-center gap-4 p-4">
              <img src={i.image} alt={i.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${i.product}`} className="font-medium text-slate-800 hover:text-sky-600 line-clamp-1">{i.name}</Link>
                <p className="text-sm text-slate-500">{formatPrice(i.price)} × {i.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(i.price * i.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <h2 className="font-semibold text-slate-800 mb-2">Shipping to</h2>
            <p>{a.fullName}</p>
            <p className="text-slate-500">{a.street}, {a.city}, {a.state} {a.postalCode}</p>
            <p className="text-slate-500">{a.phone}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
            <h2 className="font-semibold text-slate-800 mb-2">Payment · {METHOD_LABEL[order.paymentMethod]}</h2>
            <dl className="space-y-1">
              <div className="flex justify-between"><dt className="text-slate-500">Items</dt><dd>{formatPrice(order.itemsTotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd>{order.shippingFee ? formatPrice(order.shippingFee) : 'Free'}</dd></div>
              <div className="flex justify-between border-t pt-2 font-bold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>
          </div>

          {canPay && (
            <Link to={`/payments/${order._id}`} className="block text-center w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 rounded-lg">
              Pay now
            </Link>
          )}
          {canCancel && (
            <button onClick={handleCancel} disabled={busy} className="w-full border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-60 font-medium py-2.5 rounded-lg">
              Cancel order
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
