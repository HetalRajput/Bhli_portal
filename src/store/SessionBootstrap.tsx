"use client";

import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { hydrateSession } from "./sessionSlice";

export default function SessionBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sync = () => {
      const token = window.localStorage.getItem("access_token");
      const authValue = window.localStorage.getItem("bhli-auth");
      let email: string | null = null;
      let profileImage: string | null = null;
      try { email = JSON.parse(authValue || "{}").email || null; } catch { /* Ignore invalid legacy data. */ }
      try { profileImage = JSON.parse(window.localStorage.getItem("bhli-profile-details") || "{}").profileImage || null; } catch { /* Ignore invalid legacy data. */ }
      dispatch(hydrateSession({ isAuthenticated: Boolean(token || authValue), email, profileImage }));
    };
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [dispatch]);

  return null;
}
