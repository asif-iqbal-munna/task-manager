"use client";
import React from "react";
import { Box, Flex, Text, Badge, HStack } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import { TaskWithRelations } from "./types";

interface KanbanColumnProps {
  status: { id: string; label: string; color: string };
  tasks: TaskWithRelations[];
}

const KanbanColumn = ({ status, tasks }: KanbanColumnProps) => {
  return (
    <Box
      flex="1"
      minW="300px"
      bg="bg.subtle"
      p="4"
      borderRadius="lg"
      border="2px solid"
      borderColor="border.emphasized"
      transition="all 0.2s"
    >
      <Flex
        align="center"
        justify="space-between"
        mb="4"
        pb="2"
        borderBottom="1px solid"
        borderColor="border.subtle"
      >
        <HStack gap="2">
          <Text fontWeight="semibold" fontSize="md" color="fg">
            {status.label}
          </Text>
          <Badge colorPalette={status.color} size="sm" variant="subtle">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </Badge>
        </HStack>
      </Flex>
      <Box px="2">
        {tasks.length === 0 ? (
          <Box
            py="8"
            textAlign="center"
            color="fg.muted"
            fontSize="sm"
            border="2px dashed"
            borderColor="border.subtle"
            borderRadius="md"
            bg="bg"
          >
            No tasks
          </Box>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </Box>
    </Box>
  );
};

export default KanbanColumn;
