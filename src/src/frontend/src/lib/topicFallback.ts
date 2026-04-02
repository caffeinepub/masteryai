export interface TopicContent {
  intro: string;
  concepts: Array<{ title: string; description: string }>;
  examples: Array<{ title: string; explanation: string }>;
  deepDive: string;
  keyFacts: string[];
  resources: Array<{ title: string; url: string }>;
}

const FALLBACK_TOPICS: Record<string, TopicContent> = {
  "quantum physics": {
    intro:
      "Quantum physics (also called quantum mechanics) is the branch of physics that studies the behavior of matter and energy at the smallest scales — atoms, electrons, photons, and other subatomic particles. Unlike classical physics, which describes the world we can see, quantum physics reveals a reality that is fundamentally probabilistic, wave-like, and deeply strange.\n\nAt the quantum level, particles don't have definite positions or velocities until they are measured. This isn't a limitation of our instruments — it's a fundamental property of nature, described by Heisenberg's Uncertainty Principle. Quantum mechanics underlies all modern technology: semiconductors, lasers, MRI machines, and even the screen you're reading this on.",
    concepts: [
      {
        title: "Wave-Particle Duality",
        description:
          "Every quantum entity — electrons, photons, even atoms — exhibits both wave-like and particle-like behavior, but not simultaneously. The behavior you observe depends entirely on how you measure it. When you don't observe which path a particle takes, it behaves like a wave, spreading out and interfering with itself. When you do observe it, it snaps to a definite position like a particle.\n\nThe double-slit experiment proves this perfectly: fire electrons one at a time at a barrier with two slits. Without a detector, you get an interference pattern — the signature of waves. Add a detector to see which slit the electron uses, and the interference pattern immediately disappears. The electron collapses to one path the moment it's observed. This is not a quirk of the experiment. It reveals that the quantum world has no single fixed nature until measurement forces one.",
      },
      {
        title: "The Uncertainty Principle",
        description:
          "Werner Heisenberg's Uncertainty Principle (1927) states: Δx · Δp ≥ ℏ/2. Translation: the more precisely you know a particle's position, the less precisely you can know its momentum — and this tradeoff has a hard mathematical floor.\n\nThis is not a measurement problem. It's not saying 'our tools are too crude.' It's saying that a particle with a perfectly defined position has no single definite momentum, and vice versa. The reason is mathematical: position and momentum are related by a Fourier transform. A sharply defined position in space requires a broad spread of frequencies (momenta). A single definite frequency (momentum) is a wave spread across all space. The two cannot coexist.\n\nThis has profound consequences: it means you cannot perfectly predict any particle's future, even with infinite computing power. The universe is irreducibly probabilistic at the quantum scale.",
      },
      {
        title: "Superposition",
        description:
          "A quantum system exists in all possible states simultaneously until a measurement collapses it to one outcome. This is called superposition. It sounds absurd from a classical standpoint, but it's rigorously confirmed by experiment.\n\nSchrödinger's cat illustrates it: seal a cat in a box with a radioactive atom that has a 50% chance of decaying. The atom is in superposition of decayed/not-decayed states. Until you open the box, the cat is genuinely both alive and dead — not just unknown, but in a superposed quantum state.\n\nIn quantum computing, superposition is a resource: a qubit holds 0 and 1 simultaneously, allowing a quantum computer to explore all possible solutions in parallel. A 300-qubit computer in superposition can hold more simultaneous states than there are atoms in the observable universe.",
      },
      {
        title: "Quantum Entanglement",
        description:
          "When two quantum particles interact, they can become entangled: measuring one instantly determines the state of the other, regardless of how far apart they are. Einstein called this 'spooky action at a distance' and spent years trying to show it was wrong. He proposed that 'hidden variables' — unknown local information — must explain the correlation, rather than genuine non-local connection.\n\nJohn Bell derived a mathematical inequality (1964) that distinguishes between hidden variable theories and genuine quantum entanglement. Alain Aspect's experiments (1982) — and dozens since — have violated Bell's inequality. Entanglement is real, not a local hidden effect.\n\nThis means quantum information is fundamentally non-local. No signal travels faster than light (you can't use entanglement to send information), but the correlations between measurements are stronger than any local theory can explain. Entanglement is the foundation of quantum cryptography and quantum teleportation.",
      },
      {
        title: "The Schrödinger Equation",
        description:
          "The Schrödinger equation is to quantum mechanics what Newton's laws are to classical mechanics — the central equation that governs how quantum systems evolve. It describes how the wave function ψ (psi) changes over time: iℏ ∂ψ/∂t = Hψ, where H is the Hamiltonian (total energy operator).\n\nThe wave function ψ is not a physical wave. It's a probability amplitude — a complex-valued function whose squared magnitude gives the probability of finding a particle at any location or state. Before measurement, ψ encodes all possible outcomes and their probabilities. Measurement collapses ψ to a single outcome.\n\nWhat makes the equation remarkable: it is perfectly deterministic. Given the initial wave function, the Schrödinger equation predicts its evolution with total precision. The randomness only enters at the moment of measurement (collapse). This tension between deterministic evolution and random collapse is the heart of the 'measurement problem' — still unresolved.",
      },
      {
        title: "Quantum Tunneling",
        description:
          "Quantum tunneling is the phenomenon where a particle passes through a potential energy barrier that it classically has no right to cross. Imagine rolling a ball up a hill; if it doesn't have enough energy to reach the top, classically it bounces back. Quantum mechanically, the particle's wave function can 'leak through' the barrier with a nonzero probability.\n\nThis isn't theoretical abstraction — it powers the world. Tunnel diodes, flash memory (NAND storage in USB drives and SSDs), and scanning tunneling microscopes all rely on controlled quantum tunneling. Nuclear fusion in the Sun's core happens because protons tunnel through the Coulomb barrier at temperatures far too low to classically overcome it. Without tunneling, the Sun would not shine.\n\nThe probability of tunneling decays exponentially with barrier width and height — which is why it matters for subatomic particles but not for everyday objects.",
      },
    ],
    examples: [
      {
        title: "The Double-Slit Experiment",
        explanation:
          "Fire electrons one at a time at a barrier with two slits. Classical physics predicts two bands behind the slits (particle behavior). Instead, you see an interference pattern — exactly as if waves were passing through both slits simultaneously. The electron somehow 'knows' both slits exist and interferes with itself.\n\nNow add a detector to see which slit the electron uses. The interference pattern immediately disappears. Two solid bands appear instead. The act of observation collapses the quantum behavior from wave to particle.\n\nThe profound lesson: the quantum world doesn't have definite properties independent of measurement. The question 'which slit did it go through?' has no answer until you force an answer by measuring. Reality at the quantum scale is contextual — shaped by the act of observation.",
      },
      {
        title: "Quantum Tunneling in USB Flash Drives",
        explanation:
          "NAND flash memory stores data by trapping electrons in floating gate transistors. Writing data involves forcing electrons through a thin silicon dioxide insulating layer — a barrier they classically cannot cross. They tunnel through quantum mechanically.\n\nThis works because the insulating layer is only a few nanometers thick — thin enough for the electron's wave function to have nonzero probability on the other side. Apply a voltage, electrons tunnel through, and charge is stored. Remove voltage, electrons stay trapped (barrier is now thick enough to suppress tunneling back). Each trapped/empty state is a 0 or 1 bit.\n\nEvery file you save, every photo you take, every app you install on your phone — quantum tunneling is the physical mechanism writing your data.",
      },
      {
        title: "Lasers & Stimulated Emission",
        explanation:
          "Lasers work via stimulated emission: a photon hits an excited atom and triggers it to release a second, identical photon (same frequency, phase, and direction). This cascades — two photons trigger two more, four trigger four — producing a coherent beam.\n\nBut what makes stimulated emission possible is quantum mechanics: electrons in atoms occupy discrete energy levels, not a continuum. A photon with exactly the right energy (matching an electron's transition energy) causes the transition. The Schrödinger equation precisely predicts these energy levels for any atom.\n\nThe result: lasers are engineered to atomic precision. Fiber optic internet, laser eye surgery, Blu-ray discs, LIDAR in self-driving cars, and barcode scanners all exist because quantum mechanics gives us exact control over light-matter interaction.",
      },
      {
        title: "MRI Scanners",
        explanation:
          "MRI (Magnetic Resonance Imaging) exploits nuclear spin — a quantum property of protons. Protons behave like tiny magnets with a quantum spin that can be 'up' or 'down' relative to an external magnetic field. In a strong magnetic field, protons align with or against the field — a quantum superposition of two energy states.\n\nApply a radio frequency pulse at exactly the proton's resonance frequency (determined by quantum mechanics), and protons are kicked out of alignment. As they relax back, they emit a radio signal. The frequency and timing of that signal encodes the location and density of hydrogen atoms in tissue.\n\nThe quantum precision required is extraordinary: MRI machines tune to a specific resonance frequency accurate to parts per million. The result: detailed 3D images of soft tissue that X-rays cannot produce, without radiation damage.",
      },
    ],
    deepDive:
      "The measurement problem remains one of the deepest unresolved questions in physics. When does a quantum superposition collapse into a definite outcome? The Copenhagen Interpretation (Bohr, Heisenberg) says the wave function collapses upon measurement, but doesn't explain what counts as a 'measurement.' The Many-Worlds Interpretation (Everett, 1957) proposes that every measurement splits the universe into branches — one for each possible outcome — with no collapse at all.\n\nQuantum field theory (QFT) extends quantum mechanics to explain the creation and annihilation of particles, electromagnetism, and the strong/weak nuclear forces. The Standard Model of particle physics — the most successful theory in science — is built on QFT. It has predicted particle properties to 10+ decimal places.\n\nQuantum computing uses superposition and entanglement to perform computations exponentially faster than classical computers for certain problems. Shor's algorithm can factor large numbers (breaking RSA encryption) in polynomial time. Grover's algorithm searches databases in √N time. Companies like IBM, Google, and startups like IonQ are racing to build practical quantum computers.",
    keyFacts: [
      "ℏ (Planck's constant) = 1.054 × 10⁻³⁴ J·s — the fundamental quantum of action",
      "Heisenberg Uncertainty: Δx · Δp ≥ ℏ/2",
      "Einstein's photoelectric effect (1905): E = hf (photon energy = Planck's constant × frequency)",
      "de Broglie wavelength: λ = h/p (every particle has a wavelength)",
      "Speed of light c = 3 × 10⁸ m/s — limits all information transfer",
      "Quantum computing: Google's Sycamore performed a calculation in 200s that would take classical computers 10,000 years (2019)",
    ],
    resources: [
      {
        title: "Feynman Lectures on Physics (Free Online)",
        url: "https://www.feynmanlectures.caltech.edu",
      },
      {
        title: "MIT OpenCourseWare: Quantum Physics",
        url: "https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/",
      },
      {
        title: "Stanford Encyclopedia of Philosophy: Quantum Mechanics",
        url: "https://plato.stanford.edu/entries/qm/",
      },
    ],
  },
  javascript: {
    intro:
      "JavaScript (JS) is the world's most widely used programming language — the language of the web. Created in 10 days in 1995 by Brendan Eich at Netscape, it started as a simple scripting language for web browsers. Today, JavaScript runs everywhere: web browsers, servers (Node.js), mobile apps (React Native), IoT devices, and even AI systems.\n\nJavaScript is a high-level, interpreted, single-threaded language with dynamic typing and prototype-based object orientation. It's one of the three core technologies of the World Wide Web alongside HTML and CSS. Every interactive element on a webpage — from dropdown menus to real-time notifications — relies on JavaScript.",
    concepts: [
      {
        title: "Variables & Data Types",
        description:
          "JS has 7 primitive types: string, number, bigint, boolean, undefined, symbol, and null. Variables are declared with let (block-scoped, reassignable), const (block-scoped, not reassignable), or var (function-scoped, avoid in modern code). JS is dynamically typed — a variable can hold any type and change type at runtime.",
      },
      {
        title: "Functions & Closures",
        description:
          "Functions are first-class citizens in JS — they can be assigned to variables, passed as arguments, and returned from other functions. A closure occurs when a function 'remembers' variables from its outer scope even after that outer function has returned. Closures enable data encapsulation and are fundamental to patterns like module systems and React hooks.",
      },
      {
        title: "The Event Loop",
        description:
          "JS is single-threaded — it can only do one thing at a time. But web apps are highly asynchronous (network requests, timers, user events). The Event Loop solves this: it runs the call stack to completion, then picks the next task from the task queue (callbacks, promises). This allows non-blocking I/O without threads.",
      },
      {
        title: "Promises & Async/Await",
        description:
          "Promises represent eventual values — the result of an async operation that may succeed (resolve) or fail (reject). async/await is syntactic sugar over Promises that makes async code read like synchronous code. Under the hood, an async function returns a Promise and await pauses execution until the Promise resolves.",
      },
      {
        title: "Prototypes & Classes",
        description:
          "JS uses prototype-based inheritance — objects can inherit properties from other objects via their prototype chain. ES6 classes are syntactic sugar over prototypes. Every object has a __proto__ link to its prototype, and property lookup walks up the chain until it finds the property or hits null.",
      },
      {
        title: "The DOM & Events",
        description:
          "The Document Object Model (DOM) is a tree representation of an HTML page that JS can read and modify. document.querySelector(), addEventListener(), and createElement() are the core DOM APIs. Event delegation — attaching one listener to a parent element — is a key performance pattern for dynamic lists.",
      },
    ],
    examples: [
      {
        title: "Closure Counter",
        explanation:
          "function makeCounter() { let count = 0; return () => ++count; }\nconst c = makeCounter();\nc(); // 1, c(); // 2\nThe inner function closes over 'count' — it remembers the variable even after makeCounter returns. Each call to c() increments the same count variable.",
      },
      {
        title: "Fetching Data with Async/Await",
        explanation:
          "async function getUser(id) {\n  const res = await fetch(`/api/users/${id}`);\n  if (!res.ok) throw new Error('Not found');\n  return res.json();\n}\ngetUser(42).then(console.log).catch(console.error);\nThe await pauses getUser until fetch resolves, but doesn't block the main thread.",
      },
      {
        title: "Array Methods in Practice",
        explanation:
          "const scores = [85, 92, 78, 95, 88];\nconst passing = scores.filter(s => s >= 80); // [85, 92, 95, 88]\nconst grades = passing.map(s => s >= 90 ? 'A' : 'B'); // ['B','A','A','B']\nconst avg = scores.reduce((sum, s) => sum + s, 0) / scores.length; // 87.6\nMap, filter, and reduce are the functional trinity of JS array processing.",
      },
      {
        title: "Event Delegation",
        explanation:
          "Instead of adding a click listener to every list item (expensive), add one to the parent:\ndocument.getElementById('list').addEventListener('click', e => {\n  if (e.target.matches('li')) console.log('Clicked:', e.target.textContent);\n});\nThis works for dynamically added items too — a major advantage.",
      },
    ],
    deepDive:
      "Modern JavaScript (ES6+) introduced transformative features: arrow functions, destructuring, template literals, spread/rest operators, modules (import/export), WeakMap/WeakSet, Symbol, Proxy, and Reflect. The language continues to evolve annually via the TC39 standards process.\n\nThe JS ecosystem is enormous: npm has over 2 million packages. Key frameworks: React (UI components), Vue (progressive framework), Angular (full framework), Next.js (React + SSR), and Svelte (compile-time framework). Node.js brought JS to the server, enabling full-stack JavaScript with a single language.\n\nPerformance: Modern JS engines (V8 in Chrome/Node, SpiderMonkey in Firefox) use JIT compilation — they compile hot code paths to machine code at runtime, achieving near-native performance. Web Workers enable true parallel execution by running JS in background threads without blocking the UI.",
    keyFacts: [
      "Created in 10 days by Brendan Eich at Netscape (1995)",
      "typeof null === 'object' — a famous JS bug that cannot be fixed (too many sites depend on it)",
      "0.1 + 0.2 === 0.30000000000000004 — IEEE 754 floating-point arithmetic",
      "95%+ of websites use JavaScript (W3Techs, 2024)",
      "V8 engine executes ~1 billion JS operations per second on modern hardware",
      "npm registry hosts 2.1 million+ packages (2024) — largest package ecosystem",
    ],
    resources: [
      {
        title: "MDN Web Docs — JavaScript",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      },
      {
        title: "JavaScript.info — The Modern JavaScript Tutorial",
        url: "https://javascript.info",
      },
      {
        title: "You Don't Know JS (book series, free)",
        url: "https://github.com/getify/You-Dont-Know-JS",
      },
    ],
  },
};

