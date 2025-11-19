"use client";
import React from "react";
import AppModuleHeader from "../../../../../components/blocks/AppModuleHeader";
import CreateUpdateMemberForm from "../forms/CreateUpdateMemberForm";

const MemberHeader = () => {
  return (
    <AppModuleHeader
      title="Manage Members"
      description="Manage your members"
      module={"Member"}
      type="dialog"
      render={(formRef) => <CreateUpdateMemberForm formRef={formRef} />}
    />
  );
};

export default MemberHeader;
