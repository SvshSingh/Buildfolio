"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Linkedin,
  Twitter,
  Github,
  ChevronDown,
  ExternalLink,
  Wifi,
  Battery,
  GitBranch,
  Folder,
  FolderOpen,
  Package,
} from "lucide-react";
import { Experience } from "../ExperienceTimeline";

// ─────────────────────────────────────────────
// INTERFACES  (data structure unchanged)
// ─────────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string;
  link: string;
  cover: string | null;
}

interface Portfolio {
  name: string;
  headline: string;
  bio: string;
  location: string;
  photo: string | null;
  about: string;
  projects: Project[];
  skills: string;
  email: string;
  linkedin: string;
  twitter: string;
  github: string;
  experience?: Experience[];
}

interface TemplateProps {
  portfolio: Portfolio;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const parseTags = (s: string): string[] =>
  s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

function hashStr(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++)
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).slice(0, 7).padStart(7, "a");
}

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
function useLiveClock(): string {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// Scroll-triggered typing reveal for each section
function useTypingReveal(command: string, delay = 200, speed = 30) {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);
  const [chars, setChars] = useState(0);
  const [outputVisible, setOutputVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          obs.disconnect();
          const t0 = setTimeout(() => {
            let i = 0;
            const iv = setInterval(() => {
              i++;
              setChars(i);
              if (i >= command.length) {
                clearInterval(iv);
                setTimeout(() => setOutputVisible(true), 280);
              }
            }, speed);
            return () => clearInterval(iv);
          }, delay);
          return () => clearTimeout(t0);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [command, delay, speed]);

  return {
    ref,
    typed: command.slice(0, chars),
    done: chars >= command.length,
    outputVisible,
  };
}

