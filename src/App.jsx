import { useState } from 'react'
import './App.css'
import Catalogue from '@/components/Catalogue'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <Catalogue />
    </div>
  )
}

export default App
