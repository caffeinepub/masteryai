import { Button } from "@/components/ui/button";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { useChatWithAI } from "../hooks/useQueries";
import {
  type TopicContent,
  searchWikipediaForAnswer,
} from "../lib/topicFallback";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

// -----------------------------------------------------------------------
// Deep knowledge base — precise answers for common follow-up questions
// -----------------------------------------------------------------------
const DEEP_KNOWLEDGE: Record<string, string> = {
  "wave-particle duality": `Wave-particle duality is one of the central discoveries of quantum mechanics. It means every quantum entity — electrons, photons, even atoms — behaves as both a wave AND a particle, depending on how you observe it.

The double-slit experiment is the definitive proof:
• Fire electrons one at a time at a wall with two slits
• Without a detector: you get an interference pattern — the electron passes through BOTH slits as a wave simultaneously
• Add a detector to watch which slit: the interference pattern immediately disappears. The wave collapses to a particle at one location.

This isn't a measurement problem. The quantum object genuinely has no single definite nature until observation forces one. Quantum physics doesn't just describe duality — it is the only framework that explains it mathematically through the wave function ψ and Born's rule.`,

  duality: `In quantum physics, duality means quantum objects like electrons and photons exhibit properties of both waves and particles. When unobserved, they spread out as probability waves. When measured, they collapse to definite particle positions.

The double-slit experiment proves this: a single electron creates an interference pattern (wave) when no detector watches, but travels through one slit (particle) when observed. The observation itself changes the outcome.

Quantum physics models duality through the wave function ψ — the Schrödinger equation governs its evolution, and Born's rule converts it to probabilities of finding the particle at any location.`,

  superposition: `Superposition: a quantum system exists in all possible states simultaneously until measured. Not "we don't know which state" — it genuinely occupies all states at once.

Schrödinger's cat: a cat in a sealed box with a radioactive atom is simultaneously alive AND dead until you open the box. The quantum state is a superposition of both outcomes.

In quantum computing: a qubit in superposition is both 0 and 1 simultaneously. This allows a quantum computer to evaluate all possible solutions at once for certain problems — the source of quantum speedup.`,

  entanglement: `Quantum entanglement: two particles share a quantum state. Measuring one instantly determines the other's state, regardless of distance — no signal is sent.

Einstein rejected this as "spooky action at a distance," proposing hidden variable theories instead. Bell's theorem (1964) and Aspect's experiments (1982) proved Einstein wrong. Entanglement is real.

Applications: quantum cryptography (perfectly secure keys), quantum teleportation (state transfer, not matter), quantum computing speedups.`,

  uncertainty: `Heisenberg Uncertainty Principle: Δx · Δp ≥ ℏ/2.

The more precisely you know position, the less precisely you know momentum — and this has a hard mathematical floor. This is NOT about imprecise instruments. It's fundamental.

Why: position and momentum are Fourier transform pairs. A perfectly defined position requires a superposition of infinitely many momenta. A single definite momentum is a wave spread across all space. Both cannot coexist mathematically.`,

  tunneling: `Quantum tunneling: a particle passes through a potential energy barrier it classically cannot cross. The wave function decays inside the barrier but remains nonzero on the other side — giving a nonzero probability of transmission.

Applications everywhere:
• Flash memory (USB drives, SSDs) — electrons tunnel through insulating layers to write data
• Scanning tunneling microscopes — image individual atoms using tunneling current
• Nuclear fusion in the Sun — protons tunnel through the Coulomb barrier at temperatures too low to classically overcome it`,

  "linear motion": `Linear motion is movement along a straight line. The foundation of classical mechanics.

Key definitions:
• Displacement: straight-line change in position (vector)
• Velocity: displacement/time (vector) — different from speed (scalar)
• Acceleration: change in velocity/time (vector)

SUVAT equations for constant acceleration:
1. v = u + at
2. s = ut + ½at²
3. v² = u² + 2as

Example: Ball dropped from rest (u=0) from 20m, a=9.8 m/s²:
Time to hit: t = √(2s/a) = √(40/9.8) = 2.02 s
Final speed: v = at = 9.8 × 2.02 = 19.8 m/s`,

  suvat: `SUVAT equations describe motion with constant acceleration:

1. v = u + at (no displacement)
2. s = ut + ½at² (no final velocity)
3. v² = u² + 2as (no time)
4. s = ½(u + v)t (no acceleration)

Variables: s = displacement, u = initial velocity, v = final velocity, a = acceleration, t = time.

You need 3 known variables to find the other 2.

Example: Car at 30 m/s brakes at 6 m/s². Stopping distance?
v=0, u=30, a=-6: 0 = 900 - 12s → s = 75 m`,

  "free fall": `Free fall: an object moving under gravity only (no air resistance). All objects fall at the same rate regardless of mass — Galileo proved this by dropping objects from the Leaning Tower of Pisa.

On Earth: g = 9.8 m/s² downward.

From rest: v = gt, s = ½gt², v² = 2gs

From 20 m: t = √(40/9.8) = 2.02 s, final speed = 19.8 m/s
From 100 m: t = √(200/9.8) = 4.52 s, final speed = 44.3 m/s`,

  refraction: `Refraction: light bends when passing from one medium to another with a different refractive index.

Snell's Law: n₁ sinθ₁ = n₂ sinθ₂

Why: light slows in denser media (v = c/n). The wavefront bends because one side slows first.

Examples:
• Straw looks bent in water: light bends at the water-air boundary entering your eye
• Rainbows: different colors refract at slightly different angles through raindrops
• Eyeglasses/camera lenses: controlled refraction to focus light
• Total internal reflection (in fiber optics): when angle exceeds critical angle, light bounces back instead of escaping`,

  reflection: `Law of reflection: angle of incidence = angle of reflection (measured from the normal).

Specular reflection (smooth surfaces like mirrors): preserves image.
Diffuse reflection (rough surfaces): scatters light in all directions — how most objects are visible.

Color: objects absorb certain wavelengths and reflect others. A red apple reflects ~700nm (red) and absorbs blue/green. The color you see is what's reflected.`,

  "what is light": `Light is electromagnetic radiation — oscillating coupled electric and magnetic fields propagating through space.

At the quantum level: also a stream of photons (massless particles). Energy E = hf, where h = Planck's constant and f = frequency.

Speed in vacuum: c = 3 × 10⁸ m/s — the universal speed limit.
In a medium: v = c/n (slows down, causes refraction).

Visible light: 380 nm (violet) to 700 nm (red) — a tiny slice of the EM spectrum.
Full spectrum: radio → microwave → infrared → visible → UV → X-ray → gamma ray`,

  "speed of light": `c = 299,792,458 m/s exactly in vacuum. This is a defined constant — the meter is defined in terms of it.

In a medium: v = c/n. In water (n=1.33): v ≈ 225,000 km/s.
In glass (n=1.5): v ≈ 200,000 km/s.

Finiteness of c means: the Sun's light takes 8 min 20 s to reach Earth. The nearest star's light: 4.2 years. We see the cosmic microwave background from 380,000 years after the Big Bang.

Special relativity: c is the same for all observers regardless of their motion. This forces time dilation and length contraction.`,

  photosynthesis: `Photosynthesis: plants convert light energy into chemical energy (glucose).

Overall equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂

Two stages:
1. Light reactions (thylakoids): light splits water → releases O₂, produces ATP + NADPH
2. Calvin cycle (stroma): CO₂ is fixed using ATP + NADPH → builds glucose via RuBisCO enzyme

Chlorophyll absorbs red (~670 nm) and blue (~430 nm) light, reflects green (why plants look green).

Phytoplankton in oceans produce ~50% of Earth's oxygen.`,

  "natural selection": `Natural selection is the mechanism of evolution:

1. Variation: individuals differ in heritable traits
2. Differential reproduction: some variants survive and reproduce better than others
3. Inheritance: traits passed to offspring

Result: beneficial traits accumulate across generations; harmful ones decrease.

Classic example: antibiotic resistance. Bacteria exposed to antibiotic — most die, but resistant mutants survive and reproduce. Within days, the population is dominated by resistant bacteria. Evolution in real time.`,

  "ohms law": `Ohm's Law: V = IR

V = voltage (volts), I = current (amperes), R = resistance (ohms).

Think of it like water in a pipe: voltage is pressure, current is flow rate, resistance is pipe narrowness.

Examples:
• 12V battery, 4Ω resistor: I = 12/4 = 3A
• 230V socket, 23Ω heater element: I = 230/23 = 10A

Power: P = IV = I²R = V²/R
A 60W bulb at 230V draws: I = 60/230 = 0.26A`,

  "newtons laws": `Newton's Three Laws of Motion:

1st Law (Inertia): An object at rest stays at rest; an object in motion stays in motion at constant velocity — unless a net force acts on it. Explains why you feel pushed back when a car accelerates.

2nd Law: F = ma. Net force = mass × acceleration. More force → more acceleration. More mass → less acceleration for the same force.

3rd Law: Every action has an equal and opposite reaction. You push the ground backward — the ground pushes you forward. A rocket expels gas downward — thrust pushes rocket upward.`,
};

