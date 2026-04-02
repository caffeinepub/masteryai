import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Wand2 } from "lucide-react";
import { motion } from "motion/react";
import {
  type ColorPalette,
  type Niche,
  nicheLabels,
} from "../../data/nicheData";

interface StepPaletteProps {
  niche: Niche;
  palettes: ColorPalette[];
  selected: ColorPalette | null;
  onSelect: (palette: ColorPalette) => void;
}

export default function StepPalette({
  niche,
  palettes,
  selected,
  onSelect,
}: StepPaletteProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="text-2xl font-extrabold text-navy-deep">
          Choose Your Color Palette
        </h2>
        <Badge className="bg-teal/10 text-teal border-teal/20 font-medium">
          {nicheLabels[niche]}
        </Badge>
      </div>
      <p className="text-gray-500 mb-8 text-sm">
        These palettes are curated specifically for your niche by professional
        designers.
      </p>

      <div className="grid grid-cols-1 gap-5 mb-8">
        {palettes.map((palette, i) => {
          const isSelected = selected?.name === palette.name;
          return (
            <motion.button
              key={palette.name}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              onClick={() => onSelect(palette)}
              className={`w-full text-left rounded-2xl border-2 p-6 transition-all ${
                isSelected
                  ? "border-teal bg-teal/5 card-shadow-lg"
                  : "border-card-border bg-white card-shadow hover:border-teal/40"
              }`}
              data-ocid={`palette.item.${i + 1}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base mb-1 text-navy-deep">
                    {palette.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{palette.description}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-navy-deep" />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {palette.colors.map((color, ci) => (
                  <div
                    key={palette.colorNames[ci]}
                    className="flex flex-col items-center gap-1.5 flex-1"
                  >
                    <div
                      className="w-full h-12 rounded-xl border border-black/5"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[10px] text-gray-400 font-mono">
                      {palette.colorNames[ci]}
                    </span>
                  </div>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={() => onSelect(selected)}
            className="bg-teal hover:bg-teal-dark text-navy-deep font-bold rounded-full px-8"
            data-ocid="palette.generate.button"
          >
            <Wand2 className="mr-2 w-4 h-4" />
            Generate My Website
          </Button>
        </motion.div>
      )}
    </div>
  );
}
