import { createContext } from "react";

import { type UserType } from "../Types/type";

export interface AuthContextType {
  isLoggedIn: boolean;

  token: string | null;

  setToken: React.Dispatch<React.SetStateAction<string | null>>;

  user: UserType | null;

  role: string | null;

  login: (token: string, userData: UserType) => void;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,

  token: null,

  setToken: (() => null) as React.Dispatch<React.SetStateAction<string | null>>,

  user: null,

  role: null,

  login: () => {},

  logout: () => {},
});
