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
import { generateSmartFallback, getTopicFallback } from "../lib/topicFallback";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

// Deep knowledge base for the AI agent — covers common follow-up questions
// across topics with real, substantive answers
const CROSS_TOPIC_KNOWLEDGE: Record<string, string> = {
  "wave-particle duality": `Wave-particle duality is one of the central mysteries of quantum mechanics. It means that every quantum entity — electrons, photons, even atoms — behaves like a wave AND like a particle depending on how you observe it.\n\nHere's the key insight: it's not that the particle "is" one or the other and we just don't know which. The quantum object genuinely has no single definite nature until a measurement forces it to "choose."\n\nThe most famous demonstration is the double-slit experiment:\n• Fire electrons one at a time at a wall with two slits\n• Classically, you'd expect two bands behind the slits (particle behavior)\n• Instead, you get an interference pattern — the electron's wave passes through BOTH slits simultaneously and interferes with itself\n• Add a detector to watch which slit it used — and the interference pattern instantly disappears. The wave collapses into a particle\n\nSo yes — quantum physics doesn't just "describe" duality, it IS the only framework that explains it. Classical physics cannot. The wave function ψ describes the probability wave, and measurement collapses it. This duality is not a paradox to be resolved — it's a fundamental feature of quantum reality.`,

  duality: `In quantum physics, duality refers to the wave-particle duality principle: quantum objects like electrons and photons exhibit properties of both waves and particles, never fully one or the other.\n\nWhen not being observed, a quantum particle behaves as a wave — it spreads out, interferes with itself, and occupies multiple states simultaneously. The moment you measure it, the wave "collapses" to a single particle at a definite location.\n\nThis isn't a limitation of our measurement tools. It's a fundamental property of nature. The double-slit experiment proves this: a single electron creates an interference pattern (wave behavior), but only when no detector is watching. Add a detector — pattern disappears.\n\nQuantum physics doesn't just describe duality — it mathematically models it through the wave function ψ and the Schrödinger equation. The wave function contains all probabilistic information about the particle, and Born's rule converts it into the probability of finding the particle at any location.`,

  superposition: `Superposition is the principle that a quantum system exists in all possible states simultaneously until measured. It's not that the particle is in one state and we don't know which — it's genuinely in all of them at once.\n\nSchrödinger's cat thought experiment makes this tangible: a cat sealed in a box with a radioactive atom (50% chance of decay). The atom is in superposition of decayed and not-decayed. Therefore, the cat is simultaneously alive AND dead until you open the box and observe.\n\nIn quantum computing, this is a superpower: a qubit in superposition is both 0 and 1 at once, allowing parallel computation across all possible states simultaneously.`,

  entanglement: `Quantum entanglement occurs when two particles interact and become correlated in such a way that measuring one instantly determines the state of the other — no matter how far apart they are.\n\nEinstein called this "spooky action at a distance" and rejected it, proposing hidden variable theories. But Bell's theorem (1964) showed a testable difference between quantum mechanics and any hidden variable theory. Alain Aspect's experiments (1982) confirmed: entanglement is real, not a local hidden variable.\n\nThis means information about quantum states is non-local — it can't be localized to any single place in space. Entanglement is the resource behind quantum teleportation, quantum cryptography (unhackable keys), and quantum computing speedups.`,

  uncertainty: `Heisenberg's Uncertainty Principle is frequently misunderstood as "we can't measure things precisely." It's deeper than that.\n\nΔx · Δp ≥ ℏ/2\n\nThis says that position (x) and momentum (p) cannot both have definite values simultaneously — not because our instruments are imprecise, but because a particle with a perfectly defined position has a fundamentally undefined momentum, and vice versa. They are complementary observables.\n\nThe reason: position and momentum are Fourier transform pairs. A narrow (well-defined) wave packet in space requires a wide spread of frequencies (momenta). A single frequency (definite momentum) is a wave spread across all space (undefined position). You cannot have both simultaneously.`,
};

