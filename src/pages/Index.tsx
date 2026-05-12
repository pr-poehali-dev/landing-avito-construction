import { useState } from "react";
import Icon from "@/components/ui/icon";

const EXPERT_PHOTO = "https://cdn.poehali.dev/projects/90b70dcc-86cf-44ec-8c48-a0a856c1375f/files/54b0dce0-a5e4-4ec5-879f-aa61fc1faa43.jpg";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  let result = "+7";
  if (digits.length > 1) result += " (" + digits.slice(1, 4);
  if (digits.length >= 4) result += ") " + digits.slice(4, 7);
  if (digits.length >= 7) result += "-" + digits.slice(7, 9);
  if (digits.length >= 9) result += "-" + digits.slice(9, 11);
  return result;
}

function isValidPhone(phone: string) {
  return phone.replace(/\D/g, "").length === 11;
}

const CALC_STEPS = [
  {
    id: 1,
    question: "Какая у вас сфера бизнеса?",
    type: "choice",
    options: ["Натяжные потолки", "Каркасные дома", "Штукатурка / отделка", "Кровля / фасады", "Другое"],
  },
  {
    id: 2,
    question: "Что вас не устраивает в существующей рекламе?",
    type: "choice",
    options: ["Мало заявок", "Заявки дорогие", "Нецелевые клиенты", "Реклама вообще не настроена"],
  },
  {
    id: 3,
    question: "У вас есть отдел продаж?",
    type: "choice",
    options: ["Да, есть менеджеры", "Нет, продаю сам"],
  },
  {
    id: 4,
    question: "Какой у вас рекламный бюджет в месяц?",
    type: "choice",
    options: ["До 10 000 ₽", "10 000 – 30 000 ₽", "30 000 – 60 000 ₽", "Более 60 000 ₽"],
  },
  {
    id: 5,
    question: "Куда отправить расчёт количества заявок + прайс-лист?",
    type: "phone",
  },
];

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mt-6">
      <div className="flex justify-between mb-2 text-sm font-golos" style={{ color: "var(--c-muted)" }}>
        <span>Расчёт пройден на {pct}%</span>
        <span>{step} / {total}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, var(--c-gold), var(--c-orange))",
            transition: "width 0.7s ease-out",
          }}
        />
      </div>
    </div>
  );
}

function Calculator() {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [animating, setAnimating] = useState(false);
  const current = CALC_STEPS[step];

  function next() {
    if (step < CALC_STEPS.length - 1) {
      setAnimating(true);
      setTimeout(() => { setStep((s) => s + 1); setAnimating(false); }, 250);
    }
  }

  function submitCalc() {
    if (!isValidPhone(phone)) { setPhoneError("Введите корректный номер телефона"); return; }
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))" }}>
          <Icon name="Check" size={36} className="text-white" />
        </div>
        <h3 className="font-oswald text-3xl font-bold text-white mb-3">Спасибо!</h3>
        <p className="font-golos text-lg" style={{ color: "var(--c-muted)" }}>
          Расчёт количества заявок и прайс-лист<br />
          <span className="text-white font-semibold">будут отправлены вам в течение 15 минут</span>
        </p>
      </div>
    );
  }

  return (
    <div style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "none", transition: "all 0.25s ease" }}>
      <div className="mb-2" style={{ color: "var(--c-gold)" }}>
        <span className="font-oswald text-sm tracking-widest uppercase">Вопрос {step + 1}</span>
      </div>
      <h3 className="font-oswald text-2xl md:text-3xl font-semibold text-white mb-8 leading-tight">{current.question}</h3>

      {current.type === "choice" && (
        <div className="flex flex-col gap-3">
          {current.options!.map((opt) => (
            <button
              key={opt}
              onClick={next}
              className="text-left px-6 py-4 rounded-lg font-golos font-medium text-base border"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "var(--c-gold)"; el.style.background = "rgba(212,175,55,0.1)"; el.style.color = "#fff"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.background = "rgba(255,255,255,0.04)"; el.style.color = "rgba(255,255,255,0.85)"; }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {current.type === "phone" && (
        <div className="flex flex-col gap-4">
          <input
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(formatPhone(e.target.value)); setPhoneError(""); }}
            placeholder="+7 (___) ___-__-__"
            className="w-full px-6 py-4 rounded-lg font-golos text-lg text-white outline-none border"
            style={{ background: "rgba(255,255,255,0.06)", borderColor: phoneError ? "#ef4444" : "rgba(255,255,255,0.15)", transition: "border-color 0.2s" }}
          />
          {phoneError && <p className="font-golos text-sm text-red-400">{phoneError}</p>}
          <button
            onClick={submitCalc}
            className="w-full py-4 rounded-lg font-oswald text-lg font-semibold tracking-wide"
            style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))", color: "#0a1628" }}
          >
            ПОЛУЧИТЬ РАСЧЁТ БЕСПЛАТНО
          </button>
        </div>
      )}

      <ProgressBar step={step + (current.type === "phone" ? 1 : 0)} total={CALC_STEPS.length} />
    </div>
  );
}

