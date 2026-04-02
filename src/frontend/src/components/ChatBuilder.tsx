import {
  ArrowLeft,
  Bot,
  Check,
  Download,
  ExternalLink,
  Monitor,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  type ColorPalette,
  type Niche,
  detectNiche,
  nicheLabels,
  nichePalettes,
} from "../data/nicheData";
import WebsitePreview from "./chat/WebsitePreview";

interface ChatBuilderProps {
  onBack: () => void;
}

interface Message {
  id: string;
  role: "bot" | "user";
  content: string;
  quickReplies?: string[];
  paletteOptions?: ColorPalette[];
  timestamp: number;
}

type ChatPhase =
  | "initial_prompt"
  | "follow_up_contact"
  | "follow_up_name"
  | "awaiting_palette"
  | "done";

export interface CollectedData {
  nicheInput: string;
  niche: Niche | null;
  businessName: string;
  tagline: string;
  services: string[];
  answers: Record<string, string>;
  contactForm: boolean | null;
  palette: ColorPalette | null;
}

function genId() {
  return Math.random().toString(36).slice(2);
}

// ── Smart intent parser ──────────────────────────────────────────────────────

interface ParsedIntent {
  businessName: string;
  tagline: string;
  niche: Niche;
  services: string[];
  contactWanted: boolean | null;
}

