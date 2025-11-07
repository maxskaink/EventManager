import { redirect, type MiddlewareFunction } from "react-router";
import { UserAPI } from "../../services/api";
import { userContext } from "../context/user.context";
import { useAuthStore } from "../../stores/auth.store";

export const authMiddleware: MiddlewareFunction = async ({ context }) => {
  UserAPI.getUser()
    .then((data) => {
      context.set(userContext, data.user);
      useAuthStore.getState().setUser(data.user);
    })
    .catch(() => {
      throw redirect("/login");
    });
};
