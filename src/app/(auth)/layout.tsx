import { Container, Flex } from "@chakra-ui/react";
import AppToolBar from "../../components/blocks/AppToolBar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      <AppToolBar />
      <Container fluid centerContent padding={0} flex="1" overflow="auto">
        {children}
      </Container>
    </Flex>
  );
}
