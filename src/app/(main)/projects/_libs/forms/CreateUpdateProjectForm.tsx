"use client";
import React, { useImperativeHandle } from "react";
import { FormProvider } from "react-hook-form";
import AppTextInput from "../../../../../components/inputs/AppTextInput";
import { Container, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDialogDrawer } from "../../../../../components/blocks/AppPopup";
import { projectValidationSchema } from "./projectValidationSchema";
import {
  CREATE_PROJECT_MUTATION_KEY,
  UPDATE_PROJECT_MUTATION_KEY,
  useCreateProject,
  useUpdateProject,
} from "../apis/projectApi";
import { revalidateProjects } from "../../../../utils/actions";
import { useRouter } from "next/navigation";
import AppMultiSelect from "../../../../../components/inputs/AppMultiSelect";
import { useGetTeams } from "../../../teams/_libs/apis/teamApi";
import { ProjectValidationSchema } from "./projectValidationSchema";
import { ProjectWithTeams } from "../views/ProjectCard";

interface CreateUpdateProjectFormProps {
  formRef: React.RefObject<{ submit: () => void } | null>;
  project?: ProjectWithTeams;
  isEdit?: boolean;
}

const CreateUpdateProjectForm = ({
  formRef,
  project,
  isEdit,
}: CreateUpdateProjectFormProps) => {
  const { onClose, setMutationKey } = useDialogDrawer();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(projectValidationSchema),
    defaultValues: {
      name: project?.name ?? "",
      desc: project?.desc ?? "",
      teams:
        project?.teamProjects.map((teamProject) => teamProject.team.id) ?? [],
    },
  });

  const { createProject } = useCreateProject();
  const { updateProject } = useUpdateProject();
  const { teams = [] } = useGetTeams();

  const onSubmit = async (data: ProjectValidationSchema) => {
    try {
      setMutationKey(
        isEdit ? UPDATE_PROJECT_MUTATION_KEY : CREATE_PROJECT_MUTATION_KEY
      );

      if (isEdit) {
        await updateProject({ data, id: project?.id as string });
      } else {
        await createProject(data);
      }

      await revalidateProjects();
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
              label="Project Name"
              name="name"
              placeholder="Enter project name"
              required
            />
            <AppTextInput
              label="Description"
              name="desc"
              placeholder="Enter project description"
              required
            />
            <AppMultiSelect
              label="Teams"
              name="teams"
              options={
                teams.data?.map((team: { name: string; id: string }) => ({
                  label: team.name,
                  value: team.id,
                })) ?? []
              }
            />
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
};

export default CreateUpdateProjectForm;
