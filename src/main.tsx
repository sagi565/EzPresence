import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from '@auth/AuthProvider'
import { BrandProvider } from '@context/BrandContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <BrandProvider>
        <App />
      </BrandProvider>
    </AuthProvider>
  </React.StrictMode>,
)