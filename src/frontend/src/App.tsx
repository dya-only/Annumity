import { Route, Routes } from 'react-router-dom'
import './App.css'

import Index from './pages/index'
import Login from './pages/login'
import MyPage from './pages/mypage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Index />} />
      <Route path='/login' element={<Login />} />
      <Route path='/mypage' element={<MyPage />} />
    </Routes>
  )
}

export default App
