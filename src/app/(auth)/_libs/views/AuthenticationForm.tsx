"use client";

import { Button, Card, Flex, Stack, Text } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";
import AppTextInput from "../../../../components/inputs/AppTextInput";
import AppPasswordInput from "../../../../components/inputs/AppPasswordInput";
import Link from "next/link";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "./authValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const AuthenticationForm = ({
  type = "login",
}: {
  type?: "login" | "register";
}) => {
  const validationSchema =
    type === "login" ? loginValidationSchema : registerValidationSchema;
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = (data: z.infer<typeof validationSchema>) => {
    console.log({ data });
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card.Body>
            <Stack gap="8" align="flex-start" maxW="sm">
              {type === "register" && (
                <AppTextInput
                  label="Full Name"
                  name="fullName"
                  placeholder="John Doe"
                  required
                />
              )}

              <AppTextInput
                label="Email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                required
              />

              {type === "login" ? (
                <AppPasswordInput label="Password" name="password" required />
              ) : (
                <Flex gap="2">
                  <AppPasswordInput
                    label="Password"
                    name="password"
                    required
                    helperText="Must be at least 8 characters"
                  />
                  <AppPasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    required
                  />
                </Flex>
              )}
            </Stack>
          </Card.Body>
          <Card.Footer flexDirection="column" gap="6">
            <Button type="submit" w="full" variant="solid">
              {type === "login" ? "Login" : "Create Account"}
            </Button>
            {type === "login" ? (
              <Text
                textStyle="xs"
                className="tracking-widest text-muted-foreground"
              >
                Don&apos;t have an account?{" "}
                <Link href="/register">
                  <span className="underline">Register</span>
                </Link>
              </Text>
            ) : (
              <Text
                textStyle="xs"
                className="tracking-widest text-muted-foreground"
              >
                Already have an account?{" "}
                <Link href="/login">
                  <span className="underline">Login</span>
                </Link>
              </Text>
            )}
          </Card.Footer>
        </form>
      </FormProvider>
    </>
  );
};

export default AuthenticationForm;
