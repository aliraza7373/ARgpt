import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AccountControl from "../components/AccountControl";
import Brand from "../components/Brand";
import { plans } from "../data/plans";

const Plans = () => {
  const [prices, setPrices] = useState({});
  const [priceError, setPriceError] = useState("");
  const [searchParams] = useSearchParams();
  const checkoutResult = searchParams.get("checkout");
  const sessionId = searchParams.get("session_id");
  const [paymentStatus, setPaymentStatus] = useState("checking");

  useEffect(() => {
    let active = true;
    fetch("/api/billing/plans")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load plan pricing.");
        if (active) {
          setPrices(Object.fromEntries(result.plans.map((plan) => [plan.id, plan])));
        }
      })
      .catch((error) => {
        if (active) setPriceError(error.message);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (checkoutResult !== "success" || !sessionId) return;
    let active = true;
    fetch(`/api/billing/checkout-status?session_id=${encodeURIComponent(sessionId)}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not confirm checkout status.");
        if (active) setPaymentStatus(result.paid ? "paid" : "pending");
      })
      .catch(() => {
        if (active) setPaymentStatus("unavailable");
      });
    return () => { active = false; };
  }, [checkoutResult, sessionId]);

  return (
    <div className="plans-page">
      <header className="plans-topbar">
        <Brand className="plans-brand" />
        <AccountControl />
      </header>

      <main className="plans-content">
        {checkoutResult === "success" && (
          <div className={`billing-banner ${paymentStatus}`} role="status">
            {paymentStatus === "checking" && "Checking your payment status…"}
            {paymentStatus === "paid" && "Payment confirmed. Thank you for choosing a plan."}
            {paymentStatus === "pending" && "Checkout is complete; payment is still processing."}
            {paymentStatus === "unavailable" && "We couldn’t confirm this payment. Contact support before trying again."}
          </div>
        )}
        {checkoutResult === "cancelled" && (
          <div className="billing-banner pending" role="status">Checkout was canceled. You have not been charged.</div>
        )}

        <section className="plans-intro">
          <p className="plans-eyebrow">SIMPLE PLANS</p>
          <h1>Choose how you want to work.</h1>
          <p>Start free, then choose a plan that fits your work.</p>
        </section>

        {priceError && <p className="billing-error" role="alert">{priceError}</p>}

        <section className="plan-grid" aria-label="Available plans">
          {plans.map((plan) => (
            <article className={`plan-card${plan.featured ? " featured" : ""}`} key={plan.id}>
              {plan.featured && <span className="plan-popular">RECOMMENDED</span>}
              <p className="plan-name">{plan.name}</p>
              <p className="plan-tagline">{plan.tagline}</p>
              <p className="plan-price">
                {plan.id === "free" ? (
                  <strong>Free</strong>
                ) : (
                  <>
                    <span className="plan-price-current">
                      <strong>{prices[plan.id]?.priceLabel || "Loading price…"}</strong>
                      <span className="plan-discount">{plan.discountPercent}% off</span>
                    </span>
                    <del className="plan-price-original">
                      {prices[plan.id]?.originalPriceLabel || ""}
                    </del>
                  </>
                )}
              </p>
              <p className="plan-description">{plan.description}</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              {plan.id === "free" ? (
                <Link className="plan-choose secondary" to="/">Continue with Free</Link>
              ) : (
                <Link className="plan-choose" to={`/checkout/${plan.id}`}>Choose {plan.name}</Link>
              )}
            </article>
          ))}
        </section>

        <p className="plans-footnote">
          Plus and Pro are billed monthly at the discounted price shown. Secure billing is handled by Stripe.
        </p>
      </main>
    </div>
  );
};

export default Plans;