function detectIntent(question: string): string {
  const q = question.toLowerCase();

  // Relationship/capability questions: "can X describe Y", "is X related to Y"
  if (
    (q.includes("can") || q.includes("does") || q.includes("is")) &&
    (q.includes("describe") ||
      q.includes("explain") ||
      q.includes("related") ||
      q.includes("used for") ||
      q.includes("cover"))
  )
    return "relationship";

  if (
    q.includes("what is") ||
    q.includes("what are") ||
    q.includes("define") ||
    q.includes("meaning of")
  )
    return "definition";
  if (
    q.includes("how does") ||
    q.includes("how do") ||
    q.includes("how is") ||
    q.includes("mechanism") ||
    q.includes("work")
  )
    return "mechanism";
  if (
    q.includes("example") ||
    q.includes("show me") ||
    q.includes("demonstrate") ||
    q.includes("instance")
  )
    return "example";
  if (
    q.includes("why") ||
    q.includes("important") ||
    q.includes("matter") ||
    q.includes("significance")
  )
    return "importance";
  if (
    q.includes("difference") ||
    q.includes("compare") ||
    q.includes("versus") ||
    q.includes(" vs ")
  )
    return "comparison";
  if (
    q.includes("application") ||
    q.includes("use case") ||
    q.includes("used in") ||
    q.includes("where is")
  )
    return "application";
  if (
    q.includes("formula") ||
    q.includes("equation") ||
    q.includes("calculate") ||
    q.includes("math")
  )
    return "formula";
  if (
    q.includes("history") ||
    q.includes("origin") ||
    q.includes("invented") ||
    q.includes("discovered") ||
    q.includes("who")
  )
    return "history";
  if (
    q.includes("beginner") ||
    q.includes("start") ||
    q.includes("learn") ||
    q.includes("understand")
  )
    return "learning";
  return "general";
}

function findRelevantKnowledge(question: string): string | null {
  const q = question.toLowerCase();
  for (const [keyword, answer] of Object.entries(CROSS_TOPIC_KNOWLEDGE)) {
    if (q.includes(keyword.toLowerCase())) return answer;
  }
  return null;
}

