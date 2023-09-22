import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [token, setToken] = useState(false);
  const [userID, setUserID] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const login = useCallback((uid, token, isAdmin, expirationDate) => {
    setToken(token);
    setUserID(uid);
    setIsAdmin(isAdmin);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userID: uid,
        token: token,
        isAdmin: isAdmin,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserID(null);
    setIsAdmin(false);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      !storedData.isAdmin &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userID,
        storedData.token,
        storedData.isAdmin,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userID, isAdmin };
};
