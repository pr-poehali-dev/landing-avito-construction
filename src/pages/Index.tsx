import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

/* ─── assets ─────────────────────────────────────────────────────── */
const BASE = "https://cdn.poehali.dev/projects/90b70dcc-86cf-44ec-8c48-a0a856c1375f/files/";
const IMG = {
  oleg:     BASE + "63d3c63e-eb14-43e2-919b-2d3dd9bf2c76.jpg",
  house:    BASE + "b2af958e-7247-4f83-bf74-5a460cdc77d8.jpg",
  ceiling:  BASE + "b92e4bb6-356b-4bb7-bfbc-30b278f209c6.jpg",
  plaster:  BASE + "8fc3570b-b7c2-459a-ae41-5ff91808c002.jpg",
  repair:   BASE + "8425d8a3-43a0-4aa1-b332-7f438123853d.jpg",
};

/* ─── design tokens ──────────────────────────────────────────────── */
const C = {
  bg:      "#F7F4EF",
  white:   "#FFFFFF",
  ink:     "#12100E",
  ink2:    "#4A4540",
  muted:   "#8C8480",
  accent:  "#E8500A",
  accentL: "#FF7A38",
  gold:    "#C9A84C",
  surface: "#FDFCFB",
  border:  "#E8E4DE",
  dark:    "#0F1C2E",
};

const font = "'Montserrat', sans-serif";

/* ─── helpers ────────────────────────────────────────────────────── */
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

/* ─── shared UI ──────────────────────────────────────────────────── */
function Pill({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "8px 16px", borderRadius: 99,
      border: `1.5px solid ${accent ? C.accent : C.border}`,
      background: accent ? `${C.accent}14` : C.white,
      fontSize: 13, fontWeight: 500, color: accent ? C.accent : C.ink2,
      fontFamily: font,
    }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, full = false, variant = "orange", sm = false, disabled = false }: {
  children: React.ReactNode; onClick?: () => void; full?: boolean;
  variant?: "orange" | "ghost"; sm?: boolean; disabled?: boolean;
}) {
  const isOrange = variant === "orange";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? "100%" : undefined,
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: sm ? "10px 20px" : "14px 28px",
      borderRadius: 10, border: isOrange ? "none" : `1.5px solid ${C.border}`,
      background: disabled ? "#D0CCC8" : isOrange ? `linear-gradient(135deg, ${C.accent}, ${C.accentL})` : C.white,
      color: isOrange ? "#fff" : C.ink2,
      fontSize: sm ? 13 : 15, fontWeight: 700, fontFamily: font,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: isOrange && !disabled ? `0 4px 18px ${C.accent}44` : "none",
      transition: "all .18s", letterSpacing: 0.2,
    }}
      onMouseEnter={e => { if (!disabled) { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = isOrange ? `0 8px 28px ${C.accent}55` : "0 4px 16px #00000014"; } }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = isOrange && !disabled ? `0 4px 18px ${C.accent}44` : "none"; }}
    >
      {children}
    </button>
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
            width: "100%", paddingLeft: 42, paddingRight: 14, paddingTop: 13, paddingBottom: 13,
            borderRadius: 10, border: `1.5px solid ${error ? "#ef4444" : C.border}`,
            background: C.bg, fontSize: 14, fontFamily: font,
            color: C.ink, outline: "none", boxSizing: "border-box", transition: "border-color .2s",
          }}
          onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.background = C.white; }}
          onBlur={e => { if (!error) e.target.style.borderColor = C.border; e.target.style.background = C.bg; }}
        />
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4, fontFamily: font }}>{error}</p>}
    </div>
  );
}

function Agree({ checked, onChange }: { checked: boolean; onChange: (b: boolean) => void }) {
  return (
    <label style={{ display: "flex", gap: 10, cursor: "pointer", marginTop: 12, alignItems: "flex-start" }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        style={{ marginTop: 2, accentColor: C.accent, width: 15, height: 15, flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, fontFamily: font }}>
        Я принимаю Положение и даю Согласие на&nbsp;
        <a href="#" style={{ color: C.accent }}>обработку персональных данных</a>
      </span>
    </label>
  );
}

function SuccessBox({ msg = "Перезвоним в течение 15 минут" }: { msg?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.accentL})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
        <Icon name="Check" size={26} style={{ color: "#fff" }} />
      </div>
      <p style={{ fontWeight: 800, fontSize: 18, color: C.ink, marginBottom: 6, fontFamily: font }}>Принято!</p>
      <p style={{ fontSize: 14, color: C.muted, fontFamily: font }}>{msg}</p>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <span style={{ width: 24, height: 3, borderRadius: 99, background: C.accent, display: "inline-block" }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: font }}>{children}</span>
    </div>
  );
}

