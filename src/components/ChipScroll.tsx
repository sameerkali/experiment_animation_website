import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ChipScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);

  const FRAME_COUNT = 240;

  const formatIndex = (i: number) => String(i).padStart(3, '0');
  const framePath = (i: number) => `/sequence/ezgif-frame-${formatIndex(i)}.jpg`;

  // preload all frames
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    const handleLoad = (img: HTMLImageElement) => {
      loaded += 1;
      // Store dimensions from first loaded image
      if (loaded === 1 && img.naturalWidth) {
        setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const ratio = window.devicePixelRatio || 1;
          canvas.width = window.innerWidth * ratio;
          canvas.height = window.innerHeight * ratio;
          canvas.style.width = `${window.innerWidth}px`;
          canvas.style.height = `${window.innerHeight}px`;
          ctx?.scale(ratio, ratio);
          drawImageContain(ctx, img, window.innerWidth, window.innerHeight);
        }
      }
      if (loaded === FRAME_COUNT) {
        setImages(imgs);
        setLoading(false);
      }
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => handleLoad(img);
      img.onerror = () => {
        console.warn('failed to load', framePath(i));
        handleLoad(img);
      };
      imgs.push(img);
    }
  }, []);

  // Draw image with "contain" fit (full image visible, centered)
  const drawImageContain = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, x, y;

    if (imgRatio > canvasRatio) {
      // Image is wider than canvas - fit to width
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      x = 0;
      y = (canvasHeight - drawHeight) / 2;
    } else {
      // Image is taller than canvas - fit to height
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      x = (canvasWidth - drawWidth) / 2;
      y = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  };

  // Scoped scroll progress — only tracks the container div
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  const drawFrame = (idx: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || images.length === 0) return;
    const clamped = Math.min(FRAME_COUNT - 1, Math.max(0, idx));
    const img = images[clamped];
    
    // Get CSS pixel dimensions
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    
    drawImageContain(ctx, img, cssWidth, cssHeight);
  };

  useEffect(() => {
    if (images.length === FRAME_COUNT) {
      drawFrame(0);
      const unsubscribe = frameIndex.on('change', (v) => {
        drawFrame(Math.floor(v));
      });
      return unsubscribe;
    }
  }, [images, frameIndex]);

  // resize canvas on window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(ratio, ratio);
        const idx = Math.floor(frameIndex.get());
        drawFrame(idx);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [frameIndex, images]);

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh] w-full bg-[#050505]"
      id="hero-animation"
    >
      {/* Loading spinner */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#050505]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-white/40 tracking-widest uppercase">Loading frames…</p>
          </div>
        </div>
      )}

      {/* Sticky canvas — sticks to viewport while scrolling through the 500vh container */}
      <canvas ref={canvasRef} className="sticky top-0 h-screen w-full" />

    </section>
  );
};

export default ChipScroll;