function findKnowledge(question: string): string | null {
  const q = question.toLowerCase();
  for (const [key, answer] of Object.entries(DEEP_KNOWLEDGE)) {
    if (q.includes(key)) return answer;
  }
  // Fuzzy match on key words
  for (const [key, answer] of Object.entries(DEEP_KNOWLEDGE)) {
    const words = key.split(" ");
    const matchCount = words.filter(
      (w) => w.length > 3 && q.includes(w),
    ).length;
    if (matchCount >= Math.ceil(words.length * 0.6) && matchCount > 0)
      return answer;
  }
  return null;
}

function buildContextAnswer(
  topic: string,
  question: string,
  topicContent: TopicContent | undefined,
): string | null {
  if (!topicContent) return null;
  const q = question.toLowerCase();
  const topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);

  // Match concept in topic content
  for (const concept of topicContent.concepts) {
    const cTitle = concept.title.toLowerCase();
    const words = cTitle.split(/\s+/).filter((w) => w.length > 3);
    const matchCount = words.filter((w) => q.includes(w)).length;
    if (
      matchCount >= 1 &&
      (q.includes(cTitle) || matchCount >= Math.ceil(words.length * 0.5))
    ) {
      return `**${concept.title}** — within ${topicCap}:\n\n${concept.description}\n\nThis is a core principle of ${topicCap}. Want me to go deeper or explore how it connects to another concept?`;
    }
  }

  // Match example
  for (const ex of topicContent.examples) {
    const eTitle = ex.title.toLowerCase();
    if (
      q.includes(eTitle) ||
      eTitle.split(" ").some((w) => w.length > 4 && q.includes(w))
    ) {
      return `**${ex.title}**\n\n${ex.explanation}\n\nThis example shows ${topicCap} in practice. Want more examples or a deeper explanation of the underlying principle?`;
    }
  }

  // Formula/equation questions
  if (
    q.includes("formula") ||
    q.includes("equation") ||
    q.includes("calculate") ||
    q.includes("math")
  ) {
    if (topicContent.keyFacts.length > 0) {
      return `Key formulas and facts for ${topicCap}:\n\n${topicContent.keyFacts.map((f) => `\u2022 ${f}`).join("\n")}\n\nWant me to explain how to use any of these?`;
    }
  }

  // Definition questions
  if (
    q.includes("what is") ||
    q.includes("what are") ||
    q.includes("define") ||
    q.includes("meaning")
  ) {
    const firstPara = topicContent.intro.split("\n")[0];
    return `${firstPara}\n\n${topicContent.intro.split("\n").slice(1, 3).join("\n")}\n\nWant me to explore any specific aspect in more depth?`;
  }

  // How does it work
  if (
    q.includes("how does") ||
    q.includes("how do") ||
    q.includes("mechanism") ||
    q.includes("work")
  ) {
    if (topicContent.concepts.length > 0) {
      const c = topicContent.concepts[0];
      return `Here's how ${topicCap} works at its core:\n\n${c.description}\n\n${topicContent.deepDive ? `${topicContent.deepDive.split(".")[0]}.` : ""}\n\nWant me to trace a specific step in more detail?`;
    }
  }

  return null;
}

