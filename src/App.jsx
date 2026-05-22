import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import useSound from "use-sound";
import ReactPlayer from "react-player";
import SignatureCanvas from "react-signature-canvas";
import {
  Archive,
  Ban,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Camera,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Coffee,
  Croissant,
  CupSoda,
  Droplets,
  Eraser,
  Gamepad2,
  Heart,
  Home,
  Image as ImageIcon,
  MessageCircle,
  Hash,
  Package,
  Pause,
  PenLine,
  Phone,
  Play,
  Radio,
  ReceiptText,
  Scale,
  SkipBack,
  SkipForward,
  Sparkles,
  Stamp,
  Tag,
  Trophy,
  Utensils,
  Video,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import { archiveEvents } from "./data/cafeArchive";
import { acervoHero, photoEvents } from "./data/photoArchive";
import { cn } from "./lib/utils";

const startDate = new Date(2025, 10, 22, 0, 0, 0);
const sixMonthsDate = new Date(2026, 4, 22, 0, 0, 0);

const navItems = [
  { id: "counter", label: "Balcão", icon: Home },
  { id: "menu", label: "Cardápio", icon: Utensils },
  { id: "table", label: "Mesa 22", icon: CalendarCheck },
  { id: "mural", label: "Acervo", icon: ImageIcon },
  { id: "archive", label: "Arquivo", icon: Archive },
];

const menuItems = [
  {
    name: "Latte No Ordinary Love",
    category: "Bebida da casa",
    price: "1 musica no repeat",
    icon: Coffee,
    description: "Café, leite e Sade tocando baixo no fundo. Para lembrar que esse amor não tem nada de comum.",
  },
  {
    name: "Chocolate Habeas Corpus",
    category: "Emergência afetiva",
    price: "carinho ilimitado",
    icon: Scale,
    description: "Para casos de fome, drama, processo domestico ou necessidade urgente de cuidado.",
  },
  {
    name: "Mocha Melzudin",
    category: "Pedido do barista",
    price: "um sorriso dela",
    icon: Heart,
    description: "Dose dupla de café, mel e código. Forte, insistente e completamente entregue.",
  },
  {
    name: "Cappuccino Advogata",
    category: "Favorito da Primeira Dama",
    price: "vitalicio",
    icon: Stamp,
    description: "Doce quando quer, firme quando precisa. Vem com argumento, charme e prioridade na fila.",
  },
  {
    name: "Expresso Pole Position",
    category: "Red Bull Love",
    price: "DRS aberto",
    icon: Trophy,
    description: "Pequeno, intenso e rapido o suficiente para deixar o coracao em P1.",
  },
  {
    name: "Cookie Player 2",
    category: "Co-op",
    price: "1 Joy-Con compartilhado",
    icon: Gamepad2,
    description: "Para jogar junto, perder junto, rir junto e deixar o Switch morar onde o amor mora.",
  },
  {
    name: "Croissant de Chocolate",
    category: "Pedido proibido",
    price: "fora do cardápio",
    icon: Croissant,
    forbidden: true,
    description: "Não servimos. A Advogata não gosta, então este item permanece vetado por decreto da Mesa 22.",
  },
];

const loyaltyStamps = [
  ["06/05", "Primeiro sinal", "A cantada foi entregue. Ela so nao leu o cardapio ainda."],
  ["30/05", "Modo protecao", "Quando ficar contigo ja parecia natural."],
  ["11/06", "Servidor encontrado", "Ela tinha Mine. O mundo abriu."],
  ["08/11", "Candidatura", "A ficha foi enviada com coragem e sono."],
  ["20/11", "Eu te amo", "O pedido saiu antes da mesa oficial."],
  ["22/11", "Café aberto", "Mesa 22 reservada."],
  ["22/05", "6 meses", "Pedido especial quase pronto."],
];

// Para adicionar uma musica nova, coloque title, artist e url aqui.
const musicTracks = [
  {
    id: "no-ordinary-love",
    title: "No Ordinary Love",
    artist: "Sade",
    album: "Love Deluxe",
    url: "https://www.youtube.com/watch?v=FpBx6tR8dck",
    appleMusicUrl: "https://music.apple.com/us/song/no-ordinary-love/158796562",
    cover: "https://img.youtube.com/vi/FpBx6tR8dck/hqdefault.jpg",
    fallbackCover: "https://img.youtube.com/vi/FpBx6tR8dck/hqdefault.jpg",
  },
  {
    id: "e-voce",
    title: "É você",
    artist: "Exaltasamba",
    album: "Nova Bis: Exaltasamba",
    url: "https://youtu.be/kU1zK2MZUrU?si=GWUJ7GKSIbscLeyo",
    appleMusicUrl: "https://music.apple.com/us/song/e-voce/781567934",
    cover: "https://img.youtube.com/vi/kU1zK2MZUrU/hqdefault.jpg",
    fallbackCover: "https://img.youtube.com/vi/kU1zK2MZUrU/hqdefault.jpg",
  },
  {
    id: "abandonado",
    title: "Abandonado",
    artist: "Exaltasamba",
    album: "A Gente Bota pra Quebrar",
    url: "https://youtu.be/gVIEa5w3JDE?si=uQY_r1ShqQ20_Rd9",
    appleMusicUrl: "https://music.apple.com/gb/song/abandonado-ao-vivo/1021565561",
    cover: "https://img.youtube.com/vi/gVIEa5w3JDE/hqdefault.jpg",
    fallbackCover: "https://img.youtube.com/vi/gVIEa5w3JDE/hqdefault.jpg",
  },
  {
    id: "heaven-can-wait",
    title: "Heaven Can Wait",
    artist: "Michael Jackson",
    album: "Invincible",
    url: "https://youtu.be/TDVlDUAIz5k?si=GmQYEVZ4Qr63EyqH",
    appleMusicUrl: "https://music.apple.com/us/song/heaven-can-wait/215738809",
    cover: "https://img.youtube.com/vi/TDVlDUAIz5k/hqdefault.jpg",
    fallbackCover: "https://img.youtube.com/vi/TDVlDUAIz5k/hqdefault.jpg",
  },
];

function formatPlayerTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function useRelationshipTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    const diff = Math.max(0, now.getTime() - startDate.getTime());
    const totalSeconds = Math.floor(diff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
      const previousMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += previousMonthLastDay;
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    return {
      years: Math.max(0, years),
      months: Math.max(0, months),
      days: Math.max(0, days),
      hours: totalHours % 24,
      minutes: totalMinutes % 60,
      seconds: totalSeconds % 60,
      totalDays,
      readyForSixMonths: now >= sixMonthsDate,
    };
  }, [now]);
}

