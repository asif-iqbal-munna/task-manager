import { cookies } from "next/headers";
import React from "react";
import { Member } from "../../../../../generated/prisma/client";
import { Box, Container, Table } from "@chakra-ui/react";
import MemberHeader from "./MemberHeader";
import MemberItem from "./MemberItem";
import "dotenv/config";

export const MEMBER_TAG = "member";

async function getMembers() {
  const cookieStore = await cookies();

  // Format cookies as Cookie header string
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/private/members`,
    {
      next: { tags: [MEMBER_TAG] },
      headers: {
        Cookie: cookieHeader,
      },
    }
  );

  const data = await res.json();
  return data.data as Member[];
}

const ManageMembers = async () => {
  const members = await getMembers();
  console.log({ members });
  return (
    <Container fluid p={0}>
      <MemberHeader />
      <Box py="4">
        <Table.Root size="lg" variant="outline" interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Role</Table.ColumnHeader>
              <Table.ColumnHeader>Workload</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {members.map((member: Member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Container>
  );
};

export default ManageMembers;