function PhoneForm({ buttonText, onSuccess }: { buttonText: string; onSuccess: () => void }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  function submit() {
    if (!isValidPhone(phone)) { setError("Введите корректный номер телефона"); return; }
    onSuccess();
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="tel"
          value={phone}
          onChange={(e) => { setPhone(formatPhone(e.target.value)); setError(""); }}
          placeholder="+7 (___) ___-__-__"
          className="flex-1 px-5 py-4 rounded-lg font-golos text-base text-white outline-none border"
          style={{ background: "rgba(255,255,255,0.06)", borderColor: error ? "#ef4444" : "rgba(255,255,255,0.2)", transition: "border-color 0.2s" }}
        />
        <button
          onClick={submit}
          className="px-8 py-4 rounded-lg font-oswald font-semibold tracking-wide whitespace-nowrap"
          style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))", color: "#0a1628" }}
        >
          {buttonText}
        </button>
      </div>
      {error && <p className="font-golos text-sm text-red-400">{error}</p>}
    </div>
  );
}

function GoldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block font-oswald text-xs tracking-widest uppercase px-3 py-1 rounded mb-4" style={{ background: "rgba(212,175,55,0.15)", color: "var(--c-gold)", border: "1px solid rgba(212,175,55,0.3)" }}>
      {children}
    </span>
  );
}

