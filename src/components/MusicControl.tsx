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
  src: string;
};


function MusicNoteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10 17.5V6.8L18 5v9.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="17.5" r="2.5" fill="currentColor" />
      <circle cx="15.5" cy="14.7" r="2.5" fill="currentColor" />
    </svg>
  );
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return '0:00';
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

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
    title: 'Our song ♡',
    src: '/music/song-01.mp3',
  },
  {
    id: 'song-02',
    title: 'Kỷ niệm thứ hai',
    src: '/music/song-02.mp3',
  },
  {
    id: 'song-03',
    title: 'Kỷ niệm thứ ba',
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
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

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
        setCurrentTime(0);
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
      setCurrentTime(0);
      setDuration(0);
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
    const seekTo = (value: number) => {
      const audio = audioRef.current;

      if (!audio || !Number.isFinite(audio.duration)) {
        return;
      }

      const nextTime = Math.min(
        Math.max(value, 0),
        audio.duration
      );

      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
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
          onTimeUpdate={(event) => {
            setCurrentTime(
              event.currentTarget.currentTime
            );
          }}
          onLoadedMetadata={(event) => {
            const nextDuration =
              event.currentTarget.duration;

            setDuration(
              Number.isFinite(nextDuration)
                ? nextDuration
                : 0
            );
          }}
          onDurationChange={(event) => {
            const nextDuration =
              event.currentTarget.duration;

            setDuration(
              Number.isFinite(nextDuration)
                ? nextDuration
                : 0
            );
          }}
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
                <MusicNoteIcon />
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
                  className={`music-disc ${
                    playing ? 'is-playing' : ''
                  }`}
                  aria-hidden="true"
                >
                  <MusicNoteIcon />
                </span>

                <div>
                  <strong>
                    {currentSong?.title}
                  </strong>
                </div>
              </div>

              <div className="music-progress">
                <input
                  className="music-progress-range"
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={
                    Math.min(
                      currentTime,
                      duration || 0
                    )
                  }
                  onChange={(event) =>
                    seekTo(
                      Number(event.target.value)
                    )
                  }
                  disabled={!duration}
                  aria-label="Tua nhạc"
                />

                <div className="music-progress-time">
                  <span>
                    {formatTime(currentTime)}
                  </span>

                  <span>
                    {formatTime(duration)}
                  </span>
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
