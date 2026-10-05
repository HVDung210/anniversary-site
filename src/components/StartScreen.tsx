import { motion } from 'framer-motion';
import FloatingMascots from './FloatingMascots';

type StartScreenProps = {
  onStart: () => void;
};

export default function StartScreen({
  onStart,
}: StartScreenProps) {
  return (
    <motion.section
      className="start-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.025,
      }}
      transition={{
        duration: 0.42,
        ease: 'easeInOut',
      }}
    >
      <div className="start-heart" />

      <FloatingMascots variant="start" />

      <motion.div
        className="start-card glass-card"
        initial={{
          opacity: 0,
          y: 14,
          scale: 0.985,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.65,
          ease: 'easeOut',
        }}
      >
        <div className="eyebrow">
          A LITTLE PLACE FOR US
        </div>

        <h1>congchuacuaanh</h1>

        <div className="anniversary-date">
          10.10.2025
        </div>

        <p className="soft-copy">
          365 days, and still counting...
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={onStart}
        >
          Chạm để bắt đầu ♡
          <span>→</span>
        </button>

        <div className="micro-copy">
          A little place for us
        </div>
      </motion.div>
    </motion.section>
  );
}
