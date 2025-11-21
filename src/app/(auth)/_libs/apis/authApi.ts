import { useMutation, useQuery } from "@tanstack/react-query";
import { requestHandler } from "../../../../lib/requestHandler";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "../views/authValidationSchema";
import z from "zod";
import { toaster } from "../../../../components/ui/toaster";

export const useRegister = () => {
  const { mutateAsync: registerUser, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof registerValidationSchema>) => {
      const response = await requestHandler("/api/auth/register", "POST", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      return response;
    },
    onSuccess: (data) => {
      if (data) {
        toaster.success({
          title: "Data created successfully",
        });
      }
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { registerUser, isPending };
};

export const useLogin = () => {
  const { mutateAsync: loginUser, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof loginValidationSchema>) => {
      const response = await requestHandler("/api/auth/login", "POST", {
        email: data.email,
        password: data.password,
      });
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Login successful",
        description: "You are now logged in",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { loginUser, isPending };
};

export const useLogout = () => {
  const { mutateAsync: logoutUser, isPending } = useMutation({
    mutationFn: async () => {
      const response = await requestHandler("/api/auth/logout", "POST");
      return response;
    },
    onSuccess: () => {
      toaster.success({
        title: "Logout successful",
        description: "You are now logged out",
      });
    },
    onError: (error) => {
      toaster.error({
        title: "Error",
        description: error.message,
      });
    },
  });
  return { logoutUser, isPending };
};

export const useGetUser = () => {
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await requestHandler("/api/private/user/me", "GET");
        return response?.data || null;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: true,
  });
  return { user: user ?? null, isPending };
};
