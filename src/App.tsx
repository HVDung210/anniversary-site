import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import StartScreen from './components/StartScreen';
import Hero from './components/Hero';
import Scrapbook from './components/Scrapbook';
import MemoryUniverse from './components/MemoryUniverse';
import PhotoHeart from './components/PhotoHeart';
import MemoryWall from './components/MemoryWall';
import LoveLetter from './components/LoveLetter';
import Finale from './components/Finale';
import PhotoViewer from './components/PhotoViewer';
import MusicControl, { type MusicControlHandle } from './components/MusicControl';
import AmbientEffects from './components/AmbientEffects';
import { photos } from './data/photos';

export default function App() {
  const [started, setStarted] = useState(false);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const musicRef = useRef<MusicControlHandle>(null);
  const { scrollYProgress } = useScroll();

  const visiblePhotos = useMemo(() => photos, []);

  /**
   * Reveal nhẹ từng section khi đi vào viewport.
   * Chỉ animate opacity + transform nên khá nhẹ.
   */
  useEffect(() => {
    if (!started) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.site .section')
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          entry.target.classList.add('is-section-visible');
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08,
      }
    );

    sections.forEach((section) => {
      section.classList.remove('is-section-visible');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [started]);

  /**
   * Vì đây được gọi trực tiếp từ click "Chạm để bắt đầu",
   * trình duyệt cho phép phát audio có tiếng.
   * Bài đầu tiên luôn bắt đầu từ giây 0.
   */
  const start = async () => {
    setStarted(true);

    await musicRef.current?.playFromStart();

    window.setTimeout(
      () =>
        document
          .getElementById('hero')
          ?.scrollIntoView({ behavior: 'smooth' }),
      450
    );
  };

  const openRandom = () => {
    if (visiblePhotos.length === 0) return;

    const random =
      visiblePhotos[Math.floor(Math.random() * visiblePhotos.length)];

    setActivePhoto(random.id);
  };

  const replay = () => {
    musicRef.current?.stop();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.setTimeout(() => {
      setActivePhoto(null);
      setStarted(false);
    }, 500);
  };

  return (
    <>
      {/* Hiệu ứng rơi nhẹ chạy xuyên suốt toàn website. */}
      <AmbientEffects />

      <AnimatePresence>
        {!started && <StartScreen onStart={start} />}
      </AnimatePresence>

      <main
        className={
          started
            ? 'site visible has-section-reveal'
            : 'site has-section-reveal'
        }
      >
        <motion.div
          className="top-progress"
          style={{ scaleX: scrollYProgress }}
        />

        <MusicControl
          ref={musicRef}
          enabled={started}
        />

        <Hero photos={visiblePhotos} />

        <Scrapbook
          photos={visiblePhotos}
          onOpen={setActivePhoto}
        />

        <MemoryUniverse
          photos={visiblePhotos}
          onOpen={setActivePhoto}
        />

        <PhotoHeart
          photos={visiblePhotos}
          onOpen={setActivePhoto}
        />

        <MemoryWall
          photos={visiblePhotos}
          onOpen={setActivePhoto}
          onRandom={openRandom}
        />

        <LoveLetter />

        <Finale onReplay={replay} />
      </main>

      <PhotoViewer
        photos={visiblePhotos}
        activeId={activePhoto}
        onClose={() => setActivePhoto(null)}
        onChange={setActivePhoto}
      />
    </>
  );
}
