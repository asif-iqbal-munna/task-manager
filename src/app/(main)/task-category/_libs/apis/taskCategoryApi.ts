import { toaster } from "../../../../../components/ui/toaster";
import { requestHandler } from "../../../../../lib/requestHandler";
import { TaskCategoryValidationSchema } from "../forms/taskCategoryValidationSchema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const CREATE_TASK_CATEGORY_MUTATION_KEY = "create-task-category";
export const UPDATE_TASK_CATEGORY_MUTATION_KEY = "update-task-category";

export const useCreateTaskCategory = () => {
  const { mutateAsync: createTaskCategory, isPending } = useMutation({
    mutationKey: [CREATE_TASK_CATEGORY_MUTATION_KEY],
    mutationFn: async (data: TaskCategoryValidationSchema) => {
      const response = await requestHandler(
        "/api/private/task-categories",
        "POST",
        data
      );
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Task category created successfully",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { createTaskCategory, isPending };
};

export const useUpdateTaskCategory = () => {
  const { mutateAsync: updateTaskCategory, isPending } = useMutation({
    mutationKey: [UPDATE_TASK_CATEGORY_MUTATION_KEY],
    mutationFn: async ({
      data,
      id,
    }: {
      data: TaskCategoryValidationSchema;
      id: string;
    }) => {
      const response = await requestHandler(
        `/api/private/task-categories/${id}`,
        "PUT",
        data
      );
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Task category updated successfully",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { updateTaskCategory, isPending };
};

export const useGetTaskCategories = () => {
  const { data: taskCategories, isLoading } = useQuery({
    queryKey: ["task-categories"],
    queryFn: async () => {
      const response = await requestHandler(
        "/api/private/task-categories",
        "GET"
      );
      return response;
    },
  });
  return { taskCategories, isLoading };
};
