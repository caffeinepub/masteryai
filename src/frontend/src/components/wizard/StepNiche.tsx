import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Lightbulb } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface StepNicheProps {
  initialValue: string;
  onSubmit: (input: string) => void;
}

const examples = [
  "I run a cozy Italian restaurant in Brooklyn",
  "Personal trainer offering online fitness coaching",
  "Freelance UX designer looking for clients",
  "E-commerce store selling handmade jewelry",
  "Real estate agency in downtown Los Angeles",
  "Hair salon specializing in color and treatments",
];

export default function StepNiche({ initialValue, onSubmit }: StepNicheProps) {
  const [input, setInput] = useState(initialValue);

  const handleSubmit = () => {
    if (input.trim().length < 5) return;
    onSubmit(input.trim());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-extrabold text-navy-deep mb-2">
          Describe Your Website Idea
        </h2>
        <p className="text-gray-500 mb-8 text-base">
          Tell us about your business or niche — our AI will understand and
          craft the perfect website for you.
        </p>

        <div className="bg-white rounded-2xl border border-card-border card-shadow p-6 mb-6">
          <Textarea
            placeholder="e.g. I run a fitness gym in downtown NYC that offers personal training and group yoga classes…"
            className="min-h-[140px] text-base border-0 focus-visible:ring-0 resize-none text-navy-deep placeholder:text-gray-400 p-0"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            data-ocid="niche.input"
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-card-border">
            <span className="text-xs text-gray-400">
              {input.length} characters
            </span>
            <Button
              onClick={handleSubmit}
              disabled={input.trim().length < 5}
              className="bg-teal hover:bg-teal-dark text-navy-deep font-semibold rounded-full px-6"
              data-ocid="niche.continue.button"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-card-border card-shadow p-5">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-navy-deep">
            <Lightbulb className="w-4 h-4 text-teal" />
            Try one of these examples
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {examples.map((ex, i) => (
              <button
                key={ex}
                type="button"
                onClick={() => setInput(ex)}
                className="text-left text-sm text-gray-600 hover:text-navy-deep hover:bg-off-white rounded-xl px-3 py-2.5 border border-transparent hover:border-card-border transition-all"
                data-ocid={`niche.example.${i + 1}`}
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
