import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type Props = {
  enabled: boolean;
};

type Song = {
  id: string;
  title: string;
  artist: string;
  src: string;
};

export type MusicControlHandle = {
  /**
   * Gọi trực tiếp từ nút "Chạm để bắt đầu".
   * Bài đầu tiên luôn phát từ giây 0.
   */
  playFromStart: () => Promise<void>;

  /**
   * Tạm dừng nhưng giữ nguyên vị trí đang nghe.
   */
  pause: () => void;

  /**
   * Dừng và đưa playlist về bài đầu tiên.
   */
  stop: () => void;
};

/**
 * Đặt file MP3 trong public/music rồi khai báo tại đây.
 *
 * Ví dụ:
 * public/music/song-01.mp3
 * public/music/song-02.mp3
 * public/music/song-03.mp3
 */
const songs: Song[] = [
  {
    id: 'song-01',
    title: '50 năm về sau',
    artist: 'Tên ca sĩ',
    src: '/music/song-01.mp3',
  },
  {
    id: 'song-02',
    title: 'Thế giới của anh',
    artist: 'Tên ca sĩ',
    src: '/music/song-02.mp3',
  },
  {
    id: 'song-03',
    title: 'Kho báu',
    artist: 'Tên ca sĩ',
    src: '/music/song-03.mp3',
  },
];

const MusicControl = forwardRef<MusicControlHandle, Props>(
  function MusicControl({ enabled }, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(false);

    const currentSong = songs[currentIndex];

    /**
     * Đổi bài trực tiếp trên cùng một thẻ audio.
     * Nhờ vậy đóng panel không làm nhạc dừng hoặc reset.
     */
    const playSong = async (
      index: number,
      restart = true
    ) => {
      const audio = audioRef.current;
      const song = songs[index];

      if (!audio || !song) return;

      setCurrentIndex(index);

      const expectedPath = new URL(
        song.src,
        window.location.origin
      ).href;

      if (audio.src !== expectedPath) {
        audio.src = song.src;
        audio.load();
      }

      if (restart) {
        audio.currentTime = 0;
      }

      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };

    const pause = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.pause();
      setPlaying(false);
    };

    const stop = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.pause();
      audio.currentTime = 0;

      const firstSong = songs[0];

      if (firstSong) {
        audio.src = firstSong.src;
        audio.load();
      }

      setCurrentIndex(0);
      setPlaying(false);
      setOpen(false);
    };

    useImperativeHandle(
      ref,
      () => ({
        playFromStart: async () => {
          await playSong(0, true);
        },
        pause,
        stop,
      }),
      []
    );

    /**
     * Click ra ngoài chỉ đóng panel.
     * Audio vẫn tồn tại nên nhạc tiếp tục chạy nền.
     */
    useEffect(() => {
      if (!open) return;

      const onPointerDown = (event: PointerEvent) => {
        const target = event.target as Node;

        if (
          rootRef.current &&
          !rootRef.current.contains(target)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener(
        'pointerdown',
        onPointerDown
      );

      return () =>
        document.removeEventListener(
          'pointerdown',
          onPointerDown
        );
    }, [open]);

    useEffect(() => {
      if (!open) return;

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpen(false);
        }
      };

      window.addEventListener('keydown', onKeyDown);

      return () =>
        window.removeEventListener(
          'keydown',
          onKeyDown
        );
    }, [open]);

    const playPrevious = async () => {
      const previous =
        (currentIndex - 1 + songs.length) %
        songs.length;

      await playSong(previous, true);
    };

    const playNext = async () => {
      const next =
        (currentIndex + 1) % songs.length;

      await playSong(next, true);
    };

    const togglePlayback = async () => {
      const audio = audioRef.current;

      if (!audio) return;

      if (audio.paused) {
        /**
         * Nếu chưa có src thì phát bài hiện tại từ đầu.
         */
        if (!audio.src) {
          await playSong(currentIndex, true);
          return;
        }

        try {
          await audio.play();
          setPlaying(true);
        } catch {
          setPlaying(false);
        }

        return;
      }

      pause();
    };

    return (
      <div
        ref={rootRef}
        className="music-root"
      >
        {/*
          Thẻ audio luôn được mount kể cả khi chưa vào website.
          Vì vậy nút "Chạm để bắt đầu" có thể gọi play()
          trực tiếp trong user gesture và tránh autoplay block.
        */}
        <audio
          ref={audioRef}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={playNext}
        />

        {enabled && (
          <>
            <button
              type="button"
              className={`music-control ${
                open ? 'is-open' : ''
              }`}
              onClick={() =>
                setOpen((current) => !current)
              }
              aria-expanded={open}
              aria-controls="music-panel"
            >
              <span
                className="music-control-icon"
                aria-hidden="true"
              >
                {playing ? '♫' : '♪'}
              </span>

              <span className="music-control-label">
                {playing
                  ? 'Playing'
                  : 'Our songs'}
              </span>
            </button>

            <aside
              id="music-panel"
              className={`music-panel ${
                open
                  ? 'is-visible'
                  : 'is-hidden'
              }`}
              aria-hidden={!open}
            >
              <div className="music-panel-header">
                <div>
                  <span className="music-kicker">
                    ♡ OUR LITTLE PLAYLIST
                  </span>

                  <h3>
                    Nhạc của chúng mình
                  </h3>
                </div>

                <button
                  type="button"
                  className="music-close"
                  onClick={() => setOpen(false)}
                  aria-label="Đóng danh sách nhạc"
                >
                  ×
                </button>
              </div>

              <div className="music-now-playing">
                <span
                  className="music-disc"
                  aria-hidden="true"
                >
                  {playing ? '♫' : '♪'}
                </span>

                <div>
                  <strong>
                    {currentSong?.title}
                  </strong>

                  <small>
                    {currentSong?.artist}
                  </small>
                </div>
              </div>

              <div className="music-actions">
                <button
                  type="button"
                  onClick={playPrevious}
                  aria-label="Bài trước"
                >
                  ‹
                </button>

                <button
                  type="button"
                  className="music-play-button"
                  onClick={togglePlayback}
                  aria-label={
                    playing
                      ? 'Tạm dừng'
                      : 'Phát nhạc'
                  }
                >
                  {playing ? '❚❚' : '▶'}
                </button>

                <button
                  type="button"
                  onClick={playNext}
                  aria-label="Bài tiếp theo"
                >
                  ›
                </button>
              </div>

              <div className="music-song-list">
                {songs.map((song, index) => {
                  const selected =
                    index === currentIndex;

                  return (
                    <button
                      key={song.id}
                      type="button"
                      className={`music-song ${
                        selected
                          ? 'is-selected'
                          : ''
                      }`}
                      onClick={() =>
                        playSong(index, true)
                      }
                    >
                      <span
                        className="music-song-heart"
                        aria-hidden="true"
                      >
                        {selected
                          ? '♥'
                          : '♡'}
                      </span>

                      <span className="music-song-copy">
                        <strong>
                          {song.title}
                        </strong>

                        <small>
                          {song.artist}
                        </small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>
          </>
        )}
      </div>
    );
  }
);

export default MusicControl;
