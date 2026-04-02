export type Niche =
  | "restaurant"
  | "fitness"
  | "portfolio"
  | "ecommerce"
  | "blog"
  | "healthcare"
  | "tech"
  | "realestate"
  | "salon"
  | "education"
  | "photography"
  | "engineering"
  | "general";

export function detectNiche(input: string): Niche {
  const text = input.toLowerCase();

  // Engineering/STEM — check before tech to avoid collision
  if (
    /engineer|engineering|automobile|automotive|car part|vehicle|mechanical|3d model|3d assembly|assembly|stem|robotics|aerospace|civil|electrical engineer|manufacturing|blueprint|cad|schematic|coding students|technical students/.test(
      text,
    )
  )
    return "engineering";

  // Restaurant / Food
  if (
    /restaurant|food|cuisine|cafe|diner|bakery|bistro|eatery|catering|eat|dish|chef|cook|menu|dining|takeout|takeaway|burger|pizza|sushi|bbq|grill|bake|pastry|dessert/.test(
      text,
    )
  )
    return "restaurant";

  // Fitness / Wellness
  if (
    /fitness|gym|workout|yoga|pilates|personal train|crossfit|health club|trainer|exercise|weightlift|bootcamp|spin class|zumba|martial arts|boxing|wellness studio/.test(
      text,
    )
  )
    return "fitness";

  // Healthcare / Medical
  if (
    /health|medical|doctor|clinic|hospital|dental|dentist|therapy|therapist|physiotherapy|optician|pharmacy|nurse|pediatric|orthopedic|mental health|counseling|patient/.test(
      text,
    )
  )
    return "healthcare";

  // Real Estate
  if (
    /real estate|realtor|property|house|apartment|rent|buy home|mortgage|housing|estate agent|listing|lease|condo|villa|townhouse|land sale/.test(
      text,
    )
  )
    return "realestate";

  // Salon / Beauty
  if (
    /salon|beauty|spa|nail|hair|barber|makeup|skincare|wax|facial|lash|brow|tanning|cosmetic/.test(
      text,
    )
  )
    return "salon";

  // Education / Courses
  if (
    /education|school|course|learn|teach|tutor|academy|training|lesson|class|workshop|university|college|student|curriculum|e-learning|online course|lecture|seminar/.test(
      text,
    )
  )
    return "education";

  // Photography / Videography
  if (
    /photo|photography|videography|camera|portrait|wedding photo|event photo|shoot|cinematograph|filmmaker|drone footage/.test(
      text,
    )
  )
    return "photography";

  // E-commerce / Shopping
  if (
    /shop|store|ecommerce|e-commerce|product|sell|retail|merchandise|marketplace|boutique|buy|cart|checkout|inventory|dropship|print-on-demand/.test(
      text,
    )
  )
    return "ecommerce";

  // Blog / Content
  if (
    /blog|journal|write|content|news|magazine|publication|newsletter|podcast|article|column|editorial|creator/.test(
      text,
    )
  )
    return "blog";

  // Portfolio / Creative
  if (
    /portfolio|freelance|designer|developer|artist|creative|illustrator|architect|showcase|graphic design|ux|ui designer|motion design|animator/.test(
      text,
    )
  )
    return "portfolio";

  // Tech / SaaS
  if (
    /tech|startup|software|saas|app|platform|ai|digital|cloud|api|devtool|b2b|dashboard product|mobile app|web app|product launch/.test(
      text,
    )
  )
    return "tech";

  return "general";
}

export interface Question {
  id: string;
  text: string;
  type: "text" | "quick-select";
  options?: string[];
  placeholder?: string;
}

export interface ColorPalette {
  name: string;
  description: string;
  colors: string[];
  colorNames: string[];
}

