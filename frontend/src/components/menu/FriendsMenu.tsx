import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, UserMinus, Check, X, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { useFriends } from '../../contexts/FriendsContext';

const FriendsMenu = ({ isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friendsData, setFriendsData] = useState({
    friends: [],
    pending_sent: [],
    pending_received: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const { refreshFriendBoats } = useFriends();


  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:8000/friends/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriendsData(response.data);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  useEffect(() => {
    if (isExpanded) {
      fetchFriends();
    }
  }, [isExpanded]);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/friends/search/${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter out users that we've already sent requests to
      const filteredResults = response.data.filter(user => 
        !friendsData.pending_sent.some(sent => sent.id === user.id) &&
        !friendsData.pending_received.some(received => received.id === user.id) &&
        !friendsData.friends.some(friend => friend.id === user.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Failed to search users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeoutId = setTimeout(() => {
      searchUsers(query);
    }, 300);
    
    setSearchTimeout(timeoutId);
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/friends/request', 
        { friend_id: friendId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Find the user from search results and create a pending request
      const user = searchResults.find(user => user.id === friendId);
      if (user) {
        setFriendsData(prev => ({
          ...prev,
          pending_sent: [...prev.pending_sent, {
            ...user,
            friendship_status: 'pending'
          }]
        }));
        // Remove user from search results
        setSearchResults(prev => prev.filter(u => u.id !== friendId));
      }
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const respondToRequest = async (friendshipId, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/friends/respond/${friendshipId}/${action}`, 
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      await fetchFriends();
      if (action === 'accept') {
        // Refresh friend boats immediately after accepting
        refreshFriendBoats();
      }
    } catch (error) {
      console.error('Failed to respond to friend request:', error);
    }
  };

  const removeFriend = async (friendshipId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/friends/${friendshipId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchFriends(); // Refresh the friends list
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between w-full px-4 py-2 text-sm
          ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          <span>Friends</span>
          {(friendsData.pending_received.length > 0) && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
              {friendsData.pending_received.length}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {isExpanded && (
        <div className="pl-4 pr-2">
          {/* Search Section */}
          <div className={`py-2 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearch}
                className={`w-full pl-8 pr-4 py-2 rounded-md text-sm
                  ${isDarkMode 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
              />
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className={`mt-2 rounded-md overflow-hidden max-h-32 overflow-y-auto
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                {isLoading ? (
                  <div className="p-2 text-center text-sm text-gray-500">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div key={user.id} className={`flex items-center justify-between p-2 
                      ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{user.avatar}</span>
                        <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.username}
                        </span>
                      </div>
                      <button
                        onClick={() => sendFriendRequest(user.id)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pending Requests Section */}
          {friendsData.pending_received.length > 0 && (
            <div className="py-2">
              <h3 className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Pending Requests ({friendsData.pending_received.length})
              </h3>
              <div className="max-h-32 overflow-y-auto">
                {friendsData.pending_received.map((request) => (
                  <div key={request.id} className={`flex items-center justify-between p-2 rounded-md
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{request.avatar}</span>
                      <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {request.username}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => respondToRequest(request.friendship_id, 'accept')}
                        className="text-green-500 hover:text-green-600"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => respondToRequest(request.friendship_id, 'reject')}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sent Requests Section */}
          {friendsData.pending_sent.length > 0 && (
            <div className="py-2">
              <h3 className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Sent Requests ({friendsData.pending_sent.length})
              </h3>
              <div className="max-h-32 overflow-y-auto">
                {friendsData.pending_sent.map((request) => (
                  <div key={request.id} className={`flex items-center justify-between p-2 rounded-md
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{request.avatar}</span>
                      <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {request.username}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Pending</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends List Section */}
          <div className="py-2">
            <h3 className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Friends ({friendsData.friends.length})
            </h3>
            <div className="max-h-48 overflow-y-auto">
              {friendsData.friends.length > 0 ? (
                friendsData.friends.map((friend) => (
                  <div key={friend.id} className={`flex items-center justify-between p-2 rounded-md
                    ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{friend.avatar}</span>
                      <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {friend.username}
                      </span>
                    </div>
                    <button
                      onClick={() => removeFriend(friend.friendship_id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className={`p-2 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No friends yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsMenu;