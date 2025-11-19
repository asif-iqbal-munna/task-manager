import { createListCollection, ListCollection, Select } from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Portal } from "@chakra-ui/react";

interface AppMultiSelectProps {
  options: ListCollection<{ label: string; value: string; data?: unknown }>;
  label: string;
  name: string;
}

const AppMultiSelect = ({ label, name, options }: AppMultiSelectProps) => {
  const { control } = useFormContext();

  const collection = createListCollection({ items: options });
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select.Root
          multiple
          collection={collection}
          size="md"
          value={Array.isArray(field.value) ? field.value : []}
          onValueChange={(details) => {
            field.onChange(details.value ?? []);
          }}
          onBlur={field.onBlur}
        >
          <Select.HiddenSelect />
          <Select.Label>Select {label}</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder={`Select ${label}`} />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content
                css={{
                  zIndex: 10000,
                }}
              >
                {collection.items.map((option) => (
                  <Select.Item item={option} key={option.value}>
                    {option.label as string}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      )}
    />
  );
};

export default AppMultiSelect;
