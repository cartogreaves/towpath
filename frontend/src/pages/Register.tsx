import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  const inputFields = [
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email'
    },
    {
      id: 'username',
      type: 'text',
      label: 'Username',
      placeholder: 'Choose a username'
    },
    {
      id: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Create a password'
    },
    {
      id: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      placeholder: 'Confirm your password'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <TowpathHomeButton />
      <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-lg bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-white">
          Register for Towpath
        </h2>
        
        {error && (
          <div className="text-red-500 text-center bg-red-100/10 rounded-md py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {inputFields.map((field) => (
            <div key={field.id}>
              <label 
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-200"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                value={formData[field.id as keyof typeof formData]}
                onChange={(e) => setFormData({
                  ...formData,
                  [field.id]: e.target.value
                })}
                className="mt-1 block w-full rounded-md shadow-sm p-2
                  bg-gray-700 border-gray-600 text-white 
                  placeholder-gray-400 focus:ring-blue-500 
                  focus:border-blue-500"
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 
              border border-transparent rounded-md shadow-sm 
              text-sm font-medium text-white bg-blue-600 
              hover:bg-blue-700 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500
              focus:ring-offset-gray-800"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}