"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import Image from "next/image";
import google from "../../public/google.png";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  redirectTo = "/for-you",
}: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // If modal is closed, render nothing
  if (!isOpen) return null;

  const runAuthAction = async (action: () => Promise<unknown>) => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await action();
      onClose();
      router.push(redirectTo);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = email.trim();

    await runAuthAction(() =>
      isSignUp
        ? createUserWithEmailAndPassword(auth, normalizedEmail, password)
        : signInWithEmailAndPassword(auth, normalizedEmail, password),
    );
  };

  const handlePasswordReset = async () => {
    const normalizedEmail = email.trim();
    setErrorMessage("");
    setSuccessMessage("");

    if (!normalizedEmail) {
      setErrorMessage("Enter your email address first.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, normalizedEmail);
      setSuccessMessage("Password reset email sent.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to send a reset email. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth__wrapper">
      <div className="auth">
        <div className="auth__content">
          <div className="auth__title">
            {isSignUp ? "Create your Summarist account" : "Log in to Summarist"}
          </div>
          {errorMessage && <div className="auth__error" role="alert">{errorMessage}</div>}
          {successMessage && <div className="auth__success" role="status">{successMessage}</div>}
          <button
            type="button"
            className="btn guest__btn--wrapper"
            onClick={() => void runAuthAction(() => signInAnonymously(auth))}
            disabled={isSubmitting}
          >
            <figure className="google__icon--mask guest__icon--mask">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 448 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
              </svg>
            </figure>
            <div>Login as a Guest</div>
          </button>
          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>
          <button
            type="button"
            className="btn google__btn--wrapper"
            onClick={() =>
              void runAuthAction(() =>
                signInWithPopup(auth, new GoogleAuthProvider()),
              )
            }
            disabled={isSubmitting}
          >
            <figure className="google__icon--mask">
              <Image src={google} alt="" />
            </figure>
            <div>Login with Google</div>
          </button>
          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>
          <form onSubmit={handleSubmit} className="auth__main--form">
            <input
              type="email"
              className="auth__main--input"
              placeholder="Email Address"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="auth__main--input"
              placeholder="Password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button className="btn" type="submit" disabled={isSubmitting}>
              <span>
                {isSubmitting
                  ? "Please wait..."
                  : isSignUp
                    ? "Create account"
                    : "Login"}
              </span>
            </button>
          </form>
        </div>
        {!isSignUp && (
          <button
            type="button"
            className="auth__forgot--password"
            onClick={() => void handlePasswordReset()}
            disabled={isSubmitting}
          >
            Forgot your password?
          </button>
        )}
        <button
          type="button"
          className="auth__switch--btn"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setErrorMessage("");
            setSuccessMessage("");
          }}
          disabled={isSubmitting}
        >
          {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
        </button>
        <button
          type="button"
          className="auth__close--btn"
          onClick={onClose}
          aria-label="Close login modal"
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
