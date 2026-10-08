import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type SVGProps,
} from 'react';

type Props = {
  enabled: boolean;
};

type Song = {
  id: string;
  title: string;
  src: string;
};

type RepeatMode = 'off' | 'all' | 'one';

export type MusicControlHandle = {
  playFromStart: () => Promise<void>;
  pause: () => void;
  stop: () => void;
};

/**
 * Đặt file MP3 trong public/music rồi khai báo tại đây.
 */
const songs: Song[] = [
  {
    id: 'song-01',
    title: '50 năm về sau',
    src: '/music/song-01.mp3',
  },
  {
    id: 'song-02',
    title: 'Thế giới của anh',
    src: '/music/song-02.mp3',
  },
  {
    id: 'song-03',
    title: 'Kho báu',
    src: '/music/song-03.mp3',
  },
];

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return '0:00';
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & {
  name:
    | 'music'
    | 'play'
    | 'pause'
    | 'previous'
    | 'next'
    | 'shuffle'
    | 'repeat'
    | 'repeat-one'
    | 'volume'
    | 'chevron'
    | 'close';
}) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
    ...props,
  };

  if (name === 'play') {
    return (
      <svg {...common}>
        <path d="M8.5 6.4v11.2L18 12 8.5 6.4Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === 'pause') {
    return (
      <svg {...common}>
        <path d="M9 7v10M15 7v10" strokeWidth="2.6" />
      </svg>
    );
  }

  if (name === 'previous') {
    return (
      <svg {...common}>
        <path d="M7.5 6.5v11M17 7.5 9.5 12l7.5 4.5v-9Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === 'next') {
    return (
      <svg {...common}>
        <path d="M16.5 6.5v11M7 7.5l7.5 4.5L7 16.5v-9Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === 'shuffle') {
    return (
      <svg {...common}>
        <path d="M4 7h2.4c4.8 0 5.1 10 9.8 10H20" />
        <path d="m17 14 3 3-3 3" />
        <path d="M4 17h2.4c1.7 0 2.9-1.4 4-3" />
        <path d="M13.7 8.2c.7-.7 1.5-1.2 2.5-1.2H20" />
        <path d="m17 4 3 3-3 3" />
      </svg>
    );
  }

  if (name === 'repeat' || name === 'repeat-one') {
    return (
      <svg {...common}>
        <path d="M17 2.8 20.2 6 17 9.2" />
        <path d="M4 10V8a2 2 0 0 1 2-2h14" />
        <path d="m7 21.2-3.2-3.2L7 14.8" />
        <path d="M20 14v2a2 2 0 0 1-2 2H4" />
        {name === 'repeat-one' && (
          <path d="M12 9.6v4.8M10.8 10.8 12 9.6" />
        )}
      </svg>
    );
  }

  if (name === 'volume') {
    return (
      <svg {...common}>
        <path d="M5 10v4h3l4 3V7L8 10H5Z" />
        <path d="M15 9.2a4 4 0 0 1 0 5.6M17.5 7a7 7 0 0 1 0 10" />
      </svg>
    );
  }

  if (name === 'chevron') {
    return (
      <svg {...common}>
        <path d="m8 10 4 4 4-4" />
      </svg>
    );
  }

  if (name === 'close') {
    return (
      <svg {...common}>
        <path d="m8 8 8 8M16 8l-8 8" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M9 18V6.8L19 4.5v10.8" />
      <circle cx="6.7" cy="18.1" r="2.7" fill="currentColor" stroke="none" />
      <circle cx="16.7" cy="15.2" r="2.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

const MusicControl = forwardRef<MusicControlHandle, Props>(
  function MusicControl({ enabled }, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.72);
    const [shuffle, setShuffle] = useState(false);
    const [repeatMode, setRepeatMode] =
      useState<RepeatMode>('all');

    const currentSong = songs[currentIndex];

    const progressPercent = useMemo(() => {
      if (!duration) return 0;

      return Math.min(
        100,
        Math.max(0, (currentTime / duration) * 100)
      );
    }, [currentTime, duration]);

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

      audio.volume = volume;

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

      if (songs[0]) {
        audio.src = songs[0].src;
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
      [volume]
    );

    useEffect(() => {
      const audio = audioRef.current;

      if (!audio) return;

      audio.volume = volume;
    }, [volume]);

    /**
     * Click ra ngoài chỉ thu gọn player.
     * Audio vẫn tiếp tục chạy nền.
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

    const getRandomIndex = () => {
      if (songs.length <= 1) {
        return currentIndex;
      }

      let next = currentIndex;

      while (next === currentIndex) {
        next = Math.floor(
          Math.random() * songs.length
        );
      }

      return next;
    };

    const playPrevious = async () => {
      if (shuffle) {
        await playSong(getRandomIndex(), true);
        return;
      }

      const previous =
        (currentIndex - 1 + songs.length) %
        songs.length;

      await playSong(previous, true);
    };

    const playNext = async () => {
      if (shuffle) {
        await playSong(getRandomIndex(), true);
        return;
      }

      const next =
        (currentIndex + 1) % songs.length;

      await playSong(next, true);
    };

    const handleEnded = async () => {
      if (repeatMode === 'one') {
        await playSong(currentIndex, true);
        return;
      }

      const isLast =
        currentIndex === songs.length - 1;

      if (
        repeatMode === 'off' &&
        isLast &&
        !shuffle
      ) {
        setPlaying(false);
        setCurrentTime(duration);
        return;
      }

      await playNext();
    };

    const togglePlayback = async () => {
      const audio = audioRef.current;

      if (!audio) return;

      if (audio.paused) {
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

      if (
        !audio ||
        !Number.isFinite(audio.duration)
      ) {
        return;
      }

      const nextTime = Math.min(
        Math.max(value, 0),
        audio.duration
      );

      audio.currentTime = nextTime;
      setCurrentTime(nextTime);
    };

    const cycleRepeatMode = () => {
      setRepeatMode((current) => {
        if (current === 'off') return 'all';
        if (current === 'all') return 'one';

        return 'off';
      });
    };

    return (
      <div
        ref={rootRef}
        className="music-root"
      >
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
          onEnded={handleEnded}
        />

        {enabled && (
          <>
            <div className="music-mini-player">
              <button
                type="button"
                className="music-mini-main"
                onClick={() =>
                  setOpen((current) => !current)
                }
                aria-expanded={open}
                aria-controls="music-panel"
              >
                <span
                  className={`music-mini-cover ${
                    playing ? 'is-playing' : ''
                  }`}
                  aria-hidden="true"
                >
                  <Icon name="music" />
                </span>

                <span className="music-mini-copy">
                  <strong>
                    {currentSong?.title}
                  </strong>

                  <small>
                    {playing
                      ? 'Đang phát'
                      : 'Đã tạm dừng'}
                  </small>
                </span>

                <span
                  className={`music-mini-chevron ${
                    open ? 'is-open' : ''
                  }`}
                  aria-hidden="true"
                >
                  <Icon name="chevron" />
                </span>
              </button>

              <button
                type="button"
                className="music-mini-play"
                onClick={togglePlayback}
                aria-label={
                  playing
                    ? 'Tạm dừng nhạc'
                    : 'Phát nhạc'
                }
              >
                <Icon
                  name={
                    playing
                      ? 'pause'
                      : 'play'
                  }
                />
              </button>
            </div>

            <aside
              id="music-panel"
              className={`music-panel spotify-like ${
                open
                  ? 'is-visible'
                  : 'is-hidden'
              }`}
              aria-hidden={!open}
            >
              <div className="music-panel-topbar">
                <div>
                  <span className="music-kicker">
                    OUR LITTLE PLAYLIST
                  </span>

                  <h3>
                    Danh sách nhạc
                  </h3>
                </div>

                <button
                  type="button"
                  className="music-close"
                  onClick={() => setOpen(false)}
                  aria-label="Thu gọn trình phát nhạc"
                >
                  <Icon name="close" />
                </button>
              </div>

              <div className="music-hero">
                <div
                  className={`music-cover-large ${
                    playing ? 'is-playing' : ''
                  }`}
                  aria-hidden="true"
                >
                  <div className="music-cover-ring">
                    <Icon name="music" />
                  </div>
                </div>

                <div className="music-track-copy">
                  <span>NOW PLAYING</span>

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
                  value={Math.min(
                    currentTime,
                    duration || 0
                  )}
                  onChange={(event) =>
                    seekTo(
                      Number(event.target.value)
                    )
                  }
                  disabled={!duration}
                  aria-label="Tua nhạc"
                  style={{
                    background: `linear-gradient(
                      90deg,
                      #e77491 0%,
                      #e77491 ${progressPercent}%,
                      #ecdfe2 ${progressPercent}%,
                      #ecdfe2 100%
                    )`,
                  }}
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

              <div className="music-main-controls">
                <button
                  type="button"
                  className={`music-icon-button ${
                    shuffle ? 'is-active' : ''
                  }`}
                  onClick={() =>
                    setShuffle((current) => !current)
                  }
                  aria-label={
                    shuffle
                      ? 'Tắt phát ngẫu nhiên'
                      : 'Bật phát ngẫu nhiên'
                  }
                  aria-pressed={shuffle}
                >
                  <Icon name="shuffle" />
                </button>

                <button
                  type="button"
                  className="music-skip-button"
                  onClick={playPrevious}
                  aria-label="Bài trước"
                >
                  <Icon name="previous" />
                </button>

                <button
                  type="button"
                  className="music-primary-play"
                  onClick={togglePlayback}
                  aria-label={
                    playing
                      ? 'Tạm dừng'
                      : 'Phát nhạc'
                  }
                >
                  <Icon
                    name={
                      playing
                        ? 'pause'
                        : 'play'
                    }
                  />
                </button>

                <button
                  type="button"
                  className="music-skip-button"
                  onClick={playNext}
                  aria-label="Bài tiếp theo"
                >
                  <Icon name="next" />
                </button>

                <button
                  type="button"
                  className={`music-icon-button ${
                    repeatMode !== 'off'
                      ? 'is-active'
                      : ''
                  }`}
                  onClick={cycleRepeatMode}
                  aria-label={`Lặp: ${repeatMode}`}
                >
                  <Icon
                    name={
                      repeatMode === 'one'
                        ? 'repeat-one'
                        : 'repeat'
                    }
                  />
                </button>
              </div>

              <div className="music-volume-row">
                <Icon name="volume" />

                <input
                  className="music-volume-range"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(event) =>
                    setVolume(
                      Number(event.target.value)
                    )
                  }
                  aria-label="Âm lượng"
                  style={{
                    background: `linear-gradient(
                      90deg,
                      #e77491 0%,
                      #e77491 ${volume * 100}%,
                      #ecdfe2 ${volume * 100}%,
                      #ecdfe2 100%
                    )`,
                  }}
                />
              </div>

              <div className="music-queue-header">
                <span>PLAYLIST</span>
                <small>
                  {songs.length} bài
                </small>
              </div>

              <div className="music-song-list spotify-list">
                {songs.map((song, index) => {
                  const selected =
                    index === currentIndex;

                  return (
                    <button
                      key={song.id}
                      type="button"
                      className={`music-song spotify-song ${
                        selected
                          ? 'is-selected'
                          : ''
                      }`}
                      onClick={() =>
                        playSong(index, true)
                      }
                    >
                      <span className="music-song-index">
                        {selected && playing ? (
                          <span
                            className="music-equalizer"
                            aria-hidden="true"
                          >
                            <i />
                            <i />
                            <i />
                          </span>
                        ) : (
                          String(index + 1).padStart(
                            2,
                            '0'
                          )
                        )}
                      </span>

                      <span className="music-song-copy">
                        <strong>
                          {song.title}
                        </strong>

                        <small>
                          {selected
                            ? playing
                              ? 'Đang phát'
                              : 'Đã chọn'
                            : 'Chạm để phát'}
                        </small>
                      </span>

                      {selected && (
                        <span
                          className="music-song-active-dot"
                          aria-hidden="true"
                        />
                      )}
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
