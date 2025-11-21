import { Container, Grid } from "@chakra-ui/react";
import React from "react";
import { cookies } from "next/headers";
import ProjectHeader from "./ProjectHeader";
import ProjectCard from "./ProjectCard";
import { Prisma } from "../../../../../generated/prisma/client";
import "dotenv/config";
export const PROJECT_TAG = "projects";

type ProjectWithTeams = Prisma.ProjectGetPayload<{
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

async function getProjects() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/private/projects`,
    {
      next: { tags: [PROJECT_TAG] },
      headers: {
        Cookie: cookieHeader,
      },
    }
  );

  const data = await res.json();
  return data.data as ProjectWithTeams[];
}

export default async function ManageProjects() {
  const projects = await getProjects();

  console.dir({ projects }, { depth: null });
  return (
    <Container fluid p={0}>
      <ProjectHeader />
      <Grid py="4" templateColumns="repeat(3, 1fr)" gap="4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Grid>
    </Container>
  );
}
