import { Link, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Spinner from '../components/Spinner'
import { formatPrice, calcShipping, FREE_SHIPPING_THRESHOLD } from '../utils/format'

function Cart() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  if (loading && cart.items.length === 0) return <Spinner label="Loading your cart..." />

  if (cart.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Your cart is empty</h1>
        <p className="text-slate-500 mt-2">Add some products to get started.</p>
        <Link to="/" className="inline-block mt-5 bg-sky-500 hover:bg-sky-600 text-white font-medium px-5 py-2.5 rounded-lg">
          Browse products
        </Link>
      </div>
    )
  }

  const shipping = calcShipping(cart.total)

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear cart</button>
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <ul className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <li key={item._id} className="flex gap-4 bg-white border border-slate-200 rounded-xl p-4">
              <Link to={`/product/${item.product._id}`}>
                <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg bg-slate-100" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product._id}`} className="font-semibold text-slate-800 hover:text-sky-600 line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-sm text-slate-500">{formatPrice(item.price)} each</p>
                {item.quantity > item.product.stock && (
                  <p className="text-xs text-red-500 mt-1">Only {item.product.stock} in stock — please reduce the quantity</p>
                )}

                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      className="px-3 py-1 disabled:opacity-40"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      className="px-3 py-1 disabled:opacity-40"
                      disabled={item.quantity >= item.product.stock}
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product._id)} className="text-red-500 hover:text-red-600" aria-label="Remove item">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="font-bold text-slate-900">{formatPrice(item.totalPrice)}</p>
            </li>
          ))}
        </ul>

        <div className="bg-white border border-slate-200 rounded-xl p-5 h-fit">
          <h2 className="font-semibold text-slate-800">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Subtotal ({cart.itemCount} items)</dt><dd>{formatPrice(cart.total)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between border-t pt-3 text-base font-bold"><dt>Total</dt><dd>{formatPrice(cart.total + shipping)}</dd></div>
          </dl>
          {shipping > 0 && (
            <p className="text-xs text-slate-400 mt-2">Free shipping on orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}</p>
          )}
          <button
            onClick={() => navigate('/checkout')}
            disabled={cart.items.some((i) => i.quantity > i.product.stock)}
            className="mt-5 w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition shadow-md shadow-sky-100"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
