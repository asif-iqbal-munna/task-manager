"use client";
import React from "react";
import AppPopup from "../../../../../components/blocks/AppPopup";
import { Button } from "@chakra-ui/react";
import CreateUpdateTaskCategoryForm from "../forms/CreateUpdateTaskCategoryForm";
import { TaskCategory } from "../../../../../generated/prisma/client";

const TaskCategoryActions = ({
  taskCategory,
}: {
  taskCategory: TaskCategory;
}) => {
  return (
    <AppPopup
      isEdit={true}
      renderEditButton={() => (
        <Button size="sm" variant="outline">
          Edit
        </Button>
      )}
      module="TaskCategory"
      render={(formRef) => (
        <CreateUpdateTaskCategoryForm
          isEdit={true}
          taskCategory={taskCategory}
          formRef={formRef}
        />
      )}
    />
  );
};

export default TaskCategoryActions;
