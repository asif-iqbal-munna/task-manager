"use client";

import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { MdDashboard, MdCategory } from "react-icons/md";
import { FaTasks, FaRegFolder, FaUser } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { IconType } from "react-icons";

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
  matchType?: "exact" | "startsWith";
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: MdDashboard, matchType: "exact" },
  {
    href: "/projects",
    label: "Projects",
    icon: FaRegFolder,
    matchType: "exact",
  },
  { href: "/tasks", label: "Tasks", icon: FaTasks, matchType: "exact" },
  { href: "/teams", label: "Teams", icon: HiUserGroup, matchType: "exact" },
  { href: "/members", label: "Members", icon: FaUser, matchType: "exact" },
  {
    href: "/task-category",
    label: "Category",
    icon: MdCategory,
    matchType: "exact",
  },
];

const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (item: NavItem): boolean => {
    if (item.matchType === "exact") {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };
  return (
    <Flex
      direction="column"
      h="100%"
      w={isOpen ? "200px" : "80px"}
      transition="width 0.3s ease-in-out"
      borderRight="1px solid"
      borderColor="border"
    >
      <Box flex={1} p={4}>
        <Flex direction="column" gap={8}>
          <Flex
            transition="all 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
            justify={isOpen ? "end" : "center"}
            align="center"
          >
            <Icon
              fontSize="2xl"
              as={!isOpen ? GoSidebarCollapse : GoSidebarExpand}
              cursor="pointer"
              transition="all 0.9s cubic-bezier(0.4, 0, 0.2, 1)"
              _hover={{
                transform: isOpen ? "scale(1.1)" : "scale(1.1)",
              }}
              onClick={toggleSidebar}
            />
          </Flex>
          <Box flex={1}>
            <Flex direction="column" gap={4}>
              {navItems.map((item) => {
                const active = isActive(item);
                return (
                  <Link key={item.href} href={item.href}>
                    <Flex
                      align="center"
                      gap={2}
                      p={2}
                      rounded="md"
                      bg={active ? "gray.200" : "transparent"}
                      _hover={{
                        bg: "gray.100",
                      }}
                      transition="background-color 0.2s ease-in-out"
                    >
                      <Icon fontSize="2xl" as={item.icon} />
                      <Text
                        opacity={isOpen ? 1 : 0}
                        maxW={isOpen ? "200px" : "0px"}
                        overflow="hidden"
                        whiteSpace="nowrap"
                        transition="opacity 0.3s ease-in-out, max-width 0.3s ease-in-out"
                      >
                        {item.label}
                      </Text>
                    </Flex>
                  </Link>
                );
              })}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default AppSidebar;
