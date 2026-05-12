import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

/* ─── assets ──────────────────────────────────────────────────────── */
const BASE = "https://cdn.poehali.dev/projects/90b70dcc-86cf-44ec-8c48-a0a856c1375f/files/";
const IMG = {
  oleg:    BASE + "fd068753-e01e-4f4e-9be8-6797f8994a41.jpg",
  house:   BASE + "b2af958e-7247-4f83-bf74-5a460cdc77d8.jpg",
  ceiling: BASE + "b92e4bb6-356b-4bb7-bfbc-30b278f209c6.jpg",
  plaster: BASE + "8fc3570b-b7c2-459a-ae41-5ff91808c002.jpg",
  repair:  BASE + "8425d8a3-43a0-4aa1-b332-7f438123853d.jpg",
};

/* ─── design tokens ───────────────────────────────────────────────── */
const C = {
  bg:     "#0D0D0D",
  card:   "#161616",
  card2:  "#1E1E1E",
  border: "rgba(255,255,255,0.08)",
  text:   "#F2F2F2",
  muted:  "#777",
  muted2: "#555",
  orange: "#FF5500",
  pink:   "#FF2D6B",
  violet: "#8B2CFA",
  cyan:   "#00D4FF",
  grad:   "linear-gradient(135deg, #FF5500, #FF2D6B)",
  gradV:  "linear-gradient(135deg, #8B2CFA, #FF2D6B)",
  gradC:  "linear-gradient(135deg, #00D4FF, #8B2CFA)",
  white:  "#FFFFFF",
};
const font = "'Montserrat', sans-serif";

/* ─── helpers ─────────────────────────────────────────────────────── */
function fmtPhone(v: string) {
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

/* ─── shared UI ───────────────────────────────────────────────────── */
function GradBtn({ children, onClick, full = false, sm = false, disabled = false, grad = C.grad }: {
  children: React.ReactNode; onClick?: () => void; full?: boolean; sm?: boolean; disabled?: boolean; grad?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? "100%" : undefined,
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: sm ? "10px 22px" : "14px 28px",
      borderRadius: 12, border: "none",
      background: disabled ? "#333" : grad,
      color: disabled ? "#666" : "#fff",
      fontSize: sm ? 13 : 15, fontWeight: 700, fontFamily: font,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : "0 4px 20px rgba(255,85,0,0.35)",
      transition: "all .18s", letterSpacing: 0.3,
    }}
      onMouseEnter={e => { if (!disabled) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 30px rgba(255,85,0,0.5)"; }}}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = disabled ? "none" : "0 4px 20px rgba(255,85,0,0.35)"; }}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: "10px 22px", borderRadius: 12,
      border: `1.5px solid ${C.border}`, background: "transparent",
      color: C.muted, fontSize: 13, fontWeight: 600, fontFamily: font, cursor: "pointer", transition: "all .18s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)"; (e.currentTarget as HTMLElement).style.color = C.text; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
    >{children}</button>
  );
}

function PhoneInput({ value, onChange, error, placeholder = "+7 (___) ___-__-__" }: {
  value: string; onChange: (v: string) => void; error?: string; placeholder?: string;
}) {
  return (
    <div>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.muted, pointerEvents: "none" }}>
          <Icon name="Phone" size={15} />
        </span>
        <input type="tel" value={value} placeholder={placeholder}
          onChange={e => onChange(fmtPhone(e.target.value))}
          style={{
            width: "100%", paddingLeft: 42, paddingRight: 14, paddingTop: 14, paddingBottom: 14,
            borderRadius: 12, border: `1.5px solid ${error ? "#ff4444" : C.border}`,
            background: "rgba(255,255,255,0.06)", fontSize: 14, fontFamily: font,
            color: C.text, outline: "none", boxSizing: "border-box", transition: "border-color .2s",
          }}
          onFocus={e => { e.target.style.borderColor = C.orange; }}
          onBlur={e => { if (!error) e.target.style.borderColor = C.border; }}
        />
      </div>
      {error && <p style={{ color: "#ff4444", fontSize: 12, marginTop: 5, fontFamily: font }}>{error}</p>}
    </div>
  );
}

