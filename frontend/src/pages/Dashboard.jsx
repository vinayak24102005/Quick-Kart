import { useCallback, useEffect, useState } from 'react'
import { getStats, getAllOrders, updateOrderStatus } from '../api/adminApi'
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../api/productsApi'
import { getErrorMessage } from '../api/apiClient'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/Spinner'
import StatusBadge from '../components/StatusBadge'
import { formatDate, formatPrice } from '../utils/format'

const TABS = ['overview', 'products', 'orders']
const STATUSES = ['placed', 'processing', 'shipped', 'delivered', 'cancelled']
const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100'

function Dashboard() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
      <div className="mt-4 flex gap-2 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize -mb-px border-b-2 ${tab === t ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === 'overview' && <Overview />}
        {tab === 'products' && <Products />}
        {tab === 'orders' && <Orders />}
      </div>
    </div>
  )
}

/* ---------------- Overview ---------------- */
function Overview() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getStats().then(setStats).catch((e) => setError(getErrorMessage(e)))
  }, [])

  if (error) return <p className="text-red-500">{error}</p>
  if (!stats) return <Spinner />

  const cards = [
    ['Revenue', formatPrice(stats.revenue)],
    ['Orders', stats.orders],
    ['Products', stats.products],
    ['Customers', stats.users],
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(([label, value]) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-xl p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Orders by status</h2>
          <ul className="space-y-2 text-sm">
            {STATUSES.map((s) => (
              <li key={s} className="flex items-center justify-between">
                <StatusBadge value={s} />
                <span className="font-medium">{stats.ordersByStatus[s] || 0}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Low stock (5 or fewer)</h2>
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-slate-500">All products are well stocked.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {stats.lowStock.map((p) => (
                <li key={p._id} className="flex justify-between">
                  <span>{p.name}</span>
                  <span className={p.stock === 0 ? 'text-red-500 font-medium' : 'text-amber-600 font-medium'}>{p.stock === 0 ? 'Out of stock' : `${p.stock} left`}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-4">
        <h2 className="font-semibold text-slate-800 mb-3">Recent orders</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="text-sm text-slate-500">No orders yet.</p>
        ) : (
          <ul className="divide-y text-sm">
            {stats.recentOrders.map((o) => (
              <li key={o._id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="font-medium">#{o._id.slice(-8).toUpperCase()}</span>
                <span className="text-slate-500">{o.user?.name || 'Deleted user'}</span>
                <StatusBadge value={o.status} />
                <span className="font-semibold">{formatPrice(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

/* ---------------- Products ---------------- */
const BLANK = { name: '', description: '', price: '', category: '', stock: '', image: '' }

function Products() {
  const { toast } = useToast()
  const [products, setProducts] = useState(null)
  const [form, setForm] = useState(null) // null = closed; object = add/edit form
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      // Admin view needs every product, so ask for the maximum page size
      const res = await getAllProducts({ limit: 100, sort: 'name' })
      setProducts(res.products)
    } catch (e) {
      toast(getErrorMessage(e), 'error')
    }
  }, [toast])

  useEffect(() => { load() }, [load])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock || 0) }
    delete payload._id
    try {
      if (form._id) await updateProduct(form._id, payload)
      else await createProduct(payload)
      toast(form._id ? 'Product updated' : 'Product added')
      setForm(null)
      load()
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return
    try {
      await deleteProduct(p._id)
      toast('Product deleted')
      load()
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    }
  }

  if (!products) return <Spinner />

  const field = (key, label, props = {}) => (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input className={inputCls} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} {...props} />
    </label>
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{products.length} products</p>
        <button onClick={() => setForm({ ...BLANK })} className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
          + Add product
        </button>
      </div>

      {form && (
        <form onSubmit={save} className="bg-white border border-sky-200 rounded-xl p-5 mb-6 grid sm:grid-cols-2 gap-4">
          <h2 className="sm:col-span-2 font-semibold text-slate-800">{form._id ? 'Edit product' : 'New product'}</h2>
          {field('name', 'Name', { required: true })}
          {field('category', 'Category')}
          {field('price', 'Price (₹)', { required: true, type: 'number', min: 0, step: '0.01' })}
          {field('stock', 'Stock', { type: 'number', min: 0, step: 1 })}
          <div className="sm:col-span-2">{field('image', 'Image URL')}</div>
          <label className="sm:col-span-2 block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Description</span>
            <textarea rows={3} className={inputCls} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="sm:col-span-2 flex gap-3">
            <button disabled={saving} className="bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => setForm(null)} className="text-sm text-slate-500 px-3">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3" /></tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="p-3 font-medium text-slate-800">{p.name}</td>
                <td className="p-3 text-slate-500">{p.category}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className={`p-3 ${p.stock <= 5 ? 'text-amber-600 font-medium' : ''}`}>{p.stock}</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => { setForm({ ...p }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="text-sky-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => remove(p)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------------- Orders ---------------- */
function Orders() {
  const { toast } = useToast()
  const [orders, setOrders] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setOrders(null)
    getAllOrders(filter).then(setOrders).catch((e) => toast(getErrorMessage(e), 'error'))
  }, [filter, toast])

  const changeStatus = async (order, status) => {
    try {
      const updated = await updateOrderStatus(order._id, status)
      setOrders((list) => list.map((o) => (o._id === updated._id ? updated : o)))
      toast('Order updated')
    } catch (err) {
      toast(getErrorMessage(err), 'error')
    }
  }

  return (
    <div>
      <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white mb-4">
        <option value="all">All statuses</option>
        {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
      </select>

      {!orders ? <Spinner /> : orders.length === 0 ? (
        <p className="text-slate-500 text-sm">No orders found.</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => {
                const locked = ['cancelled', 'delivered'].includes(o.status)
                return (
                  <tr key={o._id}>
                    <td className="p-3 font-medium">#{o._id.slice(-8).toUpperCase()}<div className="text-xs text-slate-400">{o.items.length} line items</div></td>
                    <td className="p-3">{o.user?.name || 'Deleted user'}<div className="text-xs text-slate-400">{o.user?.email}</div></td>
                    <td className="p-3 text-slate-500 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                    <td className="p-3 font-semibold">{formatPrice(o.total)}</td>
                    <td className="p-3"><span className="uppercase text-xs mr-1">{o.paymentMethod}</span><StatusBadge value={o.paymentStatus} /></td>
                    <td className="p-3">
                      <select
                        value={o.status}
                        disabled={locked}
                        onChange={(e) => changeStatus(o, e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white disabled:bg-gray-50 capitalize"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Dashboard
