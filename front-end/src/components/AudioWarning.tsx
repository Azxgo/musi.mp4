import { motion, AnimatePresence } from "framer-motion";

interface AudioWarningProps {
    show: boolean;
    onClose: () => void;
}

export function AudioWarning({ show, onClose }: AudioWarningProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.0, opacity: 0 }}
                        className="bg-zinc-900 p-6 rounded-xl shadow-xl text-white max-w-sm text-center"
                    >
                        <h2 className="text-2xl font-bold mb-4">Advertencia</h2>
                        <p className="text-lg mb-6">
                            Este sitio reproducirá audio automáticamente.
                            Asegúrate de tener el volumen configurado correctamente.
                        </p>

                        <button
                            onClick={onClose}
                            className="bg-zinc-600 hover:bg-zinc-700 px-4 py-2 rounded-lg text-white font-semibold"
                        >
                            Entendido
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}