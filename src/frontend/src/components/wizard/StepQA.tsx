import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Bot, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type Niche, type Question, nicheLabels } from "../../data/nicheData";

interface StepQAProps {
  niche: Niche;
  questions: Question[];
  initialAnswers: Record<string, string>;
  onComplete: (answers: Record<string, string>) => void;
}

export default function StepQA({
  niche,
  questions,
  initialAnswers,
  onComplete,
}: StepQAProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    let idx = 0;
    for (let i = 0; i < questions.length; i++) {
      if (initialAnswers[questions[i].id]) {
        idx = i + 1;
      } else {
        break;
      }
    }
    return Math.min(idx, questions.length - 1);
  });
  const [answers, setAnswers] =
    useState<Record<string, string>>(initialAnswers);
  const [inputValue, setInputValue] = useState(
    answers[questions[currentIndex]?.id] || "",
  );

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [currentQ.id]: answer };
    setAnswers(newAnswers);
    if (isLast) {
      onComplete(newAnswers);
    } else {
      setCurrentIndex((i) => i + 1);
      setInputValue(newAnswers[questions[currentIndex + 1]?.id] || "");
    }
  };

  const handleTextSubmit = () => {
    if (!inputValue.trim()) return;
    handleAnswer(inputValue.trim());
    setInputValue("");
  };

  const completedQAs = questions.slice(0, currentIndex).map((q) => ({
    key: q.id,
    q: q.text,
    a: answers[q.id] || "",
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-extrabold text-navy-deep">
          Customise Your Website
        </h2>
        <Badge className="bg-teal/10 text-teal border-teal/20 font-medium">
          {nicheLabels[niche]}
        </Badge>
      </div>
      <p className="text-gray-500 mb-6 text-sm">
        Question {currentIndex + 1} of {questions.length}
      </p>

      {/* Conversation History */}
      {completedQAs.length > 0 && (
        <div className="space-y-3 mb-6">
          {completedQAs.map((pair) => (
            <motion.div
              key={pair.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-teal" />
                </div>
                <div className="bg-teal/5 border border-teal/10 rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-600">
                  {pair.q}
                </div>
              </div>
              <div className="flex gap-2 items-start justify-end">
                <div className="bg-navy-deep rounded-xl rounded-tr-sm px-4 py-2.5 text-sm text-white">
                  {pair.a || <span className="opacity-40 italic">Skipped</span>}
                </div>
                <div className="w-7 h-7 rounded-full bg-navy-deep/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-navy-deep" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Current Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-card-border card-shadow p-6"
        >
          <div className="flex gap-3 items-start mb-5">
            <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-teal" />
            </div>
            <div>
              <p className="text-navy-deep font-semibold text-base">
                {currentQ?.text}
              </p>
            </div>
          </div>

          {currentQ?.type === "quick-select" && currentQ.options ? (
            <div
              className="flex flex-wrap gap-2 ml-11"
              data-ocid="qa.quick_select.panel"
            >
              {currentQ.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleAnswer(opt)}
                  className="px-4 py-2 rounded-full border border-card-border text-sm font-medium text-gray-700 hover:bg-teal hover:text-navy-deep hover:border-teal transition-all"
                  data-ocid="qa.option.button"
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-3 ml-11" data-ocid="qa.text.panel">
              <Input
                placeholder={currentQ?.placeholder || "Type your answer…"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                className="flex-1 border-card-border focus-visible:ring-teal"
                data-ocid="qa.text.input"
              />
              <Button
                onClick={handleTextSubmit}
                disabled={!inputValue.trim()}
                className="bg-teal hover:bg-teal-dark text-navy-deep font-semibold rounded-full px-5"
                data-ocid="qa.submit.button"
              >
                {isLast ? "Finish" : "Next"}
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => onComplete(answers)}
          className="text-sm text-gray-400 hover:text-teal transition-colors"
          data-ocid="qa.skip.button"
        >
          Skip remaining questions →
        </button>
      </div>
    </div>
  );
}
