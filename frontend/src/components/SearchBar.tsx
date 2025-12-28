import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
    onSelectSong: (artist: string, title: string) => void;
}

interface Song {
    title: string;
    artist: string;
    albumCover: string;
}

export function SearchBar({ onSelectSong }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<number | null>(null);

    // Cierra el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Manejo de input con debounce
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (value.trim().length === 0) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        debounceRef.current = setTimeout(() => {
            fetchResults(value.trim());
        }, 400);
    };

    // Llama al backend (no directo a Deezer)
    const fetchResults = async (text: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(text)}`);
            const data = await res.json();

            if (!data || !data.data) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            const songs: Song[] = data.data.map((t: any) => ({
                title: t.title,
                artist: t.artist.name,
                albumCover: t.album?.cover_small || "",
            }));

            setResults(songs.slice(0, 10)); // máximo 10 resultados
            setIsOpen(songs.length > 0);
        } catch (error) {
            console.error("Error al buscar canciones:", error);
            setResults([]);
            setIsOpen(false);
        } finally {
            setLoading(false);
        }
    };

    // Cuando se selecciona una canción
    const handleSelect = (song: Song) => {
        setQuery(`${song.title} - ${song.artist}`);
        setIsOpen(false);
        onSelectSong(song.artist, song.title);
    };
    

    return (
        <div ref={ref} className="relative group">
            <div className="relative flex flex-col px-5 py-6">

                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex items-center w-full p-2 rounded-full gap-5 bg-transparent transition duration-500">
                    <FiSearch className="text-zinc-400 w-5 h-5" />
                    <input
                        placeholder="Buscar Canción"
                        type="text"
                        value={query}
                        onChange={handleChange}
                        className="w-full outline-none bg-transparent text-zinc-200"
                    />
                    {loading && (
                        <div className="animate-spin border-2 border-zinc-400 border-t-transparent rounded-full w-4 h-4" />
                    )}
                </div>

                {isOpen && (
                    <div className="absolute top-[75%] left-0 w-full bg-zinc-900/90 backdrop-blur-lg rounded-xl shadow-lg border border-zinc-700 overflow-hidden animate-fadeIn max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-4 text-zinc-400 text-sm">
                                Cargando...
                            </div>
                        ) : results.length > 0 ? (
                            results.map((song, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelect(song)}
                                    className="gap-4 flex items-center w-full text-left px-4 py-2 hover:bg-zinc-800/70 transition-colors duration-200 text-zinc-200 border-b border-zinc-800 last:border-none"
                                >
                                    {song.albumCover && (
                                        <img
                                            src={song.albumCover}
                                            alt={song.title}
                                            className="w-10 h-10 rounded-md object-cover"
                                        />
                                    )}
                                    <div>
                                        <span className="block font-medium">{song.title}</span>
                                        <span className="text-sm text-zinc-400">{song.artist}</span>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="text-center py-3 text-zinc-400 text-sm">
                                No se encontraron resultados
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}