import { useEffect, useRef, useState, useId } from "react";
import "../app_intro.css";
import "../advantages.css";
import "../recordpage.css";

/** FlowConnector: curved line + glowing dot animation */
function FlowConnector({ dir = "right", length = 140, reduced = false }) {
  const id = useId();
  const isHorizontal = dir === "right";
  const pathD = isHorizontal
    ? `M0,20 C${length / 2},0 ${length / 2},40 ${length},20`
    : `M20,0 C0,${length / 2} 40,${length / 2} 20,${length}`;

  return (
    <svg
      className={`rp-flow ${isHorizontal ? "rp-flow-h" : "rp-flow-v"}`}
      width={isHorizontal ? length : 40}
      height={isHorizontal ? 40 : length}
      viewBox={isHorizontal ? `0 0 ${length} 40` : `0 0 40 ${length}`}
      aria-hidden
    >
      <path className="rp-flow-path" d={pathD} fill="none" />
      {!reduced && (
        <circle className="rp-flow-dot" r="4">
          <animateMotion dur="2.6s" repeatCount="indefinite">
            <mpath href={`#flowPath-${id}`} />
          </animateMotion>
        </circle>
      )}
      <path id={`flowPath-${id}`} d={pathD} fill="none" />
    </svg>
  );
}

/* ---------- Utilities ---------- */
function useIsMobile(bp = 820) {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= bp : true
  );
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth <= bp);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [bp]);
  return mobile;
}
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