export function getTopicFallback(topic: string): TopicContent | null {
  const key = topic.toLowerCase().trim();
  return FALLBACK_TOPICS[key] || null;
}

// Parse Wikipedia REST API summary response into TopicContent
function parseWikipediaContent(wikiData: {
  title?: string;
  extract?: string;
  description?: string;
}): TopicContent {
  const title = wikiData.title || "Topic";
  const extract = wikiData.extract || "";
  const description = wikiData.description || "";

  // Split extract into paragraphs
  const paragraphs = extract
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40);

  const intro =
    paragraphs.slice(0, 2).join("\n\n") ||
    `${title} — ${description || "A comprehensive topic with broad applications and deep foundational principles."}`;

  // Generate concepts from subsequent paragraphs
  const conceptParagraphs = paragraphs.slice(2, 8);
  const concepts = conceptParagraphs.map((para, i) => {
    const firstSentenceEnd = para.indexOf(". ");
    const conceptTitle =
      firstSentenceEnd > 0 && firstSentenceEnd < 60
        ? para.slice(0, firstSentenceEnd)
        : `Key Principle ${i + 1}`;
    return {
      title: conceptTitle,
      description: para,
    };
  });

  // If not enough paragraphs, pad with smart fallback concepts
  if (concepts.length === 0) {
    const fb = generateSmartFallback(title);
    return { ...fb, intro };
  }

  const deepDiveParagraphs = paragraphs.slice(8);
  const deepDive = deepDiveParagraphs.join("\n\n");

  const wikiTitle = title.replace(/ /g, "_");
  return {
    intro,
    concepts,
    examples: [
      {
        title: `${title} in Practice`,
        explanation: `${title} appears in real-world scenarios across science, technology, and everyday life. The core principles described above can be observed directly in physical systems, engineering applications, and natural phenomena.\n\nTo deepen your understanding, trace how the foundational definition connects to each concept above — the chain from definition to consequence is the core learning pathway for mastering ${title}.`,
      },
    ],
    deepDive:
      deepDive ||
      `${title} connects to broader fields and has been studied extensively across multiple disciplines. For a deeper exploration, the Wikipedia article, Khan Academy resources, and Coursera courses provide structured learning paths from beginner to advanced.`,
    keyFacts: [
      description
        ? `Definition: ${description}`
        : `${title} — foundational subject in its field`,
      "Source: Wikipedia (self-learned content)",
    ],
    resources: [
      {
        title: `Wikipedia — ${title}`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`,
      },
      {
        title: `Khan Academy — ${title}`,
        url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(title)}`,
      },
      {
        title: `Coursera — ${title} Courses`,
        url: `https://www.coursera.org/search?query=${encodeURIComponent(title)}`,
      },
    ],
  };
}

