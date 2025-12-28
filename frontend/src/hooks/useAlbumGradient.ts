import { useEffect, useState } from "react";
import ColorThief from 'colorthief';

export function useAlbumGradient(imageUrl?: string) {
    const [bgGradient, setBgGradient] = useState<string>(
        "linear-gradient(135deg, #1f1f1f, #000)"
    );

    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

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
    }, [imageUrl]);

    return bgGradient;
}