/* ---------- Small decorations ---------- */
function AnimatedMic({ disabled = false }) {
  if (disabled) {
    return <div className="rp-mic rp-mic--static"><div className="rp-mic-dot" /></div>;
  }
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf;
    const loop = () => { setT((x) => x + 0.04); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const ringStyle = (phase, base = 1) => {
    const s = base + 0.08 * Math.sin(t + phase);
    const o = 0.65 + 0.25 * Math.sin(t + phase);
    return { transform: `scale(${s})`, opacity: o };
  };
  return (
    <div className="rp-mic">
      <div className="rp-mic-ring" style={ringStyle(0.0, 1.00)} />
      <div className="rp-mic-ring" style={ringStyle(0.7, 1.15)} />
      <div className="rp-mic-ring" style={ringStyle(1.4, 1.30)} />
      <div className="rp-mic-center"><div className="rp-mic-dot" /></div>
    </div>
  );
}
function SparklineWave({ width = 220, height = 40, disabled = false }) {
  const [off, setOff] = useState(0);
  useEffect(() => {
    if (disabled) return;
    let raf;
    const loop = () => { setOff((x) => (x + 3) % 800); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [disabled]);
  return (
    <svg className="rp-wave" width={width} height={height} viewBox="0 0 400 72" role="img" aria-label="wave">
      <path
        d="M0 36 C 25 10, 55 62, 80 36 S 135 10, 160 36  215 62, 240 36  295 10, 320 36  375 62, 400 36"
        className="rp-wave-path"
        style={{ strokeDashoffset: disabled ? 0 : off }}
      />
    </svg>
  );
}

/* ---------- HOW-IT-WORKS extras ---------- */
function BackdropWave() {
  return (
    <div className="rp-backdrop">
      <svg className="rp-backdrop-svg" width="100%" height="220" viewBox="0 0 800 220" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hwg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(77,163,255,.12)" />
            <stop offset="100%" stopColor="rgba(77,163,255,0)" />
          </linearGradient>
        </defs>
        <path
          d="M0,150 C120,110 200,210 320,160 C420,120 520,190 640,150 C710,125 760,145 800,130 L800,220 L0,220 Z"
          fill="url(#hwg)"
        />
      </svg>
    </div>
  );
}
function GlowBadge({ children }) {
  return (
    <span className="rp-badge">
      <span className="rp-badge-dot" />
      {children}
    </span>
  );
}
function StepCard({ index, title, children, accent = "wave", reduceMotion }) {
  const Accent = accent === "wave"
    ? <SparklineWave width={160} height={28} disabled={reduceMotion} />
    : null; // you can add more accents later
  return (
    <div className="ai-card rp-step">
      <div className="ai-dot rp-step-index">{index}</div>
      <div className="rp-step-main">
        <h3 className="rp-step-title">{title}</h3>
        <p className="ai-subtitle rp-step-desc">{children}</p>
      </div>
      <div className="rp-step-accent" aria-hidden>{Accent}</div>
    </div>
  );
}

/* ===================== Main Component ===================== */
export default function SpeechDemo() {
  const isMobile = useIsMobile(820);
  const reduceMotion = usePrefersReducedMotion();

  // Core state
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState("th-TH");
  const [finalText, setFinalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState("");
  const [autoRestart, setAutoRestart] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  // Speech
  const recRef = useRef(null);
  const keepAliveRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }

    const rec = new SR();
    recRef.current = rec;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      let interim = "", finalsToAppend = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const txt = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalsToAppend += txt + " ";
        else interim += txt;
      }
      if (finalsToAppend) setFinalText(prev => prev + finalsToAppend);
      setInterimText(interim);
    };

    rec.onend = () => {
      if (keepAliveRef.current && autoRestart) {
        try { rec.start(); } catch { }
        setListening(true);
      } else {
        setListening(false);
        stopTimer();
      }
    };

    rec.onerror = (e) => {
      setError(e.error || "unknown error");
      setListening(false);
      stopTimer();
    };
  }, [autoRestart]);

  // Timer
  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // Controls
  const start = () => {
    setError("");
    if (!recRef.current) return;
    keepAliveRef.current = true;
    recRef.current.lang = lang;
    try { recRef.current.start(); setListening(true); setElapsed(0); startTimer(); } catch { }
  };
  const stop = () => {
    if (!recRef.current) return;
    keepAliveRef.current = false;
    recRef.current.stop();
    stopTimer();
  };
  const clearAll = () => { setFinalText(""); setInterimText(""); setError(""); setElapsed(0); };
  const copyAll = async () => { try { await navigator.clipboard.writeText(finalText + interimText); } catch { } };
  const downloadTxt = () => {
    const blob = new Blob([finalText + interimText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    a.href = url; a.download = `transcript-${ts}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  const words = (finalText + interimText).trim().split(/\s+/).filter(Boolean).length;
  const chars = (finalText + interimText).length;
  const fmt = (s) => String(s).padStart(2, "0");
  const hh = Math.floor(elapsed / 3600), mm = Math.floor((elapsed % 3600) / 60), ss = elapsed % 60;

  if (!supported) {
    return (
      <section className="ai-wrap rp-section">
        <div className="rp-container">
          <div className="ai-hero">
            <h1>Speech Demo</h1>
            <p className="ai-kicker" style={{ color: "var(--muted)" }}>
              Your browser does not support the Web Speech API (try Chrome/Edge on Desktop).
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ===================== PAGE ===================== */
  return (
    <>
      {/* HERO */}
      <section className="ai-wrap">
        <div className="ai-hero">
          <h1>Audio → Text (Realtime)</h1>
          <div className="ai-kicker">DEMO APPLICATION AUDIO RECORD • No extra libraries</div>
          <div className="rp-hero-anim">
            <AnimatedMic disabled={reduceMotion} />
            <SparklineWave disabled={reduceMotion} />
          </div>
        </div>

        {/* CONTROLS */}
        <div className="ai-intro rp-container">
          <div className="ai-card rp-card">
            <div className="rp-row-header">
              <h2 className="ai-section-title rp-title">Realtime Transcription</h2>
              <span className={`rp-pill ${listening ? "rp-pill--on" : ""}`}>
                {listening ? "Listening" : "Idle"}
              </span>
            </div>

            <div className="rp-controls">
              <div className="rp-controls-left">
                <label className="ai-subtitle">Language</label>
                <select className="rp-select" value={lang} onChange={(e) => setLang(e.target.value)}>
                  <option value="th-TH">Thai (th-TH)</option>
                  <option value="en-US">English (en-US)</option>
                  <option value="ja-JP">日本語 (ja-JP)</option>
                </select>
                <label className="ai-subtitle rp-checkbox">
                  <input
                    type="checkbox"
                    checked={autoRestart}
                    onChange={(e) => setAutoRestart(e.target.checked)}
                  />
                  Auto-Restart
                </label>
              </div>

              <div className="rp-controls-right">
                {!listening ? (
                  <button className="rp-btn" onClick={start}>▶️ Start</button>
                ) : (
                  <button className="rp-btn rp-btn--danger" onClick={stop}>⛔ Stop</button>
                )}
                <button className="rp-btn rp-btn--ghost" onClick={clearAll}>🧹 Clear</button>
                <button className="rp-btn rp-btn--ghost" onClick={copyAll}>📋 Copy</button>
                <button className="rp-btn rp-btn--ghost" onClick={downloadTxt}>⬇️ Download .txt</button>
              </div>
            </div>

            <div className="ai-subtitle rp-metrics">
              ⏱ {fmt(hh)}:{fmt(mm)}:{fmt(ss)} • Words: {words} • Chars: {chars}
            </div>
          </div>

          {error && (
            <div className="ai-card rp-card rp-card--warn">
              <div className="rp-warn-title">Error: {String(error)}</div>
              <div className="ai-subtitle">If the mic is blocked, check the URL bar icon and allow microphone access.</div>
            </div>
          )}

          {/* OUTPUT */}
          <div className="ai-section-title rp-title-top">Live Transcript</div>
          <div className="ai-card rp-output">
            <span>{finalText}</span>
            <span className="rp-output-interim">{interimText}</span>
          </div>
          <p className="ai-subtitle rp-note">
            * Works over <b>https</b> or <b>http://localhost</b> only.
          </p>
        </div>

        {/* ADVANTAGES */}
        <div className="ai-band">
          <div className="rp-container">
            <div className="ai-section-title">Advantages</div>
            <div className="ai-subtitle rp-subtitle-gap">
              Practical for meetings and interviews — real-time, exportable, and zero-dependency.
            </div>

            <section className="record-page">
              <div className="record-compare">
                <figure className="record-col">
                  <div className="record-tag">Web (Browser)</div>
                  <div className="record-img-wrap">
                    <img className="record-img" alt="Web result" src="/img/record/rc6.png" />
                  </div>
                  <figcaption className="record-cap">
                    <strong>Result on Browser</strong><br />
                    <span className="record-note">
                      Accuracy is still limited at this stage. Future enhancements will leverage AI
                      to improve word prediction and transcription quality.
                    </span>
                  </figcaption>
                </figure>

                <figure className="record-col">
                  <div className="record-tag record-tag--alt">Android Emulator</div>
                  <div className="record-img-wrap">
                    <img className="record-img" alt="Android emulator result" src="/img/record/rc7.png" />
                  </div>
                  <figcaption className="record-cap">
                    <strong>Result on Emulator</strong><br />
                    <span className="record-note">
                      More errors are expected during testing. Development will continue
                      to improve stability and accuracy.
                    </span>
                  </figcaption>
                </figure>
              </div>
            </section>


            <div className="rp-grid-3">
              <div className="ai-card">
                <div className="ai-dot">1</div>
                <h3>Real-Time & Continuous</h3>
                <p>Automatically restarts to avoid silence timeouts, displaying both interim and final results seamlessly.</p>
              </div>
              <div className="ai-card">
                <div className="ai-dot">2</div>
                <h3>One-Click Export</h3>
                <p>Instantly copy notes or download them as a .txt file with a single click.</p>
              </div>
              <div className="ai-card">
                <div className="ai-dot">3</div>
                <h3>Browser-Native STT</h3>
                <p>Powered by the Web Speech API — no extra dependencies or third-party packages required.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* TECH STACK & TOOLS */}
      <section className="ai-wrap rp-section">
        <div className="rp-container">
          <div className="ai-section-title">Tech Stack & Tools</div>
          <div className="ai-subtitle">Core technologies that power the application.</div>

          <div className="rp-grid-3 rp-grid-gap-top">
            <div className="ai-card">
              <div className="ai-dot">💻</div>
              <h3>Language & Framework</h3>
              <p>JavaScript (ES2020+) with React 18+ and Hooks for state and logic.</p>
            </div>
            <div className="ai-card">
              <div className="ai-dot">🎤</div>
              <h3>Core API</h3>
              <p>Native Web Speech API for real-time transcription in the browser.</p>
            </div>
            <div className="ai-card">
              <div className="ai-dot">🌐</div>
              <h3>Frontend App</h3>
              <p>Single-page, client-side architecture — no backend required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="ai-wrap ai-band rp-section">
        <div className="rp-container">
          <div className="ai-card rp-hiw-card">
            <BackdropWave />

            <div className="rp-row-header rp-row-header--hiw">
              <div>
                <div className="ai-section-title">How it works</div>
                <div className="ai-subtitle">Execution flow, state model, and edge cases.</div>
              </div>
              <GlowBadge>Client-side only • HTTPS/localhost</GlowBadge>
            </div>

            <div className="rp-grid-3 rp-grid-gap-top">
              <StepCard index={1} title="Start" reduceMotion={reduceMotion} accent="eq">
                Ask for microphone permission, set <code>rec.lang</code>, then call <code>rec.start()</code>.
                Timer begins and <code>listening</code> is set to true.
              </StepCard>

              <StepCard index={2} title="Listen & Merge" reduceMotion={reduceMotion} accent="wave">
                In <code>onresult</code>, append confirmed tokens to <b>finalText</b> and show partials in <b>interimText</b>.
                This keeps the text area smooth and readable.
              </StepCard>

              <StepCard index={3} title="Auto-Restart & Export" reduceMotion={reduceMotion} accent="eq">
                On <code>onend</code>, if Auto-Restart is on and user still wants to listen, restart recognition.
                Export via Copy or Download <code>.txt</code>.
              </StepCard>
            </div>

            <div className="rp-divider" />

            <div className="rp-grid-2">
              <div className="ai-card">
                <div className="ai-section-title">State / Data</div>
                <div className="rp-thin-divider" />
                <ul className="ai-list rp-ul">
                  <li><code>finalText</code>: accumulated confirmed transcript.</li>
                  <li><code>interimText</code>: current partial transcript.</li>
                  <li><code>listening</code>: whether recognition is active.</li>
                  <li><code>autoRestart</code>: restart when ended by silence.</li>
                  <li><code>elapsed</code>: current session seconds.</li>
                </ul>
              </div>

              <div className="ai-card">
                <div className="ai-section-title">Errors & Edge Cases</div>
                <div className="rp-thin-divider" />
                <ul className="ai-list rp-ul">
                  <li><code>not-allowed</code>: mic permission denied.</li>
                  <li><code>no-speech</code>: silence timeout triggers <code>onend</code>.</li>
                  <li><code>aborted</code>: recognition aborted (tab/app switch).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="ai-wrap rp-section">
        <div className="rp-container">
          <div className="ai-section-title">Roadmap</div>
          <div className="ai-subtitle">Planned improvements for production readiness.</div>

          <div className="rp-roadmap">
            <div className="ai-card rp-roadmap-card">
              <h3>Language & Formatting</h3>
              <p>Auto-punctuation (EN/TH), smart line breaks, keyword highlighting.</p>
            </div>

            <FlowConnector
              dir={isMobile ? "down" : "right"}
              length={isMobile ? 100 : 160}
              reduced={reduceMotion}
            />

            <div className="ai-card rp-roadmap-card">
              <h3>Speakers & Summary</h3>
              <p>Speaker tags, summaries & action items with LLM, timestamps.</p>
            </div>

            <FlowConnector
              dir={isMobile ? "down" : "right"}
              length={isMobile ? 100 : 160}
              reduced={reduceMotion}
            />

            <div className="ai-card rp-roadmap-card">
              <h3>Integrations / Export</h3>
              <p>Export to .docx/.pdf/Google Docs, REST APIs, optional Whisper/Cloud STT.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY THIS DEMO */}
      <section className="advantages-section rp-section">
        <div className="rp-container">
          <h2 className="section-title" style={{ color: "var(--text)", margin: 0 }}>Why this demo?</h2>
          <p className="section-subtitle">Real-time speech transcription with a clean, focused UX.</p>

          <div className="rp-grid-3">
            <div className="adv-card">
              <div className="adv-dot">✓</div>
              <h3>Simple UX</h3>
              <p>Clear buttons and single text area keep focus on content, not controls.</p>
            </div>
            <div className="adv-card">
              <div className="adv-dot">✓</div>
              <h3>Multi-language</h3>
              <p>Switch languages (th-TH, en-US, ja-JP) on the fly.</p>
            </div>
            <div className="adv-card">
              <div className="adv-dot">✓</div>
              <h3>On-brand styling</h3>
              <p>Uses your CSS variables and dark palette for consistency.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
