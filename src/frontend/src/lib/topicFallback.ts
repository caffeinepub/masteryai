export interface TopicContent {
  intro: string;
  concepts: Array<{ title: string; description: string }>;
  examples: Array<{ title: string; explanation: string }>;
  deepDive: string;
  keyFacts: string[];
  resources: Array<{ title: string; url: string }>;
  fromWikipedia?: boolean;
}

// ─── Wikipedia API ────────────────────────────────────────────────────────────

export async function fetchFromWikipedia(
  topic: string,
): Promise<TopicContent | null> {
  try {
    const encoded = encodeURIComponent(topic.trim());
    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
      { headers: { Accept: "application/json" } },
    );
    if (!summaryRes.ok) return null;
    const summary = await summaryRes.json();
    if (!summary.extract || summary.extract.length < 100) return null;

    // Also fetch sections for deeper content
    const sectRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/sections/${encoded}`,
      { headers: { Accept: "application/json" } },
    ).catch(() => null);

    const sectionData = sectRes?.ok
      ? await sectRes.json().catch(() => null)
      : null;
    const sections: Array<{ title: string; content: string }> =
      sectionData?.sections || [];

    // Build intro from Wikipedia extract — first 3 paragraphs
    const paragraphs = summary.extract
      .split("\n")
      .filter((p: string) => p.trim().length > 50);
    const intro = paragraphs.slice(0, 3).join("\n\n");

    // Build concepts from sections (first 5 meaningful sections)
    const concepts = sections
      .filter((s) => s.content && s.content.trim().length > 100)
      .slice(0, 5)
      .map((s) => ({
        title: s.title,
        description: s.content
          .split("\n")
          .filter((p: string) => p.trim().length > 30)
          .slice(0, 4)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 600),
      }))
      .filter((c) => c.title && c.description);

    // Build examples from later sections
    const exSections = sections
      .filter(
        (s) =>
          s.title.toLowerCase().includes("example") ||
          s.title.toLowerCase().includes("application") ||
          s.title.toLowerCase().includes("use") ||
          s.title.toLowerCase().includes("effect"),
      )
      .slice(0, 3);

    const examples =
      exSections.length > 0
        ? exSections.map((s) => ({
            title: s.title,
            explanation: s.content
              .split("\n")
              .filter((p: string) => p.trim().length > 30)
              .slice(0, 3)
              .join(" ")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 500),
          }))
        : [
            {
              title: `${topic} in the Real World`,
              explanation:
                `${topic} has wide-ranging real-world applications. ${paragraphs[paragraphs.length - 1] || ""}`.slice(
                  0,
                  500,
                ),
            },
          ];

    const deepDive =
      sections
        .filter((s) => !exSections.includes(s))
        .slice(5, 8)
        .map((s) => `${s.title}: ${s.content.slice(0, 300)}`)
        .join("\n\n") ||
      paragraphs.slice(3, 6).join("\n\n") ||
      "";

    const topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);
    const resources = [
      {
        title: `Wikipedia: ${topicCap}`,
        url: `https://en.wikipedia.org/wiki/${encoded}`,
      },
      {
        title: `Khan Academy: ${topicCap}`,
        url: `https://www.khanacademy.org/search?page_search_query=${encoded}`,
      },
      {
        title: `YouTube: ${topicCap} explained`,
        url: `https://www.youtube.com/results?search_query=${encoded}+explained`,
      },
    ];

    return {
      intro:
        intro || summary.description || `${topicCap} — fetched from Wikipedia.`,
      concepts:
        concepts.length > 0
          ? concepts
          : [
              {
                title: topicCap,
                description: paragraphs.slice(1, 3).join(" ").slice(0, 600),
              },
            ],
      examples,
      deepDive,
      keyFacts: [
        `Topic: ${summary.title}`,
        ...(summary.description ? [`Summary: ${summary.description}`] : []),
      ],
      resources,
      fromWikipedia: true,
    };
  } catch {
    return null;
  }
}

export async function searchWikipediaForAnswer(
  question: string,
): Promise<string | null> {
  try {
    // Extract key terms from question
    const stopWords = new Set([
      "what",
      "is",
      "are",
      "how",
      "does",
      "do",
      "why",
      "when",
      "where",
      "can",
      "the",
      "a",
      "an",
      "in",
      "on",
      "of",
      "to",
      "for",
      "and",
      "or",
    ]);
    const terms = question
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .filter((w) => w.length > 3 && !stopWords.has(w));

    if (terms.length === 0) return null;

    const query = terms.slice(0, 3).join(" ");
    const encoded = encodeURIComponent(query);

    // Search Wikipedia
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.extract || data.extract.length < 80) return null;

    const paras = data.extract
      .split("\n")
      .filter((p: string) => p.trim().length > 50);
    return `**${data.title}**\n\n${paras.slice(0, 4).join("\n\n")}\n\n[Source: Wikipedia — ${data.content_urls?.desktop?.page || "wikipedia.org"}]`;
  } catch {
    return null;
  }
}

// ─── Parse backend JSON response ─────────────────────────────────────────────

export function parseTopicContent(raw: string): TopicContent | null {
  if (!raw || raw.trim().length < 20) return null;
  try {
    const data = JSON.parse(raw);
    if (data.intro && Array.isArray(data.concepts)) {
      return data as TopicContent;
    }
  } catch {
    // not JSON
  }
  return null;
}

// ─── Smart fallback for truly unknown topics ──────────────────────────────────

