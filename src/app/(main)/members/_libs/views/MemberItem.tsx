import React from "react";
import { Member } from "../../../../../generated/prisma/client";
import { Button, Table } from "@chakra-ui/react";

const MemberItem = ({ member }: { member: Member }) => {
  return (
    <Table.Row key={member.id}>
      <Table.Cell>{member.name}</Table.Cell>
      <Table.Cell>{member.role}</Table.Cell>
      <Table.Cell>{member.capacity}</Table.Cell>
      <Table.Cell>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default MemberItem;
