import { AnimatePresence, motion } from "motion/react";
import type { CollectedData } from "../ChatBuilder";

interface WebsitePreviewProps {
  data: CollectedData;
}

const NICHE_SERVICES: Record<string, string[]> = {
  restaurant: ["Dine In", "Takeout & Delivery", "Catering", "Private Events"],
  fitness: [
    "Personal Training",
    "Group Classes",
    "Nutrition Coaching",
    "Online Plans",
  ],
  portfolio: ["Web Design", "Branding", "UI/UX", "Illustration"],
  ecommerce: ["New Arrivals", "Best Sellers", "Sale Items", "Gift Cards"],
  blog: ["Latest Posts", "Trending Topics", "Newsletter", "Archives"],
  healthcare: ["Consultations", "Preventive Care", "Lab Tests", "Follow-ups"],
  tech: ["Product Overview", "Integrations", "API Docs", "Support"],
  realestate: ["Buy a Home", "Sell Property", "Rentals", "Free Valuation"],
  salon: ["Hair Services", "Nail Art", "Skin Care", "Bridal Packages"],
  education: [
    "Live Classes",
    "Self-Paced Courses",
    "1-on-1 Tutoring",
    "Certification",
  ],
  photography: ["Portraits", "Events", "Commercial", "Prints & Licensing"],
  general: ["Our Services", "About Us", "Portfolio", "Contact"],
};

const SERVICE_ICONS = ["★", "◆", "✦", "●"];

export default function WebsitePreview({ data }: WebsitePreviewProps) {
  const palette = data.palette;
  const primary = palette?.colors[0] ?? "#0B1F33";
  const accent = palette?.colors[1] ?? "#39C6C6";
  const bgColor = palette?.colors[2] ?? "#FFFFFF";
  const mutedColor = palette?.colors[3] ?? "#E8EEF5";

  const name = data.businessName || "Your Business";
  const tagline =
    data.tagline || "We're building something amazing just for you";
  const services =
    data.niche && NICHE_SERVICES[data.niche]
      ? NICHE_SERVICES[data.niche]
      : NICHE_SERVICES.general;

  const firstAnswer = Object.values(data.answers).find(Boolean);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-card-lg border border-gray-200"
      style={{ background: bgColor }}
      data-ocid="preview.panel"
    >
      {/* Browser chrome */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200 max-w-xs mx-auto text-center">
          {name.toLowerCase().replace(/\s+/g, "")}.com
        </div>
      </div>

      {/* Website content */}
      <div className="overflow-hidden">
        {/* Nav */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: primary }}
        >
          <span className="text-sm font-bold" style={{ color: accent }}>
            {name}
          </span>
          <div className="flex gap-4">
            {["Home", "Services", "About", "Contact"].map((item) => (
              <span
                key={item}
                className="text-xs opacity-70"
                style={{ color: bgColor }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <motion.div
          key={`hero-${primary}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="px-8 py-10 text-center"
          style={{ backgroundColor: primary }}
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-extrabold mb-3 leading-tight"
              style={{ color: bgColor }}
            >
              {name}
            </motion.h1>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={tagline}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-sm mb-5 opacity-80 max-w-xs mx-auto"
              style={{ color: bgColor }}
            >
              {tagline}
            </motion.p>
          </AnimatePresence>
          {firstAnswer && (
            <span
              className="inline-block text-xs px-2 py-1 rounded-full font-medium mb-5 opacity-80"
              style={{ backgroundColor: accent, color: primary }}
            >
              {firstAnswer}
            </span>
          )}
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={{ backgroundColor: accent, color: primary }}
            >
              Get Started
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-bold border opacity-70"
              style={{ borderColor: bgColor, color: bgColor }}
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Services */}
        <div className="px-6 py-8" style={{ backgroundColor: bgColor }}>
          <h2
            className="text-base font-bold text-center mb-5"
            style={{ color: primary }}
          >
            What We Offer
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {services.slice(0, 4).map((service, i) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-3 rounded-xl border"
                style={{ borderColor: mutedColor, backgroundColor: mutedColor }}
              >
                <div
                  className="w-6 h-6 rounded-lg mb-2 flex items-center justify-center text-xs"
                  style={{ backgroundColor: accent }}
                >
                  {SERVICE_ICONS[i % SERVICE_ICONS.length]}
                </div>
                <p className="text-xs font-semibold" style={{ color: primary }}>
                  {service}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* About strip */}
        <div className="px-6 py-6" style={{ backgroundColor: mutedColor }}>
          <h2 className="text-sm font-bold mb-2" style={{ color: primary }}>
            About Us
          </h2>
          <p
            className="text-xs leading-relaxed opacity-70"
            style={{ color: primary }}
          >
            {`Welcome to ${name}. ${tagline}. We're dedicated to delivering exceptional experiences to every client we serve.`}
          </p>
        </div>

        {/* Contact */}
        {data.contactForm !== false && (
          <div className="px-6 py-7" style={{ backgroundColor: bgColor }}>
            <h2
              className="text-sm font-bold text-center mb-4"
              style={{ color: primary }}
            >
              Contact Us
            </h2>
            <div className="max-w-xs mx-auto flex flex-col gap-2">
              <div
                className="h-7 rounded-lg border text-xs px-3 flex items-center opacity-40"
                style={{ borderColor: mutedColor, color: primary }}
              >
                Your name
              </div>
              <div
                className="h-7 rounded-lg border text-xs px-3 flex items-center opacity-40"
                style={{ borderColor: mutedColor, color: primary }}
              >
                Email address
              </div>
              <div
                className="h-14 rounded-lg border text-xs px-3 py-2 opacity-40"
                style={{ borderColor: mutedColor, color: primary }}
              >
                Your message...
              </div>
              <button
                type="button"
                className="py-2 rounded-lg text-xs font-bold"
                style={{ backgroundColor: primary, color: bgColor }}
              >
                Send Message
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="px-6 py-4 text-center"
          style={{ backgroundColor: primary }}
        >
          <p className="text-xs opacity-60" style={{ color: bgColor }}>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
