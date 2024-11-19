// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Map from './pages/Map'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Map />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;