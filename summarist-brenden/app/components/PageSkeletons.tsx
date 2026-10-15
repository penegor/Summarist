import type { ReactNode } from "react";

function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return <div aria-hidden="true" className={`page-skeleton__block ${className}`} />;
}

function LoadingStatus({ children }: { children: ReactNode }) {
  return (
    <span className="page-skeleton__sr-only" role="status">
      Loading {children}...
    </span>
  );
}

export function HomeSkeleton() {
  return (
    <main className="page-skeleton page-skeleton--home" aria-busy="true">
      <LoadingStatus>home page</LoadingStatus>
      <div className="page-skeleton__home-nav">
        <SkeletonBlock className="page-skeleton__logo" />
        <SkeletonBlock className="page-skeleton__nav-links" />
      </div>
      <section className="page-skeleton__home-hero">
        <div className="page-skeleton__home-copy">
          <SkeletonBlock className="page-skeleton__title page-skeleton__title--large" />
          <SkeletonBlock className="page-skeleton__text page-skeleton__text--wide" />
          <SkeletonBlock className="page-skeleton__text page-skeleton__text--medium" />
          <SkeletonBlock className="page-skeleton__button" />
        </div>
        <SkeletonBlock className="page-skeleton__hero-image" />
      </section>
      <section className="page-skeleton__home-section">
        <SkeletonBlock className="page-skeleton__title" />
        <div className="page-skeleton__feature-grid">
          {Array.from({ length: 3 }, (_, index) => (
            <div className="page-skeleton__feature" key={index}>
              <SkeletonBlock className="page-skeleton__icon" />
              <SkeletonBlock className="page-skeleton__text" />
              <SkeletonBlock className="page-skeleton__text page-skeleton__text--wide" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function SkeletonBookRow() {
  return (
    <div className="page-skeleton__book-row" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="page-skeleton__book-card" key={index}>
          <SkeletonBlock className="page-skeleton__book-cover" />
          <SkeletonBlock className="page-skeleton__text" />
          <SkeletonBlock className="page-skeleton__text page-skeleton__text--short" />
          <SkeletonBlock className="page-skeleton__text" />
        </div>
      ))}
    </div>
  );
}

export function ForYouSkeleton() {
  return (
    <main className="page-skeleton page-skeleton--dashboard" aria-busy="true">
      <LoadingStatus>your recommendations</LoadingStatus>
      <SkeletonBlock className="page-skeleton__search" />
      <SkeletonBlock className="page-skeleton__section-title" />
      <div className="page-skeleton__selected-book">
        <SkeletonBlock className="page-skeleton__selected-cover" />
        <div className="page-skeleton__selected-copy">
          <SkeletonBlock className="page-skeleton__title" />
          <SkeletonBlock className="page-skeleton__text page-skeleton__text--wide" />
          <SkeletonBlock className="page-skeleton__text page-skeleton__text--medium" />
        </div>
      </div>
      <SkeletonBlock className="page-skeleton__section-title" />
      <SkeletonBookRow />
      <SkeletonBlock className="page-skeleton__section-title" />
      <SkeletonBookRow />
    </main>
  );
}

export function BookSkeleton() {
  return (
    <main className="page-skeleton page-skeleton--dashboard" aria-busy="true">
      <LoadingStatus>book details</LoadingStatus>
      <SkeletonBlock className="page-skeleton__search" />
      <div className="page-skeleton__book-detail">
        <div className="page-skeleton__book-detail-copy">
          <SkeletonBlock className="page-skeleton__title page-skeleton__title--large" />
          <SkeletonBlock className="page-skeleton__text page-skeleton__text--medium" />
          <SkeletonBlock className="page-skeleton__text page-skeleton__text--wide" />
          <div className="page-skeleton__metadata">
            <SkeletonBlock className="page-skeleton__text" />
            <SkeletonBlock className="page-skeleton__text" />
            <SkeletonBlock className="page-skeleton__text" />
          </div>
          <div className="page-skeleton__actions">
            <SkeletonBlock className="page-skeleton__button" />
            <SkeletonBlock className="page-skeleton__button" />
          </div>
          <SkeletonBlock className="page-skeleton__title" />
          <SkeletonBlock className="page-skeleton__paragraph" />
          <SkeletonBlock className="page-skeleton__paragraph" />
          <SkeletonBlock className="page-skeleton__paragraph page-skeleton__paragraph--short" />
        </div>
        <SkeletonBlock className="page-skeleton__detail-cover" />
      </div>
    </main>
  );
}

export function PlayerSkeleton() {
  return (
    <main className="page-skeleton page-skeleton--dashboard" aria-busy="true">
      <LoadingStatus>book player</LoadingStatus>
      <SkeletonBlock className="page-skeleton__search" />
      <section className="page-skeleton__player">
        <div className="page-skeleton__player-header">
          <SkeletonBlock className="page-skeleton__player-cover" />
          <div className="page-skeleton__player-copy">
            <SkeletonBlock className="page-skeleton__title" />
            <SkeletonBlock className="page-skeleton__text page-skeleton__text--medium" />
          </div>
        </div>
        <SkeletonBlock className="page-skeleton__title" />
        <SkeletonBlock className="page-skeleton__paragraph" />
        <SkeletonBlock className="page-skeleton__paragraph" />
        <SkeletonBlock className="page-skeleton__paragraph" />
        <SkeletonBlock className="page-skeleton__audio-controls" />
      </section>
    </main>
  );
}

export function SettingsSkeleton() {
  return (
    <main className="page-skeleton page-skeleton--dashboard" aria-busy="true">
      <LoadingStatus>settings</LoadingStatus>
      <SkeletonBlock className="page-skeleton__search" />
      <SkeletonBlock className="page-skeleton__title page-skeleton__title--large" />
      <section className="page-skeleton__settings-card">
        <SkeletonBlock className="page-skeleton__title" />
        <SkeletonBlock className="page-skeleton__text page-skeleton__text--medium" />
        <SkeletonBlock className="page-skeleton__text page-skeleton__text--short" />
      </section>
      <section className="page-skeleton__settings-card">
        <SkeletonBlock className="page-skeleton__title" />
        <SkeletonBlock className="page-skeleton__text page-skeleton__text--medium" />
        <SkeletonBlock className="page-skeleton__button" />
      </section>
    </main>
  );
}

export function PricingSkeleton() {
  return (
    <main className="page-skeleton page-skeleton--pricing" aria-busy="true">
      <LoadingStatus>pricing options</LoadingStatus>
      <SkeletonBlock className="page-skeleton__text page-skeleton__text--short" />
      <SkeletonBlock className="page-skeleton__title page-skeleton__title--large" />
      <SkeletonBlock className="page-skeleton__text page-skeleton__text--wide page-skeleton__centered" />
      <div className="page-skeleton__pricing-grid">
        {Array.from({ length: 2 }, (_, index) => (
          <section className="page-skeleton__pricing-card" key={index}>
            <SkeletonBlock className="page-skeleton__title" />
            <SkeletonBlock className="page-skeleton__price" />
            <SkeletonBlock className="page-skeleton__text page-skeleton__text--wide" />
            {Array.from({ length: 3 }, (_, featureIndex) => (
              <SkeletonBlock
                className="page-skeleton__text"
                key={featureIndex}
              />
            ))}
            <SkeletonBlock className="page-skeleton__button" />
          </section>
        ))}
      </div>
    </main>
  );
}

export function CheckoutSkeleton() {
  return (
    <main className="page-skeleton page-skeleton--checkout" aria-busy="true">
      <LoadingStatus>checkout</LoadingStatus>
      <SkeletonBlock className="page-skeleton__text page-skeleton__text--short" />
      <SkeletonBlock className="page-skeleton__title page-skeleton__title--large" />
      <SkeletonBlock className="page-skeleton__text page-skeleton__text--wide page-skeleton__centered" />
      <div className="page-skeleton__checkout-layout">
        <section className="page-skeleton__checkout-card">
          <SkeletonBlock className="page-skeleton__title" />
          <SkeletonBlock className="page-skeleton__text page-skeleton__text--wide" />
          <SkeletonBlock className="page-skeleton__price" />
          <SkeletonBlock className="page-skeleton__text" />
          <SkeletonBlock className="page-skeleton__paragraph" />
        </section>
        <section className="page-skeleton__checkout-card">
          <SkeletonBlock className="page-skeleton__title" />
          <div className="page-skeleton__form-grid">
            {Array.from({ length: 8 }, (_, index) => (
              <SkeletonBlock
                className={index === 2 ? "page-skeleton__input page-skeleton__input--wide" : "page-skeleton__input"}
                key={index}
              />
            ))}
          </div>
          <SkeletonBlock className="page-skeleton__button" />
        </section>
      </div>
    </main>
  );
}
