import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  type ColorPalette,
  type Niche,
  detectNiche,
  getQuestionsForNiche,
  nichePalettes,
} from "../data/nicheData";
import StepNiche from "./wizard/StepNiche";
import StepPalette from "./wizard/StepPalette";
import StepPreview from "./wizard/StepPreview";
import StepQA from "./wizard/StepQA";

interface BuilderWizardProps {
  onBack: () => void;
}

export interface WizardState {
  niche: Niche | null;
  nicheInput: string;
  answers: Record<string, string>;
  selectedPalette: ColorPalette | null;
}

const STEP_LABELS = ["Niche", "Questions", "Colors", "Preview"];

export default function BuilderWizard({ onBack }: BuilderWizardProps) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>({
    niche: null,
    nicheInput: "",
    answers: {},
    selectedPalette: null,
  });

  const progress = ((step + 1) / 4) * 100;

  const handleNicheSubmit = (input: string) => {
    const niche = detectNiche(input);
    setState((prev) => ({ ...prev, nicheInput: input, niche }));
    setStep(1);
  };

  const handleQAComplete = (answers: Record<string, string>) => {
    setState((prev) => ({ ...prev, answers }));
    setStep(2);
  };

  const handlePaletteSelect = (palette: ColorPalette) => {
    setState((prev) => ({ ...prev, selectedPalette: palette }));
    setStep(3);
  };

  const handleRestart = () => {
    setState({
      niche: null,
      nicheInput: "",
      answers: {},
      selectedPalette: null,
    });
    setStep(0);
  };

  const goBack = () => {
    if (step === 0) {
      onBack();
    } else {
      setStep((s) => s - 1);
    }
  };

  const questions = state.niche ? getQuestionsForNiche(state.niche) : [];
  const palettes = state.niche ? nichePalettes[state.niche] : [];

  return (
    <div className="min-h-screen bg-off-white font-inter flex flex-col">
      {/* Wizard Header */}
      <header className="bg-white border-b border-card-border sticky top-0 z-50">
        <div className="max-w-[900px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="text-gray-500 hover:text-navy-deep gap-1.5"
                data-ocid="wizard.back.button"
              >
                <ArrowLeft className="w-4 h-4" />
                {step === 0 ? "Back to Home" : "Back"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-navy-deep" />
              </div>
              <span className="font-bold text-navy-deep text-sm">
                NicheBuilder AI
              </span>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-3">
            {STEP_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i < step
                      ? "bg-teal text-navy-deep"
                      : i === step
                        ? "bg-navy-deep text-white"
                        : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    i === step
                      ? "text-navy-deep"
                      : i < step
                        ? "text-teal"
                        : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 rounded ${i < step ? "bg-teal" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </header>

      {/* Wizard Content */}
      <main className="flex-1 max-w-[900px] mx-auto w-full px-6 py-10">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-niche"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepNiche
                initialValue={state.nicheInput}
                onSubmit={handleNicheSubmit}
              />
            </motion.div>
          )}
          {step === 1 && state.niche && (
            <motion.div
              key="step-qa"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepQA
                niche={state.niche}
                questions={questions}
                initialAnswers={state.answers}
                onComplete={handleQAComplete}
              />
            </motion.div>
          )}
          {step === 2 && state.niche && (
            <motion.div
              key="step-palette"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepPalette
                niche={state.niche}
                palettes={palettes}
                selected={state.selectedPalette}
                onSelect={handlePaletteSelect}
              />
            </motion.div>
          )}
          {step === 3 && state.selectedPalette && state.niche && (
            <motion.div
              key="step-preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepPreview
                wizardState={
                  state as WizardState & {
                    niche: Niche;
                    selectedPalette: ColorPalette;
                  }
                }
                onRestart={handleRestart}
                onEdit={() => setStep(0)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
