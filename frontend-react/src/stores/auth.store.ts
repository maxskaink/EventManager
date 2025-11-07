import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import StorageKeys from './storage-keys';

// Definimos la interfaz para los datos del usuario
type User = API.User

// Definimos el estado y las acciones del store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  // Usamos el middleware 'persist' para guardar el estado en localStorage
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setUser: (user) => set({ user }),

      login: (user, token) => {
        localStorage.setItem(StorageKeys.API_TOKEN, token);
        set({
          user,
          token,
          isAuthenticated: true,
        })
      },

      logout: () => {
        localStorage.removeItem(StorageKeys.API_TOKEN)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        // Redirigir al login después de cerrar sesión
        window.location.href = '/login';
      },
    }),
    {
      // Nombre de la clave en localStorage
      name: 'auth-storage',
    }
  )
);
