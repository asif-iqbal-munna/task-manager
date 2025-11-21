import { toaster } from "../../../../../components/ui/toaster";
import { requestHandler } from "../../../../../lib/requestHandler";
import { TaskValidationSchema } from "../forms/taskValidationSchema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const CREATE_TASK_MUTATION_KEY = "create-task";
export const UPDATE_TASK_MUTATION_KEY = "update-task";

export const useGetTasks = (filters?: {
  project_id?: string;
  member_id?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: [
      "tasks",
      filters?.project_id,
      filters?.member_id,
      filters?.start_date,
      filters?.end_date,
      filters?.search,
    ],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.project_id) {
        params.project_id = filters.project_id;
      }

      if (filters?.member_id) {
        params.member_id = filters.member_id;
      }

      if (filters?.start_date) {
        params.start_date = filters.start_date;
      }

      if (filters?.end_date) {
        params.end_date = filters.end_date;
      }

      if (filters?.search && filters.search.trim()) {
        params.search = filters.search.trim();
      }
      const response = await requestHandler(
        "/api/private/tasks",
        "GET",
        params
      );
      return response;
    },
  });
  return { tasks, isLoading };
};

export const useCreateTask = () => {
  const { mutateAsync: createTask, isPending } = useMutation({
    mutationKey: [CREATE_TASK_MUTATION_KEY],
    mutationFn: async (data: TaskValidationSchema) => {
      const response = await requestHandler("/api/private/tasks", "POST", data);
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Task created successfully",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { createTask, isPending };
};

export const useUpdateTask = () => {
  const { mutateAsync: updateTask, isPending } = useMutation({
    mutationKey: [UPDATE_TASK_MUTATION_KEY],
    mutationFn: async ({
      data,
      id,
    }: {
      data: TaskValidationSchema;
      id: string;
    }) => {
      const response = await requestHandler(
        `/api/private/tasks/${id}`,
        "PUT",
        data
      );
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Task updated successfully",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { updateTask, isPending };
};
