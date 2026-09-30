import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AccountControl from "../components/AccountControl";
import Brand from "../components/Brand";
import { getPlan } from "../data/plans";

const Checkout = () => {
  const { planId } = useParams();
  const plan = getPlan(planId);
  const [priceInfo, setPriceInfo] = useState({ priceLabel: "Loading price…" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/billing/plans")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load plan pricing.");
        const planPrice = result.plans.find((item) => item.id === planId);
        if (active) setPriceInfo(planPrice || { priceLabel: "Price shown in Stripe checkout" });
      })
      .catch(() => {
        if (active) setPriceInfo({ priceLabel: "Price shown in Stripe checkout" });
      });
    return () => { active = false; };
  }, [planId]);

  const startCheckout = async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not start secure checkout.");
      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError.message);
      setBusy(false);
    }
  };

  return (
    <div className="checkout-page">
      <header className="plans-topbar">
        <Brand to="/plans" className="plans-brand" />
        <AccountControl />
      </header>

      <main className="checkout-content">
        <Link className="checkout-back" to="/plans">← Back to plans</Link>
        {plan ? (
          <section className="checkout-card">
            <div className="checkout-lock" aria-hidden="true">
              <svg viewBox="0 0 24 24"><rect x="4.5" y="10" width="15" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
            </div>
            <p className="plans-eyebrow">SECURE CHECKOUT</p>
            <h1>Continue with {plan.name}</h1>
            <p className="checkout-summary">{plan.description}</p>
            <div className="checkout-plan-row">
              <div>
                <strong>{plan.name} plan</strong>
                <span>Subscription billing managed by Stripe</span>
              </div>
              {plan.id === "free" ? (
                <span className="checkout-price">Free</span>
              ) : (
                <span className="checkout-pricing">
                  {priceInfo.originalPriceLabel && <del>{priceInfo.originalPriceLabel}</del>}
                  <strong>{priceInfo.priceLabel}</strong>
                  {priceInfo.discountPercent && <em>{priceInfo.discountPercent}% off</em>}
                </span>
              )}
            </div>
            <p className="checkout-security-note">
              You’ll enter your payment details on Stripe’s secure checkout page. This app never receives or stores your card number.
            </p>
            {error && <p className="billing-error" role="alert">{error}</p>}
            <button className="checkout-button" type="button" onClick={startCheckout} disabled={busy || plan.id === "free"}>
              {busy ? "Opening secure checkout…" : "Continue to secure payment"}
              <span aria-hidden="true">→</span>
            </button>
            <p className="checkout-cancel-note">You can review the price and cancel before paying.</p>
          </section>
        ) : (
          <section className="checkout-card">
            <h1>Plan not found</h1>
            <p className="checkout-summary">Choose a plan to continue.</p>
            <Link className="plan-choose" to="/plans">View plans</Link>
          </section>
        )}
      </main>
    </div>
  );
};

export default Checkout;
