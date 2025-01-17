import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import { BoatProvider } from './contexts/BoatContext'
import { FriendsProvider } from './contexts/FriendsContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <BoatProvider>
          <FriendsProvider>
            <App />
          </FriendsProvider>
        </BoatProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)