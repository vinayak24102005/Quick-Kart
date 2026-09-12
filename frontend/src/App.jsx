import { useState } from 'react'

import Login from './pages/Login'
import Slidebar from './components/Slidebar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import {useAuth} from './context/AuthContext'

import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Payments from './pages/Payment'
import Settings from './pages/Settings'

function App() {
  const {isLoggedin} = useAuth();
  
  if(!isLoggedin) {
    return <Login/>
  }

  return (
    <>
      <BrowserRouter>
          <Slidebar/>

          <main className='ml-64'>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
      </BrowserRouter>
    </>
  )
}

export default App