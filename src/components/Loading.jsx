import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import kagamiLogo from "../assets/kagamiLogo.png";
import { checkHealth } from "../api/api";
import "../styles/loading.css";

export default function Loading() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const MIN_LOADING = 2000;
        const start = Date.now();

        const checkBackend = async () => {
            try {
                const health = await checkHealth();
                if (!health) {
                    throw new Error("backend not healthy");
                }

                // waiting for minimum loading time
                const elapsed = Date.now() - start;
                const wait = Math.max(0, MIN_LOADING - elapsed);
                setTimeout(() => navigate("/mood"), wait);
            } catch {
                setError("バックエンドとの通信に失敗しました");
            }
        };

        checkBackend();
    }, [navigate]);

    return (
        <div className="loading-screen">
            {/* ローディング画像 */}
            {!error && (
                <>
                    <img src={kagamiLogo} alt="loading..." className="loading-img" />
                    <p className="loading-text">接続中...</p>
                </>
            )}

            {/* エラーメッセージ */}
            {error && (
                <div className="error">
                    <p>{error}</p>
                    <button
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        再試行
                    </button>
                </div>
            )}
        </div>
    );
}