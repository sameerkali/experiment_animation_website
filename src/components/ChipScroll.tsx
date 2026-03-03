import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ChipScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);

  const FRAME_COUNT = 240;

  const formatIndex = (i: number) => String(i).padStart(3, '0');
  const framePath = (i: number) => `/sequence/ezgif-frame-${formatIndex(i)}.jpg`;

  // preload all frames
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    const handleLoad = (img: HTMLImageElement) => {
      loaded += 1;
      if (loaded === 1) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const ratio = window.devicePixelRatio || 1;
          canvas.width = window.innerWidth * ratio;
          canvas.height = window.innerHeight * ratio;
          canvas.style.width = `${window.innerWidth}px`;
          canvas.style.height = `${window.innerHeight}px`;
          ctx?.scale(ratio, ratio);
          ctx?.drawImage(img, 0, 0, window.innerWidth, window.innerHeight);
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

  // Scoped scroll progress — only tracks the container div
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  const drawFrame = (idx: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || images.length === 0) return;
    const clamped = Math.min(FRAME_COUNT - 1, Math.max(0, idx));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(images[clamped], 0, 0, canvas.width, canvas.height);
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
      ctx?.scale(ratio, ratio);
      const idx = Math.floor(frameIndex.get());
      drawFrame(idx);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [frameIndex, images]);

  return (
    <section
      ref={containerRef}
      className="relative h-[500vh] w-full"
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

      {/* Text overlays */}
      <motion.div
        className="absolute top-[10vh] left-0 right-0 flex flex-col items-center text-center z-10 pointer-events-none px-4"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.12], [1, 0]) }}
      >
        <span className="text-xs tracking-[0.35em] uppercase text-indigo-400/80 mb-3">Introducing</span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
          NeuralCore <span className="text-gradient">X1</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/40 max-w-md">The Future of AI Processing</p>
      </motion.div>

      <motion.div
        className="absolute top-[120vh] left-8 md:left-16 z-10 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.45], [0, 1, 1, 0]) }}
      >
        <p className="text-sm tracking-[0.25em] uppercase text-indigo-400/60 mb-2">Performance</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white">256 Billion<br />Parameters.</h2>
      </motion.div>

      <motion.div
        className="absolute top-[220vh] right-8 md:right-16 text-right z-10 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.7], [0, 1, 1, 0]) }}
      >
        <p className="text-sm tracking-[0.25em] uppercase text-indigo-400/60 mb-2">Architecture</p>
        <h2 className="text-3xl md:text-5xl font-bold text-white">Built for Speed.<br />Designed for Scale.</h2>
      </motion.div>

      <motion.div
        className="absolute top-[380vh] left-0 right-0 flex flex-col items-center text-center z-10 pointer-events-none px-4"
        style={{ opacity: useTransform(scrollYProgress, [0.8, 0.92], [0, 1]) }}
      >
        <h2 className="text-3xl md:text-5xl font-bold text-white">Power Your Next<br /><span className="text-gradient">Breakthrough.</span></h2>
        <p className="mt-4 text-base text-white/40 max-w-sm">Scroll down to explore more</p>
        <motion.div
          className="mt-6"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ChipScroll;