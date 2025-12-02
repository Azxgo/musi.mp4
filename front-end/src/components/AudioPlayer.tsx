import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

interface AudioPlayerProps {
    src: string;
    onNext: () => void;
    onPrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
    src,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious,
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(true)

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().then(() => setIsPlaying(true))
                .catch(err => console.warn("🎧 Bloqueo autoplay:", err));
        }
    };

    // 🔹 Reproducir automáticamente cuando cambia la canción
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.src = src;

        audio.pause();
        audio.load();
        audio.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.warn("🎧 Bloqueo autoplay:", err));
    }, [src]);

    useEffect(() => {
        if (!audioRef.current) return
        audioRef.current.volume = volume ? 1 : 0
    }, [volume])

    return (
        <div className="mt-4 flex flex-col items-center gap-4">
            <audio ref={audioRef} src={src} loop className="hidden" />

            <div className="flex gap-6 items-center">
                <button
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                    className={`flex items-center justify-center border-3 border-white w-14 h-14 rounded-full transition ${hasPrevious ? "bg-transparent hover:bg-white/10" : "opacity-50 cursor-not-allowed"}`}
                >
                    <FaStepBackward size={22} />
                </button>

                <button
                    onClick={togglePlay}
                    className="bg-transparent hover:bg-white/10 border-3 border-white w-16 h-16 flex items-center justify-center rounded-full transition"
                >
                    {isPlaying ? <FaPause size={27} /> : <FaPlay size={27} />}
                </button>

                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={`flex items-center justify-center border-3 border-white w-14 h-14 rounded-full transition ${hasNext ? "bg-transparent hover:bg-white/10" : "opacity-50 cursor-not-allowed"}`}
                >
                    <FaStepForward size={22} />
                </button>
            </div>

            <button
                onClick={() => setVolume(!volume)}
                className='fixed bottom-4 right-4 flex items-center justify-center h-18 w-18'
            >
                {volume ? <FaVolumeUp size={40} /> : <FaVolumeMute size={36} />}
            </button>
        </div>
    );
};