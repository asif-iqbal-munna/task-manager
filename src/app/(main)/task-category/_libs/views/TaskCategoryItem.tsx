import React from "react";
import { TaskCategory } from "../../../../../generated/prisma/client";
import TaskCategoryActions from "./TaskCategoryActions";
import { Table } from "@chakra-ui/react";

type TaskCategoryWithTasks = TaskCategory & {
  tasks: { id: string }[];
};

const TaskCategoryItem = ({
  taskCategory,
}: {
  taskCategory: TaskCategoryWithTasks;
}) => {
  return (
    <Table.Row key={taskCategory.id}>
      <Table.Cell>{taskCategory.name}</Table.Cell>
      <Table.Cell>{taskCategory.tasks.length}</Table.Cell>
      <Table.Cell>
        <TaskCategoryActions taskCategory={taskCategory} />
      </Table.Cell>
    </Table.Row>
  );
};

export default TaskCategoryItem;
