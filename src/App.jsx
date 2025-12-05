import './App.css'
import Music from './components/Music'
import Settings from './components/Settings'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Playlist from './components/Playlist'
import Mood from './components/Mood'
import Loading from './components/Loading'
import { useSettings } from './Contexts/SettingsContext.jsx'

function App() {
  const { isSettingsOpen } = useSettings()

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Music />} />
        <Route path='/mood' element={<Mood />} />
        <Route path='/playlist' element={<Playlist />} />
        <Route path='/loading' element={<Loading />} />
      </Routes>
      
      {isSettingsOpen && <Settings />}
    </Router>

  )
}

export default App
