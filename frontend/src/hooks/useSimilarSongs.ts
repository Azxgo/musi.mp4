import type { SimilarSongs } from "../types/song";
import { useState } from "react";

export function useSimilarSongs() {
    const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;

    const [similarSongs, setSimilarSongs] = useState<SimilarSongs[]>([]);

    const fetchSimilar = async (artist: string, title: string, song?: any) => {
        try {
            const url = `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodeURIComponent(
                artist
            )}&track=${encodeURIComponent(title)}&api_key=${API_KEY}&format=json`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.similartracks?.track) {
                const similars = data.similartracks.track.slice(0, 50);
                const currentSong: SimilarSongs = {
                    name: title,
                    artist: { name: artist },
                    album: {
                        title: song?.album || "",
                        image: song
                            ? [
                                {
                                    "#text": song.albumCover,
                                    size: "large",
                                },
                            ]
                            : [],
                    },
                };
                setSimilarSongs([currentSong, ...similars]);
            }
        } catch (err) {
            console.error("Error al obtener canciones similares:", err);
        }
    };

    return { similarSongs, setSimilarSongs, fetchSimilar };
}