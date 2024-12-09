import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { UserContext } from '../../contexts/UserContext';

export default function AccountSettings() {
  const { avatar, setAvatar, username, setUsername } = useContext(UserContext);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState({
    email: false,
    username: false,
    password: false
  });
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData(prev => ({
        ...prev,
        email: response.data.email,
        username: response.data.username
      }));
      
      if (response.data.avatar) {
        setAvatar(response.data.avatar);
      }
      if (response.data.username) {
        setUsername(response.data.username);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load user data' });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEmojiSelect = async (emojiObject: any) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:8000/auth/update',
        { avatar: emojiObject.emoji },
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setAvatar(emojiObject.emoji);
      setShowEmojiPicker(false);
      setMessage({ type: 'success', text: 'Avatar updated successfully' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update avatar'
      });
    }
  };

  const handleSubmit = async (field: string) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = 'http://localhost:8000/auth/update';
      let data = {};

      switch (field) {
        case 'email':
          data = { email: formData.email };
          break;
        case 'username':
          data = { username: formData.username };
          break;
        case 'password':
          if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
          }
          data = {
            current_password: formData.currentPassword,
            new_password: formData.newPassword
          };
          break;
      }

      const response = await axios.put(
        endpoint,
        data,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }

      if (field === 'username') {
        setUsername(formData.username);
      }

      const successMessages = {
        email: 'Email updated successfully',
        username: 'Username updated successfully',
        password: 'Password changed successfully'
      };

      setMessage({ type: 'success', text: successMessages[field] });
      setIsEditing({ ...isEditing, [field]: false });
      
      if (field === 'password') {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
      
      await fetchUserData();
      
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || `Failed to update ${field}`
      });
    }
  };

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
        }`}>
          {message.text}
        </div>
      )}

      <div className="rounded-lg shadow bg-gray-800 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-4xl bg-transparent rounded-full p-2 transition-colors hover:bg-gray-700"
              aria-label="Change avatar emoji"
            >
              {avatar}
            </button>
            {showEmojiPicker && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <div className="rounded-lg shadow-lg bg-gray-800">
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    autoFocusSearch={false}
                    theme="dark"
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">
              Avatar
            </h3>
            <p className="text-sm text-gray-400">
              Click to select an emoji avatar
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Email
            </label>
            {isEditing.email ? (
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="flex-1 rounded-md border px-3 py-2 text-sm 
                    bg-gray-700 border-gray-600 text-white placeholder-gray-400 
                    focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => handleSubmit('email')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing({ ...isEditing, email: false });
                    fetchUserData();
                  }}
                  className="px-4 py-2 border border-gray-600 rounded-md text-sm 
                    hover:bg-gray-700 text-gray-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-white">{formData.email}</span>
                <button
                  onClick={() => setIsEditing({ ...isEditing, email: true })}
                  className="px-4 py-2 border border-gray-600 rounded-md text-sm 
                    hover:bg-gray-700 text-gray-200"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Username
            </label>
            {isEditing.username ? (
              <div className="flex space-x-2">
                <input
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  className="flex-1 rounded-md border px-3 py-2 text-sm 
                    bg-gray-700 border-gray-600 text-white placeholder-gray-400 
                    focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => handleSubmit('username')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing({ ...isEditing, username: false });
                    fetchUserData();
                  }}
                  className="px-4 py-2 border border-gray-600 rounded-md text-sm 
                    hover:bg-gray-700 text-gray-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-white">{formData.username}</span>
                <button
                  onClick={() => setIsEditing({ ...isEditing, username: true })}
                  className="px-4 py-2 border border-gray-600 rounded-md text-sm 
                    hover:bg-gray-700 text-gray-200"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Password
            </label>
            {isEditing.password ? (
              <div className="space-y-2">
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                  <input
                    key={field}
                    type="password"
                    placeholder={field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    value={formData[field as keyof typeof formData]}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full rounded-md border px-3 py-2 text-sm 
                      bg-gray-700 border-gray-600 text-white placeholder-gray-400 
                      focus:ring-blue-500 focus:border-blue-500"
                  />
                ))}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleSubmit('password')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Update Password
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing({ ...isEditing, password: false });
                      setFormData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }));
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-md text-sm 
                      hover:bg-gray-700 text-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-white">••••••••</span>
                <button
                  onClick={() => setIsEditing({ ...isEditing, password: true })}
                  className="px-4 py-2 border border-gray-600 rounded-md text-sm 
                    hover:bg-gray-700 text-gray-200"
                >
                  Change
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}