export function parseTopicContent(raw: string): TopicContent | null {
  if (!raw || raw.trim() === "") return null;
  try {
    const parsed = JSON.parse(raw);

    // Handle Wikipedia-tagged response from backend
    if (parsed.source === "wikipedia" && parsed.raw) {
      return parseWikipediaContent(parsed.raw);
    }

    return {
      intro: parsed.intro || parsed.introduction || parsed.summary || raw,
      concepts: parsed.concepts || parsed.coreConcepts || [],
      examples: parsed.examples || parsed.realWorldExamples || [],
      deepDive: parsed.deepDive || parsed.advanced || parsed.details || "",
      keyFacts: parsed.keyFacts || parsed.facts || parsed.formulas || [],
      resources: parsed.resources || parsed.links || [],
    };
  } catch {
    return {
      intro: raw,
      concepts: [],
      examples: [],
      deepDive: "",
      keyFacts: [],
      resources: [],
    };
  }
}

export function generateSmartFallback(topic: string): TopicContent {
  const t = topic.trim();
  const cap = t.charAt(0).toUpperCase() + t.slice(1);
  return {
    intro: `${cap} is a subject with real depth — one of those fields where the more precisely you understand the fundamentals, the more surprising and interconnected everything becomes. At its core, ${t} is concerned with a specific class of phenomena: understanding how certain systems behave, why they behave that way, and what the underlying rules are that govern them.\n\nWhat makes ${t} worth mastering is not just factual knowledge — it's the mental models you develop. Experts in ${t} can look at a new situation and immediately see structure that a beginner would miss entirely. This guide builds those models from the ground up, using real examples at every step.`,
    concepts: [
      {
        title: `The Core Principle of ${cap}`,
        description: `Every field has one central idea that everything else flows from. In ${t}, this is the foundational principle — the claim about how some part of the world works that, once accepted and understood, makes all the other pieces fall into place.\n\nUnderstanding this principle deeply (not just memorizing it) is the key step. Most confusion in ${t} comes from learners who jumped to advanced material before this foundation was solid. When you truly grasp the core principle, you stop needing to memorize rules — you can derive them. The rules are just consequences of the underlying logic.`,
      },
      {
        title: "How the System Actually Works",
        description: `${cap} isn't just a collection of facts — it's a system with internal structure. Understanding the system means understanding the causal chain: what happens first, what that causes, and what observable outcomes result.\n\nThe difference between a beginner and an expert in ${t} is often not more facts, but a clearer model of causality. The beginner memorizes "X causes Y." The expert understands why X causes Y, which means they can predict what happens when you change the conditions slightly. That's the power of understanding the mechanism, not just the result.`,
      },
      {
        title: "Key Terminology and Why It Matters",
        description: `In ${t}, specific terminology exists because it captures distinctions that plain language blurs. When practitioners use precise terms, they're not being pedantic — they're pointing at real differences that have real consequences.\n\nLearning the vocabulary of ${t} means more than memorizing definitions. It means understanding what real-world distinction each term captures, why that distinction matters, and how confusing two similar terms leads to wrong conclusions. The vocabulary is a map of the important distinctions in the field.`,
      },
      {
        title: "The Historical Path to Current Understanding",
        description: `${cap} reached its current form through a series of key insights, each one resolving a problem the previous framework couldn't handle. Understanding this history is not just interesting — it's pedagogically powerful. Seeing why each idea was needed helps you understand what problem it solves, which makes it far easier to remember and apply.\n\nMany learners encounter ${t} as a finished edifice and wonder why it's structured the way it is. The history reveals the reasoning: each convention, each formula, each framework exists because it solved a real problem that the previous approach failed on.`,
      },
      {
        title: "Common Misconceptions and How to Correct Them",
        description: `Every widely-studied field accumulates popular misconceptions — oversimplified versions of ideas that spread because they're easy to explain but subtly wrong. In ${t}, these misconceptions are particularly dangerous because they lead to confident but incorrect reasoning.\n\nThe most common misconceptions in ${t} typically arise from applying intuitions from one domain where they're valid to another domain where they break down. Correcting a misconception isn't just replacing one fact with another — it requires rebuilding the underlying model. That's harder but more valuable.`,
      },
      {
        title: `Where ${cap} Is Heading`,
        description: `The frontier of ${t} is defined by the questions it can't yet answer. These open problems are not random gaps — they cluster around the limits of current frameworks, the places where existing models break down or give contradictory results.\n\nUnderstanding the frontier matters even if you're not a researcher: it tells you which aspects of ${t} are settled (reliable to build on) and which are still contested (treat with appropriate uncertainty). It also shows where the next major breakthroughs are likely to come from, which is valuable for anyone making long-term decisions in or around the field.`,
      },
    ],
    examples: [
      {
        title: `The Defining Example of ${cap}`,
        explanation: `There is usually one canonical example in ${t} that teachers return to again and again — not because it's the only interesting case, but because it captures the essential tension or insight of the field more clearly than any other.\n\nStudying this example in depth is more valuable than surveying ten surface-level examples. The goal is to understand it well enough that you could explain it to someone else, predict what would happen if you changed one variable, and identify which features are essential versus incidental to the outcome.`,
      },
      {
        title: `${cap} in Everyday Life`,
        explanation: `${cap} is more present in daily life than most people realize. The technology we use, the institutions we navigate, the biological systems we are — all of them embody ${t} principles in action.\n\nRecognizing ${t} in everyday contexts does two things: it makes abstract concepts concrete (grounding them in observable reality), and it reveals how consequential the subject actually is. The distance between "interesting academic subject" and "directly relevant to my life" collapses once you learn to see the patterns.`,
      },
      {
        title: "An Edge Case That Reveals the Depth",
        explanation: `The most illuminating examples are often the edge cases — the situations where the simple version of ${t} gives the wrong answer, and you need the full theory to get it right. These cases matter because they reveal the limits of simplified models and show why precision in ${t} is necessary, not just pedantic.\n\nExpert practitioners develop intuition for which situations are "safe" (where simple models work fine) and which are "dangerous" (where the details matter and simplified thinking leads to failure). Building that intuition requires working through edge cases carefully.`,
      },
    ],
    deepDive: `Going deeper into ${t} reveals layers of nuance that introductory treatments gloss over. The interplay between ${t} and adjacent fields creates rich cross-disciplinary insights that can't be captured at the surface level.\n\nExperts in ${t} develop intuitions that allow them to navigate edge cases, resolve contradictions between sources, and generate novel ideas. The gap between beginner and expert is not primarily factual — it's in the quality of mental models: how compressed, accurate, and generative they are.\n\nThe most common misconceptions about ${t} stem from oversimplified mental models that work well in the central cases but fail at the boundaries. Correcting these requires understanding not just the 'what' but the 'why' — the mechanisms and constraints that define the boundaries of the subject.\n\nFor those seeking mastery, the path is: foundational principles first, then canonical examples, then edge cases, then cross-disciplinary connections. Each layer builds on the last and makes the next layer easier to absorb.`,
    keyFacts: [
      `${cap} is studied across multiple academic disciplines worldwide`,
      `Practical applications of ${t} span technology, science, arts, and social systems`,
      `Leading institutions offer dedicated programs and research centers focused on ${t}`,
      `The field of ${t} has seen significant advances in the past two decades`,
    ],
    resources: [
      {
        title: `Wikipedia — ${cap}`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, "_"))}`,
      },
      {
        title: `Khan Academy — Search: ${cap}`,
        url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(t)}`,
      },
      {
        title: `Coursera — ${cap} Courses`,
        url: `https://www.coursera.org/search?query=${encodeURIComponent(t)}`,
      },
    ],
  };
}
