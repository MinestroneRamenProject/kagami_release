import "../styles/musiclist.css"
import test from "../assets/react.svg"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { forwardRef } from 'react'

function MusicListInner({ playList, close, changeMusic }, ref) {
    return (
        <div ref={ref} className="music-list">
            <div className="playlist-header"> 
                <h1>PlayList</h1>
                <KeyboardArrowDownIcon className="close" onClick={()=>close()}/>
            </div>
            {
                playList?.map((music, index) => {
                    return (
                        <div 
                            className="music-list-item" 
                            key={music.title || index}
                            onClick={() => changeMusic(music)}
                            style={{ cursor: "pointer" }} 
                        >
                            <div className="music-list-content">
                                <h2>{music.title}</h2>
                                <p>caption...</p>
                            </div>
                            <div className="list-img">
                                <img src={test} alt="" />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default forwardRef(MusicListInner)