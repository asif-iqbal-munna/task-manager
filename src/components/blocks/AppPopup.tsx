import React, { useState, useRef, createContext, useContext } from "react";
import { useMutationState } from "@tanstack/react-query";
import { Drawer } from "@chakra-ui/react";
import { Portal } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { MdAdd } from "react-icons/md";
import { Dialog, Stack, CloseButton } from "@chakra-ui/react";

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

interface AppPopupProps {
  isEdit?: boolean;
  renderEditButton?: () => React.ReactNode;
  render?: (
    formRef: React.RefObject<{ submit: () => void } | null>
  ) => React.ReactNode;
  module?: string;
  type?: "dialog" | "drawer";
}
const AppPopup = ({
  isEdit,
  renderEditButton,
  render,
  module,
  type,
}: AppPopupProps) => {
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
        {isEdit ? (
          renderEditButton && renderEditButton()
        ) : (
          <Button variant="solid" colorScheme="primary" size="sm">
            <Icon as={MdAdd} />
            Add {module}
          </Button>
        )}
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
        {isEdit ? (
          renderEditButton && renderEditButton()
        ) : (
          <Button variant="solid" colorScheme="primary" size="sm">
            <Icon as={MdAdd} />
            Add {module}
          </Button>
        )}
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

  return type === "drawer" ? drawerContent : dialogContent;
};

export default AppPopup;
