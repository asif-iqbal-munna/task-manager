import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Field } from "@chakra-ui/react";
import { PasswordInput } from "../ui/password-input";

interface AppPasswordInputProps {
  label: string;
  name: string;
  required?: boolean;
  helperText?: string;
}

const AppPasswordInput = ({
  label,
  name,
  required,
  helperText,
}: AppPasswordInputProps) => {
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
          <PasswordInput {...field} value={field.value ?? ""} />
          {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
          {errors[name] && (
            <Field.ErrorText>{errors[name]?.message as string}</Field.ErrorText>
          )}
        </Field.Root>
      )}
    />
  );
};

export default AppPasswordInput;
