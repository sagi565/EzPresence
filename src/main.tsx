import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from '@auth/AuthProvider'
import { BrandProvider } from '@context/BrandContext'
import { UserProvider } from '@context/UserContext'
import { AppThemeProvider } from './theme/ThemeContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <BrandProvider>
          <AppThemeProvider>
            <App />
          </AppThemeProvider>
        </BrandProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
)