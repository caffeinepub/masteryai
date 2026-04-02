import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetRecentTopics() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["recentTopics"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentTopics();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateTopicContent(topic: string) {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["topicContent", topic],
    queryFn: async () => {
      if (!actor) return "";
      return actor.generateTopicContent(topic);
    },
    enabled: !!actor && !isFetching && !!topic,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAddRecentTopic() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (topic: string) => {
      if (!actor) return;
      return actor.addRecentTopic(topic);
    },
  });
}

export function useChatWithAI() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      topic,
      question,
    }: { topic: string; question: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.chatWithAI(topic, question);
    },
  });
}
