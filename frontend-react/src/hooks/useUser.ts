import { useEffect } from "react";
import { useAuthStore } from "../stores/auth.store";
import { UserAPI } from "../services/api";

/**
 * This hook, mantains the user updated, and returns the user from the authStore
 */
const useUser = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  // only fetches the user one time
  useEffect(() => {
    async function fetchUser() {
      const res = await UserAPI.getUser();
      setUser(res.user);
    }
    fetchUser()
  }, [setUser]);
  return user;
};


export default useUser
