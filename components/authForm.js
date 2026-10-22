
'use client';

import Link from "next/link";
import { useActionState } from "react";

import "./authForm.css";
import { auth } from "@/actions/authAction";

export default function AuthForm({ mode }) {
  const [state, formAction] = useActionState(
    auth.bind(null, mode),
    {}
  );

  return (
    <main className="auth-page">
      <div className="auth-glow" />

      <form id="auth-form" action={formAction} className="auth-card">
        <div className="auth-logo">
          <img src="/images/auth-icon.jpg" alt="Lock icon" />
        </div>

        <h1>{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Sign in to continue your journey."
            : "Join us and get started today."}
        </p>

        <div className="auth-field">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>

        {state.errors && (
          <ul className="form-error">
            {state.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        <button type="submit" className="auth-button">
          {mode === "login" ? "Login" : "Create Account"}
        </button>

        <p className="auth-switch">
          {mode === "login" ? (
            <>
              New here?{" "}
              <Link href="/auth?mode=signup">Create an account</Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/auth?mode=login">Login instead</Link>
            </>
          )}
        </p>
      </form>
    </main>
  );
}
