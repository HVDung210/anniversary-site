import FloatingMascots from './FloatingMascots';

type StartScreenProps = {
  onStart: () => void;
};

export default function StartScreen({
  onStart,
}: StartScreenProps) {
  return (
    <section className="start-screen">
      <div className="start-heart" />

      <FloatingMascots variant="start" />

      <div className="start-card glass-card">
        <div className="eyebrow">
          A LITTLE PLACE FOR US
        </div>

        <h1>
          <span></span> congchuacuaanh
        </h1>

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
      </div>
    </section>
  );
}