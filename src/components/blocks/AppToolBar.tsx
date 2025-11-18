import { Box, Flex, Heading, HStack, Stack } from "@chakra-ui/react";
import React from "react";
import { ColorModeButton } from "../ui/color-mode";
import Image from "next/image";
import Link from "next/link";

const AppToolBar = () => {
  return (
    <Flex
      h="20"
      w="full"
      borderBottom={"1px solid"}
      borderColor="border"
      align="center"
      justify="space-between"
    >
      <Box pl="4">
        <Link href="/">
          <Image src="/img/logo.png" alt="logo" width="100" height="100" />
        </Link>
      </Box>
      <Flex pr="4" align="center" gap="2">
        <ColorModeButton />
      </Flex>
    </Flex>
  );
};

export default AppToolBar;
