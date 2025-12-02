import './App.css';
import { useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { AudioPlayer } from './components/AudioPlayer';
import ColorThief from 'colorthief';
import { motion, AnimatePresence } from 'framer-motion';
import { Marquee } from './components/Marquee';
import type { Song, SimilarSongs } from "./types/song";
import { AudioWarning } from './components/AudioWarning';

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;

function App() {
  const [showWarning, setShowWarning] = useState(true);
  const [song, setSong] = useState<Song | null>(null);
  const [similarSongs, setSimilarSongs] = useState<SimilarSongs[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [bgGradient, setBgGradient] = useState<string>(
    "linear-gradient(135deg, #1f1f1f, #000)"
  );

  // Fetch de datos de la cancion
  const fetchSong = async (artist: string, track: string): Promise<Song | null> => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:3000/api/track?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          console.warn(`❌ ${artist} - ${track} no está en Deezer`);
          return null;
        }
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data = await res.json();
      setSong(data || null);
      return data;
    } catch (err) {
      console.error("Error al obtener la canción:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch canciones similares
  const fetchSimilar = async (artist: string, title: string) => {
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

  const handleSelectSong = (artist: string, title: string) => {
    fetchSong(artist, title);
    fetchSimilar(artist, title);
    setCurrentIndex(0);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection("prev");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < similarSongs.length - 1) {
      setDirection("next");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (similarSongs.length > 0) {
      const current = similarSongs[currentIndex];
      if (!current?.artist?.name || !current?.name) return;

      fetchSong(current.artist.name, current.name).then((result) => {
        if (!result) {
          console.warn(`⏭ Saltando canción no disponible: ${current.name}`);
          if (direction === "next" && currentIndex < similarSongs.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else if (direction === "prev" && currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
          }
        }
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!song?.albumCover) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = song.albumCover;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();

        const palette = colorThief.getPalette(img, 8);

        const [c1, c2, c3] = palette;

        const gradient = `
                linear-gradient(135deg,
                    rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, 0.55),
                    rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, 0.55),
                    rgba(${c3[0]}, ${c3[1]}, ${c3[2]}, 0.75)
                )
            `;

        setBgGradient(gradient);

      } catch (e) {
        console.error("Error con paleta de colores:", e);
      }
    };
  }, [song]);

  return (
    <div className='m-0 p-0'>
      <header className='bg-transparent fixed w-full z-50'>
        <SearchBar onSelectSong={handleSelectSong} />
      </header>


      <motion.div
        key="default-bg"
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1f1f1f, #000)"
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: song ? 0 : 1 }}
        transition={{ duration: 1.5 }}
      />

      <motion.div
        animate={{ background: bgGradient }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="min-h-screen w-full flex flex-col items-center justify-center">

        <div className="absolute inset-0 bg-black/15 pointer-events-none z-1"></div>
        <div className="flex flex-col items-center justify-center text-white gap-4 mt-10 z-49">
          {!song && !loading ? (
            <p className="text-lg text-zinc-300 text-center">
              Busca una canción para explorar recomendaciones
            </p>
          ) : loading ? (
            <div className="flex flex-col justify-center items-center animate-pulse">
              <div className="bg-zinc-600/40 w-74 h-74 rounded-lg mb-4" />
              <div className="flex flex-col justify-center items-center gap-2 p-2 bg-zinc-800/30 w-74 rounded-lg">
                <div className="h-7 bg-zinc-600/40 rounded-lg w-48"></div>
                <div className="h-6 bg-zinc-600/40 rounded-lg w-32"></div>
                <div className="h-5 bg-zinc-600/40 rounded-lg w-32"></div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {song && (
                <motion.div
                  key={song.title}
                  initial={{ opacity: 0, x: direction === "next" ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction === "next" ? -100 : 100 }}
                  transition={{ duration: 0.45 }}
                  className="flex flex-col justify-center items-center"
                >
                  <img
                    src={song.albumCover}
                    alt="cover"
                    className="bg-zinc-600 w-74 h-74 rounded-lg shadow-xl"
                  />
                  <div className="mt-4 p-2 bg-zinc-800/30 w-74 rounded-lg text-center">
                    <Marquee text={song.title} className="text-2xl font-semibold mx-auto" speed={35} />
                    <h2 className="text-xl">{song.artist}</h2>
                    <Marquee text={song.album} className="text-lg  mx-auto" speed={20} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {song && song.preview && (
            <AudioPlayer
              src={song.preview}
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={currentIndex < similarSongs.length - 1}
              hasPrevious={currentIndex > 0}
            />
          )}
        </div>
      </motion.div>
      <AudioWarning
        show={showWarning}
        onClose={() => setShowWarning(false)}
      />
    </div>
  );
}

export default App;