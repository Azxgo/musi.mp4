import './App.css';
import { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { AudioPlayer } from './components/AudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { Marquee } from './components/Marquee';
import { AudioWarning } from './components/AudioWarning';
import { useSong } from './hooks/useSong';
import { useSimilarSongs } from './hooks/useSimilarSongs';
import { useAlbumGradient } from './hooks/useAlbumGradient';
import { useNavigation } from './hooks/useNavigation';

function App() {
  const { song, loading, fetchSong } = useSong()
  const { similarSongs, fetchSimilar } = useSimilarSongs()
  const bgGradient = useAlbumGradient(song?.albumCover);

  const [showWarning, setShowWarning] = useState(true);

  const navigation = useNavigation(similarSongs, fetchSong);

  const handleSelectSong = (artist: string, title: string) => {
    fetchSong(artist, title);
    fetchSimilar(artist, title);
    navigation.reset()
  };

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
        <div className="flex flex-col items-center justify-center text-white gap-4 mt-6 sm:mt-10 px-4 z-49">
          {!song && !loading ? (
            <p className="text-lg text-zinc-300 text-center">
              Busca una canción para explorar recomendaciones
            </p>
          ) : loading ? (
            <div className="flex flex-col justify-center items-center animate-pulse">
              <div className="bg-zinc-600/40 w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-lg mb-4" />
              <div className="flex flex-col items-center gap-2 p-3 bg-zinc-800/30 w-40 sm:w-56 md:w-64 rounded-lg">
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
                  initial={{ opacity: 0, x: navigation.direction === "next" ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: navigation.direction === "next" ? -100 : 100 }}
                  transition={{ duration: 0.45 }}
                  className="flex flex-col justify-center items-center"
                >
                  <img
                    src={song.albumCover}
                    alt="cover"
                    className="bg-zinc-600 rounded-lg shadow-xl w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover"
                  />
                  <div className=" mt-4 p-3 bg-zinc-800/30 rounded-lg text-center w-40 sm:w-56 md:w-64 lg:w-72">
                    <Marquee text={song.title} className="text-base sm:text-xl md:text-2xl font-semibold mx-auto" speed={35} />
                    <h2 className="text-sm sm:text-lg md:text-xl">{song.artist}</h2>
                    <Marquee text={song.album} className="text-sm sm:text-base md:text-lg mx-auto" speed={20} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {song && song.preview && (
            <AudioPlayer
              src={song.preview}
              onNext={navigation.next}
              onPrevious={navigation.prev}
              hasNext={navigation.hasNext}
              hasPrevious={navigation.hasPrev}
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