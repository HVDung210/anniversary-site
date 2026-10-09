import {
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Heart, Music2,
  Pause, Play, Repeat, Repeat1, RotateCcw, Shuffle, SkipBack, SkipForward,
  Volume2, X, type LucideProps,
} from 'lucide-react';

const icons = {
  music: Music2,
  play: Play,
  pause: Pause,
  previous: SkipBack,
  next: SkipForward,
  shuffle: Shuffle,
  repeat: Repeat,
  'repeat-one': Repeat1,
  volume: Volume2,
  chevron: ChevronDown,
  close: X,
  left: ChevronLeft,
  right: ChevronRight,
  arrow: ArrowRight,
  replay: RotateCcw,
  heart: Heart,
};

export default function Icon({ name, className = '', ...props }: LucideProps & {
  name: keyof typeof icons;
}) {
  const Component = icons[name];
  return <Component size={24} strokeWidth={1.9} aria-hidden="true" focusable="false" {...props} className={`ui-icon ${className}`} />;
}
