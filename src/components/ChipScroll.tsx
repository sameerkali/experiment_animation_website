import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ChipScroll = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);

  const FRAME_COUNT = 240; // actual number of files in public/sequence

  const formatIndex = (i: number) => String(i).padStart(3, '0');
  const framePath = (i: number) => `/sequence/ezgif-frame-${formatIndex(i)}.jpg`;

  // preload all frames
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    const handleLoad = (img: HTMLImageElement) => {
      loaded += 1;
      // initialize canvas dimensions on first image
      if (loaded === 1) {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          // set size to viewport and scale for high DPI
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
        handleLoad(img); // still count to avoid hang
      };
      imgs.push(img);
    }
  }, []);

  const { scrollYProgress } = useScroll();
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  const drawFrame = (idx: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || images.length === 0) return;
    const clamped = Math.min(FRAME_COUNT - 1, Math.max(0, idx));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw stretched to fill viewport
    ctx.drawImage(images[clamped], 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    if (images.length === FRAME_COUNT) {
      // draw the first frame explicitly
      drawFrame(0);
      const unsubscribe = frameIndex.onChange((v) => {
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
      // redraw current frame
      const idx = Math.floor(frameIndex.get());
      drawFrame(idx);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [frameIndex, images]);

  return (
    <div className="h-[400vh] relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <canvas ref={canvasRef} className="sticky top-0 h-screen w-full" />

      {/* text overlays */}
      <motion.h1
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-4xl font-semibold z-10 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]), filter: 'blur(0.5px)' }}
      >
        NeuralCore X1. The Future of AI.
      </motion.h1>
      <motion.h2
        className="absolute top-1/3 left-4 text-2xl font-medium z-10 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0.25, 0.35], [0, 1]), filter: 'blur(0.5px)' }}
      >
        256 Billion Parameters.
      </motion.h2>
      <motion.h3
        className="absolute top-1/2 right-4 text-2xl font-medium z-10 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0.55, 0.65], [0, 1]), filter: 'blur(0.5px)' }}
      >
        Built for Speed. Designed for Scale.
      </motion.h3>
      <motion.h4
        className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-2xl font-semibold z-10 pointer-events-none"
        style={{ opacity: useTransform(scrollYProgress, [0.85, 1], [0, 1]), filter: 'blur(0.5px)' }}
      >
        Power Your Next Breakthrough.
      </motion.h4>
    </div>
  );
};

export default ChipScroll;