// ─────────────────────────────────────────────
// INJECTED STYLES
// ─────────────────────────────────────────────
const TERMINAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

  .t-root {
    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;
  }

  @keyframes t-blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  @keyframes t-grain {
    0%,100% { transform: translate(0,0); }
    10% { transform: translate(-1px,-2px); }
    20% { transform: translate(2px,1px); }
    30% { transform: translate(-2px,3px); }
    40% { transform: translate(1px,-1px); }
    50% { transform: translate(-3px,2px); }
    60% { transform: translate(2px,-2px); }
    70% { transform: translate(-1px,3px); }
    80% { transform: translate(2px,-1px); }
    90% { transform: translate(-2px,1px); }
  }

  @keyframes t-window-in {
    from { opacity: 0; transform: translateY(24px) scale(0.99); }
    to   { opacity: 1; transform: translateY(0px)  scale(1); }
  }

  .t-cursor {
    display: inline-block;
    width: 7px; height: 15px;
    background: #89b4fa;
    vertical-align: middle;
    animation: t-blink 1s step-end infinite;
    margin-left: 1px;
    border-radius: 1px;
  }

  .t-cursor-static {
    display: inline-block;
    width: 7px; height: 15px;
    background: #89b4fa;
    vertical-align: middle;
    margin-left: 1px;
    border-radius: 1px;
  }

  .t-grain-layer {
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.045;
    pointer-events: none;
    z-index: 1;
    animation: t-grain 0.4s steps(1) infinite;
  }

  .t-window {
    animation: t-window-in 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .t-scroll::-webkit-scrollbar { width: 5px; }
  .t-scroll::-webkit-scrollbar-track { background: transparent; }
  .t-scroll::-webkit-scrollbar-thumb { background: #313244; border-radius: 4px; }
  .t-scroll::-webkit-scrollbar-thumb:hover { background: #45475a; }

  .t-row:hover { background: rgba(137, 180, 250, 0.04); border-radius: 4px; }
  .t-folder-row { transition: background 0.1s; cursor: pointer; border-radius: 4px; }
  .t-folder-row:hover { background: rgba(137, 180, 250, 0.07); }
  .t-contact-row { transition: background 0.1s; border-radius: 4px; }
  .t-contact-row:hover { background: rgba(137, 180, 250, 0.05); }

  ::selection { background: rgba(137, 180, 250, 0.25); }

  .t-traffic-light { transition: filter 0.15s; }
  .t-traffic-light:hover { filter: brightness(1.15); }

  .t-code-line:hover { background: rgba(255,255,255,0.025); }
`;

// ─────────────────────────────────────────────
// SHARED: SHELL PROMPT
// ─────────────────────────────────────────────
function Prompt({ path = "~/portfolio" }: { path?: string }) {
  return (
    <span className="select-none shrink-0">
      <span style={{ color: "#a6e3a1" }}>dev</span>
      <span style={{ color: "#45475a" }}>@</span>
      <span style={{ color: "#89b4fa" }}>portfolio</span>
      <span style={{ color: "#45475a" }}>:</span>
      <span style={{ color: "#cba6f7" }}>{path}</span>
      <span style={{ color: "#45475a" }}> $ </span>
    </span>
  );
}

// ─────────────────────────────────────────────
// SECTION WRAPPER  (typing reveal + output)
// ─────────────────────────────────────────────
function Section({
  command,
  path = "~/portfolio",
  children,
  delay = 200,
  speed = 28,
}: {
  command: string;
  path?: string;
  children: React.ReactNode;
  delay?: number;
  speed?: number;
}) {
  const { ref, typed, done, outputVisible } = useTypingReveal(
    command,
    delay,
    speed
  );

  return (
    <div ref={ref} className="mb-10">
      {/* Command line */}
      <div className="flex items-center text-sm leading-6 mb-2 min-h-[24px] flex-wrap">
        {(typed.length > 0 || done) && <Prompt path={path} />}
        <span style={{ color: "#cdd6f4" }}>{typed}</span>
        {!done && typed.length > 0 && <span className="t-cursor-static" />}
        {done && !outputVisible && (
          <span className="t-cursor-static opacity-40" />
        )}
      </div>

      {/* Output */}
      <AnimatePresence>
        {outputVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// WINDOW CHROME: TITLE BAR
// ─────────────────────────────────────────────
function TitleBar({ clock }: { clock: string }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-[10px] flex-shrink-0 select-none relative"
      style={{
        background: "linear-gradient(to bottom, #2c2c30, #242427)",
        borderBottom: "1px solid #313244",
      }}
    >
      {/* Traffic lights */}
      <div className="flex items-center gap-[7px] z-10">
        <button
          aria-label="Close"
          className="t-traffic-light w-3 h-3 rounded-full group flex items-center justify-center"
          style={{
            background: "#ff5f57",
            border: "0.5px solid rgba(0,0,0,0.25)",
            outline: "none",
          }}
        >
          <span className="text-[7px] text-black/50 opacity-0 group-hover:opacity-100 leading-none font-bold">
            ✕
          </span>
        </button>
        <button
          aria-label="Minimize"
          className="t-traffic-light w-3 h-3 rounded-full group flex items-center justify-center"
          style={{
            background: "#febc2e",
            border: "0.5px solid rgba(0,0,0,0.2)",
            outline: "none",
          }}
        >
          <span className="text-[7px] text-black/50 opacity-0 group-hover:opacity-100 leading-none font-bold">
            −
          </span>
        </button>
        <button
          aria-label="Fullscreen"
          className="t-traffic-light w-3 h-3 rounded-full group flex items-center justify-center"
          style={{
            background: "#28c840",
            border: "0.5px solid rgba(0,0,0,0.2)",
            outline: "none",
          }}
        >
          <span className="text-[7px] text-black/50 opacity-0 group-hover:opacity-100 leading-none">
            ⤢
          </span>
        </button>
      </div>

      {/* Centered title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          style={{
            color: "#6c7086",
            fontSize: "11px",
            letterSpacing: "0.01em",
          }}
        >
          dev@portfolio:~ — zsh — 140×40
        </span>
      </div>

      {/* Right side: decorations + clock */}
      <div
        className="flex items-center gap-3 z-10"
        style={{ color: "#6c7086", fontSize: "11px" }}
      >
        <div className="hidden sm:flex items-center gap-1">
          <Wifi size={11} strokeWidth={1.5} />
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <Battery size={11} strokeWidth={1.5} />
          <span>87%</span>
        </div>
        <span className="tabular-nums font-mono">{clock}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WINDOW CHROME: TAB BAR
// ─────────────────────────────────────────────
function TabBar() {
  return (
    <div
      className="flex items-end select-none shrink-0"
      style={{
        background: "#1a1a1d",
        borderBottom: "1px solid #2a2a2e",
        height: "33px",
        paddingLeft: "8px",
      }}
    >
      {/* Active tab */}
      <div
        className="flex items-center gap-1.5 px-4 text-xs relative"
        style={{
          height: "26px",
          background: "#1c1c1f",
          color: "#cdd6f4",
          border: "1px solid #2e2e33",
          borderBottom: "1px solid #1c1c1f",
          borderRadius: "6px 6px 0 0",
          marginTop: "7px",
          marginBottom: "-1px",
        }}
      >
        <span style={{ color: "#a6e3a1", fontSize: "8px" }}>●</span>
        <span>~</span>
      </div>
      {/* New tab */}
      <div
        className="flex items-center px-3 text-xs cursor-pointer hover:opacity-70 transition-opacity pb-1"
        style={{ color: "#45475a", height: "26px", marginTop: "7px" }}
      >
        <span>+</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WINDOW CHROME: STATUS BAR
// ─────────────────────────────────────────────
function StatusBar() {
  const [cpu, setCpu] = useState(8);
  const [mem, setMem] = useState(54);

  useEffect(() => {
    setCpu(Math.floor(Math.random() * 12 + 4));
    setMem(Math.floor(Math.random() * 22 + 44));
  }, []);

  return (

    <div
      className="flex items-center justify-between px-4 py-[5px] shrink-0 select-none text-[10px]"
      style={{
        background: "#161619",
        borderTop: "1px solid #2a2a2e",
        color: "#45475a",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <GitBranch size={9} />
          <span style={{ color: "#cba6f7" }}>main</span>
        </div>
        <span>~/portfolio</span>
        <span className="flex items-center gap-1">
          <span style={{ color: "#a6e3a1" }}>●</span>
          <span>SSH connected</span>
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <span>CPU {cpu}%</span>
        <span>MEM {mem}%</span>
        <span style={{ color: "#89dceb" }}>UTF-8</span>
        <span>zsh 5.9</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION: HERO  (multi-command sequence)
// ─────────────────────────────────────────────
function HeroSection({ portfolio }: { portfolio: Portfolio }) {
  const TYPING_SPEED = 36; // ms per character
  const OUTPUT_DELAY = 300; // ms after last char before output
  const NEXT_CMD_DELAY = 650; // ms after output before next command

  const hasPhoto = Boolean(portfolio.photo);

  const heroCommands: string[] = [
    "whoami",
    "cat profile.txt",
    ...(hasPhoto ? ["open profile.png"] : []),
    "cat bio.txt",
  ];

  type CmdState = { typed: number; outputVisible: boolean };
  const [cmdStates, setCmdStates] = useState<CmdState[]>(
    heroCommands.map(() => ({ typed: 0, outputVisible: false }))
  );

  const startCommandRef = useRef<((idx: number) => void) | undefined>(undefined);
  const fired = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Always-fresh startCommand via ref
  useEffect(() => {
    startCommandRef.current = (cmdIdx: number) => {
      if (cmdIdx >= heroCommands.length) return;
      const cmd = heroCommands[cmdIdx];
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setCmdStates((prev) => {
          const next = [...prev];
          next[cmdIdx] = { ...next[cmdIdx], typed: i };
          return next;
        });
        if (i >= cmd.length) {
          clearInterval(iv);
          setTimeout(() => {
            setCmdStates((prev) => {
              const next = [...prev];
              next[cmdIdx] = { ...next[cmdIdx], outputVisible: true };
              return next;
            });
            setTimeout(
              () => startCommandRef.current?.(cmdIdx + 1),
              NEXT_CMD_DELAY
            );
          }, OUTPUT_DELAY);
        }
      }, TYPING_SPEED);
    };
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          obs.disconnect();
          setTimeout(() => startCommandRef.current?.(0), 450);
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const renderOutput = (idx: number, cmd: string) => {
    if (cmd === "whoami") {
      return (
        <div className="pl-1 py-1.5 space-y-1">
          <p
            className="text-xl font-bold leading-tight"
            style={{ color: "#cdd6f4" }}
          >
            {portfolio.name || "Developer"}
          </p>
          <p className="text-sm font-medium" style={{ color: "#89b4fa" }}>
            {portfolio.headline || "Full Stack Engineer"}
          </p>
          {portfolio.location && (
            <p
              className="text-xs flex items-center gap-1"
              style={{ color: "#6c7086" }}
            >
              <span>📍</span>
              <span>{portfolio.location}</span>
            </p>
          )}
        </div>
      );
    }

    if (cmd === "cat profile.txt") {
      return (
        <div
          className="pl-1 mt-1 text-xs space-y-[2px]"
          style={{ color: "#a6adc8" }}
        >
          <p>
            <span style={{ color: "#89dceb" }}>role{"       "}</span>{" "}
            {portfolio.headline || "Developer"}
          </p>
          {portfolio.location && (
            <p>
              <span style={{ color: "#89dceb" }}>location{"   "}</span>{" "}
              {portfolio.location}
            </p>
          )}
          <p>
            <span style={{ color: "#89dceb" }}>status{"     "}</span>{" "}
            <span style={{ color: "#a6e3a1" }}>● available for work</span>
          </p>
          <p>
            <span style={{ color: "#89dceb" }}>shell{"      "}</span>{" "}
            <span style={{ color: "#cba6f7" }}>zsh 5.9</span>
          </p>
        </div>
      );
    }

    if (cmd === "open profile.png") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.96, height: 0 }}
          animate={{ opacity: 1, scale: 1, height: "auto" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 pl-1 overflow-hidden"
        >
          <div
            className="rounded-lg overflow-hidden border inline-block"
            style={{
              borderColor: "#313244",
              maxWidth: "180px",
              background: "#11111b",
            }}
          >
            {/* Mini viewer chrome */}
            <div
              className="flex items-center gap-1.5 px-2 py-1 text-[10px]"
              style={{
                background: "#1a1a20",
                borderBottom: "1px solid #2a2a2e",
                color: "#45475a",
              }}
            >
              <span style={{ color: "#a6e3a1", fontSize: "7px" }}>●</span>
              <span>profile.png</span>
              <span style={{ color: "#585b70", marginLeft: "auto" }}>
                Preview
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portfolio.photo!}
              alt={portfolio.name || "Profile"}
              className="w-full object-cover"
              style={{ maxHeight: "180px", display: "block" }}
            />
          </div>
        </motion.div>
      );
    }

    if (cmd === "cat bio.txt") {
      return (
        <div
          className="pl-1 mt-1 text-sm leading-relaxed"
          style={{ color: "#a6adc8", maxWidth: "580px" }}
        >
          {portfolio.bio || "No bio provided."}
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={sectionRef} className="mb-10">
      {heroCommands.map((cmd, idx) => {
        const state = cmdStates[idx];
        const isPastCmd =
          idx < cmdStates.findIndex((s, i) => i > 0 && s.typed === 0) ||
          (idx === 0 && cmdStates.length > 1 && cmdStates[1].typed > 0) ||
          state.outputVisible;
        const isCurrentCmd =
          state.typed > 0 && !state.outputVisible && !isPastCmd;
        const typedText = cmd.slice(0, state.typed);
        const showCursor = state.typed < cmd.length && state.typed > 0;

        if (state.typed === 0 && !isPastCmd) return null;

        return (
          <div key={idx} className="mb-5">
            {/* Command line */}
            <div className="flex items-center text-sm leading-6 flex-wrap">
              <Prompt />
              <span style={{ color: "#cdd6f4" }}>{typedText}</span>
              {showCursor && <span className="t-cursor-static" />}
            </div>
            {/* Output */}
            <AnimatePresence>
              {state.outputVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderOutput(idx, cmd)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Idle prompt after all commands */}
      {cmdStates[heroCommands.length - 1]?.outputVisible && (
        <div className="flex items-center text-sm leading-6 mt-1">
          <Prompt />
          <span className="t-cursor" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION: ABOUT  (cat about.md)
// ─────────────────────────────────────────────
function AboutSection({ about }: { about: string }) {
  const lines = about.split("\n");

  const getLineStyle = (line: string): { color: string; fontWeight?: string } => {
    if (line.startsWith("# ")) return { color: "#cba6f7", fontWeight: "600" };
    if (line.startsWith("## ")) return { color: "#89b4fa", fontWeight: "600" };
    if (line.startsWith("### ")) return { color: "#89dceb", fontWeight: "600" };
    if (line.startsWith("- ") || line.startsWith("* "))
      return { color: "#cdd6f4" };
    if (line.startsWith(">")) return { color: "#585b70" };
    if (line.startsWith("```")) return { color: "#f9e2af" };
    if (line.trim() === "") return { color: "#2a2a2e" };
    return { color: "#a6adc8" };
  };

  return (
    <Section command="cat about.md" path="~/portfolio">
      <div
        className="rounded-lg overflow-hidden border"
        style={{ borderColor: "#2e2e33", background: "#13131a" }}
      >
        {/* Editor-like file header */}
        <div
          className="flex items-center gap-2 px-4 py-2 border-b text-xs"
          style={{ borderColor: "#2a2a2e", background: "#1a1a20" }}
        >
          <span style={{ color: "#f9e2af" }}>📄</span>
          <span style={{ color: "#cba6f7", fontWeight: 500 }}>about.md</span>
          <span style={{ color: "#313244" }}>—</span>
          <span style={{ color: "#45475a" }}>Markdown Preview</span>
        </div>
        {/* Line-numbered content */}
        <div className="overflow-x-auto">
          <table
            className="w-full text-xs"
            style={{ borderCollapse: "separate", borderSpacing: 0 }}
          >
            <tbody>
              {lines.map((line, i) => {
                const style = getLineStyle(line);
                return (
                  <tr key={i} className="t-code-line">
                    <td
                      className="select-none text-right pr-4 pl-4 py-[2px] align-top shrink-0"
                      style={{
                        color: "#313244",
                        width: "40px",
                        minWidth: "40px",
                        userSelect: "none",
                        borderRight: "1px solid #2a2a2e",
                      }}
                    >
                      {i + 1}
                    </td>
                    <td
                      className="py-[2px] pl-4 pr-4 align-top"
                      style={{
                        color: style.color,
                        fontWeight: style.fontWeight ?? "400",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {line || "\u00a0"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// SECTION: PROJECTS  (ls -la projects/)
// ─────────────────────────────────────────────
function ProjectsSection({ projects }: { projects: Project[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

  return (
    <Section command="ls -la projects/" path="~/portfolio">
      <div className="text-xs" style={{ color: "#a6adc8" }}>
        {/* ls header */}
        <div className="pl-1 mb-2" style={{ color: "#45475a" }}>
          total {projects.length * 4}
        </div>

        {projects.map((project, idx) => {
          const isOpen = expanded === project.id;
          const tags = parseTags(project.tags);
          const hasLink = Boolean(project.link);
          const link = project.link?.startsWith("http")
            ? project.link
            : `https://${project.link}`;
          const fileSize = String(1024 + idx * 512).padStart(6);

          return (
            <div key={project.id}>
              {/* Directory row */}
              <div
                className="t-folder-row flex items-center gap-2 px-2 py-[4px] select-none flex-wrap"
                onClick={() => toggle(project.id)}
              >
                <span style={{ color: "#89b4fa", fontSize: "10px" }}>
                  drwxr-xr-x
                </span>
                <span style={{ color: "#45475a" }}>2</span>
                <span style={{ color: "#a6adc8" }}>dev</span>
                <span style={{ color: "#585b70" }}>{fileSize}</span>
                <span style={{ color: "#45475a" }}>{dateStr}</span>
                <span className="flex items-center gap-1.5 flex-1 min-w-0">
                  {isOpen ? (
                    <FolderOpen
                      size={13}
                      style={{ color: "#f9e2af", flexShrink: 0 }}
                    />
                  ) : (
                    <Folder
                      size={13}
                      style={{ color: "#f9e2af", flexShrink: 0 }}
                    />
                  )}
                  <span
                    style={{
                      color: "#89b4fa",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.title || "Untitled Project"}/
                  </span>
                </span>
                <ChevronDown
                  size={10}
                  className="transition-transform duration-200 shrink-0"
                  style={{
                    color: "#45475a",
                    transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                  }}
                />
              </div>

              {/* Expanded detail */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className="ml-5 mr-2 my-3 rounded-lg border overflow-hidden"
                      style={{
                        borderColor: "#2e2e33",
                        background: "#13131a",
                      }}
                    >
                      {/* Cover image */}
                      {project.cover && (
                        <div
                          className="overflow-hidden border-b"
                          style={{ borderColor: "#2a2a2e", maxHeight: "160px" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.cover}
                            alt={project.title}
                            className="w-full object-cover"
                            style={{ maxHeight: "160px", display: "block" }}
                          />
                        </div>
                      )}

                      <div className="p-4 space-y-2.5">
                        {/* Description */}
                        <div className="flex gap-3">
                          <span
                            className="shrink-0"
                            style={{
                              color: "#89dceb",
                              minWidth: "88px",
                            }}
                          >
                            description
                          </span>
                          <span style={{ color: "#cdd6f4", lineHeight: 1.6 }}>
                            {project.description || "No description provided."}
                          </span>
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                          <div className="flex gap-3 flex-wrap">
                            <span
                              className="shrink-0"
                              style={{
                                color: "#89dceb",
                                minWidth: "88px",
                              }}
                            >
                              tags
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded text-[10px]"
                                  style={{
                                    background: "#1e1e2e",
                                    border: "1px solid #313244",
                                    color: "#a6e3a1",
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Link */}
                        {hasLink && (
                          <div className="flex gap-3">
                            <span
                              className="shrink-0"
                              style={{
                                color: "#89dceb",
                                minWidth: "88px",
                              }}
                            >
                              link
                            </span>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:underline transition-all group"
                              style={{ color: "#89b4fa" }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="truncate">{project.link}</span>
                              <ExternalLink
                                size={10}
                                className="shrink-0 opacity-60 group-hover:opacity-100"
                              />
                            </a>
                          </div>
                        )}

                        {/* Index */}
                        <div className="flex gap-3">
                          <span
                            className="shrink-0"
                            style={{ color: "#89dceb", minWidth: "88px" }}
                          >
                            index
                          </span>
                          <span style={{ color: "#f9e2af" }}>
                            {idx + 1} of {projects.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="pl-1 mt-2" style={{ color: "#45475a" }}>
          {projects.length} director{projects.length === 1 ? "y" : "ies"}
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// SECTION: EXPERIENCE  (git log --graph)
// ─────────────────────────────────────────────
function ExperienceSection({ experience }: { experience: Experience[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  return (
    <Section command="git log --oneline --graph" path="~/portfolio">
      <div className="text-xs font-mono">
        {experience.map((exp, idx) => {
          const isHead = exp.isCurrent || idx === 0;
          const hash = hashStr(exp.id);
          const end = exp.isCurrent
            ? "Present"
            : `${exp.endMonth} ${exp.endYear}`;
          const start = `${exp.startMonth} ${exp.startYear}`;
          const isExpanded = expanded === exp.id;

          // Duration
          const startDate = new Date(`${exp.startMonth} 1, ${exp.startYear}`);
          const endDate = exp.isCurrent
            ? new Date()
            : new Date(`${exp.endMonth} 1, ${exp.endYear}`);
          let dm =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());
          if (dm < 0) dm = 0;
          const yrs = Math.floor(dm / 12);
          const mos = dm % 12;
          const duration =
            yrs === 0
              ? `${mos} mos`
              : mos === 0
              ? `${yrs} yr`
              : `${yrs} yr ${mos} mos`;

          return (
            <div key={exp.id} className="flex">
              {/* Graph column */}
              <div
                className="flex flex-col items-center shrink-0"
                style={{ width: "20px" }}
              >
                <div
                  style={{
                    color: isHead ? "#a6e3a1" : "#89b4fa",
                    fontSize: "12px",
                    lineHeight: "22px",
                    marginTop: "0px",
                  }}
                >
                  {isHead ? "●" : "○"}
                </div>
                {idx < experience.length - 1 && (
                  <div
                    style={{
                      width: "1px",
                      background: "#313244",
                      flex: 1,
                      minHeight: "12px",
                    }}
                  />
                )}
              </div>

              {/* Commit content */}
              <div
                className="ml-3 pb-5 flex-1 min-w-0"
                style={{ paddingTop: "1px" }}
              >
                {/* Commit header */}
                <div
                  className="flex items-center flex-wrap gap-x-2 gap-y-1 cursor-pointer group py-0.5"
                  onClick={() => toggle(exp.id)}
                >
                  <span style={{ color: "#f9e2af" }}>{hash}</span>

                  {isHead && (
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0"
                      style={{
                        background: "rgba(30,58,95,0.8)",
                        color: "#89b4fa",
                        border: "1px solid rgba(29,78,216,0.5)",
                      }}
                    >
                      HEAD → main
                    </span>
                  )}

                  <span style={{ color: "#cdd6f4" }}>
                    <span className="font-semibold">{exp.jobTitle}</span>
                    <span style={{ color: "#45475a" }}> @ </span>
                    <span style={{ color: "#89b4fa" }}>{exp.company}</span>
                  </span>

                  <ChevronDown
                    size={10}
                    className="ml-auto transition-transform duration-200 shrink-0"
                    style={{
                      color: "#45475a",
                      transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                    }}
                  />
                </div>

                {/* Commit metadata */}
                <div
                  className="text-[10px] space-x-1 pl-0 mt-0.5"
                  style={{ color: "#45475a" }}
                >
                  <span>Date:</span>
                  <span>{start}</span>
                  <span>—</span>
                  <span>{end}</span>
                  <span style={{ color: "#313244" }}>·</span>
                  <span style={{ color: "#585b70" }}>{duration}</span>
                  {exp.employmentType && (
                    <>
                      <span style={{ color: "#313244" }}>·</span>
                      <span style={{ color: "#6c7086" }}>
                        {exp.employmentType}
                      </span>
                    </>
                  )}
                  {exp.location && (
                    <>
                      <span style={{ color: "#313244" }}>·</span>
                      <span>{exp.location}</span>
                    </>
                  )}
                </div>

                {/* Expandable body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-2.5">
                        {exp.description && (
                          <p
                            className="text-xs leading-relaxed whitespace-pre-wrap"
                            style={{ color: "#a6adc8", maxWidth: "560px" }}
                          >
                            {exp.description}
                          </p>
                        )}
                        {exp.skills && (
                          <div className="flex flex-wrap gap-1.5">
                            {parseTags(exp.skills).map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded text-[10px]"
                                style={{
                                  background: "#1e1e2e",
                                  border: "1px solid #313244",
                                  color: "#cba6f7",
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// SECTION: SKILLS  (npm list --depth=1)
// ─────────────────────────────────────────────
function SkillsSection({ skills }: { skills: string }) {
  const allSkills = parseTags(skills);
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Section command="npm list --depth=1" path="~/portfolio">
      <div className="text-xs font-mono" style={{ color: "#a6adc8" }}>
        {/* Package root */}
        <div className="flex items-center gap-1.5 mb-1">
          <Package size={12} style={{ color: "#f9e2af", flexShrink: 0 }} />
          <span style={{ color: "#cdd6f4", fontWeight: 600 }}>portfolio</span>
          <span style={{ color: "#45475a" }}>@</span>
          <span style={{ color: "#f9e2af" }}>1.0.0</span>
          <span style={{ color: "#45475a" }}>/</span>
          <span style={{ color: "#585b70" }}>~/portfolio</span>
        </div>

        {/* Dependencies tree */}
        <div>
          <div
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity py-0.5 select-none"
            onClick={() => setIsOpen((o) => !o)}
          >
            <span style={{ color: "#45475a", fontSize: "9px" }}>
              {isOpen ? "▼" : "▶"}
            </span>
            <span style={{ color: "#89b4fa" }}>dependencies</span>
            <span style={{ color: "#45475a" }}>({allSkills.length})</span>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {allSkills.map((skill, idx) => {
                  const isLast = idx === allSkills.length - 1;
                  const prefix = isLast ? "└── " : "├── ";
                  const vMajor =
                    (parseInt(hashStr(skill), 16) % 9) + 1;
                  const vMinor =
                    (parseInt(hashStr(skill + "m"), 16) % 10);

                  return (
                    <div
                      key={idx}
                      className="t-row flex items-center py-[2px] pl-2 rounded"
                    >
                      <span style={{ color: "#313244" }}>{prefix}</span>
                      <span style={{ color: "#a6e3a1" }}>
                        {skill.toLowerCase().replace(/\s+/g, "-")}
                      </span>
                      <span style={{ color: "#45475a" }}>@</span>
                      <span style={{ color: "#89dceb" }}>
                        {vMajor}.{vMinor}.0
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-2" style={{ color: "#45475a" }}>
          {allSkills.length} package
          {allSkills.length !== 1 ? "s" : ""} listed
        </div>
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// SECTION: CONTACT  (contact --all)
// ─────────────────────────────────────────────
function ContactSection({ portfolio }: { portfolio: Portfolio }) {
  type ContactEntry = {
    key: string;
    flag: string;
    value: string;
    href: string;
    icon: React.ReactNode;
    isExternal: boolean;
  };

  const contacts: ContactEntry[] = [
    portfolio.email && {
      key: "email",
      flag: "--email",
      value: portfolio.email,
      href: `mailto:${portfolio.email}`,
      icon: <Mail size={11} />,
      isExternal: false,
    },
    portfolio.github && {
      key: "github",
      flag: "--github",
      value: portfolio.github,
      href: portfolio.github.startsWith("http")
        ? portfolio.github
        : `https://${portfolio.github}`,
      icon: <Github size={11} />,
      isExternal: true,
    },
    portfolio.linkedin && {
      key: "linkedin",
      flag: "--linkedin",
      value: portfolio.linkedin,
      href: portfolio.linkedin.startsWith("http")
        ? portfolio.linkedin
        : `https://${portfolio.linkedin}`,
      icon: <Linkedin size={11} />,
      isExternal: true,
    },
    portfolio.twitter && {
      key: "twitter",
      flag: "--twitter",
      value: portfolio.twitter,
      href: portfolio.twitter.startsWith("http")
        ? portfolio.twitter
        : `https://${portfolio.twitter}`,
      icon: <Twitter size={11} />,
      isExternal: true,
    },
  ].filter(Boolean) as ContactEntry[];

  return (
    <Section command="contact --all" path="~/portfolio">
      <div className="text-xs font-mono space-y-0.5">
        {contacts.map((c) => (
          <div
            key={c.key}
            className="t-contact-row flex items-center gap-3 px-2 py-2"
          >
            <span style={{ color: "#89dceb", minWidth: "100px" }}>
              {c.flag}
            </span>
            <span style={{ color: "#2e2e33" }}>│</span>
            <span
              className="flex items-center gap-1"
              style={{ color: "#585b70", minWidth: "16px" }}
            >
              {c.icon}
            </span>
            <a
              href={c.href}
              target={c.isExternal ? "_blank" : undefined}
              rel={c.isExternal ? "noopener noreferrer" : undefined}
              className="flex items-center gap-1 hover:underline transition-all group"
              style={{ color: "#89b4fa" }}
            >
              <span className="truncate">{c.value}</span>
              {c.isExternal && (
                <ExternalLink
                  size={9}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </a>
          </div>
        ))}

        {contacts.length === 0 && (
          <p style={{ color: "#45475a" }}>No contact information provided.</p>
        )}
      </div>
    </Section>
  );
}

// ─────────────────────────────────────────────
// SESSION HEADER  (login banner)
// ─────────────────────────────────────────────
function SessionHeader() {
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Date().toDateString());
  }, []);

  return (
    <div
      className="mb-8 text-xs select-none"
      style={{ color: "#313244", fontFamily: "'JetBrains Mono', monospace" }}
    >
      {date && <p style={{ color: "#45475a" }}>Last login: {date} on ttys001</p>}
      <p>
        ─────────────────────────────────────────────────────────────
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// DIVIDER
// ─────────────────────────────────────────────
function TermDivider() {
  return (
    <div
      className="mb-8 mt-2"
      style={{ borderTop: "1px solid #1e1e24" }}
    />
  );
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export default function RetroTerminal({ portfolio }: TemplateProps) {
  const clock = useLiveClock();
  const hasExperience = (portfolio.experience ?? []).length > 0;
  const hasProjects = (portfolio.projects ?? []).length > 0;

  return (
    <div
      className="t-root w-full min-h-screen relative overflow-x-hidden flex flex-col items-center"
      style={{
        background:
          "radial-gradient(ellipse at 35% 15%, #1a1a2e 0%, #0e0e17 45%, #0a0a0d 100%)",
        padding: "24px 16px",
      }}
    >
      {/* Inject styles */}
      <style dangerouslySetInnerHTML={{ __html: TERMINAL_STYLES }} />

      {/* Desktop grain overlay */}
      <div className="t-grain-layer" aria-hidden="true" />

      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-1/2 pointer-events-none"
        style={{
          transform: "translateX(-50%)",
          width: "700px",
          height: "280px",
          background:
            "radial-gradient(ellipse, rgba(89,180,250,0.05) 0%, transparent 70%)",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* ── Terminal Window ── */}
      <div
        className="t-window relative z-10 w-full flex flex-col overflow-hidden"
        style={{
          maxWidth: "940px",
          borderRadius: "12px",
          border: "1px solid #2a2a2e",
          background: "#1c1c1f",
          boxShadow: [
            "0 40px 100px rgba(0,0,0,0.75)",
            "0 12px 40px rgba(0,0,0,0.55)",
            "0 0 0 0.5px rgba(255,255,255,0.06) inset",
          ].join(", "),
        }}
      >
        <TitleBar clock={clock} />
        <TabBar />

        {/* Scrollable terminal body */}
        <div
          className="t-scroll flex-1 overflow-y-auto"
          style={{
            background: "#1c1c1f",
            maxHeight: "calc(100vh - 180px)",
            minHeight: "420px",
          }}
        >
          <div className="px-6 py-6">
            <SessionHeader />

            {/* HERO */}
            <HeroSection portfolio={portfolio} />

            <TermDivider />

            {/* ABOUT */}
            {portfolio.about && <AboutSection about={portfolio.about} />}

            {/* PROJECTS */}
            {hasProjects && (
              <ProjectsSection projects={portfolio.projects} />
            )}

            {/* EXPERIENCE */}
            {hasExperience && (
              <ExperienceSection experience={portfolio.experience!} />
            )}

            {/* SKILLS */}
            {portfolio.skills && (
              <SkillsSection skills={portfolio.skills} />
            )}

            {/* CONTACT */}
            <ContactSection portfolio={portfolio} />

            {/* Final blinking prompt */}
            <div className="mt-10 flex items-center text-sm font-mono">
              <Prompt />
              <span className="t-cursor" />
            </div>
          </div>
        </div>

        <StatusBar />
      </div>
    </div>
  );
}
