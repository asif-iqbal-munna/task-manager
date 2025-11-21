"use client";
import React, { useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Card,
  Badge,
  HStack,
  Select,
  createListCollection,
  Icon,
  Portal,
} from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import AppPopup from "../../../../../components/blocks/AppPopup";
import CreateUpdateTaskForm from "../forms/CreateUpdateTaskForm";
import { useUpdateTask } from "../apis/taskApi";
import { useGetMembers } from "../../../members/_libs/apis/memberApi";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { TaskWithRelations } from "./types";
import { formatDate } from "../../../../../lib/formatDate";

interface TaskCardProps {
  task: TaskWithRelations;
  onDragStart: (taskId: string) => void;
  isDragging: boolean;
}

const TaskCard = ({ task, onDragStart, isDragging }: TaskCardProps) => {
  const isDone = task.status === "DONE";
  const { updateTask } = useUpdateTask();
  const { members = [] } = useGetMembers();
  const router = useRouter();
  const queryClient = useQueryClient();

  const priorityOptions = [
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
  ];

  // const memberOptions = [
  //   { label: "Unassigned", value: "" },
  //   ...(members.data?.map((member: { id: string; name: string }) => ({
  //     label: member.name,
  //     value: member.id,
  //   })) || []),
  // ];

  const memberOptions = useMemo(() => {
    return (
      members.data
        ?.filter(
          (member: {
            teamCollaborations: {
              team: { teamProjects: { project_id: string }[] };
            }[];
          }) =>
            member.teamCollaborations.some(
              (collaboration: {
                team: { teamProjects: { project_id: string }[] };
              }) =>
                collaboration.team.teamProjects.some(
                  (project: { project_id: string }) =>
                    project.project_id === (task.project_id as string)
                )
            )
        )
        .map(
          (member: {
            name: string;
            id: string;
            tasks: { id: string }[];
            capacity: number;
          }) => ({
            label: `${member.name} (${member?.tasks?.length}/${member?.capacity})`,
            value: member.id,
          })
        ) ?? []
    );
  }, [members.data, task?.project_id]);

  const priorityCollection = createListCollection({ items: priorityOptions });
  const memberCollection = createListCollection({ items: memberOptions });

  const handlePriorityChange = async (newPriority: string) => {
    try {
      await updateTask({
        id: task.id,
        data: {
          ...task,
          priority: newPriority as "LOW" | "MEDIUM" | "HIGH",
          project_id: task.project_id,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      router.refresh();
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const handleMemberChange = async (newMemberId: string) => {
    try {
      await updateTask({
        id: task.id,
        data: {
          ...task,
          assigned_member_id: newMemberId || null,
          project_id: task.project_id,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      router.refresh();
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest('[role="combobox"]') ||
      target.closest('[role="dialog"]') ||
      target.closest("input") ||
      target.closest("select") ||
      target.closest("svg") ||
      target.closest('[data-drag-disabled="true"]')
    ) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task.id);
    e.dataTransfer.setData("currentStatus", task.status);
    onDragStart(task.id);
  };

  const handleDragEnd = () => {
    onDragStart("");
  };

  return (
    <Box
      w="full"
      mb="3"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      opacity={isDragging ? 0.5 : 1}
      cursor="grab"
      _active={{ cursor: "grabbing" }}
    >
      <Card.Root
        _hover={{ shadow: "md" }}
        w="full"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        <Card.Body gap="3" p="4">
          <Flex gap="3" align="flex-start" direction="column">
            <Flex w="full" align="center" justify="space-between" gap="2">
              <Box flex="1">
                <Text
                  fontWeight="semibold"
                  fontSize="sm"
                  color={isDone ? "gray.500" : "gray.900"}
                  textDecoration={isDone ? "line-through" : "none"}
                  mb="1"
                >
                  {task.title}
                </Text>
                {task.desc && (
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    lineClamp={2}
                    mb="2"
                    textDecoration={isDone ? "line-through" : "none"}
                  >
                    {task.desc}
                  </Text>
                )}
              </Box>
              <Box data-drag-disabled="true">
                <AppPopup
                  isEdit={true}
                  module="Task"
                  type="dialog"
                  renderEditButton={() => (
                    <Icon
                      as={FaRegEdit}
                      size="sm"
                      cursor="pointer"
                      color="gray.400"
                      _hover={{ color: "gray.600" }}
                    />
                  )}
                  render={(formRef) => (
                    <CreateUpdateTaskForm
                      isEdit={true}
                      task={task}
                      formRef={formRef}
                    />
                  )}
                />
              </Box>
            </Flex>

            <Flex gap="2" direction="column" w="full" data-drag-disabled="true">
              <HStack gap="2" w="full">
                <Box flex="1">
                  <Select.Root
                    collection={priorityCollection}
                    value={[task.priority]}
                    onValueChange={(details) => {
                      const newPriority = details.value?.[0];
                      if (newPriority && newPriority !== task.priority) {
                        handlePriorityChange(newPriority);
                      }
                    }}
                    size="xs"
                  >
                    <Select.Trigger
                      w="full"
                      bg="white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select.ValueText />
                    </Select.Trigger>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {priorityCollection.items.map((option) => (
                            <Select.Item key={option.value} item={option}>
                              {option.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>

                <Box flex="1">
                  <Select.Root
                    collection={memberCollection}
                    value={
                      task.assigned_member_id ? [task.assigned_member_id] : [""]
                    }
                    onValueChange={(details) => {
                      const newMemberId = details.value?.[0] || "";
                      if (newMemberId !== (task.assigned_member_id || "")) {
                        handleMemberChange(newMemberId);
                      }
                    }}
                    size="xs"
                  >
                    <Select.Trigger
                      w="full"
                      bg="white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select.ValueText placeholder="Assign member" />
                    </Select.Trigger>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {memberCollection.items.map((option: any) => (
                            <Select.Item key={option.value} item={option}>
                              {option.label}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>
              </HStack>

              {task.createdAt && (
                <Badge
                  colorPalette="gray"
                  size="sm"
                  variant="outline"
                  w="fit-content"
                >
                  {formatDate(task.createdAt)}
                </Badge>
              )}
            </Flex>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default TaskCard;
