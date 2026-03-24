import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  startTransition,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Home, 
  Backpack, 
  Book,
  X,
  Diamond,
  Star,
  ArrowLeft,
  Search,
  ArrowRight,
  Scroll,
  PawPrint,
  Sparkles,
  Compass,
  Flower,
  Utensils,
  FlaskConical,
  Repeat,
  ChevronLeft,
  ChevronRight,
  Gem,
  Footprints,
  Menu,
  ShoppingBag,
  Bookmark,
  Pencil,
  Leaf,
  Coffee,
  Brain,
  BookOpen,
  Sprout,
  Baby,
  Mail,
  Gift,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  IMAGES,
  DIARY_CHAPTER_A_HERO_BG,
  MAIN_BG_OPTIONS,
  MARKET_STREET_BG_SRC,
  COURTYARD_HOME_BG_POOL,
  COURTYARD_HOME_BG_COUNT,
  COURTYARD_HOME_SCENE_OPTIONS,
  TRIP_CYCLE_BG_OPTIONS,
  COURTYARD_BG_INDICES,
  type WeatherType,
} from './constants';
import { IMPORTED_DIARY_ENTRIES } from './diaryData';
import { HERBALIST_TRIP_PHOTO_URLS } from './herbalistTripPhotos';
import { pickDialogue, type DialogueTrigger } from './dialogues';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SAVE_API_BASE_URL =
  ((import.meta as unknown as { env?: { VITE_SAVE_API_BASE_URL?: string } }).env
    ?.VITE_SAVE_API_BASE_URL ?? 'http://localhost:8787').replace(/\/$/, '');
const AUTH_TOKEN_KEY = 'elderwood-garden-auth-token';
type AuthMode = 'login' | 'register';

function weatherHeadline(w: WeatherType): string {
  switch (w) {
    case 'autumn':
      return '秋意濃';
    case 'rainy':
      return '雨瀟瀟';
    case 'snowy':
      return '雪霏霏';
    case 'dusk':
      return '暮色柔';
    default:
      return '晴光好';
  }
}

// --- Components ---

const AuthScreen = ({
  mode,
  username,
  password,
  busy,
  error,
  onModeChange,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: {
  mode: AuthMode;
  username: string;
  password: string;
  busy: boolean;
  error: string | null;
  onModeChange: (mode: AuthMode) => void;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
}) => {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#f8f4e9] p-4">
      <div className="w-full max-w-sm rounded-3xl border border-primary/20 bg-white/85 p-5 shadow-xl backdrop-blur">
        <h1 className="font-headline text-2xl text-primary text-center">游此山海</h1>
        <p className="mt-1 text-center text-xs text-on-surface-variant">登录后自动云存档</p>

        <div className="mt-4 grid grid-cols-2 rounded-xl bg-surface-container-low p-1">
          <button
            type="button"
            onClick={() => onModeChange('login')}
            className={cn(
              'rounded-lg py-2 text-sm font-semibold transition-colors',
              mode === 'login' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
            )}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => onModeChange('register')}
            className={cn(
              'rounded-lg py-2 text-sm font-semibold transition-colors',
              mode === 'register' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
            )}
          >
            注册
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <input
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="用户名（3-24位）"
            autoComplete="username"
            className="w-full rounded-xl border border-outline-variant/45 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60"
          />
          <input
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            type="password"
            placeholder="密码（至少6位）"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            className="w-full rounded-xl border border-outline-variant/45 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/60"
          />
        </div>

        {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}

        <button
          type="button"
          onClick={onSubmit}
          disabled={busy}
          className={cn(
            'mt-4 w-full rounded-xl py-2.5 text-sm font-semibold',
            busy ? 'bg-outline-variant/30 text-on-surface-variant' : 'bg-primary text-on-primary'
          )}
        >
          {busy ? '请稍候...' : mode === 'login' ? '登录并进入' : '注册并进入'}
        </button>
      </div>
    </div>
  );
};

const RainEffect = () => {
  const drops = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => {
        const duration = 0.55 + Math.random() * 0.9;
        const length = 8 + Math.random() * 16;
        const drift = -12 + Math.random() * 24;
        return {
          id: i,
          left: `${Math.random() * 100}vw`,
          duration: `${duration.toFixed(2)}s`,
          delay: `${(Math.random() * 2.2).toFixed(2)}s`,
          opacity: 0.18 + Math.random() * 0.45,
          length: `${length.toFixed(1)}px`,
          drift: `${drift.toFixed(1)}px`,
          thickness: `${(0.8 + Math.random() * 1.2).toFixed(2)}px`,
        };
      }),
    []
  );
  return (
    <div className="absolute inset-0 z-[8] pointer-events-none overflow-hidden">
      {drops.map((d) => (
        <div
          key={d.id}
          className="rain-drop"
          style={{
            left: d.left,
            animationDuration: d.duration,
            animationDelay: d.delay,
            opacity: d.opacity,
            height: d.length,
            width: d.thickness,
            ['--rain-drift' as string]: d.drift,
          }}
        />
      ))}
    </div>
  );
};

const LeafEffect = () => {
  const leaves = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        duration: `${Math.random() * 4 + 8}s`,
        delay: `${Math.random() * 5}s`,
      })),
    []
  );
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {leaves.map((l) => (
        <div
          key={l.id}
          className="leaf"
          style={{
            left: l.left,
            animationDuration: l.duration,
            animationDelay: l.delay,
          }}
        >
          🍁
        </div>
      ))}
    </div>
  );
};

const BlossomEffect = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        duration: `${Math.random() * 4 + 8}s`,
        delay: `${Math.random() * 5}s`,
        drift: `${Math.random() * 44 - 22}px`,
      })),
    []
  );
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="blossom"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            ['--blossom-drift' as string]: p.drift,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
};

