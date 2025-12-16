import { useState } from "react";

export function useNavigation(
    similarSongs: any[],
    fetchSong: (artist: string, title: string) => Promise<any>
) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<"next" | "prev" | null>(null);

    const next = async () => {
        let index = currentIndex;

        while (index < similarSongs.length - 1) {
            index++;
            const song = similarSongs[index];

            if (!song?.artist?.name || !song?.name) continue;

            try {
                setDirection("next");
                setCurrentIndex(index);
                await fetchSong(song.artist.name, song.name);
                return;
            } catch {
                console.warn("⏭️ Saltando canción no disponible");
            }
        }
    };

    const prev = async () => {
        let index = currentIndex;

        while (index > 0) {
            index--;
            const song = similarSongs[index];

            if (!song?.artist?.name || !song?.name) continue;

            try {
                setDirection("prev");
                setCurrentIndex(index);
                await fetchSong(song.artist.name, song.name);
                return;
            } catch {
                console.warn("⏮️ Saltando canción no disponible");
            }
        }
    };
    return {
        currentIndex,
        direction,
        next,
        prev,
        hasNext: currentIndex < similarSongs.length - 1,
        hasPrev: currentIndex > 0,
        reset: () => {
            setCurrentIndex(0);
            setDirection(null);
        },
    };
}