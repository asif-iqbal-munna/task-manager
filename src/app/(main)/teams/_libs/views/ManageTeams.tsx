import { Container, Grid } from "@chakra-ui/react";
import React from "react";
import { cookies } from "next/headers";
import TeamHeader from "./TeamHeader";
import TeamCard from "./TeamCard";
import { Prisma } from "../../../../../generated/prisma/client";
import "dotenv/config";

export const TEAM_TAG = "teams";

type TeamWithCollaborations = Prisma.TeamGetPayload<{
  include: {
    teamCollaborations: {
      include: {
        member: true;
      };
    };
  };
}>;

async function getTeams() {
  const cookieStore = await cookies();

  // Format cookies as Cookie header string
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/private/teams`,
    {
      next: { tags: [TEAM_TAG] }, // <-- tagging cache
      headers: {
        Cookie: cookieHeader,
      },
    }
  );

  const data = await res.json();
  return data.data as TeamWithCollaborations[];
}

export default async function ManageTeams() {
  const teams = await getTeams();

  return (
    <Container fluid p={0}>
      <TeamHeader />
      <Grid py="4" templateColumns="repeat(3, 1fr)" gap="4">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </Grid>
    </Container>
  );
}
