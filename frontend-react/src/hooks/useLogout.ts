import { AuthAPI } from "../services/api"
import { useAuthStore } from "../stores/auth.store"

/**
 * Este hook es usado para cerrar sesion de forma controlada
 */
const useLogout = () => {
  const store_logout = useAuthStore(s => s.logout)

  const logout = async () => {
    try {
      await AuthAPI.logout()
      store_logout();
      return true;
    } catch (err) {
      console.log(err)
      return false
    }
  }
  return { logout }
}

export default useLogout
