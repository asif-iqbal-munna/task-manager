import React from "react";
import { Member, Task } from "../../../../../generated/prisma/client";
import MemberActions from "./MemberActions";
import { Table } from "@chakra-ui/react";

const MemberItem = ({ member }: { member: Member & { tasks: Task[] } }) => {
  return (
    <Table.Row key={member.id}>
      <Table.Cell>{member.name}</Table.Cell>
      <Table.Cell>{member.role}</Table.Cell>
      <Table.Cell>
        {member.tasks.length}/{member.capacity}
      </Table.Cell>
      <Table.Cell>
        <MemberActions member={member} />
      </Table.Cell>
    </Table.Row>
  );
};

export default MemberItem;
