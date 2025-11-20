"use client";
import React from "react";
import CreateUpdateProjectForm from "../forms/CreateUpdateProjectForm";
import AppModuleHeader from "../../../../../components/blocks/AppModuleHeader";

const ProjectHeader = () => {
  return (
    <AppModuleHeader
      title="Projects"
      description="Manage all your projects in one place."
      module={"Project"}
      type="dialog"
      render={(formRef) => <CreateUpdateProjectForm formRef={formRef} />}
    />
  );
};

export default ProjectHeader;
