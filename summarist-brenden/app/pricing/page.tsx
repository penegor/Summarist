import Link from "next/link";

const features = [
  "Access to premium book summaries",
  "Listen and read across the collection",
  "Cancel your subscription at any time",
];

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <header className="pricing-page__header">
        <Link href="/settings" className="pricing-page__back">
          Back to settings
        </Link>
        <h1>Choose your Premium plan</h1>
        <p>Unlock the complete Summarist experience with one simple subscription.</p>
      </header>
      <section className="pricing-page__plans" aria-label="Premium billing options">
        <article className="pricing-page__plan">
          <h2>Premium Monthly</h2>
          <p className="pricing-page__price">
            $5 <span>/ month</span>
          </p>
          <p>Billed monthly. Cancel anytime.</p>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <Link className="btn pricing-page__choose-button" href="/checkout?plan=monthly">
            Choose monthly
          </Link>
        </article>
        <article className="pricing-page__plan pricing-page__plan--featured">
          <h2>Premium Annual</h2>
          <p className="pricing-page__price">
            $55 <span>/ year</span>
          </p>
          <p>One annual payment, equivalent to $4.58 per month.</p>
          <ul>
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <Link className="btn pricing-page__choose-button" href="/checkout?plan=annual">
            Choose annual
          </Link>
        </article>
      </section>
      <p className="pricing-page__notice" role="note">
        This is a demo checkout. You will not be charged.
      </p>
    </main>
  );
}
