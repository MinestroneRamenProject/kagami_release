const API_ROOT_URL = "http://localhost:8000"; 

export const fetchMusic = async (song_path) => { 
    try {
        const res = await fetch(`${API_ROOT_URL}/music/${song_path}`, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.url;

    } catch (error) {
        throw new Error(`Failed to fetch music: ${error.message}`);
    }
};

export const fetchPlayList = async (mood) => {
     try {
        // 【修正箇所】URLにクエリパラメータ ?mood=... を追加
        const urlWithMood = `${API_ROOT_URL}/recommend?mood=${mood}`;
        
        const res = await fetch(urlWithMood, { 
            method: "GET",
            // GETリクエストでは Content-Type ヘッダーは不要
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const errorMessage = errorData.message || `HTTP error! status: ${res.status}`;
            throw new Error(errorMessage);
        }
        
        const data = await res.json()
        return data.recommendations

    } catch (error) {
        throw new Error(`Failed to fetch playlist: ${error.message}`);
    }
}

export const checkHealth = async () => {
    try {
        const urlWithHealth = `${API_ROOT_URL}/moods`;
        const res = await fetch(urlWithHealth, { 
            method: "GET",
        });
        if (!res.ok) return false
        return true
    } catch {
        return false
    }
} 