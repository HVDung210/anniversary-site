type FloatingMascotsProps = {
  variant?: 'start' | 'heart' | 'finale';
};

export default function FloatingMascots({
  variant = 'start',
}: FloatingMascotsProps) {
  return (
    <div
      className={`floating-mascots floating-mascots-${variant}`}
      aria-hidden="true"
    >
      <span className="floating-mascot floating-frog">🐸</span>

      <span className="floating-mascot floating-crown">👑</span>

      <span className="floating-mascot floating-heart floating-heart-1">
        ♥
      </span>

      <span className="floating-mascot floating-heart floating-heart-2">
        ♡
      </span>

      <span className="floating-mascot floating-sparkle floating-sparkle-1">
        ✦
      </span>

      <span className="floating-mascot floating-sparkle floating-sparkle-2">
        ✧
      </span>
    </div>
  );
}