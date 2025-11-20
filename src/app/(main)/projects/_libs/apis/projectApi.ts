import { useMutation, useQuery } from "@tanstack/react-query";
import { requestHandler } from "../../../../../lib/requestHandler";
import { ProjectValidationSchema } from "../forms/projectValidationSchema";
import { toaster } from "../../../../../components/ui/toaster";

export const CREATE_PROJECT_MUTATION_KEY = "create-project";
export const UPDATE_PROJECT_MUTATION_KEY = "update-project";

export const useCreateProject = () => {
  const { mutateAsync: createProject, isPending } = useMutation({
    mutationKey: [CREATE_PROJECT_MUTATION_KEY],
    mutationFn: async (data: ProjectValidationSchema) => {
      const response = await requestHandler(
        "/api/private/projects",
        "POST",
        data
      );
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Project created successfully",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { createProject, isPending };
};

export const useUpdateProject = () => {
  const { mutateAsync: updateProject, isPending } = useMutation({
    mutationKey: [UPDATE_PROJECT_MUTATION_KEY],
    mutationFn: async ({
      data,
      id,
    }: {
      data: ProjectValidationSchema;
      id: string;
    }) => {
      const response = await requestHandler(
        `/api/private/projects/${id}`,
        "PUT",
        data
      );
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Project updated successfully",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { updateProject, isPending };
};

export const useGetProjects = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await requestHandler("/api/private/projects", "GET");
      return response;
    },
  });
  return { projects, isLoading };
};
