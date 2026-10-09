import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Icon from './Icon';

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
