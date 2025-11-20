"use client";
import React, { useImperativeHandle } from "react";
import { FormProvider } from "react-hook-form";
import AppTextInput from "../../../../../components/inputs/AppTextInput";
import { Container, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialogDrawer } from "../../../../../components/blocks/AppPopup";
import { teamValidationSchema } from "./teamValidationSchema";
import {
  CREATE_TEAM_MUTATION_KEY,
  UPDATE_TEAM_MUTATION_KEY,
  useCreateTeam,
  useUpdateTeam,
} from "../apis/teamApi";
import { revalidateTeams } from "../../../../utils/actions";
import { useRouter } from "next/navigation";
import AppMultiSelect from "../../../../../components/inputs/AppMultiSelect";
import { useGetMembers } from "../../../members/_libs/apis/memberApi";
import { TeamValidationSchema } from "./teamValidationSchema";
import { TeamWithCollaborations } from "../views/TeamCard";

interface CreateUpdateTeamFormProps {
  formRef: React.RefObject<{ submit: () => void } | null>;
  team?: TeamWithCollaborations;
  isEdit?: boolean;
}

const CreateUpdateTeamForm = ({
  formRef,
  team,
  isEdit,
}: CreateUpdateTeamFormProps) => {
  const { onClose, setMutationKey } = useDialogDrawer();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(teamValidationSchema),
    defaultValues: {
      name: team?.name ?? "",
      members:
        team?.teamCollaborations.map(
          (collaboration) => collaboration.member.id
        ) ?? [],
    },
  });

  const { createTeam } = useCreateTeam();
  const { updateTeam } = useUpdateTeam();
  const { members = [] } = useGetMembers();

  const onSubmit = async (data: TeamValidationSchema) => {
    try {
      setMutationKey(
        isEdit ? UPDATE_TEAM_MUTATION_KEY : CREATE_TEAM_MUTATION_KEY
      );

      if (isEdit) {
        await updateTeam({ data, id: team?.id as string });
      } else {
        await createTeam(data);
      }

      await revalidateTeams();
      router.refresh();
      onClose();

      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useImperativeHandle(formRef, () => ({
    submit: () => {
      form.handleSubmit(onSubmit)();
    },
  }));

  return (
    <Container maxW="md">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack gap="4">
            <AppTextInput
              label="Team Name"
              name="name"
              placeholder="Enter team name"
              required
            />
            <AppMultiSelect
              label="Members"
              name="members"
              options={
                members.data?.map((member: { name: string; id: string }) => ({
                  label: member.name,
                  value: member.id,
                })) ?? []
              }
            />
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
};

export default CreateUpdateTeamForm;
