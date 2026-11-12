import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getOrder, payOrder } from '../api/ordersApi'
import { getErrorMessage } from '../api/apiClient'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'
import { formatPrice } from '../utils/format'

// Demo gateway: no real money moves and no card details are collected or stored.
function Payment() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    getOrder(orderId).then(setOrder).catch((e) => setError(getErrorMessage(e, 'Could not load order')))
  }, [orderId])

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!order) return <Spinner />

  const needsPayment = order.paymentMethod !== 'cod' && order.paymentStatus === 'pending' && order.status !== 'cancelled'

  const handlePay = async () => {
    setPaying(true)
    try {
      await payOrder(order._id)
      toast('Payment successful!')
      navigate(`/my-orders/${order._id}`, { replace: true })
    } catch (e) {
      toast(getErrorMessage(e), 'error')
      setPaying(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-lg">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Payment</h1>
        <p className="text-sm text-slate-500 mt-1">Order #{order._id.slice(-8).toUpperCase()}</p>

        <p className="text-4xl font-bold text-slate-900 mt-6">{formatPrice(order.total)}</p>
        <p className="text-sm text-slate-500 mt-1">via {order.paymentMethod === 'card' ? 'Credit / Debit card' : 'UPI'}</p>

        {needsPayment ? (
          <>
            <p className="mt-5 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Demo payment gateway — no real money is charged.
            </p>
            <button
              onClick={handlePay}
              disabled={paying}
              className="mt-5 w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition shadow-md shadow-sky-100"
            >
              {paying ? 'Processing...' : `Pay ${formatPrice(order.total)}`}
            </button>
            <Link to={`/my-orders/${order._id}`} className="block mt-3 text-sm text-slate-500 hover:underline">Pay later</Link>
          </>
        ) : (
          <>
            <p className="mt-5 text-sm text-slate-600">Nothing to pay for this order.</p>
            <Link to={`/my-orders/${order._id}`} className="inline-block mt-4 text-sky-600 hover:underline">View order</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default Payment
