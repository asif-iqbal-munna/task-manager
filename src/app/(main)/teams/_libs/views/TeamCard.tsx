import { Card } from "@chakra-ui/react";
import React from "react";
import { Avatar, Button } from "@chakra-ui/react";
import { Team } from "../../../../../generated/prisma/client";

const TeamCard = ({ team }: { team: Team }) => {
  return (
    <Card.Root>
      <Card.Body gap="2">
        <Card.Title mt="2">{team.name}</Card.Title>
        <Card.Description>
          This is the card body. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Curabitur nec odio vel dui euismod fermentum.
          Curabitur nec odio vel dui euismod fermentum.
        </Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">Add Member</Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default TeamCard;
