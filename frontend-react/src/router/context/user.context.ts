import { createContext } from "react-router";

export const userContext = createContext<API.User | null>(null)
