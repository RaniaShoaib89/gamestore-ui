import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import GamesPage from './pages/GamesPage'
import DesPage from './pages/DesPage'
import CartPage from './pages/CartPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/details/:id" element={<DesPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
