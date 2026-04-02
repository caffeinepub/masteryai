import { Button } from "@/components/ui/button";
import { Check, Copy, Download, Edit2, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type ColorPalette,
  type Niche,
  nicheLabels,
} from "../../data/nicheData";
import type { WizardState } from "../BuilderWizard";

interface StepPreviewProps {
  wizardState: WizardState & { niche: Niche; selectedPalette: ColorPalette };
  onRestart: () => void;
  onEdit: () => void;
}

function lighten(hex: string, amount = 0.85): string {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `rgb(${lr}, ${lg}, ${lb})`;
}

export default function StepPreview({
  wizardState,
  onRestart,
  onEdit,
}: StepPreviewProps) {
  const [copied, setCopied] = useState(false);
  const { answers, selectedPalette, niche } = wizardState;

  const businessName = answers.business_name || "Your Business";
  const tagline = answers.tagline || "Welcome to our website";
  const hasContact = answers.contact_form === "Yes";
  const [primary, secondary, light, dark, accent] = selectedPalette.colors;

  // Derive sections based on niche + answers
  const services: string[] = [];
  if (niche === "restaurant") {
    services.push(
      "Dine In",
      "Catering",
      "Private Events",
      answers.menu === "Yes" ? "Online Menu" : "Chef Specials",
    );
  } else if (niche === "fitness") {
    const svc = answers.services || "Personal Training";
    services.push(
      svc,
      "Nutrition Coaching",
      "Progress Tracking",
      answers.booking === "Yes" ? "Online Booking" : "Drop-In Classes",
    );
  } else if (niche === "portfolio") {
    services.push("UI/UX Design", "Brand Identity", "Web Design", "Consulting");
  } else if (niche === "ecommerce") {
    services.push(
      answers.products || "Products",
      "Free Shipping",
      "Easy Returns",
      "Secure Checkout",
    );
  } else if (niche === "tech") {
    services.push("Dashboard", "Analytics", "Integrations", "API Access");
  } else if (niche === "healthcare") {
    services.push(
      "Consultation",
      "Treatment Plans",
      answers.appointment === "Yes" ? "Online Booking" : "Walk-in Welcome",
      "Follow-up Care",
    );
  } else if (niche === "realestate") {
    services.push(
      "Buy Properties",
      "Sell Properties",
      "Property Valuation",
      "Market Analysis",
    );
  } else if (niche === "salon") {
    const svc = answers.services || "Hair, Nails, Skincare";
    services.push(
      ...svc
        .split(",")
        .map((s: string) => s.trim())
        .slice(0, 3),
      answers.booking === "Yes" ? "Online Booking" : "Walk-in Welcome",
    );
  } else if (niche === "education") {
    services.push(
      answers.subject || "Core Subjects",
      "Live Sessions",
      answers.online !== "In-person only"
        ? "Online Courses"
        : "In-person Classes",
      "Certificates",
    );
  } else {
    services.push(
      "Our Services",
      "Quality Work",
      "Fast Delivery",
      "Support 24/7",
    );
  }

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Inter, sans-serif; color: #333; }
    .hero { background-color: ${primary}; color: ${light}; padding: 80px 40px; text-align: center; }
    .hero h1 { font-size: 3rem; font-weight: 800; margin-bottom: 12px; }
    .hero p { font-size: 1.2rem; opacity: 0.85; margin-bottom: 32px; }
    .btn { background: ${accent}; color: ${dark}; padding: 14px 32px; border-radius: 50px; font-weight: 700; text-decoration: none; display: inline-block; }
    .section { padding: 72px 40px; max-width: 1100px; margin: 0 auto; }
    .section h2 { font-size: 2rem; font-weight: 700; color: ${primary}; margin-bottom: 40px; text-align: center; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; }
    .card { background: ${light}; border: 1px solid ${secondary}20; border-radius: 12px; padding: 28px; }
    .card h3 { font-size: 1rem; font-weight: 700; color: ${primary}; margin-bottom: 8px; }
    .card p { font-size: 0.9rem; color: #666; }
    .contact { background: ${secondary}; padding: 72px 40px; text-align: center; }
    .contact h2 { font-size: 2rem; font-weight: 700; color: ${light}; margin-bottom: 16px; }
    footer { background: ${dark}; color: ${light}; padding: 24px 40px; text-align: center; font-size: 0.85rem; opacity: 0.8; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${businessName}</h1>
    <p>${tagline}</p>
    <a href="#contact" class="btn">Get Started</a>
  </div>
  <div class="section">
    <h2>Our Services</h2>
    <div class="grid">
      ${services.map((s) => `<div class="card"><h3>${s}</h3><p>Premium quality service delivered with passion and expertise.</p></div>`).join("\n      ")}
    </div>
  </div>
  ${hasContact ? `<div class="contact" id="contact"><h2>Get in Touch</h2><p style="color:${light};opacity:0.8;margin-bottom:24px">We'd love to hear from you!</p><a href="mailto:hello@${businessName.toLowerCase().replace(/\s+/g, "")}.com" class="btn">Contact Us</a></div>` : ""}
  <footer><p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p></footer>
</body>
</html>`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateHTML());
      setCopied(true);
      toast.success("HTML copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generateHTML()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${businessName.toLowerCase().replace(/\s+/g, "-")}-website.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Website downloaded!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-navy-deep mb-1">
            Your Website is Ready! 🎉
          </h2>
          <p className="text-gray-500 text-sm">
            Built for{" "}
            <span className="font-semibold text-navy-deep">
              {nicheLabels[niche]}
            </span>{" "}
            using the{" "}
            <span className="font-semibold text-teal">
              {selectedPalette.name}
            </span>{" "}
            palette
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="rounded-full border-card-border text-gray-600 gap-1.5"
            data-ocid="preview.edit.button"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="rounded-full border-card-border text-gray-600 gap-1.5"
            data-ocid="preview.copy.button"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-teal" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy HTML"}
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="bg-teal hover:bg-teal-dark text-navy-deep font-semibold rounded-full gap-1.5"
            data-ocid="preview.download.button"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </Button>
        </div>
      </div>

      {/* Website Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden border border-card-border card-shadow-lg mb-6"
        data-ocid="preview.canvas_target"
      >
        {/* Browser Chrome */}
        <div className="bg-gray-100 border-b border-card-border px-4 py-2.5 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded text-xs text-gray-400 px-3 py-1 font-mono">
            {businessName.toLowerCase().replace(/\s+/g, "")}.com
          </div>
        </div>

        {/* Hero Section */}
        <div
          className="px-10 py-14 text-center"
          style={{ backgroundColor: primary }}
        >
          <h1 className="text-4xl font-extrabold mb-3" style={{ color: light }}>
            {businessName}
          </h1>
          <p className="text-lg mb-6 opacity-80" style={{ color: light }}>
            {tagline}
          </p>
          <button
            type="button"
            className="px-7 py-3 rounded-full font-bold text-sm"
            style={{ backgroundColor: accent, color: dark }}
          >
            Get Started
          </button>
        </div>

        {/* Services Section */}
        <div
          className="px-10 py-12"
          style={{ backgroundColor: lighten(light, 0.5) }}
        >
          <h2
            className="text-2xl font-bold text-center mb-8"
            style={{ color: primary }}
          >
            Our Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((svc) => (
              <div
                key={svc}
                className="rounded-xl p-5 border"
                style={{
                  backgroundColor: "white",
                  borderColor: `${secondary}40`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: primary }}
                >
                  {svc[0]}
                </div>
                <div className="font-semibold text-sm" style={{ color: dark }}>
                  {svc}
                </div>
                <div
                  className="text-xs mt-1 opacity-60"
                  style={{ color: dark }}
                >
                  Premium quality
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="px-10 py-10" style={{ backgroundColor: secondary }}>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold mb-3" style={{ color: light }}>
              About {businessName}
            </h2>
            <p
              className="opacity-75 text-sm leading-relaxed"
              style={{ color: light }}
            >
              {answers.problem ||
                answers.description ||
                `We are passionate about delivering exceptional ${nicheLabels[niche].toLowerCase()} services. Our dedicated team brings expertise and care to every project.`}
            </p>
          </div>
        </div>

        {/* Contact Section */}
        {hasContact && (
          <div
            className="px-10 py-10 text-center"
            style={{ backgroundColor: light }}
          >
            <h2 className="text-xl font-bold mb-3" style={{ color: primary }}>
              Get in Touch
            </h2>
            <p className="text-sm opacity-60 mb-5" style={{ color: dark }}>
              We'd love to hear from you!
            </p>
            <button
              type="button"
              className="px-6 py-2.5 rounded-full font-bold text-sm"
              style={{ backgroundColor: primary, color: light }}
            >
              Contact Us
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-10 py-5" style={{ backgroundColor: dark }}>
          <p
            className="text-center text-xs opacity-50"
            style={{ color: light }}
          >
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </p>
        </div>
      </motion.div>

      {/* Palette Summary */}
      <div className="bg-white rounded-2xl border border-card-border card-shadow p-5 mb-6">
        <div className="text-sm font-semibold text-navy-deep mb-3">
          Selected Palette: {selectedPalette.name}
        </div>
        <div className="flex gap-2">
          {selectedPalette.colors.map((c, i) => (
            <div
              key={selectedPalette.colorNames[i]}
              className="flex flex-col items-center gap-1.5 flex-1"
            >
              <div
                className="w-full h-8 rounded-lg border border-black/5"
                style={{ backgroundColor: c }}
              />
              <span className="text-[10px] text-gray-400 font-mono">
                {selectedPalette.colorNames[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={onRestart}
          className="text-gray-500 hover:text-navy-deep gap-1.5"
          data-ocid="preview.restart.button"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
}
