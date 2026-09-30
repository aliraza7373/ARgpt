import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import { signIn } from "../data/authStore";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("credentials");
  const [channel, setChannel] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const destination = channel === "email"
    ? email.trim().toLowerCase()
    : phone.replace(/[^+\d]/g, "");

  const continueToVerification = (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setStep("verification");
    setPassword("");
  };

  const selectChannel = (nextChannel) => {
    setChannel(nextChannel);
    setCodeSent(false);
    setCode("");
    setError("");
    setNotice("");
  };

  const requestCode = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, destination }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not send your code.");
      setCodeSent(true);
      setNotice(`Verification code sent to ${destination}. It expires in 10 minutes.`);
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, destination, code }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not verify that code.");
      signIn(destination);
      navigate("/");
    } catch (verifyError) {
      setError(verifyError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      <Brand className="login-home-link" />
      <section className="login-card" aria-labelledby="login-title">
        <img className="login-mark" src="/nexus-mark.png" alt="" />
        <p className="login-eyebrow">YOUR AI WORKSPACE</p>
        <h1 id="login-title">{step === "credentials" ? "Welcome back." : "Verify it’s you."}</h1>
        <p className="login-description">
          {step === "credentials"
            ? "Enter your details, then choose where to receive a sign-in code."
            : "Choose email or text message for your one-time code."}
        </p>

        {step === "credentials" ? (
          <form className="login-form" onSubmit={continueToVerification}>
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button className="login-continue" type="submit">
              Continue
              <span aria-hidden="true">→</span>
            </button>
          </form>
        ) : (
          <>
            <div className="verification-options" role="group" aria-label="Choose where to get your code">
              <button
                className={`verification-option${channel === "email" ? " selected" : ""}`}
                type="button"
                aria-pressed={channel === "email"}
                onClick={() => selectChannel("email")}
              >
                <span className="verification-option-icon" aria-hidden="true">@</span>
                <span><strong>Email</strong><small>{email}</small></span>
              </button>
              <button
                className={`verification-option${channel === "phone" ? " selected" : ""}`}
                type="button"
                aria-pressed={channel === "phone"}
                onClick={() => selectChannel("phone")}
              >
                <span className="verification-option-icon" aria-hidden="true">SMS</span>
                <span><strong>Text message</strong><small>Send to a phone number</small></span>
              </button>
            </div>

            {channel === "phone" && (
              <label className="phone-field" htmlFor="login-phone">
                Phone number
                <input
                  id="login-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 555 123 4567"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                    setCodeSent(false);
                    setCode("");
                    setNotice("");
                    setError("");
                  }}
                  required
                />
                <small>Include your country code.</small>
              </label>
            )}

            {codeSent && (
              <form className="login-form code-form" onSubmit={verifyCode}>
                <label htmlFor="verification-code">Verification code</label>
                <input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                />
                <button className="login-continue" type="submit" disabled={busy || code.length !== 6}>
                  Verify and log in
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            )}

            <button className="send-code-button" type="button" onClick={requestCode} disabled={busy || !destination}>
              {busy ? "Please wait…" : codeSent ? "Resend code" : `Send code by ${channel === "email" ? "email" : "text"}`}
            </button>
            <button
              className="login-back-button"
              type="button"
              onClick={() => {
                setStep("credentials");
                setCodeSent(false);
                setCode("");
                setError("");
                setNotice("");
              }}
            >
              ← Change sign-in details
            </button>
          </>
        )}

        {notice && <p className="login-notice" role="status">{notice}</p>}
        {error && <p className="login-error" role="alert">{error}</p>}
        <p className="login-demo-note">
          Email and text codes confirm access to that contact. Password and account verification need an authentication service.
        </p>
      </section>
    </main>
  );
};

export default Login;
