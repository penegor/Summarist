"use client";

import { onAuthStateChanged, getIdTokenResult, type User } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AuthModal from "../components/AuthModal";
import SearchBar from "../components/SearchBar";
import { auth } from "../firebase";
import loginImage from "../../public/login.png";

type Plan = "basic" | "premium" | "premium-plus";

type AccountState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in"; user: User; plan: Plan }
  | { status: "error"; message: string };

function getPlanFromClaims(claims: Record<string, unknown>): Plan {
  const claim = claims.subscriptionTier ?? claims.plan ?? claims.subscription;
  if (typeof claim !== "string") {
    return "basic";
  }

  const normalizedPlan = claim.toLowerCase().replaceAll("_", "-");
  if (normalizedPlan === "premium-plus") {
    return "premium-plus";
  }
  if (normalizedPlan === "premium") {
    return "premium";
  }
  return "basic";
}

export default function SettingsPage() {
  const [accountState, setAccountState] = useState<AccountState>({
    status: "loading",
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!isActive) return;

        if (!user) {
          setAccountState({ status: "signed-out" });
          return;
        }

        try {
          const tokenResult = await getIdTokenResult(user);
          if (isActive && auth.currentUser?.uid === user.uid) {
            setAccountState({
              status: "signed-in",
              user,
              plan: getPlanFromClaims(tokenResult.claims),
            });
          }
        } catch (error) {
          if (isActive && auth.currentUser?.uid === user.uid) {
            setAccountState({
              status: "error",
              message:
                error instanceof Error
                  ? error.message
                  : "Unable to load your account details.",
            });
          }
        }
      },
      (error) => {
        if (isActive) {
          setAccountState({ status: "error", message: error.message });
        }
      },
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  return (
    <>
      <SearchBar />
      <section className="settings-page">
        <h1 className="settings-page__title">Settings</h1>
        {accountState.status === "loading" ? (
          <p role="status">Loading account details...</p>
        ) : accountState.status === "error" ? (
          <p className="settings-page__error" role="alert">
            {accountState.message}
          </p>
        ) : accountState.status === "signed-out" ? (
          <div className="settings-page__signed-out">
            <Image
              className="settings-page__login-image"
              src={loginImage}
              alt=""
              width={320}
              height={320}
            />
            <h2>Log in to view your account</h2>
            <p>Sign in to see your email and subscription plan.</p>
            <button
              className="btn settings-page__login-button"
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
          </div>
        ) : (
          <div className="settings-page__account">
            <section className="settings-page__section">
              <h2>Account</h2>
              <p className="settings-page__email-label">Email</p>
              <p className="settings-page__email">
                {accountState.user.email ?? "Guest account"}
              </p>
            </section>
            <section className="settings-page__section">
              <h2>Subscription</h2>
              <p className="settings-page__plan">
                Plan: <strong>{accountState.plan}</strong>
              </p>
              {accountState.plan === "basic" && (
                <Link className="btn settings-page__upgrade-button" href="/pricing">
                  Upgrade
                </Link>
              )}
            </section>
          </div>
        )}
      </section>
      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        redirectTo="/settings"
      />
    </>
  );
}