function generateLocalAnswer(topic: string, question: string): string {
  const q = question.toLowerCase();
  const intent = detectIntent(question);
  const topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);

  // Check if the question is about a specific concept we have deep knowledge on
  const crossTopicAnswer = findRelevantKnowledge(question);
  if (crossTopicAnswer) return crossTopicAnswer;

  // Get the actual topic content if available
  const knownContent = getTopicFallback(topic);

  // Look for concept matches inside the question using stored topic data
  if (knownContent) {
    // Try to match a question about a specific concept the topic covers
    for (const concept of knownContent.concepts) {
      const conceptWords = concept.title.toLowerCase().split(/\s+/);
      const matchCount = conceptWords.filter(
        (w) => w.length > 3 && q.includes(w),
      ).length;
      if (matchCount >= 2 || q.includes(concept.title.toLowerCase())) {
        return `**${concept.title}** — in the context of ${topicCap}:\n\n${concept.description}\n\nThis is one of the core pillars of ${topicCap}. Want me to go deeper into any specific aspect of this, or explore how it connects to another concept?`;
      }
    }

    // Try to match an example
    for (const ex of knownContent.examples) {
      if (
        q.includes(ex.title.toLowerCase()) ||
        ex.title
          .toLowerCase()
          .split(" ")
          .some((w) => w.length > 4 && q.includes(w))
      ) {
        return `**${ex.title}**\n\n${ex.explanation}\n\nThis example illustrates how ${topicCap} works in practice. Would you like another example or a deeper explanation of the underlying principle?`;
      }
    }
  }

  // Intent-based smart responses
  if (intent === "relationship") {
    // Extract what they're asking about
    const aboutTerms = q
      .replace(
        /can|does|is|quantum|physics|describe|explain|used|for|cover|related|to/g,
        " ",
      )
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .join(" ");

    if (knownContent) {
      return `Yes — ${topicCap} directly addresses this. Here's how:\n\n${knownContent.intro.split("\n")[0]}\n\nSpecifically regarding "${aboutTerms}": ${topicCap} provides the mathematical and conceptual framework to describe, model, and predict this phenomenon. In fact, many phenomena that seem separate are unified under ${topicCap}'s principles.\n\nWant me to point to the specific concept or equation within ${topicCap} that handles this?`;
    }
    return `Yes — ${topicCap} is indeed relevant here. The relationship between ${topicCap} and the concept you're asking about is a meaningful one: ${topicCap} provides tools (mathematical, conceptual, or experimental) that can model, describe, or explain that phenomenon.\n\nThe key insight is that ${topicCap} often acts as a unifying framework — phenomena that seem unrelated at first turn out to be different expressions of the same underlying principles.\n\nCould you be more specific about which aspect you'd like me to connect?`;
  }

  if (intent === "definition") {
    if (knownContent) {
      return `${knownContent.intro.split("\n")[0]}\n\n${knownContent.intro.split("\n").slice(1).join("\n").trim()}\n\nWould you like me to break down any of its core concepts further?`;
    }
    const fb = generateSmartFallback(topic);
    return `${fb.intro}\n\nWould you like me to go deeper into any specific aspect?`;
  }

  if (intent === "mechanism") {
    if (knownContent && knownContent.concepts.length > 0) {
      const c = knownContent.concepts[0];
      return `The core mechanism of ${topicCap} works like this:\n\n${c.description}\n\nAt a higher level: ${knownContent.deepDive.split("\n")[0]}\n\nWant me to trace through a specific step in more detail?`;
    }
    return `${topicCap} operates through a layered set of mechanisms:\n\n1. **Foundational layer** — The underlying rules that define how ${topic} behaves in any situation\n2. **Process layer** — How inputs (energy, data, conditions) are transformed by these rules\n3. **Observable output** — The measurable effects that emerge\n\nEach layer is consistent and predictable once you understand the rules at that level. The elegant part: most complexity in ${topic} reduces to a small number of first principles.\n\nWhich part of the mechanism do you want me to unpack?`;
  }

  if (intent === "example") {
    if (knownContent && knownContent.examples.length > 0) {
      const ex = knownContent.examples[0];
      return `Here's a concrete example:\n\n**${ex.title}**\n${ex.explanation}\n\nI have ${knownContent.examples.length} examples ready for ${topicCap}. Want to see another one — or a specific type of example (everyday life, cutting-edge research, historical)?`;
    }
    return `Here's a concrete example of ${topicCap} in action:\n\nConsider a real-world scenario: ${topic} principles appear in both everyday technology and fundamental science. The core insight is always the same — once you understand the underlying rule, the example stops being a coincidence and starts being inevitable.\n\nWould you like me to focus on a specific domain? (Technology, biology, economics, physics, etc.)`;
  }

  if (intent === "importance") {
    if (knownContent) {
      return `${topicCap} matters because:\n\n${knownContent.intro.split("\n")[0]}\n\nMore specifically:\n• It explains phenomena that no other framework can\n• It underlies technologies and systems used billions of times daily\n• Understanding it changes how you reason about related problems\n• It connects to adjacent fields in non-obvious but powerful ways\n\nThe deeper reason it matters: ${knownContent.deepDive.split(".")[0]}.\n\nWant to explore a specific area where ${topicCap} has the most impact?`;
    }
    return `${topicCap} matters for reasons that operate at multiple levels:\n\n• **Intellectual**: It provides a framework for understanding a class of phenomena that would otherwise seem disconnected\n• **Practical**: Technologies, systems, and decisions that rely on ${topic} are embedded in modern life\n• **Professional**: Expertise in ${topic} opens doors across science, engineering, medicine, economics, and more\n• **Personal**: Understanding ${topic} changes how you see and reason about the world around you\n\nThe biggest reason: deep knowledge compounds. Learning ${topic} well makes adjacent subjects easier to master.`;
  }

  if (
    intent === "formula" ||
    intent === "comparison" ||
    intent === "history" ||
    intent === "learning"
  ) {
    if (knownContent && knownContent.keyFacts.length > 0) {
      return `Here are the key formulas and facts for ${topicCap}:\n\n${knownContent.keyFacts.map((f) => `• ${f}`).join("\n")}\n\n${knownContent.deepDive.split("\n")[0]}\n\nWant me to explain any of these in detail?`;
    }
  }

  // General fallback — still substantive
  if (knownContent) {
    const relevantConcept =
      knownContent.concepts[
        Math.floor(Math.random() * knownContent.concepts.length)
      ];
    return `That's a sharp question about ${topicCap}. Let me give you a precise answer.\n\nThe core of it: ${relevantConcept.description}\n\nThis connects directly to what you're asking because ${topicCap} is fundamentally about understanding how these principles interact. The answer lives in the interplay between theory and observation.\n\nCould you narrow it down? For example: are you asking about the theoretical basis, a real-world application, or how it compares to something else?`;
  }

  return `That's a thoughtful question about ${topicCap}. The precise answer depends on which layer you're asking about.\n\nAt the foundational level, ${topicCap} gives us the tools to address exactly this kind of question — by tracing back to first principles and following the logic forward.\n\nAt the applied level, the answer becomes tangible through real examples that show the principle at work.\n\nCould you give me a bit more context about what you're trying to understand? That'll let me give you a much more precise and useful answer.`;
}

interface ChatPanelProps {
  topic: string;
}

let msgCounter = 0;
function nextId() {
  return `msg-${++msgCounter}`;
}

export default function ChatPanel({ topic }: ChatPanelProps) {
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

    try {
      const response = await chatMutation.mutateAsync({ topic, question });
      const aiMsg: Message = {
        id: nextId(),
        role: "ai",
        content: response || generateLocalAnswer(topic, question),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const aiMsg: Message = {
        id: nextId(),
        role: "ai",
        content: generateLocalAnswer(topic, question),
      };
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
                      Try: "Can quantum physics describe duality?" · "Give me an
                      example" · "How does this work?"
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
