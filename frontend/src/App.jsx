import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import MyOrders from './pages/MyOrders'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* No Sidebar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Sidebar Layout (also sends logged-out visitors to /login) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payments/:orderId" element={<Payment />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
