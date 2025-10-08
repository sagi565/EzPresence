import React from "react";
import { useAuth } from "@auth/AuthProvider";

export const UserBadge: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {user.photoURL && <img src={user.photoURL} alt="avatar" width={28} height={28} style={{ borderRadius: "50%" }} />}
      <span>{user.displayName || user.email}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
