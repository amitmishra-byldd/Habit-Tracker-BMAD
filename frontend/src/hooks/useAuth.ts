import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useRegister() {
  return useMutation(
    async (body: { username: string; email: string; password: string }) => {
      const { data } = await axios.post("/api/auth/register", body);
      return data;
    },
  );
}

export function useLogin() {
  return useMutation(async (body: { email: string; password: string }) => {
    const { data } = await axios.post("/api/auth/login", body);
    return data;
  });
}
