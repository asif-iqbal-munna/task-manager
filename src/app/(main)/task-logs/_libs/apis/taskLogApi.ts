import { useQuery } from "@tanstack/react-query";
import { requestHandler } from "../../../../../lib/requestHandler";

export const useGetTaskLogs = () => {
  const { data: taskLogs, isLoading } = useQuery({
    queryKey: ["task-logs"],
    queryFn: async () => {
      const response = await requestHandler("/api/private/task-logs", "GET");
      return response;
    },
    refetchOnWindowFocus: true,
  });
  return { taskLogs, isLoading };
};
