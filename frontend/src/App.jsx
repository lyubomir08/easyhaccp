import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <h1 className="text-4xl font-bold text-green-400">
          Tailwind работи
        </h1>
      </div>
    </>
  )
}

export default App