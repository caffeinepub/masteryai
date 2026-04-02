import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import HomePage from "./components/HomePage";
import TopicPage from "./components/TopicPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 },
  },
});

export default function App() {
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" theme="dark" />
      {currentTopic ? (
        <TopicPage topic={currentTopic} onBack={() => setCurrentTopic(null)} />
      ) : (
        <HomePage onSearch={(topic) => setCurrentTopic(topic)} />
      )}
    </QueryClientProvider>
  );
}
