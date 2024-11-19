import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';
import TowpathHomeButton from '../components/menu/TowpathHomeButton';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();
  const { initializeUser } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/auth/register', {
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
      
      localStorage.setItem('token', response.data.access_token);
      
      // Initialize user data right after successful registration
      await initializeUser();
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <TowpathHomeButton />
      <div className={`max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`text-3xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Register for Towpath
        </h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {['email', 'username', 'password', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type={field.includes('password') ? 'password' : field}
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                className={`mt-1 block w-full rounded-md shadow-sm p-2
                  ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'}`}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}