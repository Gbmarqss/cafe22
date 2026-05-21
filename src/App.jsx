import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import useSound from "use-sound";
import SignatureCanvas from "react-signature-canvas";
import {
  Archive,
  Ban,
  BookOpen,
  CalendarCheck,
  Camera,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Coffee,
  Croissant,
  CupSoda,
  Eraser,
  Gamepad2,
  Heart,
  Home,
  Image as ImageIcon,
  MessageCircle,
  Monitor,
  Pause,
  PenLine,
  Play,
  Radio,
  ReceiptText,
  Scale,
  Sparkles,
  Stamp,
  Trophy,
  Utensils,
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

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:pb-10">
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
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cafe-muted">
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
                "rounded-full px-4 py-2 text-sm font-bold transition",
                activeTab === item.id ? "bg-cafe-espresso text-cafe-paper" : "text-cafe-muted hover:text-cafe-ink",
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
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-cafe-line bg-cafe-paper px-2 py-2 shadow-[0_-10px_30px_rgba(43,26,20,0.08)] md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold transition",
                isActive ? "bg-cafe-espresso text-cafe-paper" : "text-cafe-muted",
              )}
              aria-label={item.label}
            >
              <Icon size={19} strokeWidth={2.4} />
              <span>{item.label}</span>
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
      <section className="overflow-hidden rounded-[1.6rem] border border-cafe-line bg-cafe-paper shadow-cafe">
        <div className="relative min-h-[390px]">
          <img src={acervoHero.src} alt={acervoHero.alt} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-cafe-espresso via-cafe-espresso/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-cafe-paper sm:p-8">
            <p className="mb-3 inline-flex rounded-full bg-cafe-honey px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-cafe-espresso">
              pedido especial em preparo
            </p>
            <h1 className="max-w-xl font-serif text-5xl font-bold leading-[0.95] sm:text-6xl">
              Mesa reservada para Melzudin e Advogata.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-cafe-paper/85 sm:text-base">
              Uma cafeteria simples, feita para guardar as conversas, fotos, pedidos e pequenos sinais que trouxeram vocês até aqui.
            </p>
          </div>
        </div>
      </section>

      <aside className="grid gap-5">
        <TimerCard time={time} />
        <RadioCard />
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
          <h2 className="font-serif text-3xl font-bold">Desde 22/11/2025</h2>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cafe-cream text-cafe-espresso">
          <Clock3 size={22} />
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {units.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-cafe-line bg-cafe-cream p-3 text-center">
            <strong className="block font-serif text-3xl leading-none">{value}</strong>
            <span className="mt-1 block text-xs font-bold uppercase tracking-[0.14em] text-cafe-muted">{label}</span>
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
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  return (
    <section className="rounded-[1.4rem] border border-cafe-line bg-[#2b1a14] p-4 text-cafe-paper shadow-cafe">
      <audio ref={audioRef} src="/musica.mp3" onEnded={() => setPlaying(false)} />
      <div className="flex items-center gap-4">
        <img src={acervoHero.src} alt={acervoHero.alt} className="h-20 w-20 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-cafe-paper/60">radio da cafeteria</p>
          <h3 className="truncate font-serif text-2xl font-bold">No Ordinary Love</h3>
        <p className="text-sm text-cafe-paper/70">Sade, tocando no Café 22</p>
        </div>
        <button
          onClick={toggle}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cafe-honey text-cafe-espresso transition active:scale-95"
          aria-label={playing ? "Pausar" : "Tocar"}
        >
          {playing ? <Pause size={21} fill="currentColor" /> : <Play size={21} fill="currentColor" />}
        </button>
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
                  <Icon size={23} />
                </span>
                <span className="rounded-full bg-cafe-honey/20 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-cafe-espresso">
                  {item.category}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-3xl font-bold">{item.name}</h3>
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
    <section className="relative mb-7 min-h-[13rem] overflow-hidden rounded-[1.45rem] border border-[#43291f] bg-cafe-espresso p-5 text-cafe-paper shadow-cafe sm:min-h-[14rem] sm:p-6">
      <div className="absolute inset-0 opacity-35 cafe-counter-pattern" />
      <div className="absolute bottom-0 left-0 h-20 w-full border-t-[7px] border-cafe-line bg-[#21130e]" />

      <div className="absolute right-5 top-5 z-20 text-right sm:right-6 sm:top-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-cafe-paper/55">senha 22</p>
        <h2 className="font-serif text-3xl font-bold leading-tight text-cafe-honey sm:text-4xl">Area de Pedidos</h2>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-cafe-paper/65">aguarde ser chamada</p>
      </div>

      <div className="relative z-10 flex min-h-[11rem] items-end justify-between gap-4 pr-0 pt-14 sm:pr-64 sm:pt-4">
        <div className="flex items-end gap-5 sm:gap-8">
          <div className="flex flex-col items-center">
            <div className="relative h-20 w-24 rounded-t-2xl border border-white/20 bg-[#c9c4bc] shadow-[inset_0_-10px_0_rgba(0,0,0,0.12)]">
              <div className="mx-auto mt-3 h-2 w-14 rounded-full bg-[#5f5a55]" />
              <div className="absolute bottom-4 left-1/2 h-5 w-9 -translate-x-1/2 rounded-b-lg bg-[#3c3733]" />
            </div>
            <div className="h-11 w-20 rounded-b-xl bg-[#9b958c]" />
            <div className="-mt-2 grid h-8 w-10 place-items-center rounded-b-full border border-cafe-paper/50 bg-cafe-espresso text-cafe-paper">
              <Coffee size={19} />
            </div>
          </div>

          <div className="mb-2 hidden flex-col items-center sm:flex">
            <Monitor className="text-cafe-cream" size={43} />
            <div className="h-8 w-14 rounded-b-lg bg-[#5b5048]" />
          </div>

          <div className="mb-1 flex items-end gap-2">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-cafe-line/60 bg-cafe-paper text-cafe-espresso">
              <CupSoda size={22} />
            </span>
            <span className="h-8 w-5 rounded-t-full bg-cafe-honey/90" />
            <span className="h-5 w-12 rounded-full bg-cafe-paper/85" />
          </div>
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
      <h2 className="mt-2 font-serif text-5xl font-bold">Mesa 22</h2>
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
      </section>
    </Page>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-cafe-line bg-cafe-cream px-4 py-3">
      <span className="text-xs font-black uppercase tracking-[0.16em] text-cafe-muted">{label}</span>
      <strong className="text-right text-sm">{value}</strong>
    </div>
  );
}

