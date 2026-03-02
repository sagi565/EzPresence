import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from '@auth/AuthProvider'
import { BrandProvider } from '@context/BrandContext'
import { UserProvider } from '@context/UserContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <BrandProvider>
          <App />
        </BrandProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
)