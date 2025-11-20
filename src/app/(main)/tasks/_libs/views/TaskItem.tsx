import React from "react";
import { Task } from "../../../../../generated/prisma/client";
import TaskActions from "./TaskActions";
import { Table, Badge } from "@chakra-ui/react";

type TaskWithRelations = Task & {
  project?: { id: string; name: string };
  assigned_member?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "gray";
    case "IN_PROGRESS":
      return "blue";
    case "DONE":
      return "green";
    default:
      return "gray";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "green";
    case "MEDIUM":
      return "yellow";
    case "HIGH":
      return "red";
    default:
      return "gray";
  }
};

const TaskItem = ({ task }: { task: TaskWithRelations }) => {
  return (
    <Table.Row key={task.id}>
      <Table.Cell>{task.title}</Table.Cell>
      <Table.Cell>{task.project?.name || "-"}</Table.Cell>
      <Table.Cell>{task.assigned_member?.name || "-"}</Table.Cell>
      <Table.Cell>
        <Badge colorPalette={getStatusColor(task.status)}>{task.status}</Badge>
      </Table.Cell>
      <Table.Cell>
        <Badge colorPalette={getPriorityColor(task.priority)}>
          {task.priority}
        </Badge>
      </Table.Cell>
      <Table.Cell>{task.category?.name || "-"}</Table.Cell>
      <Table.Cell>
        <TaskActions task={task} />
      </Table.Cell>
    </Table.Row>
  );
};

export default TaskItem;
