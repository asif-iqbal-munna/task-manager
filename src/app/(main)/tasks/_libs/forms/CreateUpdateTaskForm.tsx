"use client";
import { Container, Flex, Stack } from "@chakra-ui/react";
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import AppTextInput from "../../../../../components/inputs/AppTextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskValidationSchema,
  TaskValidationSchema,
} from "./taskValidationSchema";
import {
  CREATE_TASK_MUTATION_KEY,
  UPDATE_TASK_MUTATION_KEY,
  useCreateTask,
  useUpdateTask,
} from "../apis/taskApi";
import { useDialogDrawer } from "../../../../../components/blocks/AppPopup";
import { Task } from "../../../../../generated/prisma/client";
import AppSelect from "../../../../../components/inputs/AppSelect";
import { useGetProjects } from "../../../projects/_libs/apis/projectApi";
import { useGetMembers } from "../../../members/_libs/apis/memberApi";
import { useGetTaskCategories } from "../../../task-category/_libs/apis/taskCategoryApi";
import { useQueryClient } from "@tanstack/react-query";
import AppTextArea from "../../../../../components/inputs/AppTextArea";

interface CreateUpdateTaskFormProps {
  formRef: React.RefObject<{ submit: () => void } | null>;
  task?: Task & {
    project?: { id: string; name: string };
    assigned_member?: { id: string; name: string } | null;
    category?: { id: string; name: string } | null;
  };
  isEdit?: boolean;
}

const CreateUpdateTaskForm = ({
  formRef,
  task,
  isEdit,
}: CreateUpdateTaskFormProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const { onClose, setMutationKey } = useDialogDrawer();
  const queryClient = useQueryClient();
  const form = useForm<TaskValidationSchema>({
    resolver: zodResolver(taskValidationSchema),
    defaultValues: {
      title: task?.title ?? "",
      desc: task?.desc ?? "",
      project_id: task?.project_id ?? "",
      assigned_member_id: task?.assigned_member_id ?? null,
      status: (task?.status as "PENDING" | "IN_PROGRESS" | "DONE") ?? "PENDING",
      priority: (task?.priority as "LOW" | "MEDIUM" | "HIGH") ?? "MEDIUM",
      category_id: task?.category_id ?? null,
    },
  });

  const { createTask } = useCreateTask();
  const { updateTask } = useUpdateTask();
  const { projects = [] } = useGetProjects();
  const { members = [] } = useGetMembers();
  const { taskCategories = [] } = useGetTaskCategories();

  const onSubmit = async (data: TaskValidationSchema) => {
    try {
      setMutationKey(
        isEdit ? UPDATE_TASK_MUTATION_KEY : CREATE_TASK_MUTATION_KEY
      );
      if (isEdit) {
        await updateTask({ data, id: task?.id as string });
      } else {
        await createTask(data);
      }
      onClose();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  useImperativeHandle(formRef, () => ({
    submit: () => {
      form.handleSubmit(onSubmit)();
    },
  }));

  const memberOptions = useMemo(() => {
    return (
      members.data
        ?.filter(
          (member: {
            teamCollaborations: {
              team: { teamProjects: { project_id: string }[] };
            }[];
          }) =>
            member.teamCollaborations.some(
              (collaboration: {
                team: { teamProjects: { project_id: string }[] };
              }) =>
                collaboration.team.teamProjects.some(
                  (project: { project_id: string }) =>
                    project.project_id === (selectedProjectId as string)
                )
            )
        )
        .map(
          (member: {
            name: string;
            id: string;
            tasks: { id: string }[];
            capacity: number;
          }) => ({
            label: `${member.name} (${member?.tasks?.length}/${member?.capacity})`,
            value: member.id,
          })
        ) ?? []
    );
  }, [members.data, selectedProjectId]);

  const statusOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Done", value: "DONE" },
  ];

  const priorityOptions = [
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
  ];

  useEffect(() => {
    if (task?.project_id) {
      setSelectedProjectId(task.project_id);
    }
  }, [task?.project_id]);

  return (
    <Container maxW="md">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack gap="4">
            <AppTextInput
              label="Task Title"
              name="title"
              placeholder="Enter task title"
              required
            />
            <Flex gap="2">
              <AppSelect
                label="Project"
                name="project_id"
                placeholder="Select project"
                required
                options={
                  projects.data?.map(
                    (project: { name: string; id: string }) => ({
                      label: project.name,
                      value: project.id,
                    })
                  ) ?? []
                }
                onSelect={(value) => setSelectedProjectId(value)}
              />
              <AppSelect
                label="Assigned Member"
                name="assigned_member_id"
                placeholder="Select member"
                options={selectedProjectId ? memberOptions : []}
                labelInfo
                infoText="Select project first to see the available members"
              />
            </Flex>
            <AppTextArea
              label="Task Description"
              name="desc"
              placeholder="Enter task description"
              rows={4}
              maxLength={200}
            />
            <Flex gap="2">
              <AppSelect
                label="Category"
                name="category_id"
                placeholder="Select category"
                options={
                  taskCategories.data?.map(
                    (category: { name: string; id: string }) => ({
                      label: category.name,
                      value: category.id,
                    })
                  ) ?? []
                }
              />
            </Flex>
            <Flex gap="2">
              <AppSelect
                label="Status"
                name="status"
                placeholder="Select status"
                options={statusOptions}
              />
              <AppSelect
                label="Priority"
                name="priority"
                placeholder="Select priority"
                options={priorityOptions}
              />
            </Flex>
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
};

export default CreateUpdateTaskForm;
