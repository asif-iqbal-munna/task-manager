"use client";
import React from "react";
import AppPopup from "../../../../../components/blocks/AppPopup";
import { Button } from "@chakra-ui/react";
import CreateUpdateMemberForm from "../forms/CreateUpdateMemberForm";
import { Member } from "../../../../../generated/prisma/client";

const MemberActions = ({ member }: { member: Member }) => {
  return (
    <AppPopup
      isEdit={true}
      renderEditButton={() => (
        <Button size="sm" variant="outline">
          Edit
        </Button>
      )}
      module="Member"
      render={(formRef) => (
        <CreateUpdateMemberForm
          isEdit={true}
          member={member}
          formRef={formRef}
        />
      )}
    />
  );
};

export default MemberActions;
