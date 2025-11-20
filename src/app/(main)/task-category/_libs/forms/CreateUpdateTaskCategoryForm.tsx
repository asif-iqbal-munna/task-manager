import { Container, Stack } from "@chakra-ui/react";
import React, { useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AppTextInput from "../../../../../components/inputs/AppTextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskCategoryValidationSchema,
  TaskCategoryValidationSchema,
} from "./taskCategoryValidationSchema";
import {
  CREATE_TASK_CATEGORY_MUTATION_KEY,
  UPDATE_TASK_CATEGORY_MUTATION_KEY,
  useCreateTaskCategory,
  useUpdateTaskCategory,
} from "../apis/taskCategoryApi";
import { revalidateTaskCategories } from "../../../../utils/actions";
import { useDialogDrawer } from "../../../../../components/blocks/AppPopup";
import { TaskCategory } from "../../../../../generated/prisma/client";
import { useRouter } from "next/navigation";

interface CreateUpdateTaskCategoryFormProps {
  formRef: React.RefObject<{ submit: () => void } | null>;
  taskCategory?: TaskCategory;
  isEdit?: boolean;
}

const CreateUpdateTaskCategoryForm = ({
  formRef,
  taskCategory,
  isEdit,
}: CreateUpdateTaskCategoryFormProps) => {
  const { onClose, setMutationKey } = useDialogDrawer();
  const router = useRouter();
  const form = useForm<TaskCategoryValidationSchema>({
    resolver: zodResolver(taskCategoryValidationSchema),
    defaultValues: {
      name: taskCategory?.name ?? "",
    },
  });

  const { createTaskCategory } = useCreateTaskCategory();
  const { updateTaskCategory } = useUpdateTaskCategory();

  const onSubmit = async (data: TaskCategoryValidationSchema) => {
    try {
      setMutationKey(
        isEdit
          ? UPDATE_TASK_CATEGORY_MUTATION_KEY
          : CREATE_TASK_CATEGORY_MUTATION_KEY
      );
      if (isEdit) {
        await updateTaskCategory({ data, id: taskCategory?.id as string });
      } else {
        await createTaskCategory(data);
      }
      onClose();
      revalidateTaskCategories();
      router.refresh();
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

  return (
    <Container maxW="md">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Stack gap="4">
            <AppTextInput
              label="Category Name"
              name="name"
              placeholder="Enter category name"
              required
            />
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
};

export default CreateUpdateTaskCategoryForm;
