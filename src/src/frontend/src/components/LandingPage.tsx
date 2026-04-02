import { ArrowRight, Clock, Globe, Heart, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onStartBuilding: () => void;
}

const recentBuilds = [
  {
    name: "PowerFit Studio",
    niche: "Fitness",
    date: "2 days ago",
    color: "#FFE600",
  },
  {
    name: "Artisan Kitchen",
    niche: "Restaurant",
    date: "5 days ago",
    color: "#E0631A",
  },
  {
    name: "Nova Tech SaaS",
    niche: "Tech & SaaS",
    date: "1 week ago",
    color: "#39C6C6",
  },
];

export default function LandingPage({ onStartBuilding }: LandingPageProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <div
      className="min-h-screen bg-[#08080f] text-white font-inter flex flex-col"
      data-ocid="dashboard.page"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0d0d18]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#39C6C6] to-[#2BA8A8] flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Sparkles className="w-4 h-4 text-[#08080f]" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            NicheBuilder <span className="text-[#39C6C6]">AI</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <span
            className="text-sm font-semibold text-[#39C6C6] border-b border-[#39C6C6] pb-0.5"
            data-ocid="dashboard.tab"
          >
            Dashboard
          </span>
          <span className="text-sm text-gray-500 cursor-default">
            My Builds
          </span>
          <span className="text-sm text-gray-500 cursor-default">Settings</span>
        </nav>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#39C6C6]/30 to-[#7B2FBE]/30 border border-white/10 flex items-center justify-center text-xs font-bold text-[#39C6C6]">
          U
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-10 max-w-5xl mx-auto w-full">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Welcome back <span className="text-[#39C6C6]">✦</span>
          </h1>
          <p className="text-gray-400 text-base">What will you build today?</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-3 gap-4 mb-10"
        >
          {[
            {
              icon: Globe,
              label: "Websites Built",
              value: "2,847",
              glow: "rgba(57,198,198,0.15)",
            },
            {
              icon: Zap,
              label: "Niches Supported",
              value: "13",
              glow: "rgba(123,47,190,0.15)",
            },
            {
              icon: Clock,
              label: "Avg Build Time",
              value: "~2 min",
              glow: "rgba(255,230,0,0.1)",
            },
          ].map(({ icon: Icon, label, value, glow }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/[0.08] bg-[#0d0d18] p-5 flex flex-col gap-3"
              style={{
                boxShadow: `0 0 40px ${glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
              }}
              data-ocid="dashboard.card"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#39C6C6]" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Start New Build CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
          className="mb-10"
        >
          <button
            type="button"
            onClick={onStartBuilding}
            className="group w-full rounded-2xl p-[1px] hover:shadow-[0_0_50px_rgba(57,198,198,0.3)] transition-all duration-300"
            style={{ background: "linear-gradient(135deg, #39C6C6, #2BA8A8)" }}
            data-ocid="dashboard.primary_button"
          >
            <div className="rounded-2xl bg-[#08080f] group-hover:bg-transparent transition-colors duration-300 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#39C6C6] to-[#2BA8A8] flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Sparkles className="w-5 h-5 text-[#08080f]" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold group-hover:text-[#08080f] transition-colors duration-300">
                    Start New Build
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-[#08080f]/70 transition-colors duration-300">
                    Describe your idea — I'll handle the rest
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[#39C6C6] group-hover:text-[#08080f] group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </button>
        </motion.div>

        {/* Recent Builds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
        >
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Recent Builds
          </h2>
          <div className="flex flex-col gap-3">
            {recentBuilds.map((build, i) => (
              <motion.div
                key={build.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.35 + i * 0.07 }}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0d0d18] px-5 py-4 hover:border-white/[0.12] transition-colors"
                data-ocid={`recent_builds.item.${i + 1}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[#08080f] font-bold text-sm"
                    style={{ backgroundColor: build.color }}
                  >
                    {build.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{build.name}</div>
                    <div className="text-xs text-gray-500">{build.date}</div>
                  </div>
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full border"
                  style={{
                    color: build.color,
                    borderColor: `${build.color}33`,
                    backgroundColor: `${build.color}12`,
                  }}
                >
                  {build.niche}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-5 border-t border-white/[0.06] text-center">
        <p className="text-xs text-gray-600">
          &copy; {year}. Built with{" "}
          <Heart className="w-3 h-3 inline-block text-[#39C6C6] mx-0.5" /> using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#39C6C6] hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
