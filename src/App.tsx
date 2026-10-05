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
import MusicControl, {
  type MusicControlHandle,
} from './components/MusicControl';
import AmbientEffects from './components/AmbientEffects';
import { photos } from './data/photos';

export default function App() {
  const [started, setStarted] = useState(false);
  const [activePhoto, setActivePhoto] =
    useState<number | null>(null);

  const musicRef = useRef<MusicControlHandle>(null);
  const { scrollYProgress } = useScroll();

  const visiblePhotos = useMemo(() => photos, []);

  /**
   * Reveal nhẹ từng section khi đi vào viewport.
   */
  useEffect(() => {
    if (!started) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.site .section'
      )
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          entry.target.classList.add(
            'is-section-visible'
          );

          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.08,
      }
    );

    sections.forEach((section) => {
      section.classList.remove(
        'is-section-visible'
      );

      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [started]);

  /**
   * Màn hình bắt đầu là một màn độc lập.
   * Sau khi click mới mount nội dung website.
   */
  const start = async () => {
    await musicRef.current?.playFromStart();

    setStarted(true);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      });
    });
  };

  const openRandom = () => {
    if (visiblePhotos.length === 0) return;

    const random =
      visiblePhotos[
        Math.floor(
          Math.random() * visiblePhotos.length
        )
      ];

    setActivePhoto(random.id);
  };

  /**
   * "Xem lại từ đầu" chỉ quay về Hero.
   * Không quay lại màn "Chạm để bắt đầu"
   * và không dừng nhạc.
   */
  const replay = () => {
    setActivePhoto(null);

    document
      .getElementById('hero')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  };

  return (
    <>
      <AmbientEffects />

      {/*
        MusicControl luôn mount để nút Start
        có thể gọi playFromStart trực tiếp.
        Khi chưa started thì player không hiện.
      */}
      <MusicControl
        ref={musicRef}
        enabled={started}
      />

      <AnimatePresence mode="wait">
        {!started && (
          <StartScreen
            key="start-screen"
            onStart={start}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {started && (
          <motion.main
            key="anniversary-site"
            className="site visible has-section-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
          >
            <motion.div
              className="top-progress"
              style={{
                scaleX: scrollYProgress,
              }}
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
          </motion.main>
        )}
      </AnimatePresence>

      <PhotoViewer
        photos={visiblePhotos}
        activeId={activePhoto}
        onClose={() => setActivePhoto(null)}
        onChange={setActivePhoto}
      />
    </>
  );
}
