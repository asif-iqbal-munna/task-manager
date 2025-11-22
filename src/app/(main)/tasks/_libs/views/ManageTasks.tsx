import React, { Suspense } from "react";
import { Container, Spinner, Box } from "@chakra-ui/react";
import KanbanBoard from "./KanbanBoard";
import TaskHeader from "./TaskHeader";

export const TASK_TAG = "tasks";

const ManageTasks = () => {
  return (
    <Container fluid p={0}>
      <TaskHeader />
      <Suspense
        fallback={
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minH="200px"
          >
            <Spinner size="lg" color="blue.500" />
          </Box>
        }
      >
        <KanbanBoard />
      </Suspense>
    </Container>
  );
};

export default ManageTasks;
