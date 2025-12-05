import { createContext, use, useState } from "react"

export const MusicContext = createContext()

export const useMusic = () => use(MusicContext)

export default function MusicProvider({ children }) {
    const [playlist, setPlaylist] = useState([])
    const value = {
        playlist,
        setPlaylist
    }
    return (
        <MusicContext.Provider value={value}>
            {children}
        </MusicContext.Provider>
    )
}