import { createListCollection, Icon, Select } from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Portal } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { FaInfoCircle } from "react-icons/fa";
import { Tooltip } from "../ui/tooltip";

interface AppSelectProps {
  options: { label: string; value: string }[];
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  labelInfo?: boolean;
  infoText?: string;
  onSelect?: (value: string) => void;
}

const AppSelect = ({
  label,
  name,
  options,
  placeholder,
  required,
  helperText,
  labelInfo = false,
  infoText = "",
  onSelect,
}: AppSelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const collection = createListCollection({ items: options });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field.Root required={required} invalid={!!errors[name]}>
          <Field.Label>
            {label} {required && <Field.RequiredIndicator />}
            {labelInfo && (
              <Tooltip content={infoText} interactive>
                <Icon as={FaInfoCircle} />
              </Tooltip>
            )}
          </Field.Label>
          <Select.Root
            collection={collection}
            size="md"
            value={field.value ? [field.value] : []}
            onValueChange={(details) => {
              const selectedValue = details.value?.[0];
              field.onChange(selectedValue || (required ? "" : null));
              if (onSelect) {
                onSelect(selectedValue);
              }
            }}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText
                  placeholder={placeholder || `Select ${label}`}
                />
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
          {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
          {errors[name] && (
            <Field.ErrorText>{errors[name]?.message as string}</Field.ErrorText>
          )}
        </Field.Root>
      )}
    />
  );
};

export default AppSelect;