function App() {
  const [activeTab, setActiveTab] = useState("counter");
  const [receipt, setReceipt] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState("primeira-cantada");

  const activeEvent = archiveEvents.find((event) => event.id === selectedEventId) ?? archiveEvents[0];

  return (
    <div className="min-h-screen bg-cafe-cream text-cafe-ink">
      <div className="fixed inset-0 pointer-events-none cafe-texture" />
      <Toaster position="top-center" richColors theme="light" />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-32 pt-5 sm:px-6 lg:pb-10">
        <AnimatePresence mode="wait">
          {activeTab === "counter" && <Balcao key="counter" setActiveTab={setActiveTab} />}
          {activeTab === "menu" && <Cardapio key="menu" onOrder={setReceipt} />}
          {activeTab === "table" && <Mesa22 key="table" setActiveTab={setActiveTab} />}
          {activeTab === "mural" && <AcervoFotos key="mural" />}
          {activeTab === "archive" && (
            <Arquivo key="archive" activeEvent={activeEvent} setSelectedEventId={setSelectedEventId} />
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <AnimatePresence>{receipt && <ReceiptModal item={receipt} onClose={() => setReceipt(null)} />}</AnimatePresence>
    </div>
  );
}

function Header({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-40 border-b border-cafe-line bg-cafe-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cafe-cream/85">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <button className="flex items-center gap-3 text-left" onClick={() => setActiveTab("counter")}>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-cafe-espresso text-cafe-paper shadow-sm">
            <Coffee size={22} />
          </span>
          <span>
            <span className="block font-serif text-2xl font-bold leading-none">Café 22</span>
            <span className="mt-1 hidden text-xs font-semibold uppercase tracking-[0.18em] text-cafe-muted sm:block">
              aberto desde 22/11/2025
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 rounded-full border border-cafe-line bg-cafe-paper p-1 shadow-sm md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold transition-colors active:scale-95",
                activeTab === item.id ? "bg-cafe-espresso text-cafe-paper" : "text-cafe-muted",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 w-full border-t border-cafe-line bg-cafe-paper pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(43,26,20,0.08)] md:hidden">
      <div className="mx-auto flex w-full justify-between px-1 sm:px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 transition-colors active:scale-95",
                isActive ? "bg-cafe-espresso text-cafe-paper" : "text-cafe-muted",
              )}
              aria-label={item.label}
            >
              <Icon size={18} strokeWidth={2.4} className="shrink-0" />
              <span className="w-full break-words text-center text-[10px] font-bold leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Page({ children, className }) {
  return (
    <Motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn("w-full", className)}
    >
      {children}
    </Motion.section>
  );
}

function Balcao({ setActiveTab }) {
  const time = useRelationshipTime();

  return (
    <Page className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <section className="relative flex flex-col-reverse items-center justify-between gap-6 overflow-hidden rounded-[1.6rem] border border-cafe-line bg-cafe-paper p-5 shadow-cafe sm:gap-8 sm:p-10 md:flex-row">
        <div className="relative z-10 flex w-full flex-col items-start text-cafe-ink md:w-1/2">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cafe-line/50 bg-cafe-cream px-3 py-1.5 shadow-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cafe-honey" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cafe-espresso">Mesa ocupada</span>
          </div>
          <h1 className="text-balance font-serif text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">Mesa reservada para Melzudin e Advogata.</h1>
          <p className="mt-3 max-w-sm text-balance text-sm leading-6 text-cafe-muted">
            Uma cafeteria simples, feita para guardar as conversas, fotos, pedidos e pequenos sinais que trouxeram vocês até aqui.
          </p>
        </div>
        <div className="relative flex w-full justify-center md:w-1/2 md:justify-end">
          <div className="relative rotate-3 transition-transform duration-300 md:hover:rotate-1">
            <div className="absolute -inset-1 rounded-2xl bg-black/5 blur-md" />
            <div className="relative rounded-2xl border-[6px] border-white bg-white p-2 pb-10 shadow-xl">
              <img src={acervoHero.src} alt={acervoHero.alt} className="h-48 w-48 rounded-xl object-cover sepia-[10%] grayscale-[20%] sm:h-64 sm:w-64 lg:h-72 lg:w-72" />
              <span className="absolute bottom-3 right-4 -rotate-2 font-serif text-sm text-cafe-espresso/80">Minha Constante.</span>
            </div>
          </div>
        </div>
      </section>

      <aside className="grid gap-5">
        <TimerCard time={time} />
        <RadioCard />
        <MensagemSurpresa />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setActiveTab("menu")} className="action-card bg-cafe-espresso text-cafe-paper">
            <ReceiptText size={24} />
            <span>Fazer pedido</span>
          </button>
          <button onClick={() => setActiveTab("archive")} className="action-card bg-cafe-paper text-cafe-espresso">
            <MessageCircle size={24} />
            <span>Abrir arquivo</span>
          </button>
        </div>
      </aside>
    </Page>
  );
}

function MensagemSurpresa() {
  const motivos = [
    "Amo como você fica concentrada jogando Switch.",
    "Esse café me lembra do dia em que a ficha da candidatura foi enviada.",
    "A advogata mais linda que já pisou nesse café.",
    "Seu abraço sempre resolve o caos do dia.",
    "Toda conversa com você vira capítulo favorito.",
  ];

  const sortear = () => {
    const frase = motivos[Math.floor(Math.random() * motivos.length)];
    toast("Mensagem no fundo da xícara", {
      description: `"${frase}"`,
    });
  };

  return (
    <button
      onClick={sortear}
      className="action-card border border-cafe-honey bg-cafe-honey/20 text-cafe-espresso"
      aria-label="Olhar fundo da xícara"
    >
      <Coffee size={24} />
      <span>Olhar fundo da xícara</span>
    </button>
  );
}

