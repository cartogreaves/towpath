import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';
import TowpathHomeButton from '../components/menu/TowpathHomeButton';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { initializeUser } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await axios.post('http://localhost:8000/auth/login', formData);
      localStorage.setItem('token', response.data.access_token);
      
      // Initialize user data right after successful login
      await initializeUser();
      
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <TowpathHomeButton />
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-white">
          Login to Towpath
        </h2>
        
        {error && (
          <div className="text-red-500 text-center bg-red-100/10 rounded-md py-2">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md shadow-sm p-2
                bg-gray-700 border-gray-600 text-white 
                placeholder-gray-400 focus:ring-blue-500 
                focus:border-blue-500"
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md shadow-sm p-2
                bg-gray-700 border-gray-600 text-white 
                placeholder-gray-400 focus:ring-blue-500 
                focus:border-blue-500"
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 
              border border-transparent rounded-md shadow-sm 
              text-sm font-medium text-white bg-blue-600 
              hover:bg-blue-700 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500
              focus:ring-offset-gray-800"
          >
            Sign in
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}