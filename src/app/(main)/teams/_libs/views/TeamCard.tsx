"use client";
import { Box, Card, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { Prisma } from "../../../../../generated/prisma/client";
import { LuUsers } from "react-icons/lu";
import { FaRegEdit } from "react-icons/fa";
import AppPopup from "../../../../../components/blocks/AppPopup";
import CreateUpdateTeamForm from "../forms/CreateUpdateTeamForm";

export type TeamWithCollaborations = Prisma.TeamGetPayload<{
  include: {
    teamCollaborations: {
      include: {
        member: true;
      };
    };
  };
}>;

const TeamCard = ({ team }: { team: TeamWithCollaborations }) => {
  return (
    <Card.Root>
      <Card.Body gap="4">
        <Flex align="center" gap="3" justify="space-between">
          <Card.Title mt="2">{team.name}</Card.Title>
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
            module="Team"
            render={(formRef) => (
              <CreateUpdateTeamForm
                isEdit={true}
                team={team}
                formRef={formRef}
              />
            )}
          />
        </Flex>
        <Flex direction="column" gap="2">
          <Flex align="center" gap="3">
            <Icon as={LuUsers} />
            <Text>
              {team?.teamCollaborations.length} Member
              {team?.teamCollaborations.length > 1 ? "s" : ""}
            </Text>
          </Flex>
          <Box as="ul" pl="4" listStyleType="circle">
            {team?.teamCollaborations.map((member) => (
              <li key={member.id}>{member.member.name}</li>
            ))}
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

export default TeamCard;
