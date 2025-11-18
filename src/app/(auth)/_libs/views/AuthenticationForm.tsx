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
  const form = useForm<z.infer<typeof registerValidationSchema>>({
    resolver: zodResolver(registerValidationSchema),
  });

  const onSubmit = async (
    data: z.infer<typeof registerValidationSchema>
  ): Promise<void> => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const user = await response.json();
      console.log({ user });
    } catch (error) {
      console.error(error);
    }
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
                  name="name"
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
