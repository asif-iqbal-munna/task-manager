"use client";
import React from "react";
import { Box, Flex, Text, Badge, HStack } from "@chakra-ui/react";
import TaskCard from "./TaskCard";
import { TaskWithRelations } from "./types";

interface KanbanColumnProps {
  status: { id: string; label: string; color: string };
  tasks: TaskWithRelations[];
  onDrop: (taskId: string, newStatus: string) => void;
  isDragOver: boolean;
  onDragOverChange: (statusId: string | null) => void;
  draggedTaskId: string;
  onDragStart: (taskId: string) => void;
}

const KanbanColumn = ({
  status,
  tasks,
  onDrop,
  isDragOver,
  onDragOverChange,
  draggedTaskId,
  onDragStart,
}: KanbanColumnProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    if (!isDragOver) {
      onDragOverChange(status.id);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const taskId = e.dataTransfer.getData("taskId");
    const currentStatus = e.dataTransfer.getData("currentStatus");
    if (taskId && status.id !== currentStatus) {
      onDrop(taskId, status.id);
    }
    onDragOverChange(null);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) {
      onDragOverChange(status.id);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      onDragOverChange(null);
    }
  };

  return (
    <Box
      flex="1"
      minW="300px"
      bg={isDragOver ? "bg.emphasized" : "bg.subtle"}
      p="4"
      borderRadius="lg"
      border="2px solid"
      borderColor={isDragOver ? "blue.300" : "border.emphasized"}
      borderStyle={isDragOver ? "dashed" : "solid"}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
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
      <Box>
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
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={onDragStart}
              isDragging={draggedTaskId === task.id}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default KanbanColumn;
