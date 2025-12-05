import { useNavigate } from "react-router-dom";
import { useMusic } from "../Contexts/MusicContext";
import { fetchPlayList } from "../api/api";
import '../styles/Mood.css';
import { MOOD } from "../constants/constant";
import { useState } from "react";

export default function Mood() {
    const navigate = useNavigate()
    const { setPlaylist } = useMusic()
    const [emotion, setEmotion] = useState("")

    // 【修正箇所】引数として選択されたムードを受け取る
    const getPlaylist = async (selectedMood) => {
        try {
            // fetchPlayListにムード（例: 'happy'）を渡す
            const res = await fetchPlayList(selectedMood) 
            setPlaylist(res)
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleClick = async() => {
        if (emotion === "") {
            alert("Please select a mood before submitting.")
            return
        }
        // 【修正箇所】getPlaylist呼び出し時に現在のemotionを渡す
        await getPlaylist(emotion) 
        navigate("/")
    }

    const returnClick = async() => {
        navigate("/")
    }

    return (
        <div className="mood-page">
            <div className="mood-header">
                <button className="mood-back-button" onClick={() => returnClick()}>←</button>
                <p className="mood-header-title">Select Mood</p>
            </div>
            <div className="mood-body">
                <div className="mood-title">
                    <h2 className="mood-title">How are you feeling today?</h2>
                </div>
                <div className="mood-list">
                    {MOOD.map(mood => (
                        <button
                            key={mood.type}
                            className={`mood-item ${emotion === mood.type ? "selected" : ""}`}
                            onClick={() => {
                                setEmotion(mood.type);
                                console.log(`Selected mood: ${mood.type}`);
                            }}
                        >
                            <span className="mood-emoji" role="img" aria-label={mood.label}>
                                {mood.emoji}
                            </span>
                            <div className="mood-labels" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <span className="mood-label" style={{ fontWeight: 600 }}>{mood.label}</span>
                                <span className="mood-desc" style={{ color: "#666" }}>{mood.desc}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="handin-container">
                <button className="handin-button" onClick={() => handleClick()}>hand in your feeling</button>
            </div>
        </div>
    )
}