export const nichePalettes: Record<Niche, ColorPalette[]> = {
  restaurant: [
    {
      name: "Warm Appetite",
      description: "Rich, inviting tones that stimulate hunger and warmth",
      colors: ["#8B1A1A", "#E0631A", "#F5E6C8", "#5C3317", "#C9A84C"],
      colorNames: ["Deep Red", "Warm Orange", "Cream", "Brown", "Gold"],
    },
    {
      name: "Fresh & Modern",
      description: "Garden-fresh colors for a contemporary dining experience",
      colors: ["#1A4731", "#6BBE3B", "#FFFFFF", "#D4C5A9", "#C75B3A"],
      colorNames: ["Dark Green", "Lime", "White", "Sand", "Terracotta"],
    },
  ],
  fitness: [
    {
      name: "Power Zone",
      description: "High-energy contrast for maximum motivation",
      colors: ["#111111", "#FFE600", "#2A2A2A", "#CC0000", "#FFFFFF"],
      colorNames: ["Jet Black", "Electric Yellow", "Dark Gray", "Red", "White"],
    },
    {
      name: "Clean Energy",
      description: "Refreshing and balanced for a wellness-focused brand",
      colors: ["#0AACAC", "#FFFFFF", "#B8E3E9", "#2E3840", "#FF6B6B"],
      colorNames: ["Teal", "White", "Light Blue", "Charcoal", "Coral"],
    },
  ],
  portfolio: [
    {
      name: "Monochrome Elite",
      description: "Sophisticated and timeless — let your work shine",
      colors: ["#0A0A0A", "#FFFFFF", "#5A5A5A", "#D9D9D9", "#2A2A2A"],
      colorNames: ["Black", "White", "Mid Gray", "Light Gray", "Charcoal"],
    },
    {
      name: "Warm Minimal",
      description: "Soft, human warmth with editorial elegance",
      colors: ["#F5F0EA", "#9E9189", "#7A6A5E", "#C9A8A0", "#1A1A1A"],
      colorNames: ["Off-White", "Warm Gray", "Taupe", "Dusty Rose", "Black"],
    },
  ],
  ecommerce: [
    {
      name: "Convert & Sell",
      description: "Bold call-to-actions that drive conversions",
      colors: ["#E04E1A", "#FFFFFF", "#2D2D2D", "#FFD93D", "#0D0D0D"],
      colorNames: ["Deep Orange", "White", "Charcoal", "Yellow", "Black"],
    },
    {
      name: "Premium Shop",
      description: "Luxury feel for high-end product lines",
      colors: ["#0A0A0A", "#C9A84C", "#FFFFFF", "#B0B0B0", "#7A0020"],
      colorNames: ["Midnight", "Gold", "White", "Silver", "Deep Red"],
    },
  ],
  blog: [
    {
      name: "Editorial Calm",
      description: "Clean and readable for long-form content",
      colors: ["#FAFAF8", "#1A1A2E", "#4A4A6A", "#E8E0D5", "#C0392B"],
      colorNames: [
        "Parchment",
        "Dark Navy",
        "Slate Purple",
        "Warm Beige",
        "Accent Red",
      ],
    },
    {
      name: "Modern Ink",
      description: "Bold typographic feel with punchy accents",
      colors: ["#F0F0F0", "#111111", "#FF6B35", "#888888", "#FFFFFF"],
      colorNames: ["Light Gray", "Black", "Orange", "Gray", "White"],
    },
  ],
  healthcare: [
    {
      name: "Trust & Care",
      description: "Calm and professional, building patient confidence",
      colors: ["#1A5FA8", "#FFFFFF", "#B8D4F0", "#E8EEF5", "#2ECC71"],
      colorNames: ["Royal Blue", "White", "Soft Blue", "Light Gray", "Green"],
    },
    {
      name: "Healing Warmth",
      description: "Approachable and warm for holistic wellness",
      colors: ["#0AACAC", "#FFFFFF", "#FFB347", "#FFF5E6", "#0A6E6E"],
      colorNames: ["Teal", "White", "Soft Orange", "Light Beige", "Dark Teal"],
    },
  ],
  tech: [
    {
      name: "Digital Future",
      description: "Clean and innovative for modern SaaS products",
      colors: ["#0B1F33", "#39C6C6", "#FFFFFF", "#B8D4F0", "#7B2FBE"],
      colorNames: ["Deep Navy", "Teal", "White", "Light Blue", "Purple"],
    },
    {
      name: "Bold Innovation",
      description: "High-contrast impact for disruptive tech brands",
      colors: ["#0A0A0A", "#0066FF", "#FFFFFF", "#5A5A5A", "#00CFFF"],
      colorNames: ["Black", "Electric Blue", "White", "Mid Gray", "Cyan"],
    },
  ],
  realestate: [
    {
      name: "Prestige",
      description: "Premium and trustworthy for luxury properties",
      colors: ["#0B1F33", "#C9A84C", "#FFFFFF", "#D0D0D0", "#2A2A2A"],
      colorNames: ["Dark Navy", "Gold", "White", "Light Gray", "Charcoal"],
    },
    {
      name: "Modern Living",
      description: "Fresh and welcoming for contemporary real estate",
      colors: ["#4A5568", "#FFFFFF", "#2EAE9E", "#BEE3F8", "#2D6A4F"],
      colorNames: ["Slate", "White", "Teal", "Light Blue", "Dark Green"],
    },
  ],
  salon: [
    {
      name: "Luxe",
      description: "Rose gold glamour for premium beauty brands",
      colors: ["#B76E79", "#F4C2C2", "#FFFFFF", "#F7E7CE", "#2A2A2A"],
      colorNames: [
        "Rose Gold",
        "Blush Pink",
        "White",
        "Champagne",
        "Dark Charcoal",
      ],
    },
    {
      name: "Bold Glam",
      description: "Drama and dazzle for statement beauty services",
      colors: ["#4A0E5C", "#C9A84C", "#0A0A0A", "#FFFFFF", "#FF6B6B"],
      colorNames: ["Deep Purple", "Gold", "Black", "White", "Coral"],
    },
  ],
  education: [
    {
      name: "Knowledge Hub",
      description: "Classic and trustworthy for serious learning",
      colors: ["#1A5FA8", "#FFFFFF", "#FFD93D", "#9E9E9E", "#0D2E6E"],
      colorNames: ["Royal Blue", "White", "Yellow", "Gray", "Dark Blue"],
    },
    {
      name: "Creative Learn",
      description: "Vibrant and playful to inspire curiosity",
      colors: ["#FF6B35", "#0AACAC", "#FFFFFF", "#7B2FBE", "#E8E8E8"],
      colorNames: ["Orange", "Teal", "White", "Purple", "Light Gray"],
    },
  ],
  photography: [
    {
      name: "Monochrome Elite",
      description: "Timeless black and white for visual storytellers",
      colors: ["#0A0A0A", "#FFFFFF", "#5A5A5A", "#D9D9D9", "#2A2A2A"],
      colorNames: ["Black", "White", "Mid Gray", "Light Gray", "Charcoal"],
    },
    {
      name: "Golden Hour",
      description: "Warm film-like tones for emotional storytelling",
      colors: ["#1A1209", "#C9A84C", "#F5E6D0", "#8B6914", "#FFFFFF"],
      colorNames: ["Dark Brown", "Gold", "Warm Cream", "Amber", "White"],
    },
  ],
  engineering: [
    {
      name: "Industrial Precision",
      description: "Bold, technical feel inspired by automotive design studios",
      colors: ["#0D1B2A", "#E63946", "#FFFFFF", "#A8DADC", "#457B9D"],
      colorNames: [
        "Deep Navy",
        "Red Accent",
        "White",
        "Light Blue",
        "Steel Blue",
      ],
    },
    {
      name: "Blueprint",
      description: "Classic engineering blueprint aesthetic",
      colors: ["#003566", "#FFFFFF", "#FFD60A", "#00B4D8", "#1B263B"],
      colorNames: ["Blueprint Blue", "White", "Yellow", "Cyan", "Dark Navy"],
    },
  ],
  general: [
    {
      name: "Modern Minimal",
      description: "Clean, versatile, and universally appealing",
      colors: ["#4A5568", "#FFFFFF", "#0A0A0A", "#9E9E9E", "#0066FF"],
      colorNames: ["Slate", "White", "Black", "Gray", "Blue"],
    },
    {
      name: "Vibrant Pro",
      description: "Bold and energetic for brands that want to stand out",
      colors: ["#7B2FBE", "#0AACAC", "#FFFFFF", "#FF6B6B", "#FFD93D"],
      colorNames: ["Purple", "Teal", "White", "Coral", "Yellow"],
    },
  ],
};

export const nicheLabels: Record<Niche, string> = {
  restaurant: "Restaurant & Food",
  fitness: "Fitness & Wellness",
  portfolio: "Portfolio & Creative",
  ecommerce: "E-commerce & Shop",
  blog: "Blog & Content",
  healthcare: "Healthcare & Medical",
  tech: "Tech & SaaS",
  realestate: "Real Estate",
  salon: "Salon & Beauty",
  education: "Education & Courses",
  photography: "Photography",
  engineering: "Engineering & STEM",
  general: "General Business",
};

// Legacy compatibility — used by BuilderWizard
export function getQuestionsForNiche(_niche: Niche): Question[] {
  return [];
}
