import { Field, Textarea } from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface AppTextAreaProps {
  label: string;
  name: string;
  required?: boolean;
  helperText?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

const AppTextArea = ({
  label,
  name,
  required,
  helperText,
  placeholder,
  rows = 4,
  maxLength,
}: AppTextAreaProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Field.Root required={required} invalid={!!errors[name]}>
            <Field.Label>
              {label} {required && <Field.RequiredIndicator />}
            </Field.Label>
            <Textarea
              placeholder={placeholder}
              rows={rows}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              maxLength={maxLength}
            />
            {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
            {errors[name] && (
              <Field.ErrorText>
                {errors[name]?.message as string}
              </Field.ErrorText>
            )}
          </Field.Root>
        );
      }}
    />
  );
};

export default AppTextArea;