function Agree({ checked, onChange }: { checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <label style={{ display: "flex", gap: 10, cursor: "pointer", marginTop: 12, alignItems: "flex-start" }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ marginTop: 2, accentColor: C.orange, width: 15, height: 15, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, fontFamily: font }}>
        Я принимаю Положение и даю Согласие на{" "}
        <a href="#" style={{ color: C.orange }}>обработку персональных данных</a>
      </span>
    </label>
  );
}

function DoneBox({ msg = "Перезвоним в течение 15 минут" }: { msg?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
        <Icon name="Check" size={26} style={{ color: "#fff" }} />
      </div>
      <p style={{ fontWeight: 800, fontSize: 18, color: C.text, marginBottom: 6, fontFamily: font }}>Принято!</p>
      <p style={{ fontSize: 14, color: C.muted, fontFamily: font }}>{msg}</p>
    </div>
  );
}

function Tag({ children, color = C.orange }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 700,
      color, border: `1px solid ${color}44`, background: `${color}14`,
      fontFamily: font, letterSpacing: 0.3, textTransform: "uppercase",
    }}>{children}</span>
  );
}

/* ─── QUIZ ────────────────────────────────────────────────────────── */
const QUIZ = [
  { q: "Какая у вас сфера бизнеса?",          opts: ["Оказание услуг", "Продажа товаров", "Оптовая торговля", "Продажа оборудования", "Другое"] },
  { q: "Что вас не устраивает в рекламе?",    opts: ["Мало заявок", "Дорогие заявки", "Нецелевые клиенты", "Не понимаю бюджет"] },
  { q: "У вас есть отдел продаж?",            opts: ["Да", "Нет", "В процессе создания"] },
  { q: "Какой рекламный бюджет в месяц?",     opts: ["До 30 000 ₽", "30 000 – 60 000 ₽", "60 000 – 120 000 ₽", "Свыше 120 000 ₽"] },
];

