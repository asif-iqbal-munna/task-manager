"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Box, Flex, Spinner, Portal } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useGetProjects } from "../../../projects/_libs/apis/projectApi";
import { useGetTasks } from "../apis/taskApi";
import { useGetMembers } from "../../../members/_libs/apis/memberApi";
import { useQueryClient, useIsMutating } from "@tanstack/react-query";
import KanbanColumn from "./KanbanColumn";
import KanbanFilters from "./KanbanFilters";
import { STATUS_COLUMNS } from "./constants";
import { TaskWithRelations } from "./types";
import { UPDATE_TASK_MUTATION_KEY } from "../apis/taskApi";

const KanbanBoard = () => {
  const searchParams = useSearchParams();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  useEffect(() => {
    const projectId = searchParams.get("project_id");
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { projects = [] } = useGetProjects();
  const { members = [] } = useGetMembers();
  const { tasks: tasksData, isLoading: isLoadingTasks } = useGetTasks({
    project_id: selectedProject || undefined,
    member_id:
      selectedMember === "unassigned"
        ? "unassigned"
        : selectedMember || undefined,
    start_date: dateRange.start || undefined,
    end_date: dateRange.end || undefined,
    search: debouncedSearchQuery || undefined,
  });

  const isMutating = useIsMutating({
    mutationKey: [UPDATE_TASK_MUTATION_KEY],
  });

  const isLoading = isLoadingTasks || isMutating > 0;

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

  const memberOptions = [
    { label: "All", value: "" },
    { label: "Unassigned", value: "unassigned" },
    ...(members.data?.map((member: { id: string; name: string }) => ({
      label: member.name,
      value: member.id,
    })) || []),
  ];

  const selectedProjectName = projects.data?.find(
    (p: { id: string }) => p.id === selectedProject
  )?.name;

  const selectedMemberName =
    selectedMember === "unassigned"
      ? "Unassigned"
      : members.data?.find((m: { id: string }) => m.id === selectedMember)
          ?.name;

  return (
    <Box position="relative">
      {isLoading && (
        <Portal>
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.300"
            zIndex={9999}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              bg="bg"
              p="6"
              borderRadius="lg"
              boxShadow="xl"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="3"
            >
              <Spinner size="lg" color="blue.500" />
              <Box fontSize="sm" color="fg.muted">
                {isLoadingTasks ? "Loading tasks..." : "Updating task..."}
              </Box>
            </Box>
          </Box>
        </Portal>
      )}
      <KanbanFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        selectedMember={selectedMember}
        onMemberChange={setSelectedMember}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        projectOptions={projectOptions}
        memberOptions={memberOptions}
        selectedProjectName={selectedProjectName}
        selectedMemberName={selectedMemberName}
      />
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
