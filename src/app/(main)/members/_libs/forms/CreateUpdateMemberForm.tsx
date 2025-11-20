import { Container, Stack } from "@chakra-ui/react";
import React, { useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AppTextInput from "../../../../../components/inputs/AppTextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  memberValidationSchema,
  MemberValidationSchema,
} from "./validateMember";
import {
  CREATE_MEMBER_MUTATION_KEY,
  UPDATE_MEMBER_MUTATION_KEY,
  useCreateMember,
  useUpdateMember,
} from "../apis/memberApi";
import { revalidateMembers } from "../../../../utils/actions";
import { useDialogDrawer } from "../../../../../components/blocks/AppPopup";
import { Member } from "../../../../../generated/prisma/client";
import { useRouter } from "next/navigation";

interface CreateUpdateMemberFormProps {
  formRef: React.RefObject<{ submit: () => void } | null>;
  member?: Member;
  isEdit?: boolean;
}

const CreateUpdateMemberForm = ({
  formRef,
  member,
  isEdit,
}: CreateUpdateMemberFormProps) => {
  const { onClose, setMutationKey } = useDialogDrawer();
  const router = useRouter();
  const form = useForm<MemberValidationSchema>({
    resolver: zodResolver(memberValidationSchema),
    defaultValues: {
      name: member?.name ?? "",
      role: member?.role ?? "",
    },
  });

  const { createMember } = useCreateMember();
  const { updateMember } = useUpdateMember();

  const onSubmit = async (data: MemberValidationSchema) => {
    try {
      setMutationKey(
        isEdit ? UPDATE_MEMBER_MUTATION_KEY : CREATE_MEMBER_MUTATION_KEY
      );
      if (isEdit) {
        await updateMember({ data, id: member?.id as string });
      } else {
        await createMember(data);
      }
      onClose();
      revalidateMembers();
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
              label="Name"
              name="name"
              placeholder="Enter name"
              required
            />
            <AppTextInput
              label="Role"
              name="role"
              placeholder="Enter role"
              required
            />
          </Stack>
        </form>
      </FormProvider>
    </Container>
  );
};

export default CreateUpdateMemberForm;
