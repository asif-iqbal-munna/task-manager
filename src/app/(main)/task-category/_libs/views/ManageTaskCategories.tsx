import { cookies } from "next/headers";
import React from "react";
import { TaskCategory } from "../../../../../generated/prisma/client";
import { Box, Container, Table } from "@chakra-ui/react";
import TaskCategoryHeader from "./TaskCategoryHeader";
import TaskCategoryItem from "./TaskCategoryItem";

export const TASK_CATEGORY_TAG = "task-category";

type TaskCategoryWithTasks = TaskCategory & {
  tasks: { id: string }[];
};

async function getTaskCategories() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/private/task-categories`,
    {
      next: { tags: [TASK_CATEGORY_TAG] },
      headers: {
        Cookie: cookieHeader,
      },
    }
  );

  const data = await res.json();
  return data.data as TaskCategoryWithTasks[];
}

const ManageTaskCategories = async () => {
  const taskCategories = await getTaskCategories();
  return (
    <Container fluid p={0}>
      <TaskCategoryHeader />
      <Box py="4">
        <Table.Root size="lg" variant="outline" interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Tasks</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {taskCategories.map((taskCategory: TaskCategoryWithTasks) => (
              <TaskCategoryItem
                key={taskCategory.id}
                taskCategory={taskCategory}
              />
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Container>
  );
};

export default ManageTaskCategories;
