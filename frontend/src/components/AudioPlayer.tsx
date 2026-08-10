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
    const currentSrcRef = useRef<string | null>(null); // ✅ NUEVO
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

    // Reproducir automáticamente cuando cambia la canción
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // MATAR AUDIO ANTERIOR
        audio.pause();
        audio.src = "";
        audio.load();

        // REGISTRAR SRC ACTUAL
        currentSrcRef.current = src;

        audio.src = src;
        audio.load();
        setIsPlaying(false);
    }, [src]);


    const handleCanPlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.src !== currentSrcRef.current) return;

        audio.play().then(() => setIsPlaying(true)).catch(() => { });
    };

    useEffect(() => {
        if (!audioRef.current) return
        audioRef.current.volume = volume ? 1 : 0
    }, [volume])

    return (
        <div className="mt-4 flex flex-col items-center gap-3 sm:gap-4 w-full max-w-md px-2">
            <audio key={src} ref={audioRef} src={src} onCanPlay={handleCanPlay} loop className="hidden" />

            <div className="flex gap-6 items-center">
                <button
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                    className={`flex items-center justify-center border-3 border-white w-10 h-10
                    sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full transition ${hasPrevious ? "bg-transparent hover:bg-white/10" : "opacity-50 cursor-not-allowed"}`}
                >
                    <FaStepBackward className="text-base sm:text-lg md:text-xl" />
                </button>

                <button
                    onClick={togglePlay}
                    className="bg-transparent hover:bg-white/10 border-3 border-white w-12 h-12 sm:w-14 sm:h-14
                    md:w-16 md:h-16 flex items-center justify-center rounded-full transition"
                >
                    {isPlaying ? <FaPause className="text-lg sm:text-xl md:text-2xl" /> : <FaPlay className="text-lg sm:text-xl md:text-2xl" />}
                </button>

                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={`flex items-center justify-center border-3 border-white   w-10 h-10
                    sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full transition ${hasNext ? "bg-transparent hover:bg-white/10" : "opacity-50 cursor-not-allowed"}`}
                >
                    <FaStepForward className="text-base sm:text-lg md:text-xl" />
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