function FeatureCard(props) {
  const Wrapper = props.onClick ? "button" : "article";
  const Icon = props.icon;
  return (
    <Wrapper
      onClick={props.onClick}
      className="flex w-full items-center gap-4 rounded-[1.4rem] border border-cafe-line bg-cafe-paper p-4 text-left shadow-cafe transition hover:-translate-y-0.5"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cafe-espresso text-cafe-paper">
        <Icon size={22} />
      </span>
      <span>
        <strong className="block font-serif text-2xl">{props.title}</strong>
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
    <article className="rounded-[1.4rem] border border-cafe-line bg-cafe-paper p-5 shadow-cafe">
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
          <h3 className="font-serif text-3xl font-bold">Carimbos da Mesa 22</h3>
        </div>
        <Sparkles className="text-cafe-honey" size={25} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {loyaltyStamps.map(([date, title, text]) => (
          <div key={title} className="rounded-2xl border border-dashed border-cafe-espresso/30 bg-cafe-cream p-3">
            <span className="text-xs font-black text-cafe-honey">{date}</span>
            <strong className="mt-1 block text-sm">{title}</strong>
            <span className="mt-1 block text-xs leading-4 text-cafe-muted">{text}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function Arquivo({ activeEvent, setSelectedEventId }) {
  return (
    <Page>
      <SectionTitle
        eyebrow="arquivo da mesa 22"
        title="As mensagens exatas, servidas em clima de Coffee Talk."
        description="Escolha uma data e releia os detalhes sem transformar WhatsApp em print solto. Aqui tudo vira memória preservada."
      />

      <div className="grid gap-5 lg:grid-cols-[330px_1fr]">
        <aside className="flex gap-3 overflow-x-auto pb-2 pl-1 pr-1 lg:block lg:max-h-[74vh] lg:space-y-3 lg:overflow-y-auto lg:pr-2">
          {archiveEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={cn(
                "min-w-[260px] rounded-[1.2rem] border p-4 text-left transition lg:w-full",
                event.id === activeEvent.id
                  ? "border-cafe-espresso bg-cafe-espresso text-cafe-paper"
                  : "border-cafe-line bg-cafe-paper text-cafe-ink hover:border-cafe-espresso/40",
              )}
            >
              <span className="text-xs font-black uppercase tracking-[0.16em] opacity-70">{event.displayDate}</span>
              <strong className="mt-2 block font-serif text-xl">{event.title}</strong>
              <span className="mt-1 block text-xs font-bold opacity-70">{event.messages.length} mensagens</span>
            </button>
          ))}
        </aside>

        <CoffeeTalk event={activeEvent} />
      </div>
    </Page>
  );
}

function CoffeeTalk({ event }) {
  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-[#d8c5ae] bg-[#efe3d2] shadow-cafe">
      <div className="border-b border-white/10 bg-[#241812] p-4 text-cafe-paper sm:p-5">
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
        {event.chapters && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {event.chapters.map((chapter) => (
              <span key={chapter} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-cafe-paper/75">
                {chapter}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="relative min-h-[560px] bg-[#efe3d2]">
        <div className="absolute inset-0 opacity-[0.18] whatsapp-pattern" />
        <div className="relative z-10 flex min-h-[560px] flex-col">
          <div className="flex items-center justify-between border-b border-cafe-line/70 bg-[#f8f0e5] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cafe-espresso text-cafe-paper">
                <Coffee size={19} />
              </span>
              <div>
                <strong className="block text-sm leading-none">Mesa 22</strong>
                <span className="text-xs text-cafe-muted">Melzudin e Advogata</span>
              </div>
            </div>
            <span className="rounded-full bg-[#d9fdd3] px-3 py-1 text-xs font-bold text-[#275d3b]">online</span>
          </div>
          <div className="max-h-[64vh] overflow-y-auto px-3 py-5 sm:px-5 lg:max-h-[72vh]">
            <div className="mx-auto flex max-w-3xl flex-col gap-2">
              {event.messages.map((message, index) => (
                <ChatBubble key={`${message.stamp}-${index}`} message={message} />
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
    <div className={cn("flex", isMelzudin ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[86%] rounded-lg px-3 py-2 shadow-sm sm:max-w-[68%]",
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
        <p className="whitespace-pre-wrap pr-10 text-[15px] leading-6">{message.text}</p>
        <span className="absolute bottom-1 right-2 text-[10px] font-medium text-black/45">{time}</span>
      </div>
    </div>
  );
}

function AcervoFotos() {
  const [selectedEventId, setSelectedEventId] = useState(photoEvents[0]?.id);
  const activeEvent = photoEvents.find((event) => event.id === selectedEventId) ?? photoEvents[0];

  if (!activeEvent) {
    return null;
  }

  return (
    <Page>
      <SectionTitle
        eyebrow="acervo da cafeteria"
        title="Cada pasta virou uma memória com nome, contexto e lugar próprio."
        description="Escolha um evento para ver as fotos daquele capítulo da Mesa 22, sem misturar as histórias."
      />

      <section className="mb-5 overflow-hidden rounded-[1.45rem] border border-cafe-line bg-cafe-paper shadow-cafe">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[270px]">
            <img src={acervoHero.src} alt={acervoHero.alt} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-cafe-espresso/80 via-cafe-espresso/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 text-cafe-paper">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cafe-honey">foto da casa</p>
              <h2 className="mt-1 font-serif text-4xl font-bold">Pebinhas taiobas</h2>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-5 p-5 sm:p-6">
            <div>
              <p className="eyebrow">pasta do acervo</p>
              <p className="mt-1 text-sm font-black uppercase tracking-[0.14em] text-cafe-honey">
                {activeEvent.folderName}
              </p>
              <h3 className="mt-2 font-serif text-4xl font-bold">{activeEvent.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-cafe-muted">{activeEvent.summary}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InfoMetric value={photoEvents.length} label="eventos" />
              <InfoMetric value={activeEvent.images.length} label="fotos" />
              <InfoMetric value="22" label="mesa" />
            </div>
          </div>
        </div>
      </section>

      <div className="mb-5 flex gap-3 overflow-x-auto pb-2">
        {photoEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelectedEventId(event.id)}
            className={cn(
              "min-w-[250px] rounded-[1.1rem] border p-3 text-left transition",
              event.id === activeEvent.id
                ? "border-cafe-espresso bg-cafe-espresso text-cafe-paper"
                : "border-cafe-line bg-cafe-paper text-cafe-ink hover:border-cafe-espresso/40",
            )}
          >
            <span className="text-xs font-black uppercase tracking-[0.14em] opacity-70">{event.displayDate}</span>
            <strong className="mt-1 block font-serif text-xl leading-tight">{event.folderName}</strong>
            <span className="mt-1 block text-sm font-semibold leading-5 opacity-80">{event.title}</span>
            <span className="mt-1 flex items-center gap-1 text-xs font-bold opacity-70">
              <Camera size={13} />
              {event.images.length} foto{event.images.length === 1 ? "" : "s"}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeEvent.images.map((src, index) => (
          <Motion.article
            key={src}
            whileHover={{ y: -4, rotate: 0 }}
            className="rounded-[1.2rem] border border-cafe-line bg-cafe-paper p-3 shadow-cafe"
            style={{ rotate: `${[-1.4, 1.2, -0.6, 1.6, -1, 0.8][index]}deg` }}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-xl bg-cafe-cream">
              <img src={src} alt={`${activeEvent.title} ${index + 1}`} className="h-full w-full object-cover" />
            </div>
            <div className="px-2 pb-2 pt-4">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-cafe-honey">{activeEvent.label}</span>
              <h3 className="font-serif text-2xl font-bold">{activeEvent.title}</h3>
            </div>
          </Motion.article>
        ))}
      </div>
    </Page>
  );
}

function InfoMetric({ value, label }) {
  return (
    <div className="rounded-2xl border border-cafe-line bg-cafe-cream p-3 text-center">
      <strong className="block font-serif text-3xl leading-none">{value}</strong>
      <span className="mt-1 block text-xs font-black uppercase tracking-[0.14em] text-cafe-muted">{label}</span>
    </div>
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
        <button
          onClick={closeWhenSigned}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-cafe-cream text-cafe-espresso transition active:scale-95"
          aria-label="Fechar recibo"
        >
          <X size={18} />
        </button>
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
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="w-full rounded-2xl border border-cafe-line bg-cafe-paper px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-cafe-muted transition active:scale-[0.99]"
          >
            Cancelar
          </button>
          <button
            onClick={closeWhenSigned}
            className={cn(
              "w-full rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-[0.16em] transition",
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
    <div className="mb-6 max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 font-serif text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
      {description && <p className="mt-3 text-base leading-7 text-cafe-muted">{description}</p>}
    </div>
  );
}

export default App;
