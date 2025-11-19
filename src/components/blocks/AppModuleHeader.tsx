"use client";
import {
  Button,
  CloseButton,
  Drawer,
  Flex,
  Heading,
  Icon,
  Portal,
  Text,
} from "@chakra-ui/react";
import React, { createContext, useContext, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import { Dialog, Stack } from "@chakra-ui/react";
import { useMutationState, useQueryClient } from "@tanstack/react-query";

// Context to provide close function to children
interface DialogDrawerContextType {
  onClose: () => void;
  setMutationKey: (mutationKey: string) => void;
}

const DialogDrawerContext = createContext<DialogDrawerContextType | null>(null);

export const useDialogDrawer = () => {
  const context = useContext(DialogDrawerContext);
  if (!context) {
    throw new Error("useDialogDrawer must be used within ModuleHeader");
  }
  return context;
};

interface ModuleHeaderProps {
  title: string;
  description?: string;
  module?: string;
  type?: "dialog" | "drawer";
  render?: (
    formRef: React.RefObject<{ submit: () => void } | null>
  ) => React.ReactNode;
}

const AppModuleHeader = ({
  title,
  description,
  module,
  type = "dialog",
  render,
}: ModuleHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mutationKey, setMutationKey] = useState<string>("");
  const formRef = useRef<{ submit: () => void }>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const mutationStates = useMutationState({
    filters: { mutationKey: [mutationKey] },
  });

  const isPending = mutationStates.some((state) => state.status === "pending");
  console.log({ mutationStates, isPending, mutationKey });

  const handleSubmit = () => {
    formRef.current?.submit();
  };

  const drawerContent = (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
      size={"lg"}
    >
      <Drawer.Trigger asChild>
        <Button variant="solid" colorScheme="primary" size="sm">
          <Icon as={MdAdd} />
          Add {module}
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{"Add/Edit " + module}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <DialogDrawerContext.Provider
                value={{ onClose: handleClose, setMutationKey: setMutationKey }}
              >
                {render && render(formRef)}
              </DialogDrawerContext.Provider>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.ActionTrigger asChild>
                <Button loading={isPending} variant="outline">
                  Close
                </Button>
              </Drawer.ActionTrigger>
              <Button
                loading={isPending}
                loadingText="Saving..."
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );

  const dialogContent = (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => setIsOpen(details.open)}
    >
      <Dialog.Trigger asChild>
        <Button variant="solid" colorScheme="primary" size="sm">
          <Icon as={MdAdd} />
          Add {module}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{"Add/Edit " + module}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">
                <DialogDrawerContext.Provider
                  value={{
                    onClose: handleClose,
                    setMutationKey: setMutationKey,
                  }}
                >
                  {render && render(formRef)}
                </DialogDrawerContext.Provider>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button loading={isPending} variant="outline">
                  Close
                </Button>
              </Dialog.ActionTrigger>
              <Button
                loading={isPending}
                loadingText="Saving..."
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );

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
        {type === "drawer" ? drawerContent : dialogContent}
      </Flex>
    </>
  );
};

export default AppModuleHeader;
