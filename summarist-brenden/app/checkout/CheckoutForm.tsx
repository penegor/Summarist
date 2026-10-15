"use client";

import { useState, type FormEvent } from "react";

export type BillingInterval = "monthly" | "annual";

type CheckoutPlan = {
  label: string;
  price: string;
  period: string;
  billingSummary: string;
};

export default function CheckoutForm({
  interval,
  plan,
}: {
  interval: BillingInterval;
  plan: CheckoutPlan;
}) {
  const [isComplete, setIsComplete] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <section className="checkout-page__success" role="status">
        <h2>You&apos;re all set!</h2>
        <p>
          Your mock checkout for {plan.label} is complete. No payment was collected.
        </p>
        <a className="btn pricing-page__choose-button" href="/settings">
          Go to settings
        </a>
      </section>
    );
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <h2>Billing details</h2>
      <div className="checkout-form__fields">
        <label>
          Full name
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="checkout-form__field--full">
          Billing address
          <input
            name="address"
            type="text"
            autoComplete="street-address"
            required
          />
        </label>
        <label>
          City
          <input name="city" type="text" autoComplete="address-level2" required />
        </label>
        <label>
          State / Province
          <input
            name="region"
            type="text"
            autoComplete="address-level1"
            required
          />
        </label>
        <label>
          Postal code
          <input
            name="postalCode"
            type="text"
            autoComplete="postal-code"
            required
          />
        </label>
        <label>
          Country
          <input
            name="country"
            type="text"
            autoComplete="country-name"
            required
          />
        </label>
      </div>
      <button className="btn pricing-page__choose-button" type="submit">
        Continue with {interval === "monthly" ? "monthly" : "annual"} plan
      </button>
    </form>
  );
}