/* ─── QUIZ ───────────────────────────────────────────────────────── */
const QUIZ = [
  { q: "Какая у вас сфера бизнеса?", opts: ["Оказание услуг", "Продажа товаров", "Оптовая торговля", "Продажа оборудования", "Другое"] },
  { q: "Что вас не устраивает в рекламе?", opts: ["Мало заявок", "Дорогие заявки", "Нецелевые клиенты", "Не понимаю бюджет"] },
  { q: "У вас есть отдел продаж?", opts: ["Да", "Нет", "В процессе создания"] },
  { q: "Какой рекламный бюджет в месяц?", opts: ["До 30 000 ₽", "30 000 – 60 000 ₽", "60 000 – 120 000 ₽", "Свыше 120 000 ₽"] },
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
  const pct = Math.round((step / total) * 100) || 0;

  function go(dir: 1 | -1) {
    if (dir === 1 && !isLast && !sel) return;
    setAnim(true);
    setTimeout(() => { setStep(s => s + dir); setSel(null); setAnim(false); }, 200);
  }

  function submit() {
    if (!validPhone(phone)) { setPhoneErr("Введите корректный номер"); return; }
    if (!agree) { setPhoneErr("Дайте согласие"); return; }
    setDone(true);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 32, alignItems: "start" }}>

      {/* sticky expert block */}
      <div style={{ position: "sticky", top: 88 }}>
        <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 16, aspectRatio: "4/5" }}>
          <img src={IMG.oleg} alt="Олег Кошкаров" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
        </div>
        <div style={{ background: C.white, borderRadius: 16, padding: "16px 18px", border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: C.gold, fontSize: 13 }}>★</span>)}
            <span style={{ fontSize: 12, color: C.muted, fontFamily: font, marginLeft: 4 }}>100+ клиентов</span>
          </div>
          <p style={{ fontSize: 13, fontStyle: "italic", color: C.ink2, lineHeight: 1.7, fontFamily: font }}>
            «Моя главная цель — сделать так, чтобы мои клиенты зарабатывали больше денег»
          </p>
          <p style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: C.ink, fontFamily: font }}>— Олег Кошкаров</p>
        </div>
      </div>

      {/* quiz card */}
      <div>
        {/* progress */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.ink2, fontFamily: font }}>Шаг {step + 1} из {total}</span>
            <span style={{ fontSize: 13, color: C.muted, fontFamily: font }}>Расчёт пройден на {pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: C.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.round(((step + (isLast && done ? 1 : 0)) / total) * 100)}%`, borderRadius: 99, background: `linear-gradient(90deg, ${C.accent}, ${C.accentL})`, transition: "width .5s ease" }} />
          </div>
        </div>

        <div style={{
          background: C.white, borderRadius: 20, padding: 32,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          opacity: anim ? 0 : 1, transform: anim ? "translateY(8px)" : "none", transition: "opacity .2s, transform .2s",
        }}>
          {done ? <SuccessBox msg="Расчёт и прайс-лист пришлём в течение 15 минут" /> : (
            <>
              {!isLast ? (
                <>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontFamily: font }}>Вопрос {step + 1}</p>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginBottom: 20, lineHeight: 1.35, fontFamily: font }}>{QUIZ[step].q}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
                    {QUIZ[step].opts.map(opt => (
                      <button key={opt} onClick={() => setSel(opt)} style={{
                        padding: "10px 18px", borderRadius: 99, fontSize: 14, fontFamily: font, fontWeight: 500,
                        border: `1.5px solid ${sel === opt ? C.accent : C.border}`,
                        background: sel === opt ? `${C.accent}12` : C.bg,
                        color: sel === opt ? C.accent : C.ink2,
                        cursor: "pointer", transition: "all .15s",
                      }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontFamily: font }}>Последний шаг</p>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginBottom: 6, lineHeight: 1.35, fontFamily: font }}>Куда отправить расчёт?</h3>
                  <p style={{ fontSize: 14, color: C.muted, marginBottom: 20, fontFamily: font }}>Пришлём персональный расчёт в течение 15 минут</p>
                  <div style={{ marginBottom: 4 }}>
                    <PhoneInput value={phone} onChange={v => { setPhone(v); setPhoneErr(""); }} error={phoneErr} />
                  </div>
                  <Agree checked={agree} onChange={setAgree} />
                </>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                {step > 0
                  ? <Btn variant="ghost" sm onClick={() => go(-1)}>← Назад</Btn>
                  : <span />
                }
                {!isLast
                  ? <Btn sm disabled={!sel} onClick={() => go(1)}>Далее →</Btn>
                  : <Btn sm onClick={submit}>Получить расчёт</Btn>
                }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── CASES SLIDER ───────────────────────────────────────────────── */
const CASES = [
  { img: IMG.house,   title: "Строительство домов в Москве",        emoji: "🏗️",  stat: "1184 заявки на строительство каркасных домов в Москве и МО",  day: "1–4 заявки/день", price: "346 ₽/заявка", check: "70 тыс. мин. чек" },
  { img: IMG.ceiling, title: "Натяжные потолки в Москве",           emoji: "✨",  stat: "240 лидов на установку натяжных потолков в Москве",             day: "2–5 заявок/день", price: "675 ₽/заявка", check: "20 тыс. мин. чек" },
  { img: IMG.plaster, title: "Механизированная штукатурка в Москве", emoji: "🏛️", stat: "240 лидов на механизированную штукатурку в Москве",            day: "3–6 заявок/день", price: "855 ₽/заявка", check: "40 тыс. мин. чек" },
  { img: IMG.repair,  title: "Ремонт квартир в Красногорске",        emoji: "🔨",  stat: "140 лидов на ремонт квартир в Красногорске",                   day: "1–2 заявки/день", price: "986 ₽/заявка", check: "87 тыс. мин. чек" },
];
const DONE_ITEMS = ["Разработали стратегию и создали продающее объявление", "Исследование целевой аудитории и конкурентов", "Подготовка УТП, продающих текстов и визуала", "A/B тестирование заголовков и фотографий"];

function CaseSlide({ c }: { c: typeof CASES[0] }) {
  const [phone, setPhone] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "40% 60%", gap: 0, height: 520 }}>
      <div style={{ borderRadius: "20px 0 0 20px", overflow: "hidden" }}>
        <img src={c.img} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ background: C.white, borderRadius: "0 20px 20px 0", padding: "32px 36px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
        <Label>Кейс</Label>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginBottom: 14, lineHeight: 1.3, fontFamily: font }}>«{c.title}»</h3>
        <div style={{ background: `${C.accent}0C`, borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.accent, fontFamily: font }}>{c.emoji} {c.stat}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[c.day, c.price, c.check].map(s => (
            <div key={s} style={{ background: C.bg, borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.ink, fontFamily: font, lineHeight: 1.3 }}>{s}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 10, fontFamily: font }}>Что было сделано?</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
          {DONE_ITEMS.map(item => (
            <li key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: C.accent, fontWeight: 800, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: 13, color: C.ink2, lineHeight: 1.4, fontFamily: font }}>{item}</span>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "auto" }}>
          {done ? <SuccessBox /> : (
            <>
              <PhoneInput value={phone} onChange={v => { setPhone(v); setPhoneErr(""); }} error={phoneErr} placeholder="Введите номер телефона" />
              <Agree checked={agree} onChange={setAgree} />
              <div style={{ marginTop: 12 }}>
                <Btn full onClick={() => { if (!validPhone(phone)) { setPhoneErr("Введите корректный номер"); return; } if (!agree) { setPhoneErr("Дайте согласие"); return; } setDone(true); }}>
                  Хочу также масштабироваться
                </Btn>
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
  const [dir, setDir] = useState(0);
  const [visible, setVisible] = useState(true);

  function go(next: number) {
    if (next === idx) return;
    setDir(next > idx ? 1 : -1);
    setVisible(false);
    setTimeout(() => { setIdx(next); setVisible(true); }, 220);
  }

  return (
    <div>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : `translateX(${dir * 30}px)`, transition: "opacity .22s, transform .22s" }}>
          <CaseSlide c={CASES[idx]} />
        </div>

        {/* arrows */}
        {idx > 0 && (
          <button onClick={() => go(idx - 1)} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: C.white, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", zIndex: 10 }}>
            <Icon name="ChevronLeft" size={20} style={{ color: C.ink }} />
          </button>
        )}
        {idx < CASES.length - 1 && (
          <button onClick={() => go(idx + 1)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: C.white, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", zIndex: 10 }}>
            <Icon name="ChevronRight" size={20} style={{ color: C.ink }} />
          </button>
        )}
      </div>

      {/* dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
        {CASES.map((_, i) => (
          <button key={i} onClick={() => go(i)} style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 99, border: "none", cursor: "pointer", background: i === idx ? C.accent : C.border, transition: "all .25s", padding: 0 }} />
        ))}
      </div>
    </div>
  );
}

/* ─── ADVANTAGES ─────────────────────────────────────────────────── */
const ADV = [
  { icon: "Users",       title: "Комплексный анализ ЦА",       desc: "Разрабатываем уникальное торговое предложение, которое выделяет вас среди конкурентов" },
  { icon: "FileText",    title: "Эффективное описание",         desc: "Яркие тизеры, грамотная сегментация аудитории для максимального охвата" },
  { icon: "SlidersHorizontal", title: "Точная сегментация",    desc: "Широкое размещение с управлением ставками и оптимизацией по позиции" },
  { icon: "BarChart2",   title: "A/B тестирование",             desc: "Поиск наиболее эффективных комбинаций заголовков, фото и офферов" },
  { icon: "Zap",         title: "Скорость и качество",          desc: "Достигаем поставленных целей в установленные сроки с измеримым результатом" },
  { icon: "BadgeCheck",  title: "Понятные цены",                desc: "Гибкие пакеты услуг без скрытых платежей и неприятных сюрпризов" },
];

/* ─── MAIN ───────────────────────────────────────────────────────── */
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

  const wrap: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "0 24px" };
  const sec = (bg = C.bg): React.CSSProperties => ({ background: bg, padding: "88px 0" });

  return (
    <div style={{ fontFamily: font, background: C.bg, color: C.ink, minHeight: "100vh" }}>

      {/* ══ HEADER ════════════════════════════════════════════════ */}
      <header style={{ background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.accent}, ${C.accentL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12, color: "#fff" }}>ОК</div>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>Олег Кошкаров</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {[
              { href: "https://t.me/olegkoshkarov", hover: "#0088cc", svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.41 13.993l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.738.566z"/></svg> },
              { href: "https://wa.me/79001234567", hover: "#25D366", svg: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
            ].map(({ href, hover, svg }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                style={{ width: 38, height: 38, borderRadius: 9, border: `1.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, textDecoration: "none", transition: "all .2s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = hover; el.style.borderColor = hover; el.style.background = `${hover}14`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = C.muted; el.style.borderColor = C.border; el.style.background = "transparent"; }}
              >{svg}</a>
            ))}
            <div style={{ width: 1, height: 22, background: C.border }} />
            <button onClick={() => scrollTo("price")}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: font, fontWeight: 600, fontSize: 14, color: C.accent, padding: 0, borderBottom: `1.5px solid ${C.accent}44`, paddingBottom: 1 }}>
              Прайс
            </button>
            <Btn sm onClick={() => scrollTo("consult")}>Бесплатный разбор</Btn>
          </div>
        </div>
      </header>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section style={{ background: C.white, padding: "72px 0 0", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...wrap }}>
          <div style={{ display: "grid", gridTemplateColumns: "50% 50%", gap: 0, minHeight: 620, alignItems: "stretch" }}>

            {/* LEFT */}
            <div style={{ paddingRight: 56, paddingBottom: 72, display: "flex", flexDirection: "column" }}>
              <Label>Авито-маркетинг · Строительный бизнес</Label>

              <h1 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900, color: C.ink, lineHeight: 1.08, marginBottom: 18, letterSpacing: -0.8 }}>
                ЗАПУСКАЕМ АВИТО<br />
                <span style={{ color: C.accent }}>«ПОД КЛЮЧ»</span><br />
                НА СТРОИТЕЛЬНЫЕ УСЛУГИ
              </h1>

              <p style={{ fontSize: 18, fontWeight: 700, color: C.accent, marginBottom: 20 }}>
                Первые целевые заявки уже через 3 дня от 150 ₽
              </p>

              <p style={{ fontSize: 14, color: C.ink2, marginBottom: 14, fontWeight: 500 }}>
                <span style={{ color: C.muted }}>Клиенты на: </span>
                натяжные потолки, каркасные дома, штукатурку и др.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                <Pill>🛡️ Гарантия получения качественных заявок</Pill>
                <Pill>🎯 Индивидуальный подход под ваш бизнес</Pill>
              </div>

              <p style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>Ваш надёжный партнёр для бизнеса на Авито</p>

              {/* FORM */}
              <div style={{ background: C.bg, borderRadius: 20, padding: 24, border: `1px solid ${C.border}`, marginTop: "auto" }}>
                {heroDone ? <SuccessBox /> : (
                  <>
                    <p style={{ fontWeight: 800, fontSize: 15, color: C.ink, marginBottom: 12 }}>
                      Платите за рекламу — <span style={{ color: C.accent }}>а заявок нет?</span>
                    </p>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.ink, marginBottom: 6 }}>
                      Запишитесь на бесплатный разбор
                    </h3>
                    <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
                      Покажу, где деньги сливаются и как окупить вложения минимум ×3
                    </p>
                    <div style={{ marginBottom: 12 }}>
                      <PhoneInput value={heroPhone} onChange={v => { setHeroPhone(v); setHeroErr(""); }} error={heroErr} />
                    </div>
                    <Btn full onClick={() => { if (!validPhone(heroPhone)) { setHeroErr("Введите корректный номер"); return; } setHeroDone(true); }}>
                      Получить разбор
                    </Btn>
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
              <div style={{ position: "absolute", bottom: 0, left: "5%", right: "5%", top: "15%", borderRadius: "50% 50% 0 0", background: `linear-gradient(180deg, ${C.accent}0A 0%, ${C.accent}1A 100%)`, zIndex: 0 }} />
              <img src={IMG.oleg} alt="Олег Кошкаров"
                style={{ position: "relative", zIndex: 1, width: "100%", borderRadius: "20px 20px 0 0", objectFit: "cover", objectPosition: "top center", aspectRatio: "3/4", display: "block" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, zIndex: 2, background: "rgba(255,255,255,0.94)", backdropFilter: "blur(10px)", borderRadius: 14, padding: "12px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <p style={{ fontWeight: 800, fontSize: 15, color: C.ink, marginBottom: 3 }}>Олег Кошкаров</p>
                <p style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>Основатель · 7 лет опыта в Авито-маркетинге</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ QUIZ ══════════════════════════════════════════════════ */}
      <section id="quiz" style={sec(C.bg)}>
        <div style={wrap}>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 52px" }}>
            <Label>Калькулятор заявок</Label>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: C.ink, lineHeight: 1.2, marginBottom: 14 }}>
              Давайте рассчитаем, сколько заявок можно получить для вашего бизнеса
            </h2>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.7 }}>
              Ответьте на несколько простых вопросов — мы проведём анализ вашей ниши и рассчитаем количество заявок в вашем городе
            </p>
          </div>
          <Quiz />
        </div>
      </section>

      {/* ══ CASES ═════════════════════════════════════════════════ */}
      <section id="cases" style={sec(C.white)}>
        <div style={wrap}>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 48px" }}>
            <Label>Кейсы</Label>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: C.ink, lineHeight: 1.2, marginBottom: 14 }}>
              С 2022 года запустили более <span style={{ color: C.accent }}>100 успешных продвижений</span> на Авито
            </h2>
            <p style={{ fontSize: 16, color: C.muted }}>Посмотрите на результаты некоторых наших клиентов</p>
          </div>
          <CasesSlider />
        </div>
      </section>

      {/* ══ ADVANTAGES ════════════════════════════════════════════ */}
      <section style={sec(C.bg)}>
        <div style={wrap}>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 48px" }}>
            <Label>Преимущества</Label>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: C.ink, lineHeight: 1.2, marginBottom: 14 }}>
              Партнёрство с нами обеспечивает вашему бизнесу <span style={{ color: C.accent }}>гарантированный трафик</span>
            </h2>
            <p style={{ fontSize: 16, color: C.muted }}>Работая с нами, вы будете наслаждаться рядом преимуществ, которые дают реальный результат</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {ADV.map(({ icon, title, desc }) => (
              <div key={title}
                style={{ background: C.white, borderRadius: 18, padding: 24, border: `1px solid ${C.border}`, transition: "all .2s", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 8px 32px ${C.accent}1A`; el.style.borderColor = `${C.accent}44`; el.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.borderColor = C.border; el.style.transform = ""; }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 12, background: `${C.accent}14`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon name={icon} size={21} style={{ color: C.accent }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICE ═════════════════════════════════════════════════ */}
      <section id="price" style={sec(C.white)}>
        <div style={wrap}>
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${C.accent}14`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon name="Download" size={24} style={{ color: C.accent }} />
            </div>
            <Label>Прайс-лист</Label>
            <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: C.ink, marginBottom: 10, lineHeight: 1.3 }}>
              Скачайте прайс и узнайте полную стоимость на все услуги
            </h2>
            <p style={{ fontSize: 15, color: C.muted, marginBottom: 28, lineHeight: 1.6 }}>
              Чтобы получить прайс, введите ваш телефон — отправлю в течение 15 минут
            </p>
            {priceDone ? <SuccessBox msg="Прайс-лист отправлен! Проверьте телефон через 15 минут." /> : (
              <div style={{ textAlign: "left" }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                  <div style={{ flex: 1 }}>
                    <PhoneInput value={pricePhone} onChange={v => { setPricePhone(v); setPriceErr(""); }} error={priceErr} />
                  </div>
                  <Btn onClick={() => { if (!validPhone(pricePhone)) { setPriceErr("Введите номер"); return; } if (!priceAgree) { setPriceErr("Дайте согласие"); return; } setPriceDone(true); }}>
                    Получить прайс
                  </Btn>
                </div>
                <Agree checked={priceAgree} onChange={setPriceAgree} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ CONSULT ═══════════════════════════════════════════════ */}
      <section id="consult" style={sec(C.bg)}>
        <div style={wrap}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <Label>Консультация</Label>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: C.ink, lineHeight: 1.2, marginBottom: 14 }}>
                Получите экспертную консультацию по всем вопросам
              </h2>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.accent, marginBottom: 28 }}>
                Первая консультация с обсуждением вашего проекта — БЕСПЛАТНО
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "Познакомимся и разберём вашу задачу, цели и текущую ситуацию",
                  "Анализируем ваши товары/услуги и целевую аудиторию",
                  "Оценим текущие объявления (если есть) и найдём точки роста",
                  "Обсудим инструменты и стратегии продвижения на Авито",
                  "Ответим на вопросы и подготовим персональный план действий",
                ].map((item, i) => (
                  <div key={item} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 900, fontSize: 12, color: C.accent, minWidth: 28, paddingTop: 2, fontFamily: font }}>/{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 14, color: C.ink2, lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.white, borderRadius: 24, padding: 36, boxShadow: "0 8px 40px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
              {cDone ? <SuccessBox /> : (
                <>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: C.ink, marginBottom: 8, lineHeight: 1.35 }}>
                    Узнайте, сколько денег на рекламе вы можете сэкономить с Авито
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
                    <Icon name="Clock" size={14} style={{ color: C.muted }} />
                    <span style={{ fontSize: 13, color: C.muted }}>Отвечаю в течение 15 минут</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 4 }}>
                    <input value={cName} onChange={e => setCName(e.target.value)} placeholder="Ваше имя"
                      style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.bg, fontSize: 14, fontFamily: font, outline: "none", color: C.ink, boxSizing: "border-box", transition: "border-color .2s" }}
                      onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.background = C.white; }}
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.bg; }}
                    />
                    <PhoneInput value={cPhone} onChange={v => { setCPhone(v); setCPhoneErr(""); }} error={cPhoneErr} />
                  </div>
                  <Agree checked={cAgree} onChange={setCAgree} />
                  <div style={{ marginTop: 20 }}>
                    <Btn full onClick={() => {
                      if (!cName.trim()) return;
                      if (!validPhone(cPhone)) { setCPhoneErr("Введите корректный номер"); return; }
                      if (!cAgree) { setCPhoneErr("Дайте согласие"); return; }
                      setCDone(true);
                    }}>Получить консультацию</Btn>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer style={{ background: C.dark, color: "#fff", padding: "60px 0 0" }}>
        <div style={wrap}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, paddingBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.accent}, ${C.accentL})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 11, color: "#fff" }}>ОК</div>
                <span style={{ fontWeight: 800, fontSize: 15 }}>Олег Кошкаров</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                Ваш надёжный партнёр для бизнеса в интернет-маркетинге
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Адрес</h4>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16 }}>📍</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>г. Сочи, ул. Пластунская 123а К3</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Написать напрямую</h4>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { href: "https://t.me/olegkoshkarov", hover: "#0088cc", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.41 13.993l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.738.566z"/></svg> },
                  { href: "https://wa.me/79001234567", hover: "#25D366", svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
                ].map(({ href, hover, svg }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", textDecoration: "none", transition: "all .2s" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${hover}28`; el.style.color = hover; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.07)"; el.style.color = "rgba(255,255,255,0.6)"; }}
                  >{svg}</a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, maxWidth: 560 }}>
              Сайт не является публичной офертой. Вся информация на сайте носит ознакомительный характер и не является договором оферты. Стоимость и условия уточняются индивидуально.
            </p>
            <a href="#" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>
              Политика обработки персональных данных
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
