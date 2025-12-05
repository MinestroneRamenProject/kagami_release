import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMusic } from '../api/api';
import { useMusic } from '../Contexts/MusicContext';
import { useSettings } from '../Contexts/SettingsContext';
import { REPEAT_MODE } from '../constants/constant';
import Settings from './Settings';
import VisualizerCanvas from './VisualizerCanvas';
import RepeatOneIcon from "@mui/icons-material/RepeatOne";
import RepeatIcon from "@mui/icons-material/Repeat";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeDownOutlinedIcon from '@mui/icons-material/VolumeDownOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';
import ListIcon from '@mui/icons-material/List';
import "../styles/music.css"
import MusicList from './MusicList';
import Jacket from './Jacket';

import iconArticle from '../assets/article.svg';
import iconAdjust from '../assets/adjustments-horizontal.svg';

export default function Music() {
    const navigate = useNavigate();
    const { playlist } = useMusic();
    const {
        changeRepeatMode,
        setIsShuffle,
        repeatMode,
        isShuffle,
        volume, setVolume,
        theme,
    } = useSettings();

    // settings modal control
    const { openSettings } = useSettings();

    const [musicUrl, setMusicUrl] = useState(null);
    const [musicIndex, setMusicIndex] = useState(0);
    const [shuffleList, setShuffleList] = useState([]);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);
    const timeRef = useRef(null)
    const volumeRef = useRef(volume)
    const playListViewRef=useRef(null)
    const handleVolume = (e) => {
        setVolume(e.target.value)
    }

    const currentList = useMemo(() => {
        return isShuffle ? shuffleList : playlist;
    }, [isShuffle, shuffleList, playlist]);

    useEffect(() => {
        if (playlist?.length === 0) {
            navigate("/loading");
        }
    }, [playlist, navigate]);

    useEffect(() => {
        if (isShuffle) {
            const newShuffle = [...playlist];
            for (let i = newShuffle.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newShuffle[i], newShuffle[j]] = [newShuffle[j], newShuffle[i]];
            }
            setShuffleList(newShuffle);
            setMusicIndex(0);
        } else {
            // 今回はシンプルに0に戻すか、元のロジック通りにする
            setMusicIndex(0);
        }
    }, [isShuffle, playlist]);

    useEffect(() => {
        if(!playlist)return 
        const loadMusic = async () => {
            if (!currentList[musicIndex]) return;
            try {
                const path = currentList[musicIndex].path;
                const res = await fetchMusic(path);
                setMusicUrl(res);
            } catch (error) {
                console.error("Failed to load music:", error);
            }
        };
        loadMusic();
    }, [musicIndex, currentList]);

    const prevMusic = () => {
        if (musicIndex > 0) {
            setMusicIndex((prev) => prev - 1);
        } else if (repeatMode === REPEAT_MODE.all) {
            setMusicIndex(currentList.length - 1);
        }
    };

    const nextMusic = () => {
        if (musicIndex < currentList.length - 1) {
            setMusicIndex((prev) => prev + 1);
        } else if (repeatMode === REPEAT_MODE.all) {
            setMusicIndex(0); 
        }
    };
    const stopMusic=()=>{
        audioRef.current.pause()
    }
    const playMusic=()=>{
        audioRef.current.play()
    }
    

    // ■ 曲終了時の処理 (onEndedで呼ぶ)
    const handleMusicEnd = () => {
        switch (repeatMode) {
            case REPEAT_MODE.one:
                // 同じ曲をもう一度再生 (currentTimeを0にするだけで良い)
                if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play();
                }
                break;
            case REPEAT_MODE.all:
                nextMusic(); // ループ込みの次は nextMusic で処理済み
                break;
            case REPEAT_MODE.off:
            default:
                // 次があれば進む、なければ止まる
                if (musicIndex < currentList.length - 1) {
                    setMusicIndex(prev => prev + 1);
                }
                break;
        }
    };
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        audioRef.current.pause()
        const seekTime = e.target.value;
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    const handleSeekEnd = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };
    const handlePlaylistActive=()=>{
        if (playListViewRef.current) playListViewRef.current.classList.add("active")
    }

    //プレイリストから音楽を再生
    const handleChangeMusic = (music) => {
        const index = currentList.findIndex(item => item === music);
        
        if (index !== -1) {
            setMusicIndex(index); 
            handlePlaylistClose(); 
        } else {
            console.warn("Selected music not found in current list");
        }
    };
    
    const handlePlaylistClose=()=>{
        if (playListViewRef.current) playListViewRef.current.classList.remove("active")
    }
    return (
        <div
            className={`base ${theme}`}
            style={{ width: "100vw", height: "100vh", overflow: "hidden", padding: "2rem", backgroundColor: "black" }}
        >
            <div className="music-header">
                <button className="music-back-button" onClick={() => navigate('/mood')}>
                    <img
                        src={iconArticle}
                        alt="mood_selection"
                    />
                </button>
                <button className="music-settings-button" onClick={() => openSettings()}>
                    <img
                        src={iconAdjust}
                        alt="settings"
                    />
                </button>
            </div>
            {/* ジャケットの表示 */}
            <Jacket
                playMusic={playMusic}
                stopMusic={stopMusic}
                playList={currentList}
                isPause={audioRef.current?.paused}
                index={musicIndex}
                setIndex={setMusicIndex}
            />
            <audio
                ref={audioRef}
                src={musicUrl}
                autoPlay

                crossOrigin="anonymous"
                onEnded={handleMusicEnd}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={{ display: "none" }}
            />

            <div style={{ margin: "10px 0" }}>
                <button onClick={prevMusic}>Prev</button>
                <button onClick={nextMusic}>Next</button>
            </div>

            <footer className='music-footer'>
                <div className='play-music-settings'>
                    <div className="seek-bar-container">
                        <input
                            ref={timeRef}
                            type="range"
                            className="seek-bar"
                            min="0"
                            max={duration}
                            value={currentTime}
                            onChange={handleSeek}
                            onMouseUp={handleSeekEnd}
                            onTouchEnd={handleSeekEnd}
                        />
                    </div>
                    <div className='play-music-buttons'>
                        <button onClick={() => changeRepeatMode()} className={`icon-button ${repeatMode == REPEAT_MODE.off ? "off" : ""}`}>{repeatMode != REPEAT_MODE.one ? <RepeatIcon className="img" /> : <RepeatOneIcon className="img" />}</button>
                        <button onClick={() => setIsShuffle((prev) => !prev)} className={`icon-button ${isShuffle ? "" : "off"}`}><ShuffleIcon className="img" /></button>
                    </div>
                </div>
                <div className="volume-bar-container">
                    <div className='volume-icon'>
                        {
                            volume >= 50 ? <VolumeUpOutlinedIcon className='img'/> :
                                volume > 0 ? <VolumeDownOutlinedIcon className='img'/> : <VolumeOffOutlinedIcon className='img'/>
                        }
                    </div>
                    <input
                        ref={volumeRef}
                        type="range"
                        className="volume-bar"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolume}
                    />
                    <div className='play-list-icon' onClick={()=>handlePlaylistActive()}>
                        <ListIcon className='img'/>
                    </div>
                </div>
                
            </footer>
            <MusicList ref={playListViewRef} playList={playlist} close={handlePlaylistClose} changeMusic={handleChangeMusic}/>
            {/* <VisualizerCanvas audioRef={audioRef} isPlaying={!!musicUrl} /> */}
        </div>
    );
}