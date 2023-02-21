import { Route, Routes } from 'react-router-dom'
import './App.css'

import Index from './pages/index'
import Login from './pages/login'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Index />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App