function TimerCard({ time }) {
  const units = [
    ["Anos", time.years],
    ["Meses", time.months],
    ["Dias", time.days],
    ["Horas", String(time.hours).padStart(2, "0")],
    ["Min", String(time.minutes).padStart(2, "0")],
    ["Seg", String(time.seconds).padStart(2, "0")],
  ];

  return (
    <section className="rounded-[1.4rem] border border-cafe-line bg-cafe-paper p-5 shadow-cafe">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">tempo de preparo</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">Desde 22/11/2025</h2>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cafe-cream text-cafe-espresso">
          <Clock3 size={22} />
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {units.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-cafe-line bg-cafe-cream p-2 sm:p-3 text-center">
            <strong className="block font-serif text-2xl sm:text-3xl leading-none">{value}</strong>
            <span className="mt-1 block text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] text-cafe-muted">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-cafe-espresso p-4 text-cafe-paper">
        <p className="text-sm font-semibold">
          {time.readyForSixMonths
            ? "Pedido especial pronto: 6 meses de nos."
            : "Pedido especial bloqueado até 22/05/2026."}
        </p>
      </div>
    </section>
  );
}

function RadioCard() {
  const playerRef = useRef(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  const activeTrack = musicTracks[activeTrackIndex];
  const activeCover = activeTrack.cover ?? activeTrack.fallbackCover;
  const progress = duration > 0 ? Math.min(100, (playedSeconds / duration) * 100) : 0;

  const selectTrack = (index) => {
    setPlayedSeconds(0);
    setDuration(0);
    setActiveTrackIndex(index);
    setPlaying(true);
  };

  const skipTrack = (direction) => {
    setPlayedSeconds(0);
    setDuration(0);
    setActiveTrackIndex((currentIndex) => {
      const nextIndex = (currentIndex + direction + musicTracks.length) % musicTracks.length;
      return nextIndex;
    });
    setPlaying(true);
  };

  const seekTo = (seconds) => {
    const player = playerRef.current;
    if (!player || !Number.isFinite(seconds)) return;
    player.currentTime = Math.max(0, Math.min(seconds, duration || seconds));
    setPlayedSeconds(player.currentTime);
  };

  const toggle = () => {
    setPlaying((current) => !current);
  };

  return (
    <section className="overflow-hidden rounded-[1.4rem] border border-cafe-line bg-cafe-espresso p-4 text-cafe-paper shadow-cafe">
      <div className="pointer-events-none h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        <ReactPlayer
          ref={playerRef}
          src={activeTrack.url}
          playing={playing}
          controls={false}
          width="1px"
          height="1px"
          config={{
            youtube: {
              origin: typeof window === "undefined" ? undefined : window.location.origin,
            },
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => skipTrack(1)}
          onTimeUpdate={(event) => {
            const currentTime = event.currentTarget?.currentTime ?? 0;
            setPlayedSeconds(currentTime);
          }}
          onDurationChange={(event) => {
            const nextDuration = event.currentTarget?.duration ?? 0;
            setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
          }}
          onError={() => {
            setPlaying(false);
            toast.error("Essa faixa nao conseguiu tocar agora.", {
              description: "Tente de novo ou pule para a proxima musica.",
            });
          }}
        />
      </div>

      <div className="flex items-start gap-4">
        <img
          src={activeCover}
          alt={`Capa de ${activeTrack.title}`}
          className="h-24 w-24 shrink-0 rounded-md bg-cafe-paper/10 object-cover shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cafe-honey">radio da cafeteria</p>
          <h3 className="mt-1 break-words font-serif text-2xl font-bold leading-tight text-cafe-paper">{activeTrack.title}</h3>
          <p className="mt-1 break-words text-sm font-semibold text-cafe-paper/75">{activeTrack.artist}</p>
          <p className="mt-0.5 break-words text-xs font-semibold text-cafe-paper/50">{activeTrack.album}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => skipTrack(-1)}
          className="grid h-10 w-10 place-items-center rounded-full text-cafe-paper/70 transition hover:text-cafe-honey active:scale-95"
          aria-label="Musica anterior"
          type="button"
        >
          <SkipBack size={21} fill="currentColor" />
        </button>
        <button
          onClick={() => seekTo(playedSeconds - 10)}
          className="rounded-full px-2 py-1 text-xs font-black text-cafe-paper/55 transition hover:text-cafe-honey active:scale-95"
          aria-label="Voltar 10 segundos"
          type="button"
        >
          -10s
        </button>
        <button
          onClick={toggle}
          className="grid h-12 w-12 place-items-center rounded-full bg-cafe-honey text-cafe-espresso transition hover:scale-105 active:scale-95"
          aria-label={playing ? "Pausar" : "Tocar"}
          type="button"
        >
          {playing ? <Pause size={21} fill="currentColor" /> : <Play size={21} fill="currentColor" />}
        </button>
        <button
          onClick={() => seekTo(playedSeconds + 10)}
          className="rounded-full px-2 py-1 text-xs font-black text-cafe-paper/55 transition hover:text-cafe-honey active:scale-95"
          aria-label="Avancar 10 segundos"
          type="button"
        >
          +10s
        </button>
        <button
          onClick={() => skipTrack(1)}
          className="grid h-10 w-10 place-items-center rounded-full text-cafe-paper/70 transition hover:text-cafe-honey active:scale-95"
          aria-label="Proxima musica"
          type="button"
        >
          <SkipForward size={21} fill="currentColor" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 text-[11px] font-bold text-cafe-paper/55">
        <span>{formatPlayerTime(playedSeconds)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={duration ? Math.min(playedSeconds, duration) : 0}
          step="0.1"
          onChange={(event) => seekTo(Number(event.target.value))}
          className="spotify-range"
          style={{ "--progress": `${progress}%` }}
          aria-label="Progresso da musica"
        />
        <span className="text-right">{formatPlayerTime(duration)}</span>
      </div>

      <div className="mt-4 space-y-2">
        {musicTracks.map((track, index) => {
          const isActive = index === activeTrackIndex;
          return (
            <button
              key={track.id}
              onClick={() => selectTrack(index)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-2 text-left transition",
                isActive
                  ? "bg-cafe-paper/12 text-cafe-paper"
                  : "text-cafe-paper/62 hover:bg-cafe-paper/8 hover:text-cafe-paper",
              )}
              type="button"
            >
              <span className={cn("w-5 text-center text-xs font-black", isActive ? "text-cafe-honey" : "text-cafe-paper/40")}>
                {isActive && playing ? <Pause className="mx-auto" size={13} fill="currentColor" /> : index + 1}
              </span>
              <img
                src={track.cover ?? track.fallbackCover}
                alt=""
                className="h-10 w-10 shrink-0 rounded object-cover"
                loading="lazy"
              />
              <span className="min-w-0 flex-1">
                <strong className={cn("block truncate text-sm", isActive && "text-cafe-honey")}>{track.title}</strong>
                <span className="mt-0.5 block truncate text-xs text-cafe-paper/45">{track.artist}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Cardapio({ onOrder }) {
  const [forbiddenClicks, setForbiddenClicks] = useState(0);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [preparingItem, setPreparingItem] = useState(null);
  const [soundProfile, setSoundProfile] = useState("classic");
  const [playClick] = useSound("/musica.mp3", { volume: 0.2 });

  const playOrderSound = () => {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = soundProfile === "retro" ? "square" : soundProfile === "soft" ? "sine" : "triangle";
      oscillator.frequency.value = soundProfile === "retro" ? 510 : soundProfile === "soft" ? 410 : 620;
      gain.gain.value = 0.03;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.14);
    } catch {
      playClick();
    }
  };

  const prepareOrder = (item) => {
    setPreparingItem(item.name);
    playOrderSound();

    toast.promise(
      new Promise((resolve) => {
        window.setTimeout(resolve, item.clandestine ? 900 : 1800);
      }),
      {
        loading: item.clandestine
          ? `Protocolando habeas corpus para: ${item.name}...`
          : `Moendo graos e preparando: ${item.name}...`,
        success: () => {
          setPreparingItem(null);
          onOrder(item);
          return item.clandestine ? "Liminar concedida. Pedido liberado no balcao." : "Pedido finalizado. Retire no balcao!";
        },
        error: () => {
          setPreparingItem(null);
          return "Erro na maquina de cafe.";
        },
      },
    );
  };

  const handleOrder = (item) => {
    if (item.forbidden && !secretUnlocked) {
      const nextCount = forbiddenClicks + 1;
      setForbiddenClicks(nextCount);

      if (nextCount >= 3) {
        setSecretUnlocked(true);
        setForbiddenClicks(0);
        confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
        toast.success("Habeas Corpus concedido!", {
          description: "Pedido liberado clandestinamente pela Mesa 22.",
        });
        prepareOrder({ ...item, forbidden: false, clandestine: true });
        return;
      }

      toast.error("Veto da Primeira Dama!", {
        description: `${3 - nextCount} tentativa${3 - nextCount === 1 ? "" : "s"} ate a sustentacao oral.`,
      });
      return;
    }

    prepareOrder(item);
  };

  return (
    <Page>
      <CardapioHeader />
      <SectionTitle
        eyebrow="cardapio da casa"
        title="Pedidos que parecem café, mas guardam história."
        description="Escolha no balcao, aguarde o preparo e retire o recibo afetivo quando o pedido ficar pronto. Agora voce pode escolher o som de confirmacao."
      />
      <div className="mb-4 rounded-2xl border border-cafe-line bg-cafe-paper p-3">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-cafe-muted">som do pedido</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            ["classic", "Classico"],
            ["retro", "Retro"],
            ["soft", "Suave"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSoundProfile(id)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-bold transition",
                soundProfile === id ? "border-cafe-espresso bg-cafe-espresso text-cafe-paper" : "border-cafe-line bg-cafe-cream",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Motion.article
              key={item.name}
              className="menu-card"
              animate={item.forbidden && forbiddenClicks > 0 && !secretUnlocked ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.28 }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cafe-cream text-cafe-espresso">
                  <Icon size={23} className={cn(item.icon === Heart && "animate-pulse text-cafe-cherry")} />
                </span>
                <span className="rounded-full bg-cafe-honey/20 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cafe-espresso">
                  {item.category}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-2xl sm:text-3xl font-bold leading-tight">{item.name}</h3>
              <p className="mt-3 text-sm leading-6 text-cafe-muted">{item.description}</p>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-cafe-line pt-4">
                <span className="text-sm font-black text-cafe-espresso">{item.price}</span>
                <button
                  onClick={() => handleOrder(item)}
                  disabled={preparingItem === item.name}
                  className={cn("icon-action", item.forbidden && !secretUnlocked && "bg-cafe-cherry", preparingItem === item.name && "animate-pulse")}
                  aria-label={item.forbidden ? `${item.name} proibido` : `Pedir ${item.name}`}
                >
                  {preparingItem === item.name ? <Coffee size={20} /> : item.forbidden && !secretUnlocked ? <Ban size={20} /> : <ChevronRight size={20} />}
                </button>
              </div>
            </Motion.article>
          );
        })}
      </div>
    </Page>
  );
}

function CardapioHeader() {
  return (
    <section className="relative mb-7 overflow-hidden rounded-[1.45rem] border border-cafe-line bg-cafe-paper p-5 shadow-cafe sm:p-6">
      <div className="absolute -right-12 -top-10 h-36 w-36 rounded-full bg-cafe-honey/15 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cafe-espresso/10 blur-2xl" />
      <div className="relative z-10">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cafe-honey">menu afetivo</p>
        <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-cafe-espresso sm:text-4xl">Escolha um pedido com gosto de memória</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-cafe-muted">
          Cada item foi pensado como um ritual da Mesa 22. Toque no seu favorito, aguarde o preparo e receba o comprovante desse capítulo.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cafe-line bg-cafe-cream px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-cafe-honey" />
          <span className="text-[10px] font-black uppercase tracking-[0.16em] text-cafe-muted">pedidos especiais da casa</span>
        </div>
      </div>
    </section>
  );
}

function Mesa22({ setActiveTab }) {
  const time = useRelationshipTime();
  return (
    <Page className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[1.6rem] border border-cafe-line bg-cafe-paper p-5 shadow-cafe">
        <p className="eyebrow">reserva confirmada</p>
      <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-bold">Mesa 22</h2>
        <div className="mt-6 space-y-3">
          <InfoRow label="Clientes" value="Melzudin e Advogata" />
          <InfoRow label="Aberta desde" value="22/11/2025" />
          <InfoRow label="Ocasião" value={time.readyForSixMonths ? "6 meses de nós" : "6 meses em preparo"} />
          <InfoRow label="Status" value="vitalicia" />
        </div>
        <button
          onClick={() => {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
          }}
          className="mt-6 w-full rounded-2xl bg-cafe-espresso px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-cafe-paper transition active:scale-[0.99]"
        >
          Confirmar presenca
        </button>
      </section>

      <section className="grid gap-4">
        <FeatureCard
          icon={Archive}
          title="Arquivo da Mesa 22"
          text="Conversas exatas, preservadas em visual Coffee Talk para reler como tudo começou."
          onClick={() => setActiveTab("archive")}
        />
        <FeatureCard
          icon={BookOpen}
          title="Carta da Casa"
          text="Uma carta de 6 meses com cara de bilhete deixado no balcão."
        />
        <TermosAdvogata />
        <LoyaltyCard />
        <PeDeCafe time={time} />
      </section>
    </Page>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl border border-cafe-line bg-cafe-cream px-3 py-3 sm:px-4">
      <span className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-cafe-muted">{label}</span>
      <strong className="min-w-0 break-words text-right text-sm leading-tight">{value}</strong>
    </div>
  );
}

function FeatureCard(props) {
  const Wrapper = props.onClick ? "button" : "article";
  const Icon = props.icon;
  return (
    <Wrapper
      onClick={props.onClick}
      className="flex w-full items-center gap-3 rounded-[1.4rem] border border-cafe-line bg-cafe-paper p-4 text-left shadow-cafe transition active:scale-[0.99] sm:gap-4"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cafe-espresso text-cafe-paper sm:h-12 sm:w-12">
        <Icon size={20} />
      </span>
      <span className="min-w-0">
        <strong className="block font-serif text-xl sm:text-2xl">{props.title}</strong>
        <span className="mt-1 block text-sm leading-5 text-cafe-muted">{props.text}</span>
      </span>
    </Wrapper>
  );
}

function TermosAdvogata() {
  const [assinado, setAssinado] = useState(
    () => window.localStorage.getItem("contrato_mesa22_assinado") === "true",
  );

  const handleAssinar = () => {
    window.localStorage.setItem("contrato_mesa22_assinado", "true");
    setAssinado(true);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    toast.success("Contrato deferido!", {
      description: "Os Termos de Amor da Mesa 22 entraram em vigor.",
    });
  };

  return (
    <article className="relative overflow-hidden rounded-[1.4rem] border border-cafe-line bg-cafe-paper p-5 shadow-cafe">
      <div className="coffee-ring right-[-30px] top-[-20px]" />
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cafe-espresso text-cafe-paper">
          <Scale size={22} />
        </span>
        <div>
          <p className="eyebrow">contrato juridico</p>
          <h3 className="font-serif text-3xl font-bold">Termos de Amor</h3>
        </div>
      </div>

      {assinado ? (
        <div className="rounded-2xl border border-[#275d3b]/20 bg-[#d9fdd3] p-4 text-[#275d3b]">
          <p className="flex items-center gap-2 text-sm font-black">
            <CheckCircle2 size={18} />
            Deferido e assinado pela Primeira Dama
          </p>
          <p className="mt-2 text-xs font-semibold opacity-80">Contrato vitalicio em vigor. Prioridade afetiva reconhecida.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 text-sm leading-6 text-cafe-muted">
            <p>
              <strong className="text-cafe-ink">Art. 1:</strong> A contratante tem direito incontestavel a atencao,
              carinho ilimitado e prioridade na fila de pedidos.
            </p>
            <p>
              <strong className="text-cafe-ink">Art. 2:</strong> Fome, TPM ou saudade atenuam qualquer infracao,
              exigindo aplicacao imediata do item Chocolate Habeas Corpus.
            </p>
          </div>
          <button
            onClick={handleAssinar}
            className="mt-5 w-full rounded-2xl bg-cafe-espresso px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-cafe-paper transition active:scale-[0.99]"
          >
            Assinar eletronicamente
          </button>
        </>
      )}
    </article>
  );
}

function LoyaltyCard() {
  return (
    <article className="rounded-[1.4rem] border border-cafe-line bg-cafe-paper p-5 shadow-cafe">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="eyebrow">cartao fidelidade</p>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">Caimbos da Mesa 22</h3>
        </div>
        <Sparkles className="text-cafe-honey" size={22} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {loyaltyStamps.map(([date, title, text]) => (
          <div key={title} className="rounded-2xl border border-dashed border-cafe-espresso/30 bg-cafe-cream p-2.5 sm:p-3">
            <span className="text-xs font-black text-cafe-honey">{date}</span>
            <strong className="mt-1 block text-sm leading-tight break-words">{title}</strong>
            <span className="mt-1 block text-xs leading-4 text-cafe-muted break-words">{text}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function PeDeCafe({ time }) {
  const [isWatering, setIsWatering] = useState(false);
  const maxDays = 365;
  const progressValue = Math.min(Math.max(time.totalDays / maxDays, 0), 1);
  const progressPercent = Math.round(progressValue * 100);
  const completedMonths = Math.max(0, time.years * 12 + time.months);
  const growthMonth = Math.min(12, Math.max(1, completedMonths));

  const monthlyMessages = [
    "22/12: Um mês de nós, e eu já sabia que era você.",
    "22/01: Dois meses e meu lugar favorito continua sendo do seu lado.",
    "22/02: Três meses de cuidado que fazem tudo florescer.",
    "22/03: Quatro meses e cada conversa sua ainda me desmonta bonito.",
    "22/04: Cinco meses, e todo dia comum vira lembrança boa com você.",
    "22/05: Seis meses de amor servido quentinho, do jeitinho da casa.",
    "22/06: Sete meses e eu sigo escolhendo você em cada detalhe.",
    "22/07: Oito meses: nossa história só fica mais linda quando cresce junto.",
    "22/08: Nove meses, com raiz firme e coração leve.",
    "22/09: Dez meses e você continua sendo meu melhor destino.",
    "22/10: Onze meses, quase um ano de um amor que só soma.",
    "22/11: Um ano! Nosso bonsai está completo, como o nosso capítulo mais especial.",
  ];

  const currentMessage = monthlyMessages[growthMonth - 1];

  const handleWatering = () => {
    setIsWatering(true);
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.64, x: 0.5 },
      colors: ["#7dd3fc", "#38bdf8", "#bae6fd"],
      shapes: ["circle"],
      gravity: 1.4,
      scalar: 0.65,
      ticks: 45,
    });
    setTimeout(() => setIsWatering(false), 1000);
  };

  return (
    <article className="relative overflow-hidden rounded-[1.4rem] border border-cafe-line bg-cafe-paper p-5 shadow-cafe">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">bonsai da mesa 22</p>
          <h3 className="font-serif text-2xl font-bold">Nosso Bonsai em Crescimento</h3>
          <p className="mt-1 max-w-[240px] text-xs leading-5 text-cafe-muted">Crescendo todos os dias até completar 1 ano no dia 22/11.</p>
        </div>
        <button
          onClick={handleWatering}
          disabled={isWatering}
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all",
            isWatering ? "scale-95 bg-blue-100 text-blue-500" : "bg-cafe-cream text-cafe-espresso hover:bg-[#e8dccb]",
          )}
          aria-label="Regar bonsai"
        >
          <Droplets size={18} className={cn(isWatering && "animate-bounce")} />
        </button>
      </div>

      <div className="relative mt-5 flex h-52 w-full items-end justify-center border-b-[3px] border-[#4a3525] pb-1">
        <div className="absolute bottom-0 left-0 h-14 w-full bg-gradient-to-t from-[#4a3525]/10 to-transparent" />

        <Motion.div
          animate={isWatering ? { scale: [1, 1.04, 1], y: [0, -4, 0] } : {}}
          transition={{ duration: 0.55 }}
          className="relative z-10 h-full w-full max-w-[230px]"
        >
          <svg viewBox="0 0 120 110" className="h-full w-full overflow-visible">
            <rect x="32" y="90" width="56" height="14" rx="4" fill="#6f4e37" />
            <rect x="28" y="102" width="64" height="4" rx="2" fill="#4a3525" />

            <Motion.path
              d="M 60 90 C 54 78, 52 66, 60 54 C 70 40, 62 26, 56 18"
              fill="none"
              stroke="#5a3d2b"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progressValue }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />

            {progressValue > 0.2 && <BonsaiLeaf path="M 60 62 C 76 58, 86 64, 90 72 C 76 74, 66 70, 60 62" delay={0.2} />}
            {progressValue > 0.3 && <BonsaiLeaf path="M 59 56 C 46 50, 36 54, 30 62 C 42 66, 52 62, 59 56" delay={0.3} />}
            {progressValue > 0.45 && <BonsaiLeaf path="M 57 45 C 42 36, 30 38, 24 46 C 36 52, 49 50, 57 45" delay={0.45} />}
            {progressValue > 0.6 && <BonsaiLeaf path="M 62 40 C 78 34, 92 38, 98 48 C 84 54, 70 50, 62 40" delay={0.6} />}
            {progressValue > 0.75 && <BonsaiLeaf path="M 58 30 C 45 22, 35 24, 29 30 C 40 38, 52 36, 58 30" delay={0.75} />}
            {progressValue > 0.9 && <BonsaiLeaf path="M 61 24 C 74 18, 84 22, 90 28 C 79 34, 68 32, 61 24" delay={0.9} />}
            {progressValue >= 1 && <Motion.circle cx="60" cy="18" r="4" fill="#d4a017" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} />}
          </svg>
        </Motion.div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-cafe-line/50">
        <Motion.div className="h-full bg-cafe-honey" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1.2, ease: "easeOut" }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.14em] text-cafe-muted">
        <span>Mês {growthMonth}/12</span>
        <span>{progressPercent}%</span>
      </div>
      <p className="mt-3 rounded-xl border border-cafe-line/70 bg-cafe-cream/50 px-3 py-2 text-xs leading-5 text-cafe-ink break-words">{currentMessage}</p>
    </article>
  );
}

