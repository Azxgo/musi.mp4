import type { Song } from "../types/song";
import { useState } from "react";

export function useSong() {
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSong = async (artist: string, track: string): Promise<Song | null> => {
        try {
            setLoading(true);

            const res = await fetch(
                `/api/track?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`
            );

            if (!res.ok) {
                if (res.status === 404) {
                    console.warn(`❌ ${artist} - ${track} no está en Deezer`);
                    throw new Error("TRACK_NOT_FOUND");
                }
                throw new Error(`Error HTTP ${res.status}`);
            }

            const data = await res.json();
            setSong(data || null);
            return data;
        } catch (err) {
            console.error("Error al obtener la canción:", err);
            throw err; // deja que navigation lo maneje
        } finally {
            setLoading(false);
        }
    };

    return { song, loading, fetchSong };
}