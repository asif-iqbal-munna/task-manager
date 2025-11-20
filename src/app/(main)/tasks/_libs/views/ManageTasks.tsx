import React from "react";
import { Container } from "@chakra-ui/react";
import KanbanBoard from "./KanbanBoard";
import TaskHeader from "./TaskHeader";

const ManageTasks = () => {
  return (
    <Container fluid p={0}>
      <TaskHeader />
      <KanbanBoard />
    </Container>
  );
};

export default ManageTasks;