function BonsaiLeaf({ path, delay }) {
  return (
    <Motion.path
      d={path}
      fill="#4f7c3b"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", delay, stiffness: 90 }}
      style={{ originX: "60px", originY: "90px" }}
    />
  );
}


function Arquivo({ activeEvent, setSelectedEventId }) {
  const [conversationOpen, setConversationOpen] = useState(false);
  const eventIcons = [MessageCircle, Heart, Gamepad2, Scale, Coffee, Sparkles, BookOpen, Camera, Radio, Trophy];

  const openConversation = (eventId) => {
    setSelectedEventId(eventId);
    setConversationOpen(true);
  };

  return (
    <Page>
      <SectionTitle
        eyebrow="arquivo da mesa 22"
        title="As mensagens exatas, servidas em clima de Coffee Talk."
        description="Escolha uma data e releia os detalhes sem transformar WhatsApp em print solto. Aqui tudo vira memória preservada."
      />

      <div className="grid gap-5">
        <aside className="space-y-3">
          {archiveEvents.map((event, index) => {
            const Icon = eventIcons[index % eventIcons.length];
            const preview = event.messages?.[event.messages.length - 1]?.text ?? "Toque para abrir a conversa";
            return (
              <button
                key={event.id}
                onClick={() => openConversation(event.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[1.2rem] border p-4 text-left transition",
                  event.id === activeEvent.id
                    ? "border-cafe-espresso bg-cafe-espresso text-cafe-paper"
                    : "border-cafe-line bg-cafe-paper text-cafe-ink active:opacity-85",
                )}
              >
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-full",
                    event.id === activeEvent.id ? "bg-cafe-paper/20 text-cafe-paper" : "bg-cafe-cream text-cafe-espresso",
                  )}
                >
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <strong className="break-words font-serif text-xl leading-tight">{event.title}</strong>
                    <span className="shrink-0 text-[11px] font-bold opacity-70">{event.displayDate}</span>
                  </span>
                  <span className="mt-1 block break-words text-xs font-semibold leading-tight opacity-80">{preview}</span>
                  <span className="mt-2 block text-[11px] font-bold opacity-70">{event.messages.length} mensagens</span>
                </span>
              </button>
            );
          })}
        </aside>
      </div>
      <AnimatePresence>
        {conversationOpen && <ConversationModal event={activeEvent} onClose={() => setConversationOpen(false)} />}
      </AnimatePresence>
    </Page>
  );
}