function buildSmartAnswer(topic: string, question: string): string {
  const topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);
  const q = question.toLowerCase();

  if (
    q.includes("example") ||
    q.includes("show me") ||
    q.includes("demonstrate")
  ) {
    return `A concrete example of ${topicCap}:\n\n${topicCap} principles are observable in everyday life. The key insight is that once you understand the core rule, examples stop being coincidences and start being inevitable.\n\nCould you specify a domain? (Physics, biology, technology, economics, medicine) That lets me give you a much more targeted example.`;
  }

  if (q.includes("why") || q.includes("important") || q.includes("matter")) {
    return `${topicCap} matters because:\n\n\u2022 Intellectual: it explains a class of phenomena that seem unrelated until you see the underlying pattern\n\u2022 Practical: technologies and systems built on ${topicCap} are used billions of times daily\n\u2022 Professional: deep knowledge compounds — mastering ${topic} makes adjacent subjects easier\n\nThe biggest reason: understanding ${topicCap} changes how you reason about the world.`;
  }

  if (
    q.includes("history") ||
    q.includes("who") ||
    q.includes("discovered") ||
    q.includes("invented")
  ) {
    return `The history of ${topicCap} involves key figures who built on each other's work across decades.\n\nFor precise historical details, I'd recommend checking Wikipedia or a textbook — I want to give you accurate dates and names, not guesses.\n\nWant me to explain the current scientific understanding of ${topicCap} instead?`;
  }

  return `That's a precise question about ${topicCap}. Let me give you the most accurate answer I can.\n\nAt the foundational level, ${topicCap} is governed by a small number of first principles. The answer to your question — "${question}" — connects directly to those principles.\n\nCould you give me a bit more context? For example:\n\u2022 Are you asking for the theoretical basis?\n\u2022 A worked example or calculation?\n\u2022 How it compares to something else?\n\nThe more specific you are, the more precise I can be.`;
}

