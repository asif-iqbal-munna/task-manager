"use client";
import { Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import AppPopup from "./AppPopup";

interface ModuleHeaderProps {
  title: string;
  description?: string;
  module?: string;
  type?: "dialog" | "drawer";
  render?: (
    formRef: React.RefObject<{ submit: () => void } | null>
  ) => React.ReactNode;
  isEdit?: boolean;
  renderEditButton?: () => React.ReactNode;
}

const AppModuleHeader = ({
  title,
  description,
  module,
  type = "dialog",
  render,
  isEdit = false,
  renderEditButton,
}: ModuleHeaderProps) => {
  return (
    <>
      <Flex
        className="sticky top-0 z-10 bg-white"
        justify="space-between"
        align="center"
        p="4"
        borderBottom="1px solid"
        borderColor="gray.200"
        _dark={{
          borderColor: "gray.700",
          bg: "gray.900",
        }}
        _light={{
          borderColor: "gray.200",
          bg: "white",
        }}
        gap="4"
      >
        <Flex direction="column" justify="center" align="start" gap="2">
          <Heading as="h1" fontSize="2xl" fontWeight="bold">
            {title}
          </Heading>
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>
        </Flex>
        <AppPopup
          isEdit={isEdit}
          renderEditButton={renderEditButton}
          render={render}
          module={module}
          type={type}
        />
      </Flex>
    </>
  );
};

export default AppModuleHeader;
