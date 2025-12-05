import { useEffect, useRef } from 'react';

export default function VisualizerCanvas({ audioRef, isPlaying }) {
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationFrameIdRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current || !isPlaying) return;

        const audioEl = audioRef.current;
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');

        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            
            // なめらかにするために解像度を高めに設定
            analyserRef.current.fftSize = 2048; 
            // 時間的な動きもなめらかにする
            analyserRef.current.smoothingTimeConstant = 0.85;
            
            if (!sourceRef.current) {
                sourceRef.current = audioContextRef.current.createMediaElementSource(audioEl);
                sourceRef.current.connect(analyserRef.current);
                analyserRef.current.connect(audioContextRef.current.destination);
            }
        }

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const baseRadius = 120; 

        const draw = () => {
            animationFrameIdRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            // 線のスタイル設定（ぼかしなし）
            canvasCtx.lineWidth = 3; 
            canvasCtx.strokeStyle = "white"; 
            canvasCtx.lineJoin = "round"; // 角を丸くする

            // 1. データのスムージング（移動平均）
            // これにより、トゲトゲした値をなだらかな山に変換します
            const smoothedData = new Array(bufferLength).fill(0);
            // この数値を大きくすると、より山の形が緩やか（丸く）なります
            const range = 8; 
            
            for (let i = 0; i < bufferLength; i++) {
                let sum = 0;
                let count = 0;
                
                // 前後 range 個分のデータの平均をとる
                for (let j = -range; j <= range; j++) {
                    const idx = i + j;
                    // 配列の範囲内なら加算
                    if (idx >= 0 && idx < bufferLength) {
                        sum += dataArray[idx];
                        count++;
                    }
                }
                smoothedData[i] = sum / count;
            }

            // 2. 座標の計算（データの並び替えはせず、そのまま円形に配置）
            const points = [];
            for (let i = 0; i < bufferLength; i++) {
                const value = smoothedData[i];
                
                // 波形の高さ調整
                const amplitude = (value / 255) * 100; 
                const r = baseRadius + amplitude;

                // 角度: 0番目(低音)から 最後(高音) までを一周させる
                // -Math.PI / 2 は「12時の位置」から開始するための補正
                const angle = (i / bufferLength) * (2 * Math.PI) - (Math.PI / 2);

                points.push({
                    x: centerX + Math.cos(angle) * r,
                    y: centerY + Math.sin(angle) * r
                });
            }

            // 3. ベジェ曲線による描画
            canvasCtx.beginPath();
            
            if (points.length > 0) {
                const len = points.length;
                
                // ループをなめらかにするため、「最後の点」と「最初の点」の中点から描き始める
                const startX = (points[len - 1].x + points[0].x) / 2;
                const startY = (points[len - 1].y + points[0].y) / 2;
                canvasCtx.moveTo(startX, startY);

                // 全ての点に対して、曲線でつないでいく
                for (let i = 0; i < len; i++) {
                    const p1 = points[i]; // 制御点（山頂になる部分）
                    const p2 = points[(i + 1) % len]; // 次の点
                    
                    // p1とp2の中点に向かって線を引く
                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;

                    canvasCtx.quadraticCurveTo(p1.x, p1.y, midX, midY);
                }
            }

            canvasCtx.stroke();
        };

        const handlePlay = () => {
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
            cancelAnimationFrame(animationFrameIdRef.current);
            draw();
        };

        const handlePause = () => {
            cancelAnimationFrame(animationFrameIdRef.current);
        };

        audioEl.addEventListener('play', handlePlay);
        audioEl.addEventListener('pause', handlePause);

        if (!audioEl.paused) {
            handlePlay();
        }

        return () => {
            audioEl.removeEventListener('play', handlePlay);
            audioEl.removeEventListener('pause', handlePause);
            cancelAnimationFrame(animationFrameIdRef.current);
        };
    }, [audioRef, isPlaying]);

    return (
        <canvas 
            ref={canvasRef} 
            width="800" 
            height="800" 
            style={{ marginTop: '20px', width: '100%', maxWidth: '600px', height: 'auto',background: 'radial-gradient(circle, #1a1a2e 0%, #000000 100%)' }} 
        />
    );
}