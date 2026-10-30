import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useSiteData } from '@/lib/site-context';

export function GallerySlider() {
  const { gallery } = useSiteData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = gallery.length;

  // Garante que o índice atual seja válido quando o total de fotos mudar
  useEffect(() => {
    if (currentIndex >= total && total > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, total]);

  useEffect(() => {
    if (total <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isHovered]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  if (!gallery || gallery.length === 0) {
    return (
      <div className="gallery-frame flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <ImageIcon size={48} className="mb-3 opacity-40 text-blue-500" />
        <p className="text-sm font-medium">Galeria de fotos da Moriá</p>
        <span className="text-xs text-slate-400 mt-1">Adicione fotos através da Área Administrativa</span>
      </div>
    );
  }

  return (
    <div
      className="gallery-frame relative overflow-hidden group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
      aria-label="Galeria de fotos Moriá Auto Elétrica"
    >
      {/* Moldura de fundo / Slide Container */}
      <div className="gallery-slide-container relative w-full h-full min-h-[420px] max-h-[500px] flex items-center justify-center overflow-hidden bg-slate-900/5">
        {gallery.map((img, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-center ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={img.url}
                alt={img.title || `Foto ${index + 1} da oficina`}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {img.title && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-4 pt-8 text-white text-xs font-medium text-left z-20">
                  {img.title}
                </div>
              )}
            </div>
          );
        })}

        {/* Botão Anterior */}
        {total > 1 && (
          <button
            type="button"
            onClick={goToPrev}
            className="gallery-nav-btn left-3 absolute z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-black/45 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm shadow-md"
            aria-label="Foto anterior"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Botão Próximo */}
        {total > 1 && (
          <button
            type="button"
            onClick={goToNext}
            className="gallery-nav-btn right-3 absolute z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-black/45 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-sm shadow-md"
            aria-label="Próxima foto"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Indicadores / Dots */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1.5 rounded-full">
            {gallery.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full ${
                  idx === currentIndex ? 'w-4 h-1.5 bg-blue-500' : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Ir para foto ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Contador discreto no topo */}
        {total > 1 && (
          <div className="absolute top-3 right-3 z-30 bg-black/45 backdrop-blur-sm text-white/90 text-[11px] font-semibold px-2 py-0.5 rounded-md">
            {currentIndex + 1} / {total}
          </div>
        )}
      </div>
    </div>
  );
}
