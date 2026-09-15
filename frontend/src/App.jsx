import { useState } from 'react'

import Login from './pages/Login'
import Slidebar from './components/Slidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payments from './pages/Payment'
import Settings from './pages/Settings'
import Register from './pages/register'
import Layout from './components/Layout'
import Home from './pages/Home'
import MyOrders from './pages/MyOrders'

function App() {
  

  return (
    <>
      <BrowserRouter>
          <Routes>
            {/* No Sidebar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Sidebar Layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App