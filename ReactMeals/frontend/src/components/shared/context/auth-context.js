import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  userID: null,
  isAdmin: false,
  login: () => {},
  logout: () => {},
});
