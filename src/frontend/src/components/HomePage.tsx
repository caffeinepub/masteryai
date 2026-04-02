import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useGetRecentTopics } from "../hooks/useQueries";

const POPULAR_TOPICS = [
  "Quantum Physics",
  "Machine Learning",
  "Ancient Rome",
  "JavaScript",
  "Black Holes",
  "World War II",
  "DNA & Genetics",
  "Stoicism",
  "Climate Change",
  "Blockchain",
  "Renaissance Art",
  "Neural Networks",
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

interface HomePageProps {
  onSearch: (topic: string) => void;
}

export default function HomePage({ onSearch }: HomePageProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: recentTopics, isLoading: recentLoading } = useGetRecentTopics();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/mastery-logo.dim_80x80.png"
            alt="MasteryAI"
            className="w-8 h-8"
          />
          <span className="font-display font-bold text-lg text-primary">
            MasteryAI
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Zap className="w-3 h-3 text-primary" />
          <span>AI-Powered Learning</span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          className="text-center mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center yellow-glow">
                <img
                  src="/assets/generated/mastery-logo.dim_80x80.png"
                  alt="MasteryAI"
                  className="w-12 h-12"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="font-display font-bold text-5xl md:text-6xl text-foreground mb-4 leading-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Learn anything.
            <br />
            <span className="text-primary">Master everything.</span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            Type any topic and get a comprehensive mastery guide — with
            examples, deep dives, videos, and an AI agent to answer all your
            questions.
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <div
            className="flex items-center gap-3 bg-surface rounded-full border border-border px-5 py-3 search-glow transition-all duration-300"
            data-ocid="search.input"
          >
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search any topic... e.g. Quantum Physics, JavaScript, Ancient Rome"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-base outline-none min-w-0"
              aria-label="Search topic"
            />
            <Button
              onClick={handleSearch}
              disabled={!query.trim()}
              className="rounded-full bg-primary text-primary-foreground hover:bg-gold-dim font-semibold px-5 py-2 flex-shrink-0 yellow-glow-sm"
              data-ocid="search.primary_button"
            >
              Search
            </Button>
          </div>
        </motion.div>

        {/* Recent Topics */}
        {recentLoading ? (
          <motion.div
            className="mt-8 flex gap-2 flex-wrap justify-center max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {SKELETON_KEYS.map((k) => (
              <Skeleton key={k} className="h-7 w-24 rounded-full" />
            ))}
          </motion.div>
        ) : recentTopics && recentTopics.length > 0 ? (
          <motion.div
            className="mt-8 max-w-2xl text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">
              Recent Searches
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {recentTopics.slice(0, 8).map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="cursor-pointer border-border hover:border-primary hover:text-primary transition-colors text-sm py-1 px-3 rounded-full"
                  onClick={() => onSearch(topic)}
                  data-ocid="search.tab"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* Popular Topics */}
        <motion.div
          className="mt-10 max-w-2xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Popular Topics
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {POPULAR_TOPICS.map((topic) => (
              <button
                type="button"
                key={topic}
                onClick={() => onSearch(topic)}
                className="text-sm text-muted-foreground hover:text-primary border border-border hover:border-primary/40 rounded-full px-3 py-1.5 transition-all duration-200 hover:bg-gold/5"
                data-ocid="search.tab"
              >
                {topic}
              </button>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
