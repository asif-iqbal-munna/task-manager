"use client";
import { Box, Card, Flex, Icon, Text, Progress } from "@chakra-ui/react";
import React from "react";
import { Prisma } from "../../../../../generated/prisma/client";
import { LuUsers } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import AppPopup from "../../../../../components/blocks/AppPopup";
import CreateUpdateProjectForm from "../forms/CreateUpdateProjectForm";
import Link from "next/link";

export type ProjectWithTeams = Prisma.ProjectGetPayload<{
  include: {
    teamProjects: {
      include: {
        team: {
          include: {
            teamCollaborations: {
              include: {
                member: true;
              };
            };
          };
        };
      };
    };
    tasks: true;
  };
}>;

const ProjectCard = ({ project }: { project: ProjectWithTeams }) => {
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const allTeamMembers = new Set<string>();
  project.teamProjects.forEach((teamProject) => {
    teamProject.team.teamCollaborations.forEach((collab) => {
      allTeamMembers.add(collab.member.id);
    });
  });
  const teamMembersCount = allTeamMembers.size;

  return (
    <Card.Root>
      <Card.Body gap="4">
        <Flex align="center" gap="3" justify="space-between">
          <Card.Title mt="2">{project.name}</Card.Title>
          <AppPopup
            isEdit={true}
            renderEditButton={() => (
              <Icon
                as={FaRegEdit}
                size="md"
                cursor="pointer"
                color="gray.400"
              />
            )}
            module="Project"
            render={(formRef) => (
              <CreateUpdateProjectForm
                isEdit={true}
                project={project}
                formRef={formRef}
              />
            )}
          />
        </Flex>
        <Text color="gray.600" fontSize="sm">
          {project.desc}
        </Text>
        <Flex direction="column" gap="2">
          <Flex direction="column" gap="1">
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="medium">
                Progress
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {Math.round(progress)}%
              </Text>
            </Flex>
            <Progress.Root value={progress} size="sm" colorPalette="blue">
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </Flex>
          <Flex align="center" gap="3">
            <Icon as={LuUsers} />
            <Text fontSize="sm">
              {teamMembersCount} Member{teamMembersCount !== 1 ? "s" : ""}
            </Text>
          </Flex>
        </Flex>
        <Flex justify="flex-end">
          <Link href={`/projects/${project.id}`}>
            <Text fontSize="sm" color="blue.600" cursor="pointer">
              View →
            </Text>
          </Link>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

export default ProjectCard;
