import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyOrders } from '../api/ordersApi'
import { getErrorMessage } from '../api/apiClient'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { formatDate, formatPrice } from '../utils/format'

function MyOrders() {
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyOrders().then(setOrders).catch((e) => setError(getErrorMessage(e, 'Could not load orders')))
  }, [])

  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!orders) return <Spinner label="Loading your orders..." />

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>

      {orders.length === 0 ? (
        <div className="mt-8 text-center text-slate-500">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="inline-block mt-4 text-sky-600 hover:underline">Start shopping</Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o._id}>
              <Link to={`/my-orders/${o._id}`} className="block bg-white border border-slate-200 hover:border-sky-300 rounded-xl p-4 transition">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">Order #{o._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-slate-500">{formatDate(o.createdAt)} · {o.items.reduce((n, i) => n + i.quantity, 0)} items</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={o.status} />
                    <StatusBadge value={o.paymentStatus} />
                  </div>
                  <p className="font-bold text-slate-900">{formatPrice(o.total)}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  {o.items.slice(0, 5).map((i) => (
                    <img key={i.product} src={i.image} alt={i.name} title={i.name} className="w-12 h-12 rounded-md object-cover bg-slate-100" />
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyOrders
