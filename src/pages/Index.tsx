import { useState } from "react";
import Icon from "@/components/ui/icon";

const PHOTO = "https://cdn.poehali.dev/projects/90b70dcc-86cf-44ec-8c48-a0a856c1375f/files/5705d604-cab8-4db3-8fb6-4942e953ffd0.jpg";

/* ── phone helpers ─────────────────────────────────────── */
function fmt(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  let r = "+7";
  if (d.length > 1) r += " (" + d.slice(1, 4);
  if (d.length >= 4) r += ") " + d.slice(4, 7);
  if (d.length >= 7) r += "-" + d.slice(7, 9);
  if (d.length >= 9) r += "-" + d.slice(9, 11);
  return r;
}
const validPhone = (p: string) => p.replace(/\D/g, "").length === 11;

/* ── tiny reusable phone-field ─────────────────────────── */
function PhoneField({
  value, onChange, placeholder = "+7 (___) ___-__-__", error,
}: { value: string; onChange: (v: string) => void; placeholder?: string; error?: string }) {
  return (
    <div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#999" }}>
          <Icon name="Phone" size={16} />
        </span>
        <input
          type="tel" value={value}
          onChange={e => onChange(fmt(e.target.value))}
          placeholder={placeholder}
          style={{
            width: "100%", paddingLeft: 44, paddingRight: 16, paddingTop: 14, paddingBottom: 14,
            borderRadius: 12, border: `1.5px solid ${error ? "#ef4444" : "#E5E5E5"}`,
            background: "#F5F5F5", fontSize: 15, fontFamily: "Montserrat, sans-serif",
            outline: "none", color: "#1A1A1A", transition: "border-color .2s",
          }}
          onFocus={e => { if (!error) e.target.style.borderColor = "#FF6B00"; }}
          onBlur={e => { if (!error) e.target.style.borderColor = "#E5E5E5"; }}
        />
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

/* ── checkbox ──────────────────────────────────────────── */
function Agree({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 12 }}>
      <input
        type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ marginTop: 3, accentColor: "#FF6B00", width: 16, height: 16, flexShrink: 0 }}
      />
      <span style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="#" style={{ color: "#FF6B00" }}>политикой обработки персональных данных</a>
      </span>
    </label>
  );
}

/* ── orange button ─────────────────────────────────────── */
function OrangeBtn({ children, onClick, full = false, disabled = false }: {
  children: React.ReactNode; onClick?: () => void; full?: boolean; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        width: full ? "100%" : undefined,
        background: disabled ? "#ccc" : "linear-gradient(135deg, #FF6B00, #e55a00)",
        color: "#fff", border: "none", borderRadius: 12,
        padding: "14px 28px", fontSize: 15, fontWeight: 700,
        fontFamily: "Montserrat, sans-serif", cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 6px 20px rgba(255,107,0,0.35)",
        transition: "all .2s", letterSpacing: 0.3,
      }}
      onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 28px rgba(255,107,0,0.45)"; } }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = disabled ? "none" : "0 6px 20px rgba(255,107,0,0.35)"; }}
    >
      {children}
    </button>
  );
}

/* ── QUIZ ──────────────────────────────────────────────── */
const QUIZ_STEPS = [
  {
    q: "Какая у вас сфера бизнеса?",
    opts: ["Оказание услуг", "Продажа товаров", "Оптовая торговля", "Продажа оборудования", "Другое"],
  },
  {
    q: "Что вас не устраивает в рекламе?",
    opts: ["Мало заявок", "Дорогие заявки", "Нецелевые клиенты", "Не понимаю бюджет", "Свой вариант"],
  },
  {
    q: "Есть ли у вас отдел продаж?",
    opts: ["Да", "Нет", "В процессе создания"],
  },
  {
    q: "Какой рекламный бюджет в месяц?",
    opts: ["До 30 000 ₽", "30 000 – 60 000 ₽", "60 000 – 120 000 ₽", "Свыше 120 000 ₽"],
  },
];

