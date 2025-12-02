import express from "express";
import cors from "cors";
import spotifyPreviewFinder from "spotify-preview-finder";
import 'dotenv/config'

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT ?? 3000;


app.get("/api/preview", async (req, res) => {
    const { song, artist } = req.query;
    if (!song || !artist) {
        return res.status(400).json({ error: "Missing song or artist" });
    }

    try {
        const result = await spotifyPreviewFinder(song, artist, 1);
        if (result.success && result.results.length > 0) {
            const previewUrl = result.results[0].previewUrls[0];
            res.json({ previewUrl });
        } else {
            res.status(404).json({ error: "No preview found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/track", async (req, res) => {
    const { artist, track } = req.query;

    if (!artist || !track) {
        return res.status(400).json({ error: "Faltan parámetros 'artist' o 'track'" });
    }

    try {
    
        const searchUrl = `https://api.deezer.com/search?q=artist:"${encodeURIComponent(
            artist
        )}" track:"${encodeURIComponent(track)}"`;

        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();

        if (!searchData.data || searchData.data.length === 0) {
            return res.status(404).json({ error: "Canción no encontrada" });
        }

        // 2️⃣ Tomar el primer resultado
        const song = searchData.data[0];

        // 3️⃣ Retornar los datos relevantes
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
});


app.get("/api/deezer/search", async (req, res) => {
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
});

app.get("/api/deezer/artist/:id/top", async (req, res) => {
    const { id } = req.params;
    try {
        const response = await fetch(`https://api.deezer.com/artist/${id}/top?limit=20`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching artist tracks:", error);
        res.status(500).json({ error: "Error fetching artist tracks" });
    }
});

app.get("/api/deezer/search/artist", async (req, res) => {
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
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});