function ConversationModal({ event, onClose }) {
  useEffect(() => {
    const scrollY = window.scrollY;
    const previousBodyStyles = {
      left: document.body.style.left,
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      right: document.body.style.right,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.left = previousBodyStyles.left;
      document.body.style.right = previousBodyStyles.right;
      document.body.style.width = previousBodyStyles.width;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <Motion.div
      className="fixed inset-0 z-[70] overflow-hidden overscroll-contain bg-cafe-espresso/70 p-0 sm:grid sm:place-items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="flex h-[100dvh] min-h-0 w-full max-w-full flex-col overflow-hidden overscroll-contain bg-[#efe3d2] sm:h-auto sm:max-h-[90vh] sm:max-w-5xl sm:rounded-[1.2rem]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-cafe-line/60 bg-[#f8f0e5] px-3 py-2 sm:px-4 sm:py-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cafe-paper text-cafe-espresso"
              aria-label="Voltar para lista de conversas"
            >
              <ChevronRight className="rotate-180" size={18} />
            </button>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cafe-espresso text-cafe-paper">
              <MessageCircle size={18} />
            </span>
            <div className="min-w-0">
              <strong className="block break-words text-sm leading-tight text-cafe-ink">{event.title}</strong>
              <span className="mt-0.5 block text-[11px] font-semibold text-cafe-muted">online</span>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <button className="grid h-9 w-9 place-items-center rounded-full bg-cafe-paper text-cafe-espresso" aria-label="Ligar">
              <Phone size={16} />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-cafe-paper text-cafe-espresso" aria-label="Videochamada">
              <Video size={16} />
            </button>
          </div>
        </div>
        <CoffeeTalk event={event} compact />
      </Motion.div>
    </Motion.div>
  );
}

function CoffeeTalk({ event, compact = false }) {
  const messageRefs = useRef([]);
  const chapters =
    event.chapters?.map((chapter, index) =>
      typeof chapter === "string" ? { label: chapter, messageIndex: index === 0 ? 0 : 0 } : chapter,
    ) ?? [];

  const jumpToChapter = (messageIndex) => {
    messageRefs.current[messageIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article className={cn("flex min-h-0 w-full flex-col overflow-hidden border border-[#d8c5ae] bg-[#efe3d2] shadow-cafe", compact ? "flex-1 rounded-none sm:rounded-[1.6rem]" : "rounded-[1.6rem]")}>
      <div className={cn("shrink-0 border-b border-white/10 bg-[#241812] p-4 text-cafe-paper sm:p-5", compact && "hidden sm:block")}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cafe-honey">{event.label}</p>
            <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">{event.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-cafe-paper/70">{event.summary}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <span className="block text-xs uppercase tracking-[0.16em] text-cafe-paper/50">data</span>
            <strong className="font-serif text-xl">{event.displayDate}</strong>
          </div>
        </div>
        {chapters.length > 0 && (
          <div className="horizontal-scroll mt-4 flex gap-2 overflow-x-auto pb-1">
            {chapters.map((chapter) => (
              <button
                key={chapter.label}
                onClick={() => jumpToChapter(chapter.messageIndex)}
                className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-cafe-paper/75 transition hover:bg-white/10 hover:text-cafe-paper"
                type="button"
              >
                {chapter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col bg-[#efe3d2]">
        <div className="absolute inset-0 opacity-[0.18] whatsapp-pattern" />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-cafe-line/70 bg-[#f8f0e5] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cafe-espresso text-cafe-paper">
                <Coffee size={19} />
              </span>
              <div>
                <strong className="block text-sm leading-none">Mesa 22</strong>
                <span className="text-xs text-cafe-muted">Melzudin e Advogata</span>
              </div>
            </div>
            <span className="rounded-full bg-[#d9fdd3] px-3 py-1 text-xs font-bold text-[#275d3b]">online</span>
          </div>
          {chapters.length > 0 && (
            <div className="shrink-0 border-b border-cafe-line/70 bg-[#fff8ec] px-3 py-2 sm:hidden">
              <div className="horizontal-scroll flex gap-2 overflow-x-auto pb-1">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.label}
                    onClick={() => jumpToChapter(chapter.messageIndex)}
                    className="shrink-0 rounded-full border border-cafe-line bg-cafe-cream px-3 py-1.5 text-xs font-black text-cafe-espresso"
                    type="button"
                  >
                    {chapter.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="conversation-scroll min-h-0 flex-1 overflow-y-auto px-3 py-5 sm:px-5">
            <div className="mx-auto flex max-w-3xl flex-col gap-2">
              {event.messages.map((message, index) => (
                <div
                  key={`${message.stamp}-${index}`}
                  ref={(node) => {
                    messageRefs.current[index] = node;
                  }}
                  className="scroll-mt-4"
                >
                  <ChatBubble message={message} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ChatBubble({ message }) {
  const isMelzudin = message.author === "Melzudin";
  const time = message.stamp.split(" ")[1];

  return (
    <div className={cn("flex w-full min-w-0", isMelzudin ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[86%] min-w-0 overflow-hidden rounded-lg px-3 py-2 shadow-sm sm:max-w-[68%]",
          isMelzudin
            ? "rounded-tr-none bg-[#d9fdd3] text-[#1f1f1f]"
            : "rounded-tl-none bg-white text-[#1f1f1f]",
        )}
      >
        <div className="mb-1 flex items-center justify-between gap-4">
          <span className={cn("text-xs font-bold", isMelzudin ? "text-[#2e7d52]" : "text-[#6b7280]")}>
            {message.author}
          </span>
        </div>
        {/* wordBreak inline garante compatibilidade cross-browser para textos sem espaço */}
        <p
          className="whitespace-pre-wrap break-words pr-10 text-[15px] leading-6"
          style={{ wordBreak: "break-word" }}
        >
          {message.text}
        </p>
        <span className="absolute bottom-1 right-2 text-[10px] font-medium text-black/45">{time}</span>
      </div>
    </div>
  );
}

function AcervoFotos() {
  const [selectedEventId, setSelectedEventId] = useState(photoEvents[0]?.id);
  const activeEvent = photoEvents.find((event) => event.id === selectedEventId) ?? photoEvents[0];

  if (!activeEvent) return null;

  return (
    <Page>
      <div className="mb-6 max-w-3xl">
        <p className="eyebrow flex items-center gap-2">
          <Package size={14} /> estoque da mesa 22
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold leading-tight sm:text-5xl">Lotes de Memórias</h1>
        <p className="mt-3 text-sm leading-6 text-cafe-muted">
          Aqui, cada dia importante é armazenado como um lote único de café especial. Fichas catalogadas, amostras
          preservadas e prontas para consumo.
        </p>
      </div>

      <div className="mb-6 -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-4">
        {photoEvents.map((event, index) => (
          <button
            key={event.id}
            onClick={() => setSelectedEventId(event.id)}
            className={cn(
              "min-w-[78%] max-w-[260px] snap-start shrink-0 rounded-[1.2rem] border-2 p-3 text-left transition-all sm:min-w-[220px]",
              event.id === activeEvent.id
                ? "border-cafe-espresso bg-cafe-espresso text-cafe-paper shadow-md"
                : "border-dashed border-cafe-line bg-cafe-paper text-cafe-ink hover:border-cafe-espresso/40 active:scale-95",
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  event.id === activeEvent.id ? "text-cafe-honey" : "text-cafe-muted",
                )}
              >
                Lote #{String(index + 1).padStart(2, "0")}
              </span>
              <Tag size={14} className={event.id === activeEvent.id ? "text-cafe-honey" : "text-cafe-muted"} />
            </div>
            <strong className="block break-words font-serif text-base leading-tight sm:text-lg">{event.folderName}</strong>
            <span className="mt-1 flex items-center gap-1.5 break-words text-[11px] font-bold opacity-70">
              <CalendarDays size={12} /> {event.displayDate}
            </span>
          </button>
        ))}
      </div>

      <section className="mb-6 rounded-[1.4rem] border border-cafe-line bg-cafe-paper p-1 shadow-cafe">
        <div className="rounded-[1.2rem] border-2 border-dashed border-cafe-line/50 bg-[#fcf9f2] p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-cafe-line/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cafe-cream text-cafe-espresso">
                <Archive size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cafe-muted">Ficha Técnica</p>
                <h2 className="break-words font-serif text-xl font-bold leading-tight sm:text-2xl">{activeEvent.folderName}</h2>
              </div>
            </div>
            <div className="hidden sm:block">
              <BarcodePattern />
            </div>
          </div>

          <p className="text-sm leading-6 text-cafe-ink/80">{activeEvent.summary}</p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
            <StockMetric label="Status" value="Estocado" />
            <StockMetric label="Colheita" value={activeEvent.displayDate} />
            <StockMetric label="Variedade" value={activeEvent.title} />
            <StockMetric label="Amostras" value={`${activeEvent.images.length} fotos`} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeEvent.images.map((photo, index) => {
          const src = typeof photo === "string" ? photo : photo.src;
          return (
            <Motion.article
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-[1.2rem] border border-cafe-line bg-cafe-paper shadow-sm"
            >
              <div className="aspect-square w-full border-b border-cafe-line bg-[#fdfbf7] p-3 pb-0">
                <div className="h-full w-full overflow-hidden rounded-t-xl bg-cafe-cream">
                  <img
                    src={src}
                    alt={`${activeEvent.title} ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="relative bg-cafe-paper p-4">
                <div className="absolute left-0 top-0 h-[1px] w-full border-t border-dashed border-cafe-line" />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-cafe-muted">
                      <Hash size={10} /> AMOSTRA {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 break-words font-serif text-base font-bold leading-tight text-cafe-ink sm:text-lg">{activeEvent.title}</h3>
                  </div>
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-cafe-honey/30 bg-cafe-honey/10 text-cafe-honey">
                    <Camera size={14} />
                  </div>
                </div>
              </div>
            </Motion.article>
          );
        })}
      </div>
    </Page>
  );
}

function StockMetric({ label, value }) {
  return (
    <div className="rounded-xl border border-cafe-line/60 bg-cafe-cream/40 p-2 sm:p-3">
      <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-cafe-muted">{label}</span>
      <strong className="mt-0.5 block break-words text-xs leading-tight sm:text-sm">{value}</strong>
    </div>
  );
}

function BarcodePattern() {
  return (
    <div className="flex h-8 items-center gap-[2px] opacity-30 grayscale">
      {[2, 4, 2, 1, 3, 1, 2, 4, 1, 2, 3, 2, 1, 4, 2, 1].map((w, i) => (
        <div key={i} className="h-full bg-cafe-ink" style={{ width: `${w}px` }} />
      ))}
    </div>
  );
}

function PhotoFlipModal({ photoState, events, onClose, onChange }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const event = events.find((item) => item.id === photoState.eventId) ?? events[0];
  const photo = event?.images[photoState.index];
  const src = typeof photo === "string" ? photo : photo?.src;
  const verso = (typeof photo === "object" && photo?.verso) || event?.verso || event?.summary;

  if (!event || !src) {
    return null;
  }

  const movePhoto = (direction) => {
    const nextIndex = (photoState.index + direction + event.images.length) % event.images.length;
    setIsFlipped(false);
    onChange({ eventId: event.id, index: nextIndex });
  };

  const toggleFromDrag = (_, info) => {
    if (Math.abs(info.offset.x) > 65) {
      setIsFlipped((current) => !current);
    }
  };

  return (
    <Motion.div
      className="fixed inset-0 z-[75] overflow-y-auto bg-cafe-espresso/78 p-3 sm:grid sm:place-items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Motion.div
        initial={{ y: 28, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 18, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(eventClick) => eventClick.stopPropagation()}
        className="my-4 w-full max-w-lg sm:my-0"
      >
        <div className="mb-3 flex items-center justify-between gap-3 text-cafe-paper">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cafe-honey">{event.label}</p>
            <h2 className="break-words font-serif text-xl font-bold leading-tight sm:text-2xl">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cafe-paper text-cafe-espresso"
            aria-label="Fechar foto"
            type="button"
          >
            <X size={19} />
          </button>
        </div>

        <Motion.div
          className="photo-flip-scene mx-auto"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.24}
          onDragEnd={toggleFromDrag}
          onDoubleClick={() => setIsFlipped((current) => !current)}
        >
          <Motion.div
            className="photo-flip-card"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <div className="photo-flip-face rounded-[1.1rem] bg-cafe-paper p-3 shadow-cafe">
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-cafe-cream">
                <img src={src} alt={`${event.title} ${photoState.index + 1}`} className="h-full w-full object-cover" />
              </div>
              <div className="px-2 pb-2 pt-4">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-cafe-honey">{event.displayDate}</span>
                <p className="mt-1 break-words font-serif text-xl font-bold leading-tight sm:text-2xl">{event.folderName}</p>
              </div>
            </div>

            <div className="photo-flip-face photo-flip-back rounded-[1.1rem] bg-cafe-paper p-5 shadow-cafe">
              <div className="flex h-full flex-col justify-between rounded-xl border border-dashed border-cafe-espresso/25 bg-[#fffaf0] p-5">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-cafe-honey">{event.displayDate}</span>
                <p className="break-words font-serif text-2xl leading-tight text-cafe-espresso sm:text-3xl" style={{ fontStyle: "italic" }}>
                  {verso}
                </p>
                <span className="text-right text-sm font-black uppercase tracking-[0.14em] text-cafe-muted">Mesa 22</span>
              </div>
            </div>
          </Motion.div>
        </Motion.div>

        {event.images.length > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => movePhoto(-1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-cafe-paper text-cafe-espresso"
              aria-label="Foto anterior"
              type="button"
            >
              <SkipBack size={20} />
            </button>
            <span className="rounded-full bg-cafe-paper/12 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cafe-paper">
              {photoState.index + 1}/{event.images.length}
            </span>
            <button
              onClick={() => movePhoto(1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-cafe-paper text-cafe-espresso"
              aria-label="Proxima foto"
              type="button"
            >
              <SkipForward size={20} />
            </button>
          </div>
        )}
      </Motion.div>
    </Motion.div>
  );
}

function ReceiptModal({ item, onClose }) {
  const signatureRef = useRef(null);
  const [signed, setSigned] = useState(false);

  const closeWhenSigned = () => {
    if (!signed) {
      toast.warning("Assinatura pendente", {
        description: "A Primeira Dama precisa assinar o recebimento antes de servir na mesa.",
      });
      return;
    }
    onClose();
  };

  return (
    <Motion.div
      className="fixed inset-0 z-[70] grid place-items-center bg-cafe-espresso/70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeWhenSigned}
    >
      <Motion.div
        initial={{ y: 40, opacity: 0, rotate: -1 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 30, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
        className="receipt-paper w-full max-w-md p-6 text-cafe-ink"
      >
        <div className="coffee-ring bottom-[-35px] right-[-35px]" />
        <div className="text-center">
          <Coffee className="mx-auto mb-2 text-cafe-espresso" />
          <h2 className="font-serif text-3xl font-bold">Café 22</h2>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cafe-muted">pedido recebido</p>
        </div>
        <div className="my-6 border-y border-dashed border-cafe-espresso/30 py-4">
          <InfoLine label="Cliente" value="Advogata" />
          <InfoLine label="Barista" value="Melzudin" />
          <InfoLine label="Mesa" value="22" />
          <InfoLine label="Item" value={item.name} />
          <InfoLine label="Total" value={item.price} />
        </div>
        <p className="text-center text-sm leading-6 text-cafe-muted">{item.description}</p>
        <div className="mt-5 rounded-2xl border border-dashed border-cafe-espresso/35 bg-cafe-cream p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-cafe-muted">
              <PenLine size={15} />
              Assinatura
            </span>
            <button
              type="button"
              onClick={() => {
                signatureRef.current?.clear();
                setSigned(false);
              }}
              className="grid h-8 w-8 place-items-center rounded-full bg-cafe-paper text-cafe-espresso"
              aria-label="Limpar assinatura"
            >
              <Eraser size={15} />
            </button>
          </div>
          <div className="h-28 overflow-hidden rounded-xl bg-cafe-paper">
            <SignatureCanvas
              ref={signatureRef}
              penColor="#2b1a14"
              onEnd={() => setSigned(!signatureRef.current?.isEmpty())}
              canvasProps={{
                className: "h-full w-full",
                "aria-label": "Assinar recebimento do pedido",
              }}
            />
          </div>
          <p className="mt-2 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-cafe-muted">
            {signed ? "recebimento assinado" : "assine para confirmar o recebimento"}
          </p>
        </div>
        <div className="mt-6 flex flex-col-reverse sm:grid sm:grid-cols-2 gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full rounded-2xl border border-cafe-line bg-cafe-paper px-3 py-3 text-xs sm:text-sm font-black uppercase tracking-[0.1em] sm:tracking-[0.16em] text-cafe-muted transition active:scale-[0.99]"
          >
            Cancelar
          </button>
          <button
            onClick={closeWhenSigned}
            className={cn(
              "w-full rounded-2xl px-3 py-3 text-xs sm:text-sm font-black uppercase tracking-[0.1em] sm:tracking-[0.16em] transition",
              signed ? "bg-cafe-espresso text-cafe-paper active:scale-[0.99]" : "bg-cafe-line text-cafe-muted",
            )}
          >
            Servir na mesa
          </button>
        </div>
      </Motion.div>
    </Motion.div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 text-sm">
      <span className="font-black uppercase tracking-[0.12em] text-cafe-muted">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-5 max-w-3xl sm:mb-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{title}</h1>
      {description && <p className="mt-2 text-sm leading-6 text-cafe-muted sm:mt-3 sm:text-base sm:leading-7">{description}</p>}
    </div>
  );
}

export default App;
