import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export const LoginPanel: React.FC = () => {
  const { signInEmail, signUpEmail, signInGoogle, signInFacebook, signInApple, loading } = useAuth();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 360 }}>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => signInEmail(email, password)}>Sign in with Email</button>
      <button onClick={() => signUpEmail(email, password)}>Sign up (Email)</button>
      <hr />
      <button onClick={signInGoogle}>Continue with Google</button>
      <button onClick={signInFacebook}>Continue with Facebook</button>
      <button onClick={signInApple}>Continue with Apple</button>
    </div>
  );
};
