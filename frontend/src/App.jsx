import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center content-center justify-center h-screen w-full">
      <h1 className='text-9xl'>Hello</h1>      
    </div>
  )
}

export default App
