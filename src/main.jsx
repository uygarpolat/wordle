import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { KeyboardContextProvider } from './Store/keyboard-context'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <KeyboardContextProvider>
    <App />
  </KeyboardContextProvider>
)