function parseIntent(input: string): ParsedIntent {
  const raw = input.trim();
  const text = raw.toLowerCase();

  // Business name extraction
  let businessName = "";
  const namePatterns: RegExp[] = [
    /(?:called|named|name[d]?\s+is|it's called|its name is)\s+["']?([A-Za-z0-9 &'.\\-]+?)["']?(?:\s*[,.]|\s+(?:that|which|a site|a website|for|and)|$)/i,
    /"([A-Za-z0-9 &'.\\-]+)"/,
    /\bmy\s+(?:business|company|brand|studio|agency|firm|shop|store|platform|app)\s+(?:is called|is named|called|named)?\s*["']?([A-Za-z0-9 &'.\\-]+)["']?/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+(?:is|—|–|-)/,
  ];
  for (const pat of namePatterns) {
    const m = raw.match(pat);
    if (m?.[1] && m[1].length < 40) {
      businessName = m[1].trim();
      break;
    }
  }

  // Tagline extraction
  let tagline = "";
  const taglinePatterns: RegExp[] = [
    /(?:a site|a website|site|website|platform|app)\s+(?:that|which|to)\s+(.+?)(?:\.|$)/i,
    /(?:that helps|to help|helping|offering|focused on|specializes?\s+in|dedicated to)\s+(.+?)(?:\.|,|$)/i,
    /[–—]\s*(.+?)(?:\.|$)/,
  ];
  for (const pat of taglinePatterns) {
    const m = raw.match(pat);
    if (m?.[1] && m[1].length > 5 && m[1].length < 120) {
      const t = m[1].trim();
      tagline = t.charAt(0).toUpperCase() + t.slice(1);
      break;
    }
  }
  if (!tagline && raw.length < 80) {
    tagline = raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  // Niche detection
  const niche = detectNiche(text);

  // Services extraction
  const serviceKeywords = [
    "training",
    "coaching",
    "consulting",
    "development",
    "design",
    "photography",
    "delivery",
    "catering",
    "therapy",
    "tutoring",
    "lessons",
    "repairs",
    "installation",
    "booking",
    "classes",
    "workshops",
    "courses",
    "sessions",
  ];
  const services: string[] = [];
  for (const kw of serviceKeywords) {
    if (text.includes(kw)) {
      services.push(kw.charAt(0).toUpperCase() + kw.slice(1));
    }
  }

  // Contact intent
  let contactWanted: boolean | null = null;
  if (/\b(contact|form|reach|email|message|get in touch|inquir)\b/.test(text))
    contactWanted = true;
  if (/\b(no contact|skip contact|no form|without contact)\b/.test(text))
    contactWanted = false;

  return { businessName, tagline, niche, services, contactWanted };
}

// ── HTML generator ───────────────────────────────────────────────────────────

function generateHTML(data: CollectedData): string {
  const palette = data.palette;
  const primary = palette?.colors[0] ?? "#0B1F33";
  const accent = palette?.colors[1] ?? "#39C6C6";
  const bg = palette?.colors[2] ?? "#FFFFFF";
  const name = data.businessName || "My Project";
  const tagline = data.tagline || "Welcome — we're glad you're here";
  const services =
    data.services.length > 0
      ? data.services.slice(0, 4)
      : ["Expert Service", "Quality Work", "Fast Delivery", "Customer First"];

  const serviceCards = services
    .map(
      (s) =>
        `<div class="card"><div class="card-icon">✦</div><h3>${s}</h3><p>We bring passion, skill, and precision to every ${s.toLowerCase()} — because you deserve the best.</p></div>`,
    )
    .join("");

  const contactSection =
    data.contactForm !== false
      ? `<section class="contact-section" id="contact">
  <div class="contact-inner">
    <h2>Get In Touch</h2>
    <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
    <form class="form" onsubmit="event.preventDefault();this.innerHTML='<p style=padding:20px;color:${accent};font-weight:600;font-size:1.1rem>✓ Message sent! We\\'ll be in touch soon.</p>'">
      <input placeholder="Your Name" required />
      <input type="email" placeholder="Email Address" required />
      <textarea rows="4" placeholder="How can we help?"></textarea>
      <button type="submit">Send Message</button>
    </form>
  </div>
</section>`
      : "";

  const contactNav =
    data.contactForm !== false ? '<a href="#contact">Contact</a>' : "";
  const contactCta =
    data.contactForm !== false
      ? `<a class="btn-secondary" href="#contact">Contact Us</a>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${name}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
html{scroll-behavior:smooth}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:${bg};color:#1a1a1a}
nav{position:sticky;top:0;background:${primary};padding:16px 40px;display:flex;align-items:center;justify-content:space-between;z-index:100;box-shadow:0 2px 20px rgba(0,0,0,0.3)}
nav .logo{color:white;font-weight:800;font-size:1.2rem;letter-spacing:-0.02em}
nav .nav-links{display:flex;gap:24px}
nav a{color:rgba(255,255,255,0.75);text-decoration:none;font-size:0.9rem;font-weight:500;transition:color 0.2s}
nav a:hover{color:${accent}}
.hero{background:linear-gradient(135deg,${primary} 0%,${primary}cc 60%,${accent}44 100%);color:white;padding:100px 40px 80px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,${accent}22 0%,transparent 70%);pointer-events:none}
.hero h1{font-size:clamp(2.2rem,5vw,3.8rem);font-weight:900;line-height:1.1;letter-spacing:-0.03em;margin-bottom:20px;position:relative}
.hero p{font-size:1.2rem;opacity:0.8;margin-bottom:40px;max-width:560px;margin-left:auto;margin-right:auto;line-height:1.6;position:relative}
.cta-group{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative}
.btn-primary{background:${accent};color:${primary};padding:16px 36px;border-radius:100px;font-weight:700;font-size:1rem;text-decoration:none;display:inline-block;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 4px 24px ${accent}55}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 32px ${accent}77}
.btn-secondary{background:transparent;color:white;padding:16px 32px;border-radius:100px;font-weight:600;font-size:1rem;text-decoration:none;display:inline-block;border:2px solid rgba(255,255,255,0.3);transition:border-color 0.2s}
.btn-secondary:hover{border-color:rgba(255,255,255,0.7)}
.section{padding:80px 40px;max-width:1100px;margin:0 auto}
.section-label{font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:${accent};margin-bottom:12px}
.section h2{font-size:clamp(1.8rem,3.5vw,2.6rem);font-weight:800;letter-spacing:-0.02em;color:${primary};margin-bottom:48px;line-height:1.2}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}
.card{background:white;border:1px solid #eef0f4;border-radius:16px;padding:32px;transition:transform 0.2s,box-shadow 0.2s}
.card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,0.1)}
.card-icon{font-size:1.5rem;color:${accent};margin-bottom:12px}
.card h3{font-size:1.1rem;font-weight:700;color:${primary};margin-bottom:10px}
.card p{color:#64748b;font-size:0.9rem;line-height:1.6}
.about{background:${primary};color:white;padding:80px 40px;text-align:center}
.about h2{font-size:2rem;font-weight:800;margin-bottom:16px}
.about p{opacity:0.75;max-width:560px;margin:0 auto;font-size:1rem;line-height:1.7}
.contact-section{padding:80px 40px;background:#f8fafc}
.contact-inner{max-width:520px;margin:0 auto;text-align:center}
.contact-inner h2{font-size:2rem;font-weight:800;color:${primary};margin-bottom:8px}
.contact-inner p{color:#64748b;margin-bottom:32px;line-height:1.6}
.form{display:flex;flex-direction:column;gap:14px;text-align:left}
.form input,.form textarea{padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:12px;font-size:0.95rem;font-family:inherit;transition:border-color 0.2s;outline:none}
.form input:focus,.form textarea:focus{border-color:${accent};box-shadow:0 0 0 3px ${accent}22}
.form button{background:${primary};color:white;padding:15px;border-radius:12px;font-weight:700;font-size:1rem;border:none;cursor:pointer;transition:background 0.2s}
.form button:hover{background:${accent};color:${primary}}
footer{background:${primary};color:rgba(255,255,255,0.6);text-align:center;padding:28px 40px;font-size:0.85rem}
footer strong{color:white}
@media(max-width:640px){.hero{padding:70px 20px 60px}.section{padding:60px 20px}nav{padding:14px 20px}}
</style>
</head>
<body>
<nav>
  <span class="logo">${name}</span>
  <div class="nav-links">
    <a href="#services">Services</a>
    ${contactNav}
  </div>
</nav>
<section class="hero">
  <h1>${name}</h1>
  <p>${tagline}</p>
  <div class="cta-group">
    <a class="btn-primary" href="#services">Get Started</a>
    ${contactCta}
  </div>
</section>
<section class="section" id="services">
  <div class="section-label">What We Do</div>
  <h2>Our Services</h2>
  <div class="cards">${serviceCards}</div>
</section>
<section class="about">
  <h2>Why Choose ${name}?</h2>
  <p>We combine expertise, creativity, and dedication to deliver results that exceed expectations. Every project is handled with care from start to finish.</p>
</section>
${contactSection}
<footer><p>&copy; ${new Date().getFullYear()} <strong>${name}</strong>. All rights reserved.</p></footer>
</body>
</html>`;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ChatBuilder({ onBack }: ChatBuilderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<ChatPhase>("initial_prompt");
  const [data, setData] = useState<CollectedData>({
    nicheInput: "",
    niche: null,
    businessName: "",
    tagline: "",
    services: [],
    answers: {},
    contactForm: null,
    palette: null,
  });
  const [quickRepliesUsed, setQuickRepliesUsed] = useState<Set<string>>(
    new Set(),
  );
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setTimeout(() => {
      addBotMessage(
        "Hey! Tell me what you want to build — a website, an app, a portfolio, a store, anything. Even one sentence is enough to get started.",
      );
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addBotMessage(
    content: string,
    quickReplies?: string[],
    paletteOptions?: ColorPalette[],
  ) {
    setMessages((prev) => [
      ...prev,
      {
        id: genId(),
        role: "bot",
        content,
        quickReplies,
        paletteOptions,
        timestamp: Date.now(),
      },
    ]);
  }

  function addUserMessage(content: string) {
    setMessages((prev) => [
      ...prev,
      { id: genId(), role: "user", content, timestamp: Date.now() },
    ]);
  }

  function botRespond(
    content: string,
    quickReplies?: string[],
    paletteOptions?: ColorPalette[],
  ) {
    setIsTyping(true);
    setTimeout(
      () => {
        setIsTyping(false);
        addBotMessage(content, quickReplies, paletteOptions);
      },
      700 + Math.random() * 500,
    );
  }

  function showPalettes(currentData: CollectedData) {
    setPhase("awaiting_palette");
    const niche = currentData.niche ?? "general";
    const palettes = nichePalettes[niche];
    const nicheLabel = nicheLabels[niche];
    botRespond(
      `That's enough for me. Last step — pick a color palette for **${currentData.businessName || "your site"}**. These are curated for **${nicheLabel}**:`,
      undefined,
      palettes,
    );
  }

  function handleSend(text?: string) {
    const value = (text ?? inputValue).trim();
    if (!value) return;
    setInputValue("");
    addUserMessage(value);
    processMessage(value);
    inputRef.current?.focus();
  }

  function handleQuickReply(reply: string, msgId: string) {
    if (quickRepliesUsed.has(msgId)) return;
    setQuickRepliesUsed((prev) => new Set(prev).add(msgId));
    handleSend(reply);
  }

  function handlePaletteSelect(palette: ColorPalette, msgId: string) {
    if (quickRepliesUsed.has(msgId)) return;
    setQuickRepliesUsed((prev) => new Set(prev).add(msgId));
    setData((prev) => ({ ...prev, palette }));
    addUserMessage(`I'll go with "${palette.name}"`);
    setPhase("done");
    botRespond(
      `**${palette.name}** — great choice. Your site is ready. Check the preview on the right, then open or download it anytime.`,
    );
  }

  function processMessage(value: string) {
    if (phase === "initial_prompt") {
      const intent = parseIntent(value);
      const nextData: CollectedData = {
        ...data,
        nicheInput: value,
        niche: intent.niche,
        businessName: intent.businessName,
        tagline: intent.tagline,
        services: intent.services,
        contactForm: intent.contactWanted,
      };
      setData(nextData);

      const hasName = !!intent.businessName;
      const hasContact = intent.contactWanted !== null;
      const nicheLabel = nicheLabels[intent.niche];

      if (hasName && hasContact) {
        const contactAck = intent.contactWanted
          ? " I'll include a contact form."
          : " Keeping it clean — no contact form.";
        botRespond(
          `Got it — **${intent.businessName}** (${nicheLabel}).${contactAck} Nice, I can already see this coming together. Let me grab a color choice and I'll build it.`,
        );
        setTimeout(() => showPalettes(nextData), 1800);
      } else if (hasName) {
        setPhase("follow_up_contact");
        botRespond(
          `Got it — **${intent.businessName}** (${nicheLabel}). One quick thing that makes a real difference: do you want visitors to contact you directly through the site?`,
          ["Yes, add a contact form", "No, keep it clean"],
        );
      } else {
        setPhase("follow_up_name");
        botRespond(
          `Love this idea — a **${nicheLabel}** site. Quick one: what do you want to call it? Just give me a name and I'll run with it.`,
        );
      }
      return;
    }

    if (phase === "follow_up_name") {
      const updatedData = { ...data, businessName: value };
      setData(updatedData);

      if (data.contactForm === null) {
        setPhase("follow_up_contact");
        botRespond(
          `Perfect — **${value}**. One last thing: do you want a contact form so visitors can reach you?`,
          ["Yes, add a contact form", "No, keep it clean"],
        );
      } else {
        showPalettes(updatedData);
      }
      return;
    }

    if (phase === "follow_up_contact") {
      const lower = value.toLowerCase();
      const wants = /yes|contact|form|add/.test(lower);
      const updatedData = { ...data, contactForm: wants };
      setData(updatedData);
      showPalettes(updatedData);
      return;
    }
  }

  function handleDownload() {
    const html = generateHTML(data);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.businessName || "my-project"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleOpenWebsite() {
    const html = generateHTML(data);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  const previewReady = !!data.businessName;

  return (
    <div
      className="flex flex-col h-screen bg-[#0a0a0f] font-inter"
      data-ocid="chat_builder.panel"
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-3 bg-[#111118] border-b border-white/10 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            data-ocid="chat_builder.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#39C6C6] to-[#2BA8A8] flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#0a0a0f]" />
            </div>
            <span className="font-bold text-white text-sm">
              NicheBuilder <span className="text-[#39C6C6]">AI</span>
            </span>
          </div>
        </div>
        {phase === "done" && (
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold bg-[#39C6C6] text-[#0a0a0f] hover:bg-[#2BA8A8] transition-colors"
            data-ocid="chat_builder.download.button"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download HTML</span>
          </button>
        )}
      </header>

      {/* Split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat pane */}
        <div
          className="flex flex-col w-full md:w-[42%] lg:w-[40%] bg-[#111118] border-r border-white/10 shrink-0"
          data-ocid="chat_builder.chat.panel"
        >
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      msg.role === "bot"
                        ? "bg-[#39C6C6]/20 text-[#39C6C6] border border-[#39C6C6]/30"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {msg.role === "bot" ? (
                      <Bot className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div
                    className={`flex flex-col gap-2 max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "bot"
                          ? "bg-[#1e1e2e] text-gray-100 rounded-tl-sm"
                          : "bg-[#39C6C6] text-[#0a0a0f] rounded-tr-sm font-medium"
                      }`}
                    >
                      <BubbleContent content={msg.content} />
                    </div>

                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.quickReplies.map((r) => (
                          <button
                            type="button"
                            key={r}
                            onClick={() => handleQuickReply(r, msg.id)}
                            disabled={quickRepliesUsed.has(msg.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                              quickRepliesUsed.has(msg.id)
                                ? "border-white/10 text-white/20 cursor-default"
                                : "border-[#39C6C6]/50 text-[#39C6C6] hover:bg-[#39C6C6] hover:text-[#0a0a0f] cursor-pointer"
                            }`}
                            data-ocid="chat_builder.quick_reply.button"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.paletteOptions && msg.paletteOptions.length > 0 && (
                      <div className="flex flex-col gap-2 w-full">
                        {msg.paletteOptions.map((palette) => (
                          <button
                            type="button"
                            key={palette.name}
                            onClick={() => handlePaletteSelect(palette, msg.id)}
                            disabled={quickRepliesUsed.has(msg.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all bg-[#1a1a28] ${
                              quickRepliesUsed.has(msg.id)
                                ? "border-white/10 opacity-50 cursor-default"
                                : data.palette?.name === palette.name
                                  ? "border-[#39C6C6] bg-[#39C6C6]/5"
                                  : "border-white/15 hover:border-[#39C6C6] cursor-pointer"
                            }`}
                            data-ocid="chat_builder.palette.button"
                          >
                            <div className="flex gap-1 shrink-0">
                              {palette.colors.slice(0, 5).map((c, ci) => (
                                <div
                                  key={`${palette.name}-${ci}`}
                                  className="w-5 h-5 rounded-full border border-white/20"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-100 truncate">
                                {palette.name}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {palette.description}
                              </p>
                            </div>
                            {data.palette?.name === palette.name && (
                              <Check className="w-4 h-4 text-[#39C6C6] ml-auto shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2.5"
                data-ocid="chat_builder.loading_state"
              >
                <div className="w-7 h-7 rounded-full bg-[#39C6C6]/20 border border-[#39C6C6]/30 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#39C6C6]" />
                </div>
                <div className="bg-[#1e1e2e] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="px-4 py-4 border-t border-white/10 bg-[#111118] shrink-0">
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 flex gap-2"
              >
                <button
                  type="button"
                  onClick={handleOpenWebsite}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#39C6C6] text-[#0a0a0f] hover:bg-[#2BA8A8] transition-colors"
                  data-ocid="chat_builder.open_website.button"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Website
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-white/15 text-gray-300 hover:border-[#39C6C6] hover:text-[#39C6C6] transition-colors"
                  data-ocid="chat_builder.download_bottom.button"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </motion.div>
            )}
            <div className="flex items-center gap-2 bg-[#1a1a28] rounded-xl px-4 py-2.5 border border-white/10 focus-within:border-[#39C6C6] transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={
                  phase === "done"
                    ? "Site generated! ✓"
                    : "Describe your idea..."
                }
                disabled={phase === "done" || isTyping}
                className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-500 outline-none disabled:cursor-not-allowed"
                data-ocid="chat_builder.input"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || phase === "done" || isTyping}
                className="w-8 h-8 rounded-lg bg-[#39C6C6] flex items-center justify-center hover:bg-[#2BA8A8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                data-ocid="chat_builder.send.button"
              >
                <Send className="w-3.5 h-3.5 text-[#0a0a0f]" />
              </button>
            </div>
            <p className="text-[11px] text-gray-600 mt-1.5 pl-1">
              Press Enter to send
            </p>
          </div>
        </div>

        {/* Right: Preview pane */}
        <div className="hidden md:flex flex-col flex-1 bg-[#0d0d16]">
          <div className="flex items-center justify-between px-5 py-3 bg-[#111118] border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-300">
                Live Preview
              </span>
              {data.businessName && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#39C6C6]/20 text-[#39C6C6]">
                  {data.businessName}
                </span>
              )}
            </div>
            {phase === "done" && (
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#39C6C6] text-[#0a0a0f] hover:bg-[#2BA8A8] transition-colors"
                data-ocid="preview.download.button"
              >
                <Download className="w-3.5 h-3.5" />
                Download HTML
              </button>
            )}
          </div>

          <div className="flex-1 overflow-auto p-6">
            {!previewReady ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full gap-4 text-center"
                data-ocid="preview.empty_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#1e1e2e] border border-white/10 flex items-center justify-center">
                  <Monitor className="w-7 h-7 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-400 mb-1">
                    Your site will appear here
                  </h3>
                  <p className="text-sm text-gray-600">
                    Describe your idea on the left to get started
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  {["a", "b", "c"].map((key, i) => (
                    <div
                      key={key}
                      className="w-2 h-2 rounded-full bg-white/15 animate-pulse"
                      style={{ animationDelay: `${(i + 1) * 200}ms` }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <WebsitePreview data={data} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BubbleContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="whitespace-pre-line">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static parse fragments
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: static parse fragments
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  );
}
