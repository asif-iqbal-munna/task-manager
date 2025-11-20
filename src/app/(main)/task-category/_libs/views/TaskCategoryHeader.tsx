"use client";
import React from "react";
import AppModuleHeader from "../../../../../components/blocks/AppModuleHeader";
import CreateUpdateTaskCategoryForm from "../forms/CreateUpdateTaskCategoryForm";

const TaskCategoryHeader = () => {
  return (
    <AppModuleHeader
      title="Manage Task Categories"
      description="Manage your task categories"
      module={"TaskCategory"}
      type="dialog"
      render={(formRef) => <CreateUpdateTaskCategoryForm formRef={formRef} />}
    />
  );
};

export default TaskCategoryHeader;
