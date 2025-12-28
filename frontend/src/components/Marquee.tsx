import { useEffect, useRef, useState } from "react";

interface MarqueeProps {
    text: string;
    className?: string;
    speed?: number;
}

export function Marquee({ text, className = "", speed = 60 }: MarqueeProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const textRef = useRef<HTMLSpanElement | null>(null)
    const [needMarquee, setNeedMarquee] = useState(false)
    const [textWidth, setTextWidth] = useState(0);

    const idRef = useRef(
        `marquee-${Math.random().toString(36).substring(2, 10)}`
    )

    useEffect(() => {
        const container = containerRef.current;
        const el = textRef.current
        if (!container || !el) return

        const measure = () => {
            const cw = container.clientWidth;
            const tw = el.scrollWidth;
            if (tw === 0) return;
            console.log("cw:", cw, "tw:", tw);
            setTextWidth(tw);
            setNeedMarquee(tw > cw + 1)
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                measure();
            });
        });

        // Objeto que detecta cualquier cambio de tamaño
        // Si se cambia el tamaño ejecuta measure
        const ro = new ResizeObserver(measure)
        ro.observe(container)
        ro.observe(el)

        window.addEventListener("resize", measure)

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure)
        }

    }, [text])

    const distance = textWidth + 32; 
    const duration = distance > 0 ? Math.max(3, distance / speed) : 0

    useEffect(() => {
        const styleId = `${idRef.current}-style`
        if (document.getElementById(styleId)) return

        const style = document.createElement("style");
        style.id = styleId

        // Agrega un Kayframe que traslada el texto dependiendo de la distancia del texto
        style.textContent = `
        @keyframes ${idRef.current}-marquee {
        0% {transform: translateX(0)}
        100% { transform: translateX(calc(-1 * var(--marquee-distance)))
            }
        }`

        document.head.appendChild(style)

        return () => {
            const old = document.getElementById(styleId)
            if (old) old.remove()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className={`overflow-hidden whitespace-nowrap ${className}`}
            aria-label={text}
        >
            {needMarquee ? (
                <div
                    className="inline-flex items-center"
                    style={{
                        ["--marquee-distance" as any]: `${distance}px`,
                        animation: `${idRef.current}-marquee ${duration}s linear infinite`,
                    }}
                >
                    <span ref={textRef} className="inline-block pr-8">{text}</span>
                    <span className="inline-block pr-8">{text}</span>
                    <span className="inline-block pr-8">{text}</span>
                </div>
            ) : (
                <span ref={textRef} className="inline-block">
                    {text}
                </span>
            )}
        </div>
    )
}