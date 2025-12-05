import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SettingsProvider from './Contexts/SettingsContext.jsx'
import MusicProvider from './Contexts/MusicContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider>
      <MusicProvider>
        <App />
      </MusicProvider>
    </SettingsProvider>
  </StrictMode>,
)
