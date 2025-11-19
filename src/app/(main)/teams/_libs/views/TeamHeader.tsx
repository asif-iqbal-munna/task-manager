"use client";
import React from "react";
import CreateUpdateTeamForm from "../forms/CreateUpdateTeamForm";
import AppModuleHeader from "../../../../../components/blocks/AppModuleHeader";

const TeamHeader = () => {
  return (
    <AppModuleHeader
      title="Manage Teams"
      description="Manage your teams and their members"
      module={"Team"}
      type="dialog"
      render={(formRef) => <CreateUpdateTeamForm formRef={formRef} />}
    />
  );
};

export default TeamHeader;