function Section({ children, id, className = "", style }: { children: React.ReactNode; id?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`} style={style}>
      <div className="max-w-6xl mx-auto px-5 md:px-10">{children}</div>
    </section>
  );
}

function HeroSection() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [heroDone, setHeroDone] = useState(false);

  function submitHero() {
    if (!isValidPhone(phone)) { setPhoneError("Введите корректный номер"); return; }
    setHeroDone(true);
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0d1e3e 55%, #111a35 100%)",
        paddingTop: "clamp(3rem, 7vw, 5.5rem)",
        paddingBottom: "clamp(3rem, 7vw, 5.5rem)",
      }}
    >
      {/* background decor */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: "-15%", right: "-5%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,123,29,0.06) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", top: 0, left: "55%", width: 1, height: "100%", background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.08), transparent)" }} />
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-10 relative">
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 xl:gap-16 items-center">

          {/* ── LEFT ── */}
          <div>
            <GoldLabel>Авито-маркетинг для строительного бизнеса</GoldLabel>

            <h1
              className="font-oswald font-bold text-white mb-4 leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}
            >
              ЗАПУСКАЕМ АВИТО<br />
              <span style={{ color: "var(--c-orange)" }}>«ПОД КЛЮЧ»</span><br />
              НА СТРОИТЕЛЬНЫЕ УСЛУГИ
            </h1>

            <p className="font-golos font-semibold text-lg md:text-xl mb-8" style={{ color: "var(--c-orange)" }}>
              Первые целевые заявки уже через 3 дня от 150 ₽
            </p>

            {/* services */}
            <div className="mb-8">
              <p className="font-golos text-sm mb-3 uppercase tracking-widest" style={{ color: "var(--c-muted)" }}>Клиенты на:</p>
              <div className="flex flex-wrap gap-2">
                {["Натяжные потолки", "Каркасные дома", "Штукатурку и отделку", "Кровлю", "Фасады", "Ремонт под ключ"].map((s) => (
                  <span
                    key={s}
                    className="font-golos text-sm px-3 py-1.5 rounded-full"
                    style={{ border: "1px solid rgba(255,255,255,0.13)", color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.04)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* badges */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-xl flex-1"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <span className="text-xl">🛡️</span>
                <span className="font-golos text-sm text-white leading-snug">Гарантия получения<br /><span style={{ color: "var(--c-gold)" }}>качественных заявок</span></span>
              </div>
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-xl flex-1"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <span className="text-xl">🎯</span>
                <span className="font-golos text-sm text-white leading-snug">Индивидуальный подход<br /><span style={{ color: "var(--c-gold)" }}>под ваш бизнес</span></span>
              </div>
            </div>

            <p className="font-golos text-sm" style={{ color: "var(--c-muted)" }}>
              Ваш надёжный партнёр для бизнеса на Авито
            </p>
          </div>

          {/* ── RIGHT: FORM ── */}
          <div
            className="rounded-2xl p-7 md:p-8"
            style={{
              background: "rgba(15,28,56,0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(212,175,55,0.22)",
              boxShadow: "0 20px 35px -10px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {heroDone ? (
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))" }}
                >
                  <Icon name="Check" size={28} style={{ color: "#0a1628" }} />
                </div>
                <h3 className="font-oswald text-2xl font-bold text-white mb-2">Принято!</h3>
                <p className="font-golos text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
                  Перезвоним в течение<br />
                  <span className="text-white font-semibold">15 минут</span>
                </p>
              </div>
            ) : (
              <>
                {/* pain */}
                <p
                  className="font-golos font-bold text-base mb-5 pb-5 text-white leading-snug"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Платите за рекламу —<br />а заявок нет?
                </p>

                {/* form header */}
                <p className="font-oswald font-semibold text-white mb-1" style={{ fontSize: "1.25rem" }}>
                  Запишитесь на бесплатный разбор
                </p>
                <p className="font-golos text-sm mb-6" style={{ color: "var(--c-muted)" }}>
                  Покажу, где деньги сливаются и как окупить вложения минимум ×3
                </p>

                {/* phone input */}
                <div className="relative mb-4">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Icon name="Phone" size={16} style={{ color: "var(--c-muted)" }} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(formatPhone(e.target.value)); setPhoneError(""); }}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full pl-11 pr-4 py-4 rounded-xl font-golos text-base text-white outline-none border"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      borderColor: phoneError ? "#ef4444" : "rgba(255,255,255,0.14)",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => { if (!phoneError) (e.target as HTMLInputElement).style.borderColor = "rgba(212,175,55,0.6)"; }}
                    onBlur={(e) => { if (!phoneError) (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.14)"; }}
                  />
                </div>
                {phoneError && <p className="font-golos text-xs text-red-400 mb-3 -mt-2">{phoneError}</p>}

                {/* CTA button */}
                <button
                  onClick={submitHero}
                  className="btn-gold w-full py-4 rounded-xl font-oswald text-base font-semibold tracking-wide mb-4"
                  style={{
                    background: "linear-gradient(135deg, var(--c-orange) 0%, #e55c00 100%)",
                    color: "#fff",
                    transition: "all 0.2s",
                    boxShadow: "0 6px 20px rgba(240,123,29,0.4)",
                  }}
                >
                  Получить разбор
                </button>

                {/* reassurance */}
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Clock" size={14} style={{ color: "var(--c-muted)" }} />
                  <span className="font-golos text-xs" style={{ color: "var(--c-muted)" }}>
                    Отвечаю в течение 15 минут
                  </span>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default function Index() {
  const [priceFormDone, setPriceFormDone] = useState(false);
  const [consultFormDone, setConsultFormDone] = useState(false);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen font-golos" style={{ background: "var(--c-bg)", color: "var(--c-text)" }}>
      <style>{`
        :root {
          --c-bg: #0a1628;
          --c-surface: #0f1f3d;
          --c-surface2: #152344;
          --c-gold: #d4af37;
          --c-orange: #f07b1d;
          --c-text: #e8edf5;
          --c-muted: #7a8ba8;
          --c-border: rgba(255,255,255,0.08);
        }
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        ::selection { background: rgba(212,175,55,0.3); }
        input::placeholder { color: var(--c-muted); }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(212,175,55,0.4) !important; }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "rgba(10,22,40,0.92)", backdropFilter: "blur(12px)", borderColor: "var(--c-border)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded flex items-center justify-center font-oswald font-bold text-sm" style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))", color: "#0a1628" }}>ОК</div>
            <div>
              <div className="font-oswald font-semibold text-white text-base leading-none">Олег Кошкаров</div>
              <div className="font-golos text-xs mt-0.5" style={{ color: "var(--c-gold)" }}>Marketing</div>
            </div>
          </div>
          <button onClick={() => scrollTo("calc")} className="btn-gold hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg font-oswald text-sm font-semibold tracking-wide" style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))", color: "#0a1628", transition: "all 0.2s", boxShadow: "0 4px 16px rgba(212,175,55,0.2)" }}>
            Бесплатный разбор
          </button>
        </div>
      </header>

      {/* HERO */}
      <HeroSection />

      {/* EXPERT */}
      <Section id="expert" style={{ background: "var(--c-surface)" }}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))", transform: "translate(8px, 8px)", opacity: 0.35, borderRadius: 16 }} />
            <img src={EXPERT_PHOTO} alt="Олег Кошкаров" className="relative rounded-2xl w-full object-cover" style={{ aspectRatio: "1/1", maxWidth: 460 }} />
            <div className="absolute bottom-6 left-6 right-6 rounded-xl px-5 py-4" style={{ background: "rgba(10,22,40,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(212,175,55,0.3)" }}>
              <div className="font-oswald text-white font-bold text-lg">Олег Кошкаров</div>
              <div className="font-golos text-sm mt-1" style={{ color: "var(--c-gold)" }}>Эксперт по Авито-маркетингу · 7 лет опыта</div>
            </div>
          </div>
          <div>
            <GoldLabel>Об эксперте</GoldLabel>
            <h2 className="font-oswald font-bold text-white mb-6" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
              7 лет помогаю строительному бизнесу получать клиентов
            </h2>
            <p className="font-golos text-lg mb-8 leading-relaxed" style={{ color: "var(--c-muted)" }}>
              Покажу, где деньги сливаются впустую и как окупить вложения{" "}
              <span className="font-bold" style={{ color: "var(--c-gold)" }}>минимум в 3 раза</span>. На разборе разберём вашу нишу, бюджет и покажем точную стоимость заявки.
            </p>
            <div className="flex flex-col gap-4 mb-8">
              {["100+ успешных запусков с 2022 года", "Средняя стоимость заявки — 150–400 ₽", "Первые клиенты уже на 3-й день работы"].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))" }}>
                    <Icon name="Check" size={11} style={{ color: "#0a1628" }} />
                  </div>
                  <span className="font-golos text-white">{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => scrollTo("calc")} className="btn-gold inline-flex items-center gap-3 px-7 py-4 rounded-xl font-oswald font-semibold tracking-wide" style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))", color: "#0a1628", transition: "all 0.2s", boxShadow: "0 6px 24px rgba(212,175,55,0.25)" }}>
              Записаться на бесплатный разбор
              <Icon name="ArrowRight" size={18} />
            </button>
          </div>
        </div>
      </Section>

      {/* CALCULATOR */}
      <Section id="calc" style={{ background: "var(--c-bg)" }}>
        <div className="text-center mb-12">
          <GoldLabel>Калькулятор заявок</GoldLabel>
          <h2 className="font-oswald font-bold text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            Рассчитаем, сколько заявок<br />вы можете получить
          </h2>
          <p className="font-golos mt-4 text-lg" style={{ color: "var(--c-muted)" }}>
            Ответьте на 5 вопросов — пришлём персональный расчёт и прайс-лист
          </p>
        </div>
        <div className="max-w-2xl mx-auto rounded-2xl p-8 md:p-12 border" style={{ background: "var(--c-surface)", borderColor: "var(--c-border)" }}>
          <Calculator />
        </div>
      </Section>

      {/* SOCIAL PROOF */}
      <Section style={{ background: "var(--c-surface)" }}>
        <div className="text-center mb-12">
          <GoldLabel>Результаты клиентов</GoldLabel>
          <h2 className="font-oswald font-bold text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            С 2022 года — более{" "}
            <span style={{ color: "var(--c-gold)" }}>100 успешных</span> продвижений
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border flex flex-col items-center justify-center gap-3" style={{ background: "rgba(255,255,255,0.02)", borderColor: "var(--c-border)", aspectRatio: "16/10" }}>
              <Icon name="Image" size={28} style={{ color: "var(--c-muted)" }} />
              <span className="font-golos text-sm" style={{ color: "var(--c-muted)" }}>Скриншот {i + 1}</span>
            </div>
          ))}
        </div>
        <p className="text-center font-golos text-xs mt-6" style={{ color: "var(--c-muted)" }}>
          * Места для скриншотов переписок и статистики — добавьте ваши реальные результаты
        </p>
      </Section>

      {/* ADVANTAGES */}
      <Section style={{ background: "var(--c-bg)" }}>
        <div className="text-center mb-12">
          <GoldLabel>Почему мы</GoldLabel>
          <h2 className="font-oswald font-bold text-white" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
            Комплексный подход — от анализа до результата
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "Target", title: "Комплексный анализ ЦА", desc: "Изучаем вашу целевую аудиторию и конкурентов перед запуском" },
            { icon: "Lightbulb", title: "Сильное УТП", desc: "Разрабатываем уникальное торговое предложение, которое выделяет вас" },
            { icon: "FileText", title: "Продающее описание", desc: "Пишем тексты, которые закрывают возражения клиентов" },
            { icon: "Layers", title: "Сегментация рекламы", desc: "Настраиваем объявления под разные сегменты вашей аудитории" },
            { icon: "BarChart2", title: "A/B тестирование", desc: "Тестируем заголовки и фото для максимальной конверсии" },
            { icon: "BadgeCheck", title: "Понятные цены", desc: "Без скрытых платежей. Прайс-лист — в открытом доступе" },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-xl border"
              style={{ background: "var(--c-surface)", borderColor: "var(--c-border)", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--c-border)"; }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(212,175,55,0.1)" }}>
                <Icon name={icon} size={22} style={{ color: "var(--c-gold)" }} />
              </div>
              <h3 className="font-oswald font-semibold text-white text-lg mb-2">{title}</h3>
              <p className="font-golos text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PRICE */}
      <Section style={{ background: "var(--c-surface)" }}>
        <div className="max-w-2xl mx-auto text-center rounded-2xl p-10 md:p-14 border" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(240,123,29,0.05) 100%)", borderColor: "rgba(212,175,55,0.25)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))" }}>
            <Icon name="Download" size={28} style={{ color: "#0a1628" }} />
          </div>
          <GoldLabel>Прайс-лист</GoldLabel>
          <h2 className="font-oswald font-bold text-white mb-3" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}>
            Скачайте прайс и узнайте<br />полную стоимость
          </h2>
          <p className="font-golos mb-8" style={{ color: "var(--c-muted)" }}>
            Оставьте номер телефона — пришлём прайс-лист с ценами на все пакеты
          </p>
          {priceFormDone ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <Icon name="CheckCircle" size={24} style={{ color: "var(--c-gold)" }} />
              <span className="font-golos text-white font-medium">Прайс-лист отправлен!</span>
            </div>
          ) : (
            <PhoneForm buttonText="Получить прайс" onSuccess={() => setPriceFormDone(true)} />
          )}
        </div>
      </Section>

      {/* CONSULT */}
      <Section id="consult" style={{ background: "var(--c-bg)" }}>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <GoldLabel>Бесплатная консультация</GoldLabel>
            <h2 className="font-oswald font-bold text-white mb-6" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
              Получите экспертную консультацию по всем вопросам
            </h2>
            <div className="flex flex-col gap-5 mb-8">
              {[
                "Разберём вашу нишу и целевую аудиторию",
                "Покажем, сколько стоит заявка в вашем регионе",
                "Определим оптимальный рекламный бюджет",
                "Разработаем стратегию продвижения на Авито",
                "Ответим на все вопросы по настройке аккаунта",
              ].map((item, i) => (
                <div key={item} className="flex items-start gap-4">
                  <span className="font-oswald font-bold text-sm flex-shrink-0 mt-0.5" style={{ color: "var(--c-gold)", minWidth: 28 }}>
                    /{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-golos text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl p-8 border" style={{ background: "var(--c-surface)", borderColor: "var(--c-border)" }}>
            {consultFormDone ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))" }}>
                  <Icon name="Check" size={28} style={{ color: "#0a1628" }} />
                </div>
                <h3 className="font-oswald text-2xl font-bold text-white mb-2">Отлично!</h3>
                <p className="font-golos" style={{ color: "var(--c-muted)" }}>Свяжемся с вами в ближайшее время</p>
              </div>
            ) : (
              <>
                <h3 className="font-oswald font-bold text-white text-xl mb-2">
                  Узнайте, сколько денег<br />вы можете сэкономить с Авито
                </h3>
                <p className="font-golos text-sm mb-6" style={{ color: "var(--c-muted)" }}>
                  Оставьте номер — перезвоним в течение 15 минут
                </p>
                <PhoneForm buttonText="Получить консультацию" onSuccess={() => setConsultFormDone(true)} />
              </>
            )}
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t py-12" style={{ background: "var(--c-surface)", borderColor: "var(--c-border)" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded flex items-center justify-center font-oswald font-bold text-sm" style={{ background: "linear-gradient(135deg, var(--c-gold), var(--c-orange))", color: "#0a1628" }}>ОК</div>
                <div>
                  <div className="font-oswald font-semibold text-white">Олег Кошкаров</div>
                  <div className="font-golos text-xs" style={{ color: "var(--c-gold)" }}>Marketing</div>
                </div>
              </div>
              <p className="font-golos text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
                Авито-маркетинг для строительного бизнеса. Первые заявки через 3 дня.
              </p>
            </div>
            <div>
              <h4 className="font-oswald font-semibold text-white mb-4">Контакты</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" size={16} style={{ color: "var(--c-gold)", marginTop: 2, flexShrink: 0 }} />
                  <span className="font-golos text-sm" style={{ color: "var(--c-muted)" }}>г. Сочи, ул. Пластунская 123а К3</span>
                </div>
                <a href="#" className="flex items-center gap-3 font-golos text-sm" style={{ color: "var(--c-gold)", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--c-orange)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--c-gold)"; }}>
                  <Icon name="MessageCircle" size={16} style={{ flexShrink: 0 }} />
                  Пишите мне напрямую
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-oswald font-semibold text-white mb-4">Навигация</h4>
              <div className="flex flex-col gap-2">
                {[{ label: "О нас", id: "expert" }, { label: "Калькулятор", id: "calc" }, { label: "Консультация", id: "consult" }].map(({ label, id }) => (
                  <button key={id} onClick={() => scrollTo(id)} className="text-left font-golos text-sm" style={{ color: "var(--c-muted)", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--c-gold)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--c-muted)"; }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-start gap-3" style={{ borderColor: "var(--c-border)" }}>
            <p className="font-golos text-xs" style={{ color: "var(--c-muted)" }}>© 2024 Олег Кошкаров Marketing. Все права защищены.</p>
            <p className="font-golos text-xs text-right" style={{ color: "var(--c-muted)", maxWidth: 420 }}>
              Настоящий сайт не является публичной офертой. Информация носит ознакомительный характер.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}