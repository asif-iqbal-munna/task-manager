"use client";
import React, { useImperativeHandle } from "react";
import { FormProvider } from "react-hook-form";
import AppTextInput from "../../../../../components/inputs/AppTextInput";
import { Container, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialogDrawer } from "../../../../../components/blocks/AppModuleHeader";
import {
  teamValidationSchema,
  TeamValidationSchema,
} from "./teamValidationSchema";
import { CREATE_TEAM_MUTATION_KEY, useCreateTeam } from "../apis/teamApi";
import { revalidateTag } from "next/cache";
import { TEAM_TAG } from "../views/ManageTeams";
import { revalidateTeams } from "../actions";
import { useRouter } from "next/navigation";

const CreateUpdateTeamForm = ({
  formRef,
}: {
  formRef: React.RefObject<{ submit: () => void } | null>;
}) => {
  const { onClose, setMutationKey } = useDialogDrawer();
  const router = useRouter();
  const form = useForm<TeamValidationSchema>({
    resolver: zodResolver(teamValidationSchema),
  });

  const { createTeam } = useCreateTeam();

  const onSubmit = async (data: TeamValidationSchema) => {
    try {
      setMutationKey(CREATE_TEAM_MUTATION_KEY);
      console.log(data);

      await createTeam(data);

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
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
};

export default CreateUpdateTeamForm;
