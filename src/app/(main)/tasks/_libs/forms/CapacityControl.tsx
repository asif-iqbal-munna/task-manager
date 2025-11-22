import React from "react";
import {
  Dialog,
  Portal,
  Stack,
  Text,
  Button,
  Flex,
  NativeSelect,
} from "@chakra-ui/react";

const CapacityControl = ({
  isOpen,
  onClose,
  memberOptions,
  setValue,
  fromCard = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  memberOptions: { label: string; value: string }[];
  setValue: (name: string, value: string) => void;
  fromCard?: boolean;
}) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={() => onClose()}
      closeOnInteractOutside={false}
      onEscapeKeyDown={(e) => e.preventDefault()}
      modal={false}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content className="bg-warning-50">
            <Dialog.Header>
              <Dialog.Title>Member Capacity Reached</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body pb="4">
              <Stack gap="4">
                <Text>
                  The member capacity has been reached for the selected member.
                </Text>
                <Flex gap="2" align="center">
                  <NativeSelect.Root
                    size="sm"
                    width="240px"
                    onChange={(event) => {
                      const target = event.target as HTMLSelectElement;
                      setValue("assigned_member_id", target.value);
                      if (!fromCard) {
                        onClose();
                      }
                    }}
                  >
                    <NativeSelect.Field placeholder="Select another member">
                      {memberOptions.map(
                        (member: { label: string; value: string }) => (
                          <option key={member.value} value={member.value}>
                            {member.label}
                          </option>
                        )
                      )}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  or{" "}
                  <Button
                    onClick={() => onClose()}
                    variant="plain"
                    className="underline"
                  >
                    Assign Anyway
                  </Button>
                </Flex>
              </Stack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CapacityControl;
