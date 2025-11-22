"use client";
import React from "react";
import { Box, Card, Flex, Text, Grid, HStack } from "@chakra-ui/react";
import { useGetProjects } from "./projects/_libs/apis/projectApi";
import { useGetTasks } from "./tasks/_libs/apis/taskApi";
import { useGetMembers } from "./members/_libs/apis/memberApi";
import { useGetTaskLogs } from "./task-logs/_libs/apis/taskLogApi";
import { Member } from "../../generated/prisma/client";
import { Task } from "../../generated/prisma/client";
import { TaskLog } from "../../generated/prisma/client";
import ProjectCard, {
  ProjectWithTeams,
} from "./projects/_libs/views/ProjectCard";
import Link from "next/link";
import { formatDate } from "../../lib/formatDate";

const Dashboard = () => {
  const { projects, isLoading: projectsLoading } = useGetProjects();
  const { tasks, isLoading: tasksLoading } = useGetTasks();
  const { members, isLoading: membersLoading } = useGetMembers();
  const { taskLogs, isLoading: taskLogsLoading } = useGetTaskLogs();

  const totalProjects = React.useMemo(() => {
    const projectsData = projects?.data || [];
    return Array.isArray(projectsData) ? projectsData.length : 0;
  }, [projects?.data]);

  const totalTasks = React.useMemo(() => {
    const tasksData = tasks?.data || [];
    return Array.isArray(tasksData) ? tasksData.length : 0;
  }, [tasks?.data]);

  const recentTasksByPriority = React.useMemo(() => {
    const tasksData = tasks?.data || [];
    if (!Array.isArray(tasksData) || tasksData.length === 0) return [];
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return tasksData
      .slice()
      .sort(
        (
          a: Task & { project?: { name: string } },
          b: Task & { project?: { name: string } }
        ) => {
          const priorityDiff =
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
          if (priorityDiff !== 0) return priorityDiff;
          return (
            new Date(b.updatedAt || b.createdAt || new Date(0)).getTime() -
            new Date(a.updatedAt || a.createdAt || new Date(0)).getTime()
          );
        }
      )
      .slice(0, 10);
  }, [tasks?.data]);

  const latestTaskLogs = React.useMemo(() => {
    const logsData = taskLogs?.data || [];
    if (!Array.isArray(logsData) || logsData.length === 0) return [];
    return logsData.slice(0, 10);
  }, [taskLogs?.data]);

  const recentProjects = React.useMemo(() => {
    const projectsData = projects?.data || [];
    if (!Array.isArray(projectsData) || projectsData.length === 0) return [];
    return projectsData
      .slice()
      .sort((a: ProjectWithTeams, b: ProjectWithTeams) => {
        const dateA = new Date(
          a.updatedAt || a.createdAt || new Date(0)
        ).getTime();
        const dateB = new Date(
          b.updatedAt || b.createdAt || new Date(0)
        ).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [projects?.data]);

  const teamSummary = React.useMemo(() => {
    const membersData = members?.data || [];
    if (!Array.isArray(membersData) || membersData.length === 0) return [];
    return membersData.map((member: Member & { tasks: Task[] }) => {
      const currentTasks = member.tasks?.length || 0;
      const capacity = member.capacity || 0;
      const isOverloaded = currentTasks > capacity;
      return {
        id: member.id,
        name: member.name,
        role: member.role,
        currentTasks,
        capacity,
        isOverloaded,
      };
    });
  }, [members?.data]);

  if (projectsLoading || tasksLoading || membersLoading || taskLogsLoading) {
    return (
      <Box p={4}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
        mb={6}
      >
        <Card.Root>
          <Card.Body>
            <Text fontSize="lg" fontWeight="semibold" mb={2}>
              Total Projects
            </Text>
            <Text fontSize="3xl" fontWeight="bold">
              {totalProjects}
            </Text>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body>
            <Text fontSize="lg" fontWeight="semibold" mb={2}>
              Total Tasks
            </Text>
            <Text fontSize="3xl" fontWeight="bold">
              {totalTasks}
            </Text>
          </Card.Body>
        </Card.Root>
      </Grid>

      <Box mb={6}>
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="semibold">
            Recent Projects
          </Text>
          <Link href="/projects">
            <Text fontSize="sm" color="blue.600" cursor="pointer">
              View All
            </Text>
          </Link>
        </Flex>
        {recentProjects.length === 0 ? (
          <Text color="fg.muted">No projects found</Text>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={4}
          >
            {recentProjects.map((project: ProjectWithTeams) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </Grid>
        )}
      </Box>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={4}
        mb={6}
      >
        <Card.Root>
          <Card.Header>
            <Card.Title>Team Summary</Card.Title>
          </Card.Header>
          <Card.Body>
            {teamSummary.length === 0 ? (
              <Text color="fg.muted">No team members found</Text>
            ) : (
              <Flex direction="column" gap={3}>
                {teamSummary.map((member) => (
                  <Box
                    key={member.id}
                    p={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={
                      member.isOverloaded ? "red.500" : "border.subtle"
                    }
                    bg={member.isOverloaded ? "red.50" : "bg"}
                  >
                    <HStack justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="semibold">{member.name}</Text>
                        <Text fontSize="sm" color="fg.muted">
                          {member.role}
                        </Text>
                      </Box>
                      <Text
                        fontSize="md"
                        fontWeight="medium"
                        color={member.isOverloaded ? "red.600" : "fg"}
                      >
                        {member.currentTasks} / {member.capacity}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </Flex>
            )}
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Recent Tasks</Card.Title>
          </Card.Header>
          <Card.Body>
            {recentTasksByPriority.length === 0 ? (
              <Text color="fg.muted">No tasks found</Text>
            ) : (
              <Flex direction="column" gap={2}>
                {recentTasksByPriority.map(
                  (task: Task & { project?: { name: string } }) => (
                    <Box
                      key={task.id}
                      p={2}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="border.subtle"
                    >
                      <Flex direction="column" gap={1}>
                        <Flex justify="space-between" align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            css={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {task.title}
                          </Text>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color={
                              task.priority === "HIGH"
                                ? "red.600"
                                : task.priority === "MEDIUM"
                                ? "yellow.600"
                                : "gray.600"
                            }
                          >
                            {task.priority}
                          </Text>
                        </Flex>
                        {task.project && (
                          <Text fontSize="xs" color="fg.muted">
                            {task.project.name}
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  )
                )}
              </Flex>
            )}
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Latest Task Logs</Card.Title>
          </Card.Header>
          <Card.Body>
            {latestTaskLogs.length === 0 ? (
              <Text color="fg.muted">No task logs found</Text>
            ) : (
              <Flex direction="column" gap={2}>
                {latestTaskLogs.map(
                  (log: TaskLog & { task?: { title: string } }) => (
                    <Box
                      key={log.id}
                      p={2}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="border.subtle"
                    >
                      <Flex direction="column" gap={1}>
                        <Text fontSize="xs" color="fg.muted">
                          {formatDate(log.createdAt)}
                        </Text>
                        <Text
                          fontSize="sm"
                          css={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {log.desc || "No description"}
                        </Text>
                        {log.task && (
                          <Text fontSize="xs" color="blue.600">
                            {log.task.title}
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  )
                )}
              </Flex>
            )}
          </Card.Body>
        </Card.Root>
      </Grid>
    </Box>
  );
};

export default Dashboard;
