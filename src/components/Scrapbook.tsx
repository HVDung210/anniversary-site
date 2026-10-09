import type { Photo } from '../data/photos';
type Props = { photos: Photo[]; onOpen: (id: number) => void };
const notes = ['our favorite moments ♡', 'still choosing you ♡', 'every photo matters ♡'];

// ID trong data/photos.ts: 11 tương ứng 0011.webp. Thứ tự danh sách là thứ tự hiển thị.
// Bố cục scrapbook hiện có 9 vị trí, nên giữ 9 ID khác nhau.
const SCRAPBOOK_PHOTO_IDS = [9, 16, 17, 18, 19, 22, 28, 37, 41];

export default function Scrapbook({ photos, onOpen }: Props) {
  const picks = SCRAPBOOK_PHOTO_IDS
    .map((id) => photos.find((photo) => photo.id === id))
    .filter((photo): photo is Photo => photo !== undefined);
  return (
    <section className="section scrapbook-section" id="scrapbook">
      <div className="section-inner">
        <div className="section-heading centered">
          <div className="eyebrow">LITTLE MOMENTS, BIG MEMORIES</div>
          <h2>Những điều mình đã giữ lại</h2>
          <p>Những bức ảnh, những khoảnh khắc, những cảm xúc — tất cả đều là một phần của hành trình này.</p>
        </div>
        <div className="scrapbook-board">
          {picks.map((photo, index) => (
            <button className={`scrap-photo scrap-${index + 1}`} key={photo.id} type="button" onClick={() => onOpen(photo.id)} aria-label="Mở một kỷ niệm">
              <span className="tape" />
              <img src={photo.thumb} alt="Kỷ niệm của chúng mình" loading="lazy" decoding="async" width={240} height={240} />
              <span className="photo-caption">{index % 2 === 0 ? 'same sky, same people ♡' : 'good days with you ♡'}</span>
            </button>
          ))}
          {notes.map((note, index) => <div key={note} className={`paper-note note-${index + 1}`}>{note}</div>)}
          <div className="scrap-sticker sticker-frog" aria-hidden="true">🐸</div>
          <div className="scrap-sticker sticker-crown" aria-hidden="true">👑</div>
        </div>
      </div>
    </section>
  );
}