function Quiz() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(false);
  const [exiting, setExiting] = useState(false);

  const isPhoneStep = step === QUIZ_STEPS.length;
  const pct = Math.round((step / (QUIZ_STEPS.length + 1)) * 100);

  function goNext() {
    if (!isPhoneStep && !selected) return;
    setExiting(true);
    setTimeout(() => {
      setStep(s => s + 1);
      setSelected(null);
      setExiting(false);
    }, 220);
  }

  function submit() {
    if (!validPhone(phone)) { setPhoneErr("Введите корректный номер"); return; }
    if (!agree) { setPhoneErr("Необходимо согласие"); return; }
    setDone(true);
  }

  if (done) return (
    <div style={{ textAlign: "center", padding: "48px 0" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B00, #e55a00)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Icon name="Check" size={32} style={{ color: "#fff" }} />
      </div>
      <h3 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A", marginBottom: 8 }}>Спасибо!</h3>
      <p style={{ color: "#666", fontSize: 16 }}>Расчёт и прайс-лист пришлём в течение <strong>15 минут</strong></p>
    </div>
  );

  return (
    <div>
      {/* progress */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#666" }}>Шаг {step + 1} из {QUIZ_STEPS.length + 1}</span>
          <span style={{ fontSize: 13, color: "#666" }}>Расчёт пройден на {pct}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 99, background: "#F0F0F0", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: "linear-gradient(90deg, #FF6B00, #ffaa00)", transition: "width .6s ease" }} />
        </div>
      </div>

      {/* card */}
      <div
        style={{
          background: "#fff", borderRadius: 24, padding: "32px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          opacity: exiting ? 0 : 1,
          transform: exiting ? "translateY(8px)" : "translateY(0)",
          transition: "opacity .22s, transform .22s",
        }}
      >
        {!isPhoneStep ? (
          <>
            <p style={{ fontSize: 13, color: "#FF6B00", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
              Вопрос {step + 1}
            </p>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", marginBottom: 24, lineHeight: 1.3 }}>
              {QUIZ_STEPS[step].q}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
              {QUIZ_STEPS[step].opts.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelected(opt)}
                  style={{
                    padding: "10px 20px", borderRadius: 60, fontSize: 14, fontWeight: 500,
                    fontFamily: "Montserrat, sans-serif", cursor: "pointer", transition: "all .18s",
                    background: selected === opt ? "rgba(255,107,0,0.08)" : "#fff",
                    border: `1.5px solid ${selected === opt ? "#FF6B00" : "#E5E5E5"}`,
                    color: selected === opt ? "#FF6B00" : "#1A1A1A",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <OrangeBtn onClick={goNext} disabled={!selected}>
                Далее →
              </OrangeBtn>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: "#FF6B00", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
              Последний шаг
            </p>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.3 }}>
              Куда отправить расчёт и прайс-лист?
            </h3>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>Пришлём персональный расчёт в течение 15 минут</p>
            <div style={{ marginBottom: 4 }}>
              <PhoneField value={phone} onChange={v => { setPhone(v); setPhoneErr(""); }} error={phoneErr} />
            </div>
            <Agree checked={agree} onChange={setAgree} />
            <div style={{ marginTop: 20 }}>
              <OrangeBtn onClick={submit} full>Получить расчёт бесплатно</OrangeBtn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── CASES data ────────────────────────────────────────── */
const CASES = [
  {
    title: "Строительство домов в Москве",
    leads: "1184 заявки",
    stats: "1–4 заявки/день · 346 ₽ за заявку · 70 тыс. мин. чек",
    items: ["Анализ целевой аудитории и конкурентов", "Создание продающего объявления с УТП", "Настройка таргетинга по ключевым словам", "A/B тестирование заголовков и фото"],
  },
  {
    title: "Натяжные потолки в Краснодаре",
    leads: "876 заявок",
    stats: "2–5 заявок/день · 290 ₽ за заявку · 35 тыс. мин. чек",
    items: ["Сегментация рекламы по районам города", "Разработка уникального оффера", "Профессиональные фото работ", "Оптимизация бюджета по ROI"],
  },
  {
    title: "Кровельные работы в СПб",
    leads: "643 заявки",
    stats: "1–3 заявки/день · 410 ₽ за заявку · 90 тыс. мин. чек",
    items: ["Проработка болей целевой аудитории", "Создание портфолио завершённых объектов", "Настройка связки Авито + CRM", "Ежемесячная аналитика и корректировка"],
  },
  {
    title: "Штукатурка и отделка в Ростове",
    leads: "521 заявка",
    stats: "1–2 заявки/день · 380 ₽ за заявку · 25 тыс. мин. чек",
    items: ["Выявление ключевых запросов клиентов", "Написание продающих текстов", "Составление медиаплана", "Управление репутацией и отзывами"],
  },
];

function CaseCard({ c }: { c: typeof CASES[0] }) {
  const [phone, setPhone] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(false);

  function submit() {
    if (!validPhone(phone)) { setPhoneErr("Введите корректный номер"); return; }
    if (!agree) { setPhoneErr("Необходимо согласие"); return; }
    setDone(true);
  }

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", gap: 0 }}>
      <p style={{ fontSize: 11, color: "#FF6B00", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Кейс</p>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginBottom: 16, lineHeight: 1.3 }}>«{c.title}»</h3>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: "#FF6B00" }}>🔥 {c.leads}</span>
      </div>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 18 }}>{c.stats}</p>

      <div style={{ height: 1, background: "#F0F0F0", marginBottom: 18 }} />

      <p style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>Что было сделано?</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {c.items.map(item => (
          <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ color: "#FF6B00", fontWeight: 800, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
            <span style={{ fontSize: 14, color: "#444", lineHeight: 1.4 }}>{item}</span>
          </li>
        ))}
      </ul>

      <div style={{ height: 1, background: "#F0F0F0", marginBottom: 18 }} />

      {done ? (
        <div style={{ textAlign: "center", padding: "12px 0", color: "#FF6B00", fontWeight: 700 }}>
          ✓ Перезвоним в течение 15 минут!
        </div>
      ) : (
        <>
          <PhoneField value={phone} onChange={v => { setPhone(v); setPhoneErr(""); }} error={phoneErr} placeholder="Введите номер телефона" />
          <Agree checked={agree} onChange={setAgree} />
          <div style={{ marginTop: 14 }}>
            <OrangeBtn onClick={submit} full>Хочу также масштабироваться</OrangeBtn>
          </div>
        </>
      )}
    </div>
  );
}

/* ── ADVANTAGES data ───────────────────────────────────── */
const ADVANTAGES = [
  { icon: "Target", title: "Комплексный анализ ЦА", desc: "Изучаем вашу аудиторию, конкурентов и нишу перед запуском рекламы" },
  { icon: "Lightbulb", title: "Сильное уникальное УТП", desc: "Разрабатываем предложение, от которого невозможно отказаться" },
  { icon: "FileText", title: "Продающее описание", desc: "Тексты, которые закрывают возражения и ведут к звонку" },
  { icon: "Layers", title: "Сегментация рекламы", desc: "Раздельные объявления под каждый сегмент вашей аудитории" },
  { icon: "BarChart2", title: "A/B тестирование", desc: "Тестируем заголовки, фото и офферы для роста конверсии" },
  { icon: "BadgeCheck", title: "Понятные цены", desc: "Прозрачный прайс без скрытых платежей и сюрпризов" },
];

/* ── MAIN ──────────────────────────────────────────────── */
export default function Index() {
  const [heroPhone, setHeroPhone] = useState("");
  const [heroErr, setHeroErr] = useState("");
  const [heroDone, setHeroDone] = useState(false);

  const [pricePhone, setPricePhone] = useState("");
  const [priceErr, setPriceErr] = useState("");
  const [priceAgree, setPriceAgree] = useState(false);
  const [priceDone, setPriceDone] = useState(false);

  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultPhoneErr, setConsultPhoneErr] = useState("");
  const [consultAgree, setConsultAgree] = useState(false);
  const [consultDone, setConsultDone] = useState(false);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const S = {
    page: { fontFamily: "Montserrat, sans-serif", background: "#fff", color: "#1A1A1A", minHeight: "100vh" },
    container: { maxWidth: 1200, margin: "0 auto", padding: "0 20px" } as React.CSSProperties,
    section: (bg = "#fff") => ({ background: bg, padding: "80px 0" }),
    sectionTitle: { fontSize: "clamp(24px, 3.5vw, 32px)", fontWeight: 800, color: "#1A1A1A", lineHeight: 1.2 },
    sectionSub: { fontSize: 17, color: "#666", marginTop: 12, lineHeight: 1.6 },
    orange: { color: "#FF6B00" },
  };

  return (
    <div style={S.page}>

      {/* ═══ HEADER ═══════════════════════════════════════════════ */}
      <header style={{ background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ ...S.container, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 68 }}>
          {/* logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #FF6B00, #e55a00)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: "#fff", flexShrink: 0 }}>ОК</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#1A1A1A", letterSpacing: -0.3 }}>Олег Кошкаров</span>
          </div>

          {/* nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Telegram */}
            <a href="https://t.me/olegkoshkarov" target="_blank" rel="noopener noreferrer"
              style={{ width: 40, height: 40, borderRadius: 10, border: "1.5px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", textDecoration: "none", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#0088cc"; (e.currentTarget as HTMLElement).style.color = "#0088cc"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E5E5E5"; (e.currentTarget as HTMLElement).style.color = "#555"; }}
              title="Telegram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.41 13.993l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.738.566z"/>
              </svg>
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/79001234567" target="_blank" rel="noopener noreferrer"
              style={{ width: 40, height: 40, borderRadius: 10, border: "1.5px solid #E5E5E5", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", textDecoration: "none", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#25D366"; (e.currentTarget as HTMLElement).style.color = "#25D366"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E5E5E5"; (e.currentTarget as HTMLElement).style.color = "#555"; }}
              title="WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>

            <div style={{ width: 1, height: 24, background: "#E5E5E5" }} />

            {/* Price */}
            <button onClick={() => scrollTo("price")}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 14, color: "#FF6B00", textDecoration: "underline", textDecorationColor: "rgba(255,107,0,0.4)", padding: 0 }}
            >
              Прайс
            </button>

            {/* CTA */}
            <button onClick={() => scrollTo("consult")}
              style={{ background: "linear-gradient(135deg, #FF6B00, #e55a00)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 22px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(255,107,0,0.3)", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}
            >
              Бесплатный разбор
            </button>
          </div>
        </div>
      </header>

      {/* ═══ HERO ══════════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(160deg, #fff 55%, #FFF8F3 100%)", padding: "64px 0 0" }}>
        <div style={{ ...S.container }}>
          <div style={{ display: "grid", gridTemplateColumns: "52% 48%", gap: 0, alignItems: "stretch", minHeight: 560 }}>

            {/* LEFT */}
            <div style={{ paddingRight: 48, paddingBottom: 64, display: "flex", flexDirection: "column", gap: 0 }}>
              {/* label */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 32, height: 3, borderRadius: 99, background: "#FF6B00" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#FF6B00", textTransform: "uppercase", letterSpacing: 1 }}>Авито-маркетинг · Строительный бизнес</span>
              </div>

              <h1 style={{ fontSize: "clamp(26px, 3.8vw, 42px)", fontWeight: 900, color: "#1A1A1A", lineHeight: 1.1, marginBottom: 18, letterSpacing: -0.5 }}>
                ЗАПУСКАЕМ АВИТО<br />
                <span style={{ color: "#FF6B00" }}>«ПОД КЛЮЧ»</span><br />
                НА СТРОИТЕЛЬНЫЕ УСЛУГИ
              </h1>

              <p style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 700, color: "#FF6B00", marginBottom: 20 }}>
                Первые целевые заявки уже через 3 дня от 150 ₽
              </p>

              {/* services */}
              <div style={{ marginBottom: 22 }}>
                <p style={{ fontSize: 13, color: "#888", marginBottom: 10, fontWeight: 500 }}>Клиенты на:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Натяжные потолки", "Каркасные дома", "Штукатурку", "Кровлю", "Фасады", "Ремонт под ключ"].map(s => (
                    <span key={s} style={{ fontSize: 13, padding: "6px 14px", borderRadius: 99, border: "1px solid #E5E5E5", color: "#444", background: "#fff" }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* badges */}
              <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
                {[
                  { em: "🛡️", text: "Гарантия получения качественных заявок" },
                  { em: "🎯", text: "Индивидуальный подход под ваш бизнес" },
                ].map(({ em, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 40, border: "1.5px solid #E5E5E5", background: "#fff", fontSize: 13, color: "#333", fontWeight: 500, flexShrink: 0 }}>
                    <span>{em}</span> {text}
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 13, color: "#999", marginBottom: 28 }}>Ваш надёжный партнёр для бизнеса на Авито</p>

              {/* FORM */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.09)", border: "1px solid #F0F0F0" }}>
                {heroDone ? (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <span style={{ fontSize: 40 }}>✅</span>
                    <p style={{ fontWeight: 700, color: "#1A1A1A", marginTop: 10, marginBottom: 4 }}>Принято!</p>
                    <p style={{ color: "#666", fontSize: 14 }}>Перезвоним в течение <strong>15 минут</strong></p>
                  </div>
                ) : (
                  <>
                    <p style={{ fontWeight: 800, fontSize: 16, color: "#1A1A1A", marginBottom: 14, lineHeight: 1.4 }}>
                      Платите за рекламу — <span style={{ color: "#FF6B00" }}>а заявок нет?</span>
                    </p>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", marginBottom: 6, lineHeight: 1.3 }}>Запишитесь на бесплатный разбор</h3>
                    <p style={{ fontSize: 14, color: "#888", marginBottom: 16, lineHeight: 1.5 }}>Покажу, где деньги сливаются и как окупить вложения минимум ×3</p>
                    <div style={{ marginBottom: 12 }}>
                      <PhoneField value={heroPhone} onChange={v => { setHeroPhone(v); setHeroErr(""); }} error={heroErr} />
                    </div>
                    <OrangeBtn onClick={() => { if (!validPhone(heroPhone)) { setHeroErr("Введите корректный номер"); return; } setHeroDone(true); }} full>
                      Получить разбор
                    </OrangeBtn>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                      <Icon name="Clock" size={14} style={{ color: "#aaa" }} />
                      <span style={{ fontSize: 12, color: "#aaa" }}>Отвечаю в течение 15 минут</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT — photo */}
            <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: 480 }}>
                {/* decorative blob */}
                <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: "80%", borderRadius: "50% 50% 0 0", background: "linear-gradient(180deg, rgba(255,107,0,0.08) 0%, rgba(255,107,0,0.15) 100%)", zIndex: 0 }} />
                <img
                  src={PHOTO}
                  alt="Олег Кошкаров"
                  style={{ position: "relative", zIndex: 1, width: "100%", borderRadius: "20px 20px 0 0", objectFit: "cover", objectPosition: "top", aspectRatio: "3/4", display: "block" }}
                />
                {/* name badge */}
                <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, zIndex: 2, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderRadius: 16, padding: "12px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "#1A1A1A", marginBottom: 2 }}>Олег Кошкаров</p>
                  <p style={{ fontSize: 13, color: "#FF6B00", fontWeight: 600 }}>7 лет опыта в Авито-маркетинге</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ QUIZ ══════════════════════════════════════════════════ */}
      <section id="quiz" style={S.section("#F8F9FA")}>
        <div style={S.container}>
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 48px" }}>
            <h2 style={{ ...S.sectionTitle, marginBottom: 12 }}>
              Давайте рассчитаем, сколько заявок можно получить для вашего бизнеса
            </h2>
            <p style={S.sectionSub}>
              Ответьте на несколько простых вопросов — мы проведём анализ вашей ниши и рассчитаем количество заявок в вашем городе
            </p>
          </div>

          {/* quote */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#fff", borderRadius: 16, padding: "20px 24px", maxWidth: 760, margin: "0 auto 40px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 4, borderRadius: 99, background: "#FF6B00", alignSelf: "stretch", flexShrink: 0 }} />
            <p style={{ fontSize: 15, fontStyle: "italic", color: "#444", lineHeight: 1.7 }}>
              «Моя главная цель — сделать так, чтобы мои клиенты зарабатывали больше денег»
              <br /><strong style={{ fontStyle: "normal", color: "#1A1A1A" }}>— Олег Кошкаров</strong>
            </p>
          </div>

          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <Quiz />
          </div>
        </div>
      </section>

      {/* ═══ CASES ═════════════════════════════════════════════════ */}
      <section id="cases" style={S.section("#fff")}>
        <div style={S.container}>
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 48px" }}>
            <h2 style={{ ...S.sectionTitle, marginBottom: 12 }}>
              С 2022 года запустили более <span style={S.orange}>100 успешных продвижений</span> на Авито
            </h2>
            <p style={S.sectionSub}>Посмотрите на результаты некоторых наших клиентов</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {CASES.map(c => <CaseCard key={c.title} c={c} />)}
          </div>
        </div>
      </section>

      {/* ═══ ADVANTAGES ════════════════════════════════════════════ */}
      <section style={S.section("#F8F9FA")}>
        <div style={S.container}>
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 48px" }}>
            <h2 style={{ ...S.sectionTitle, marginBottom: 12 }}>
              Партнёрство с нами обеспечивает вашему бизнесу <span style={S.orange}>гарантированный трафик</span>
            </h2>
            <p style={S.sectionSub}>Работая с нами, вы будете наслаждаться рядом преимуществ, которые дают реальный результат</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {ADVANTAGES.map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{ background: "#fff", borderRadius: 20, padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", transition: "all .2s", cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(255,107,0,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.05)"; (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,107,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={icon} size={22} style={{ color: "#FF6B00" }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICE ═════════════════════════════════════════════════ */}
      <section id="price" style={S.section("#fff")}>
        <div style={S.container}>
          <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,107,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon name="Download" size={26} style={{ color: "#FF6B00" }} />
            </div>
            <h2 style={{ ...S.sectionTitle, marginBottom: 10 }}>Скачайте прайс и узнайте полную стоимость на все услуги</h2>
            <p style={{ ...S.sectionSub, marginBottom: 28 }}>Чтобы получить прайс, введите ваш телефон — отправлю в течение 15 минут</p>

            {priceDone ? (
              <div style={{ padding: "20px", background: "rgba(255,107,0,0.06)", borderRadius: 16, color: "#FF6B00", fontWeight: 700, fontSize: 16 }}>
                ✓ Прайс-лист отправлен! Проверьте телефон через 15 минут.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 500, margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <PhoneField value={pricePhone} onChange={v => { setPricePhone(v); setPriceErr(""); }} error={priceErr} />
                  </div>
                  <OrangeBtn onClick={() => { if (!validPhone(pricePhone)) { setPriceErr("Введите номер"); return; } if (!priceAgree) { setPriceErr("Необходимо согласие"); return; } setPriceDone(true); }}>
                    Получить прайс
                  </OrangeBtn>
                </div>
                <Agree checked={priceAgree} onChange={setPriceAgree} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ CONSULT ═══════════════════════════════════════════════ */}
      <section id="consult" style={S.section("#F8F9FA")}>
        <div style={S.container}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

            {/* left */}
            <div>
              <h2 style={{ ...S.sectionTitle, marginBottom: 12 }}>
                Получите экспертную консультацию по всем вопросам
              </h2>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#FF6B00", marginBottom: 28 }}>
                Первая консультация с обсуждением вашего проекта — БЕСПЛАТНО
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  "Разберём вашу нишу и целевую аудиторию",
                  "Покажем стоимость заявки в вашем регионе",
                  "Определим оптимальный рекламный бюджет",
                  "Разработаем стратегию продвижения на Авито",
                  "Ответим на все вопросы по настройке аккаунта",
                ].map((item, i) => (
                  <div key={item} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 900, fontSize: 13, color: "#FF6B00", minWidth: 28, paddingTop: 2 }}>/{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 15, color: "#333", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* right — form */}
            <div style={{ background: "#fff", borderRadius: 24, padding: 36, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
              {consultDone ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <span style={{ fontSize: 48 }}>✅</span>
                  <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", marginTop: 16, marginBottom: 8 }}>Отлично!</h3>
                  <p style={{ color: "#666" }}>Свяжемся с вами в ближайшее время</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A1A", marginBottom: 6, lineHeight: 1.3 }}>
                    Узнайте, сколько денег на рекламе вы можете сэкономить с Авито
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
                    <Icon name="Clock" size={14} style={{ color: "#aaa" }} />
                    <span style={{ fontSize: 13, color: "#aaa" }}>Отвечаю в течение 15 минут</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 4 }}>
                    <input
                      value={consultName}
                      onChange={e => setConsultName(e.target.value)}
                      placeholder="Ваше имя"
                      style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid #E5E5E5", background: "#F5F5F5", fontSize: 15, fontFamily: "Montserrat, sans-serif", outline: "none", color: "#1A1A1A", boxSizing: "border-box" }}
                      onFocus={e => { e.target.style.borderColor = "#FF6B00"; }}
                      onBlur={e => { e.target.style.borderColor = "#E5E5E5"; }}
                    />
                    <PhoneField value={consultPhone} onChange={v => { setConsultPhone(v); setConsultPhoneErr(""); }} error={consultPhoneErr} />
                  </div>

                  <Agree checked={consultAgree} onChange={setConsultAgree} />

                  <div style={{ marginTop: 20 }}>
                    <OrangeBtn full onClick={() => {
                      if (!consultName.trim()) return;
                      if (!validPhone(consultPhone)) { setConsultPhoneErr("Введите корректный номер"); return; }
                      if (!consultAgree) { setConsultPhoneErr("Необходимо согласие"); return; }
                      setConsultDone(true);
                    }}>
                      Получить консультацию
                    </OrangeBtn>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ═══ FOOTER ════════════════════════════════════════════════ */}
      <footer style={{ background: "#0A1A3A", color: "#fff", padding: "56px 0 0" }}>
        <div style={S.container}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40, paddingBottom: 48 }}>

            {/* col 1 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #FF6B00, #e55a00)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, color: "#fff" }}>ОК</div>
                <span style={{ fontWeight: 800, fontSize: 16 }}>Олег Кошкаров</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                Ваш надёжный партнёр для бизнеса в интернет-маркетинге
              </p>
            </div>

            {/* col 2 */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)" }}>Контакты</h4>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <span>📍</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>г. Сочи, ул. Пластунская 123а К3</span>
              </div>
            </div>

            {/* col 3 */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)" }}>Написать напрямую</h4>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="https://t.me/olegkoshkarov" target="_blank" rel="noopener noreferrer"
                  style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", textDecoration: "none", transition: "all .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,136,204,0.3)"; (e.currentTarget as HTMLElement).style.color = "#29b6f6"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.41 13.993l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.738.566z"/>
                  </svg>
                </a>
                <a href="https://wa.me/79001234567" target="_blank" rel="noopener noreferrer"
                  style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", textDecoration: "none", transition: "all .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.2)"; (e.currentTarget as HTMLElement).style.color = "#4caf50"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* bottom */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
              © 2024 Олег Кошкаров Marketing. Все права защищены.
            </p>
            <div style={{ display: "flex", gap: 20 }}>
              <a href="#" style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Политика обработки персональных данных</a>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                Сайт не является публичной офертой
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
