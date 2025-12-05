import { useSettings } from "../Contexts/SettingsContext"

import "../styles/settings.css"
import { useEffect } from "react";
import { THEME } from '../constants/constant';

export default function Settings() {
    const {
        playSpeed, setPlaySpeed,
        theme, setTheme,
        closeSettings,
    } = useSettings()

    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = prev }
    }, [])

    return (
        <div className="settings-modal-overlay" onClick={() => closeSettings() }>
            <aside
                className="settings-modal"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="settings-header">
                    <button className="settings-back-button" onClick={() => closeSettings()}>←</button>
                    <h2>Settings</h2>
                </div>

                <div className="settings-modal-body">
                    <div className="settings-content">
                        <div className="setting-item">
                            <label htmlFor="play-speed-select">Theme: </label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                            >
                                <option value={THEME.default}>Default</option>
                                <option value={THEME.twilight}>Twilight</option>
                            </select>
                        </div>
                        <div className="setting-item">
                            <label htmlFor="play-speed-select">Playback Speed: 開発中!! </label>
                            <select
                                id="play-speed-select"
                                value={playSpeed}
                                onChange={(e) => setPlaySpeed(Number(e.target.value))}
                            >
                                <option value={0.5}>0.5x</option>
                                <option value={0.75}>0.75x</option>
                                <option value={1}>1x (Normal)</option>
                                <option value={1.25}>1.25x</option>
                                <option value={1.5}>1.5x</option>
                                <option value={2}>2x</option>
                            </select>
                        </div>
                    </div>
                    <section className="credits">
                        <h2>Credits</h2>
                        <dl className="credits-list">
                            <div className="credits-item">
                                <dt>Event</dt>
                                <dd>Hack U 名城大学 2025</dd>
                            </div>
                            <div className="credits-item">
                                <dt>Developed by</dt>
                                <dd>Minestrone Ramen</dd>
                            </div>
                            <div className="credits-item">
                                <dt>Music</dt>
                                <dd>
                                    <span>魔王魂</span>
                                    <span className="credits-link">— <a href="https://maou.audio/" target="_blank" rel="noopener noreferrer">maou.audio</a></span>
                                </dd>
                            </div>
                        </dl>
                    </section>
                </div>
            </aside>
        </div>
    )
}