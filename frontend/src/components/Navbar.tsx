import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Towpath</h1>
        <button 
          onClick={handleLogout}
          className="text-white hover:text-gray-200"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}