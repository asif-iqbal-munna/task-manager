"use client";
import React from "react";
import AppPopup from "../../../../../components/blocks/AppPopup";
import { Button } from "@chakra-ui/react";
import CreateUpdateTaskForm from "../forms/CreateUpdateTaskForm";
import { Task } from "../../../../../generated/prisma/client";

const TaskActions = ({
  task,
}: {
  task: Task & {
    project?: { id: string; name: string };
    assigned_member?: { id: string; name: string } | null;
    category?: { id: string; name: string } | null;
  };
}) => {
  return (
    <AppPopup
      isEdit={true}
      renderEditButton={() => (
        <Button size="sm" variant="outline">
          Edit
        </Button>
      )}
      module="Task"
      render={(formRef) => (
        <CreateUpdateTaskForm isEdit={true} task={task} formRef={formRef} />
      )}
    />
  );
};

export default TaskActions;

