import Link from "next/link";
import { notFound } from "next/navigation";
import CheckoutForm, { type BillingInterval } from "./CheckoutForm";

const planDetails = {
  monthly: {
    label: "Premium Monthly",
    price: "$5",
    period: "per month",
    billingSummary: "$5 billed monthly",
  },
  annual: {
    label: "Premium Annual",
    price: "$55",
    period: "per year",
    billingSummary: "$55 billed once per year",
  },
} satisfies Record<
  BillingInterval,
  { label: string; price: string; period: string; billingSummary: string }
>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;
  if (plan !== "monthly" && plan !== "annual") {
    notFound();
  }

  const selectedPlan = planDetails[plan];

  return (
    <main className="checkout-page">
      <header className="checkout-page__header">
        <Link href="/pricing" className="pricing-page__back">
          Back to plans
        </Link>
        <h1>Complete your subscription</h1>
        <p>Enter your billing details to continue.</p>
      </header>
      <div className="checkout-page__layout">
        <section className="checkout-page__summary" aria-labelledby="order-summary">
          <h2 id="order-summary">Your plan</h2>
          <p className="checkout-page__plan-name">{selectedPlan.label}</p>
          <p className="checkout-page__price">
            {selectedPlan.price} <span>{selectedPlan.period}</span>
          </p>
          <p>{selectedPlan.billingSummary}</p>
          <p className="checkout-page__demo-note">
            Demo only. No payment information is collected and no charge will be made.
          </p>
        </section>
        <CheckoutForm interval={plan} plan={selectedPlan} />
      </div>
    </main>
  );
}
