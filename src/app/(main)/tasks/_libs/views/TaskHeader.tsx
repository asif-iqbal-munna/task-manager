"use client";
import React from "react";
import AppModuleHeader from "../../../../../components/blocks/AppModuleHeader";
import CreateUpdateTaskForm from "../forms/CreateUpdateTaskForm";

const TaskHeader = () => {
  return (
    <AppModuleHeader
      title="Manage Tasks"
      description="Manage your tasks"
      module={"Task"}
      type="dialog"
      render={(formRef) => <CreateUpdateTaskForm formRef={formRef} />}
    />
  );
};

export default TaskHeader;

