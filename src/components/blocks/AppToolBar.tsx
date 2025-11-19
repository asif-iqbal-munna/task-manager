"use client";
import { Avatar, Box, Flex, Menu, Portal } from "@chakra-ui/react";
import React from "react";
import { ColorModeButton } from "../ui/color-mode";
import Image from "next/image";
import Link from "next/link";
import { useLogout } from "../../app/(auth)/_libs/apis/authApi";
import { useRouter } from "next/navigation";

const AppToolBar = () => {
  const { logoutUser } = useLogout();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

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
        <Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger rounded="full" focusRing="outside">
            <Avatar.Root size="sm">
              <Avatar.Fallback name="John Doe" />
            </Avatar.Root>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item onClick={handleLogout} value="logout">
                  Logout
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Flex>
    </Flex>
  );
};

export default AppToolBar;
