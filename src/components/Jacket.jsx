import { useEffect, useRef, useState } from "react"
import "../styles/jacket.css"
// MUIアイコンのインポートは不要であれば削除してもOKですが、
// 下記ではCSSに合わせたSVGを直接書いてデザインを優先しています。

export default function Jacket({ playMusic, stopMusic, playList, isPause, index, setIndex }) {

    const jacketRef = useRef(null)
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    const SWIPE_DISTANCE = 50;
    const [jacketList, setJacketList] = useState([])

    const touchStart = (e) => {
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    }

    const touchEnd = (e) => {
        endX = e.changedTouches[0].pageX;
        endY = e.changedTouches[0].pageY;

	//判定処理
        const distanceX = endX - startX;
        const distanceY = endY - startY;

        if (distanceX < -SWIPE_DISTANCE && distanceY < -SWIPE_DISTANCE) {
            console.log("左上" + index);
            setIndex((prevIndex) => Math.min(prevIndex + 1, playList.length - 1));
        }
	// 【右下】 Xがプラス かつ Yがプラス
        else if (distanceX > SWIPE_DISTANCE && distanceY > SWIPE_DISTANCE) {
            console.log("右下" + index);
            setIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }
    }

    useEffect(() => {
        setJacketList(playList?.slice(index, index + 3) || [])
    }, [index, playList])

    useEffect(() => {
        const ref = jacketRef.current;
        if (ref) {
            ref.addEventListener('touchstart', touchStart);
            ref.addEventListener('touchend', touchEnd);
            return () => {
                ref.removeEventListener("touchstart", touchStart); // removeEventListenerに修正推奨
                ref.removeEventListener("touchend", touchEnd);     // removeEventListenerに修正推奨
            }
        }
    }, []) // jacketRefは依存配列に入れなくてOK、または[jacketRef.current]

    // 再生・停止の切り替えハンドラ
    const togglePlay = (e) => {
        // ボタンを押したときに親要素へのイベント伝播を防ぐ（必要に応じて）
        e.stopPropagation(); 
        
        if (isPause) {
            playMusic();
        } else {
            stopMusic();
        }
    };

    return (
        <div ref={jacketRef} className="jacket-wrapper">
            {
                jacketList?.map((jacket, index) => {
                    return (
                        <div className="jacket-content" key={jacket.title || index}>
                            <div className="play-stop-img">
                                <h2>{jacket.title}</h2>
                                
                                {/* ここにデザインされた再生ボタンを挿入 */}
                                <button 
                                    className="play-button" 
                                    onClick={togglePlay}
                                    aria-label={isPause ? "再生" : "一時停止"}
                                >
                                    {isPause ? (
                                        // 再生アイコン (SVG)
                                        <svg className="icon play-icon-adjust" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    ) : (
                                        // 一時停止アイコン (SVG)
                                        <svg className="icon" viewBox="0 0 24 24">
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                        </svg>
                                    )}
                                </button>

                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}