export function generateSmartFallback(topic: string): TopicContent {
  const topicCap = topic.charAt(0).toUpperCase() + topic.slice(1);
  return {
    intro: `${topicCap} is a subject with rich depth and real-world significance. This guide will walk you through the core principles, key concepts, and practical applications — from foundational definitions to advanced insights.`,
    concepts: [
      {
        title: `What is ${topicCap}?`,
        description: `${topicCap} refers to a field or subject of study that encompasses a set of principles, theories, and practical applications. At its core, it deals with understanding the underlying mechanisms and behaviors that define this domain. The foundational principles provide a systematic way to analyze, predict, and apply knowledge in this area.`,
      },
      {
        title: `Core Principles of ${topicCap}`,
        description: `The core principles of ${topicCap} provide the theoretical foundation from which all practical applications derive. These principles are supported by extensive research, experimentation, and real-world validation. Understanding these principles enables you to approach new problems in this domain with clarity and confidence.`,
      },
      {
        title: `How ${topicCap} Works`,
        description: `${topicCap} operates through a layered system of inputs, processes, and outputs. At the lowest level, fundamental rules govern behavior. These rules combine to produce more complex phenomena at higher levels. The elegant part: once you understand the base rules, the complexity becomes predictable.`,
      },
    ],
    examples: [
      {
        title: `${topicCap} in Practice`,
        explanation: `Real-world applications of ${topicCap} appear across industries and everyday life. Once you understand the principles, you start recognizing them everywhere. The key is to start with simple cases, verify understanding with examples, and gradually tackle more complex scenarios.`,
      },
    ],
    deepDive: `A deeper study of ${topicCap} reveals connections to adjacent fields and more nuanced principles that govern edge cases. Advanced practitioners in ${topicCap} don't just know the rules — they understand why the rules are the way they are, and can reason from first principles to solve novel problems.`,
    keyFacts: [
      `${topicCap} is a well-established field with foundational principles`,
      "Understanding the basics unlocks the ability to reason about advanced concepts",
      "Real-world examples are the best way to solidify theoretical knowledge",
    ],
    resources: [
      {
        title: `Wikipedia: ${topicCap}`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`,
      },
      {
        title: `Khan Academy: ${topicCap}`,
        url: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(topic)}`,
      },
      {
        title: `YouTube: ${topicCap} explained`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(topic)}+explained`,
      },
    ],
  };
}

// ─── Local knowledge base ─────────────────────────────────────────────────────

const FALLBACK_TOPICS: Record<string, TopicContent> = {
  "quantum physics": {
    intro:
      "Quantum physics (also called quantum mechanics) is the branch of physics that studies the behavior of matter and energy at the smallest scales — atoms, electrons, photons, and other subatomic particles. Unlike classical physics, which describes the world we can see, quantum physics reveals a reality that is fundamentally probabilistic, wave-like, and deeply strange.\n\nAt the quantum level, particles don't have definite positions or velocities until they are measured. This isn't a limitation of our instruments — it's a fundamental property of nature, described by Heisenberg's Uncertainty Principle. Quantum mechanics underlies all modern technology: semiconductors, lasers, MRI machines, and the screen you're reading this on.",
    concepts: [
      {
        title: "Wave-Particle Duality",
        description:
          "Every quantum entity — electrons, photons, even atoms — exhibits both wave-like and particle-like behavior. The double-slit experiment proves this: fire electrons one at a time at a barrier with two slits. Without a detector, you get an interference pattern — the electron passes through BOTH slits as a wave. Add a detector to see which slit, and the interference pattern instantly disappears. The electron collapses to a particle.\n\nThe key insight: quantum objects have no single fixed nature until observation forces one. This isn't a measurement problem — it's the fundamental structure of reality at the quantum scale.",
      },
      {
        title: "Heisenberg Uncertainty Principle",
        description:
          "Δx · Δp ≥ ℏ/2. The more precisely you know a particle's position, the less precisely you can know its momentum. This is not about measuring instruments being imprecise — it's a fundamental mathematical property of wave functions.\n\nReason: position and momentum are Fourier transform pairs. A sharply defined position requires a wide spread of momenta. A single definite momentum is a wave spread across all space. They cannot coexist.",
      },
      {
        title: "Superposition",
        description:
          "A quantum system exists in all possible states simultaneously until measured. Schrödinger's cat: a cat in a box with a radioactive atom is simultaneously alive AND dead until you observe it. This isn't ignorance — it's genuine quantum superposition.\n\nIn quantum computing: a qubit holds 0 and 1 simultaneously, allowing exploration of all solutions in parallel.",
      },
      {
        title: "Quantum Entanglement",
        description:
          "Two entangled particles share a quantum state — measuring one instantly determines the state of the other, regardless of distance. Bell's inequality experiments (Aspect, 1982) confirmed this is real, not a local hidden variable effect.\n\nEntanglement powers quantum cryptography and quantum teleportation.",
      },
      {
        title: "Quantum Tunneling",
        description:
          'A particle can pass through a potential energy barrier it classically cannot cross. The wave function "leaks through" the barrier with nonzero probability.\n\nApplications: flash memory (USB/SSDs), tunnel diodes, scanning tunneling microscopes. The Sun fuses hydrogen because protons tunnel through the Coulomb barrier. Without tunneling, the Sun would not shine.',
      },
    ],
    examples: [
      {
        title: "Double-Slit Experiment",
        explanation:
          "Electrons fired one at a time through two slits create an interference pattern — wave behavior. Add a detector to watch which slit, and the pattern disappears — particle behavior. The observation itself changes the outcome. This is the most direct demonstration that quantum reality is contextual.",
      },
      {
        title: "Quantum Tunneling in USB Flash Drives",
        explanation:
          "NAND flash memory stores data by trapping electrons in floating gate transistors. Writing involves forcing electrons through a thin insulating layer via quantum tunneling. Every file you save uses quantum mechanics.",
      },
    ],
    deepDive:
      "The measurement problem remains the deepest unresolved question: Copenhagen says the wave function collapses. Many-Worlds says the universe branches. Both are mathematically equivalent but philosophically opposite.\n\nQuantum computing uses superposition and entanglement for exponential speedups on specific problems. Shor's algorithm factors large numbers in polynomial time, which breaks RSA encryption.",
    keyFacts: [
      "ℏ = 1.054 × 10⁻³⁴ J·s (reduced Planck's constant)",
      "Heisenberg: Δx · Δp ≥ ℏ/2",
      "Photon energy: E = hf",
      "de Broglie wavelength: λ = h/p (every particle has a wavelength)",
      "Schrödinger equation: iℏ ∂ψ/∂t = Hψ",
    ],
    resources: [
      {
        title: "Feynman Lectures (Free)",
        url: "https://www.feynmanlectures.caltech.edu",
      },
      {
        title: "MIT OpenCourseWare: Quantum Physics",
        url: "https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/",
      },
    ],
  },

  "linear motion": {
    intro:
      "Linear motion is movement along a straight line. It is the simplest and most fundamental type of motion — the starting point for all of classical mechanics.\n\nAn object in linear motion changes its position along a single axis. Motion can be uniform (constant speed) or non-uniform (accelerating/decelerating). Every car on a highway, every falling apple, every rocket launch is governed by the equations of linear motion.",
    concepts: [
      {
        title: "Displacement vs Distance",
        description:
          "Distance is the total path length traveled — always positive, no direction. Displacement is the straight-line change in position — it has both magnitude and direction (vector).\n\nExample: Walk 5 m east, then 5 m west. Distance = 10 m. Displacement = 0 m. You ended where you started.",
      },
      {
        title: "Velocity and Speed",
        description:
          "Speed = distance / time (scalar — no direction). Velocity = displacement / time (vector — includes direction).\n\nAverage velocity = Δx / Δt. Instantaneous velocity = dx/dt (derivative of position). Two cars at 60 km/h in opposite directions have the same speed but opposite velocities.",
      },
      {
        title: "Acceleration",
        description:
          "Acceleration = rate of change of velocity: a = Δv / Δt. It is a vector. An object accelerates when it speeds up, slows down, or changes direction.\n\nFree fall: a = 9.8 m/s² downward. Newton's Second Law: F = ma.",
      },
      {
        title: "SUVAT Equations (Uniform Acceleration)",
        description:
          "1. v = u + at\n2. s = ut + ½at²\n3. v² = u² + 2as\n4. s = ½(u + v)t\n\nVariables: s = displacement, u = initial velocity, v = final velocity, a = acceleration, t = time. You need 3 knowns to find the other 2.",
      },
      {
        title: "Newton's Laws of Motion",
        description:
          "1st Law (Inertia): An object in motion stays in motion unless a net force acts on it.\n2nd Law: F = ma — force equals mass times acceleration.\n3rd Law: Every action has an equal and opposite reaction.",
      },
    ],
    examples: [
      {
        title: "Free Fall from 20 m",
        explanation:
          "Drop a ball from 20 m (u = 0, a = 9.8 m/s²).\n\ns = ut + ½at²: 20 = 0 + ½ × 9.8 × t²\nt² = 40/9.8 = 4.08 → t = 2.02 s\n\nFinal velocity: v = 0 + 9.8 × 2.02 = 19.8 m/s\n\nThe ball hits the ground at ~19.8 m/s after ~2 seconds. Heavier or lighter — in a vacuum they fall identically (Galileo, 1590s).",
      },
      {
        title: "Car Braking — Stopping Distance",
        explanation:
          "Car moving at 30 m/s brakes at −6 m/s². How far to stop?\n\nv² = u² + 2as: 0 = 900 + 2(−6)s → s = 75 m\n\nAt 60 m/s with same brakes: 0 = 3600 − 12s → s = 300 m. Four times the speed = four times the stopping distance.",
      },
    ],
    deepDive:
      "Linear motion is the base case. Once mastered, you extend to 2D projectile motion (horizontal + vertical linear motions combined), circular motion (constant direction change), and rotation.\n\nVelocity-time graphs: slope = acceleration, area under curve = displacement.",
    keyFacts: [
      "v = u + at",
      "s = ut + ½at²",
      "v² = u² + 2as",
      "Free fall: g = 9.8 m/s² ≈ 10 m/s²",
      "F = ma (Newton's Second Law)",
    ],
    resources: [
      {
        title: "Khan Academy: 1D Motion",
        url: "https://www.khanacademy.org/science/physics/one-dimensional-motion",
      },
      {
        title: "MIT OCW: Classical Mechanics",
        url: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/",
      },
    ],
  },

  light: {
    intro:
      "Light is electromagnetic radiation — oscillating electric and magnetic fields propagating through space as a wave, while also behaving as particles called photons. It is one of the most fundamental phenomena in nature.\n\nVisible light (380–700 nm) is a narrow slice of the full electromagnetic spectrum, which extends from radio waves to gamma rays. Light travels at c = 3 × 10⁸ m/s in vacuum — the universal speed limit. Understanding light led directly to Maxwell's equations, Einstein's special relativity, and quantum mechanics.",
    concepts: [
      {
        title: "What Light Is",
        description:
          "Light is an oscillating electromagnetic field: coupled electric and magnetic waves propagating perpendicular to each other and to the direction of travel. Maxwell (1865) unified electricity and magnetism into one theory, predicting electromagnetic waves at speed c.\n\nAt the quantum level, light is also a stream of photons — massless packets with energy E = hf. Higher frequency = higher energy. UV photons cause sunburn; visible photons don't.",
      },
      {
        title: "Speed of Light",
        description:
          "c = 299,792,458 m/s exactly in vacuum. In a medium: v = c/n, where n is the refractive index. In water, n ≈ 1.33, so light travels at 75% of c. This slowing causes refraction.\n\nBecause c is finite, looking at distant stars means looking into the past. Sunlight takes 8 min 20 s to reach Earth.",
      },
      {
        title: "Reflection",
        description:
          "Law of reflection: angle of incidence = angle of reflection (from the normal). Specular reflection (smooth surfaces) creates sharp images. Diffuse reflection (rough surfaces) scatters light in all directions — this is how most objects around you are visible.\n\nColor: a red apple reflects red wavelengths and absorbs all others.",
      },
      {
        title: "Refraction",
        description:
          "Refraction is the bending of light when it crosses from one medium to another with a different refractive index. Snell's Law: n₁ sin θ₁ = n₂ sin θ₂.\n\nApplications: eyeglasses, camera lenses, rainbows, fiber optics. Why a straw looks bent in water: light bends at the water-air boundary.",
      },
      {
        title: "Electromagnetic Spectrum",
        description:
          "From lowest to highest frequency: Radio → Microwave → Infrared → Visible → Ultraviolet → X-ray → Gamma ray. All travel at c in vacuum. Energy increases with frequency: E = hf.",
      },
    ],
    examples: [
      {
        title: "Rainbows — Refraction and Dispersion",
        explanation:
          "Sunlight enters a spherical raindrop, reflects off the inside back surface, and exits. Refraction occurs twice. Different wavelengths refract at slightly different angles (dispersion): red at ~42°, violet at ~40°. White light separates into a spectrum — a rainbow.",
      },
      {
        title: "Fiber Optics — Total Internal Reflection",
        explanation:
          "When light hits a surface at an angle beyond the critical angle, it reflects entirely back — no light escapes. Fiber optic cables use this to guide light over thousands of kilometers. Internet data, phone calls, and streaming video travel as pulses of light through these fibers.",
      },
      {
        title: "Solar Panels — Photoelectric Effect",
        explanation:
          "Photons from sunlight strike silicon and knock electrons loose. Each photon carries E = hf. If this exceeds the electron's binding energy, it's freed as electric current. This is the photoelectric effect — Einstein won the 1921 Nobel Prize for explaining it.",
      },
    ],
    deepDive:
      "Maxwell's discovery that EM waves travel at c forced Einstein to rethink spacetime → special relativity. QED (quantum electrodynamics) is the quantum theory of light — the most precisely tested theory in physics (accurate to 12 decimal places).",
    keyFacts: [
      "c = 299,792,458 m/s in vacuum",
      "E = hf (photon energy)",
      "Visible spectrum: 380 nm (violet) to 700 nm (red)",
      "Snell's Law: n₁ sin θ₁ = n₂ sin θ₂",
      "Sunlight takes 8 min 20 s to reach Earth",
    ],
    resources: [
      {
        title: "Khan Academy: Light and Optics",
        url: "https://www.khanacademy.org/science/physics/light-waves",
      },
      {
        title: "HyperPhysics: Light",
        url: "http://hyperphysics.phy-astr.gsu.edu/hbase/ligcon.html",
      },
    ],
  },

  photosynthesis: {
    intro:
      "Photosynthesis is the process by which plants, algae, and some bacteria convert light energy into chemical energy (glucose). It is the foundation of almost all life on Earth — the mechanism by which solar energy enters the biosphere and becomes available to living things.\n\nOverall equation: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nEvery apple you eat, every breath of oxygen you take — these are products of photosynthesis.",
    concepts: [
      {
        title: "What Photosynthesis Actually Is",
        description:
          "Photosynthesis is a two-stage chemical process occurring in chloroplasts — organelles found in plant cells. It uses light energy to split water molecules, releasing oxygen as a byproduct, and uses the energy to fix carbon dioxide from the air into glucose.\n\nThe process is powered by chlorophyll — a green pigment that absorbs red and blue light (reflecting green, which is why plants appear green).",
      },
      {
        title: "Stage 1: Light-Dependent Reactions",
        description:
          "Occur in the thylakoid membranes of chloroplasts. Light photons are absorbed by chlorophyll, which excites electrons to higher energy states. Water molecules are split (photolysis): 2H₂O → 4H⁺ + 4e⁻ + O₂. The oxygen is released into the air.\n\nThe excited electrons move through the electron transport chain, generating ATP and NADPH — the energy carriers that power Stage 2.",
      },
      {
        title: "Stage 2: Calvin Cycle (Light-Independent)",
        description:
          "Occurs in the stroma of chloroplasts. Uses ATP and NADPH from Stage 1 to fix CO₂ from the air into organic molecules.\n\nThe enzyme RuBisCO catalyzes the fixation: CO₂ is attached to a 5-carbon molecule (RuBP), starting a cycle that ultimately produces glucose (C₆H₁₂O₆). Three turns of the cycle fix three CO₂ molecules and produce one molecule of G3P, which eventually becomes glucose.",
      },
      {
        title: "Chlorophyll and Light Absorption",
        description:
          "Chlorophyll absorbs primarily red (640–680 nm) and blue (430–450 nm) light. It reflects green light — which is why plants appear green. Different photosynthetic pigments (carotenoids, phycocyanin) absorb different wavelengths, broadening the range of light the plant can use.",
      },
      {
        title: "Limiting Factors",
        description:
          "The rate of photosynthesis is limited by three main factors:\n1. Light intensity — more light = faster reaction, up to the saturation point\n2. CO₂ concentration — more CO₂ = faster Calvin cycle\n3. Temperature — enzymes have an optimal temperature (usually ~25–30°C); too hot denatures them\n\nIn agriculture, these limiting factors are controlled in greenhouses to maximize crop yield.",
      },
    ],
    examples: [
      {
        title: "A Single Leaf on a Sunny Day",
        explanation:
          "A single maple leaf on a sunny day can fix ~1 mg of CO₂ per hour. It absorbs red and blue photons through chlorophyll, splits water to release O₂, and runs the Calvin cycle to build sugars. Those sugars travel through the phloem to the rest of the plant, fueling growth and reproduction.",
      },
      {
        title: "Algae and Ocean Photosynthesis",
        explanation:
          "Phytoplankton (microscopic ocean algae) perform roughly 50% of all photosynthesis on Earth. They fix billions of tons of CO₂ annually and produce about half of the oxygen in Earth's atmosphere. They are also the base of almost all oceanic food chains.",
      },
      {
        title: "Artificial Photosynthesis",
        explanation:
          "Scientists are building artificial photosynthetic systems to convert CO₂ and water into fuel (hydrogen or methanol) using sunlight. If successful, this would provide clean, renewable energy and help address climate change by removing CO₂ from the atmosphere.",
      },
    ],
    deepDive:
      "C4 and CAM plants have evolved modified photosynthesis mechanisms to reduce water loss in hot, dry climates. C4 plants (corn, sugarcane) pre-fix CO₂ in outer cells before the Calvin cycle, minimizing photorespiration. CAM plants (cacti) open stomata only at night to collect CO₂, storing it for daytime photosynthesis.",
    keyFacts: [
      "6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂",
      "Occurs in chloroplasts (thylakoids + stroma)",
      "Chlorophyll absorbs red (670 nm) and blue (430 nm) light",
      "RuBisCO is the enzyme that fixes CO₂ in the Calvin cycle",
      "Phytoplankton produce ~50% of Earth's oxygen",
    ],
    resources: [
      {
        title: "Khan Academy: Photosynthesis",
        url: "https://www.khanacademy.org/science/ap-biology/cellular-energetics/photosynthesis",
      },
      {
        title: "Crash Course Biology: Photosynthesis",
        url: "https://www.youtube.com/watch?v=uixA8ZXx0KU",
      },
    ],
  },

  electricity: {
    intro:
      "Electricity is the flow of electric charge through a conductor — most commonly electrons moving through a wire. It is one of the most fundamental forces in nature and the backbone of all modern technology.\n\nElectricity underlies everything from lightning to the nervous system to the device you're reading this on. Understanding it starts with three core quantities: voltage (the driving force), current (the flow of charge), and resistance (opposition to flow).",
    concepts: [
      {
        title: "Electric Charge and Current",
        description:
          "Electric charge (Q) is a fundamental property of matter. Electrons carry negative charge (−1.6 × 10⁻¹⁹ C). Current (I) is the rate of flow of charge: I = Q/t, measured in Amperes (A). 1 A = 1 coulomb of charge per second. In a wire, billions of electrons flow every second.",
      },
      {
        title: "Voltage (Potential Difference)",
        description:
          'Voltage (V) is the energy per unit charge — the "pressure" that drives current through a circuit. Measured in Volts. A 9V battery provides 9 joules of energy to every coulomb of charge it pushes through the circuit.',
      },
      {
        title: "Ohm's Law",
        description:
          "Ohm's Law: V = IR. Voltage = Current × Resistance. This is the fundamental equation of circuits.\n\nIncrease voltage → more current (if resistance stays the same). Increase resistance → less current (if voltage stays the same). Example: a 12V battery through a 4Ω resistor: I = V/R = 12/4 = 3A.",
      },
      {
        title: "Series and Parallel Circuits",
        description:
          "Series: components connected end-to-end. Same current flows through all. Total resistance = R₁ + R₂ + R₃.\n\nParallel: components connected side-by-side. Same voltage across all. 1/R_total = 1/R₁ + 1/R₂.\n\nHousehold wiring is parallel — each appliance gets the full 230V (or 120V in the US) independently.",
      },
      {
        title: "Power",
        description:
          "P = IV = I²R = V²/R. Power is the rate of energy transfer. A 60W bulb at 230V draws: I = P/V = 60/230 = 0.26 A.\n\nElectricity bills charge for energy: Energy = Power × Time. 1 kWh = using 1000 W for 1 hour.",
      },
    ],
    examples: [
      {
        title: "Lightning — Natural Electricity",
        explanation:
          "Lightning is a massive static electricity discharge. Ice crystals in storm clouds collide and transfer charge, building a potential difference of up to 1 billion volts between cloud and ground. When it exceeds the air's resistance (~3 MV/m), electrons rush through the air in a bolt carrying ~30,000 A for ~0.2 seconds.",
      },
      {
        title: "Household Circuit Breaker",
        explanation:
          "Circuit breakers protect against too much current. When I is too high (overheating risk), a bimetallic strip bends and breaks the circuit. Fuses work by melting. Both use P = I²R — more current = more heat.",
      },
    ],
    deepDive:
      "AC vs DC: batteries provide DC (constant direction). Power plants generate AC (alternating direction, 50/60 Hz) because transformers can change AC voltage efficiently, enabling long-distance transmission at high voltage (low current = low power loss: P = I²R).",
    keyFacts: [
      "Ohm's Law: V = IR",
      "I = Q/t (current = charge per second)",
      "P = IV (power = voltage × current)",
      "Electron charge: 1.6 × 10⁻¹⁹ C",
      "Series: R_total = R₁ + R₂; Parallel: 1/R = 1/R₁ + 1/R₂",
    ],
    resources: [
      {
        title: "Khan Academy: Electricity",
        url: "https://www.khanacademy.org/science/physics/circuits-topic",
      },
      {
        title: "HyperPhysics: Electricity",
        url: "http://hyperphysics.phy-astr.gsu.edu/hbase/electric/elecur.html",
      },
    ],
  },

  thermodynamics: {
    intro:
      "Thermodynamics is the branch of physics that studies heat, energy, and their relationship to work and matter. It defines the rules that govern all energy transformations in the universe — from steam engines to black holes.\n\nThe four laws of thermodynamics describe what energy can and cannot do. They explain why perpetual motion machines are impossible, why your coffee cools down but never heats up spontaneously, and why the universe is moving toward maximum disorder.",
    concepts: [
      {
        title: "Zeroth Law — Thermal Equilibrium",
        description:
          "If A is in thermal equilibrium with B, and B is in equilibrium with C, then A is in equilibrium with C. This defines temperature as a measurable quantity. Objects reach thermal equilibrium by exchanging heat until their temperatures match.",
      },
      {
        title: "First Law — Energy Conservation",
        description:
          "Energy cannot be created or destroyed, only converted. ΔU = Q − W. The change in internal energy = heat added − work done by the system.\n\nA car engine converts chemical energy (fuel) into mechanical work and heat. Not all chemical energy becomes work — some is always lost as heat.",
      },
      {
        title: "Second Law — Entropy Always Increases",
        description:
          "In any spontaneous process, the total entropy (disorder) of the universe increases. Heat flows from hot to cold, never the reverse. A broken glass does not reassemble spontaneously.\n\nEfficiency of heat engines is always less than 100%: Carnot efficiency = 1 − (T_cold/T_hot). The only way to get close to 100% efficiency is for T_hot → ∞ or T_cold → 0 K — both impractical.",
      },
      {
        title: "Third Law — Absolute Zero",
        description:
          "As temperature approaches absolute zero (0 K = −273.15°C), the entropy of a perfect crystal approaches zero. Absolute zero cannot be reached in finite steps — you can get arbitrarily close but never there. Near 0 K, materials exhibit extreme quantum behaviors: superconductivity and superfluidity.",
      },
    ],
    examples: [
      {
        title: "Car Engine — Thermodynamic Cycle",
        explanation:
          "A car engine runs on the Otto cycle. Fuel-air mixture is compressed, ignited (rapid heat addition), expanded (work output), then exhaust gases expelled. The Carnot efficiency limit means even a perfect engine cannot convert all heat to work. Real car engines are ~25–35% efficient.",
      },
      {
        title: "Refrigerator — Heat Pump",
        explanation:
          "A refrigerator uses work to move heat from cold (inside) to hot (outside) — the reverse of natural heat flow. This requires external energy (electricity). The second law says heat won't flow from cold to hot spontaneously — you need to do work. Refrigerators, air conditioners, and heat pumps all operate this way.",
      },
    ],
    deepDive:
      "Statistical mechanics (Boltzmann, Maxwell) shows that thermodynamic laws emerge from the statistics of enormous numbers of particles. Temperature is average kinetic energy. Entropy is the number of available microscopic states. The second law reflects the overwhelming probability that systems evolve toward higher-entropy states.",
    keyFacts: [
      "First Law: ΔU = Q − W",
      "Carnot efficiency = 1 − T_cold/T_hot",
      "Entropy: dS ≥ dQ/T",
      "Absolute zero: 0 K = −273.15°C",
      "Boltzmann constant: k = 1.38 × 10⁻²³ J/K",
    ],
    resources: [
      {
        title: "Khan Academy: Thermodynamics",
        url: "https://www.khanacademy.org/science/physics/thermodynamics",
      },
      {
        title: "HyperPhysics: Thermodynamics",
        url: "http://hyperphysics.phy-astr.gsu.edu/hbase/thermo/thermo.html",
      },
    ],
  },

  dna: {
    intro:
      "DNA (deoxyribonucleic acid) is the molecule that stores genetic information in almost all living organisms. It encodes the instructions for building and operating every cell, tissue, and organ in your body.\n\nDNA is a double helix — two strands of nucleotides coiled around each other, connected by base pairs. It is found in the nucleus of every cell, carrying approximately 3 billion base pairs in humans — enough information to fill a 200-volume encyclopedia.",
    concepts: [
      {
        title: "Structure of DNA",
        description:
          "DNA is a double helix: two complementary strands of nucleotides coiled around each other. Each nucleotide consists of a sugar (deoxyribose), a phosphate group, and one of four bases: Adenine (A), Thymine (T), Guanine (G), or Cytosine (C).\n\nBase pairing rules: A pairs with T; G pairs with C. These hydrogen bonds hold the two strands together and ensure accurate copying.",
      },
      {
        title: "Genes and the Genetic Code",
        description:
          "A gene is a segment of DNA that encodes instructions for making a protein. The genetic code is read in triplets (codons) of three bases. Each codon specifies one amino acid. 64 possible codons encode 20 amino acids plus stop signals.\n\nThe human genome contains ~20,000–25,000 protein-coding genes, but only ~2% of DNA is coding — the rest has regulatory, structural, and other functions.",
      },
      {
        title: "DNA Replication",
        description:
          "Before a cell divides, DNA must be copied. The double helix unzips, and each strand serves as a template. DNA polymerase reads each template strand and builds the complementary strand by adding matching nucleotides.\n\nAccuracy: 1 error per ~10 billion base pairs (with correction mechanisms). The human genome has ~3 billion base pairs — roughly 1 error per 3 divisions.",
      },
      {
        title: "Transcription and Translation",
        description:
          "Gene expression: DNA → mRNA → Protein.\n\nTranscription: RNA polymerase reads the gene and builds a complementary mRNA strand in the nucleus. Translation: the mRNA moves to the ribosome, where tRNA molecules bring amino acids that match each codon. The ribosome strings amino acids into a protein chain.\n\nThis is the Central Dogma of molecular biology.",
      },
    ],
    examples: [
      {
        title: "DNA Fingerprinting",
        explanation:
          "Different people have different numbers of repeated DNA sequences (STRs) at specific locations. PCR amplifies these regions, and gel electrophoresis separates fragments by size. The resulting pattern is unique to each individual (except identical twins). Used in forensics, paternity testing, and identifying disaster victims.",
      },
      {
        title: "CRISPR Gene Editing",
        explanation:
          "CRISPR-Cas9 is a molecular scissors system adapted from bacterial immune systems. A guide RNA matches the target DNA sequence; Cas9 cuts both strands at that location. Scientists can then delete, repair, or insert genes with precision. Clinical trials are using CRISPR to treat sickle cell disease, certain cancers, and genetic blindness.",
      },
    ],
    deepDive:
      "The Human Genome Project (completed 2003) sequenced all 3 billion base pairs of human DNA. It revealed that ~98% of the genome is non-coding, overturning earlier assumptions. Epigenetics — chemical modifications that control which genes are expressed — is now understood to be as important as the DNA sequence itself.",
    keyFacts: [
      "Human genome: ~3 billion base pairs",
      "Base pairing: A-T, G-C",
      "~20,000–25,000 protein-coding genes in humans",
      "Central Dogma: DNA → mRNA → Protein",
      "Double helix discovered by Watson & Crick, 1953 (using Franklin's X-ray data)",
    ],
    resources: [
      {
        title: "Khan Academy: DNA and RNA",
        url: "https://www.khanacademy.org/science/ap-biology/gene-expression-and-regulation",
      },
      {
        title: "Crash Course Biology: DNA",
        url: "https://www.youtube.com/watch?v=8kK2zwjRV0M",
      },
    ],
  },

  evolution: {
    intro:
      "Evolution is the process by which populations of organisms change over generations through natural selection, genetic mutation, and other mechanisms. It is the unifying theory of biology — explaining the diversity of all life on Earth from a common ancestor.\n\nCharles Darwin proposed natural selection in 1859 (On the Origin of Species). Combined with Mendelian genetics and molecular biology, the modern synthesis explains evolution at the molecular, organismal, and population levels.",
    concepts: [
      {
        title: "Natural Selection",
        description:
          "The core mechanism of evolution. Individuals with heritable traits that improve survival and reproduction pass more copies of those traits to the next generation. Over many generations, beneficial traits accumulate in the population.\n\nKey requirements: variation (individuals differ), heritability (traits passed to offspring), and differential reproduction (some variants survive better). These three facts, combined, guarantee evolution occurs.",
      },
      {
        title: "Genetic Mutation and Variation",
        description:
          "Mutations are random changes in DNA sequence — copying errors, radiation damage, or chemical changes. Most are neutral or harmful. Occasionally one improves fitness in a given environment.\n\nSexual reproduction shuffles alleles (gene variants) each generation, creating enormous variation in offspring without waiting for new mutations.",
      },
      {
        title: "Speciation",
        description:
          "Species arise when populations become reproductively isolated (cannot interbreed). Geographic barriers (mountains, oceans) split populations; they diverge independently under different selection pressures until they become too different to produce fertile offspring.\n\nExample: Darwin's finches — a single ancestral finch species arrived in the Galápagos Islands ~2 million years ago and diversified into 15+ species with different beak shapes adapted to different food sources.",
      },
      {
        title: "Evidence for Evolution",
        description:
          "The fossil record shows gradual change over time and documents transitional forms (e.g., Tiktaalik — a fish with proto-limbs transitioning to tetrapods). Comparative anatomy reveals homologous structures (same underlying bone structure in human hands, bat wings, whale flippers). DNA comparison shows closer genetic similarity between more closely related species.",
      },
    ],
    examples: [
      {
        title: "Antibiotic Resistance",
        explanation:
          "A clear demonstration of evolution in real time. A population of bacteria is exposed to an antibiotic. Most die, but a few have random mutations that confer resistance. These survive and reproduce. Within days, the population is dominated by resistant individuals. This is why finishing antibiotic courses and not overusing antibiotics matters — we're directly managing natural selection.",
      },
      {
        title: "Peppered Moth — Industrial Melanism",
        explanation:
          "Before the Industrial Revolution, light-colored peppered moths dominated in England — they were camouflaged against light-colored lichen on trees. After coal-burning darkened tree bark with soot, dark-colored moths were better camouflaged. Dark moths increased from <1% to >90% in polluted areas within decades. After pollution controls, light moths rebounded.",
      },
    ],
    deepDive:
      "Modern evolutionary theory includes mechanisms beyond natural selection: genetic drift (random changes in small populations), sexual selection (traits chosen by mates), gene flow (migration between populations), and horizontal gene transfer (bacteria swapping genes directly). Evolution operates at multiple levels: gene, organism, and population.",
    keyFacts: [
      "Darwin: On the Origin of Species, 1859",
      "Modern synthesis: Darwinian selection + Mendelian genetics + molecular biology",
      "All life on Earth shares a common ancestor (~3.8 billion years ago)",
      "DNA sequences are ~98.7% identical between humans and chimpanzees",
      "Evolution has no direction or goal — it is purely driven by environment and chance",
    ],
    resources: [
      {
        title: "Khan Academy: Evolution",
        url: "https://www.khanacademy.org/science/ap-biology/natural-selection",
      },
      {
        title: "Understanding Evolution (UC Berkeley)",
        url: "https://evolution.berkeley.edu",
      },
    ],
  },

  javascript: {
    intro:
      "JavaScript is the programming language of the web — the only language that runs natively in every web browser. It makes web pages interactive: handling clicks, animations, API calls, and real-time updates without reloading the page.\n\nCreated by Brendan Eich in 10 days in 1995, JavaScript has grown into a full-stack language (Node.js) and the foundation of frameworks like React, Vue, and Angular. It is the most widely deployed programming language in existence.",
    concepts: [
      {
        title: "Variables and Data Types",
        description:
          'Three ways to declare variables: var (old, function-scoped), let (block-scoped, reassignable), const (block-scoped, not reassignable).\n\nPrimitive types: string, number, boolean, null, undefined, symbol, BigInt. Complex type: object (includes arrays, functions).\n\nType coercion: JavaScript automatically converts types in expressions, which can cause surprises: "5" + 3 = "53" (string concat), but "5" - 3 = 2 (numeric). Use === (strict equality) instead of == to avoid coercion.',
      },
      {
        title: "Functions and Closures",
        description:
          "Functions are first-class objects: assigned to variables, passed as arguments, returned from other functions.\n\nClosure: a function retains access to variables from its outer scope even after the outer function returns. This is the basis of modules, private data, and callbacks in JavaScript.\n\nArrow functions (ES6+): const add = (a, b) => a + b. Shorter syntax, lexical this (inherits from enclosing context).",
      },
      {
        title: "Asynchronous JavaScript",
        description:
          "JavaScript is single-threaded but non-blocking. Async operations use callbacks, Promises, or async/await.\n\nPromise: represents a future value. .then() handles success, .catch() handles error. async/await makes async code look synchronous:\n\nasync function getData() {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}",
      },
      {
        title: "The DOM (Document Object Model)",
        description:
          'The DOM is the browser\'s representation of the HTML page as a tree of objects. JavaScript can read and modify it: change text, style, add/remove elements, react to events.\n\ndocument.getElementById("title").textContent = "Hello";\ndocument.querySelector(".button").addEventListener("click", handleClick);',
      },
    ],
    examples: [
      {
        title: "Fetching Data from an API",
        explanation:
          "async function getWeather(city) {\n  const url = `https://api.open-meteo.com/v1/forecast?latitude=52&longitude=13`;\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}\n\nThis fetches live weather data without reloading the page. fetch() returns a Promise; await waits for it to resolve.",
      },
      {
        title: "Event Handling — Click Counter",
        explanation:
          'let count = 0;\nconst btn = document.getElementById("counter");\nbtn.addEventListener("click", () => {\n  count++;\n  btn.textContent = `Clicked ${count} times`;\n});\n\nEach click increments the counter and updates the button text. Closure: the click handler retains access to count from the outer scope.',
      },
    ],
    deepDive:
      "The event loop is JavaScript's concurrency model. The call stack executes synchronous code. Async callbacks queue in the task queue (setTimeout, events) or microtask queue (Promises, async/await — higher priority). The event loop moves tasks to the call stack when it's empty.\n\nPrototype chain: object inheritance in JS. Every object has a prototype — a parent object it inherits methods from. Classes (ES6+) are syntactic sugar over prototype inheritance.",
    keyFacts: [
      "Created by Brendan Eich in 10 days (1995) for Netscape",
      'typeof null === "object" — a famous JS bug preserved for backward compatibility',
      "NaN !== NaN (NaN is not equal to itself)",
      "0.1 + 0.2 = 0.30000000000000004 (floating point precision)",
      "V8 (Chrome/Node.js), SpiderMonkey (Firefox), JavaScriptCore (Safari)",
    ],
    resources: [
      {
        title: "MDN JavaScript Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
      },
      {
        title: "You Don't Know JS (Free)",
        url: "https://github.com/getify/You-Dont-Know-JS",
      },
    ],
  },

  python: {
    intro:
      "Python is a high-level, dynamically typed programming language known for its clean syntax and readability. It is designed to be easy to learn while being powerful enough for professional work.\n\nPython is used in web development (Django, Flask), data science (pandas, NumPy, scikit-learn), machine learning (TensorFlow, PyTorch), automation, scripting, and scientific computing. It is consistently among the top two most popular programming languages worldwide.",
    concepts: [
      {
        title: "Python Philosophy",
        description:
          'The Zen of Python (PEP 20): "Readability counts." "There should be one — and preferably only one — obvious way to do it." Python enforces this through indentation-based scoping (no curly braces), clean syntax, and a standard library that follows consistent conventions.\n\nRun `import this` in any Python interpreter to see the full Zen.',
      },
      {
        title: "Data Types and Collections",
        description:
          "Built-in types: int, float, str, bool, None. Collections: list (mutable, ordered), tuple (immutable), dict (key-value pairs), set (unique values).\n\nList comprehension: [x**2 for x in range(10) if x % 2 == 0] creates [0, 4, 16, 36, 64] in one line. Dict comprehension: {k: v for k, v in zip(keys, values)}.",
      },
      {
        title: "Functions and Modules",
        description:
          "def function_name(param, default_param=value): → return value. Functions are first-class objects.\n\n*args collects positional arguments into a tuple. **kwargs collects keyword arguments into a dict.\n\nModules: import math, datetime, os, json, etc. Install third-party packages with pip: pip install requests numpy pandas.",
      },
      {
        title: "Object-Oriented Python",
        description:
          'class Animal:\n    def __init__(self, name): self.name = name\n    def speak(self): return f"{self.name} says hi"\n\nclass Dog(Animal):\n    def speak(self): return f"{self.name} says woof"\n\nInheritance, polymorphism, and encapsulation work through class hierarchies. Python uses duck typing: if it has a .speak() method, it can be treated as an Animal.',
      },
    ],
    examples: [
      {
        title: "File Reading and Data Processing",
        explanation:
          'with open("data.csv") as f:\n    lines = f.readlines()\n\nresults = [line.split(",")[2] for line in lines[1:]]\nprint(f"Average: {sum(map(float, results)) / len(results)}")\n\nwith statement automatically closes the file. List comprehension processes each line. f-strings format output.',
      },
      {
        title: "Web Scraping with requests",
        explanation:
          'import requests\nfrom bs4 import BeautifulSoup\n\nresponse = requests.get("https://example.com")\nsoup = BeautifulSoup(response.text, "html.parser")\ntitles = [h2.text for h2 in soup.find_all("h2")]\nprint(titles)',
      },
    ],
    deepDive:
      "Python's performance limitation (the Global Interpreter Lock prevents true multi-threading) is addressed by multiprocessing, async/await (asyncio), and compiled extensions (NumPy operations are in C). For CPU-intensive tasks, Python calls into C/C++/Fortran under the hood — which is why NumPy and TensorFlow are fast despite Python's slowness.",
    keyFacts: [
      "Created by Guido van Rossum, 1991",
      "Python 3.x (current); Python 2 end-of-life January 2020",
      "Indentation is syntax — 4 spaces per level is PEP 8 standard",
      "GIL (Global Interpreter Lock) limits true multi-threading",
      "pip install is the package manager; PyPI has 500,000+ packages",
    ],
    resources: [
      {
        title: "Python Official Tutorial",
        url: "https://docs.python.org/3/tutorial/",
      },
      { title: "Real Python", url: "https://realpython.com" },
    ],
  },

  gravity: {
    intro:
      "Gravity is the fundamental force of attraction between all objects with mass. It is the weakest of the four fundamental forces but operates over infinite range, shaping the large-scale structure of the universe.\n\nNewton described gravity as a force (1687). Einstein redefined it as the curvature of spacetime caused by mass (1915). Both descriptions are accurate in their domains — Newton's for everyday scales, Einstein's for extreme masses and velocities.",
    concepts: [
      {
        title: "Newton's Law of Universal Gravitation",
        description:
          "F = G × m₁m₂ / r². Every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between them.\n\nG = 6.674 × 10⁻¹¹ N·m²/kg² (gravitational constant). Earth-Moon distance: ~384,000 km. Earth pulls the Moon with ~2 × 10²⁰ N.",
      },
      {
        title: "Einstein's General Relativity",
        description:
          "Mass curves spacetime. Objects follow the straightest possible paths (geodesics) through curved spacetime — and these curved paths look like attraction to us.\n\nA useful analogy: a bowling ball on a trampoline curves the sheet. A marble rolls toward the bowling ball not because it's attracted, but because the curved surface guides it. Gravity is geometry.",
      },
      {
        title: "Gravitational Effects",
        description:
          "Tides: the Moon's gravity pulls Earth's oceans more strongly on the near side than the far side, creating two bulges. Orbital mechanics: the Moon orbits Earth because its horizontal velocity combined with gravitational acceleration keeps it in a closed orbit. Black holes: mass so concentrated that escape velocity exceeds c.",
      },
    ],
    examples: [
      {
        title: "Orbital Motion — Why the Moon Doesn't Fall",
        explanation:
          "The Moon is constantly falling toward Earth — but it's also moving sideways fast enough that it keeps missing. Orbital velocity: v = √(GM/r) ≈ 1 km/s for the Moon. Every second, the Moon falls ~1.4 mm toward Earth, but moves ~1 km sideways. The curved Earth surface \"falls away\" at the same rate. That's an orbit.",
      },
      {
        title: "Gravitational Time Dilation",
        explanation:
          "Time passes slower in stronger gravitational fields (Einstein). GPS satellites orbit at high altitude (weaker gravity) and also move fast (time dilation from velocity). Without corrections for both effects, GPS positions would drift by ~10 km per day. General relativity corrections keep GPS accurate to centimeters.",
      },
    ],
    deepDive:
      "Gravitational waves — ripples in spacetime — were predicted by Einstein in 1916 and first detected by LIGO in 2015 from two merging black holes 1.3 billion light-years away. The signal lasted 0.2 seconds. Quantum gravity (reconciling general relativity with quantum mechanics) remains physics' greatest unsolved problem.",
    keyFacts: [
      "F = Gm₁m₂/r² (Newton)",
      "G = 6.674 × 10⁻¹¹ N·m²/kg²",
      "g on Earth surface = 9.8 m/s²",
      "Escape velocity from Earth = 11.2 km/s",
      "LIGO first detected gravitational waves: September 14, 2015",
    ],
    resources: [
      {
        title: "Khan Academy: Gravity",
        url: "https://www.khanacademy.org/science/physics/centripetal-force-and-gravitation",
      },
      {
        title: "Einstein Online: General Relativity",
        url: "https://www.einstein-online.info/en/spotlights/gravity/",
      },
    ],
  },
};

export function getTopicFallback(topic: string): TopicContent | null {
  const key = topic.toLowerCase().trim();
  if (FALLBACK_TOPICS[key]) return FALLBACK_TOPICS[key];
  // Partial match
  for (const [k, v] of Object.entries(FALLBACK_TOPICS)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}
