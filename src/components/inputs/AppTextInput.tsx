import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Field, Input } from "@chakra-ui/react";

interface AppInputProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  type?: string;
}

const AppTextInput = ({
  label,
  name,
  placeholder,
  required,
  helperText,
  type = "text",
}: AppInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field.Root required={required} invalid={!!errors[name]}>
          <Field.Label>
            {label} {required && <Field.RequiredIndicator />}
          </Field.Label>
          <Input
            type={type}
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={(e) =>
              field.onChange(
                type === "number" ? Number(e.target.value) : e.target.value
              )
            }
          />
          {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
          {errors[name] && (
            <Field.ErrorText>{errors[name]?.message as string}</Field.ErrorText>
          )}
        </Field.Root>
      )}
    />
  );
};

export default AppTextInput;
