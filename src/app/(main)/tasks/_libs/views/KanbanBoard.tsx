"use client";
import React, { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Card,
  Badge,
  Button,
  HStack,
  Select,
  Input,
  createListCollection,
  Icon,
  Separator,
  Skeleton,
} from "@chakra-ui/react";
import { Task } from "../../../../../generated/prisma/client";
import AppPopup from "../../../../../components/blocks/AppPopup";
import CreateUpdateTaskForm from "../forms/CreateUpdateTaskForm";
import { useGetProjects } from "../../../projects/_libs/apis/projectApi";
import { useGetTasks } from "../apis/taskApi";
import { FaRegFolder } from "react-icons/fa";
import { LuCalendar } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

type TaskWithRelations = Task & {
  project?: { id: string; name: string };
  assigned_member?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
};

const STATUS_COLUMNS = [
  { id: "PENDING", label: "To Do", color: "gray" },
  { id: "IN_PROGRESS", label: "In Progress", color: "blue" },
  { id: "DONE", label: "Done", color: "green" },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "blue";
    case "MEDIUM":
      return "yellow";
    case "HIGH":
      return "red";
    default:
      return "gray";
  }
};

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const day = d.getDate();
  return `${month} ${day}`;
};

const TaskCard = ({ task }: { task: TaskWithRelations }) => {
  const isDone = task.status === "DONE";

  return (
    <AppPopup
      isEdit={true}
      module="Task"
      type="dialog"
      renderEditButton={() => (
        <Box w="full" mb="3">
          <Card.Root
            cursor="pointer"
            _hover={{ shadow: "md" }}
            w="full"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
          >
            <Card.Body gap="3" p="4">
              <Flex gap="3" align="flex-start">
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
                  <HStack gap="2" flexWrap="wrap">
                    <Badge
                      colorPalette={getPriorityColor(task.priority)}
                      size="sm"
                      textTransform="lowercase"
                      variant="subtle"
                    >
                      {task.priority.toLowerCase()}
                    </Badge>
                    {task.createdAt && (
                      <Badge colorPalette="gray" size="sm" variant="outline">
                        {formatDate(task.createdAt)}
                      </Badge>
                    )}
                  </HStack>
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>
        </Box>
      )}
      render={(formRef) => (
        <CreateUpdateTaskForm isEdit={true} task={task} formRef={formRef} />
      )}
    />
  );
};

const KanbanColumn = ({
  status,
  tasks,
}: {
  status: { id: string; label: string; color: string };
  tasks: TaskWithRelations[];
}) => {
  return (
    <Box
      flex="1"
      minW="300px"
      bg="gray.50"
      p="4"
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
    >
      <Flex
        align="center"
        justify="space-between"
        mb="4"
        pb="2"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <HStack gap="2">
          <Text fontWeight="semibold" fontSize="md" color="gray.900">
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
            color="gray.400"
            fontSize="sm"
            border="2px dashed"
            borderColor="gray.200"
            borderRadius="md"
            bg="white"
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

const KanbanBoard = () => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const { projects = [] } = useGetProjects();
  const { tasks: tasksData, isLoading } = useGetTasks({
    project_id: selectedProject || undefined,
    start_date: dateRange.start || undefined,
    end_date: dateRange.end || undefined,
  });

  const tasks = useMemo(() => {
    return (tasksData?.data || []) as TaskWithRelations[];
  }, [tasksData]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, TaskWithRelations[]> = {
      PENDING: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  const projectOptions = [
    { label: "All Projects", value: "" },
    ...(projects.data?.map((project: { id: string; name: string }) => ({
      label: project.name,
      value: project.id,
    })) || []),
  ];

  const projectCollection = createListCollection({ items: projectOptions });

  const hasActiveFilters = selectedProject || dateRange.start || dateRange.end;
  const selectedProjectName = projects.data?.find(
    (p: { id: string }) => p.id === selectedProject
  )?.name;

  if (isLoading) {
    return (
      <Box>
        <Skeleton h="100px" mb="6" borderRadius="lg" />
        <Flex gap="4">
          {STATUS_COLUMNS.map((status) => (
            <Skeleton key={status.id} flex="1" h="400px" borderRadius="lg" />
          ))}
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <Card.Root
        mb="6"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
      >
        <Card.Body p="4">
          <Flex gap="4" align="center" flexWrap="wrap" justify="space-between">
            <HStack gap="4" flexWrap="wrap" flex="1">
              <HStack gap="2" minW="200px">
                <Icon as={FaRegFolder} color="gray.500" />
                <Select.Root
                  collection={projectCollection}
                  value={selectedProject ? [selectedProject] : []}
                  onValueChange={(details) => {
                    setSelectedProject(details.value?.[0] || "");
                  }}
                  size="sm"
                >
                  <Select.Trigger w="full" bg="white">
                    <Select.ValueText
                      placeholder="All Projects"
                      color={selectedProject ? "gray.900" : "gray.500"}
                    />
                  </Select.Trigger>
                  <Select.Content>
                    {projectCollection.items.map((option) => (
                      <Select.Item key={option.value} item={option}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </HStack>

              <Separator orientation="vertical" h="6" />

              <HStack gap="2">
                <Icon as={LuCalendar} color="gray.500" />
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                  size="sm"
                  w="150px"
                  variant="outline"
                  placeholder="Start date"
                />
                <Text color="gray.400" fontSize="sm">
                  to
                </Text>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                  size="sm"
                  w="150px"
                  variant="outline"
                  placeholder="End date"
                />
              </HStack>
            </HStack>

            {hasActiveFilters && (
              <HStack gap="2">
                {selectedProject && (
                  <Badge
                    colorPalette="blue"
                    variant="subtle"
                    px="2"
                    py="1"
                    borderRadius="full"
                  >
                    <HStack gap="1">
                      <Text fontSize="xs">{selectedProjectName}</Text>
                      <Icon
                        as={IoClose}
                        cursor="pointer"
                        onClick={() => setSelectedProject("")}
                        _hover={{ color: "blue.700" }}
                      />
                    </HStack>
                  </Badge>
                )}
                {(dateRange.start || dateRange.end) && (
                  <Badge
                    colorPalette="blue"
                    variant="subtle"
                    px="2"
                    py="1"
                    borderRadius="full"
                  >
                    <HStack gap="1">
                      <Text fontSize="xs">
                        {dateRange.start && dateRange.end
                          ? `${new Date(dateRange.start).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )} - ${new Date(dateRange.end).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}`
                          : dateRange.start
                          ? `From ${new Date(
                              dateRange.start
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}`
                          : `Until ${new Date(dateRange.end).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}`}
                      </Text>
                      <Icon
                        as={IoClose}
                        cursor="pointer"
                        onClick={() => setDateRange({ start: "", end: "" })}
                        _hover={{ color: "blue.700" }}
                      />
                    </HStack>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedProject("");
                    setDateRange({ start: "", end: "" });
                  }}
                  color="gray.600"
                  _hover={{ bg: "gray.100", color: "gray.900" }}
                >
                  Clear all
                </Button>
              </HStack>
            )}
          </Flex>
        </Card.Body>
      </Card.Root>
      <Flex gap="4" overflowX="auto" pb="4">
        {STATUS_COLUMNS.map((status) => (
          <KanbanColumn
            key={status.id}
            status={status}
            tasks={tasksByStatus[status.id] || []}
          />
        ))}
      </Flex>
    </Box>
  );
};

export default KanbanBoard;
