import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@lib/firebase";
import AuthLayout from "@components/Auth/AuthLayout/AuthLayout";
import AuthField from "@components/Auth/AuthField/AuthField";
import { styles } from "./styles";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (error: any) {
      const code = error?.code || "";
      if (code.includes("user-not-found")) {
        setErr("No account found with that email.");
      } else if (code.includes("invalid-email")) {
        setErr("Please enter a valid email address.");
      } else {
        setErr("We couldn’t send the reset link. Please try again later.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Recover your network presence easily"
      footer={
        <span>
          Back to{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </span>
      }
    >
      {sent ? (
        <div style={styles.notice}>
          If an account exists for <b>{email}</b>, a reset link has been sent.
        </div>
      ) : (
        <form style={styles.form} onSubmit={onSubmit}>
          <AuthField
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
          {err && <div style={styles.error}>{err}</div>}
          <button style={styles.primaryBtn} disabled={submitting} type="submit">
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