interface ChatPanelProps {
  topic: string;
  topicContent?: TopicContent;
}

let msgCounter = 0;
function nextId() {
  return `msg-${++msgCounter}`;
}

export default function ChatPanel({ topic, topicContent }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatMutation = useChatWithAI();

  const scrollToBottom = () => {
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const sendMessage = async () => {
    const question = input.trim();
    if (!question) return;

    const userMsg: Message = { id: nextId(), role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    scrollToBottom();

    // 1. Check deep knowledge base first
    const knowledgeAnswer = findKnowledge(question);
    if (knowledgeAnswer) {
      const aiMsg: Message = {
        id: nextId(),
        role: "ai",
        content: knowledgeAnswer,
      };
      setMessages((prev) => [...prev, aiMsg]);
      scrollToBottom();
      return;
    }

    // 2. Check topic-specific content
    const contextAnswer = buildContextAnswer(topic, question, topicContent);
    if (contextAnswer) {
      const aiMsg: Message = {
        id: nextId(),
        role: "ai",
        content: contextAnswer,
      };
      setMessages((prev) => [...prev, aiMsg]);
      scrollToBottom();
      return;
    }

    // 3. Try backend API and Wikipedia in parallel
    try {
      const [backendResponse, wikiAnswer] = await Promise.allSettled([
        chatMutation.mutateAsync({ topic, question }),
        searchWikipediaForAnswer(question),
      ]);

      // Prefer backend if it returns something substantive
      if (
        backendResponse.status === "fulfilled" &&
        backendResponse.value &&
        backendResponse.value.length > 80
      ) {
        const aiMsg: Message = {
          id: nextId(),
          role: "ai",
          content: backendResponse.value,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else if (wikiAnswer.status === "fulfilled" && wikiAnswer.value) {
        const aiMsg: Message = {
          id: nextId(),
          role: "ai",
          content: wikiAnswer.value,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // 4. Final fallback: smart context answer
        const fallback = buildSmartAnswer(topic, question);
        const aiMsg: Message = { id: nextId(), role: "ai", content: fallback };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      // Try Wikipedia
      const wikiAnswer = await searchWikipediaForAnswer(question).catch(
        () => null,
      );
      const answer = wikiAnswer || buildSmartAnswer(topic, question);
      const aiMsg: Message = { id: nextId(), role: "ai", content: answer };
      setMessages((prev) => [...prev, aiMsg]);
    }

    scrollToBottom();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="bg-surface border border-border rounded-xl overflow-hidden"
      data-ocid="chat.panel"
    >
      {/* Header / Toggle */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-raised transition-colors"
        onClick={() => setIsOpen((v) => !v)}
        data-ocid="chat.open_modal_button"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-display font-semibold text-sm text-foreground">
              Chat with AI
            </p>
            <p className="text-xs text-muted-foreground">
              Ask anything about {topic}
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Chat Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              {/* Messages */}
              <div
                className="max-h-80 overflow-y-auto p-4 space-y-3"
                data-ocid="chat.section"
              >
                {messages.length === 0 && (
                  <div
                    className="text-center py-6"
                    data-ocid="chat.empty_state"
                  >
                    <Bot className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Ask me anything about{" "}
                      <span className="text-primary font-medium">{topic}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try: "What is {topic}?" · "Give me an example" · "How does
                      it work?"
                    </p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                    data-ocid={`chat.item.${i + 1}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        msg.role === "user"
                          ? "bg-primary/20 border border-primary/30"
                          : "bg-surface-overlay border border-border"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={`rounded-xl px-3.5 py-2.5 text-sm max-w-[85%] leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-primary/15 border border-primary/25 text-foreground"
                          : "bg-background border border-border text-foreground/90"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {chatMutation.isPending && (
                  <div
                    className="flex gap-3 items-center"
                    data-ocid="chat.loading_state"
                  >
                    <div className="w-7 h-7 rounded-full bg-surface-overlay border border-border flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex gap-1 items-center bg-background border border-border rounded-xl px-3.5 py-3">
                      <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground ml-1">
                        Thinking...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-3 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about this topic..."
                  className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                  data-ocid="chat.input"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || chatMutation.isPending}
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-gold-dim flex-shrink-0"
                  data-ocid="chat.submit_button"
                >
                  {chatMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
