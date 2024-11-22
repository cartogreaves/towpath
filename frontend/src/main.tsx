// src/main.tsx or src/index.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { UserProvider } from './contexts/UserContext'
import { BoatProvider } from './contexts/BoatContext'
import { FriendsProvider } from './contexts/FriendsContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <BoatProvider>
            <FriendsProvider>
              <App />
            </FriendsProvider>
          </BoatProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)