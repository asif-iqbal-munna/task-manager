import { Container, Grid } from "@chakra-ui/react";
import React from "react";
import { cookies } from "next/headers";
import TeamHeader from "./TeamHeader";
import TeamCard from "./TeamCard";
import { Team } from "../../../../../generated/prisma/client";

export const TEAM_TAG = "teams";

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
  return data.data as Team[];
}

export default async function ManageTeams() {
  const teams = await getTeams();
  console.log({ teams });
  return (
    <Container fluid p={0}>
      <TeamHeader />
      <Grid py="4" templateColumns="repeat(3, 1fr)" gap="4">
        {teams.map((team: Team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </Grid>
    </Container>
  );
}
