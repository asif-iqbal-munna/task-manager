import { Container, Stack } from "@chakra-ui/react";
import React, { useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AppTextInput from "../../../../../components/inputs/AppTextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  memberValidationSchema,
  MemberValidationSchema,
} from "./validateMember";
import { CREATE_MEMBER_MUTATION_KEY, useCreateMember } from "../apis/memberApi";
import { useDialogDrawer } from "../../../../../components/blocks/AppModuleHeader";
import { revalidateMembers } from "../../../../utils/actions";

const CreateUpdateMemberForm = ({
  formRef,
}: {
  formRef: React.RefObject<{ submit: () => void } | null>;
}) => {
  const { onClose, setMutationKey } = useDialogDrawer();
  const form = useForm<MemberValidationSchema>({
    resolver: zodResolver(memberValidationSchema),
  });

  const { createMember } = useCreateMember();

  const onSubmit = async (data: MemberValidationSchema) => {
    try {
      setMutationKey(CREATE_MEMBER_MUTATION_KEY);
      await createMember(data);
      onClose();
      revalidateMembers();
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
