"use client";

import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

type AccessState = "loading" | "subscribed" | "not-subscribed" | "error";

function hasPremiumAccess(claims: Record<string, unknown>): boolean {
  const value = claims.subscriptionTier ?? claims.plan ?? claims.subscription;
  if (typeof value !== "string") {
    return false;
  }

  const plan = value.toLowerCase().replaceAll("_", "-");
  return plan === "premium" || plan === "premium-plus";
}

export default function BookActions({
  bookId,
  isPremium,
  hasAudio,
}: {
  bookId: string;
  isPremium: boolean;
  hasAudio: boolean;
}) {
  const [accessState, setAccessState] = useState<AccessState>(
    isPremium ? "loading" : "subscribed",
  );

  useEffect(() => {
    if (!isPremium) {
      return;
    }

    let isActive = true;
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!isActive) return;
        if (!user) {
          setAccessState("not-subscribed");
          return;
        }

        try {
          const token = await getIdTokenResult(user);
          if (isActive && auth.currentUser?.uid === user.uid) {
            setAccessState(
              hasPremiumAccess(token.claims) ? "subscribed" : "not-subscribed",
            );
          }
        } catch {
          if (isActive && auth.currentUser?.uid === user.uid) {
            setAccessState("error");
          }
        }
      },
      () => {
        if (isActive) {
          setAccessState("error");
        }
      },
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [isPremium]);

  if (!isPremium || accessState === "subscribed") {
    return (
      <div className="inner-book__read--btn-wrapper">
        <Link className="inner-book__read--btn" href={`/player/${bookId}`}>
          Read
        </Link>
        {hasAudio && (
          <Link className="inner-book__read--btn" href={`/player/${bookId}`}>
            Listen
          </Link>
        )}
      </div>
    );
  }

  if (accessState === "error") {
    return (
      <p className="settings-page__error" role="alert">
        Unable to verify your subscription. Please try again.
      </p>
    );
  }

  if (accessState === "loading") {
    return (
      <p role="status" aria-live="polite">
        Checking your subscription...
      </p>
    );
  }

  return (
    <div className="inner-book__read--btn-wrapper">
      <Link className="inner-book__read--btn" href="/pricing">
        Read
      </Link>
      {hasAudio && (
        <Link className="inner-book__read--btn" href="/pricing">
          Listen
        </Link>
      )}
    </div>
  );
}
