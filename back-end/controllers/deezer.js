
export const getTrack = async (req, res) => {
    const { artist, track } = req.query;

    if (!artist || !track) {
        return res.status(400).json({ error: "Faltan parámetros 'artist' o 'track'" });
    }

    try {

        const searchUrl = `https://api.deezer.com/search?q=${encodeURIComponent(
            `${artist} ${track}`
        )}`;

        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (!searchData.data || searchData.data.length === 0) {
            return res.status(404).json({ error: "Canción no encontrada" });
        }

        // Tomar el primer resultado
        const song = searchData.data[0];

        // Retornar los datos relevantes
        res.json({
            id: song.id,
            title: song.title,
            artist: song.artist.name,
            album: song.album.title,
            albumCover: song.album.cover_medium,
            preview: song.preview,
            link: song.link,
            duration: song.duration,
            bpm: song.bpm,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const searchTrack = async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Missing query parameter" });

    try {
        const response = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(q)}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching from Deezer:", error);
        res.status(500).json({ error: "Error fetching from Deezer" });
    }
}

export const getArtistTopTracks = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`https://api.deezer.com/artist/${id}/top?limit=20`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching artist tracks:", error);
        res.status(500).json({ error: "Error fetching artist tracks" });
    }
}

export const getArtist = async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Missing query parameter" });

    try {
        const response = await fetch(`https://api.deezer.com/search/artist?q=${encodeURIComponent(q)}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching artist:", error);
        res.status(500).json({ error: "Error fetching artist" });
    }
}