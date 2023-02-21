import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GoogleOAuthProvider clientId='870072489503-28hbupk1iscump8po398uqgpp8g4kl5r.apps.googleusercontent.com'>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
)