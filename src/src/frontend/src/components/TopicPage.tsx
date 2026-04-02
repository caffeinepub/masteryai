import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Code2,
  ExternalLink,
  Lightbulb,
  Play,
  Sparkles,
  Target,
  Telescope,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  useAddRecentTopic,
  useGenerateTopicContent,
} from "../hooks/useQueries";
import {
  type TopicContent,
  generateSmartFallback,
  getTopicFallback,
  parseTopicContent,
} from "../lib/topicFallback";
import ChatPanel from "./ChatPanel";

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4"];

function getYouTubeLinks(topic: string) {
  return [
    {
      key: "beginners",
      label: `${topic} Explained for Beginners`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} explained for beginners`)}`,
    },
    {
      key: "full-course",
      label: `${topic} Full Course`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} full course`)}`,
    },
    {
      key: "tutorial",
      label: `${topic} Tutorial`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} tutorial`)}`,
    },
    {
      key: "deep-dive",
      label: `${topic} Advanced Deep Dive`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} advanced deep dive`)}`,
    },
    {
      key: "documentary",
      label: `${topic} Documentary`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} documentary`)}`,
    },
    {
      key: "lecture",
      label: `${topic} Expert Lecture`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${topic} expert lecture`)}`,
    },
  ];
}

function SectionSkeleton() {
  return (
    <div className="space-y-3 p-5 bg-surface rounded-xl border border-border">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

interface TopicPageProps {
  topic: string;
  onBack: () => void;
}

export default function TopicPage({ topic, onBack }: TopicPageProps) {
  const [content, setContent] = useState<TopicContent | null>(null);
  const addRecent = useAddRecentTopic();
  const {
    data: rawContent,
    isLoading,
    isError,
  } = useGenerateTopicContent(topic);

  // biome-ignore lint/correctness/useExhaustiveDependencies: addRecent.mutate is stable
  useEffect(() => {
    addRecent.mutate(topic);
  }, [topic]);

  useEffect(() => {
    if (rawContent) {
      const parsed = parseTopicContent(rawContent);
      if (parsed) {
        setContent(parsed);
        return;
      }
    }
    if (isError || (!isLoading && !rawContent)) {
      const fallback = getTopicFallback(topic) || generateSmartFallback(topic);
      setContent(fallback);
    }
  }, [rawContent, isError, isLoading, topic]);

  const youtubeLinks = getYouTubeLinks(topic);
  const displayContent =
    content || (isLoading ? null : generateSmartFallback(topic));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border px-4 md:px-8 py-3 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          data-ocid="topic.link"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <img
            src="/assets/generated/mastery-logo.dim_80x80.png"
            alt=""
            className="w-6 h-6"
          />
          <span className="font-display font-bold text-sm text-primary">
            MasteryAI
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8 pb-16">
        {/* Topic Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Badge className="mb-3 bg-gold/10 text-primary border-gold/30 text-xs font-medium px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" />
            Mastery Guide
          </Badge>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-primary leading-tight mb-2">
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </h1>
          <p className="text-muted-foreground text-base">
            Comprehensive learning guide · AI-generated · Examples included
          </p>
        </motion.div>

        {/* AI Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="overview-gradient rounded-2xl p-6 mb-6"
          data-ocid="topic.card"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-display font-semibold text-sm text-primary">
              AI Overview
            </span>
          </div>
          {isLoading && !displayContent ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="text-foreground/90 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {displayContent?.intro}
            </div>
          )}
        </motion.div>

        {isLoading && !displayContent ? (
          <div className="space-y-4">
            {SKELETON_KEYS.map((k) => (
              <SectionSkeleton key={k} />
            ))}
          </div>
        ) : displayContent ? (
          <div className="space-y-6">
            {/* Core Concepts */}
            {displayContent.concepts.length > 0 && (
              <Section
                icon={<Brain className="w-4 h-4" />}
                title="Core Concepts"
                delay={0.15}
              >
                <div className="space-y-4">
                  {displayContent.concepts.map((concept, i) => (
                    <div
                      key={concept.title}
                      className="border-l-2 border-primary/40 pl-4"
                      data-ocid={`topic.item.${i + 1}`}
                    >
                      <h4 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                        {concept.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {concept.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Real-World Examples */}
            {displayContent.examples.length > 0 && (
              <Section
                icon={<Lightbulb className="w-4 h-4" />}
                title="Real-World Examples"
                delay={0.2}
              >
                <div className="space-y-4">
                  {displayContent.examples.map((ex, i) => (
                    <div
                      key={ex.title}
                      className="bg-background rounded-xl p-4 border border-border"
                      data-ocid={`topic.item.${i + 1}`}
                    >
                      <h4 className="font-semibold text-primary mb-2 text-sm flex items-center gap-2">
                        <Target className="w-3.5 h-3.5" />
                        {ex.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                        {ex.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Deep Dive */}
            {displayContent.deepDive && (
              <Section
                icon={<Telescope className="w-4 h-4" />}
                title="Deep Dive"
                delay={0.25}
              >
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {displayContent.deepDive}
                </p>
              </Section>
            )}

            {/* Key Facts & Formulas */}
            {displayContent.keyFacts.length > 0 && (
              <Section
                icon={<Code2 className="w-4 h-4" />}
                title="Key Facts & Formulas"
                delay={0.3}
              >
                <div className="space-y-2">
                  {displayContent.keyFacts.map((fact, i) => (
                    <div
                      key={fact}
                      className="bg-background font-mono text-xs md:text-sm text-primary border border-primary/20 rounded-lg px-4 py-2.5"
                      data-ocid={`topic.item.${i + 1}`}
                    >
                      {fact}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Resources */}
            {displayContent.resources.length > 0 && (
              <Section
                icon={<BookOpen className="w-4 h-4" />}
                title="Resources & Further Reading"
                delay={0.35}
              >
                <div className="space-y-2">
                  {displayContent.resources.map((res) => (
                    <a
                      key={res.url}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors group"
                      data-ocid="topic.link"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0" />
                      <span className="hover:underline">{res.title}</span>
                    </a>
                  ))}
                </div>
              </Section>
            )}

            {/* YouTube Videos */}
            <Section
              icon={<Youtube className="w-4 h-4 text-red-500" />}
              title="YouTube Videos"
              delay={0.4}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {youtubeLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="youtube-card flex items-center gap-3 bg-background border border-border rounded-xl p-3.5 transition-all duration-200"
                    data-ocid="topic.link"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                      <Play className="w-4 h-4 text-red-500 fill-red-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground font-medium leading-snug line-clamp-2">
                        {link.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        YouTube Search
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 ml-auto" />
                  </a>
                ))}
              </div>
            </Section>

            {/* Chat with AI */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <ChatPanel topic={topic} />
            </motion.div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-6 text-center">
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

function Section({
  icon,
  title,
  delay,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-surface rounded-xl border border-border p-5 md:p-6"
      data-ocid="topic.section"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="text-primary">{icon}</div>
        <h3 className="font-display font-bold text-base md:text-lg text-foreground">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
}