function Quiz() {
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(false);
  const [anim, setAnim] = useState(false);

  const total = QUIZ.length + 1;
  const isLast = step === QUIZ.length;
  const pct = Math.round((step / total) * 100);

  function go(dir: 1 | -1) {
    if (dir === 1 && !isLast && !sel) return;
    setAnim(true);
    setTimeout(() => { setStep(s => s + dir); setSel(null); setAnim(false); }, 180);
  }

  function submit() {
    if (!validPhone(phone)) { setPhoneErr("Введите корректный номер"); return; }
    if (!agree) { setPhoneErr("Дайте согласие"); return; }
    setDone(true);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 28, alignItems: "start" }}>

      {/* sticky expert */}
      <div style={{ position: "sticky", top: 80 }}>
        <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 14, aspectRatio: "3/4" }}>
          <img src={IMG.oleg} alt="Олег" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
        </div>
        <div style={{ background: C.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#FFB800", fontSize: 12 }}>★</span>)}
          </div>
          <p style={{ fontSize: 12, fontStyle: "italic", color: "#aaa", lineHeight: 1.65, fontFamily: font }}>
            «Моя главная цель — сделать так, чтобы мои клиенты зарабатывали больше»
          </p>
          <p style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: C.text, fontFamily: font }}>— Олег Кошкаров</p>
        </div>
      </div>

      {/* card */}
      <div>
        {/* progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontFamily: font }}>Шаг {step + 1}/{total}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.orange, fontFamily: font }}>Расчёт пройден на {pct}%</span>
          </div>
          <div style={{ height: 5, borderRadius: 99, background: "#222", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: C.grad, transition: "width .5s ease" }} />
          </div>
        </div>

        <div style={{
          background: C.card, borderRadius: 20, padding: 28,
          border: `1px solid ${C.border}`,
          opacity: anim ? 0 : 1, transform: anim ? "translateY(6px)" : "none", transition: "all .18s",
        }}>
          {done ? <DoneBox msg="Расчёт и прайс пришлём в течение 15 минут" /> : (
            <>
              {!isLast ? (
                <>
                  <Tag>Вопрос {step + 1}</Tag>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: "14px 0 20px", lineHeight: 1.3, fontFamily: font }}>
                    {QUIZ[step].q}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                    {QUIZ[step].opts.map(opt => (
                      <button key={opt} onClick={() => setSel(opt)} style={{
                        padding: "10px 18px", borderRadius: 99, fontSize: 13, fontFamily: font, fontWeight: 600,
                        border: `1.5px solid ${sel === opt ? C.orange : C.border}`,
                        background: sel === opt ? `${C.orange}18` : "rgba(255,255,255,0.04)",
                        color: sel === opt ? C.orange : "#aaa",
                        cursor: "pointer", transition: "all .15s",
                      }}>{opt}</button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Tag color={C.violet}>Последний шаг</Tag>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, margin: "14px 0 6px", fontFamily: font }}>
                    Куда отправить расчёт?
                  </h3>
                  <p style={{ fontSize: 13, color: C.muted, marginBottom: 18, fontFamily: font }}>
                    Пришлём персональный расчёт в течение 15 минут
                  </p>
                  <PhoneInput value={phone} onChange={v => { setPhone(v); setPhoneErr(""); }} error={phoneErr} />
                  <Agree checked={agree} onChange={setAgree} />
                </>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                {step > 0 ? <GhostBtn onClick={() => go(-1)}>← Назад</GhostBtn> : <span />}
                {!isLast
                  ? <GradBtn sm disabled={!sel} onClick={() => go(1)}>Далее →</GradBtn>
                  : <GradBtn sm onClick={submit}>Получить расчёт</GradBtn>
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── CASES SLIDER ────────────────────────────────────────────────── */
const CASES = [
  { img: IMG.house,   title: "Строительство домов в Москве",         leads: "1184",  leadLabel: "заявки",  day: "1–4/день", price: "346 ₽", check: "70 000 ₽", emoji: "🏗️" },
  { img: IMG.ceiling, title: "Натяжные потолки в Москве",            leads: "240",   leadLabel: "лидов",   day: "2–5/день", price: "675 ₽", check: "20 000 ₽", emoji: "✨" },
  { img: IMG.plaster, title: "Мех. штукатурка в Москве",             leads: "240",   leadLabel: "лидов",   day: "3–6/день", price: "855 ₽", check: "40 000 ₽", emoji: "🏛️" },
  { img: IMG.repair,  title: "Ремонт квартир в Красногорске",        leads: "140",   leadLabel: "лидов",   day: "1–2/день", price: "986 ₽", check: "87 000 ₽", emoji: "🔨" },
];

const DONE_ITEMS = ["Разработали стратегию и продающее объявление", "Исследование ЦА и анализ конкурентов", "Подготовка УТП, текстов и визуала", "A/B тестирование заголовков и фото"];

function CaseCard({ c }: { c: typeof CASES[0] }) {
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(false);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "42% 58%", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.border}`, height: 500 }}>
      {/* image */}
      <div style={{ position: "relative" }}>
        <img src={c.img} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
        <div style={{ position: "absolute", bottom: 20, left: 16, right: 16 }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>{c.emoji}</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", fontFamily: font, lineHeight: 1 }}>
            {c.leads}
            <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.8, marginLeft: 6 }}>{c.leadLabel}</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontFamily: font, marginTop: 2 }}>{c.day} · {c.price}/заявка</div>
        </div>
      </div>

      {/* content */}
      <div style={{ background: C.card, padding: "24px 26px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <Tag>Кейс</Tag>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: C.text, margin: "12px 0 12px", lineHeight: 1.3, fontFamily: font }}>«{c.title}»</h3>

        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[["⚡", c.day, "заявок"], ["💰", c.price, "цена лида"], ["💎", c.check, "мин. чек"]].map(([em, v, l]) => (
            <div key={l as string} style={{ background: C.card2, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{em as string}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.text, fontFamily: font }}>{v as string}</div>
              <div style={{ fontSize: 10, color: C.muted, fontFamily: font }}>{l as string}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, fontWeight: 700, color: "#aaa", marginBottom: 8, fontFamily: font, textTransform: "uppercase", letterSpacing: 0.8 }}>Что сделали</p>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          {DONE_ITEMS.map(item => (
            <li key={item} style={{ display: "flex", gap: 8, fontSize: 12, color: "#aaa", fontFamily: font }}>
              <span style={{ color: C.orange, fontWeight: 800, flexShrink: 0 }}>✓</span>{item}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "auto" }}>
          {done ? <DoneBox /> : (
            <>
              <PhoneInput value={phone} onChange={v => { setPhone(v); setErr(""); }} error={err} placeholder="Введите номер телефона" />
              <Agree checked={agree} onChange={setAgree} />
              <div style={{ marginTop: 12 }}>
                <GradBtn full sm onClick={() => {
                  if (!validPhone(phone)) { setErr("Введите корректный номер"); return; }
                  if (!agree) { setErr("Дайте согласие"); return; }
                  setDone(true);
                }}>Хочу также масштабироваться</GradBtn>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CasesSlider() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dir, setDir] = useState(0);

  function go(next: number) {
    if (next === idx) return;
    setDir(next > idx ? 1 : -1);
    setVisible(false);
    setTimeout(() => { setIdx(next); setVisible(true); }, 200);
  }

  return (
    <div>
      <div style={{ position: "relative" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : `translateX(${dir * 24}px)`, transition: "all .2s" }}>
          <CaseCard c={CASES[idx]} />
        </div>
        {idx > 0 && (
          <button onClick={() => go(idx - 1)} style={{ position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: C.card2, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <Icon name="ChevronLeft" size={18} style={{ color: C.text }} />
          </button>
        )}
        {idx < CASES.length - 1 && (
          <button onClick={() => go(idx + 1)} style={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: C.card2, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <Icon name="ChevronRight" size={18} style={{ color: C.text }} />
          </button>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
        {CASES.map((_, i) => (
          <button key={i} onClick={() => go(i)} style={{ width: i === idx ? 28 : 8, height: 8, borderRadius: 99, border: "none", cursor: "pointer", background: i === idx ? C.orange : C.border, transition: "all .25s", padding: 0 }} />
        ))}
      </div>
    </div>
  );
}

/* ─── PRICE CARDS SLIDER ──────────────────────────────────────────── */
const PRICES = [
  {
    name: "Старт",
    badge: "Для новичков",
    color: C.cyan,
    price: "от 15 000 ₽",
    period: "/ первый месяц",
    items: ["Аудит ниши и конкурентов", "Создание 1 объявления", "Настройка аккаунта Авито", "Базовая сегментация ЦА", "Поддержка 2 недели"],
    cta: "Начать",
  },
  {
    name: "Бизнес",
    badge: "Популярный выбор 🔥",
    color: C.orange,
    price: "от 35 000 ₽",
    period: "/ в месяц",
    items: ["Всё из тарифа Старт", "До 5 объявлений", "A/B тестирование", "Управление ставками", "Аналитика и отчёты", "Поддержка 24/7"],
    cta: "Выбрать",
  },
  {
    name: "Макс",
    badge: "Для масштабирования",
    color: C.violet,
    price: "от 65 000 ₽",
    period: "/ в месяц",
    items: ["Всё из тарифа Бизнес", "До 15 объявлений", "Авито Pro инструменты", "Персональный менеджер", "Еженедельные созвоны", "Гарантия результата"],
    cta: "Масштабироваться",
  },
];

function PriceSlider({ onPrice }: { onPrice: () => void }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dir, setDir] = useState(0);

  function go(next: number) {
    if (next === idx) return;
    setDir(next > idx ? 1 : -1);
    setVisible(false);
    setTimeout(() => { setIdx(next); setVisible(true); }, 180);
  }

  const p = PRICES[idx];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div style={{ position: "relative" }}>
        {idx > 0 && (
          <button onClick={() => go(idx - 1)} style={{ position: "absolute", left: -52, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: C.card2, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <Icon name="ChevronLeft" size={18} style={{ color: C.text }} />
          </button>
        )}

        <div style={{
          background: C.card, borderRadius: 24, overflow: "hidden",
          border: `1px solid ${p.color}44`,
          boxShadow: `0 0 40px ${p.color}22`,
          opacity: visible ? 1 : 0, transform: visible ? "none" : `translateX(${dir * 20}px)`, transition: "all .18s",
        }}>
          {/* top accent */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${p.color}, ${p.color}88)` }} />
          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: 1, fontFamily: font, marginBottom: 4 }}>{p.badge}</p>
                <h3 style={{ fontSize: 26, fontWeight: 900, color: C.text, fontFamily: font }}>{p.name}</h3>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: p.color, fontFamily: font }}>{p.price}</div>
                <div style={{ fontSize: 12, color: C.muted, fontFamily: font }}>{p.period}</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {p.items.map(item => (
                <div key={item} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${p.color}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="Check" size={11} style={{ color: p.color }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#ccc", fontFamily: font }}>{item}</span>
                </div>
              ))}
            </div>

            <GradBtn full grad={`linear-gradient(135deg, ${p.color}, ${p.color}CC)`} onClick={onPrice}>{p.cta} →</GradBtn>
          </div>
        </div>

        {idx < PRICES.length - 1 && (
          <button onClick={() => go(idx + 1)} style={{ position: "absolute", right: -52, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: C.card2, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
            <Icon name="ChevronRight" size={18} style={{ color: C.text }} />
          </button>
        )}
      </div>

      {/* dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
        {PRICES.map((pr, i) => (
          <button key={i} onClick={() => go(i)} style={{
            width: i === idx ? 28 : 8, height: 8, borderRadius: 99, border: "none",
            cursor: "pointer", background: i === idx ? PRICES[i].color : C.border, transition: "all .25s", padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─── ADVANTAGES ──────────────────────────────────────────────────── */
const ADV = [
  { icon: "Users",             title: "Комплексный анализ ЦА",    desc: "Разрабатываем уникальное УТП, которое выделяет вас среди конкурентов", color: C.cyan },
  { icon: "FileText",          title: "Эффективное описание",      desc: "Яркие тизеры и грамотная сегментация для максимального охвата",        color: C.pink },
  { icon: "SlidersHorizontal", title: "Точная сегментация",        desc: "Широкое размещение с управлением ставками и оптимизацией позиции",     color: C.violet },
  { icon: "BarChart2",         title: "A/B тестирование",          desc: "Поиск наиболее эффективных комбинаций заголовков и офферов",            color: C.orange },
  { icon: "Zap",               title: "Скорость и качество",       desc: "Достигаем поставленных целей в срок с измеримым результатом",           color: C.cyan },
  { icon: "BadgeCheck",        title: "Понятные цены",             desc: "Гибкие пакеты без скрытых платежей и неприятных сюрпризов",             color: C.pink },
];

/* ─── MAIN ────────────────────────────────────────────────────────── */
export default function Index() {
  const [heroPhone, setHeroPhone] = useState("");
  const [heroErr, setHeroErr] = useState("");
  const [heroDone, setHeroDone] = useState(false);

  const [pricePhone, setPricePhone] = useState("");
  const [priceErr, setPriceErr] = useState("");
  const [priceAgree, setPriceAgree] = useState(false);
  const [priceDone, setPriceDone] = useState(false);

  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cPhoneErr, setCPhoneErr] = useState("");
  const [cAgree, setCAgree] = useState(false);
  const [cDone, setCDone] = useState(false);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const wrap: React.CSSProperties = { maxWidth: 1180, margin: "0 auto", padding: "0 24px" };
  const sec = (bg = C.bg): React.CSSProperties => ({ background: bg, padding: "88px 0" });

  return (
    <div style={{ fontFamily: font, background: C.bg, color: C.text, minHeight: "100vh" }}>

      {/* ══ HEADER ════════════════════════════════════════════════ */}
      <header style={{ background: "rgba(13,13,13,0.9)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, color: "#fff" }}>ОК</div>
            <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>Олег Кошкаров</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {[
              { href: "https://t.me/olegkoshkarov",  hc: "#0088cc", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.41 13.993l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.738.566z"/></svg> },
              { href: "https://wa.me/79001234567",   hc: "#25D366", svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
            ].map(({ href, hc, svg }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, textDecoration: "none", transition: "all .2s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = hc; el.style.borderColor = hc; el.style.background = `${hc}18`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = C.muted; el.style.borderColor = C.border; el.style.background = "transparent"; }}
              >{svg}</a>
            ))}
            <div style={{ width: 1, height: 20, background: C.border }} />
            <button onClick={() => scrollTo("price")}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: font, fontWeight: 600, fontSize: 13, color: C.orange, padding: 0, borderBottom: `1px solid ${C.orange}44` }}>
              Прайс
            </button>
            <GradBtn sm onClick={() => scrollTo("consult")}>Бесплатный разбор</GradBtn>
          </div>
        </div>
      </header>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section style={{ background: C.bg, padding: "72px 0 0", borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
        {/* bg glow */}
        <div style={{ position: "absolute", top: -200, left: -200, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.orange}18 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.violet}14 0%, transparent 65%)`, pointerEvents: "none" }} />

        <div style={{ ...wrap, position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "50% 50%", minHeight: 620, alignItems: "stretch" }}>

            {/* LEFT */}
            <div style={{ paddingRight: 56, paddingBottom: 72, display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: 20 }}>
                <Tag>Авито-маркетинг · Строительный бизнес</Tag>
              </div>

              <h1 style={{ fontSize: "clamp(26px, 3.5vw, 44px)", fontWeight: 900, color: C.text, lineHeight: 1.06, marginBottom: 18, letterSpacing: -1 }}>
                ЗАПУСКАЕМ АВИТО<br />
                <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>«ПОД КЛЮЧ»</span><br />
                НА СТРОИТЕЛЬНЫЕ УСЛУГИ
              </h1>

              <p style={{ fontSize: 18, fontWeight: 700, color: C.orange, marginBottom: 20 }}>
                Первые целевые заявки уже через 3 дня от 150 ₽
              </p>

              <p style={{ fontSize: 14, color: C.muted, marginBottom: 16, lineHeight: 1.6 }}>
                <span style={{ color: "#666" }}>Клиенты на: </span>
                натяжные потолки, каркасные дома, штукатурку и др.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 99, border: `1px solid ${C.border}`, fontSize: 13, color: "#ccc", fontFamily: font }}>🛡️ Гарантия качественных заявок</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 99, border: `1px solid ${C.border}`, fontSize: 13, color: "#ccc", fontFamily: font }}>🎯 Индивидуальный подход</span>
              </div>

              <p style={{ fontSize: 12, color: C.muted2, marginBottom: 28 }}>Ваш надёжный партнёр для бизнеса на Авито</p>

              {/* FORM */}
              <div style={{ background: C.card, borderRadius: 20, padding: 24, border: `1px solid ${C.border}`, marginTop: "auto" }}>
                {heroDone ? <DoneBox /> : (
                  <>
                    <p style={{ fontWeight: 800, fontSize: 15, color: C.text, marginBottom: 12 }}>
                      Платите за рекламу —{" "}
                      <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>а заявок нет?</span>
                    </p>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 6 }}>Запишитесь на бесплатный разбор</h3>
                    <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
                      Покажу, где деньги сливаются и как окупить вложения минимум ×3
                    </p>
                    <div style={{ marginBottom: 12 }}>
                      <PhoneInput value={heroPhone} onChange={v => { setHeroPhone(v); setHeroErr(""); }} error={heroErr} />
                    </div>
                    <GradBtn full onClick={() => { if (!validPhone(heroPhone)) { setHeroErr("Введите корректный номер"); return; } setHeroDone(true); }}>
                      Получить разбор
                    </GradBtn>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10 }}>
                      <Icon name="Clock" size={13} style={{ color: C.muted }} />
                      <span style={{ fontSize: 12, color: C.muted }}>Отвечаю в течение 15 минут</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT — photo */}
            <div style={{ position: "relative", display: "flex", alignItems: "flex-end" }}>
              <div style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", top: "20%", borderRadius: "50% 50% 0 0", background: `linear-gradient(180deg, ${C.violet}18, ${C.orange}28)`, zIndex: 0 }} />
              <img src={IMG.oleg} alt="Олег Кошкаров"
                style={{ position: "relative", zIndex: 1, width: "100%", borderRadius: "20px 20px 0 0", objectFit: "cover", objectPosition: "top", aspectRatio: "3/4", display: "block" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, zIndex: 2, background: "rgba(22,22,22,0.88)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "12px 16px", border: `1px solid ${C.border}` }}>
                <p style={{ fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 2 }}>Олег Кошкаров</p>
                <p style={{ fontSize: 12, color: C.orange, fontWeight: 600 }}>Основатель · 7 лет в Авито-маркетинге</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ QUIZ ══════════════════════════════════════════════════ */}
      <section id="quiz" style={sec()}>
        <div style={wrap}>
          <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 48px" }}>
            <Tag color={C.violet}>Калькулятор заявок</Tag>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: C.text, lineHeight: 1.2, margin: "16px 0 14px" }}>
              Давайте рассчитаем, сколько заявок можно получить для вашего бизнеса
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7 }}>
              Ответьте на несколько простых вопросов — проведём анализ ниши и рассчитаем заявки в вашем городе
            </p>
          </div>
          <Quiz />
        </div>
      </section>

      {/* ══ CASES ═════════════════════════════════════════════════ */}
      <section id="cases" style={{ ...sec(C.card), borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={wrap}>
          <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 48px" }}>
            <Tag color={C.pink}>Кейсы</Tag>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: C.text, lineHeight: 1.2, margin: "16px 0 14px" }}>
              С 2022 года — более{" "}
              <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>100 успешных</span>{" "}
              продвижений
            </h2>
            <p style={{ fontSize: 15, color: C.muted }}>Посмотрите на результаты некоторых наших клиентов</p>
          </div>
          <CasesSlider />
        </div>
      </section>

      {/* ══ ADVANTAGES ════════════════════════════════════════════ */}
      <section style={sec()}>
        <div style={wrap}>
          <div style={{ textAlign: "center", maxWidth: 660, margin: "0 auto 48px" }}>
            <Tag color={C.cyan}>Преимущества</Tag>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: C.text, lineHeight: 1.2, margin: "16px 0 14px" }}>
              Партнёрство с нами — это{" "}
              <span style={{ background: C.gradC, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>гарантированный трафик</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {ADV.map(({ icon, title, desc, color }) => (
              <div key={title}
                style={{ background: C.card, borderRadius: 18, padding: 22, border: `1px solid ${C.border}`, transition: "all .2s", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${color}55`; el.style.boxShadow = `0 4px 24px ${color}18`; el.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = C.border; el.style.boxShadow = "none"; el.style.transform = ""; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon name={icon} size={20} style={{ color }} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{title}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICE ═════════════════════════════════════════════════ */}
      <section id="price" style={{ ...sec(C.card), borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={wrap}>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 48px" }}>
            <Tag color={C.violet}>Тарифы</Tag>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: C.text, lineHeight: 1.2, margin: "16px 0 14px" }}>
              Скачайте прайс и узнайте{" "}
              <span style={{ background: C.gradV, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>полную стоимость</span>
            </h2>
            <p style={{ fontSize: 15, color: C.muted }}>Выберите подходящий тариф — или оставьте номер и подберём вместе</p>
          </div>

          <PriceSlider onPrice={() => scrollTo("consult")} />

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 16 }}>Хотите получить прайс-лист на email или телефон?</p>
            {priceDone ? (
              <DoneBox msg="Прайс-лист отправлен в течение 15 минут" />
            ) : (
              <div style={{ display: "inline-flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 260 }}>
                  <PhoneInput value={pricePhone} onChange={v => { setPricePhone(v); setPriceErr(""); }} error={priceErr} />
                </div>
                <GradBtn onClick={() => { if (!validPhone(pricePhone)) { setPriceErr("Введите номер"); return; } if (!priceAgree) { setPriceErr("Дайте согласие"); return; } setPriceDone(true); }}>
                  Получить прайс
                </GradBtn>
              </div>
            )}
            {!priceDone && <Agree checked={priceAgree} onChange={setPriceAgree} />}
          </div>
        </div>
      </section>

      {/* ══ CONSULT ═══════════════════════════════════════════════ */}
      <section id="consult" style={sec()}>
        <div style={wrap}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <Tag>Консультация</Tag>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: C.text, lineHeight: 1.2, margin: "16px 0 14px" }}>
                Получите экспертную консультацию по всем вопросам
              </h2>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.orange, marginBottom: 28 }}>
                Первая консультация — БЕСПЛАТНО
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "Познакомимся и разберём вашу задачу и цели",
                  "Анализируем ваши услуги и целевую аудиторию",
                  "Оценим текущие объявления и найдём точки роста",
                  "Обсудим инструменты и стратегии продвижения",
                  "Ответим на вопросы и подготовим план действий",
                ].map((item, i) => (
                  <div key={item} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 900, fontSize: 11, color: C.orange, minWidth: 28, paddingTop: 3, fontFamily: font, letterSpacing: 0.5 }}>/{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 14, color: "#aaa", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, borderRadius: 24, padding: 34, border: `1px solid ${C.border}` }}>
              {cDone ? <DoneBox /> : (
                <>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 8, lineHeight: 1.35 }}>
                    Узнайте, сколько вы можете сэкономить на рекламе с Авито
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
                    <Icon name="Clock" size={13} style={{ color: C.muted }} />
                    <span style={{ fontSize: 13, color: C.muted }}>Отвечаю в течение 15 минут</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 4 }}>
                    <input value={cName} onChange={e => setCName(e.target.value)} placeholder="Ваше имя"
                      style={{ width: "100%", padding: "13px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: "rgba(255,255,255,0.06)", fontSize: 14, fontFamily: font, outline: "none", color: C.text, boxSizing: "border-box", transition: "border-color .2s" }}
                      onFocus={e => { e.target.style.borderColor = C.orange; }}
                      onBlur={e => { e.target.style.borderColor = C.border; }}
                    />
                    <PhoneInput value={cPhone} onChange={v => { setCPhone(v); setCPhoneErr(""); }} error={cPhoneErr} />
                  </div>
                  <Agree checked={cAgree} onChange={setCAgree} />
                  <div style={{ marginTop: 20 }}>
                    <GradBtn full onClick={() => {
                      if (!cName.trim()) return;
                      if (!validPhone(cPhone)) { setCPhoneErr("Введите корректный номер"); return; }
                      if (!cAgree) { setCPhoneErr("Дайте согласие"); return; }
                      setCDone(true);
                    }}>Получить консультацию</GradBtn>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer style={{ background: "#0A0A0A", borderTop: `1px solid ${C.border}`, padding: "56px 0 0" }}>
        <div style={wrap}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, paddingBottom: 44 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: C.grad, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 11, color: "#fff" }}>ОК</div>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Олег Кошкаров</span>
              </div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>Ваш надёжный партнёр для бизнеса в интернет-маркетинге</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: C.muted2, marginBottom: 14 }}>Адрес</h4>
              <div style={{ display: "flex", gap: 10 }}>
                <span>📍</span>
                <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>г. Сочи, ул. Пластунская 123а К3</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 1.2, color: C.muted2, marginBottom: 14 }}>Написать напрямую</h4>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { href: "https://t.me/olegkoshkarov", hc: "#0088cc", svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.41 13.993l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.738.566z"/></svg> },
                  { href: "https://wa.me/79001234567", hc: "#25D366", svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
                ].map(({ href, hc, svg }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, textDecoration: "none", transition: "all .2s" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${hc}22`; el.style.color = hc; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.06)"; el.style.color = C.muted; }}
                  >{svg}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <p style={{ fontSize: 11, color: C.muted2, lineHeight: 1.6, maxWidth: 560 }}>
              Сайт не является публичной офертой. Вся информация носит ознакомительный характер. Стоимость и условия уточняются индивидуально.
            </p>
            <a href="#" style={{ fontSize: 11, color: C.muted, textDecoration: "underline" }}>Политика обработки персональных данных</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