const FireflyEffect = () => {
  const [touchPoint, setTouchPoint] = useState<{ x: number; y: number } | null>(null);
  const clearTouchTimerRef = useRef<number | null>(null);
  const lights = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        leftPct: Math.random() * 100,
        topPct: 56 + Math.random() * 40,
        duration: `${4 + Math.random() * 5}s`,
        delay: `${Math.random() * 4}s`,
        dx: `${-18 + Math.random() * 36}px`,
        dy: `${-12 + Math.random() * 24}px`,
        scale: `${0.85 + Math.random() * 0.45}`,
      })),
    []
  );

  useEffect(() => {
    const pushAway = (clientX: number, clientY: number) => {
      setTouchPoint({ x: clientX, y: clientY });
      if (clearTouchTimerRef.current) window.clearTimeout(clearTouchTimerRef.current);
      clearTouchTimerRef.current = window.setTimeout(() => setTouchPoint(null), 260);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      pushAway(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      pushAway(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onPointerDown = (e: PointerEvent) => {
      pushAway(e.clientX, e.clientY);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('pointerdown', onPointerDown);
      if (clearTouchTimerRef.current) window.clearTimeout(clearTouchTimerRef.current);
    };
  }, []);

  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 390;
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 844;
  const repelRadiusPx = 92;

  return (
    <div className="pointer-events-none absolute inset-0 z-[12] overflow-hidden">
      {lights.map((l) => {
        let repelX = 0;
        let repelY = 0;
        if (touchPoint) {
          const lx = (l.leftPct / 100) * viewportW;
          const ly = (l.topPct / 100) * viewportH;
          const dx = lx - touchPoint.x;
          const dy = ly - touchPoint.y;
          const dist = Math.hypot(dx, dy);
          if (dist < repelRadiusPx) {
            const strength = (repelRadiusPx - dist) / repelRadiusPx;
            const push = 16 + strength * 40;
            const angle = Math.atan2(dy || 0.001, dx || 0.001);
            repelX = Math.cos(angle) * push;
            repelY = Math.sin(angle) * push;
          }
        }
        return (
          <div
            key={l.id}
            className="firefly-wrap"
            style={{
              left: `${l.leftPct}%`,
              top: `${l.topPct}%`,
              animationDuration: l.duration,
              animationDelay: l.delay,
              ['--firefly-dx' as string]: l.dx,
              ['--firefly-dy' as string]: l.dy,
              ['--firefly-scale' as string]: l.scale,
            }}
          >
            <div
              className="firefly"
              style={{
                ['--repel-x' as string]: `${repelX.toFixed(2)}px`,
                ['--repel-y' as string]: `${repelY.toFixed(2)}px`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const SnowEffect = () => {
  const flakes = useMemo(
    () =>
      Array.from({ length: 72 }, (_, i) => {
        const size = 1.8 + Math.random() * 4.8;
        const drift = -26 + Math.random() * 52;
        return {
          id: i,
          left: `${Math.random() * 100}vw`,
          duration: `${Math.random() * 7 + 6}s`,
          delay: `${Math.random() * 9}s`,
          size,
          drift: `${drift.toFixed(1)}px`,
          opacity: 0.45 + Math.random() * 0.45,
        };
      }),
    []
  );
  return (
    <div className="absolute inset-0 z-[8] pointer-events-none overflow-hidden">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="snow-flake"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            animationDuration: f.duration,
            animationDelay: f.delay,
            opacity: f.opacity,
            ['--snow-drift' as string]: f.drift,
          }}
        />
      ))}
    </div>
  );
};

// --- Modals ---

const ItemModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-on-background/40 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-6 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative max-w-lg w-full max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1.5rem))] overflow-y-auto no-scrollbar parchment-texture rounded-3xl sm:rounded-[2.5rem] p-1 shadow-2xl"
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-container rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-tertiary-container rounded-full blur-[80px]"></div>
          </div>
          
          <div className="relative z-10 p-5 sm:p-8 flex flex-col items-center text-center">
            <div className="relative w-36 h-36 sm:w-48 sm:h-48 mb-6 sm:mb-8 shrink-0">
              <div className="absolute inset-0 bg-surface-container-highest rounded-full opacity-30 blur-xl"></div>
              <img 
                src={IMAGES.ITEM_ECHO} 
                alt="奇珍" 
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl rotate-[-12deg]"
              />
              <div className="absolute top-0 right-0 p-2 bg-white/20 backdrop-blur-md rounded-full shadow-inner">
                <Star className="w-4 h-4 text-tertiary fill-current" />
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <span className="text-secondary font-bold tracking-widest text-xs opacity-80">奇珍異寶</span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-primary tracking-tight">納入迴響</h2>
            </div>

            <div className="flex items-center gap-3 bg-surface-container-low px-6 py-3 rounded-full mb-6 border border-outline-variant/20">
              <Diamond className="w-5 h-5 text-tertiary fill-current" />
              <span className="font-bold text-xl text-on-surface">450 <span className="text-sm font-medium opacity-70">靈石</span></span>
            </div>

            <div className="mb-10 px-4">
              <p className="text-on-surface-variant italic font-body leading-relaxed text-lg">
                「山蛛所織之履，著之可踏雲而行。」
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button type="button" className="flex-1 group relative overflow-hidden px-8 py-5 rounded-xl transition-all duration-500 hover:scale-[1.02] active:scale-95 bg-primary text-on-primary shadow-lg shadow-primary/20">
                <span className="relative z-10 font-bold text-lg tracking-wide">納入</span>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-5 rounded-xl border-2 border-outline-variant font-bold text-lg text-primary tracking-wide hover:bg-surface-container-high transition-colors"
              >
                再想想
              </button>
            </div>

            <button 
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 text-on-surface-variant/40 hover:text-on-surface transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

type DiaryNavTab = 'chapter-a' | 'chapter-b' | 'chapter-c';

type DiaryEntry = {
  level: number;
  chapter: DiaryNavTab;
  title: string;
  body: string;
};

type AtlasEntry = {
  id: string;
  title: string;
  region: 'sky' | 'mountain' | 'sea';
  image: string;
  quote: string;
};

const ATLAS_TOTAL = 100;
const TRIP_BASE_MS = 5 * 60 * 1000;
const TRAVEL_SPIRIT_STONE_BASE = 100;
const TRAVEL_SPIRIT_STONE_PER_LEVEL = 50;
const QIANKUN_DEVICE_ID = 'qiankun-device';
const PREP_VIDEO_DURATION_MS = 2000;
const MEDICINE_BOY_READY_VIDEO_SRC =
  'file:///Users/guocong/Downloads/%E5%B1%B1%E6%B5%B7%E7%BB%8F%E5%9B%BE%E7%89%87/Medicine_boy_move_202603231120.mp4';
const GAME_SAVE_KEY = 'elderwood-garden-save-v1';

/** 临时：按等级上限展示日记条数（用于看排版）。正式游玩请保持 0。 */
const DIARY_LAYOUT_PREVIEW_MAX_LEVEL = 0;

type TripState = {
  startedAt: number;
  finishAt: number;
  /** 出門主界面：TRIP_CYCLE_BG_OPTIONS 下標（六張庭院稿之一，含天氣與文案） */
  travelBgIndex: number;
  /** 本次遊歷對應的圖鑑序號（與解鎖進度一致，供圖鑑條目用） */
  tripPhotoIndex: number;
};

type GameSaveData = {
  herbPatchStock: Record<string, number>;
  /** 药圃长满时刻（ms）；出售竹篓后启动，约 3 分钟回到满圃 */
  herbPatchRegrowEndAt: number | null;
  herbBag: Record<string, number>;
  spiritStones: number;
  ownedCurioIds: string[];
  purchasedFoodCounts: Record<string, number>;
  backpackHerbs: Record<string, number>;
  herbalistXp: number;
  unlockedAtlasCount: number;
  qiankunDeviceCount: number;
  tripState: TripState | null;
  /** 已從信箱領取附禮的信件 id */
  claimedMailIds: string[];
};

const ATLAS_ENTRIES: AtlasEntry[] = Array.from({ length: ATLAS_TOTAL }, (_, i) => {
  const n = i + 1;
  const region = n <= 34 ? 'sky' : n <= 67 ? 'mountain' : 'sea';
  const imagePool = [IMAGES.FOX, IMAGES.BIRD, IMAGES.SPIRIT, IMAGES.QILIN];
  const tripPhoto = HERBALIST_TRIP_PHOTO_URLS[i];
  return {
    id: `atlas-${n}`,
    title: `山海圖鑑 · 第${n}卷`,
    region,
    image: tripPhoto ?? imagePool[i % imagePool.length],
    quote: '山海多靈，觀其形而知其性。',
  };
});

function buildDiaryEntries(unlockedLevel: number): DiaryEntry[] {
  const chapterOrder: DiaryNavTab[] = ['chapter-a', 'chapter-b', 'chapter-c'];
  const source =
    IMPORTED_DIARY_ENTRIES.length > 0
      ? IMPORTED_DIARY_ENTRIES
      : JIANWEN_ENTRIES.map((j, i) => ({ level: i + 1, title: j.title, body: j.body }));

  const levelCap =
    DIARY_LAYOUT_PREVIEW_MAX_LEVEL > 0
      ? DIARY_LAYOUT_PREVIEW_MAX_LEVEL
      : Math.max(0, unlockedLevel);

  const baseSorted = source
    .filter((entry) => entry.level <= levelCap)
    .sort((a, b) => a.level - b.level);

  const entries: DiaryEntry[] = baseSorted.map((entry, i) => ({
    level: entry.level,
    chapter: chapterOrder[i % chapterOrder.length],
    title: entry.title,
    body: entry.body,
  }));

  if (DIARY_LAYOUT_PREVIEW_MAX_LEVEL > 0) {
    let nextLevel = entries.reduce((m, e) => Math.max(m, e.level), 0) + 1;
    if (entries.length === 0) nextLevel = 1;
    while (entries.length < DIARY_LAYOUT_PREVIEW_MAX_LEVEL) {
      const i = entries.length;
      entries.push({
        level: nextLevel,
        chapter: chapterOrder[i % chapterOrder.length],
        title: `（布局预览占位）第 ${nextLevel} 篇`,
        body: '此为临时占位正文，用于凑足 100 篇以检查排版。看完后请将 App.tsx 顶部的 DIARY_LAYOUT_PREVIEW_MAX_LEVEL 改为 0。',
      });
      nextLevel += 1;
    }
  }

  return entries;
}

function getTravelDurationMs(
  foodPrice: number,
  curioPrice: number,
  _qiankunCount: number
): number {
  // 基础 5 分钟：
  // 吃食每升一档缩短 20 秒；道具每升一档缩短 20 秒；
  // 每件乾坤器额外缩短 30 秒，最低 1 分钟。
  const foodTier = getPriceTier(FOOD_PRICE_TIERS, foodPrice);
  const curioTier = getPriceTier(CURIO_PRICE_TIERS, curioPrice);
  const qiankunCount = Math.max(0, Math.floor(_qiankunCount));
  const reduced = TRIP_BASE_MS - (foodTier + curioTier) * 20 * 1000 - qiankunCount * 30 * 1000;
  return Math.max(60 * 1000, reduced);
}

function formatDuration(ms: number): string {
  const sec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const AlmanacModal = ({
  isOpen,
  onClose,
  diaryEntries,
}: {
  isOpen: boolean;
  onClose: () => void;
  diaryEntries: DiaryEntry[];
}) => {
  const [diaryTab, setDiaryTab] = useState<DiaryNavTab>('chapter-a');

  const tabBtn = (id: DiaryNavTab, icon: ReactNode, label: string) => {
    const active = diaryTab === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => setDiaryTab(id)}
        className={cn(
          'relative flex w-[4.75rem] sm:w-24 flex-col items-center justify-center gap-1 py-3 touch-manipulation transition-colors duration-300',
          active ? 'text-primary' : 'text-on-surface-variant/60 hover:text-primary'
        )}
      >
        {active && (
          <div className="absolute inset-0 scale-90 rounded-2xl bg-primary/5" aria-hidden />
        )}
        <div
          className={cn(
            'relative z-[1] mb-0.5 h-1 w-1 rounded-full bg-primary transition-all duration-500',
            active ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          )}
        />
        <span className="relative z-[1]">{icon}</span>
        <span
          className={cn(
            'relative z-[1] font-headline text-[10px] tracking-[0.2em]',
            active ? 'font-bold' : ''
          )}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed inset-0 z-[100] flex flex-col bg-background font-body text-on-background selection:bg-primary-container/30 diary-parchment-texture"
        >
          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30">
            <div className="absolute -left-20 -top-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary-container/25 to-transparent blur-[100px]" />
            <div className="absolute -right-40 bottom-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-secondary-container/25 to-transparent blur-[100px]" />
          </div>

          <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-background/80 px-6 py-4 pt-[max(1rem,env(safe-area-inset-top,0px))] backdrop-blur-xl">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/5"
              aria-label="返回"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <h1 className="font-headline text-xl font-bold tracking-[0.2em] text-primary">山海日記</h1>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/5"
              aria-label="搜尋"
            >
              <Search className="h-5 w-5" strokeWidth={2} />
            </button>
          </header>

          <main className="relative z-10 mx-auto min-h-0 w-full max-w-2xl flex-1 overflow-y-auto px-6 pb-40 pt-[calc(6.25rem+env(safe-area-inset-top,0px))] no-scrollbar">
            <div className="relative z-10 mb-14 text-center">
              <p className="mb-4 font-headline text-sm italic tracking-wide text-on-surface-variant opacity-80">
                山野餘韻，盡付楮墨之間。
              </p>
              <div className="mx-auto h-px w-12 bg-primary/20" />
            </div>
            {diaryTab === 'chapter-a' && (
              <div className="xuan-card ink-bleed-border mb-8 overflow-hidden rounded-2xl p-3">
                <div className="relative aspect-[16/7] overflow-hidden rounded-xl">
                  <img
                    src={DIARY_CHAPTER_A_HERO_BG}
                    alt="卷一背景"
                    className="h-full w-full object-contain bg-stone-100/70 opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent" />
                  <p className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 font-label text-[10px] font-bold tracking-widest text-primary">
                    卷一 · 旅章
                  </p>
                </div>
              </div>
            )}

            <div className="relative z-10 space-y-6">
              {diaryEntries
                .filter((d) => d.chapter === diaryTab)
                .map((entry) => (
                  <article key={`${entry.level}-${entry.title}`} className="xuan-card ink-bleed-border rounded-2xl p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-headline text-sm font-bold text-primary">第 {entry.level} 級日記</p>
                      <span className="font-label text-[10px] tracking-widest text-on-surface-variant">
                        {entry.chapter === 'chapter-a'
                          ? '卷一'
                          : entry.chapter === 'chapter-b'
                            ? '卷二'
                            : '卷三'}
                      </span>
                    </div>
                    <h2 className="mt-3 font-headline text-xl text-on-surface">{entry.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{entry.body}</p>
                  </article>
                ))}
              {diaryEntries.filter((d) => d.chapter === diaryTab).length === 0 && (
                <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-6 text-center text-sm text-on-surface-variant">
                  此章尚未開啟，讓小藥童每次外出可依序解鎖一篇日記。
                </div>
              )}
            </div>

            <button
              type="button"
              className="group fixed bottom-[max(7.5rem,calc(env(safe-area-inset-bottom,0px)+6.5rem))] right-6 z-[60] flex touch-manipulation items-center justify-center"
              aria-label="新篇"
            >
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-transform duration-500 group-hover:scale-125" />
              <div className="relative z-[1] flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary text-on-primary shadow-[0_12px_40px_-12px_rgba(109,92,67,0.45)] transition-all duration-300 hover:scale-110 active:scale-95">
                <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <Pencil className="relative h-7 w-7" strokeWidth={1.75} />
              </div>
              <span className="pointer-events-none absolute right-[4.5rem] whitespace-nowrap rounded-md bg-primary/90 px-3 py-1.5 font-label text-[10px] font-bold tracking-widest text-on-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                新篇
              </span>
            </button>
          </main>

          <nav className="fixed bottom-0 left-0 z-[55] flex w-full items-center justify-around rounded-t-[2.5rem] border-t border-primary/10 bg-background/90 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-4 shadow-[0_-10px_40px_rgba(109,92,67,0.08)] backdrop-blur-2xl">
            {tabBtn('chapter-a', <BookOpen className={cn('h-6 w-6', diaryTab !== 'chapter-a' && 'opacity-70')} strokeWidth={1.5} />, '卷一')}
            {tabBtn('chapter-b', <Scroll className={cn('h-6 w-6', diaryTab !== 'chapter-b' && 'opacity-70')} strokeWidth={1.5} />, '卷二')}
            {tabBtn('chapter-c', <Book className={cn('h-6 w-6', diaryTab !== 'chapter-c' && 'opacity-70')} strokeWidth={1.5} />, '卷三')}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AtlasModal = ({
  isOpen,
  onClose,
  unlockedCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  unlockedCount: number;
}) => {
  const [previewEntry, setPreviewEntry] = useState<AtlasEntry | null>(null);
  const unlockedSet = new Set(ATLAS_ENTRIES.slice(0, unlockedCount).map((e) => e.id));
  const byRegion = {
    sky: ATLAS_ENTRIES.filter((e) => e.region === 'sky'),
    mountain: ATLAS_ENTRIES.filter((e) => e.region === 'mountain'),
    sea: ATLAS_ENTRIES.filter((e) => e.region === 'sea'),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
          className="diary-parchment-texture fixed inset-0 z-[100] flex flex-col overflow-hidden bg-background"
        >
          <div className="parchment-dots pointer-events-none absolute inset-0 opacity-45" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-container/20 via-transparent to-background/30"></div>
          
          {/* Top Bar */}
          <header className="relative z-10 flex items-center justify-between border-b border-primary/10 bg-background/70 px-4 py-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] backdrop-blur-sm sm:px-8 sm:py-6">
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-primary/5 transition-colors text-primary" aria-label="返回">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-serif text-2xl tracking-widest text-primary font-bold">山海图谱</h1>
            <button type="button" className="p-2 rounded-full hover:bg-primary/5 transition-colors text-primary" aria-label="切換">
              <Repeat className="w-6 h-6" />
            </button>
          </header>

          {/* Main Content: 100 cards in 3 positions */}
          <main className="relative z-10 flex-1 px-4 sm:px-8 pb-6 min-h-0 overflow-y-auto no-scrollbar">
            <div className="mb-4 text-center text-on-surface-variant">
              已收录 {Math.min(unlockedCount, ATLAS_TOTAL)} / {ATLAS_TOTAL}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {([
                ['天卷', byRegion.sky],
                ['山卷', byRegion.mountain],
                ['海卷', byRegion.sea],
              ] as const).map(([label, list]) => (
                <section key={label} className="xuan-card ink-bleed-border rounded-2xl p-3">
                  <h3 className="mb-2 text-center font-headline text-sm tracking-widest text-primary">{label}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {list.map((entry) => {
                      const unlocked = unlockedSet.has(entry.id);
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          disabled={!unlocked}
                          onClick={() => unlocked && setPreviewEntry(entry)}
                          aria-label={unlocked ? entry.title : '未解锁图鉴'}
                          className={cn(
                            'overflow-hidden rounded-xl border border-primary/15 bg-white/85 text-left',
                            unlocked ? 'transition-transform hover:scale-[1.02]' : 'cursor-not-allowed'
                          )}
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-stone-100/70">
                            {unlocked ? (
                              <img
                                src={entry.image}
                                alt={entry.title}
                                className="h-full w-full object-cover object-[center_38%] scale-[1.22]"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div
                                className="flex h-full w-full items-center justify-center bg-gradient-to-b from-stone-200/95 to-stone-300/85"
                                aria-hidden
                              >
                                <span className="font-headline text-5xl font-bold text-primary/30">？</span>
                              </div>
                            )}
                          </div>
                          <p className="px-2 py-1 text-[10px] text-[#4d463d] line-clamp-1">
                            {unlocked ? entry.title : '未解鎖圖鑑'}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </main>
          <AnimatePresence>
            {previewEntry && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
                onClick={() => setPreviewEntry(null)}
              >
                <motion.div
                  initial={{ scale: 0.92, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 8 }}
                  className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={previewEntry.image}
                      alt={previewEntry.title}
                      className="h-full w-full object-contain bg-stone-100/70"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="px-4 py-3">
                    <p className="font-headline text-base font-bold text-[#4d463d]">{previewEntry.title}</p>
                    <p className="mt-1 text-xs text-[#4d463d]/70">{previewEntry.quote}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PurseModal = ({
  isOpen,
  onClose,
  spiritStones,
  travelStoneCost,
  herbalistLevel,
}: {
  isOpen: boolean;
  onClose: () => void;
  spiritStones: number;
  travelStoneCost: number;
  herbalistLevel: number;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[115] flex items-end justify-center bg-on-background/60 backdrop-blur-lg p-3 sm:items-center sm:p-6 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 32 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="diary-parchment-texture relative w-full max-w-md max-h-[min(88dvh,calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-2rem))] overflow-y-auto rounded-3xl shadow-2xl no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="parchment-dots pointer-events-none absolute inset-0 opacity-35" />
            <div className="relative p-5 sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200/60 bg-amber-50/90">
                    <Wallet className="h-6 w-6 text-amber-800" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-headline text-xl font-bold text-primary">钱袋</h2>
                    <p className="mt-0.5 text-[11px] text-on-surface-variant">灵石与玩法说明</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high/80"
                  aria-label="关闭"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <section className="mb-6 rounded-2xl border border-primary/20 bg-primary-container/15 px-4 py-4">
                <p className="font-label text-[10px] font-bold tracking-widest text-primary">当前灵石</p>
                <div className="mt-2 flex items-center gap-2">
                  <Diamond className="h-5 w-5 text-tertiary fill-current shrink-0" />
                  <span className="font-headline text-2xl font-bold tabular-nums text-on-surface">{spiritStones}</span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-on-surface-variant">
                  小药童当前 Lv.{herbalistLevel}，每次出发约消耗{' '}
                  <span className="font-semibold text-on-surface tabular-nums">{travelStoneCost}</span> 灵石（基础 100，每升一级
                  +50），另需在行囊备好吃食与市集购买的灵药类道具。
                </p>
              </section>

              <section className="rounded-2xl border border-outline-variant/25 bg-surface-container-low/50 px-4 py-4">
                <p className="font-label text-[10px] font-bold tracking-widest text-secondary">游戏须知 · 玩法解读</p>
                <ul className="mt-3 space-y-2.5 text-[11px] leading-relaxed text-on-surface-variant">
                  <li>
                    <span className="font-semibold text-on-surface">灵石：</span>
                    在市集购买吃食、灵药（古韵遗珍）及乾坤器等；出售药圃草药也可获得。
                  </li>
                  <li>
                    <span className="font-semibold text-on-surface">行囊：</span>
                    灵药可自药圃装入；吃食与灵药道具在市集购入。吃食每升一档减 20 秒，灵药道具每升一档减 20 秒，乾坤器每件再减 30 秒。
                  </li>
                  <li>
                    <span className="font-semibold text-on-surface">出发：</span>
                    在左侧「小药童」卡片中点击「出发」。每次消耗 1 份吃食与 1 件灵药道具；基础 5 分钟，按当次选中的吃食/道具档位缩短时长，最低 1 分钟归来。
                  </li>
                  <li>
                    <span className="font-semibold text-on-surface">游历：</span>
                    进行中主界面会显示回归倒计时与等待提示；归来可获得图鉴进度与见闻经验等。
                  </li>
                  <li>
                    <span className="font-semibold text-on-surface">图鉴与日记：</span>
                    在底部导航进入查看；每次外出会按顺序解锁一篇日记。
                  </li>
                  <li>
                    <span className="font-semibold text-on-surface">存档：</span>
                    进度会自动保存在本机浏览器（localStorage），清除站点数据会丢失进度。
                  </li>
                </ul>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FoodModal = ({
  isOpen,
  onClose,
  spiritStones,
  onBuyFood,
}: {
  isOpen: boolean;
  onClose: () => void;
  spiritStones: number;
  onBuyFood: (id: string, price: number) => boolean;
}) => {
  const foodItems = [
    {
      id: 'food-yunwu' as const,
      name: "雲霧茶",
      desc: "採自崑崙巔峰，飲之可清心明目。",
      price: 50,
      icon: <FlaskConical className="w-8 h-8 text-secondary" />,
      color: "bg-emerald-50"
    },
    {
      id: 'food-shanhai' as const,
      name: "山海糕",
      desc: "以五色土與靈泉水蒸製，入口即化。",
      price: 120,
      icon: <Flower className="w-8 h-8 text-primary" />,
      color: "bg-amber-50"
    },
    {
      id: 'food-feicui' as const,
      name: "翡翠餃",
      desc: "包裹著深海明珠粉，滋補元氣。",
      price: 200,
      icon: <Utensils className="w-8 h-8 text-tertiary" />,
      color: "bg-green-50"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-on-background/60 backdrop-blur-lg flex items-end sm:items-center justify-center p-3 sm:p-6 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 40 }}
            className="diary-parchment-texture relative w-full max-w-md max-h-[min(90dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1rem))] overflow-y-auto no-scrollbar rounded-3xl sm:rounded-[3rem] shadow-2xl"
          >
            <div className="parchment-dots pointer-events-none absolute inset-0 opacity-35" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-primary-container/10" />
            <div className="relative p-5 sm:p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-primary">百味摊</h2>
                  <p className="text-xs font-sans tracking-widest text-on-surface-variant opacity-60">人间百味</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              <div className="space-y-4">
                {foodItems.map((item, i) => {
                  const canBuy = spiritStones >= item.price;
                  return (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/10 sm:hover:border-primary/30 transition-all group"
                    >
                      <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center transition-transform sm:group-hover:scale-110", item.color)}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg font-bold text-on-surface">{item.name}</h3>
                        <p className="text-xs text-on-surface-variant opacity-70 line-clamp-2">{item.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end mb-1">
                          <Diamond className="w-3 h-3 text-tertiary fill-current" />
                          <span className="font-bold text-sm text-on-surface">{item.price}</span>
                        </div>
                        <button
                          type="button"
                          disabled={!canBuy}
                          onClick={() => onBuyFood(item.id, item.price)}
                          className={cn(
                            'px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-colors',
                            canBuy
                              ? 'bg-primary text-on-primary active:scale-95 sm:hover:bg-primary/90'
                              : 'bg-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed'
                          )}
                        >
                          购买
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary opacity-60" />
                  <span className="text-xs font-bold text-on-surface-variant">灵石余额：{spiritStones}</span>
                </div>
                <p className="text-[10px] italic text-on-surface-variant opacity-40">「以食慰心，以味伴途。」</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HERBALIST_RANGE_LABELS = ['庭園周邊', '青丘外徑', '幽谷深處', '秘境墟里', '傳說山海極境'] as const;

type CurioItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: ReactNode;
  color: string;
};

const AncientEchoesModal = ({
  isOpen,
  onClose,
  spiritStones,
  ownedIds,
  onPurchase,
  qiankunCount,
  onBuyQiankun,
}: {
  isOpen: boolean;
  onClose: () => void;
  spiritStones: number;
  ownedIds: string[];
  onPurchase: (id: string, price: number) => void;
  qiankunCount: number;
  onBuyQiankun: (price: number) => void;
}) => {
  const qiankunPrice = 280;
  const curioItems: CurioItem[] = [
    {
      id: 'path-incense',
      name: '引路靈香',
      desc: '燃起後霧中辨向，小藥童可安全多走三里山路。',
      price: 180,
      icon: <Sparkles className="w-8 h-8 text-amber-600" />,
      color: 'bg-amber-50',
    },
    {
      id: 'stride-talisman',
      name: '縮地青符',
      desc: '貼於草履，一日內腳力增倍，採藥半徑大為擴展。',
      price: 260,
      icon: <Scroll className="w-8 h-8 text-primary" />,
      color: 'bg-emerald-50',
    },
    {
      id: 'cloud-pill',
      name: '雲遊養元丹',
      desc: '固本培元，連日趕路不疲，可深入人跡罕至之谷。',
      price: 340,
      icon: <FlaskConical className="w-8 h-8 text-secondary" />,
      color: 'bg-sky-50',
    },
    {
      id: 'mountain-pact',
      name: '山海靈契石',
      desc: '與山野精靈相鳴，得隱徑指引，可抵傳說藥圃。',
      price: 520,
      icon: <Gem className="w-8 h-8 text-tertiary" />,
      color: 'bg-violet-50',
    },
  ];

  const rangeIdx = Math.min(ownedIds.length, HERBALIST_RANGE_LABELS.length - 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="ancient-echoes-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed inset-0 z-[110] flex items-end justify-center bg-black/45 p-3 backdrop-blur-sm sm:items-center sm:p-6 sm:backdrop-blur-md pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]"
        >
          <motion.div
            key="ancient-echoes-panel"
            initial={{ scale: 0.96, y: 28, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 12, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="diary-parchment-texture relative isolate w-full max-w-md max-h-[min(90dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1rem))] overflow-y-auto overflow-x-hidden no-scrollbar rounded-3xl sm:rounded-[3rem] shadow-2xl"
          >
            <div className="parchment-dots pointer-events-none absolute inset-0 opacity-35" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-primary-container/10" />
            <div className="relative p-5 sm:p-8">
              <div className="flex justify-between items-start gap-3 mb-6">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary">古韵遗珍</h2>
                  <p className="text-xs font-sans tracking-widest text-on-surface-variant opacity-70 mt-1">
                    古韵遗珍 · 助小药童走得更远
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 shrink-0 rounded-full hover:bg-surface-container-high transition-colors"
                  aria-label="关闭"
                >
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              <div className="rounded-xl bg-secondary-container/25 border border-secondary/20 px-3 py-2.5 mb-5 flex items-start gap-2">
                <Footprints className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-secondary tracking-wide">小药童可探索</p>
                  <p className="font-headline text-sm text-on-surface mt-0.5">{HERBALIST_RANGE_LABELS[rangeIdx]}</p>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                    每购买一件灵药，行程更进一层（共四件）。
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-tertiary/20 bg-tertiary-container/25 px-3 py-3 mb-5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-widest text-tertiary">加速道具 · 乾坤器</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    基础 5 分钟；吃食/灵药每升一档各减 20 秒，乾坤器每件再减 30 秒（最低 1 分钟）。
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-1 tabular-nums">已持有：{qiankunCount}</p>
                </div>
                <button
                  type="button"
                  disabled={spiritStones < qiankunPrice}
                  onClick={() => onBuyQiankun(qiankunPrice)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-colors whitespace-nowrap',
                    spiritStones >= qiankunPrice
                      ? 'bg-primary text-on-primary active:scale-95 sm:hover:bg-primary/90'
                      : 'bg-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed'
                  )}
                >
                  购买 · {qiankunPrice}
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {curioItems.map((item) => {
                  const owned = ownedIds.includes(item.id);
                  const canBuy = !owned && spiritStones >= item.price;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-colors',
                        owned
                          ? 'bg-surface-container-high/50 border-outline-variant/15 opacity-80'
                          : 'bg-surface-container-lowest border-outline-variant/10 active:border-primary/40 sm:hover:border-primary/30'
                      )}
                    >
                      <div
                        className={cn(
                          'w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shrink-0',
                          item.color
                        )}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-on-surface">{item.name}</h3>
                        <p className="text-[11px] sm:text-xs text-on-surface-variant opacity-85 leading-snug mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end mb-1">
                          <Diamond className="w-3 h-3 text-tertiary fill-current" />
                          <span className="font-bold text-sm text-on-surface">{item.price}</span>
                        </div>
                        <button
                          type="button"
                          disabled={owned || !canBuy}
                          onClick={() => onPurchase(item.id, item.price)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-colors',
                            owned
                              ? 'bg-surface-container-high text-on-surface-variant cursor-default'
                              : canBuy
                                ? 'bg-primary text-on-primary active:scale-95 sm:hover:bg-primary/90'
                                : 'bg-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed'
                          )}
                        >
                          {owned ? '已入行囊' : '购买'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary opacity-60" />
                  <span className="text-xs font-bold text-on-surface-variant">灵石余额：{spiritStones}</span>
                </div>
                <p className="text-[10px] italic text-on-surface-variant opacity-50 max-w-[14rem] text-right">
                  「靈藥相伴，步履所及，即為新境。」
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BACKPACK_CURIO_INFO: Record<string, { name: string; short: string }> = {
  'path-incense': { name: '引路靈香', short: '霧中辨向，可多走三里山路。' },
  'stride-talisman': { name: '縮地青符', short: '一日內腳力增倍，採藥半徑擴展。' },
  'cloud-pill': { name: '雲遊養元丹', short: '固本培元，連日趕路不疲。' },
  'mountain-pact': { name: '山海靈契石', short: '與山野相鳴，得隱徑指引。' },
};
const BACKPACK_CURIO_PRICE: Record<string, number> = {
  'path-incense': 180,
  'stride-talisman': 260,
  'cloud-pill': 340,
  'mountain-pact': 520,
};

const BACKPACK_FOOD_IDS = ['food-yunwu', 'food-shanhai', 'food-feicui'] as const;

const BACKPACK_FOOD_INFO: Record<(typeof BACKPACK_FOOD_IDS)[number], { name: string; short: string }> = {
  'food-yunwu': { name: '雲霧茶', short: '清心明目。' },
  'food-shanhai': { name: '山海糕', short: '靈泉蒸製，入口即化。' },
  'food-feicui': { name: '翡翠餃', short: '明珠粉包裹，滋補元氣。' },
};
const BACKPACK_FOOD_PRICE: Record<(typeof BACKPACK_FOOD_IDS)[number], number> = {
  'food-yunwu': 50,
  'food-shanhai': 120,
  'food-feicui': 200,
};

const FOOD_PRICE_TIERS = [...new Set(Object.values(BACKPACK_FOOD_PRICE))].sort((a, b) => a - b);
const CURIO_PRICE_TIERS = [...new Set(Object.values(BACKPACK_CURIO_PRICE))].sort((a, b) => a - b);

function getPriceTier(tiers: number[], price: number): number {
  const idx = tiers.indexOf(price);
  if (idx >= 0) return idx;
  let fallback = 0;
  for (let i = 0; i < tiers.length; i += 1) {
    if (price >= tiers[i]!) fallback = i;
  }
  return fallback;
}

function totalFoodInRecord(counts: Record<string, number>): number {
  return BACKPACK_FOOD_IDS.reduce((n, id) => n + (counts[id] ?? 0), 0);
}

function selectTripFoodId(counts: Record<string, number>): (typeof BACKPACK_FOOD_IDS)[number] | null {
  let picked: (typeof BACKPACK_FOOD_IDS)[number] | null = null;
  for (const id of BACKPACK_FOOD_IDS) {
    if ((counts[id] ?? 0) <= 0) continue;
    if (!picked || BACKPACK_FOOD_PRICE[id] > BACKPACK_FOOD_PRICE[picked]) picked = id;
  }
  return picked;
}

function selectTripCurioId(ownedCurioIds: string[]): string | null {
  let picked: string | null = null;
  for (const id of ownedCurioIds) {
    if (!(id in BACKPACK_CURIO_PRICE)) continue;
    if (!picked || BACKPACK_CURIO_PRICE[id] > BACKPACK_CURIO_PRICE[picked]) picked = id;
  }
  return picked;
}

const HERBALIST_XP_TICK = 10;
const HERBALIST_XP_PER_LEVEL = 100;
const HERBALIST_XP_INTERVAL_MS = 12_000;

function getHerbalistLevel(totalXp: number): number {
  const xp = Math.max(0, Math.floor(totalXp));
  return Math.floor(xp / HERBALIST_XP_PER_LEVEL) + 1;
}

/** 每次出发灵石：Lv.1 为 100，每升一级 +50 */
function getTravelSpiritStoneCost(herbalistLevel: number): number {
  const lv = Math.max(1, herbalistLevel);
  return TRAVEL_SPIRIT_STONE_BASE + (lv - 1) * TRAVEL_SPIRIT_STONE_PER_LEVEL;
}

function herbalistXpBarFraction(totalXp: number): number {
  const xp = Math.max(0, Math.floor(totalXp));
  return (xp % HERBALIST_XP_PER_LEVEL) / HERBALIST_XP_PER_LEVEL;
}

/** 升至 Lv.2 起每級一篇見聞 */
const JIANWEN_ENTRIES: { title: string; body: string }[] = [
  { title: '石橋與苔', body: '過溪時見老苔如毯，蛙聲三兩，水氣沾衣而不寒。' },
  { title: '樵夫的笛', body: '山腰有人吹笛不成調，卻與松風相和，小藥童佇聽良久。' },
  { title: '野寺鐘聲', body: '暮雲低垂處一鐘遙遙，僧未見，只餘香灰味隨風而至。' },
  { title: '狐的足印', body: '雪泥上梅花似的爪痕，引向竹林深處，終不見其形。' },
  { title: '賣茶老嫗', body: '路口茶攤無招牌，嫗言此水來自雲縫，飲後舌底微甘。' },
  { title: '斷碑半字', body: '荒草中殘碑僅餘「靈」「澤」二字，筆意遒勁，似前朝遺墨。' },
  { title: '流螢之夜', body: '夏夜歇於田埂，流螢如細雨逆飛，照見腳邊一叢石葦。' },
  { title: '渡口的霧', body: '晨霧濃時渡船不發，艄公煮薑湯分與等候的人，話裡盡是舊年水患。' },
  { title: '崖邊的蘭', body: '絕壁一縷幽香，非人力可及，只記其氣清冽如泉。' },
  { title: '市集謠曲', body: '孩童齊唱不知名謠，詞裡有「山海」「歸舟」，聽者各解其意。' },
  { title: '月與潮信', body: '夜宿海邊茅亭，月小如眉，老人說潮來時沙上會現貝紋圖案。' },
];

const BACKPACK_DECOR_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCFw9KnKg1UP6YT-e07j5fRr1OBddpfGlM7jyb4cik_Q90B0ym81KMlreMI_TE-jQvHtWjYpTiUNHPGHo96muv7t6qbgY9XFmScd8SBORh9rkKSv5YIWPLpwEnhIS-qB8uZR5AzbznxZtUAvT8TZW5PHSyyZH8kVdoXg7wBmnNJnzD8vtPBFzBFkgjzrEnWh_eVokyVp5-l3Q1yeSbzEnAftguMuYWkaLn0pXae5QnIWqDtNq8RPMsutevmU6tBbyrBVQ1VFLlLD6Qz';

const HERB_PATCHES: {
  id: string;
  name: string;
  pricePerUnit: number;
  maxOnPlant: number;
  patchClass: string;
}[] = [
  { id: 'lingzhi', name: '靈芝', pricePerUnit: 18, maxOnPlant: 6, patchClass: 'bg-rose-50/90' },
  { id: 'huangjing', name: '黃精', pricePerUnit: 12, maxOnPlant: 7, patchClass: 'bg-amber-50/90' },
  { id: 'dangshen', name: '黨參', pricePerUnit: 10, maxOnPlant: 7, patchClass: 'bg-orange-50/80' },
  { id: 'gouqi', name: '枸杞', pricePerUnit: 8, maxOnPlant: 8, patchClass: 'bg-red-50/70' },
  { id: 'juhua', name: '野菊', pricePerUnit: 6, maxOnPlant: 10, patchClass: 'bg-yellow-50/85' },
  { id: 'zhuye', name: '淡竹葉', pricePerUnit: 9, maxOnPlant: 7, patchClass: 'bg-emerald-50/85' },
];

/** 药圃自空圃长满一轮耗时 */
const HERB_PATCH_REGROW_MS = 3 * 60 * 1000;

function initialHerbPatchStock(): Record<string, number> {
  return Object.fromEntries(HERB_PATCHES.map((p) => [p.id, p.maxOnPlant]));
}

function emptyHerbPatchStock(): Record<string, number> {
  return Object.fromEntries(HERB_PATCHES.map((p) => [p.id, 0]));
}

/** 按当前时间与长满时刻同步药圃数量（用于读档与定时生长） */
function herbPatchStockFromRegrowProgress(regrowEndAt: number, now: number): Record<string, number> {
  const start = regrowEndAt - HERB_PATCH_REGROW_MS;
  if (now >= regrowEndAt) return initialHerbPatchStock();
  const p = Math.min(1, Math.max(0, (now - start) / HERB_PATCH_REGROW_MS));
  return Object.fromEntries(
    HERB_PATCHES.map((patch) => [patch.id, Math.floor(patch.maxOnPlant * p)])
  );
}

function totalHerbInRecord(counts: Record<string, number>): number {
  return HERB_PATCHES.reduce((n, p) => n + (counts[p.id] ?? 0), 0);
}

function herbNameById(id: string): string {
  return HERB_PATCHES.find((p) => p.id === id)?.name ?? id;
}

type MailboxReward = {
  spiritStones?: number;
  food?: Partial<Record<(typeof BACKPACK_FOOD_IDS)[number], number>>;
  herbs?: Partial<Record<string, number>>;
  curioIds?: string[];
};

type MailboxLetterDef = {
  id: string;
  from: string;
  title: string;
  body: string;
  rewards: MailboxReward;
};

/** 信箱固定來信：靈獸、古帝與家書附禮 */
const MAILBOX_LETTERS: MailboxLetterDef[] = [
  {
    id: 'mail-mother',
    from: '娘親',
    title: '家書與盤纏',
    body:
      '吾兒：你在山外學藝，娘日夜惦念。村裡換來的銅錢，託行腳商換了靈石一併寄你；另備乾糧與茶，莫餓著自己。天冷加衣，歸期不問，平安就好。',
    rewards: { spiritStones: 120, food: { 'food-yunwu': 2, 'food-shanhai': 1 } },
  },
  {
    id: 'mail-huangdi',
    from: '軒轅氏（黃帝）',
    title: '嘗百草之餘',
    body:
      '後生可鑒：朕昔辨草木，知毒與養。今託靈鳥寄靈芝、枸杞數株，並茶一甌，助爾清心明目。山海路遠，慎之。',
    rewards: { herbs: { lingzhi: 2, gouqi: 4 }, food: { 'food-yunwu': 1 } },
  },
  {
    id: 'mail-yandi',
    from: '神農（炎帝）',
    title: '姜水之贈',
    body:
      '聞爾好採藥。此黃精、黨參乃谷中舊種，可補中益氣。願爾如百草，經霜愈堅。',
    rewards: { herbs: { huangjing: 3, dangshen: 3 }, spiritStones: 60 },
  },
  {
    id: 'mail-xiwangmu',
    from: '西王母',
    title: '崑崙小饋',
    body:
      '瑤池邊新得翡翠餃一籠，甜而不膩；靈石些許，權作壓信。非為所求，僅表相識一場。',
    rewards: { food: { 'food-feicui': 2 }, spiritStones: 200 },
  },
  {
    id: 'mail-fox',
    from: '青丘靈狐',
    title: '尾尖一點心意',
    body:
      '那日爾曾於月門外分半塊糕與我，今日還禮。山海糕乃我族所嗜，願爾歡喜。（字跡細小，似爪尖劃成。）',
    rewards: { food: { 'food-shanhai': 3 } },
  },
  {
    id: 'mail-baize',
    from: '白澤',
    title: '萬靈圖外一章',
    body:
      '知者不言，言者不必盡知。引路靈香一炷，霧中行路可辨三分。附淡竹葉數束，煎水可安神。',
    rewards: { curioIds: ['path-incense'], herbs: { zhuye: 4 } },
  },
  {
    id: 'mail-qilin',
    from: '麒麟',
    title: '仁獸之賀',
    body:
      '仁心之人，當有仁草相伴。野菊、枸杞已裝入囊，不取報答，惟願世間少一處傷痛。',
    rewards: { herbs: { juhua: 5, gouqi: 3 }, spiritStones: 88 },
  },
  {
    id: 'mail-kunpeng',
    from: '鯤鵬（北冥寄語）',
    title: '扶搖小禮',
    body:
      '水擊三千里，不若爾庭中一盞茶。託風送靈石與糕，望爾他日扶搖時，仍記人間煙火味。',
    rewards: { spiritStones: 150, food: { 'food-shanhai': 2, 'food-feicui': 1 } },
  },
];

const MailboxModal = ({
  isOpen,
  onClose,
  claimedIds,
  herbalistLevel,
  onClaim,
}: {
  isOpen: boolean;
  onClose: () => void;
  claimedIds: string[];
  herbalistLevel: number;
  onClaim: (letterId: string) => void;
}) => {
  const [openLetterId, setOpenLetterId] = useState<string | null>(null);
  const unlockedLetterCount = useMemo(
    () => Math.min(MAILBOX_LETTERS.length, Math.max(0, herbalistLevel - 1)),
    [herbalistLevel]
  );
  const unlockedLetters = useMemo(
    () => MAILBOX_LETTERS.slice(0, unlockedLetterCount),
    [unlockedLetterCount]
  );
  const unclaimed = useMemo(
    () => unlockedLetters.filter((l) => !claimedIds.includes(l.id)),
    [claimedIds, unlockedLetters]
  );
  const claimed = useMemo(
    () => unlockedLetters.filter((l) => claimedIds.includes(l.id)),
    [claimedIds, unlockedLetters]
  );
  const nextUnlockLevel = unlockedLetterCount + 2;

  useEffect(() => {
    if (!isOpen) setOpenLetterId(null);
  }, [isOpen]);

  const rewardSummary = (r: MailboxReward) => {
    const parts: string[] = [];
    if (r.spiritStones && r.spiritStones > 0) parts.push(`靈石 ×${r.spiritStones}`);
    if (r.food) {
      for (const id of BACKPACK_FOOD_IDS) {
        const n = r.food[id];
        if (n && n > 0) parts.push(`${BACKPACK_FOOD_INFO[id].name} ×${n}`);
      }
    }
    if (r.herbs) {
      for (const [hid, n] of Object.entries(r.herbs)) {
        if (n && n > 0) parts.push(`${herbNameById(hid)} ×${n}`);
      }
    }
    if (r.curioIds?.length) {
      for (const cid of r.curioIds) {
        parts.push(BACKPACK_CURIO_INFO[cid]?.name ?? cid);
      }
    }
    return parts.length ? parts.join('、') : '（無附禮）';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[108] flex items-end justify-center bg-on-background/55 backdrop-blur-md sm:items-center p-3 sm:p-6 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="diary-parchment-texture relative w-full max-w-md max-h-[min(88dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1rem))] overflow-hidden rounded-3xl border border-primary/15 shadow-2xl"
          >
            <div className="parchment-dots pointer-events-none absolute inset-0 opacity-35" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-secondary-container/15" />
            <div className="relative flex max-h-[inherit] flex-col">
              <div className="flex shrink-0 items-start justify-between gap-3 border-b border-primary/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-container/50 border border-secondary/25">
                    <Mail className="h-6 w-6 text-secondary" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="font-headline text-lg font-bold text-primary">山信箱</h2>
                    <p className="mt-0.5 text-[11px] text-on-surface-variant">
                      每升一級解鎖一封：靈獸與故人寄來的書信、靈藥與吃食
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="關閉"
                  onClick={onClose}
                  className="shrink-0 rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="no-scrollbar flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
                {unlockedLetterCount === 0 && (
                  <p className="py-8 text-center text-sm text-on-surface-variant">
                    尚未收到來信。小藥童達到 Lv.2 後，第一封家書將送達信箱。
                  </p>
                )}
                {unclaimed.length > 0 && (
                  <p className="mb-2 font-label text-[10px] font-bold tracking-widest text-secondary">
                    待領取
                  </p>
                )}
                <ul className="space-y-2">
                  {unclaimed.map((letter) => {
                    const expanded = openLetterId === letter.id;
                    return (
                      <li
                        key={letter.id}
                        className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/70 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenLetterId(expanded ? null : letter.id)}
                          className="flex w-full items-center gap-3 px-3 py-3 text-left touch-manipulation sm:hover:bg-surface-container-high/40"
                        >
                          <Mail className="h-4 w-4 shrink-0 text-primary/80" />
                          <div className="min-w-0 flex-1">
                            <p className="font-headline text-sm font-bold text-on-surface truncate">
                              {letter.title}
                            </p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">自 {letter.from}</p>
                          </div>
                          <Gift className="h-4 w-4 shrink-0 text-tertiary" />
                        </button>
                        {expanded && (
                          <div className="border-t border-outline-variant/15 px-3 pb-3 pt-2 bg-surface/50">
                            <p className="text-xs leading-relaxed text-on-surface whitespace-pre-wrap">
                              {letter.body}
                            </p>
                            <p className="mt-3 text-[10px] font-label font-bold text-on-surface-variant">
                              附禮
                            </p>
                            <p className="text-[11px] text-primary mt-1">{rewardSummary(letter.rewards)}</p>
                            <button
                              type="button"
                              onClick={() => onClaim(letter.id)}
                              className="mt-3 w-full rounded-full bg-primary py-2.5 font-headline text-sm font-bold text-on-primary shadow-md active:scale-[0.98] touch-manipulation sm:hover:opacity-95"
                            >
                              收信並領取附禮
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {unclaimed.length === 0 && unlockedLetterCount > 0 && (
                  <p className="py-8 text-center text-sm text-on-surface-variant">
                    {unlockedLetterCount < MAILBOX_LETTERS.length
                      ? `暫無新信。下一封將於 Lv.${nextUnlockLevel} 送達。`
                      : '全部來信已送達。'}
                  </p>
                )}
                {claimed.length > 0 && (
                  <>
                    <p className="mt-6 mb-2 font-label text-[10px] font-bold tracking-widest text-on-surface-variant">
                      已收存
                    </p>
                    <ul className="space-y-1.5 opacity-80">
                      {claimed.map((letter) => (
                        <li
                          key={letter.id}
                          className="rounded-xl border border-outline-variant/15 bg-surface-container-low/40 px-3 py-2 text-xs text-on-surface-variant"
                        >
                          <span className="font-semibold text-on-surface">{letter.title}</span>
                          <span className="mx-1">·</span>
                          {letter.from}
                          <span className="ml-2 text-[10px] text-primary">已領</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const HerbGatherModal = ({
  isOpen,
  onClose,
  spiritStones,
  patchStock,
  setPatchStock,
  herbBag,
  setHerbBag,
  onSell,
  onPackToBackpack,
  onBeginPatchRegrow,
  herbPatchRegrowEndAt,
  gardenNow,
}: {
  isOpen: boolean;
  onClose: () => void;
  spiritStones: number;
  patchStock: Record<string, number>;
  setPatchStock: Dispatch<SetStateAction<Record<string, number>>>;
  herbBag: Record<string, number>;
  setHerbBag: Dispatch<SetStateAction<Record<string, number>>>;
  onSell: (spiritEarned: number) => void;
  onPackToBackpack: () => void;
  onBeginPatchRegrow: () => void;
  herbPatchRegrowEndAt: number | null;
  gardenNow: number;
}) => {
  const HERB_BAG_MAX_PER_TYPE = 8;

  const harvest = (id: string) => {
    const left = patchStock[id] ?? 0;
    if (left <= 0) return;
    const inBag = herbBag[id] ?? 0;
    if (inBag >= HERB_BAG_MAX_PER_TYPE) return;
    const nextLeft = left - 1;
    setPatchStock((s) => ({ ...s, [id]: left - 1 }));
    setHerbBag((b) => ({ ...b, [id]: (b[id] ?? 0) + 1 }));
    // 草药园只要某株为 0（采空）就开始长：若当前未处于生长中，自动启动下一轮。
    if (nextLeft <= 0 && herbPatchRegrowEndAt == null) {
      onBeginPatchRegrow();
    }
  };

  const bagTotalValue = HERB_PATCHES.reduce((sum, p) => sum + (herbBag[p.id] ?? 0) * p.pricePerUnit, 0);
  const bagCount = HERB_PATCHES.reduce((n, p) => n + (herbBag[p.id] ?? 0), 0);

  const sellAll = () => {
    if (bagTotalValue <= 0) return;
    onSell(bagTotalValue);
    setHerbBag({});
    setPatchStock(emptyHerbPatchStock());
    onBeginPatchRegrow();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[108] flex items-end justify-center bg-on-background/55 backdrop-blur-md sm:items-center p-3 sm:p-6 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]"
        >
          <motion.div
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="diary-parchment-texture relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/10 shadow-[0_24px_60px_-20px_rgba(28,28,23,0.2)]"
          >
            <div className="max-h-[min(88dvh,calc(100dvh-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)-1rem))] overflow-y-auto no-scrollbar">
              <div className="border-b border-primary/10 bg-background/70 px-5 py-4 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-headline text-xl font-bold text-primary tracking-wide">收取草藥</h2>
                    <p className="mt-1 text-[11px] leading-relaxed text-on-surface-variant">
                      點擊藥圃採摘，集滿竹簍後可出售換取靈石。
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="關閉"
                    onClick={onClose}
                    className="shrink-0 rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-surface-container-low/80 px-3 py-2 border border-outline-variant/15">
                  <span className="text-[10px] font-bold text-on-surface-variant tracking-wide">靈石餘額</span>
                  <span className="flex items-center gap-1 font-headline text-sm font-bold text-on-surface tabular-nums">
                    <Diamond className="h-3.5 w-3.5 text-tertiary fill-current" />
                    {spiritStones}
                  </span>
                </div>
              </div>

              <div className="px-4 py-4 sm:px-5">
                <p className="mb-2 font-label text-[10px] font-bold tracking-widest text-secondary">藥圃</p>
                {herbPatchRegrowEndAt != null && gardenNow < herbPatchRegrowEndAt && (
                  <div className="mb-3 rounded-xl border border-secondary/25 bg-secondary-container/20 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2 text-[10px] font-label font-bold text-secondary">
                      <span>生長中</span>
                      <span className="tabular-nums font-semibold text-on-surface-variant">
                        約 {formatDuration(Math.max(0, herbPatchRegrowEndAt - gardenNow))} 長滿
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-outline-variant/25">
                      <div
                        className="h-full rounded-full bg-secondary transition-[width] duration-700 ease-out"
                        style={{
                          width: `${Math.round(
                            Math.min(
                              100,
                              Math.max(
                                0,
                                ((gardenNow - (herbPatchRegrowEndAt - HERB_PATCH_REGROW_MS)) /
                                  HERB_PATCH_REGROW_MS) *
                                  100
                              )
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {HERB_PATCHES.map((p) => {
                    const stock = patchStock[p.id] ?? 0;
                    const inBag = herbBag[p.id] ?? 0;
                    const canPick = stock > 0 && inBag < HERB_BAG_MAX_PER_TYPE;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={!canPick}
                        onClick={() => harvest(p.id)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all touch-manipulation',
                          canPick
                            ? cn(p.patchClass, 'border-primary/15 active:scale-[0.98] hover:shadow-md')
                            : 'border-outline-variant/20 bg-surface-container-high/40 opacity-60'
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-full border border-white/60 bg-white/50 shadow-inner',
                            !canPick && 'grayscale'
                          )}
                        >
                          <Sprout className={cn('h-7 w-7', canPick ? 'text-secondary' : 'text-on-surface-variant')} />
                        </div>
                        <span className="font-headline text-sm font-bold text-on-surface">{p.name}</span>
                        <span className="font-label text-[10px] text-on-surface-variant">
                          可採{' '}
                          <span className="tabular-nums font-semibold text-primary">
                            {canPick ? stock : inBag >= HERB_BAG_MAX_PER_TYPE ? `已满 ${HERB_BAG_MAX_PER_TYPE}` : stock}
                          </span>{' '}
                          · 售{' '}
                          <span className="tabular-nums">{p.pricePerUnit}</span>/株
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-dashed border-outline-variant/35 bg-surface-container-low/50 p-4">
                  <p className="font-label text-[10px] font-bold tracking-widest text-on-surface-variant">竹簍</p>
                  {bagCount === 0 ? (
                    <p className="mt-2 text-sm italic text-on-surface-variant/70">尚空，請從上方藥圃採摘。</p>
                  ) : (
                    <ul className="mt-2 space-y-1 text-sm text-on-surface">
                      {HERB_PATCHES.map((p) => {
                        const n = herbBag[p.id] ?? 0;
                        if (n <= 0) return null;
                        return (
                          <li key={p.id} className="flex justify-between gap-2">
                            <span>{p.name}</span>
                            <span className="tabular-nums text-on-surface-variant">×{n}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-primary/10 pt-3">
                    <span className="text-xs text-on-surface-variant">預估兌換</span>
                    <span className="flex items-center gap-1 font-headline text-sm font-bold text-primary tabular-nums">
                      <Diamond className="h-3.5 w-3.5 text-tertiary fill-current" />
                      {bagTotalValue}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={bagCount <= 0}
                    onClick={onPackToBackpack}
                    className={cn(
                      'mt-4 w-full rounded-full py-3 font-headline text-sm font-bold tracking-widest transition-all touch-manipulation border-2 border-secondary/35',
                      bagCount > 0
                        ? 'bg-secondary-container/40 text-on-surface shadow-sm active:scale-[0.98] sm:hover:bg-secondary-container/55'
                        : 'cursor-not-allowed bg-outline-variant/20 text-on-surface-variant/50 border-transparent'
                    )}
                  >
                    將竹簍靈藥裝入行囊
                  </button>
                  <p className="mt-2 text-center text-[10px] text-on-surface-variant/60">
                    行囊內備有吃食與道具時，即可在左欄「小藥童」卡片點「出發」遊歷。
                  </p>
                  <button
                    type="button"
                    disabled={bagTotalValue <= 0}
                    onClick={sellAll}
                    className={cn(
                      'mt-3 w-full rounded-full py-3 font-headline text-sm font-bold tracking-widest transition-all touch-manipulation',
                      bagTotalValue > 0
                        ? 'bg-primary text-on-primary shadow-md active:scale-[0.98] sm:hover:opacity-95'
                        : 'cursor-not-allowed bg-outline-variant/25 text-on-surface-variant/50'
                    )}
                  >
                    出售草藥換靈石
                  </button>
                  <p className="mt-2 text-center text-[10px] text-on-surface-variant/60">
                    出售後藥圃清空，約 3 分鐘內重新長滿，可再次採摘。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MarketHubModal = ({
  isOpen,
  onClose,
  onFood,
  onEchoes,
  onOpenPurse,
}: {
  isOpen: boolean;
  onClose: () => void;
  onFood: () => void;
  onEchoes: () => void;
  onOpenPurse: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed inset-0 z-[105] overflow-hidden bg-on-background"
      >
        <motion.div
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={MARKET_STREET_BG_SRC}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-on-background/25 via-transparent to-on-background/15 pointer-events-none"
            aria-hidden
          />
        </motion.div>

        <button
          type="button"
          aria-label="返回"
          onClick={onClose}
          className="absolute left-[max(0.5rem,env(safe-area-inset-left,0px))] top-[max(0.5rem,env(safe-area-inset-top,0px))] z-30 flex h-11 w-11 items-center justify-center rounded-full bg-surface/75 text-primary shadow-md backdrop-blur-md active:scale-95 touch-manipulation"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2} />
        </button>

        <button
          type="button"
          aria-label="钱袋"
          title="钱袋"
          onClick={onOpenPurse}
          className="absolute right-[max(0.5rem,env(safe-area-inset-right,0px))] top-[max(0.5rem,env(safe-area-inset-top,0px))] z-30 flex h-11 w-11 items-center justify-center rounded-full border border-amber-100/80 bg-amber-50/95 text-amber-800 shadow-lg backdrop-blur-sm active:scale-95 touch-manipulation"
        >
          <Wallet className="h-5 w-5" strokeWidth={1.75} />
        </button>

        {/* 左前：吃食攤（對應畫面左側竈台與「吃食」） */}
        <button
          type="button"
          onClick={() => {
            onClose();
            requestAnimationFrame(() => onFood());
          }}
          className="absolute bottom-[max(18%,calc(env(safe-area-inset-bottom,0px)+4.5rem))] left-[8%] z-20 flex w-[34%] max-w-[8.5rem] flex-col items-center gap-2 touch-manipulation active:scale-[0.97]"
        >
          <div className="flex h-14 w-14 min-h-11 min-w-11 items-center justify-center rounded-full border border-white/50 bg-surface/88 shadow-lg backdrop-blur-md sm:h-16 sm:w-16">
            <Utensils className="h-7 w-7 text-secondary sm:h-8 sm:w-8" strokeWidth={1.75} />
          </div>
          <span className="rounded-full bg-surface/92 px-3 py-1 text-center font-label text-[10px] font-bold tracking-widest text-on-surface-variant shadow-md backdrop-blur-sm">
            吃食
          </span>
        </button>

        {/* 右前：奇貨攤（對應畫面右側貨攤與靈石晶體一帶） */}
        <button
          type="button"
          onClick={() => {
            onClose();
            requestAnimationFrame(() => onEchoes());
          }}
          className="absolute bottom-[max(20%,calc(env(safe-area-inset-bottom,0px)+5rem))] right-[7%] z-20 flex w-[34%] max-w-[8.5rem] flex-col items-center gap-2 touch-manipulation active:scale-[0.97]"
        >
          <div className="flex h-14 w-14 min-h-11 min-w-11 items-center justify-center rounded-full border border-white/50 bg-surface/88 shadow-lg backdrop-blur-md sm:h-16 sm:w-16">
            <Sparkles className="h-7 w-7 text-primary sm:h-8 sm:w-8" strokeWidth={1.75} />
          </div>
          <span className="rounded-full bg-surface/92 px-3 py-1 text-center font-label text-[10px] font-bold tracking-widest text-on-surface-variant shadow-md backdrop-blur-sm">
            古韻遺珍
          </span>
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

const BackpackModal = ({
  isOpen,
  onClose,
  spiritStones,
  ownedCurioIds,
  purchasedFoodCounts,
  backpackHerbs,
  herbalistXp,
  canHerbalistTravel,
  tripRemainingMs,
  isTraveling,
  travelSpiritStoneCost,
  qiankunCount,
  onStartTravel,
  onGoMarket,
}: {
  isOpen: boolean;
  onClose: () => void;
  spiritStones: number;
  ownedCurioIds: string[];
  purchasedFoodCounts: Record<string, number>;
  backpackHerbs: Record<string, number>;
  herbalistXp: number;
  canHerbalistTravel: boolean;
  tripRemainingMs: number;
  isTraveling: boolean;
  travelSpiritStoneCost: number;
  qiankunCount: number;
  onStartTravel: () => void;
  onGoMarket: () => void;
}) => {
  const hasFood = BACKPACK_FOOD_IDS.some((id) => (purchasedFoodCounts[id] ?? 0) > 0);
  const hasHerb = totalHerbInRecord(backpackHerbs) > 0;
  const hasCurio = ownedCurioIds.length > 0;
  const hasTool = hasCurio || qiankunCount > 0;
  const satchelHasContent = hasFood || hasCurio || hasHerb;
  const herbalistLevel = getHerbalistLevel(herbalistXp);
  const xpBar = herbalistXpBarFraction(herbalistXp);
  const jianwenUnlocked = JIANWEN_ENTRIES.slice(0, Math.max(0, herbalistLevel - 1));

  return (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="fixed inset-0 z-[105] bg-background text-on-surface overflow-y-auto overflow-x-hidden no-scrollbar"
      >
        <div className="fixed inset-0 parchment-dots pointer-events-none z-0 opacity-40" aria-hidden />
        <div
          className="fixed inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none z-0"
          aria-hidden
        />

        <header className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center px-6 sm:px-8 py-4 pt-[max(1rem,env(safe-area-inset-top,0px))] bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              aria-label="返回"
              onClick={onClose}
              className="p-2 -ml-2 rounded-full text-primary hover:bg-surface-container-low/80 transition-colors touch-manipulation"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <h1 className="text-lg sm:text-xl font-headline italic text-primary truncate">行囊</h1>
          </div>
          <div className="flex items-center text-primary/90">
            <Scroll className="w-6 h-6" strokeWidth={1.25} aria-hidden />
          </div>
        </header>

        <main className="relative z-10 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-[max(7rem,env(safe-area-inset-bottom,0px)+5.5rem)] px-6 sm:px-8 max-w-2xl mx-auto min-h-[100dvh]">
          <header className="mb-10 sm:mb-12 text-center">
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-primary tracking-[0.2em] mb-3 sm:mb-4">
              游此山海
            </h2>
            <p className="font-headline text-base sm:text-lg text-on-surface-variant italic opacity-85">
              山水之間，尋藥問道
            </p>
            <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="h-px w-12 bg-outline-variant/40" />
            </div>
          </header>

          <section className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-12">
            <div className="group relative aspect-[4/5] flex flex-col items-center justify-center rounded-xl bg-surface-container-low/50 border border-outline-variant/25 hover:bg-white/60 transition-all duration-500 px-2 py-3">
              <div className="absolute inset-2 border border-dashed border-outline/20 rounded-lg pointer-events-none" />
              <span className="font-headline text-sm text-on-surface-variant/50 mb-2 relative z-[1] shrink-0">靈藥</span>
              {hasHerb ? (
                <div className="relative z-[1] flex w-full min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto text-center">
                  <Leaf className="w-8 h-8 shrink-0 text-secondary/70" strokeWidth={1.25} />
                  <ul className="w-full space-y-0.5 text-[10px] leading-snug text-on-surface">
                    {HERB_PATCHES.map((p) => {
                      const n = backpackHerbs[p.id] ?? 0;
                      if (n <= 0) return null;
                      return (
                        <li key={p.id} className="tabular-nums">
                          {p.name} <span className="text-on-surface-variant">×{n}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="text-primary/35 flex flex-col items-center gap-2 relative z-[1]">
                  <Sprout className="w-10 h-10 sm:w-11 sm:h-11" strokeWidth={1.25} />
                  <p className="font-headline text-sm tracking-[0.2em] opacity-50">空置</p>
                </div>
              )}
            </div>
            <div className="group relative aspect-[4/5] flex flex-col items-center justify-center rounded-xl bg-surface-container-low/50 border border-outline-variant/25 hover:bg-white/60 transition-all duration-500 px-2 py-3">
              <div className="absolute inset-2 border border-dashed border-outline/20 rounded-lg pointer-events-none" />
              <span className="font-headline text-sm text-on-surface-variant/50 mb-2 relative z-[1] shrink-0">乾糧</span>
              {hasFood ? (
                <div className="relative z-[1] flex w-full min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto text-center">
                  <Utensils className="w-8 h-8 shrink-0 text-primary/45" strokeWidth={1.25} />
                  <ul className="w-full space-y-0.5 text-[10px] leading-snug text-on-surface">
                    {BACKPACK_FOOD_IDS.map((fid) => {
                      const n = purchasedFoodCounts[fid] ?? 0;
                      if (n <= 0) return null;
                      const meta = BACKPACK_FOOD_INFO[fid];
                      return (
                        <li key={fid} className="tabular-nums">
                          {meta.name} <span className="text-on-surface-variant">×{n}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="text-primary/35 flex flex-col items-center gap-2 relative z-[1]">
                  <Utensils className="w-10 h-10 sm:w-11 sm:h-11" strokeWidth={1.25} />
                  <p className="font-headline text-sm tracking-[0.2em] opacity-50">空置</p>
                </div>
              )}
            </div>
            <div className="group relative aspect-[4/5] flex flex-col items-center justify-center rounded-xl bg-surface-container-low/50 border border-outline-variant/25 hover:bg-white/60 transition-all duration-500 px-2 py-3">
              <div className="absolute inset-2 border border-dashed border-outline/20 rounded-lg pointer-events-none" />
              <span className="font-headline text-sm text-on-surface-variant/50 mb-2 relative z-[1] shrink-0">道具</span>
              {hasTool ? (
                <div className="relative z-[1] flex w-full min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto text-center">
                  <Sparkles className="w-8 h-8 shrink-0 text-tertiary/75" strokeWidth={1.25} />
                  <ul className="w-full space-y-0.5 text-[10px] leading-snug text-on-surface">
                    {qiankunCount > 0 && (
                      <li className="tabular-nums">
                        乾坤器 <span className="text-on-surface-variant">×{qiankunCount}</span>
                      </li>
                    )}
                    {ownedCurioIds.map((id) => {
                      const info = BACKPACK_CURIO_INFO[id];
                      return (
                        <li key={id} className="tabular-nums">
                          {info?.name ?? id}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className="text-primary/35 flex flex-col items-center gap-2 relative z-[1]">
                  <Sparkles className="w-10 h-10 sm:w-11 sm:h-11" strokeWidth={1.25} />
                  <p className="font-headline text-sm tracking-[0.2em] opacity-50">空置</p>
                </div>
              )}
            </div>
          </section>

          <p className="mb-6 text-[10px] leading-relaxed text-on-surface-variant/80 text-center px-1">
            备注：吃食每升一档减 20 秒、灵药道具每升一档减 20 秒；乾坤器每件再减 30 秒（最低 1 分钟），且不可单独使用。
          </p>

          <section className="mb-6 rounded-2xl border border-secondary/20 bg-secondary-container/15 px-4 py-3.5">
            <div className="flex items-start gap-3">
              <Baby className="w-9 h-9 shrink-0 text-secondary mt-0.5" strokeWidth={1.25} />
              <div className="min-w-0 flex-1 text-left">
                <p className="font-headline text-sm font-bold text-on-surface">
                  小藥童 · Lv.{herbalistLevel}
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                  {canHerbalistTravel
                    ? isTraveling
                      ? `遊歷途中，剩餘 ${formatDuration(tripRemainingMs)}`
                      : '整裝待發，點擊按鈕即可出發。'
                    : '待命中。請先備好吃食與道具，即可出門。'}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-outline-variant/25">
                  <div
                    className="h-full rounded-full bg-secondary transition-[width] duration-500 ease-out"
                    style={{ width: `${Math.round(xpBar * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant/80 mt-1 tabular-nums">
                  經驗 {herbalistXp} · 基礎 5:00 / 次
                </p>
                <p className="text-[10px] text-on-surface-variant/75 mt-1">
                  出发消耗 {travelSpiritStoneCost} 灵石（基础 100，每升一级 +50）
                </p>
                <button
                  type="button"
                  disabled={!canHerbalistTravel || isTraveling}
                  onClick={onStartTravel}
                  className={cn(
                    'mt-3 w-full max-w-[16rem] min-h-[3rem] rounded-2xl px-5 py-3 text-sm sm:text-base font-label font-bold tracking-[0.15em] transition-all touch-manipulation',
                    canHerbalistTravel && !isTraveling
                      ? 'bg-secondary text-secondary-on-container shadow-md active:scale-[0.98] sm:hover:opacity-90'
                      : 'cursor-not-allowed bg-outline-variant/25 text-on-surface-variant/55'
                  )}
                >
                  {isTraveling ? '遊歷中' : '點擊出發'}
                </button>
              </div>
            </div>
          </section>

          <section className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
              <h3 className="font-headline text-lg sm:text-xl text-primary shrink-0">庫藏</h3>
              <div className="flex items-center gap-1.5 text-sm text-on-surface-variant shrink-0" title="靈石餘額">
                <Wallet className="w-4 h-4 text-primary/60" />
                <span className="font-label font-semibold tabular-nums">{spiritStones}</span>
              </div>
              <div className="h-px flex-1 min-w-[2rem] bg-outline-variant/30" />
            </div>
          </section>

          <section className="relative pb-16">
            <div
              className={cn(
                'group/satchel w-full min-h-[min(400px,55dvh)] flex flex-col items-center rounded-3xl border-2 border-dashed border-outline-variant/35 p-8 sm:p-12 text-center transition-colors duration-700',
                !satchelHasContent
                  ? 'justify-center bg-white/25 hover:bg-surface-container-low/35'
                  : 'justify-start bg-white/20'
              )}
            >
              {!satchelHasContent ? (
                <>
                  <div className="relative mb-6">
                    <ShoppingBag
                      className="w-[4.5rem] h-[4.5rem] sm:w-24 sm:h-24 text-primary/15 group-hover/satchel:text-primary/25 transition-colors duration-500"
                      strokeWidth={1}
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-primary/5 blur-xl rounded-full" />
                  </div>
                  <p className="font-headline text-on-surface-variant/65 leading-loose tracking-wider max-w-[15rem] text-sm sm:text-base">
                    行囊尚空。
                    <br />
                    市肆購買吃食與道具後，小藥童便可遠行。
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onGoMarket();
                    }}
                    className="mt-8 px-8 py-3 rounded-full bg-primary text-on-primary font-label text-sm tracking-[0.25em] shadow-[0_8px_30px_-12px_rgba(28,28,23,0.25)] hover:scale-[1.03] active:scale-[0.98] transition-transform duration-300 touch-manipulation"
                  >
                    前往集市
                  </button>
                </>
              ) : (
                <>
                  <div className="relative mb-5 shrink-0">
                    <Backpack className="w-14 h-14 text-primary/20" strokeWidth={1.15} />
                  </div>
                  <ul className="w-full max-w-md space-y-4 text-left">
                    {HERB_PATCHES.map((p) => {
                      const n = backpackHerbs[p.id] ?? 0;
                      if (n <= 0) return null;
                      return (
                        <li
                          key={p.id}
                          className="rounded-2xl bg-surface-container-low/90 px-4 py-3.5 shadow-[0_2px_24px_-8px_rgba(28,28,23,0.08)]"
                        >
                          <p className="font-headline font-bold text-on-surface">
                            {p.name}
                            <span className="ml-2 text-sm font-label font-semibold text-on-surface-variant tabular-nums">
                              ×{n}
                            </span>
                          </p>
                          <p className="text-[10px] font-label uppercase tracking-widest text-secondary/80 mt-1">靈藥</p>
                          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                            藥圃所採，已備於行囊。
                          </p>
                        </li>
                      );
                    })}
                    {BACKPACK_FOOD_IDS.map((fid) => {
                      const n = purchasedFoodCounts[fid] ?? 0;
                      if (n <= 0) return null;
                      const info = BACKPACK_FOOD_INFO[fid];
                      return (
                        <li
                          key={fid}
                          className="rounded-2xl bg-surface-container-low/90 px-4 py-3.5 shadow-[0_2px_24px_-8px_rgba(28,28,23,0.08)]"
                        >
                          <p className="font-headline font-bold text-on-surface">
                            {info.name}
                            <span className="ml-2 text-sm font-label font-semibold text-on-surface-variant tabular-nums">
                              ×{n}
                            </span>
                          </p>
                          <p className="text-[10px] font-label uppercase tracking-widest text-secondary/80 mt-1">吃食</p>
                          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">{info.short}</p>
                        </li>
                      );
                    })}
                    {qiankunCount > 0 && (
                      <li className="rounded-2xl bg-surface-container-low/90 px-4 py-3.5 shadow-[0_2px_24px_-8px_rgba(28,28,23,0.08)]">
                        <p className="font-headline font-bold text-on-surface">
                          乾坤器
                          <span className="ml-2 text-sm font-label font-semibold text-on-surface-variant tabular-nums">
                            ×{qiankunCount}
                          </span>
                        </p>
                        <p className="text-[10px] font-label uppercase tracking-widest text-tertiary/90 mt-1">道具</p>
                        <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                          每件可額外縮短 30 秒，最低外出時長為 1 分鐘。
                        </p>
                      </li>
                    )}
                    {ownedCurioIds.map((id) => {
                      const info = BACKPACK_CURIO_INFO[id];
                      return (
                        <li
                          key={id}
                          className="rounded-2xl bg-surface-container-low/90 px-4 py-3.5 shadow-[0_2px_24px_-8px_rgba(28,28,23,0.08)]"
                        >
                          <p className="font-headline font-bold text-on-surface">{info?.name ?? id}</p>
                          <p className="text-[10px] font-label uppercase tracking-widest text-tertiary/90 mt-1">靈物</p>
                          {info && (
                            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">{info.short}</p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onGoMarket();
                    }}
                    className="mt-8 px-6 py-2.5 rounded-full border border-outline-variant/40 text-primary font-label text-xs tracking-widest hover:bg-surface-container-low/60 transition-colors touch-manipulation"
                  >
                    前往集市
                  </button>
                </>
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 sm:-left-10 opacity-[0.18] pointer-events-none w-40 sm:w-48">
              <img
                src={BACKPACK_DECOR_IMG}
                alt=""
                className="w-full h-auto ink-wash-fade"
                referrerPolicy="no-referrer"
              />
            </div>
          </section>

          {jianwenUnlocked.length > 0 && (
            <section className="relative z-10 pb-8">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-5 h-5 text-primary shrink-0" />
                <h3 className="font-headline text-lg text-primary">見聞錄</h3>
                <div className="h-px flex-1 min-w-[2rem] bg-outline-variant/30" />
              </div>
              <ul className="space-y-3 text-left">
                {jianwenUnlocked.map((jw, idx) => (
                  <li
                    key={`${jw.title}-${idx}`}
                    className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/60 px-4 py-3"
                  >
                    <p className="font-headline text-sm font-bold text-on-surface">{jw.title}</p>
                    <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">{jw.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </motion.div>
    )}
  </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [mainBgIndex, setMainBgIndex] = useState(
    () => Math.floor(Math.random() * COURTYARD_HOME_BG_COUNT)
  );
  const [isAlmanacModalOpen, setIsAlmanacModalOpen] = useState(false);
  const [isAtlasModalOpen, setIsAtlasModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isEchoesModalOpen, setIsEchoesModalOpen] = useState(false);
  const [isMarketHubOpen, setIsMarketHubOpen] = useState(false);
  const [isBackpackOpen, setIsBackpackOpen] = useState(false);
  const [isHerbGatherOpen, setIsHerbGatherOpen] = useState(false);
  const [isPurseModalOpen, setIsPurseModalOpen] = useState(false);
  const [isMailboxModalOpen, setIsMailboxModalOpen] = useState(false);
  const [claimedMailIds, setClaimedMailIds] = useState<string[]>([]);
  const [herbPatchStock, setHerbPatchStock] = useState<Record<string, number>>(initialHerbPatchStock);
  const [herbPatchRegrowEndAt, setHerbPatchRegrowEndAt] = useState<number | null>(null);
  const [gardenClock, setGardenClock] = useState(() => Date.now());
  const [herbBag, setHerbBag] = useState<Record<string, number>>({});
  const [spiritStones, setSpiritStones] = useState(1240);
  const [ownedCurioIds, setOwnedCurioIds] = useState<string[]>([]);
  const [purchasedFoodCounts, setPurchasedFoodCounts] = useState<Record<string, number>>({});
  const [backpackHerbs, setBackpackHerbs] = useState<Record<string, number>>({});
  const [herbalistXp, setHerbalistXp] = useState(0);
  const [unlockedAtlasCount, setUnlockedAtlasCount] = useState(0);
  const [qiankunDeviceCount, setQiankunDeviceCount] = useState(0);
  const [tripState, setTripState] = useState<TripState | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [levelUpToast, setLevelUpToast] = useState<string | null>(null);
  const [departFailToast, setDepartFailToast] = useState<string | null>(null);
  const [herbalistLine, setHerbalistLine] = useState<string | null>(null);
  const [herbalistLineUntil, setHerbalistLineUntil] = useState(0);
  const departFailToastTimerRef = useRef<number | null>(null);
  const lastHerbalistLineIdRef = useRef<string | null>(null);
  const herbalistLineHistoryRef = useRef<string[]>([]);
  const herbalistClickTimesRef = useRef<number[]>([]);
  const prevTripStateRef = useRef<TripState | null>(null);
  const lastWeatherTriggerRef = useRef<'RAIN' | 'SNOW' | null>(null);
  const [showPrepVideo, setShowPrepVideo] = useState(false);
  const prevHerbalistLevelRef = useRef(getHerbalistLevel(0));
  const prepVideoRef = useRef<HTMLVideoElement | null>(null);
  const prevCanTravelRef = useRef(false);
  const hasTravelStateMountedRef = useRef(false);
  const [authToken, setAuthToken] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : window.localStorage.getItem(AUTH_TOKEN_KEY)
  );
  const [authUsername, setAuthUsername] = useState<string | null>(null);
  const [authBooting, setAuthBooting] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authNameInput, setAuthNameInput] = useState('');
  const [authPasswordInput, setAuthPasswordInput] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [remoteHydrated, setRemoteHydrated] = useState(false);
  const remoteSaveTimerRef = useRef<number | null>(null);
  const bgCount = COURTYARD_HOME_BG_COUNT;
  const safeBgIndex = useMemo(() => {
    if (bgCount <= 0) return 0;
    const i = Number.isFinite(mainBgIndex) ? Math.floor(mainBgIndex) : 0;
    return Math.min(Math.max(0, i), bgCount - 1);
  }, [mainBgIndex, bgCount]);

  useEffect(() => {
    if (safeBgIndex !== mainBgIndex) setMainBgIndex(safeBgIndex);
  }, [safeBgIndex, mainBgIndex]);

  const applyGameSaveData = (parsed: Partial<GameSaveData>) => {
    if (parsed.herbPatchStock && typeof parsed.herbPatchStock === 'object') {
      setHerbPatchStock(parsed.herbPatchStock);
    }
    if (typeof parsed.herbPatchRegrowEndAt === 'number' && Number.isFinite(parsed.herbPatchRegrowEndAt)) {
      const now = Date.now();
      if (parsed.herbPatchRegrowEndAt > now) {
        setHerbPatchRegrowEndAt(parsed.herbPatchRegrowEndAt);
        setHerbPatchStock(herbPatchStockFromRegrowProgress(parsed.herbPatchRegrowEndAt, now));
      } else {
        setHerbPatchRegrowEndAt(null);
        setHerbPatchStock(initialHerbPatchStock());
      }
    }
    if (parsed.herbBag && typeof parsed.herbBag === 'object') setHerbBag(parsed.herbBag);
    if (typeof parsed.spiritStones === 'number') setSpiritStones(parsed.spiritStones);
    if (Array.isArray(parsed.ownedCurioIds)) setOwnedCurioIds(parsed.ownedCurioIds);
    if (parsed.purchasedFoodCounts && typeof parsed.purchasedFoodCounts === 'object') {
      setPurchasedFoodCounts(parsed.purchasedFoodCounts);
    }
    if (parsed.backpackHerbs && typeof parsed.backpackHerbs === 'object') {
      setBackpackHerbs(parsed.backpackHerbs);
    }
    if (typeof parsed.herbalistXp === 'number') {
      setHerbalistXp(parsed.herbalistXp);
      prevHerbalistLevelRef.current = getHerbalistLevel(parsed.herbalistXp);
    }
    if (typeof parsed.unlockedAtlasCount === 'number') setUnlockedAtlasCount(parsed.unlockedAtlasCount);
    if (typeof parsed.qiankunDeviceCount === 'number') setQiankunDeviceCount(parsed.qiankunDeviceCount);
    if (
      parsed.tripState &&
      typeof parsed.tripState === 'object' &&
      typeof parsed.tripState.startedAt === 'number' &&
      typeof parsed.tripState.finishAt === 'number'
    ) {
      const len = TRIP_CYCLE_BG_OPTIONS.length;
      const rawBi = (parsed.tripState as { travelBgIndex?: unknown }).travelBgIndex;
      const travelBgIndex =
        len > 0
          ? typeof rawBi === 'number' && Number.isFinite(rawBi)
            ? Math.min(len - 1, Math.max(0, Math.floor(rawBi)))
            : Math.floor(Math.random() * len)
          : 0;
      const photoLen = HERBALIST_TRIP_PHOTO_URLS.length;
      const rawPi = (parsed.tripState as { tripPhotoIndex?: unknown }).tripPhotoIndex;
      const tripPhotoIndex =
        photoLen > 0
          ? typeof rawPi === 'number' && Number.isFinite(rawPi)
            ? Math.min(photoLen - 1, Math.max(0, Math.floor(rawPi)))
            : Math.min(photoLen - 1, Math.max(0, travelBgIndex % photoLen))
          : 0;
      setTripState({
        startedAt: parsed.tripState.startedAt,
        finishAt: parsed.tripState.finishAt,
        travelBgIndex,
        tripPhotoIndex,
      });
    }
    if (Array.isArray(parsed.claimedMailIds)) {
      setClaimedMailIds(
        parsed.claimedMailIds.filter((id): id is string => typeof id === 'string')
      );
    }
  };

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(GAME_SAVE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<GameSaveData>;
      applyGameSaveData(parsed);
    } catch {
      // Ignore broken local save and continue with defaults.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const bootAuth = async () => {
      if (!authToken) {
        if (!cancelled) {
          setAuthUsername(null);
          setRemoteHydrated(true);
          setAuthBooting(false);
        }
        return;
      }
      try {
        const meRes = await fetch(`${SAVE_API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!meRes.ok) throw new Error('AUTH_INVALID');
        const me = (await meRes.json()) as { username?: string };
        if (cancelled) return;
        setAuthUsername(me.username ?? null);

        const saveRes = await fetch(`${SAVE_API_BASE_URL}/api/save`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (saveRes.ok) {
          const payload = (await saveRes.json()) as { data?: Partial<GameSaveData> | null };
          if (payload.data) applyGameSaveData(payload.data);
        }
        if (!cancelled) setRemoteHydrated(true);
      } catch {
        if (cancelled) return;
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        setAuthToken(null);
        setAuthUsername(null);
        setRemoteHydrated(true);
      } finally {
        if (!cancelled) setAuthBooting(false);
      }
    };
    void bootAuth();
    return () => {
      cancelled = true;
    };
  }, [authToken]);

  const handleAuthSubmit = async () => {
    if (authBusy) return;
    const username = authNameInput.trim();
    const password = authPasswordInput;
    if (username.length < 3) {
      setAuthError('用户名至少 3 位。');
      return;
    }
    if (password.length < 6) {
      setAuthError('密码至少 6 位。');
      return;
    }
    setAuthBusy(true);
    setAuthError(null);
    try {
      const endpoint = authMode === 'register' ? 'register' : 'login';
      const res = await fetch(`${SAVE_API_BASE_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const payload = (await res.json().catch(() => ({}))) as {
        token?: string;
        username?: string;
        error?: string;
      };
      if (!res.ok || !payload.token || !payload.username) {
        throw new Error(payload.error || '登录失败，请重试。');
      }
      window.localStorage.setItem(AUTH_TOKEN_KEY, payload.token);
      setAuthToken(payload.token);
      setAuthUsername(payload.username);
      setAuthPasswordInput('');
      setRemoteHydrated(false);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : '登录失败，请重试。');
    } finally {
      setAuthBusy(false);
    }
  };

  const activeMainAtHome = COURTYARD_HOME_SCENE_OPTIONS[safeBgIndex];
  if (!activeMainAtHome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface p-6 text-center font-body">
        主界面場景配置有誤，請檢查 <code className="text-primary">COURTYARD_HOME_SCENE_OPTIONS</code>。
      </div>
    );
  }

  const tripCycleLen = TRIP_CYCLE_BG_OPTIONS.length;
  const tripTravelBgIdx =
    tripState && tripCycleLen > 0
      ? Math.min(tripCycleLen - 1, Math.max(0, Math.floor(tripState.travelBgIndex)))
      : 0;
  const activeMainTravel = TRIP_CYCLE_BG_OPTIONS[tripTravelBgIdx] ?? activeMainAtHome;
  const activeMain = tripState ? activeMainTravel : activeMainAtHome;
  const weather = activeMain.weather;
  const isHerbalistAtHome = !tripState;
  const isMarketFlowOpen = isMarketHubOpen || isFoodModalOpen || isEchoesModalOpen;
  const isMainGardenTabActive =
    !isMarketFlowOpen &&
    !isBackpackOpen &&
    !isHerbGatherOpen &&
    !isAtlasModalOpen &&
    !isAlmanacModalOpen &&
    !isPurseModalOpen &&
    !isMailboxModalOpen;
  /** 顯示左右翻頁與底欄圓點（出門遊歷時隱藏）；不再響應畫面空白處點擊 */
  const showCourtyardBgControls =
    isMainGardenTabActive && !showPrepVideo && !tripState;
  /** 在家：六張主界面稿之一（每次啟動隨機）；出門：六張「無小藥童」庭院稿隨機其一，天候與畫面一致 */
  const currentBg = tripState ? activeMainTravel.src : COURTYARD_HOME_BG_POOL[safeBgIndex];

  const foodTotal = totalFoodInRecord(purchasedFoodCounts);
  const curioTotal = ownedCurioIds.length;
  const canHerbalistTravel = foodTotal > 0 && curioTotal > 0;
  const tripFoodId = selectTripFoodId(purchasedFoodCounts);
  const tripCurioId = selectTripCurioId(ownedCurioIds);
  const travelDurationMs = getTravelDurationMs(
    tripFoodId ? BACKPACK_FOOD_PRICE[tripFoodId] : 50,
    tripCurioId ? BACKPACK_CURIO_PRICE[tripCurioId] : 180,
    qiankunDeviceCount
  );
  const travelSpiritStoneCost = getTravelSpiritStoneCost(getHerbalistLevel(herbalistXp));

  const triggerDialogue = useCallback(
    (trigger: DialogueTrigger) => {
      if (!isHerbalistAtHome) return;
      const picked = pickDialogue(
        trigger,
        lastHerbalistLineIdRef.current,
        herbalistLineHistoryRef.current
      );
      if (!picked) return;
      lastHerbalistLineIdRef.current = picked.id;
      herbalistLineHistoryRef.current = [...herbalistLineHistoryRef.current.slice(-11), picked.id];
      setHerbalistLine(picked.text);
      setHerbalistLineUntil(Date.now() + 5200);
    },
    [isHerbalistAtHome]
  );

  const handleHerbalistClick = () => {
    if (!isHerbalistAtHome) return;
    const now = Date.now();
    const windowMs = 1200;
    herbalistClickTimesRef.current = herbalistClickTimesRef.current
      .filter((t) => now - t <= windowMs)
      .concat(now);
    const isRapid = herbalistClickTimesRef.current.length >= 4;
    triggerDialogue(isRapid ? 'RAPID_CLICK' : 'CLICK');
  };

  const startTravel = () => {
    if (!canHerbalistTravel || tripState) return;
    const selectedFoodId = selectTripFoodId(purchasedFoodCounts);
    const selectedCurioId = selectTripCurioId(ownedCurioIds);
    if (!selectedFoodId || !selectedCurioId) return;
    const travelMs = getTravelDurationMs(
      BACKPACK_FOOD_PRICE[selectedFoodId],
      BACKPACK_CURIO_PRICE[selectedCurioId],
      qiankunDeviceCount
    );
    const stoneCost = getTravelSpiritStoneCost(getHerbalistLevel(herbalistXp));
    if (spiritStones < stoneCost) {
      if (departFailToastTimerRef.current) window.clearTimeout(departFailToastTimerRef.current);
      setDepartFailToast(`无法出发：灵石不足，需 ${stoneCost} 灵石（当前 Lv.${getHerbalistLevel(herbalistXp)}）。`);
      departFailToastTimerRef.current = window.setTimeout(() => setDepartFailToast(null), 2400);
      return;
    }
    setSpiritStones((n) => n - stoneCost);
    const startAt = Date.now();
    setPurchasedFoodCounts((prev) => {
      const next = { ...prev };
      const n = next[selectedFoodId] ?? 0;
      next[selectedFoodId] = Math.max(0, n - 1);
      return next;
    });
    setOwnedCurioIds((prev) => prev.filter((id) => id !== selectedCurioId));
    setHerbalistLine(null);
    const nTrip = TRIP_CYCLE_BG_OPTIONS.length;
    const travelBgIndex = nTrip > 0 ? Math.floor(Math.random() * nTrip) : 0;
    const photoLen = HERBALIST_TRIP_PHOTO_URLS.length;
    const tripPhotoIndex = photoLen > 0 ? unlockedAtlasCount % photoLen : 0;
    setTripState({
      startedAt: startAt,
      finishAt: startAt + travelMs,
      travelBgIndex,
      tripPhotoIndex,
    });
  };

  const handleDoorwayTravel = () => {
    if (tripState || showPrepVideo) return;
    if (!canHerbalistTravel) {
      if (departFailToastTimerRef.current) window.clearTimeout(departFailToastTimerRef.current);
      setDepartFailToast('无法出发：请先在行囊备好吃食与道具。');
      departFailToastTimerRef.current = window.setTimeout(() => setDepartFailToast(null), 2200);
      return;
    }
    startTravel();
  };
  useEffect(() => {
    if (!hasTravelStateMountedRef.current) {
      hasTravelStateMountedRef.current = true;
      prevCanTravelRef.current = canHerbalistTravel;
      return;
    }

    if (canHerbalistTravel && !prevCanTravelRef.current) {
      // 在市集/子商店内凑齐吃食+道具时不再弹出全屏黑底准备影片（易与购买后的闪屏混淆）
      if (!isMarketFlowOpen) {
        setShowPrepVideo(true);
        const video = prepVideoRef.current;
        if (video) {
          video.currentTime = 0;
          void video.play().catch(() => {
            // Ignore autoplay restrictions.
          });
        }
        const t = window.setTimeout(() => {
          setShowPrepVideo(false);
          if (prepVideoRef.current) prepVideoRef.current.pause();
        }, PREP_VIDEO_DURATION_MS);
        prevCanTravelRef.current = true;
        return () => window.clearTimeout(t);
      }
      prevCanTravelRef.current = true;
      return undefined;
    }

    if (!canHerbalistTravel) prevCanTravelRef.current = false;
  }, [canHerbalistTravel, isMarketFlowOpen]);

  useEffect(() => {
    if (!tripState) return;
    const tickId = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(tickId);
  }, [tripState]);

  useEffect(() => {
    if (!herbalistLine) return;
    const remaining = herbalistLineUntil - Date.now();
    const t = window.setTimeout(() => setHerbalistLine(null), Math.max(250, remaining));
    return () => window.clearTimeout(t);
  }, [herbalistLine, herbalistLineUntil]);

  useEffect(() => {
    if (!tripState) return;
    if (nowMs < tripState.finishAt) return;
    // 回归时：根据出门（游历）时的天气，选取庭院「同天气组」里的其它画面。
    // 这样玩家会在归来后看到与出门天气一致的庭院氛围。
    const tripWeather = TRIP_CYCLE_BG_OPTIONS[tripState.travelBgIndex]?.weather;
    if (tripWeather) {
      const desired = COURTYARD_HOME_SCENE_OPTIONS
        .map((opt, idx) => (opt.weather === tripWeather ? idx : -1))
        .filter((idx) => idx >= 0);
      if (desired.length > 0) {
        const exclude = safeBgIndex;
        const candidates = desired.filter((idx) => idx !== exclude);
        const picked =
          (candidates.length > 0 ? candidates : desired)[Math.floor(Math.random() * (candidates.length > 0 ? candidates : desired).length)];
        setMainBgIndex(picked);
      }
    }
    setTripState(null);
    setHerbalistXp((x) => {
      const nextXp = x + HERBALIST_XP_TICK;
      return nextXp;
    });
    setUnlockedAtlasCount((n) => Math.min(ATLAS_TOTAL, n + 1));
    setLevelUpToast('小藥童外出歸來，帶回一頁新圖鑑。');
    const t = window.setTimeout(() => setLevelUpToast(null), 5000);
    return () => window.clearTimeout(t);
  }, [tripState, nowMs, safeBgIndex]);

  useEffect(() => {
    let timer: number | undefined;
    const wasTraveling = Boolean(prevTripStateRef.current);
    const isTravelingNow = Boolean(tripState);
    if (wasTraveling && !isTravelingNow) {
      timer = window.setTimeout(() => triggerDialogue('RETURN'), 320);
    }
    prevTripStateRef.current = tripState;
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [tripState, triggerDialogue]);

  useEffect(() => {
    return () => {
      if (departFailToastTimerRef.current) window.clearTimeout(departFailToastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const lv = getHerbalistLevel(herbalistXp);
    const prev = prevHerbalistLevelRef.current;
    if (lv > prev) {
      const entry = JIANWEN_ENTRIES[lv - 2];
      setLevelUpToast(entry ? `升至 Lv.${lv} · ${entry.title}` : `升至 Lv.${lv}`);
      triggerDialogue('LEVEL_UP');
      prevHerbalistLevelRef.current = lv;
      const t = window.setTimeout(() => setLevelUpToast(null), 4200);
      return () => window.clearTimeout(t);
    }
    prevHerbalistLevelRef.current = lv;
    return undefined;
  }, [herbalistXp, triggerDialogue]);

  useEffect(() => {
    if (!isHerbalistAtHome || !isMainGardenTabActive || showPrepVideo) return;
    const delay = 22000 + Math.floor(Math.random() * 12000);
    const timer = window.setTimeout(() => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 10) {
        triggerDialogue('MORNING');
        return;
      }
      if (hour >= 21 || hour < 5) {
        triggerDialogue('NIGHT');
        return;
      }
      triggerDialogue('IDLE');
    }, delay);
    return () => window.clearTimeout(timer);
  }, [isHerbalistAtHome, isMainGardenTabActive, showPrepVideo, triggerDialogue]);

  useEffect(() => {
    if (!isHerbalistAtHome) {
      lastWeatherTriggerRef.current = null;
      return;
    }
    const trigger: 'RAIN' | 'SNOW' | null =
      weather === 'rainy' ? 'RAIN' : weather === 'snowy' ? 'SNOW' : null;
    if (!trigger) {
      lastWeatherTriggerRef.current = null;
      return;
    }
    if (lastWeatherTriggerRef.current === trigger) return;
    lastWeatherTriggerRef.current = trigger;
    triggerDialogue(trigger);
  }, [weather, isHerbalistAtHome, triggerDialogue]);

  useEffect(() => {
    if (herbPatchRegrowEndAt == null) return;
    const endAt = herbPatchRegrowEndAt;
    const start = endAt - HERB_PATCH_REGROW_MS;
    const tick = () => {
      const now = Date.now();
      setGardenClock(now);
      if (now >= endAt) {
        setHerbPatchStock(initialHerbPatchStock());
        setHerbPatchRegrowEndAt(null);
        return;
      }
      const p = (now - start) / HERB_PATCH_REGROW_MS;
      setHerbPatchStock((prev) => {
        const next = { ...prev };
        for (const patch of HERB_PATCHES) {
          const target = Math.floor(patch.maxOnPlant * p);
          next[patch.id] = Math.max(next[patch.id] ?? 0, target);
        }
        return next;
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [herbPatchRegrowEndAt]);

  const herbalistLevel = getHerbalistLevel(herbalistXp);
  const herbalistXpBar = herbalistXpBarFraction(herbalistXp);
  const tripRemainingMs = tripState ? Math.max(0, tripState.finishAt - nowMs) : 0;
  // 日记解锁改为与外出次数同步：每次外出解锁 1 篇，按第 1 篇开始顺序出现。
  const diaryEntries = buildDiaryEntries(unlockedAtlasCount);
  const unlockedMailboxCount = Math.min(MAILBOX_LETTERS.length, Math.max(0, herbalistLevel - 1));
  const hasUnreadMailboxLetters = useMemo(() => {
    const unlockedIds = new Set(MAILBOX_LETTERS.slice(0, unlockedMailboxCount).map((l) => l.id));
    return MAILBOX_LETTERS.some((l) => unlockedIds.has(l.id) && !claimedMailIds.includes(l.id));
  }, [claimedMailIds, unlockedMailboxCount]);

  const packHerbsToBackpack = () => {
    setBackpackHerbs((prev) => {
      const next = { ...prev };
      for (const p of HERB_PATCHES) {
        const n = herbBag[p.id] ?? 0;
        if (n > 0) next[p.id] = (next[p.id] ?? 0) + n;
      }
      return next;
    });
    setHerbBag({});
  };

  const goPrevBg = () => {
    const list = COURTYARD_BG_INDICES;
    if (list.length === 0) return;
    const i = list.indexOf(safeBgIndex);
    const at = i < 0 ? 0 : i;
    setMainBgIndex(list[(at - 1 + list.length) % list.length]!);
  };

  const goNextBg = () => {
    const list = COURTYARD_BG_INDICES;
    if (list.length === 0) return;
    const i = list.indexOf(safeBgIndex);
    const at = i < 0 ? 0 : i;
    setMainBgIndex(list[(at + 1) % list.length]!);
  };

  const handleCurioPurchase = (id: string, price: number) => {
    if (ownedCurioIds.includes(id) || spiritStones < price) {
      return;
    }
    startTransition(() => {
      setSpiritStones((s) => s - price);
      setOwnedCurioIds((prev) => [...prev, id]);
    });
  };

  const handleFoodPurchase = (id: string, price: number) => {
    if (spiritStones < price) {
      return false;
    }
    setSpiritStones((s) => s - price);
    setPurchasedFoodCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    return true;
  };

  const handleBuyQiankun = (price: number) => {
    if (spiritStones < price) return;
    startTransition(() => {
      setSpiritStones((s) => s - price);
      setQiankunDeviceCount((n) => n + 1);
    });
  };

  const claimMailboxLetter = (letterId: string) => {
    const letter = MAILBOX_LETTERS.find((l) => l.id === letterId);
    const unlockedIds = new Set(MAILBOX_LETTERS.slice(0, unlockedMailboxCount).map((l) => l.id));
    if (!letter || claimedMailIds.includes(letterId) || !unlockedIds.has(letterId)) return;
    const r = letter.rewards;
    startTransition(() => {
      if (r.spiritStones && r.spiritStones > 0) {
        setSpiritStones((s) => s + r.spiritStones);
      }
      if (r.food) {
        setPurchasedFoodCounts((prev) => {
          const next = { ...prev };
          for (const fid of BACKPACK_FOOD_IDS) {
            const add = r.food![fid];
            if (add && add > 0) next[fid] = (next[fid] ?? 0) + add;
          }
          return next;
        });
      }
      if (r.herbs) {
        setBackpackHerbs((prev) => {
          const next = { ...prev };
          for (const [hid, n] of Object.entries(r.herbs!)) {
            if (n && n > 0) next[hid] = (next[hid] ?? 0) + n;
          }
          return next;
        });
      }
      if (r.curioIds?.length) {
        setOwnedCurioIds((prev) => {
          const set = new Set(prev);
          for (const cid of r.curioIds!) {
            if (!set.has(cid)) set.add(cid);
          }
          return [...set];
        });
      }
      setClaimedMailIds((prev) => [...prev, letterId]);
    });
  };

  useEffect(() => {
    const data: GameSaveData = {
      herbPatchStock,
      herbPatchRegrowEndAt,
      herbBag,
      spiritStones,
      ownedCurioIds,
      purchasedFoodCounts,
      backpackHerbs,
      herbalistXp,
      unlockedAtlasCount,
      qiankunDeviceCount,
      tripState,
      claimedMailIds,
    };
    try {
      window.localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage quota/private mode errors.
    }
    if (!authToken || !remoteHydrated) return;
    if (remoteSaveTimerRef.current) window.clearTimeout(remoteSaveTimerRef.current);
    remoteSaveTimerRef.current = window.setTimeout(() => {
      void fetch(`${SAVE_API_BASE_URL}/api/save`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ data }),
      }).catch(() => {
        // 网络失败时保留本地存档；下次状态变化会继续重试同步。
      });
    }, 900);
    return () => {
      if (remoteSaveTimerRef.current) window.clearTimeout(remoteSaveTimerRef.current);
    };
  }, [
    herbPatchStock,
    herbPatchRegrowEndAt,
    herbBag,
    spiritStones,
    ownedCurioIds,
    purchasedFoodCounts,
    backpackHerbs,
    herbalistXp,
    unlockedAtlasCount,
    qiankunDeviceCount,
    tripState,
    claimedMailIds,
    authToken,
    remoteHydrated,
  ]);

  return (
    authBooting ? (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#f8f4e9] text-on-surface">
        <p className="font-headline text-base">正在连接云存档...</p>
      </div>
    ) : !authToken || !authUsername ? (
      <AuthScreen
        mode={authMode}
        username={authNameInput}
        password={authPasswordInput}
        busy={authBusy}
        error={authError}
        onModeChange={(mode) => {
          setAuthMode(mode);
          setAuthError(null);
        }}
        onUsernameChange={setAuthNameInput}
        onPasswordChange={setAuthPasswordInput}
        onSubmit={() => void handleAuthSubmit()}
      />
    ) : (
    <div className="relative h-[100dvh] min-h-[100dvh] w-full max-w-full overflow-hidden bg-background touch-manipulation">
      {/* Background Layer */}
      <motion.div 
        key={currentBg}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <img 
          src={currentBg} 
          alt={tripState ? '遊歷途中·庭院主畫面' : '庭院主畫面'} 
          className={cn(
            'w-full h-full',
            tripState ? 'object-contain bg-stone-100/70' : 'object-cover'
          )}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/10" />
        <div
          className={cn(
            'absolute inset-0 pointer-events-none z-[1] transition-opacity duration-700',
            weather === 'rainy' && 'bg-gradient-to-b from-slate-950/20 via-transparent to-slate-900/30',
            weather === 'autumn' && 'bg-gradient-to-t from-amber-950/15 via-orange-950/5 to-amber-100/10',
            weather === 'snowy' && 'bg-gradient-to-b from-sky-50/20 via-slate-200/10 to-blue-100/25',
            weather === 'dusk' && 'bg-gradient-to-b from-violet-950/20 via-amber-950/10 to-orange-200/18',
            weather === 'sunny' && 'bg-transparent'
          )}
          aria-hidden
        />
      </motion.div>

      <AnimatePresence>
        {showPrepVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 8 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-black/70 shadow-2xl"
            >
              <video
                ref={prepVideoRef}
                src={MEDICINE_BOY_READY_VIDEO_SRC}
                autoPlay
                muted
                playsInline
                preload="metadata"
                className="h-auto w-full"
                onLoadedMetadata={(e) => {
                  e.currentTarget.currentTime = 0;
                  void e.currentTarget.play().catch(() => {});
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {departFailToast && (
          <motion.div
            key="depart-fail-toast"
            role="status"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed left-1/2 top-[max(0.75rem,env(safe-area-inset-top,0px))] z-[260] w-[min(22rem,calc(100vw-1.5rem))] -translate-x-1/2 rounded-2xl border border-primary/25 bg-surface/95 px-4 py-3 text-center shadow-lg backdrop-blur-md"
          >
            <p className="text-[10px] font-label font-bold tracking-widest text-primary">无法出发</p>
            <p className="font-headline text-sm text-on-surface mt-1">{departFailToast.replace(/^无法出发：?/, '')}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Effects：隨當前主背景的 weather 與主界面同步 */}
      {weather === 'rainy' && <RainEffect key={`rain-${activeMain.id}`} />}
      {weather === 'autumn' && <LeafEffect key={`leaf-${activeMain.id}`} />}
      {weather === 'snowy' && <SnowEffect key={`snow-${activeMain.id}`} />}
      {activeMain.id === 'scene-07' && <BlossomEffect key={`blossom-${activeMain.id}`} />}
      {weather === 'dusk' && <FireflyEffect key={`firefly-${activeMain.id}`} />}

      {/* 畫面左右緣：庭院翻頁 */}
      {showCourtyardBgControls && (
        <>
          <div className="pointer-events-none fixed inset-y-0 left-0 z-[42] flex w-[min(3rem,12vw)] items-center justify-center pl-[max(0.25rem,env(safe-area-inset-left,0px))]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrevBg();
              }}
              className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface/88 text-primary shadow-lg backdrop-blur-md transition-transform active:scale-95 sm:h-12 sm:w-12 sm:hover:bg-surface/95"
              aria-label="上一處庭院"
            >
              <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
            </button>
          </div>
          <div className="pointer-events-none fixed inset-y-0 right-0 z-[42] flex w-[min(3rem,12vw)] items-center justify-center pr-[max(0.25rem,env(safe-area-inset-right,0px))]">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNextBg();
              }}
              className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-outline-variant/35 bg-surface/88 text-primary shadow-lg backdrop-blur-md transition-transform active:scale-95 sm:h-12 sm:w-12 sm:hover:bg-surface/95"
              aria-label="下一處庭院"
            >
              <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
            </button>
          </div>
        </>
      )}

      {/* 底欄上方：庭院分頁圓點（六張主界面稿） */}
      {showCourtyardBgControls && (
        <div
          className="pointer-events-auto fixed left-1/2 z-[48] flex max-w-[min(22rem,calc(100vw-1.25rem))] -translate-x-1/2 gap-1.5 overflow-x-auto rounded-full border border-outline-variant/30 bg-surface/85 px-2.5 py-1.5 shadow-lg backdrop-blur-md no-scrollbar"
          style={{ bottom: 'calc(3.65rem + env(safe-area-inset-bottom, 0px))' }}
          role="tablist"
          aria-label="庭院場景"
        >
          {COURTYARD_HOME_SCENE_OPTIONS.map((opt, idx) => (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={idx === safeBgIndex}
              onClick={() => setMainBgIndex(idx)}
              title={opt.label}
              aria-label={`庭院：${opt.label}`}
              className={cn(
                'h-2 w-2 shrink-0 rounded-full transition-all touch-manipulation sm:h-2.5 sm:w-2.5',
                idx === safeBgIndex
                  ? 'scale-125 bg-primary ring-2 ring-primary/35 ring-offset-1 ring-offset-transparent'
                  : 'bg-on-surface-variant/40 active:bg-primary/70'
              )}
            />
          ))}
        </div>
      )}

      {/* 左上角：天候 + 背景切換（上一張 / 下一張 / 圓點） */}
      <div
        className="fixed z-[45] flex flex-col gap-1.5 w-[min(11.75rem,calc(100vw-env(safe-area-inset-left,0px)-env(safe-area-inset-right,0px)-1rem))] max-h-[min(42vh,17.5rem)] sm:max-h-none left-[max(0.5rem,env(safe-area-inset-left,0px))] top-[max(0.5rem,env(safe-area-inset-top,0px))]"
      >
        <div className="rounded-2xl bg-surface-container-low/92 backdrop-blur-md border border-outline-variant/30 shadow-lg px-2.5 py-2 sm:py-2.5 overflow-y-auto no-scrollbar">
          <p className="text-[8px] font-label font-bold text-secondary tracking-[0.18em]">天候</p>
          <p className="font-headline text-sm text-on-surface leading-snug mt-0.5">
            {weatherHeadline(weather)}
          </p>
          <p className="text-[10px] text-on-surface-variant mt-2 leading-snug border-t border-outline-variant/20 pt-2">
            {activeMain.label}
          </p>
          <p className="text-[8px] font-label font-bold text-primary tracking-widest mt-2.5">意境</p>
          <p className="font-headline text-[11px] text-on-surface italic mt-0.5 leading-snug">
            {activeMain.moodLine}
          </p>
        </div>
        <div className="relative rounded-xl bg-surface-container-low/88 backdrop-blur-sm px-3 py-2.5 border border-secondary/20 border-l-2 border-l-secondary shrink-0">
          <div className="flex items-center justify-between gap-2 rounded-md px-0.5 py-0.5 text-left">
            <div className="flex items-center gap-2 min-w-0">
              <Baby className="w-4 h-4 text-secondary shrink-0" strokeWidth={1.5} />
              <p className="text-[9px] font-label font-bold text-secondary tracking-widest">小藥童</p>
            </div>
            {!tripState && !showPrepVideo && (
              <button
                type="button"
                onClick={handleDoorwayTravel}
                disabled={!canHerbalistTravel}
                className={cn(
                  'shrink-0 rounded-lg px-2 py-1 font-label text-[9px] font-bold tracking-[0.12em] transition-colors touch-manipulation',
                  canHerbalistTravel
                    ? 'bg-primary text-on-primary shadow-sm active:scale-[0.98] sm:hover:bg-primary/92'
                    : 'cursor-not-allowed bg-outline-variant/20 text-on-surface-variant/45'
                )}
              >
                出發
              </button>
            )}
          </div>
          <p className="font-headline text-xs font-bold text-on-surface mt-1 tabular-nums">Lv.{herbalistLevel}</p>
          <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">
            {canHerbalistTravel
              ? tripState
                ? `遊歷中 · ${formatDuration(tripRemainingMs)}`
                : '整裝中 · 點擊下方出發'
              : '待命中 · 行囊需吃食與道具'}
          </p>
          <p className="text-[10px] text-on-surface-variant/80 mt-1 tabular-nums">
            圖鑑 {unlockedAtlasCount}/{ATLAS_TOTAL} · 本次 {formatDuration(travelDurationMs)}
          </p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-outline-variant/25">
            <div
              className="h-full rounded-full bg-secondary/90 transition-[width] duration-500"
              style={{ width: `${Math.round(herbalistXpBar * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Hitboxes：容器不攔截點擊，子區域單獨可點 */}
      <div className="pointer-events-none absolute inset-0 z-20">
            {isHerbalistAtHome && (
              <button
                type="button"
                onClick={handleHerbalistClick}
                className="pointer-events-auto absolute left-[53%] top-[62%] z-[26] h-[16%] w-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent"
                aria-label="和小藥童互動"
                title="小藥童"
              />
            )}
            {isHerbalistAtHome && herbalistLine && (
              <div className="pointer-events-none absolute left-[62%] top-[43%] z-[32] w-[min(13.5rem,58vw)] -translate-x-1/2 -translate-y-full rounded-xl border border-secondary/20 bg-surface/92 px-3 py-2 text-[11px] leading-relaxed text-on-surface shadow-lg backdrop-blur-sm">
                {herbalistLine}
              </div>
            )}
            {tripState && (
              <div
                className="pointer-events-none absolute left-1/2 top-[min(62%,calc(50%+5.5rem))] z-[35] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
                aria-live="polite"
              >
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-surface/80 backdrop-blur-sm shadow-md">
                  <div className="h-7 w-7 rounded-full border-[3px] border-primary/25 border-t-primary animate-spin" />
                  <Repeat className="absolute h-4 w-4 text-primary/80" strokeWidth={1.75} />
                </div>
                <div className="rounded-full border border-secondary/35 bg-surface/90 px-3 py-1.5 text-[11px] font-label font-bold tracking-wider text-secondary shadow-md backdrop-blur-sm">
                  回歸倒計時 {formatDuration(tripRemainingMs)}
                </div>
              </div>
            )}
            {/* 钱袋（右上）：全透明可点，打开灵石与玩法说明 */}
            <button
              type="button"
              onClick={() => setIsPurseModalOpen(true)}
              className="pointer-events-auto absolute top-[max(0.5rem,env(safe-area-inset-top,0px))] right-[max(0.5rem,env(safe-area-inset-right,0px))] z-[25] flex w-[22%] max-w-[5.25rem] flex-col items-center gap-1.5 touch-manipulation opacity-0"
              aria-label="钱袋"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-transparent bg-transparent shadow-none sm:h-14 sm:w-14">
                <Wallet className="h-6 w-6 text-amber-700 sm:h-7 sm:w-7" strokeWidth={1.5} />
              </div>
              <span className="rounded-full bg-transparent px-2 py-0.5 text-center font-label text-[9px] font-bold tracking-widest text-transparent">
                钱袋
              </span>
            </button>
            {/* 信箱：收信領禮 */}
            {hasUnreadMailboxLetters && (
              <div
                className="pointer-events-none absolute top-[28%] right-[10%] z-[24] h-[15%] w-[15%]"
                aria-hidden
              >
                <div className="absolute inset-0 rounded-2xl bg-amber-300/25 blur-md animate-pulse" />
                <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white/90" />
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsMailboxModalOpen(true)}
              className="pointer-events-auto absolute top-[28%] right-[10%] z-[25] h-[15%] w-[15%] cursor-pointer touch-manipulation border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
              aria-label="信箱"
              title="信箱"
            />
            {/* 山海经书本 view 热区：跳转图谱（图鉴） */}
            <div 
              onClick={() => setIsAtlasModalOpen(true)}
              className="pointer-events-auto absolute bottom-[18%] left-[45%] w-[30%] h-[15%] cursor-pointer"
            />
            {/* 左下：藥圃 — 收取草藥 */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsHerbGatherOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsHerbGatherOpen(true);
                }
              }}
              className="pointer-events-auto absolute bottom-[5%] left-[5%] w-[45%] h-[25%] cursor-pointer"
              title="收取草藥"
            />

      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-stretch gap-0.5 px-0.5 sm:px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] bg-background/85 backdrop-blur-lg rounded-t-2xl sm:rounded-t-3xl z-50 border-t border-outline-variant/10">
        <button 
          type="button"
          onClick={() => {
            setIsMarketHubOpen(false);
            setIsFoodModalOpen(false);
            setIsEchoesModalOpen(false);
            setIsBackpackOpen(false);
            setIsHerbGatherOpen(false);
            setIsAtlasModalOpen(false);
            setIsAlmanacModalOpen(false);
            setIsPurseModalOpen(false);
            setIsMailboxModalOpen(false);
          }}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[52px] min-w-0 max-w-[5.5rem] rounded-xl px-0.5 py-1.5 transition-all active:scale-[0.97] active:opacity-90",
            isMainGardenTabActive ? "bg-primary/10 text-primary" : "text-on-surface-variant opacity-70"
          )}
        >
          <Home className={cn("w-5 h-5 sm:w-6 sm:h-6 shrink-0", isMainGardenTabActive && "fill-current")} />
          <span className="font-headline font-medium text-[7px] sm:text-[9px] tracking-wide leading-tight text-center">庭院</span>
        </button>

        <button 
          type="button"
          onClick={() => setIsMarketHubOpen(true)}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[52px] min-w-0 max-w-[5.5rem] rounded-xl px-0.5 py-1.5 transition-all active:scale-[0.97] active:opacity-90",
            isMarketFlowOpen ? "bg-primary/10 text-primary" : "text-on-surface-variant opacity-70"
          )}
        >
          <Compass className={cn("w-5 h-5 sm:w-6 sm:h-6 shrink-0", isMarketFlowOpen && "fill-current")} />
          <span className="font-headline font-medium text-[7px] sm:text-[9px] tracking-wide leading-tight text-center">市集</span>
        </button>

        <button 
          type="button"
          onClick={() => setIsAtlasModalOpen(true)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[52px] min-w-0 max-w-[5.5rem] rounded-xl px-0.5 py-1.5 text-on-surface-variant opacity-70 active:opacity-100 active:scale-[0.97] sm:hover:opacity-100 transition-opacity"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span className="font-headline font-medium text-[7px] sm:text-[9px] tracking-wide leading-tight text-center">圖譜</span>
        </button>

        <button 
          type="button"
          onClick={() => setIsAlmanacModalOpen(true)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[52px] min-w-0 max-w-[5.5rem] rounded-xl px-0.5 py-1.5 text-on-surface-variant opacity-70 active:opacity-100 active:scale-[0.97] sm:hover:opacity-100 transition-opacity"
        >
          <Book className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          <span className="font-headline font-medium text-[7px] sm:text-[9px] tracking-wide leading-tight text-center">日記</span>
        </button>

        <button 
          type="button"
          onClick={() => {
            setIsBackpackOpen(true);
          }}
          className={cn(
            "flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[52px] min-w-0 max-w-[5.5rem] rounded-xl px-0.5 py-1.5 transition-all active:scale-[0.97] active:opacity-90",
            isBackpackOpen ? "bg-primary/10 text-primary" : "text-on-surface-variant opacity-70"
          )}
        >
          <Backpack className={cn("w-5 h-5 sm:w-6 sm:h-6 shrink-0", isBackpackOpen && "text-primary")} />
          <span className="font-headline font-medium text-[7px] sm:text-[9px] tracking-wide leading-tight text-center">行囊</span>
        </button>
      </nav>

      {/* Modals */}
      <PurseModal
        isOpen={isPurseModalOpen}
        onClose={() => setIsPurseModalOpen(false)}
        spiritStones={spiritStones}
        travelStoneCost={travelSpiritStoneCost}
        herbalistLevel={herbalistLevel}
      />
      <AlmanacModal
        isOpen={isAlmanacModalOpen}
        onClose={() => setIsAlmanacModalOpen(false)}
        diaryEntries={diaryEntries}
      />
      <AtlasModal
        isOpen={isAtlasModalOpen}
        onClose={() => setIsAtlasModalOpen(false)}
        unlockedCount={unlockedAtlasCount}
      />
      <FoodModal
        isOpen={isFoodModalOpen}
        onClose={() => {
          setIsFoodModalOpen(false);
          requestAnimationFrame(() => setIsMarketHubOpen(true));
        }}
        spiritStones={spiritStones}
        onBuyFood={handleFoodPurchase}
      />
      <AncientEchoesModal
        isOpen={isEchoesModalOpen}
        onClose={() => {
          setIsEchoesModalOpen(false);
          requestAnimationFrame(() => setIsMarketHubOpen(true));
        }}
        spiritStones={spiritStones}
        ownedIds={ownedCurioIds}
        onPurchase={handleCurioPurchase}
        qiankunCount={qiankunDeviceCount}
        onBuyQiankun={handleBuyQiankun}
      />
      <MarketHubModal
        isOpen={isMarketHubOpen}
        onClose={() => setIsMarketHubOpen(false)}
        onFood={() => setIsFoodModalOpen(true)}
        onEchoes={() => setIsEchoesModalOpen(true)}
        onOpenPurse={() => setIsPurseModalOpen(true)}
      />
      <MailboxModal
        isOpen={isMailboxModalOpen}
        onClose={() => setIsMailboxModalOpen(false)}
        claimedIds={claimedMailIds}
        herbalistLevel={herbalistLevel}
        onClaim={claimMailboxLetter}
      />
      <HerbGatherModal
        isOpen={isHerbGatherOpen}
        onClose={() => setIsHerbGatherOpen(false)}
        spiritStones={spiritStones}
        patchStock={herbPatchStock}
        setPatchStock={setHerbPatchStock}
        herbBag={herbBag}
        setHerbBag={setHerbBag}
        onSell={(earn) => setSpiritStones((s) => s + earn)}
        onPackToBackpack={packHerbsToBackpack}
        onBeginPatchRegrow={() => setHerbPatchRegrowEndAt(Date.now() + HERB_PATCH_REGROW_MS)}
        herbPatchRegrowEndAt={herbPatchRegrowEndAt}
        gardenNow={gardenClock}
      />
      <BackpackModal
        isOpen={isBackpackOpen}
        onClose={() => setIsBackpackOpen(false)}
        spiritStones={spiritStones}
        ownedCurioIds={ownedCurioIds}
        purchasedFoodCounts={purchasedFoodCounts}
        backpackHerbs={backpackHerbs}
        herbalistXp={herbalistXp}
        canHerbalistTravel={canHerbalistTravel}
        tripRemainingMs={tripRemainingMs}
        isTraveling={Boolean(tripState)}
        travelSpiritStoneCost={travelSpiritStoneCost}
        qiankunCount={qiankunDeviceCount}
        onStartTravel={startTravel}
        onGoMarket={() => setIsMarketHubOpen(true)}
      />
    </div>
    )
  );
}
