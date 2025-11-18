import { Box, Container, Flex, ScrollArea } from "@chakra-ui/react";
import React from "react";
import AppToolBar from "../../components/blocks/AppToolBar";
import AppSidebar from "../../components/blocks/AppSidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container
      fluid
      padding={0}
      h="100vh"
      display="flex"
      flexDirection="column"
    >
      <AppToolBar />
      <Flex flex={1} direction="row" overflow="hidden">
        <AppSidebar />
        <Box flex="1" p={4} overflow="auto">
          <ScrollArea.Root height="8.5rem" maxW="lg">
            <ScrollArea.Viewport>
              <ScrollArea.Content spaceY="4" textStyle="sm">
                {children}
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar>
              <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>
        </Box>
      </Flex>
    </Container>
  );
};

export default layout;
