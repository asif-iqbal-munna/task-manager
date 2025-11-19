import { toaster } from "../../../../../components/ui/toaster";
import { requestHandler } from "../../../../../lib/requestHandler";
import { MemberValidationSchema } from "../forms/validateMember";
import { useMutation, useQuery } from "@tanstack/react-query";

export const CREATE_MEMBER_MUTATION_KEY = "create-member";

export const useCreateMember = () => {
  const { mutateAsync: createMember, isPending } = useMutation({
    mutationKey: [CREATE_MEMBER_MUTATION_KEY],
    mutationFn: async (data: MemberValidationSchema) => {
      const response = await requestHandler(
        "/api/private/members",
        "POST",
        data
      );
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Member created successfully",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { createMember, isPending };
};

export const useGetMembers = () => {
  const { data: members, isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await requestHandler("/api/private/members", "GET");
      return response;
    },
  });
  return { members, isLoading };
};
