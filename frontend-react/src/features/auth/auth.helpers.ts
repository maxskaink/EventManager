import { router } from "@/router/router";
import { useAuthStore } from "@/stores/auth.store";


export const logout = () => {
    useAuthStore.getState().logout();
    router.navigate("/login");
}