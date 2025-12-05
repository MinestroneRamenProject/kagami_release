import { createContext, useContext, useState } from 'react';
import { REPEAT_MODE, THEME } from '../constants/constant';

export const SettingsContext = createContext()

export const useSettings = () => useContext(SettingsContext)

export default function SettingsProvider({ children }) {

    const [repeatMode, setRepeatMode] = useState(REPEAT_MODE.off)
    const [isShuffle, setIsShuffle] = useState(false)
    const [volume, setVolume] = useState(50)
    const [playSpeed, setPlaySpeed] = useState(1)
    const [theme, setTheme] = useState(THEME.default)
    // Control whether Settings modal is open
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    const openSettings = () => setIsSettingsOpen(true)
    const closeSettings = () => setIsSettingsOpen(false)

    function changeRepeatMode(){
        setRepeatMode((prev)=>{
            switch (prev) {
                case REPEAT_MODE.off:
                    return REPEAT_MODE.one                    
                case REPEAT_MODE.one:
                    return REPEAT_MODE.all
                case REPEAT_MODE.all:
                    return REPEAT_MODE.off
            }
        })
    }
    const value = {
        changeRepeatMode,
        repeatMode,
        isShuffle, setIsShuffle,
        volume, setVolume,
        playSpeed, setPlaySpeed,
        theme, setTheme,
        isSettingsOpen, openSettings, closeSettings,
    }
    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}