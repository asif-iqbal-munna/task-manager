import { useMutation, useQuery } from "@tanstack/react-query";
import { requestHandler } from "../../../../../lib/requestHandler";
import { TeamValidationSchema } from "../forms/teamValidationSchema";
import { toaster } from "../../../../../components/ui/toaster";

export const CREATE_TEAM_MUTATION_KEY = "create-team";
export const UPDATE_TEAM_MUTATION_KEY = "update-team";

export const useCreateTeam = () => {
  const { mutateAsync: createTeam, isPending } = useMutation({
    mutationKey: [CREATE_TEAM_MUTATION_KEY],
    mutationFn: async (data: TeamValidationSchema) => {
      const response = await requestHandler("/api/private/teams", "POST", data);
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Team created successfully",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { createTeam, isPending };
};

export const useUpdateTeam = () => {
  const { mutateAsync: updateTeam, isPending } = useMutation({
    mutationKey: [UPDATE_TEAM_MUTATION_KEY],
    mutationFn: async ({
      data,
      id,
    }: {
      data: TeamValidationSchema;
      id: string;
    }) => {
      const response = await requestHandler(
        `/api/private/teams/${id}`,
        "PUT",
        data
      );
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Team updated successfully",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { updateTeam, isPending };
};

export const useGetTeams = () => {
  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await requestHandler("/api/private/teams", "GET");
      return response;
    },
  });
  return { teams, isLoading };
};
