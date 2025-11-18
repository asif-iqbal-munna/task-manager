import { Container, Flex, Card } from "@chakra-ui/react";
import React from "react";
import AuthenticationForm from "../_libs/views/AuthenticationForm";

const page = () => {
  return (
    <Container
      maxW="md"
      display="flex"
      justifyContent="center"
      alignItems="center"
      h="full"
    >
      <Flex justify="center" align="center" w="full">
        <Card.Root w="full">
          <Card.Header textAlign="center">
            <Card.Title>Create an account</Card.Title>
            <Card.Description>
              Enter your details to create an account
            </Card.Description>
          </Card.Header>
          <AuthenticationForm type="register" />
        </Card.Root>
      </Flex>
    </Container>
  );
};

export default page;
